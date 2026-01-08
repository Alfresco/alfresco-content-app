/*!
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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
 * from Hyland Software. If not, see <http://www.gnu.org/licenses/>.
 */

import { chromium, FullConfig } from '@playwright/test';
import { LoginPage } from '../page-objects';
import { CustomConfig } from '../models';
import { users } from './global-variables';
import fs from 'fs';
import { paths } from '../utils/paths';

async function globalSetup(config: FullConfig<CustomConfig>) {
  const { use } = config.projects[0];

  await removeOutputFolders();
  await createOutputFolders();

  if (use.users) {
    for (const user of use.users) {
      if (users[user].username) {
        const browser = await chromium.launch();
        const page = await browser.newPage();
        const loginPage = new LoginPage(page);
        await page.goto(use.baseURL);
        await loginPage.loginUser(
          { username: users[user].username, password: users[user].password },
          {
            withNavigation: false,
            waitForLoading: true
          }
        );
        await page.context().storageState({ path: `${paths.userStates}/${user}UserState.json` });
        await browser.close();
      } else {
        throw new Error(`Add credentials for ${user} to you .env file!`);
      }
    }
  }
}

async function createOutputFolders() {
  for (const path in paths) {
    if (!fs.existsSync(paths[path])) {
      fs.mkdirSync(paths[path], { recursive: true });
    }
  }
}

async function removeOutputFolders() {
  if (fs.existsSync(paths.rootFolder)) {
    fs.rmSync(paths.rootFolder, { recursive: true, force: true });
  }
}

export default globalSetup;
