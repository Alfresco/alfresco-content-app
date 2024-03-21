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
 * from Hyland Software. If not, see <http://www.gnu.org/licenses/>.
 */

const crypto = require('crypto');
import * as path from 'path';
import { LoginPage, MyLibrariesPage, PersonalFilesPage, FavoritesLibrariesPage, SearchPage } from '../';
import { NodesApi, TrashcanApi, SitesApi } from '@alfresco/playwright-shared';

export class Utils {
  static string257Long = 'x'.repeat(257);
  static string513Long = 'x'.repeat(513);

  static random(): string {
    return crypto.getRandomValues(new Uint32Array(1))[0].toString(36).substring(0, 5).toLowerCase();
  }

  static retryCall(fn: () => Promise<any>, retry: number = 30, delay: number = 1500): Promise<any> {
    const pause = (duration: number) => new Promise((res) => setTimeout(res, duration));

    const run = (retries: number): Promise<any> => {
      return fn().catch((err) => (retries > 1 ? pause(delay).then(() => run(retries - 1)) : Promise.reject(err)));
    };

    return run(retry);
  }

  static formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US');
  }

  /**
   * Method used to login user with navigation. Also waits for the page to load after login
   *
   * @param loginPage page context passed from the test
   * @param username username string
   * @param password password string
   * @param errorMessage error message string if the login fails
   *
   */
  static async tryLoginUser(loginPage: LoginPage, username: string, password: string, errorMessage = 'Error '): Promise<void> {
    try {
      await loginPage.loginUser({ username, password }, { withNavigation: true, waitForLoading: true });
    } catch (error) {
      console.error(`${errorMessage}: ${error}`);
    }
  }

  /**
   * Method used to delete nodes and sites from user's account
   *
   * @param nodesApi nodesApi initialized with user credentials passed from the test
   * @param trashcanApi trashcanApi initialized with user credentials passed from the test
   * @param errorMessage error message string if the deleting sites/nodes fails
   * @param sitesApi sitesApi initialized with user credentials passed from the test
   * @param sitesToDelete array of sites' ids
   *
   */
  static async deleteNodesSitesEmptyTrashcan(
    nodesApi?: NodesApi,
    trashcanApi?: TrashcanApi,
    errorMessage = 'Error ',
    sitesApi?: SitesApi,
    sitesToDelete?: string[]
  ): Promise<void> {
    try {
      await nodesApi?.deleteCurrentUserNodes();
      await trashcanApi?.emptyTrashcan();
      if (sitesToDelete?.length > 0) {
        await sitesApi?.deleteSites(sitesToDelete);
      }
    } catch (error) {
      console.error(`${errorMessage}: ${error}`);
    }
  }

  static async uploadFileNewVersion(personalFilesPage: PersonalFilesPage, fileFromOS: string): Promise<void> {
    const fileInput = await personalFilesPage.page.$('#app-upload-file-version');
    await fileInput.setInputFiles(path.join(__dirname, `../resources/test-files/${fileFromOS}.docx`));
  }

  static async reloadPageIfRowNotVisible(
    pageContext: PersonalFilesPage | MyLibrariesPage | FavoritesLibrariesPage | SearchPage,
    nodeName: string,
    errorMessage = 'Error '
  ): Promise<void> {
    try {
      if (!await pageContext.dataTable.getRowByName(nodeName).isVisible()) {
        await pageContext.page.reload({ waitUntil: 'load' });
      };
    } catch (error) {
      console.error(`${errorMessage}: ${error}`);
    }
  }
}
