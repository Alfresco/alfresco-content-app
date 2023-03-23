/*
 * Copyright © 2005 - 2023 Alfresco Software, Ltd. All rights reserved.
 *
 * License rights for this program may be obtained from Alfresco Software, Ltd.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
 */

import { chromium, FullConfig } from '@playwright/test';
import { LoginPage } from '../page-objects';
import fs from 'fs';

const E2E_HOST = process.env.PLAYWRIGHT_E2E_HOST;
const E2E_PORT = process.env.PLAYWRIGHT_E2E_PORT;
const acsAdminUser = process.env.ADMIN_EMAIL;
const acsAdminUserPassword = process.env.ADMIN_PASSWORD;

async function globalSetup(config: FullConfig) {
  const { use } = config.projects[0];

  let baseUrl: string;

  if (use.baseURL) {
    baseUrl = use.baseURL;
  } else {
    if (E2E_HOST?.match(/localhost/)) {
      baseUrl = `${E2E_HOST}:${E2E_PORT}`;
    } else {
      baseUrl = E2E_HOST;
    }
  }

  const browser = await chromium.launch({
    args: ['--disable-web-security']
  });
  const page = await browser.newPage();
  const loginPage = new LoginPage(page);

  fs.mkdirSync(`./storage-state`, { recursive: true });
  await page.goto(baseUrl);
  await loginPage.loginUser({ username: acsAdminUser, password: acsAdminUserPassword }, { withNavigation: false, waitForLoading: true });
  await page.context().storageState({ path: `./storage-state/AdminUserState.json` });
  await browser.close();
}

export default globalSetup;
