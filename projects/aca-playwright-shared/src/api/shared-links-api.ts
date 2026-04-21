/*!
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { SharedLinkEntry, SharedLinkPaging } from '@alfresco/js-api';
import { logger, Utils } from '../utils';

export class SharedLinksApi {
  private readonly apiService: ApiClientFactory;

  constructor() {
    this.apiService = new ApiClientFactory();
  }
  static async initialize(userName: string, password?: string): Promise<SharedLinksApi> {
    const classObj = new SharedLinksApi();
    await classObj.apiService.setUpAcaBackend(userName, password);
    return classObj;
  }

  async shareFileById(id: string, expireDate?: Date): Promise<SharedLinkEntry | null> {
    try {
      const data = {
        nodeId: id,
        expiresAt: expireDate
      };
      return await this.apiService.share.createSharedLink(data);
    } catch (error) {
      return null;
    }
  }

  async shareFilesByIds(ids: string[], expireDate?: Date): Promise<SharedLinkEntry[]> {
    const sharedLinks: SharedLinkEntry[] = [];
    try {
      if (ids && ids.length > 0) {
        for (const id of ids) {
          const sharedLink = await this.shareFileById(id, expireDate);
          if (sharedLink) {
            sharedLinks.push(sharedLink);
          }
        }
      }
    } catch (error) {
      logger.error(`SharedLinksApi shareFilesByIds : catch : ${error}`);
    }
    return sharedLinks;
  }

  private async getSharedLinks(maxItems: number = 250): Promise<SharedLinkPaging> {
    try {
      const opts = {
        maxItems
      };
      return await this.apiService.share.listSharedLinks(opts);
    } catch (error) {
      logger.error(`SharedLinksApi getSharedLinks : catch : ${error}`);
      return new SharedLinkPaging();
    }
  }

  async waitForFilesToBeShared(fileIds: string[]): Promise<void> {
    try {
      const sharedFile = async () => {
        const sharedFiles = (await this.getSharedLinks()).list?.entries?.map((link) => link.entry.nodeId) ?? [];
        const foundItems = fileIds.every((id) => sharedFiles.includes(id));
        if (foundItems) {
          return Promise.resolve(foundItems);
        } else {
          return Promise.reject(foundItems);
        }
      };

      return await Utils.retryCall(sharedFile);
    } catch (error) {
      logger.error(`SharedLinksApi waitForFilesToBeShared : catch : ${error} - Wait timeout reached waiting for files to be shared`);
    }
  }

  private async getSharedIdOfNode(fileId: string): Promise<string> {
    const sharedLinksEntries = (await this.getSharedLinks())?.list?.entries ?? [];
    const found = sharedLinksEntries.find((sharedLink) => sharedLink.entry.nodeId === fileId);
    if (!found?.entry.id) {
      const message = `SharedLinksApi getSharedIdOfNode: no shared link found for node ${fileId}`;
      logger.error(message);
      throw new Error(message);
    }
    return found.entry.id;
  }

  async unshareFileById(fileId: string): Promise<void> {
    try {
      const sharedId = await this.getSharedIdOfNode(fileId);
      return await this.apiService.share.deleteSharedLink(sharedId);
    } catch (error) {
      logger.error(`SharedLinksApi unshareFileById : catch : ${error}`);
    }
  }

  async waitForFilesToNotBeShared(fileIds: string[]): Promise<any> {
    try {
      const sharedFile = async () => {
        const sharedFiles = (await this.getSharedLinks()).list?.entries?.map((link) => link.entry.nodeId) ?? [];

        const foundItems = fileIds.some((id) => {
          return sharedFiles.includes(id);
        });

        if (foundItems) {
          return Promise.reject(foundItems);
        } else {
          return Promise.resolve(foundItems);
        }
      };

      return await Utils.retryCall(sharedFile);
    } catch (error) {
      logger.error(`SharedLinksApi waitForFilesToNotBeShared : catch : ${error} - Wait timeout reached waiting for files to no longer be shared`);
    }
  }
}
