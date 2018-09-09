import { Browser, Page } from 'puppeteer';
import * as settings from '../config/settings.json';

declare const browser: Browser;

describe('Login', () => {
    let page: Page;

    beforeAll(async () => {
        page = await browser.newPage();
    });

    beforeEach(async () => {
        await page.goto(settings.appUrl);
    });


    afterEach(async () => {
        await page.evaluate(() => {
            localStorage.clear();
        });
    });

    afterAll(async () => {
        await page.close();
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

    describe('with invalid credentials', () => {
        it('disabled submit button when password is empty - [C280072]', async () => {
            await page.type('#username', 'any-username');

            const disabled = await page.evaluate(() => {
                const attr = document.getElementById('login-button').getAttribute('disabled');
                return attr === '' || attr === 'true';
            });

            if (!disabled) {
                await page.screenshot({ path: 'tests/screenshots/C280072.png' });
                fail('submit button is enabled');
            }
        });

        it('disabled submit button when username is empty - [C280070]', async () => {
            await page.$eval('#username', (el: any) => el.value = '');
            await page.type('#password', 'any-password');

            const disabled = await page.evaluate(() => {
                const attr = document.getElementById('login-button').getAttribute('disabled');
                return attr === '' || attr === 'true';
            });

            if (!disabled) {
                await page.screenshot({ path: 'tests/screenshots/C280070.png' });
                fail('submit button is enabled');
            }
        });
    });
});
