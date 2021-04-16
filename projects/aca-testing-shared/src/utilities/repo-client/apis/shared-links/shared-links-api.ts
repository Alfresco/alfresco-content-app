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
import { SharedlinksApi as AdfSharedlinksApi, SharedLinkEntry, SharedLinkPaging } from '@alfresco/js-api';

export class SharedLinksApi extends RepoApi {
  sharedlinksApi = new AdfSharedlinksApi(this.alfrescoJsApi);

  constructor(username?: string, password?: string) {
    super(username, password);
  }

  async shareFileById(id: string, expireDate?: Date): Promise<SharedLinkEntry | null> {
    try {
      await this.apiAuth();
      const data = {
        nodeId: id,
        expiresAt: expireDate
      };
      return await this.sharedlinksApi.createSharedLink(data);
    } catch (error) {
      this.handleError(`SharedLinksApi shareFileById : catch : `, error);
      return null;
    }
  }

  async shareFilesByIds(ids: string[]): Promise<SharedLinkEntry[]> {
    const sharedLinks: SharedLinkEntry[] = [];
    try {
      if (ids && ids.length > 0) {
        for (const id of ids) {
          const sharedLink = await this.shareFileById(id);
          sharedLinks.push(sharedLink);
        }
      }
    } catch (error) {
      this.handleError(`SharedLinksApi shareFilesByIds : catch : `, error);
    }
    return sharedLinks;
  }

  async getSharedIdOfNode(fileId: string): Promise<string> {
    try {
      const sharedLinksEntries = (await this.getSharedLinks())?.list.entries;
      const found = sharedLinksEntries.find((sharedLink) => sharedLink.entry.nodeId === fileId);
      return (found || { entry: { id: null } }).entry.id;
    } catch (error) {
      this.handleError(`SharedLinksApi getSharedIdOfNode : catch : `, error);
      return null;
    }
  }

  async unshareFileById(fileId: string): Promise<any> {
    try {
      const sharedId = await this.getSharedIdOfNode(fileId);
      return await this.sharedlinksApi.deleteSharedLink(sharedId);
    } catch (error) {
      this.handleError(`SharedLinksApi unshareFileById : catch : `, error);
    }
  }

  async getSharedLinks(maxItems: number = 250): Promise<SharedLinkPaging | null> {
    try {
      await this.apiAuth();
      const opts = {
        maxItems
      };
      return await this.sharedlinksApi.listSharedLinks(opts);
    } catch (error) {
      this.handleError(`SharedLinksApi getSharedLinks : catch : `, error);
      return null;
    }
  }

  async getSharedLinksTotalItems(): Promise<number> {
    try {
      await this.apiAuth();
      const opts = {
        maxItems: 250
      };
      const sharedList = await this.sharedlinksApi.listSharedLinks(opts);
      return sharedList.list.entries.length;
    } catch (error) {
      this.handleError(`SharedLinksApi getSharedLinksTotalItems : catch : `, error);
      return -1;
    }
  }

  async waitForApi(data: { expect: number }): Promise<any> {
    try {
      const sharedFiles = async () => {
        const totalItems = await this.getSharedLinksTotalItems();
        if (totalItems !== data.expect) {
          return Promise.reject(totalItems);
        } else {
          return Promise.resolve(totalItems);
        }
      };

      return await Utils.retryCall(sharedFiles);
    } catch (error) {
      Logger.error(`SharedLinksApi waitForApi :  catch : `);
      Logger.error(`\tExpected: ${data.expect} items, but found ${error}`);
    }
  }

  async waitForFilesToBeShared(filesIds: string[]): Promise<any> {
    try {
      const sharedFile = async () => {
        const sharedFiles = (await this.getSharedLinks()).list.entries.map((link) => link.entry.nodeId);
        const foundItems = filesIds.every((id) => sharedFiles.includes(id));
        if (foundItems) {
          return Promise.resolve(foundItems);
        } else {
          return Promise.reject(foundItems);
        }
      };

      return await Utils.retryCall(sharedFile);
    } catch (error) {
      Logger.error(`SharedLinksApi waitForFilesToBeShared :  catch : ${error}`);
      Logger.error(`\tWait timeout reached waiting for files to be shared`);
    }
  }

  async waitForFilesToNotBeShared(filesIds: string[]): Promise<any> {
    try {
      const sharedFile = async () => {
        const sharedFiles = (await this.getSharedLinks()).list.entries.map((link) => link.entry.nodeId);

        const foundItems = filesIds.some((id) => {
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
      Logger.error(`SharedLinksApi waitForFilesToNotBeShared :  catch : ${error}`);
      Logger.error(`\tWait timeout reached waiting for files to no longer be shared`);
    }
  }
}
