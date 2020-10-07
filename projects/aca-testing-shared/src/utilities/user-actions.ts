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

import { AlfrescoApi, Comment, CommentsApi, NodesApi, TrashcanApi, SitesApi } from '@alfresco/js-api';
import { browser } from 'protractor';

export class UserActions {
  protected readonly alfrescoApi: AlfrescoApi;

  readonly commentsApi: CommentsApi;
  readonly nodesApi: NodesApi;
  readonly trashcanApi: TrashcanApi;
  readonly sitesApi: SitesApi;

  protected username: string;
  protected password: string;

  constructor() {
    this.alfrescoApi = new AlfrescoApi();
    this.alfrescoApi.setConfig(browser.params.config);

    this.commentsApi = new CommentsApi(this.alfrescoApi);
    this.nodesApi = new NodesApi(this.alfrescoApi);
    this.trashcanApi = new TrashcanApi(this.alfrescoApi);
    this.sitesApi = new SitesApi(this.alfrescoApi);
  }

  async login(username: string, password: string) {
    this.username = username || this.username;
    this.password = password || this.password;

    return this.alfrescoApi.login(this.username, this.password);
  }

  async logout(): Promise<any> {
    await this.alfrescoApi.login(this.username, this.password);
    return this.alfrescoApi.logout();
  }

  async createComment(nodeId: string, content: string): Promise<Comment> {
    const comment = await this.commentsApi.createComment(nodeId, { content });
    return comment?.entry;
  }

  /**
   * Delete multiple nodes.
   * @param nodeIds The list of node IDs to delete.
   * @param permanent Delete permanently, without moving to the trashcan? (default: true)
   */
  async deleteNodes(nodeIds: string[], permanent: boolean = true): Promise<any> {
    for (const nodeId of nodeIds) {
      await this.nodesApi.deleteNode(nodeId, { permanent });
    }
  }

  /**
   * Empties the trashcan. Uses multiple batches 1000 nodes each.
   */
  async emptyTrashcan(): Promise<any> {
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
  }

  /**
   * Unlock multiple nodes.
   * @param nodeIds The list of node IDs to unlock.
   */
  async unlockNodes(nodeIds: string[]): Promise<any> {
    for (const nodeId of nodeIds) {
      await this.nodesApi.unlockNode(nodeId);
    }
  }

  /**
   * Delete multiple sites/libraries.
   * @param siteIds The list of the site/library IDs to delete.
   * @param permanent Delete permanently, without moving to the trashcan? (default: true)
   */
  async deleteSites(siteIds: string[], permanent: boolean = true) {
    if (siteIds && siteIds.length > 0) {
      for (const siteId of siteIds) {
        await this.sitesApi.deleteSite(siteId, { permanent });
      }
    }
  }
}
