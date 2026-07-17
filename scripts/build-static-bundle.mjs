import { transformSync } from '@babel/core';
import jsxPlugin from '@babel/plugin-transform-react-jsx';
import { minify } from 'terser';
import { gzipSync } from 'node:zlib';
import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outFile = path.join(rootDir, 'dist', 'conrad-express.bundle.js');
const indexFile = path.join(rootDir, 'index.html');
const envFile = path.join(rootDir, '.env.local');

const SEO = {
  title: 'Conrad Express | ขนส่งสินค้ามูลค่าสูงแบบพรีเมียม ส่งทั่วไทย ภายในหนึ่งวัน เริ่มต้น 500 บาท',
  description: 'บริการส่งพัสดุมูลค่าสูงทั่วไทย เช่น นาฬิกาหรู จิวเวลรี่ งานศิลปะ ปลอดภัยถึงมือโดยมืออาชีพ ประสบการณ์กว่า 8 ปี ติดตามเรียลไทม์ พร้อมประกันชดเชยสูงสุด 50,000 บาท',
  siteName: 'Conrad Express',
  imagePath: '/og-image.jpg',
  imageAlt: 'Conrad Express luxury and high-value logistics',
};

const escapeHtml = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('"', '&quot;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;');

const normalizeSiteUrl = (url) => url.replace(/\/+$/, '');

