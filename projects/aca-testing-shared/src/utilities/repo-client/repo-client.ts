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

import { NodesApi, SitesApi, FavoritesApi, QueriesApi, SharedLinksApi, SearchApi, UploadApi } from './apis';
import { ApiService } from '@alfresco/adf-testing';

/**
 * @deprecated Use {AdminActions} or {UserActions} instead.
 */
export class RepoClient {

  api: ApiService;

  constructor(alfrescoApi: ApiService) {
    this.api = alfrescoApi;
  }

  get nodes(): NodesApi {
    return new NodesApi(this.api);
  }

  get sites(): SitesApi {
    return new SitesApi(this.api);
  }

  get favorites(): FavoritesApi {
    return new FavoritesApi(this.api);
  }

  get shared(): SharedLinksApi {
    return new SharedLinksApi(this.api);
  }

  get search(): SearchApi {
    return new SearchApi(this.api);
  }

  get queries(): QueriesApi {
    return new QueriesApi(this.api);
  }

  get upload(): UploadApi {
    return new UploadApi(this.api);
  }

}
