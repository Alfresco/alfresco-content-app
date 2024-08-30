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

import * as fs from 'fs';
import { ApiClientFactory } from './api-client-factory';
import { Utils } from '../utils';
import { NodeBodyCreate, NodeEntry, ResultSetPaging } from '@alfresco/js-api';
import { waitForApi } from '@alfresco/playwright-shared';

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

  async uploadFile(fileLocation: string, fileName: string, parentFolderId: string): Promise<NodeEntry> {
    const file = fs.createReadStream(fileLocation);
    return this.apiService.upload.uploadFile(file, '', parentFolderId, null, {
      name: fileName,
      nodeType: 'cm:content',
      renditions: 'doclib'
    });
  }

  async uploadFileWithRename(
    fileLocation: string,
    newName: string,
    parentId: string = '-my-',
    title: string = '',
    description: string = ''
  ): Promise<NodeEntry> {
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
      return this.apiService.upload.uploadFile(file, '', parentId, nodeProps, opts);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async lockNodes(nodeIds: string[], lockType: string = 'ALLOW_OWNER_CHANGES'): Promise<void> {
    try {
      for (const nodeId of nodeIds) {
        await this.apiService.nodes.lockNode(nodeId, { type: lockType });
      }
    } catch {}
  }

  async getNodeById(id: string): Promise<NodeEntry | null> {
    try {
      return this.apiService.nodes.getNode(id);
    } catch {
      return null;
    }
  }

  async getNodeProperty(nodeId: string, property: string): Promise<string> {
    try {
      const node = await this.getNodeById(nodeId);
      return node.entry.properties?.[property] || '';
    } catch {
      return '';
    }
  }

  private async getLockType(nodeId: string): Promise<string> {
    try {
      const lockType = await this.getNodeProperty(nodeId, 'cm:lockType');
      return lockType || '';
    } catch {
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
      return Utils.retryCall(locked, data.retry);
    } catch {}
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
    } catch {
      return new ResultSetPaging();
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
      await waitForApi(apiCall, predicate, 30, 2500);
    } catch (error) {
      console.error(`Error: ${error}`);
    }
  }

  async updateNodeContent(nodeId: string, content: string, majorVersion: boolean = true, comment?: string, newName?: string): Promise<NodeEntry> {
    try {
      const opts: { [key: string]: string | boolean } = {
        majorVersion: majorVersion,
        comment: comment,
        name: newName
      };
      return this.apiService.nodes.updateNodeContent(nodeId, content, opts);
    } catch (error) {
      console.error(`${this.constructor.name} ${this.updateNodeContent.name}`, error);
      return Promise.reject(error);
    }
  }
}
