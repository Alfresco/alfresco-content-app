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

import { Logger } from '@alfresco/adf-testing';
import { AlfrescoApi, Comment, CommentsApi, NodesApi, TrashcanApi, SitesApi, SharedlinksApi } from '@alfresco/js-api';
import { browser } from 'protractor';
import { Utils } from './utils';

export class UserActions {
  protected readonly alfrescoApi: AlfrescoApi;

  readonly commentsApi: CommentsApi;
  readonly nodesApi: NodesApi;
  readonly trashcanApi: TrashcanApi;
  readonly sitesApi: SitesApi;
  readonly sharedLinksApi: SharedlinksApi;

  protected username: string;
  protected password: string;

  constructor() {
    this.alfrescoApi = new AlfrescoApi();
    this.alfrescoApi.setConfig(browser.params.config);

    this.commentsApi = new CommentsApi(this.alfrescoApi);
    this.nodesApi = new NodesApi(this.alfrescoApi);
    this.trashcanApi = new TrashcanApi(this.alfrescoApi);
    this.sitesApi = new SitesApi(this.alfrescoApi);
    this.sharedLinksApi = new SharedlinksApi(this.alfrescoApi);
  }

  async login(username: string, password: string) {
    this.username = username || this.username;
    this.password = password || this.password;

    try {
      return this.alfrescoApi.login(this.username, this.password);
    } catch (error) {
      this.handleError('User Actions - login failed : ', error);
    }
  }

  async logout(): Promise<any> {
    try {
      await this.alfrescoApi.login(this.username, this.password);
      return this.alfrescoApi.logout();
    } catch (error) {
      this.handleError('User Actions - logout failed : ', error);
    }
  }

  async createComment(nodeId: string, content: string): Promise<Comment | null> {
    try {
      const comment = await this.commentsApi.createComment(nodeId, { content });
      return comment?.entry;
    } catch (error) {
      this.handleError('User Actions - createComment failed : ', error);
      return null;
    }
  }

  /**
   * Delete multiple nodes.
   * @param nodeIds The list of node IDs to delete.
   * @param permanent Delete permanently, without moving to the trashcan? (default: true)
   */
  async deleteNodes(nodeIds: string[], permanent: boolean = true): Promise<any> {
    try {
      for (const nodeId of nodeIds) {
        await this.nodesApi.deleteNode(nodeId, { permanent });
      }
    } catch (error) {
      this.handleError('User Actions - deleteNodes failed : ', error);
    }
  }

  /**
   * Empties the trashcan. Uses multiple batches 1000 nodes each.
   */
  async emptyTrashcan(): Promise<any> {
    try {
      const nodes = await this.trashcanApi.listDeletedNodes({
        maxItems: 1000
      });

      if (nodes?.list?.entries && nodes?.list?.entries?.length > 0) {
        const ids = nodes.list.entries.map((entries) => entries.entry.id);

        for (const nodeId of ids) {
          await this.trashcanApi.deleteDeletedNode(nodeId);
        }

        await this.emptyTrashcan();
      }
    } catch (error) {
      this.handleError('User Actions - emptyTrashcan failed : ', error);
    }
  }

  /**
   * Returns the amount of deleted nodes in the trashcan.
   * TODO: limited to 1000 items only, needs improvements.
   */
  async getTrashcanSize(): Promise<number> {
    try {
      const response = await this.trashcanApi.listDeletedNodes({
        maxItems: 1000
      });

      return response?.list?.pagination?.totalItems || 0;
    } catch (error) {
      this.handleError('User Actions - getTrashcanSize failed : ', error);
      return -1;
    }
  }

  /**
   * Performs multiple calls to retrieve the size of the trashcan until the expectedSize is reached.
   * Used with eventual consistency calls.
   * @param expectedSize Size of the trashcan to wait for.
   */
  async waitForTrashcanSize(expectedSize: number): Promise<number> {
    try {
      return Utils.retryCall(async () => {
        const totalItems = await this.getTrashcanSize();

        if (totalItems !== expectedSize) {
          return Promise.reject(totalItems);
        } else {
          return Promise.resolve(totalItems);
        }
      });
    } catch (error) {
      this.handleError('User Actions - waitForTrashcanSize failed : ', error);
      return -1;
    }
  }

  /**
   * Unlock multiple nodes.
   * @param nodeIds The list of node IDs to unlock.
   */
  async unlockNodes(nodeIds: string[]): Promise<any> {
    try {
      for (const nodeId of nodeIds) {
        await this.nodesApi.unlockNode(nodeId);
      }
    } catch (error) {
      this.handleError('User Actions - unlockNodes failed : ', error);
    }
  }

  /**
   * Delete multiple sites/libraries.
   * @param siteIds The list of the site/library IDs to delete.
   * @param permanent Delete permanently, without moving to the trashcan? (default: true)
   */
  async deleteSites(siteIds: string[], permanent: boolean = true) {
    try {
      if (siteIds && siteIds.length > 0) {
        for (const siteId of siteIds) {
          await this.sitesApi.deleteSite(siteId, { permanent });
        }
      }
    } catch (error) {
      this.handleError('User Actions - deleteSites failed : ', error);
    }
  }

  /**
   * Creates shared links for the given nodes.
   * @param nodeIds The list of node IDs to share.
   * @param expiresAt (optional) Expiration date.
   */
  async shareNodes(nodeIds: string[], expiresAt?: Date): Promise<any> {
    try {
      for (const nodeId of nodeIds) {
        await this.sharedLinksApi.createSharedLink({
          nodeId,
          expiresAt
        });
      }
    } catch (error) {
      this.handleError('User Actions - shareNodes failed : ', error);
    }
  }

  protected handleError(message: string, response: any) {
    Logger.error(`\n--- ${message} error :`);
    Logger.error('\t>>> username: ', this.username);
    Logger.error('\t>>> JSON: ', JSON.stringify(browser.params.config));
    if (response.status && response.response) {
      try {
        Logger.error('\t>>> Status: ', response.status);
        Logger.error('\t>>> Text: ', response.response.text);
        Logger.error('\t>>> Method: ', response.response.error.method);
        Logger.error('\t>>> Path: ', response.response.error.path);
      } catch {
        Logger.error('\t>>> ', response);
      }
    } else Logger.error('\t>>> ', response);
  }
}
