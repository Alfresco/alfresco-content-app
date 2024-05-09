/*!
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { expect } from '@playwright/test';
import { ApiClientFactory, Utils, test } from '@alfresco/playwright-shared';

test.describe('Create folders', () => {
  const apiClientFactory = new ApiClientFactory();
  let randomFolderName: string;
  const sessionTestUser = {
    username: `user-${Utils.random()}`,
    password: Utils.random()
  };

  test.beforeAll(async () => {
    await apiClientFactory.setUpAcaBackend('admin');
    await apiClientFactory.createUser(sessionTestUser);
  });

  test.beforeEach(async () => {
    randomFolderName = `authentication-general-${Utils.random()}`;
    await apiClientFactory.loginUser(sessionTestUser);
  });

  test('[C286473] should close opened dialogs on session expire', async ({ loginPage, personalFiles }) => {
    await loginPage.navigate();
    await loginPage.loginUser({ username: sessionTestUser.username, password: sessionTestUser.password });
    const folderDialog = personalFiles.folderDialog;
    await personalFiles.selectCreateFolder();
    await apiClientFactory.tearDown();
    await folderDialog.folderNameInputLocator.fill(randomFolderName);
    await folderDialog.createButton.click();
    await personalFiles.page.keyboard.press('Escape');
    await personalFiles.snackBar.message.waitFor({ state: 'attached' });
    await expect(personalFiles.snackBar.message).toHaveText('The action was unsuccessful. Try again or contact your IT Team.');
    expect(await personalFiles.page.title()).toContain('Sign in');
    await personalFiles.snackBar.message.waitFor({ state: 'detached' });
    await expect(personalFiles.snackBar.message, 'dialog should not be visible').toBeHidden();
  });
});
