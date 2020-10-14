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

import { AlfrescoApi, Comment, CommentsApi, NodesApi, TrashcanApi, SitesApi, SharedlinksApi, FavoritesApi } from '@alfresco/js-api';
import { browser } from 'protractor';
import { Utils } from './utils';

export type NodeType = 'file' | 'folder' | 'site';

export class UserActions {
  protected readonly alfrescoApi: AlfrescoApi;

  readonly commentsApi: CommentsApi;
  readonly nodesApi: NodesApi;
  readonly trashcanApi: TrashcanApi;
  readonly sitesApi: SitesApi;
  readonly sharedLinksApi: SharedlinksApi;
  readonly favoritesApi: FavoritesApi;

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
    this.favoritesApi = new FavoritesApi(this.alfrescoApi);
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
   * Returns the amount of deleted nodes in the trashcan.
   * TODO: limited to 1000 items only, needs improvements.
   */
  async getTrashcanSize(): Promise<number> {
    const response = await this.trashcanApi.listDeletedNodes({
      maxItems: 1000
    });

    return response?.list?.pagination?.totalItems || 0;
  }

  /**
   * Performs multiple calls to retrieve the size of the trashcan until the expectedSize is reached.
   * Used with eventual consistency calls.
   * @param expectedSize Size of the trashcan to wait for.
   */
  async waitForTrashcanSize(expectedSize: number): Promise<number> {
    return Utils.retryCall(async () => {
      const totalItems = await this.getTrashcanSize();

      if (totalItems !== expectedSize) {
        return Promise.reject(totalItems);
      } else {
        return Promise.resolve(totalItems);
      }
    });
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

  /**
   * Delete all Sites/Libraries for the logged in user.
   * @param permanent Delete permanently, without moving to the trashcan? (default: true)
   */
  async deleteAllSites(permanent: boolean = true) {
    const sites = await this.sitesApi.listSiteMembershipsForPerson(this.username);
    const siteIds = sites.list.entries.map((entries) => entries.entry.id);

    await this.deleteSites(siteIds, permanent);
  }

  /**
   * Creates shared links for the given nodes.
   * @param nodeIds The list of node IDs to share.
   * @param expiresAt (optional) Expiration date.
   */
  async shareNodes(nodeIds: string[], expiresAt?: Date): Promise<any> {
    if (nodeIds && nodeIds.length > 0) {
      for (const nodeId of nodeIds) {
        await this.sharedLinksApi.createSharedLink({
          nodeId,
          expiresAt
        });
      }
    }
  }

  /**
   * Returns the size of the Shared Links query response.
   */
  async getSharedLinksSize(): Promise<number> {
    const sharedList = await this.sharedLinksApi.listSharedLinks({ maxItems: 250 });
    return sharedList?.list?.entries?.length || 0;
  }

  /**
   * Fetches the node and returns a property value by the property name.
   * @param nodeId The node ID to fetch
   * @param property The property value to return.
   */
  async getNodeProperty(nodeId: string, property: string): Promise<string> {
    const node = await this.nodesApi.getNode(nodeId);
    return node?.entry?.properties?.[property] || '';
  }

  /**
   * Adds multiple nodes of a particular type to the favorites.
   * @param nodeType Type of the node
   * @param nodeIds The node IDs to add to favorites
   */
  async createFavorites(nodeType: NodeType, nodeIds: string[]) {
    if (nodeIds && nodeIds.length > 0) {
      for (const nodeId of nodeIds) {
        let guid = nodeId;

        if (nodeType === 'site') {
          const site = await this.sitesApi.getSite(nodeId);
          guid = site.entry.guid;
        }

        await this.favoritesApi.createFavorite('-me-', {
          target: {
            [nodeType]: {
              guid
            }
          }
        });
      }
    }
  }

  /**
   * Removes multiple nodes from the favorites.
   * @param nodeIds The list of the node IDs to remove from favorites.
   */
  async deleteFavorites(nodeIds: string[]) {
    if (nodeIds && nodeIds.length > 0) {
      for (const nodeId of nodeIds) {
        await this.favoritesApi.deleteFavorite('-me-', nodeId);
      }
    }
  }
}
