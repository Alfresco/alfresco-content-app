/*!
 * Copyright © 2005-2026 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { logger, Utils } from '../utils';
import { ResultSetPaging, SearchRequest } from '@alfresco/js-api';

export class SearchApi {
  private readonly apiService: ApiClientFactory;

  constructor() {
    this.apiService = new ApiClientFactory();
  }
  static async initialize(userName: string, password?: string): Promise<SearchApi> {
    const classObj = new SearchApi();
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

  async searchForNode(fileName: string, options?: { maxRetries?: number }): Promise<ResultSetPaging> {
    const query = {
      query: {
        query: `cm:name:"${fileName}"`,
        language: 'afts'
      },
      include: ['path', 'allowableOperations', 'properties'],
      paging: {
        skipCount: 0,
        maxItems: 25
      },
      filterQueries: [
        {
          query: "+TYPE:'cm:folder' OR +TYPE:'cm:content'"
        },
        {
          query: "-TYPE:'cm:thumbnail' AND -TYPE:'cm:failedThumbnail' AND -TYPE:'cm:rating'"
        },
        {
          query: '-cm:creator:System'
        },
        {
          query: "-TYPE:'st:site' AND -ASPECT:'st:siteContainer' AND -ASPECT:'sys:hidden'"
        },
        {
          query: "-TYPE:'dl:dataList' AND -TYPE:'dl:todoList' AND -TYPE:'dl:issue'"
        },
        {
          query: "-TYPE:'fm:topic' AND -TYPE:'fm:post'"
        },
        {
          query: "-TYPE:'lnk:link'"
        },
        {
          query: "-PATH:'//cm:wiki/*'"
        },
        {
          query: "+TYPE:'cm:content'"
        }
      ],
      facetQueries: undefined,
      facetIntervals: undefined,
      facetFields: {
        facets: [
          {
            field: 'creator',
            mincount: 1,
            label: 'SEARCH.FACET_FIELDS.CREATOR'
          },
          {
            field: 'modifier',
            mincount: 1,
            label: 'SEARCH.FACET_FIELDS.MODIFIER'
          }
        ]
      },
      sort: [
        {
          type: 'SCORE',
          field: 'score',
          ascending: false
        }
      ],
      highlight: {
        prefix: "<span class='aca-highlight'>",
        postfix: '</span>',
        fields: [
          {
            field: 'cm:title'
          },
          {
            field: 'cm:name'
          },
          {
            field: 'cm:description',
            snippetCount: 1
          },
          {
            field: 'cm:content',
            snippetCount: 1
          }
        ]
      },
      facetFormat: 'V2'
    };

    let result: ResultSetPaging;
    let retryCount = 0;
    const retryLimit = options?.maxRetries ?? 90;

    do {
      try {
        result = await this.apiService.search.search(query);
      } catch {
        result = new ResultSetPaging();
      }
      if ((result.list?.entries?.length ?? 0) === 0) {
        retryCount++;
        if (retryCount % 10 === 0) {
          logger.info(`searchForNode: Still waiting for file "${fileName}" after ${retryCount} retries (max ${retryLimit}).`);
        }
        if (retryCount >= retryLimit) {
          logger.error(`searchForNode: File "${fileName}" not found after ${retryLimit} retries.`);
          throw new Error(`File with name ${fileName} not found after ${retryLimit} retries`);
        }
        await Utils.delayInSeconds(1);
      }
    } while ((result.list?.entries?.length ?? 0) === 0);

    logger.info(`searchForNode: Search succeeded for file "${fileName}"`);
    return result;
  }

  async getTotalItems(username: string): Promise<number> {
    return (await this.querySearchFiles(username)).list?.pagination?.totalItems ?? 0;
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

      return await Utils.retryCall(searchFiles);
    } catch {}
  }

  async waitForFolderPathIndexing(folderId: string, options: { nodesExpected: number }, maxRetries?: number): Promise<number> {
    try {
      const query: SearchRequest = {
        query: {
          query: `ANCESTOR:'workspace://SpacesStore/${folderId}' and TYPE:content`,
          language: 'afts'
        }
      };

      const retryLimit = maxRetries ?? 100;
      let retryCount = 0;
      let result: ResultSetPaging;

      do {
        result = await this.apiService.search.search(query);
        const currentCount = result.list?.pagination?.count ?? 0;

        if (currentCount !== options.nodesExpected) {
          retryCount++;

          if (retryCount % 30 === 0) {
            logger.info(
              `waitForFolderPathIndexing: After ${retryCount} seconds, expected ${options.nodesExpected} nodes but found ${currentCount} in folder ${folderId}`
            );
          }

          if (retryCount >= retryLimit) {
            const message = `Expected ${options.nodesExpected} nodes but found ${currentCount} after ${retryLimit} retries`;
            logger.error(message);
            throw new Error(message);
          }

          await Utils.delayInSeconds(1);
        }
      } while (result.list?.pagination?.count !== options.nodesExpected);

      logger.info(`waitForFolderPathIndexing: Found expected ${options.nodesExpected} nodes in folder ${folderId}`);
      return result.list?.pagination?.count ?? 0;
    } catch (error) {
      const errorMessage = `waitForFolderPathIndexing failed for folderId "${folderId}": ${JSON.stringify(error)}`;
      logger.error(errorMessage);
      throw new Error(errorMessage);
    }
  }

  async waitFileForSearchIndexing(fileName: string, maxRetries?: number): Promise<void> {
    try {
      const result = await this.searchForNode(fileName, { maxRetries: maxRetries });
      const entryNames = (result.list?.entries ?? []).map((entry) => entry.entry?.name).filter((name): name is string => Boolean(name));
      if (!entryNames.includes(fileName)) {
        throw new Error(`File "${fileName}" not found in search results. Found: [${entryNames.join(', ')}]`);
      }
      logger.info(`waitFileForSearchIndexing: File "${fileName}" is indexed.`);
    } catch (error) {
      const errorMessage = `waitFileForSearchIndexing failed for file "${fileName}": ${JSON.stringify(error)}`;
      logger.error(errorMessage);
      throw new Error(errorMessage);
    }
  }
}
