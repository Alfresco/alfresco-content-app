import { Browser, Page } from 'puppeteer';
import * as settings from '../config/settings.json';
import { RepoClient } from '../../e2e/utilities/repo-client/repo-client';
import { Utils } from '../../e2e/utilities/utils';

declare const browser: Browser;

describe('Login', () => {
  const peopleApi = new RepoClient().people;
  let page: Page;

  const johnDoe = {
    username: `user-${Utils.random()}`,
    get password() {
      return this.username;
    },
    firstName: 'John',
    lastName: 'Doe'
  };

  beforeAll(async () => {
    page = await browser.newPage();
    await peopleApi.createUser(johnDoe);
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

  function isEnabled(elementSelector: string) {
    return page.evaluate(selector => {
      const el = document.querySelector(selector);
      if (el) {
        const attr = el.getAttribute('disabled');
        return !(attr === '' || attr === 'true');
      }
      return null;
    }, elementSelector);
  }

  async function login(username: string, password: string, wait = true) {
    await page.type('.adf-login__field #username', username);
    await page.type('.adf-login__field #password', password);

    await page.click('.adf-login-button');

    if (wait) {
      await page.waitForNavigation();
    }
  }

  describe('general tests', () => {
    it('login page layout - [C213089]', async () => {
      const username = await isEnabled('#username');
      const password = await isEnabled('#password');
      const submit = await isEnabled('#login-button');

      expect(username).toBe(true);
      expect(password).toBe(true);
      expect(submit).toBe(false);

      const passwordType = await page.$eval('#password', el =>
        el.getAttribute('type')
      );
      expect(passwordType).toBe('password');
    });

    it('change password visibility - [C213091]', async () => {
      await page.type('#password', 'any-password');

      let passwordType = await page.$eval('#password', el =>
        el.getAttribute('type')
      );
      expect(passwordType).toBe('password');

      await page.click('.adf-login-password-icon');

      passwordType = await page.$eval('#password', el =>
        el.getAttribute('type')
      );
      expect(passwordType).toBe('text');
    });
  });

  describe('with valid credentials', () => {
    const testUser = `user-${Utils.random()}@alfresco.com`;

    const nonLatinUser = {
      /* cspell:disable-next-line */
      username: `пользователь${Utils.random()}`,
      password: '密碼中國'
    };

    const testUser2 = {
      username: `user-${Utils.random()}`,
      password: 'user2 password'
    };
    const newPassword = 'new password';

    beforeAll(async () => {
      await peopleApi.createUser({ username: testUser });
      await peopleApi.createUser(nonLatinUser);
      await peopleApi.createUser(testUser2);
    });

    it('navigate to "Personal Files" - [C213092]', async () => {
      await login(johnDoe.username, johnDoe.password);

      const url = await page.url();
      expect(url).toContain('/personal-files');
    });

    it(`displays user's name in header - [C213108]`, async () => {
      await login(johnDoe.username, johnDoe.password);

      const fullName = await page.$eval(
        '.current-user__full-name',
        (el: any) => el.innerText
      );
      expect(fullName).toBe(`${johnDoe.firstName} ${johnDoe.lastName}`);
    });

    it(`logs in with user having username containing "@" - [C213096]`, async () => {
      await login(testUser, testUser);

      const url = await page.url();
      expect(url).toContain('/personal-files');
    });

    it('logs in with user with non-latin characters - [C213097]', async () => {
      await login(nonLatinUser.username, nonLatinUser.password);

      const url = await page.url();
      expect(url).toContain('/personal-files');
    });

    it('redirects to Home Page when navigating to the Login page while already logged in - [C213107]', async () => {
      await login(johnDoe.username, johnDoe.password);

      await page.goto(settings.appUrl + '/login');
      await page.waitForNavigation();

      const url = await page.url();
      expect(url).toContain('/personal-files');
    });

    it('redirects to Personal Files when pressing browser Back while already logged in - [C213109]', async () => {
      await login(johnDoe.username, johnDoe.password);

      let url = await page.url();
      expect(url).toContain('/personal-files');

      await page.goBack();
      await page.waitForNavigation({ waitUntil: 'networkidle0' });

      url = await page.url();
      expect(url).toContain('/personal-files');
    });

    xit('user is able to login after changing his password - [C213104]', async () => {
      await login(testUser2.username, testUser2.password);

      let url = await page.url();
      expect(url).toContain('/personal-files');

      await page.evaluate(() => localStorage.clear());
      await peopleApi.changePassword(testUser2.username, newPassword);

      await page.goto(settings.appUrl);
      await page.waitForNavigation();

      url = await page.url();
      expect(url).toContain('/login');

      await login(testUser2.username, newPassword);

      url = await page.url();
      expect(url).toContain('/personal-files');
    });
  });

  describe('with invalid credentials', () => {
    const disabledUser = `user-${Utils.random()}`;

    beforeAll(async () => {
      await peopleApi.createUser({ username: disabledUser });
      await peopleApi.disableUser(disabledUser);
    });

    it('disabled submit button when password is empty - [C280072]', async () => {
      await page.type('#username', 'any-username');

      const disabled = await page.evaluate(() => {
        const attr = document
          .getElementById('login-button')
          .getAttribute('disabled');
        return attr === '' || attr === 'true';
      });

      if (!disabled) {
        await page.screenshot({ path: 'tests/screenshots/C280072.png' });
        fail('submit button is enabled');
      }
    });

    it('disabled submit button when username is empty - [C280070]', async () => {
      await page.$eval('#username', (el: any) => (el.value = ''));
      await page.type('#password', 'any-password');

      const disabled = await page.evaluate(() => {
        const attr = document
          .getElementById('login-button')
          .getAttribute('disabled');
        return attr === '' || attr === 'true';
      });

      if (!disabled) {
        await page.screenshot({ path: 'tests/screenshots/C280070.png' });
        fail('submit button is enabled');
      }
    });

    it('shows error when entering nonexistent user - [C213093]', async () => {
      await login('nonexistent-user', 'any-password', false);

      const url = await page.url();
      expect(url).toContain('/login');

      await page.waitForSelector('.adf-login-error-message');

      const err = await page.$eval(
        '.adf-login-error-message',
        (el: any) => el.innerText
      );
      expect(err).toBe(`You've entered an unknown username or password`);
    });

    it('shows error when entering invalid password - [C280071]', async () => {
      await login(johnDoe.username, 'any-password', false);

      const url = await page.url();
      expect(url).toContain('/login');

      await page.waitForSelector('.adf-login-error-message');

      const err = await page.$eval(
        '.adf-login-error-message',
        (el: any) => el.innerText
      );
      expect(err).toBe(`You've entered an unknown username or password`);
    });

    xit('unauthenticated user is redirected to Login page - [C213106]', async () => {
      await page.goto(settings.appUrl + '/personal-files');
      await page.waitForNavigation();

      const url = await page.url();
      expect(url).toContain('/login');
    });

    it('disabled user is not logged in - [C213100]', async () => {
      await login(disabledUser, disabledUser, false);

      const url = await page.url();
      expect(url).toContain('/login');

      await page.waitForSelector('.adf-login-error-message');

      const err = await page.$eval(
        '.adf-login-error-message',
        (el: any) => el.innerText
      );
      expect(err).toBe(`You've entered an unknown username or password`);
    });
  });
});
