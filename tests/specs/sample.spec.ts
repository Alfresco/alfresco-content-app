import { Page } from 'puppeteer';
import { Browser } from 'puppeteer';

declare const browser: Browser;

xdescribe('/ (Typescript)', () => {
  let page: Page;
  beforeAll(async () => {
    // page = await global.browser.newPage();
    page = await browser.newPage();

    await page.goto('https://google.com');
  });

  it('should load without error', async () => {
    const text = await page.evaluate(() => document.body.textContent);
    expect(text).toContain('google');
    // await page.screenshot({ path: 'example.png' });
  });
});
