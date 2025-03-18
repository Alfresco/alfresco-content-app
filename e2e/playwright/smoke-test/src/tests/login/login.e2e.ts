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

import { expect } from '@playwright/test';
import { ApiClientFactory, Utils, test } from '@alfresco/aca-playwright-shared';

test.describe('viewer file', () => {
  const apiClientFactory = new ApiClientFactory();

  const johnDoe = {
    username: `user-${Utils.random()}`,
    get password() {
      return this.username;
    },
    firstName: 'John',
    lastName: 'Doe'
  };

  test.beforeAll(async () => {
    await apiClientFactory.setUpAcaBackend('admin');
    await apiClientFactory.createUser(johnDoe);
  });

  test.describe('with authenticated credentials', () => {
    test('[XAT-17731] Authenticated user is able to login', async ({ loginPage }) => {
      const { username } = johnDoe;
      await loginPage.navigate();
      await loginPage.loginUser({ username: username, password: username });
      await loginPage.userProfileButton.waitFor({ state: 'attached' });
      expect(loginPage.page.url()).toContain('personal-files');
    });
  });
});
