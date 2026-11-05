import fs from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const rel = (...parts) => path.join(...parts);
const abs = (filePath) => path.join(rootDir, filePath);
const failures = [];

const assert = (condition, message) => {
  if (!condition) failures.push(message);
};

const fileExists = async (filePath) => {
  try {
    await fs.access(abs(filePath));
    return true;
  } catch {
    return false;
  }
};

const read = (filePath) => fs.readFile(abs(filePath), 'utf8');

const getSiteUrl = async () => {
  const envText = await read('.env.local').catch(() => '');
  const envMatch = envText.match(/^NEXT_PUBLIC_SITE_URL=(.+)$/m);
  const rawUrl = process.env.NEXT_PUBLIC_SITE_URL || envMatch?.[1] || 'https://conrad-express.vercel.app';
  return rawUrl.trim().replace(/^['"]|['"]$/g, '').replace(/\/+$/, '');
};

const htmlPath = 'index.html';
const html = await read(htmlPath);
const siteUrl = await getSiteUrl();

assert(html.includes('Content-Security-Policy'), 'Missing Content-Security-Policy meta tag.');
assert(html.includes('strict-origin-when-cross-origin'), 'Missing strict referrer policy.');
assert(html.includes('SEO-META-BEGIN'), 'Missing generated SEO metadata block.');
assert(html.includes('name="description"'), 'Missing SEO description meta tag.');
assert(html.includes('property="og:image"'), 'Missing Open Graph image meta tag.');
assert(html.includes('name="twitter:card" content="summary_large_image"'), 'Missing Twitter card metadata.');
assert(html.includes('type="application/ld+json"'), 'Missing JSON-LD structured data.');
assert(html.includes('<link rel="icon" href="/favicon.svg" type="image/svg+xml">'), 'Missing crawlable favicon link.');
assert(!html.includes('unsafe-eval'), 'CSP must not include unsafe-eval.');
assert(!html.includes('@babel/standalone'), 'Runtime Babel must not be loaded.');
assert(!html.includes('type="text/babel"'), 'HTML must not use type="text/babel" scripts.');
assert(!html.includes('rel="icon" href="data:'), 'Favicon must not use an inline data URI.');
assert(!html.includes('react.development'), 'React development build must not be loaded.');
assert(!html.includes('react-dom.development'), 'ReactDOM development build must not be loaded.');

const normalizeLocalScriptSrc = (src) => src.split(/[?#]/, 1)[0];
const scriptSources = [...html.matchAll(/<script[^>]+src="([^"]+)"/g)].map((match) => match[1]);
const localScriptSources = scriptSources
  .filter((src) => !/^https?:\/\//.test(src))
  .map(normalizeLocalScriptSrc);
const expectedScriptOrder = [
  rel('src', 'data', 'config.js'),
  rel('src', 'data', 'copy.js'),
  rel('src', 'data', 'reviews.js'),
  rel('src', 'data', 'assets.js'),
  rel('src', 'data', 'policies.js'),
  rel('src', 'data', 'site-data.js'),
  rel('src', 'data', 'tweaks.js'),
  rel('dist', 'conrad-express.bundle.js'),
];

const expectedScriptStartIndex = localScriptSources.findIndex((_, index) =>
  expectedScriptOrder.every((src, offset) => localScriptSources[index + offset] === src)
);

assert(
  expectedScriptStartIndex !== -1,
  `Local script load order changed. Expected contiguous sequence: ${expectedScriptOrder.join(', ')}`
);

await Promise.all(localScriptSources.map(async (src) => {
  assert(await fileExists(src), `Missing local script referenced by HTML: ${src}`);
}));

const bundlePath = rel('dist', 'conrad-express.bundle.js');
const bundleStat = await fs.stat(abs(bundlePath)).catch(() => null);
assert(Boolean(bundleStat), `Missing generated bundle: ${bundlePath}`);
assert(!bundleStat || bundleStat.size > 1024, `Generated bundle looks too small: ${bundlePath}`);

const sitemap = await read('sitemap.xml').catch(() => '');
const robots = await read('robots.txt').catch(() => '');
const expectedRobotsRule = siteUrl.includes('vercel.app') ? 'Disallow: /' : 'Allow: /';
assert(sitemap.includes('<urlset'), 'Missing or invalid sitemap.xml.');
assert(sitemap.includes(`<loc>${siteUrl}/</loc>`), 'Sitemap home URL does not match NEXT_PUBLIC_SITE_URL.');
assert(robots.includes('User-agent: *'), 'Missing robots.txt user-agent rule.');
assert(robots.includes(expectedRobotsRule), 'robots.txt index rule does not match NEXT_PUBLIC_SITE_URL.');
assert(robots.includes(`Sitemap: ${siteUrl}/sitemap.xml`), 'robots.txt sitemap URL does not match NEXT_PUBLIC_SITE_URL.');
assert(await fileExists('og-image.jpg'), 'Missing root OG image: og-image.jpg');
assert(await fileExists('favicon.svg'), 'Missing root favicon: favicon.svg');

const dataContext = { window: {} };
for (const dataPath of expectedScriptOrder.slice(0, -1)) {
  const code = await read(dataPath);
  vm.runInNewContext(code, dataContext, { filename: dataPath });
}

const data = dataContext.window.CONRAD_EXPRESS_DATA;
assert(Boolean(data), 'window.CONRAD_EXPRESS_DATA was not created.');
assert(Boolean(data?.SITE_CONFIG), 'SITE_CONFIG is missing from aggregated data.');
assert(Boolean(data?.COPY?.en && data?.COPY?.th), 'Bilingual copy must include both en and th.');
assert(
  Array.isArray(data?.REVIEW_CARDS?.en) && data.REVIEW_CARDS.en.length > 0 &&
    Array.isArray(data?.REVIEW_CARDS?.th) && data.REVIEW_CARDS.th.length > 0,
  'Bilingual review cards are missing.'
);
assert(Array.isArray(data?.REVIEW_PHOTOS), 'Review photo registry is missing.');
assert(
  Array.isArray(data?.POLICIES?.order) && data.POLICIES.order.length === 3 &&
    data.POLICIES.order.every((id) => Boolean(data.POLICIES.documents?.[id])),
  'Policy documents are missing.'
);
assert(Boolean(dataContext.window.TWEAK_DEFAULTS?.language), 'Tweak defaults were not loaded.');

// Analytics: loader must run before the app bundle, and the CSP must only allow
// Google tag hosts when a GTM container is configured.
const analyticsScript = rel('src', 'analytics.js');
const analyticsIndex = localScriptSources.indexOf(analyticsScript);
const bundleIndex = localScriptSources.indexOf(rel('dist', 'conrad-express.bundle.js'));
assert(analyticsIndex !== -1, `index.html must load ${analyticsScript}.`);
assert(analyticsIndex === -1 || analyticsIndex < bundleIndex, `${analyticsScript} must load before the app bundle.`);
assert(!/<script src="src\/analytics\.js[^>]*\s(defer|async)[\s>]/.test(html), `${analyticsScript} must load synchronously (no defer/async).`);

const gtmId = String(data?.SITE_CONFIG?.analytics?.gtmId || '').trim();
const stampedGtmId = html.match(/<script src="src\/analytics\.js[^"]*" data-gtm-id="([^"]*)">/)?.[1];
const cspContent = html.match(/<meta http-equiv="Content-Security-Policy" content="([^"]*)">/)?.[1] || '';
assert(stampedGtmId === gtmId, `index.html data-gtm-id (${stampedGtmId}) does not match SITE_CONFIG.analytics.gtmId (${gtmId}). Run npm run build.`);
assert(!gtmId || /^GTM-[A-Z0-9]{4,12}$/.test(gtmId), `Invalid GTM container ID: ${gtmId}`);
assert(
  gtmId ? cspContent.includes('https://www.googletagmanager.com') : !cspContent.includes('googletagmanager'),
  gtmId ? 'CSP must allow Google Tag Manager when gtmId is set.' : 'CSP must not allow Google tag hosts while gtmId is empty.'
);
assert(!cspContent.includes("script-src 'self' 'unsafe-inline'"), "CSP script-src must not include 'unsafe-inline'.");

const assetPaths = new Set([
  data?.SITE_CONFIG?.heroBackground,
  ...(data?.REVIEW_PHOTOS || []),
].filter(Boolean));

const sourceFiles = [];
const collectSourceFiles = async (dirPath) => {
  const entries = await fs.readdir(abs(dirPath), { withFileTypes: true }).catch(() => []);
  await Promise.all(entries.map(async (entry) => {
    const entryPath = rel(dirPath, entry.name);
    if (entry.isDirectory()) {
      await collectSourceFiles(entryPath);
    } else if (/\.(html|js|jsx|md)$/.test(entry.name)) {
      sourceFiles.push(entryPath);
    }
  }));
};

sourceFiles.push(htmlPath, 'tweaks-panel.jsx', 'README.md');
await collectSourceFiles('src');
await collectSourceFiles('scripts');

for (const sourceFile of sourceFiles) {
  const source = await read(sourceFile);
  for (const match of source.matchAll(/['"`](brand-images\/[^'"`\n]+)['"`]/g)) {
    assetPaths.add(match[1]);
  }
}

await Promise.all([...assetPaths].map(async (assetPath) => {
  assert(await fileExists(assetPath), `Missing asset referenced by site source: ${assetPath}`);
}));

if (failures.length) {
  console.error('Static site verification failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log('Static site verification passed.');
