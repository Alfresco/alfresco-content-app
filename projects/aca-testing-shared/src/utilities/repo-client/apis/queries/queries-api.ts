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
import { Logger } from '@alfresco/adf-testing';
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

    try {
      await this.apiAuth();
      return this.queriesApi.findSites(searchTerm, data);
    } catch (error) {
      this.handleError(`QueriesApi findSites : catch : `, error);
      return null;
    }
  }

  async findSitesTotalItems(searchTerm: string): Promise<number> {
    try {
      return (await this.findSites(searchTerm)).list.pagination.totalItems;
    } catch (error) {
      this.handleError(`QueriesApi findSitesTotalItems : catch :`, error);
      return -1;
    }
  }

  async findNodes(searchTerm: string) {
    const data = {
      term: searchTerm,
      fields: ['name']
    };

    try {
      await this.apiAuth();
      return this.queriesApi.findNodes(searchTerm, data);
    } catch (error) {
      this.handleError(`QueriesApi findNodes : catch : `, error);
      return null;
    }
  }

  async waitForSites(searchTerm: string, data: { expect: number }) {
    try {
      const sites = async () => {
        const totalItems = await this.findSitesTotalItems(searchTerm);
        if (totalItems !== data.expect) {
          return Promise.reject(totalItems);
        } else {
          return Promise.resolve(totalItems);
        }
      };

      return await Utils.retryCall(sites);
    } catch (error) {
      Logger.error(`QueriesApi waitForSites : catch : `);
      Logger.error(`\tExpected: ${data.expect} items, but found ${error}`);
    }
  }

  async waitForFilesAndFolders(searchTerm: string, data: { expect: number }) {
    try {
      const nodes = async () => {
        const totalItems = (await this.findNodes(searchTerm)).list.pagination.totalItems;
        if (totalItems !== data.expect) {
          return Promise.reject(totalItems);
        } else {
          return Promise.resolve(totalItems);
        }
      };

      return await Utils.retryCall(nodes);
    } catch (error) {
      Logger.error(`QueriesApi waitForFilesAndFolders : catch : `);
      Logger.error(`\tExpected: ${data.expect} items, but found ${error}`);
    }
  }
}
