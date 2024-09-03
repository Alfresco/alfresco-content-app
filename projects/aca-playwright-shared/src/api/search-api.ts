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

import { ApiClientFactory } from './api-client-factory';
import { Utils } from '../utils';
import { ResultSetPaging } from '@alfresco/js-api';

export class SearchPageApi {
  private apiService: ApiClientFactory;

  constructor() {
    this.apiService = new ApiClientFactory();
  }
  static async initialize(userName: string, password?: string): Promise<SearchPageApi> {
    const classObj = new SearchPageApi();
    await classObj.apiService.setUpAcaBackend(userName, password);
    return classObj;
  }

  private async querySearchFiles(username: string): Promise<ResultSetPaging> {
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
      return this.apiService.search.search(data);
    } catch {
      return new ResultSetPaging();
    }
  }

  async getTotalItems(username: string): Promise<number> {
    return (await this.querySearchFiles(username)).list.pagination.totalItems;
  }

  async waitForApi(username: string, data: { expect: number }) {
    try {
      const searchFiles = async () => {
        const totalItems = await this.getTotalItems(username);
        if (totalItems !== data.expect) {
          return Promise.reject(totalItems);
        } else {
          return Promise.resolve(totalItems);
        }
      };

      return Utils.retryCall(searchFiles);
    } catch {}
  }
}
