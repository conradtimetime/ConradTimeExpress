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

const htmlPath = 'Conrad Express.html';
const html = await read(htmlPath);

assert(html.includes('Content-Security-Policy'), 'Missing Content-Security-Policy meta tag.');
assert(html.includes('strict-origin-when-cross-origin'), 'Missing strict referrer policy.');
assert(!html.includes('unsafe-eval'), 'CSP must not include unsafe-eval.');
assert(!html.includes('@babel/standalone'), 'Runtime Babel must not be loaded.');
assert(!html.includes('type="text/babel"'), 'HTML must not use type="text/babel" scripts.');
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
  rel('src', 'data', 'site-data.js'),
  rel('src', 'data', 'tweaks.js'),
  rel('dist', 'conrad-express.bundle.js'),
];

assert(
  expectedScriptOrder.every((src, index) => localScriptSources[index] === src),
  `Local script load order changed. Expected: ${expectedScriptOrder.join(', ')}`
);

await Promise.all(localScriptSources.map(async (src) => {
  assert(await fileExists(src), `Missing local script referenced by HTML: ${src}`);
}));

const bundlePath = rel('dist', 'conrad-express.bundle.js');
const bundleStat = await fs.stat(abs(bundlePath)).catch(() => null);
assert(Boolean(bundleStat), `Missing generated bundle: ${bundlePath}`);
assert(!bundleStat || bundleStat.size > 1024, `Generated bundle looks too small: ${bundlePath}`);

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
assert(Boolean(dataContext.window.TWEAK_DEFAULTS?.language), 'Tweak defaults were not loaded.');

const assetPaths = [
  data?.SITE_CONFIG?.heroBackground,
  ...(data?.REVIEW_PHOTOS || []),
].filter(Boolean);

await Promise.all(assetPaths.map(async (assetPath) => {
  assert(await fileExists(assetPath), `Missing asset referenced by data: ${assetPath}`);
}));

if (failures.length) {
  console.error('Static site verification failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log('Static site verification passed.');
