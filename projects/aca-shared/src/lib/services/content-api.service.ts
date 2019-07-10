/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2019 Alfresco Software Limited
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

import { Injectable } from '@angular/core';
import { AlfrescoApiService, UserPreferencesService } from '@alfresco/adf-core';
import { Observable, from } from 'rxjs';
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
  FavoriteBody,
  FavoriteEntry
} from '@alfresco/js-api';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ContentApiService {
  constructor(
    private api: AlfrescoApiService,
    private preferences: UserPreferencesService
  ) {}

  /**
   * Moves a node to the trashcan.
   * @param nodeId ID of the target node
   * @param options Optional parameters supported by JS-API
   * @returns Empty result that notifies when the deletion is complete
   */
  deleteNode(
    nodeId: string,
    options: { permanent?: boolean } = {}
  ): Observable<void> {
    return from(this.api.nodesApi.deleteNode(nodeId, options));
  }

  /**
   * Gets the stored information about a node.
   * @param nodeId ID of the target node
   * @param options Optional parameters supported by JS-API
   * @returns Node information
   */
  getNode(nodeId: string, options: any = {}): Observable<MinimalNodeEntity> {
    const defaults = {
      include: ['path', 'properties', 'allowableOperations', 'permissions']
    };
    const queryOptions = Object.assign(defaults, options);

    return from(this.api.nodesApi.getNode(nodeId, queryOptions));
  }

  getNodeInfo(nodeId: string, options?: any): Observable<Node> {
    const defaults = {
      include: ['isFavorite', 'allowableOperations']
    };
    const queryOptions = Object.assign(defaults, options || {});

    return from(this.api.nodesApi.getNodeInfo(nodeId, queryOptions));
  }

  /**
   * Gets the items contained in a folder node.
   * @param nodeId ID of the target node
   * @param options Optional parameters supported by JS-API
   * @returns List of child items from the folder
   */
  getNodeChildren(nodeId: string, options: any = {}): Observable<NodePaging> {
    const defaults = {
      maxItems: this.preferences.paginationSize,
      skipCount: 0,
      include: [
        'isLocked',
        'path',
        'properties',
        'allowableOperations',
        'permissions'
      ]
    };
    const queryOptions = Object.assign(defaults, options);

    return from(this.api.nodesApi.getNodeChildren(nodeId, queryOptions));
  }

  deleteSharedLink(linkId: string): Observable<any> {
    return from(this.api.sharedLinksApi.deleteSharedLink(linkId));
  }

  getDeletedNodes(options: any = {}): Observable<DeletedNodesPaging> {
    const defaults = {
      include: ['path']
    };
    const queryOptions = Object.assign(defaults, options);

    return from(this.api.nodesApi.getDeletedNodes(queryOptions));
  }

  restoreNode(nodeId: string): Observable<MinimalNodeEntity> {
    return from(this.api.nodesApi.restoreNode(nodeId));
  }

  purgeDeletedNode(nodeId: string): Observable<any> {
    return from(this.api.nodesApi.purgeDeletedNode(nodeId));
  }

  /**
   * Gets information about a user identified by their username.
   * @param personId ID of the target user
   * @returns User information
   */
  getPerson(
    personId: string,
    options?: { fields?: Array<string> }
  ): Observable<PersonEntry> {
    return from(this.api.peopleApi.getPerson(personId, options));
  }

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
    opts?: { include?: Array<string>; fields?: Array<string> }
  ): Observable<NodeEntry> {
    return from(
      this.api.nodesApi.copyNode(nodeId, { targetParentId, name }, opts)
    );
  }

  /**
   * Gets product information for Content Services.
   * @returns ProductVersionModel containing product details
   */
  getRepositoryInformation(): Observable<DiscoveryEntry> {
    return from(
      this.api.getInstance().discovery.discoveryApi.getRepositoryInformation()
    );
  }

  getFavorites(
    personId: string,
    opts?: {
      skipCount?: number;
      maxItems?: number;
      where?: string;
      fields?: Array<string>;
    }
  ): Observable<FavoritePaging> {
    return from(this.api.favoritesApi.getFavorites(personId, opts));
  }

  getFavoriteLibraries(
    personId: string = '-me-',
    opts?: any
  ): Observable<FavoritePaging> {
    return this.getFavorites(personId, {
      ...opts,
      where: '(EXISTS(target/site))'
    }).pipe(
      map((response: FavoritePaging) => {
        return {
          list: {
            entries: response.list.entries.map(({ entry }: any) => {
              entry.target.site.createdAt = entry.createdAt;
              return {
                entry: entry.target.site
              };
            }),
            pagination: response.list.pagination
          }
        };
      })
    );
  }

  findSharedLinks(opts?: any): Observable<SharedLinkPaging> {
    return from(this.api.sharedLinksApi.findSharedLinks(opts));
  }

  getSharedLinkContent(sharedId: string, attachment?: boolean): string {
    return this.api.contentApi.getSharedLinkContentUrl(sharedId, attachment);
  }

  search(request: SearchRequest): Observable<ResultSetPaging> {
    return from(this.api.searchApi.search(request));
  }

  getContentUrl(nodeId: string, attachment?: boolean): string {
    return this.api.contentApi.getContentUrl(nodeId, attachment);
  }

  deleteSite(siteId?: string, opts?: { permanent?: boolean }): Observable<any> {
    return from(this.api.sitesApi.deleteSite(siteId, opts));
  }

  leaveSite(siteId?: string): Observable<any> {
    return from(this.api.sitesApi.removeSiteMember(siteId, '-me-'));
  }

  createSite(
    siteBody: SiteBody,
    opts?: {
      fields?: Array<string>;
      skipConfiguration?: boolean;
      skipAddToFavorites?: boolean;
    }
  ): Observable<SiteEntry> {
    return from(this.api.sitesApi.createSite(siteBody, opts));
  }

  getSite(
    siteId?: string,
    opts?: { relations?: Array<string>; fields?: Array<string> }
  ): Observable<SiteEntry> {
    return from(this.api.sitesApi.getSite(siteId, opts));
  }

  updateLibrary(siteId: string, siteBody: SiteBody): Observable<SiteEntry> {
    return from(this.api.sitesApi.updateSite(siteId, siteBody));
  }

  addFavorite(nodes: Array<MinimalNodeEntity>): Observable<FavoriteEntry> {
    const payload: FavoriteBody[] = nodes.map(node => {
      const { isFolder, nodeId, id } = <any>node.entry;
      const siteId = node.entry['guid'];
      const type = siteId ? 'site' : isFolder ? 'folder' : 'file';
      const guid = siteId || nodeId || id;

      return {
        target: {
          [type]: {
            guid
          }
        }
      };
    });

    return from(this.api.favoritesApi.addFavorite('-me-', <any>payload));
  }

  removeFavorite(nodes: Array<MinimalNodeEntity>): Observable<any> {
    return from(
      Promise.all(
        nodes.map((node: any) => {
          const id = node.entry.nodeId || node.entry.id;
          return this.api.favoritesApi.removeFavoriteSite('-me-', id);
        })
      )
    );
  }

  unlockNode(nodeId: string, opts?: any) {
    return this.api.nodesApi.unlockNode(nodeId, opts);
  }
}
