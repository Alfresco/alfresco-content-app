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
 * along with Alfresco. If not, see <http://www.gnu.org/licenses/>.
 */

import * as fs from 'fs';
import { ApiClientFactory } from './api-client-factory';
import { Utils } from '../utils';
import { ApiUtil, Logger } from '@alfresco/adf-testing';
import { NodeBodyCreate, NodeEntry, ResultSetPaging } from '@alfresco/js-api';

export class FileActionsApi {
  private apiService: ApiClientFactory;

  constructor() {
    this.apiService = new ApiClientFactory();
  }

  static async initialize(userName: string, password?: string): Promise<FileActionsApi> {
    const classObj = new FileActionsApi();
    await classObj.apiService.setUpAcaBackend(userName, password);
    return classObj;
  }

  async uploadFile(fileLocation: string, fileName: string, parentFolderId: string): Promise<any> {
    const file = fs.createReadStream(fileLocation);
    return this.apiService.upload.uploadFile(file, '', parentFolderId, null, {
      name: fileName,
      nodeType: 'cm:content',
      renditions: 'doclib'
    });
  }

  async uploadFileWithRename(fileLocation: string, parentId: string = '-my-', newName: string, title: string = '', description: string = '') {
    const file = fs.createReadStream(fileLocation);
    const nodeProps = {
      properties: {
        'cm:title': title,
        'cm:description': description
      }
    } as NodeBodyCreate;

    const opts = {
      name: newName,
      nodeType: 'cm:content'
    };

    try {
      return await this.apiService.upload.uploadFile(file, '', parentId, nodeProps, opts);
    } catch (error) {
      Logger.error(`${this.constructor.name} ${this.uploadFileWithRename.name}`, error);
    }
  }

  async lockNodes(nodeIds: string[], lockType: string = 'ALLOW_OWNER_CHANGES') {
    try {
      for (const nodeId of nodeIds) {
        await this.apiService.nodes.lockNode(nodeId, { type: lockType });
      }
    } catch (error) {
      Logger.error(`${this.constructor.name} ${this.lockNodes.name}`, error);
    }
  }

  async getNodeById(id: string): Promise<NodeEntry | null> {
    try {
      return await this.apiService.nodes.getNode(id);
    } catch (error) {
      Logger.error(`${this.constructor.name} ${this.getNodeById.name}`, error);
      return null;
    }
  }

  async getNodeProperty(nodeId: string, property: string): Promise<string> {
    try {
      const node = await this.getNodeById(nodeId);
      return (node.entry.properties && node.entry.properties[property]) || '';
    } catch (error) {
      Logger.error(`${this.constructor.name} ${this.getNodeProperty.name}`, error);
      return '';
    }
  }

  private async getLockType(nodeId: string): Promise<string> {
    try {
      const lockType = await this.getNodeProperty(nodeId, 'cm:lockType');
      return lockType || '';
    } catch (error) {
      Logger.error(`${this.constructor.name} ${this.getLockType.name}`, error);
      return '';
    }
  }

  async isFileLockedWriteWithRetry(nodeId: string, expect: boolean): Promise<boolean> {
    const data = {
      expect: expect,
      retry: 5
    };
    let isLocked = false;
    try {
      const locked = async () => {
        isLocked = (await this.getLockType(nodeId)) === 'WRITE_LOCK';
        if (isLocked !== data.expect) {
          return Promise.reject(isLocked);
        } else {
          return Promise.resolve(isLocked);
        }
      };
      return await Utils.retryCall(locked, data.retry);
    } catch (error) {
      Logger.error(`${this.constructor.name} ${this.isFileLockedWriteWithRetry.name}`, error);
    }
    return isLocked;
  }

  private async queryNodesNames(searchTerm: string): Promise<ResultSetPaging> {
    const data = {
      query: {
        query: `cm:name:\"${searchTerm}*\"`,
        language: 'afts'
      },
      filterQueries: [{ query: `+TYPE:'cm:folder' OR +TYPE:'cm:content'` }]
    };

    try {
      return this.apiService.search.search(data);
    } catch (error) {
      Logger.error(`SearchApi queryNodesNames : catch : `, error);
      return new ResultSetPaging;
    }
  }

  async waitForNodes(searchTerm: string, data: { expect: number }): Promise<void> {
    const predicate = (totalItems: number) => totalItems === data.expect;

    const apiCall = async () => {
      try {
        return (await this.queryNodesNames(searchTerm)).list.pagination.totalItems;
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
