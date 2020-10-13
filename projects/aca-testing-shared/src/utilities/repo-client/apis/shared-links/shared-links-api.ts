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
import { SharedlinksApi as AdfSharedlinksApi } from '@alfresco/js-api';

export class SharedLinksApi extends RepoApi {
  sharedlinksApi = new AdfSharedlinksApi(this.alfrescoJsApi);

  constructor(username?: string, password?: string) {
    super(username, password);
  }

  async shareFilesByIds(ids: string[]) {
    try {
      await this.apiAuth();
      for (const nodeId of ids) {
        await this.sharedlinksApi.createSharedLink({ nodeId });
      }
    } catch (error) {
      this.handleError(`SharedLinksApi shareFilesByIds : catch : `, error);
    }
  }

  private async findSharedNode(name: string): Promise<string> {
    const sharedLinks = await this.sharedlinksApi.listSharedLinks({ maxItems: 250 });
    const sharedLinksEntries = sharedLinks?.list?.entries || [];
    const found = sharedLinksEntries.find((sharedLink) => sharedLink.entry.name === name);
    return found?.entry?.id || null;
  }

  async unshareFile(name: string) {
    try {
      await this.apiAuth();
      const id = await this.findSharedNode(name);
      return await this.sharedlinksApi.deleteSharedLink(id);
    } catch (error) {
      this.handleError(`SharedLinksApi unshareFile : catch : `, error);
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
