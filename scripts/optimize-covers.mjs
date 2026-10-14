/**
 * カバー画像を表示幅（1000px）向けに WebP / AVIF を生成する。
 * 元 JPEG はそのまま残し、ヒーロー・スライドショー用の軽量版を追加する。
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const COVER_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), '../public/site-assets/coverimage');
const WIDTH = 1000;
const JPGS = ['ryu.jpg', 'ryu2.jpg', '2022spring.jpg', '2018fall.jpg', '2016fall.jpg'];

async function optimizeOne(file) {
  const base = file.replace(/\.jpg$/i, '');
  const input = path.join(COVER_DIR, file);
  const stem = path.join(COVER_DIR, base);

  const pipeline = sharp(input).rotate().resize(WIDTH, null, { withoutEnlargement: true });

  await pipeline.clone().webp({ quality: 82, effort: 4 }).toFile(`${stem}-1000w.webp`);
  await pipeline.clone().avif({ quality: 55, effort: 4 }).toFile(`${stem}-1000w.avif`);

  const jpgOut = `${stem}-1000w.jpg`;
  await pipeline.clone().jpeg({ quality: 82, mozjpeg: true }).toFile(jpgOut);

  const stat = await fs.stat(input);
  const webpStat = await fs.stat(`${stem}-1000w.webp`);
  console.log(`${file}: ${(stat.size / 1024).toFixed(0)} KiB → webp ${(webpStat.size / 1024).toFixed(0)} KiB`);
}

for (const file of JPGS) {
  await optimizeOne(file);
}

console.log('Done.');