const readLocalEnv = async () => {
  const localEnv = {};
  const envText = await fs.readFile(envFile, 'utf8').catch(() => '');

  for (const line of envText.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) continue;

    const [key, ...valueParts] = trimmed.split('=');
    const rawValue = valueParts.join('=').trim();
    localEnv[key.trim()] = rawValue.replace(/^['"]|['"]$/g, '');
  }

  return localEnv;
};

const getSiteUrl = async () => {
  const localEnv = await readLocalEnv();
  return normalizeSiteUrl(
    process.env.NEXT_PUBLIC_SITE_URL ||
    localEnv.NEXT_PUBLIC_SITE_URL ||
    'https://conrad-express.vercel.app'
  );
};

const renderSeoMeta = ({ siteUrl, organizationJson }) => {
  const homeUrl = `${siteUrl}/`;
  const ogImage = `${siteUrl}${SEO.imagePath}`;
  const robots = siteUrl.includes('vercel.app') ? 'noindex,nofollow' : 'index,follow';

  return `<!-- SEO-META-BEGIN -->
<title>${escapeHtml(SEO.title)}</title>
<meta name="description" content="${escapeHtml(SEO.description)}">
<meta name="robots" content="${robots}">
<link rel="canonical" href="${homeUrl}">
<meta property="og:type" content="website">
<meta property="og:title" content="${escapeHtml(SEO.title)}">
<meta property="og:description" content="${escapeHtml(SEO.description)}">
<meta property="og:url" content="${homeUrl}">
<meta property="og:site_name" content="${escapeHtml(SEO.siteName)}">
<meta property="og:image" content="${ogImage}">
<meta property="og:image:type" content="image/jpeg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${escapeHtml(SEO.imageAlt)}">
<meta property="og:locale" content="th_TH">
<meta property="og:locale:alternate" content="en_US">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${escapeHtml(SEO.title)}">
<meta name="twitter:description" content="${escapeHtml(SEO.description)}">
<meta name="twitter:image" content="${ogImage}">
<script type="application/ld+json">${organizationJson}</script>
<!-- SEO-META-END -->`;
};

const renderSitemap = (siteUrl) => {
  const today = new Date().toISOString().slice(0, 10);

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`;
};

const renderRobots = (siteUrl) => {
  const isLiveDomain = !siteUrl.includes('vercel.app');
  const rule = isLiveDomain ? 'Allow: /' : 'Disallow: /';

  return `User-agent: *
${rule}

Sitemap: ${siteUrl}/sitemap.xml
`;
};

const updateIndexSeo = async ({ siteUrl, organizationJson }) => {
  const html = await fs.readFile(indexFile, 'utf8');
  const seoMeta = renderSeoMeta({ siteUrl, organizationJson });
  const jsonLdHash = createHash('sha256').update(organizationJson).digest('base64');
  const csp = [
    "default-src 'self'",
    "base-uri 'none'",
    "object-src 'none'",
    "img-src 'self' data:",
    "font-src 'self'",
    "style-src 'self' 'unsafe-inline'",
    `script-src 'self' 'sha256-${jsonLdHash}'`,
    "connect-src 'self' https://script.google.com https://script.googleusercontent.com",
    "form-action 'self'",
  ].join('; ');

  const htmlWithLang = html.replace(/<html\s+lang="[^"]*">/, '<html lang="th">');
  const htmlWithCsp = htmlWithLang.replace(
    /<meta http-equiv="Content-Security-Policy" content="[^"]*">/,
    `<meta http-equiv="Content-Security-Policy" content="${csp}">`
  );

  const nextHtml = htmlWithCsp.includes('<!-- SEO-META-BEGIN -->')
    ? htmlWithCsp.replace(/<!-- SEO-META-BEGIN -->[\s\S]*?<!-- SEO-META-END -->/, seoMeta)
    : htmlWithCsp.replace(/<title>[\s\S]*?<\/title>/, seoMeta);

  await fs.writeFile(indexFile, nextHtml, 'utf8');
};

const writeSeoFiles = async (siteUrl) => {
  await Promise.all([
    fs.writeFile(path.join(rootDir, 'sitemap.xml'), renderSitemap(siteUrl), 'utf8'),
    fs.writeFile(path.join(rootDir, 'robots.txt'), renderRobots(siteUrl), 'utf8'),
  ]);
};

const jsxSources = [
  'tweaks-panel.jsx',
  'src/components/shared.jsx',
  'src/components/Nav.jsx',
  'src/components/Hero.jsx',
  'src/components/sections/Brands.jsx',
  'src/components/sections/Services.jsx',
  'src/components/sections/WhyUs.jsx',
  'src/components/sections/Process.jsx',
  'src/components/sections/Testimonials.jsx',
  'src/components/sections/Packages.jsx',
  'src/components/sections/Contact.jsx',
  'src/components/FloatingLine.jsx',
  'src/app.jsx',
];

const transformJsx = (code, filename) => {
  const result = transformSync(code, {
    filename,
    babelrc: false,
    configFile: false,
    comments: false,
    plugins: [[jsxPlugin, { runtime: 'classic' }]],
  });
  return result.code;
};

const sourceBlocks = await Promise.all(jsxSources.map(async (sourcePath) => {
  const absPath = path.join(rootDir, sourcePath);
  const code = await fs.readFile(absPath, 'utf8');
  return `\n/* ${sourcePath} */\n${transformJsx(code, sourcePath)}\n`;
}));

const bundleSource = `"use strict";\n${sourceBlocks.join('\n')}`;
const minified = await minify(bundleSource, {
  compress: { passes: 2 },
  mangle: true,
  format: { comments: false },
});

if (!minified.code) {
  throw new Error('Bundle generation failed: terser returned empty output.');
}

const banner = '/*! Generated by scripts/build-static-bundle.mjs. Do not edit directly. */\n';
const output = banner + minified.code + '\n';

await fs.mkdir(path.dirname(outFile), { recursive: true });
await fs.writeFile(outFile, output, 'utf8');

const siteUrl = await getSiteUrl();
const organizationJson = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Conrad Express',
  url: siteUrl,
  description: 'Luxury & high-value logistics service in Thailand.',
  areaServed: 'TH',
});

await updateIndexSeo({ siteUrl, organizationJson });
await writeSeoFiles(siteUrl);

const rawKb = (Buffer.byteLength(output) / 1024).toFixed(1);
const gzipKb = (gzipSync(output).byteLength / 1024).toFixed(1);
console.log(`Built ${path.relative(rootDir, outFile)} (${rawKb} KB, ${gzipKb} KB gzip)`);
console.log(`Generated SEO assets for ${siteUrl}`);
