/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2020 Alfresco Software Limited
 *
 * This file is part of the Alfresco Example Content Application.
 * If the software was purchased under a paid Alfresco license, the terms of
 * the paid license agreement will prevail.  Otherwise, the software is
 * provided under the following open source license terms:
 *
 * The Alfresco Example Content Application is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * The Alfresco Example Content Application is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with Alfresco. If not, see <http://www.gnu.org/licenses/>.
 */

import { browser } from 'protractor';
import { NodesApi, SitesApi, FavoritesApi, QueriesApi, SharedLinksApi, SearchApi, UploadApi } from './apis';
import { AlfrescoApi } from '@alfresco/js-api';

/**
 * @deprecated Use {AdminActions} or {UserActions} instead.
 */
export class RepoClient {
  alfrescoApi: AlfrescoApi;

  constructor(private username: string = browser.params.ADMIN_USERNAME, private password: string = browser.params.ADMIN_PASSWORD) {
    this.alfrescoApi = new AlfrescoApi();
    this.alfrescoApi.setConfig(browser.params.config);
  }

  login(): Promise<any> {
    return this.alfrescoApi.login(this.username, this.password);
  }

  get nodes(): NodesApi {
    return new NodesApi(this.alfrescoApi);
  }

  get sites(): SitesApi {
    return new SitesApi(this.alfrescoApi);
  }

  get favorites(): FavoritesApi {
    return new FavoritesApi(this.alfrescoApi);
  }

  get shared(): SharedLinksApi {
    return new SharedLinksApi(this.alfrescoApi);
  }

  get search(): SearchApi {
    return new SearchApi(this.alfrescoApi);
  }

  get queries(): QueriesApi {
    return new QueriesApi(this.alfrescoApi);
  }

  get upload(): UploadApi {
    return new UploadApi(this.alfrescoApi);
  }

  async logout(): Promise<any> {
    return this.alfrescoApi.logout();
  }
}
