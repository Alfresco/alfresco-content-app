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
import { AlfrescoApiService, UserPreferencesService } from '@alfresco/adf-core';
import { Observable } from 'rxjs';
import {
  MinimalNodeEntity,
  NodePaging,
  Node,
  DeletedNodesPaging,
  PersonEntry,
  NodeEntry,
  DiscoveryEntry,
  FavoritePaging,
  SharedLinkPaging,
  SearchRequest,
  ResultSetPaging,
  SiteBody,
  SiteEntry,
  FavoriteEntry
} from '@alfresco/js-api';
export declare class ContentApiService {
  private api;
  private preferences;
  constructor(api: AlfrescoApiService, preferences: UserPreferencesService);
  /**
   * Moves a node to the trashcan.
   * @param nodeId ID of the target node
   * @param options Optional parameters supported by JS-API
   * @returns Empty result that notifies when the deletion is complete
   */
  deleteNode(
    nodeId: string,
    options?: {
      permanent?: boolean;
    }
  ): Observable<void>;
  /**
   * Gets the stored information about a node.
   * @param nodeId ID of the target node
   * @param options Optional parameters supported by JS-API
   * @returns Node information
   */
  getNode(nodeId: string, options?: any): Observable<MinimalNodeEntity>;
  getNodeInfo(nodeId: string, options?: any): Observable<Node>;
  /**
   * Gets the items contained in a folder node.
   * @param nodeId ID of the target node
   * @param options Optional parameters supported by JS-API
   * @returns List of child items from the folder
   */
  getNodeChildren(nodeId: string, options?: any): Observable<NodePaging>;
  deleteSharedLink(linkId: string): Observable<any>;
  getDeletedNodes(options?: any): Observable<DeletedNodesPaging>;
  restoreNode(nodeId: string): Observable<MinimalNodeEntity>;
  purgeDeletedNode(nodeId: string): Observable<any>;
  /**
   * Gets information about a user identified by their username.
   * @param personId ID of the target user
   * @returns User information
   */
  getPerson(
    personId: string,
    options?: {
      fields?: Array<string>;
    }
  ): Observable<PersonEntry>;
  /**
   * Copy a node to destination node
   *
   * @param nodeId The id of the node to be copied
   * @param targetParentId The id of the folder-node where the node have to be copied to
   * @param name The new name for the copy that would be added on the destination folder
   */
  copyNode(
    nodeId: string,
    targetParentId: string,
    name?: string,
    opts?: {
      include?: Array<string>;
      fields?: Array<string>;
    }
  ): Observable<NodeEntry>;
  /**
   * Gets product information for Content Services.
   * @returns ProductVersionModel containing product details
   */
  getRepositoryInformation(): Observable<DiscoveryEntry>;
  getFavorites(
    personId: string,
    opts?: {
      skipCount?: number;
      maxItems?: number;
      where?: string;
      fields?: Array<string>;
    }
  ): Observable<FavoritePaging>;
  getFavoriteLibraries(
    personId?: string,
    opts?: any
  ): Observable<FavoritePaging>;
  findSharedLinks(opts?: any): Observable<SharedLinkPaging>;
  getSharedLinkContent(sharedId: string, attachment?: boolean): string;
  search(request: SearchRequest): Observable<ResultSetPaging>;
  getContentUrl(nodeId: string, attachment?: boolean): string;
  deleteSite(
    siteId?: string,
    opts?: {
      permanent?: boolean;
    }
  ): Observable<any>;
  leaveSite(siteId?: string): Observable<any>;
  createSite(
    siteBody: SiteBody,
    opts?: {
      fields?: Array<string>;
      skipConfiguration?: boolean;
      skipAddToFavorites?: boolean;
    }
  ): Observable<SiteEntry>;
  getSite(
    siteId?: string,
    opts?: {
      relations?: Array<string>;
      fields?: Array<string>;
    }
  ): Observable<SiteEntry>;
  updateLibrary(siteId: string, siteBody: SiteBody): Observable<SiteEntry>;
  addFavorite(nodes: Array<MinimalNodeEntity>): Observable<FavoriteEntry>;
  removeFavorite(nodes: Array<MinimalNodeEntity>): Observable<any>;
  unlockNode(nodeId: string, opts?: any): Promise<MinimalNodeEntity>;
}
