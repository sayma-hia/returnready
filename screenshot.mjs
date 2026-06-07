import { chromium } from 'playwright';

const OUTDIR = '/Users/arisha/.claude/jobs/c780de5a/tmp';

const pages = [
  { url: 'http://localhost:3000/', name: 'landing' },
  { url: 'http://localhost:3000/onboard', name: 'onboard' },
  { url: 'http://localhost:3000/dashboard', name: 'dashboard' },
  { url: 'http://localhost:3000/narrative', name: 'narrative' },
  { url: 'http://localhost:3000/practice', name: 'practice' },
  { url: 'http://localhost:3000/progress', name: 'progress' },
  { url: 'http://localhost:3000/about', name: 'about' },
];

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await context.newPage();

for (const { url, name } of pages) {
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000); // let Framer Motion animations complete
  await page.screenshot({ path: `${OUTDIR}/rr_${name}.png`, fullPage: false });
  console.log(`✓ ${name}`);
}

await browser.close();
