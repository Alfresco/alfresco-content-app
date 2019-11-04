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
import { SearchApi as AdfSearchApi } from '@alfresco/js-api';

export class SearchApi extends RepoApi {
  searchApi = new AdfSearchApi(this.alfrescoJsApi);

  constructor(username?, password?) {
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
      this.handleError(`${this.constructor.name} ${this.queryRecentFiles.name}`, error);
      return null;
    }
  }

  async queryNodesNames(searchTerm: string) {
    const data = {
      query: {
        query: `cm:name:\"${searchTerm}*\"`,
        language: 'afts'
      },
      filterQueries: [
        { query: `+TYPE:'cm:folder' OR +TYPE:'cm:content'`}
      ]
    };

    try {
      await this.apiAuth();
      return this.searchApi.search(data);
    } catch (error) {
      this.handleError(`${this.constructor.name} ${this.queryNodesNames.name}`, error);
      return null;
    }
  }

  async queryNodesExactNames(searchTerm: string) {
    const data = {
      query: {
        query: `cm:name:\"${searchTerm}\"`,
        language: 'afts'
      },
      filterQueries: [
        { query: `+TYPE:'cm:folder' OR +TYPE:'cm:content'`}
      ]
    };

    try {
      await this.apiAuth();
      return this.searchApi.search(data);
    } catch (error) {
      this.handleError(`${this.constructor.name} ${this.queryNodesExactNames.name}`, error);
      return null;
    }
  }

  async waitForApi(username: string, data: { expect: number }) {
    try {
      const recentFiles = async () => {
        const totalItems = (await this.queryRecentFiles(username)).list.pagination.totalItems;
        if ( totalItems !== data.expect) {
          return Promise.reject(totalItems);
        } else {
          return Promise.resolve(totalItems);
        }
      };

      return await Utils.retryCall(recentFiles);
    } catch (error) {
      console.log(`${this.constructor.name} ${this.waitForApi.name} catch: `);
      console.log(`\tExpected: ${data.expect} items, but found ${error}`);
    }
  }

  async waitForNodes(searchTerm: string, data: { expect: number }) {
    try {
      const nodes = async () => {
        const totalItems = (await this.queryNodesNames(searchTerm)).list.pagination.totalItems;
        if ( totalItems !== data.expect) {
          return Promise.reject(totalItems);
        } else {
          return Promise.resolve(totalItems);
        }
      };

      return await Utils.retryCall(nodes);
    } catch (error) {
      console.log(`${this.constructor.name} ${this.waitForNodes.name} catch: `);
      console.log(`\tExpected: ${data.expect} items, but found ${error}`);
    }
  }
}
