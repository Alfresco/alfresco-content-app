import { Browser, Page } from 'puppeteer';
import * as settings from '../config/settings.json';

declare const browser: Browser;

describe('Login', () => {
    let page: Page;

    beforeAll(async () => {
        page = await browser.newPage();
        await page.goto(settings.appUrl);
    });

    it('should have correct title', async () => {
        const title = await page.title();
        expect(title).toBe('Sign in - Alfresco');
    });

    it('should login', async () => {
        await page.type('.adf-login__field #username', 'admin');
        await page.type('.adf-login__field #password', 'admin');

        await page.click('.adf-login-button');
        await page.waitForNavigation();

        const navbar = await page.$eval(
            '.adf-layout-header',
            el => (el ? true : false)
        );
        expect(navbar).toBe(true);
    });
});
