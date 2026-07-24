import sharp from 'sharp';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const dir = path.dirname(fileURLToPath(import.meta.url));
const iconSvg = readFileSync(path.join(dir, 'icon-source.svg'));
const splashSvg = readFileSync(path.join(dir, 'splash-source.svg'));

const appIconDir = path.join(dir, '..', 'ios', 'App', 'App', 'Assets.xcassets', 'AppIcon.appiconset');
const splashDir = path.join(dir, '..', 'ios', 'App', 'App', 'Assets.xcassets', 'Splash.imageset');

// iOS App Store icons must be fully opaque - flatten away any alpha channel.
await sharp(iconSvg, { density: 384 })
  .resize(1024, 1024)
  .flatten({ background: '#0d9488' })
  .png()
  .toFile(path.join(appIconDir, 'AppIcon-512@2x.png'));
console.log('wrote AppIcon-512@2x.png');

const splashPng = await sharp(splashSvg, { density: 384 }).resize(2732, 2732).png().toBuffer();
for (const name of ['splash-2732x2732.png', 'splash-2732x2732-1.png', 'splash-2732x2732-2.png']) {
  await sharp(splashPng).toFile(path.join(splashDir, name));
  console.log('wrote', name);
}
