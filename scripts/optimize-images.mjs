import sharp from 'sharp';
import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

// Offline asset preparation. Originals remain untouched; committed WebP files
// are served directly, so production does not need an image service or Sharp.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputDir = 'brand-images/optimized';
const assetsFile = path.join(root, 'src/data/assets.js');
const startMarker = '  // BEGIN GENERATED RESPONSIVE IMAGES';
const endMarker = '  // END GENERATED RESPONSIVE IMAGES';
const sources = [
  { file: 'brand-images/Section_Hero.jpg', widths: [640, 1280, 1920, 2560], quality: 82 },
  ...['Luxury Watches', 'Fine Art', 'Collection', 'Gemstones', 'Gold', 'Luxury Fashion', 'Confidential', 'Gadgets', 'IT', 'Other']
    .map(name => ({ file: `brand-images/services/${name}.jpg`, widths: [320, 640, 960], quality: 82 })),
  ...Array.from({ length: 11 }, (_, i) => ({ file: `brand-images/review-${i + 1}.jpg`, widths: [400, 800, 1200], quality: 84 })),
  ...Array.from({ length: 4 }, (_, i) => ({ file: `brand-images/How-it-work-${i + 1}.jpg`, widths: [480, 960, 1440], quality: 82 })),
];

await fs.mkdir(path.join(root, outputDir), { recursive: true });
const manifest = {};
let originalBytes = 0;
let largestBytes = 0;
let defaultBytes = 0;
let variantBytes = 0;
let variantCount = 0;

for (const { file, widths, quality } of sources) {
  const original = await fs.readFile(path.join(root, file));
  const metadata = await sharp(original).metadata();
  const nativeWidth = metadata.autoOrient?.width || metadata.width;
  const uniqueWidths = [...new Set(widths.map(width => Math.min(width, nativeWidth)))].sort((a, b) => a - b);
  const variants = [];
  const stem = path.basename(file, path.extname(file)).toLowerCase().replace(/[^a-z0-9]+/g, '-');

  for (const width of uniqueWidths) {
    const { data, info } = await sharp(original)
      .autoOrient()
      .resize({ width, withoutEnlargement: true })
      .webp({ quality, effort: 6 })
      .toBuffer({ resolveWithObject: true });
    const hash = createHash('sha256').update(data).digest('hex').slice(0, 12);
    const src = `${outputDir}/${stem}-${info.width}-${hash}.webp`;
    await fs.writeFile(path.join(root, src), data);
    variants.push({ src, width: info.width, height: info.height });
    variantBytes += data.length;
    variantCount += 1;
  }

  const defaultVariant = variants.filter(variant => variant.width <= 960).at(-1) || variants[0];
  manifest[file] = {
    src: defaultVariant.src,
    width: defaultVariant.width,
    height: defaultVariant.height,
    variants: variants.map(variant => [variant.src, variant.width]),
  };
  originalBytes += original.length;
  defaultBytes += (await fs.stat(path.join(root, defaultVariant.src))).size;
  largestBytes += (await fs.stat(path.join(root, variants.at(-1).src))).size;
}

const source = await fs.readFile(assetsFile, 'utf8');
const start = source.indexOf(startMarker);
const end = source.indexOf(endMarker);
if (start < 0 || end < start) throw new Error('Responsive image manifest markers are missing from src/data/assets.js');
const generated = `${startMarker}\n  const responsiveImages = ${JSON.stringify(manifest, null, 2).replaceAll('\n', '\n  ')};\n${endMarker}`;
await fs.writeFile(assetsFile, source.slice(0, start) + generated + source.slice(end + endMarker.length));

console.log(JSON.stringify({
  sourceImages: sources.length,
  variants: variantCount,
  originalBytes,
  defaultVariantBytes: defaultBytes,
  largestVariantBytes: largestBytes,
  allVariantBytes: variantBytes,
  defaultSavingsPercent: Number((100 * (1 - defaultBytes / originalBytes)).toFixed(1)),
}, null, 2));
