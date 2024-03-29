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
 * along with Alfresco. If not, see <http://www.gnu.org/licenses/>.
 */

import { browser } from 'protractor';
import { AlfrescoApi } from '@alfresco/js-api';

export abstract class RepoApi {
  alfrescoJsApi = new AlfrescoApi();

  protected constructor(public username: string = browser.params.ADMIN_USERNAME, private password: string = browser.params.ADMIN_PASSWORD) {
    this.alfrescoJsApi.setConfig(browser.params.config);
  }

  apiAuth(): Promise<any> {
    return this.alfrescoJsApi.login(this.username, this.password);
  }

  protected handleError(message: string, response: any) {
    console.error(`\n--- ${message} error :`);
    console.error('\t>>> username: ', this.username);
    console.error('\t>>> JSON: ', JSON.stringify(browser.params.config));
    if (response.status && response.response) {
      try {
        console.error('\t>>> Status: ', response.status);
        console.error('\t>>> Text: ', response.response.text);
        console.error('\t>>> Method: ', response.response.error.method);
        console.error('\t>>> Path: ', response.response.error.path);
      } catch {
        console.error('\t>>> ', response);
      }
    } else console.error('\t>>> ', response);
  }
}
