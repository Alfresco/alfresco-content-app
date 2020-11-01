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
import { SharedlinksApi as AdfSharedlinksApi, SharedLinkEntry } from '@alfresco/js-api';

export class SharedLinksApi extends RepoApi {
  sharedlinksApi = new AdfSharedlinksApi(this.api.getInstance());

  async shareFileById(id: string, expireDate?: Date): Promise<SharedLinkEntry | null> {
    try {
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

  async shareFilesByIds(ids: string[]) {
    try {
      return await ids.reduce(async (previous: any, current: any) => {
        await previous;
        return this.shareFileById(current);
      }, Promise.resolve());
    } catch (error) {
      this.handleError(`SharedLinksApi shareFilesByIds : catch : `, error);
    }
  }

  async getSharedIdOfNode(name: string): Promise<string> {
    try {
      const sharedLinksEntries = (await this.getSharedLinks())?.list.entries;
      const found = sharedLinksEntries.find((sharedLink) => sharedLink.entry.name === name);
      return (found || { entry: { id: null } }).entry.id;
    } catch (error) {
      this.handleError(`SharedLinksApi getSharedIdOfNode : catch : `, error);
      return null;
    }
  }

  async unshareFile(name: string) {
    try {
      const id = await this.getSharedIdOfNode(name);
      return await this.sharedlinksApi.deleteSharedLink(id);
    } catch (error) {
      this.handleError(`SharedLinksApi unshareFile : catch : `, error);
    }
  }

  async getSharedLinks() {
    try {
      const opts = {
        maxItems: 250
      };
      return await this.sharedlinksApi.listSharedLinks(opts);
    } catch (error) {
      this.handleError(`SharedLinksApi getSharedLinks : catch : `, error);
      return null;
    }
  }

  async getSharedLinksTotalItems(): Promise<number> {
    try {
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

  async waitForApi(data: { expect: number }) {
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
}
