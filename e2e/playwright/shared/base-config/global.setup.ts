/*!
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * Alfresco Example Content Application
 *
 * This file is part of the Alfresco Example Content Application.
 * If the software was purchased under a paid Alfresco license, the terms of
 * the paid license agreement will prevail. Otherwise, the software is
 * provided under the following open source license terms:
 *
 * The Alfresco Example Content Application is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * The Alfresco Example Content Application is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with Alfresco. If not, see <http://www.gnu.org/licenses/>.
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
