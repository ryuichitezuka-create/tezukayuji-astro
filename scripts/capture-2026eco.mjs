import { chromium } from 'playwright';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const out = path.join(__dirname, '../public/site-assets/images/2026eco.jpg');

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1960, height: 1400 } });
await page.goto('https://www.j-jafra.jp/eco/art/', { waitUntil: 'networkidle', timeout: 60000 });
await page.waitForTimeout(1500);
await page.screenshot({ path: out, fullPage: false });
await browser.close();
console.log('saved', out);
