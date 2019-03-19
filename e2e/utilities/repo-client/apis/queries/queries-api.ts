/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2019 Alfresco Software Limited
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

import { RepoApi } from '../repo-api';
import { Utils } from '../../../../utilities/utils';
import { QueriesApi as AdfQueriesApi } from '@alfresco/js-api';

export class QueriesApi extends RepoApi {
  queriesApi = new AdfQueriesApi(this.alfrescoJsApi);

  constructor(username?: string, password?: string) {
      super(username, password);
  }

  async findSites(searchTerm: string) {
    const data = {
        term: searchTerm,
        fields: ['title']
    };

    await this.apiAuth();
    return this.queriesApi.findSites(searchTerm, data);
  }

  async findNodes(searchTerm: string) {
    const data = {
        term: searchTerm,
        fields: ['name']
    };

    await this.apiAuth();
    return this.queriesApi.findNodes(searchTerm, data);
  }

  async waitForSites(searchTerm: string, data: any) {
    try {
      const sites = async () => {
        const totalItems = (await this.findSites(searchTerm)).list.pagination.totalItems;
        if ( totalItems !== data.expect ) {
          return Promise.reject(totalItems);
        } else {
          return Promise.resolve(totalItems);
        }
      };

      return await Utils.retryCall(sites);
    } catch (error) {
      console.log('-----> catch queries findSites: ', error);
    }
  }

  async waitForFilesAndFolders(searchTerm: string, data: any) {
    try {
      const nodes = async () => {
        const totalItems = (await this.findNodes(searchTerm)).list.pagination.totalItems;
        if ( totalItems !== data.expect ) {
          return Promise.reject(totalItems);
        } else {
          return Promise.resolve(totalItems);
        }
      };

      return await Utils.retryCall(nodes);
    } catch (error) {
      console.log('-----> catch queries findFilesAndFolders: ', error);
    }
  }
}
