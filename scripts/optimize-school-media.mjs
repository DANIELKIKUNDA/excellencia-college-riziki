import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const sourceDir = process.argv[2];
const outputDir = process.argv[3] || 'public/images/activities';

if (!sourceDir) {
  throw new Error('Usage: node scripts/optimize-school-media.mjs <source> [destination]');
}

await fs.mkdir(outputDir, { recursive: true });
const files = (await fs.readdir(sourceDir))
  .filter((name) => /\.(jpe?g|png)$/i.test(name))
  .sort(new Intl.Collator('fr', { numeric: true }).compare);

for (const [index, name] of files.entries()) {
  const outputName = `riziki-atelier-${String(index + 1).padStart(2, '0')}.webp`;
  await sharp(path.join(sourceDir, name))
    .rotate()
    .resize({ width: 1800, height: 1800, fit: 'inside', withoutEnlargement: true })
    .modulate({ brightness: 1.025, saturation: 1.04 })
    .sharpen({ sigma: 0.55 })
    .webp({ quality: 84, effort: 5 })
    .toFile(path.join(outputDir, outputName));
  process.stdout.write(`${name} -> ${outputName}\n`);
}

process.stdout.write(`Optimized ${files.length} authentic school photos.\n`);
