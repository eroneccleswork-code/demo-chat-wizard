import { chromium } from '@playwright/test';
import fs from 'fs';

const url = 'https://tour-viewer.platform.saleo.io/734d3a34-4fdc-4c57-8e51-f6f46585a2cd';
const outDir = '/mnt/documents/saleo-shots';
fs.mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();
await page.goto(url, { waitUntil: 'networkidle' });
await page.waitForTimeout(2000);

async function snap(step, name) {
  // Find inner snapshot container and measure its full content height
  const dims = await page.evaluate(() => {
    const root = document.querySelector('[id^="saleo-snapshot-"]');
    if (!root) return null;
    // Walk into the actual rendered content
    const scrollables = root.querySelectorAll('*');
    let maxH = root.scrollHeight;
    for (const el of scrollables) {
      const s = getComputedStyle(el);
      if ((s.overflow === 'auto' || s.overflowY === 'auto' || s.overflow === 'scroll' || s.overflowY === 'scroll') && el.scrollHeight > el.clientHeight) {
        el.style.overflow = 'visible';
        el.style.height = 'auto';
        el.style.maxHeight = 'none';
      }
    }
    // Remove height constraints on saleo wrappers
    document.querySelectorAll('.RenderedSnapshot_r1evu8q2').forEach(el => {
      el.style.height = 'auto';
      el.style.maxHeight = 'none';
      el.style.overflow = 'visible';
    });
    const rect = root.getBoundingClientRect();
    return { width: Math.ceil(rect.width), height: Math.max(root.scrollHeight, root.offsetHeight) };
  });
  if (!dims) { console.log('no snapshot for', step); return; }
  console.log(step, dims);
  // resize viewport to fit
  await page.setViewportSize({ width: Math.max(1440, dims.width), height: Math.max(900, dims.height) });
  await page.waitForTimeout(800);
  const root = await page.$('[id^="saleo-snapshot-"]');
  await root.screenshot({ path: `${outDir}/step-${step}-${name}.png` });
}

async function next() {
  await page.evaluate(() => {
    const btns = document.querySelectorAll('button');
    // The next arrow is the second button in toolbar typically; click by aria/icon
    // Use right arrow keypress instead
  });
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(1500);
}

// step 1 already loaded
const labels = ['google','google2','website','dashboard1','dashboard2','callreport1','callreport2','integrations'];
for (let i = 0; i < 8; i++) {
  await snap(i+1, labels[i]);
  if (i < 7) await next();
}

await browser.close();
console.log('Done');
