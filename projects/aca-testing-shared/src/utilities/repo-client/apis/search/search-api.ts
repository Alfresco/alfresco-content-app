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

import { RepoApi } from '../repo-api';
import { ApiUtil, Logger } from '@alfresco/adf-testing';
import { Utils } from '../../../../utilities/utils';
import { SearchApi as AdfSearchApi } from '@alfresco/js-api';

export class SearchApi extends RepoApi {
  searchApi = new AdfSearchApi(this.alfrescoJsApi);

  constructor(username?: string, password?: string) {
    super(username, password);
  }

  async queryRecentFiles(username: string) {
    const data = {
      query: {
        query: '*',
        language: 'afts'
      },
      filterQueries: [
        { query: `cm:modified:[NOW/DAY-30DAYS TO NOW/DAY+1DAY]` },
        { query: `cm:modifier:${username} OR cm:creator:${username}` },
        { query: `TYPE:"content" AND -TYPE:"app:filelink" AND -TYPE:"fm:post"` }
      ]
    };

    try {
      await this.apiAuth();
      return this.searchApi.search(data);
    } catch (error) {
      this.handleError(`SearchApi queryRecentFiles : catch : `, error);
      return null;
    }
  }

  async getTotalItems(username: string): Promise<number> {
    try {
      return (await this.queryRecentFiles(username)).list.pagination.totalItems;
    } catch (error) {
      this.handleError(`SearchApi getTotalItems : catch : `, error);
      return -1;
    }
  }

  async queryNodesNames(searchTerm: string) {
    const data = {
      query: {
        query: `cm:name:\"${searchTerm}*\"`,
        language: 'afts'
      },
      filterQueries: [{ query: `+TYPE:'cm:folder' OR +TYPE:'cm:content'` }]
    };

    try {
      await this.apiAuth();
      return this.searchApi.search(data);
    } catch (error) {
      this.handleError(`SearchApi queryNodesNames : catch : `, error);
      return null;
    }
  }

  async getSearchByTermTotalItems(searchTerm: string): Promise<number> {
    try {
      return (await this.queryNodesNames(searchTerm)).list.pagination.totalItems;
    } catch (error) {
      this.handleError(`SearchApi getSearchByTermTotalItems : catch : `, error);
      return -1;
    }
  }

  async queryNodesExactNames(searchTerm: string) {
    const data = {
      query: {
        query: `cm:name:\"${searchTerm}\"`,
        language: 'afts'
      },
      filterQueries: [{ query: `+TYPE:'cm:folder' OR +TYPE:'cm:content'` }]
    };

    try {
      await this.apiAuth();
      return this.searchApi.search(data);
    } catch (error) {
      this.handleError(`SearchApi queryNodesExactNames : catch : `, error);
      return null;
    }
  }

  async waitForApi(username: string, data: { expect: number }) {
    try {
      const recentFiles = async () => {
        const totalItems = await this.getTotalItems(username);
        if (totalItems !== data.expect) {
          return Promise.reject(totalItems);
        } else {
          return Promise.resolve(totalItems);
        }
      };

      return await Utils.retryCall(recentFiles);
    } catch (error) {
      Logger.error(`SearchApi waitForApi : catch : `);
      Logger.error(`\tExpected: ${data.expect} items, but found ${error}`);
    }
  }

  async waitForNodes(searchTerm: string, data: { expect: number }) {
    const predicate = (totalItems: number) => totalItems === data.expect;

    const apiCall = async () => {
      try {
        return await this.getSearchByTermTotalItems(searchTerm);
      } catch (error) {
        return 0;
      }
    };

    try {
      await ApiUtil.waitForApi(apiCall, predicate, 30, 2500);
    } catch (error) {
      Logger.error(`SearchApi waitForNodes : catch : `);
      Logger.error(`\tExpected: ${data.expect} items, but found ${error}`);
    }
  }
}
