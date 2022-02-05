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
  FavoriteEntry,
  NodesApi,
  TrashcanApi,
  SharedlinksApi,
  DiscoveryApi,
  FavoritesApi,
  ContentApi,
  SitesApi,
  SearchApi,
  PeopleApi,
  VersionsApi,
  DirectAccessUrlEntry,
  VersionPaging
} from '@alfresco/js-api';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ContentApiService {
  _nodesApi: NodesApi;
  get nodesApi(): NodesApi {
    this._nodesApi = this._nodesApi ?? new NodesApi(this.api.getInstance());
    return this._nodesApi;
  }

  _trashcanApi: TrashcanApi;
  get trashcanApi(): TrashcanApi {
    this._trashcanApi = this._trashcanApi ?? new TrashcanApi(this.api.getInstance());
    return this._trashcanApi;
  }

  _sharedLinksApi: SharedlinksApi;
  get sharedLinksApi(): SharedlinksApi {
    this._sharedLinksApi = this._sharedLinksApi ?? new SharedlinksApi(this.api.getInstance());
    return this._sharedLinksApi;
  }

  _discoveryApi: DiscoveryApi;
  get discoveryApi(): DiscoveryApi {
    this._discoveryApi = this._discoveryApi ?? new DiscoveryApi(this.api.getInstance());
    return this._discoveryApi;
  }

  _favoritesApi: FavoritesApi;
  get favoritesApi(): FavoritesApi {
    this._favoritesApi = this._favoritesApi ?? new FavoritesApi(this.api.getInstance());
    return this._favoritesApi;
  }

  _contentApi: ContentApi;
  get contentApi(): ContentApi {
    this._contentApi = this._contentApi ?? new ContentApi(this.api.getInstance());
    return this._contentApi;
  }

  _sitesApi: SitesApi;
  get sitesApi(): SitesApi {
    this._sitesApi = this._sitesApi ?? new SitesApi(this.api.getInstance());
    return this._sitesApi;
  }

  _searchApi: SearchApi;
  get searchApi(): SearchApi {
    this._searchApi = this._searchApi ?? new SearchApi(this.api.getInstance());
    return this._searchApi;
  }

  _peopleApi: PeopleApi;
  get peopleApi(): PeopleApi {
    this._peopleApi = this._peopleApi ?? new PeopleApi(this.api.getInstance());
    return this._peopleApi;
  }

  _versionsApi: VersionsApi;
  get versionsApi(): VersionsApi {
    this._versionsApi = this._versionsApi ?? new VersionsApi(this.api.getInstance());
    return this._versionsApi;
  }
  constructor(private api: AlfrescoApiService, private preferences: UserPreferencesService) {}

  /**
   * Moves a node to the trashcan.
   *
   * @param nodeId ID of the target node
   * @param options Optional parameters supported by JS-API
   * @returns Empty result that notifies when the deletion is complete
   */
  deleteNode(nodeId: string, options: { permanent?: boolean } = {}): Observable<void> {
    return from(this.nodesApi.deleteNode(nodeId, options));
  }

  /**
   * Gets the stored information about a node.
   *
   * @param nodeId ID of the target node
   * @param options Optional parameters supported by JS-API
   * @returns Node information
   */
  getNode(nodeId: string, options: any = {}): Observable<MinimalNodeEntity> {
    const defaults = {
      include: ['path', 'properties', 'allowableOperations', 'permissions', 'definition']
    };
    const queryOptions = Object.assign(defaults, options);

    return from(this.nodesApi.getNode(nodeId, queryOptions));
  }

  getNodeInfo(nodeId: string, options?: any): Observable<Node> {
    const defaults = {
      include: ['isFavorite', 'allowableOperations', 'path', 'definition']
    };
    const queryOptions = Object.assign(defaults, options || {});

    // @ts-ignore
    return from(
      new Promise((resolve, reject) => {
        this.nodesApi.getNode(nodeId, queryOptions).then(
          (nodeEntry: NodeEntry) => {
            resolve(nodeEntry.entry);
          },
          (error) => {
            reject(error);
          }
        );
      })
    );
  }

  /**
   * Gets the items contained in a folder node.
   *
   * @param nodeId ID of the target node
   * @param options Optional parameters supported by JS-API
   * @returns List of child items from the folder
   */
  getNodeChildren(nodeId: string, options: any = {}): Observable<NodePaging> {
    const defaults = {
      maxItems: this.preferences.paginationSize,
      skipCount: 0,
      include: ['isLocked', 'path', 'properties', 'allowableOperations', 'permissions']
    };
    const queryOptions = Object.assign(defaults, options);

    return from(this.nodesApi.listNodeChildren(nodeId, queryOptions));
  }

  deleteSharedLink(linkId: string): Observable<any> {
    return from(this.sharedLinksApi.deleteSharedLink(linkId));
  }

  getDeletedNodes(options: any = {}): Observable<DeletedNodesPaging> {
    const defaults = {
      include: ['path']
    };
    const queryOptions = Object.assign(defaults, options);

    return from(this.trashcanApi.listDeletedNodes(queryOptions));
  }

  restoreNode(nodeId: string): Observable<MinimalNodeEntity> {
    return from(this.trashcanApi.restoreDeletedNode(nodeId));
  }

  purgeDeletedNode(nodeId: string): Observable<any> {
    return from(this.trashcanApi.deleteDeletedNode(nodeId));
  }

  /**
   * Gets information about a user identified by their username.
   *
   * @param personId ID of the target user
   * @param options Api options
   * @returns User information
   */
  getPerson(personId: string, options?: { fields?: Array<string> }): Observable<PersonEntry> {
    return from(this.peopleApi.getPerson(personId, options));
  }

  /**
   * Copy a node to destination node
   *
   * @param nodeId The id of the node to be copied
   * @param targetParentId The id of the folder-node where the node have to be copied to
   * @param name The new name for the copy that would be added on the destination folder
   * @param opts Api options
   */
  copyNode(nodeId: string, targetParentId: string, name?: string, opts?: { include?: Array<string>; fields?: Array<string> }): Observable<NodeEntry> {
    return from(this.nodesApi.copyNode(nodeId, { targetParentId, name }, opts));
  }

  /**
   * Gets product information for Content Services.
   *
   * @returns ProductVersionModel containing product details
   */
  getRepositoryInformation(): Observable<DiscoveryEntry> {
    return from(this.discoveryApi.getRepositoryInformation());
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
    return from(this.favoritesApi.listFavorites(personId, opts));
  }

  getFavoriteLibraries(personId: string = '-me-', opts?: any): Observable<FavoritePaging> {
    return this.getFavorites(personId, {
      ...opts,
      where: '(EXISTS(target/site))'
    }).pipe(
      map((response: FavoritePaging) => ({
        list: {
          entries: response.list.entries.map(({ entry }: any) => {
            entry.target.site.createdAt = entry.createdAt;
            return {
              entry: entry.target.site
            };
          }),
          pagination: response.list.pagination
        }
      }))
    );
  }

  findSharedLinks(opts?: any): Observable<SharedLinkPaging> {
    return from(this.sharedLinksApi.listSharedLinks(opts));
  }

  getSharedLinkContent(sharedId: string, attachment?: boolean): string {
    return this.contentApi.getSharedLinkContentUrl(sharedId, attachment);
  }

  search(request: SearchRequest): Observable<ResultSetPaging> {
    return from(this.searchApi.search(request));
  }

  getContentUrl(nodeId: string, attachment?: boolean): string {
    return this.contentApi.getContentUrl(nodeId, attachment);
  }

  getVersionContentUrl(nodeId: string, versionId: string, attachment?: boolean): string {
    return this.contentApi.getVersionContentUrl(nodeId, versionId, attachment);
  }

  deleteSite(siteId?: string, opts?: { permanent?: boolean }): Observable<any> {
    return from(this.sitesApi.deleteSite(siteId, opts));
  }

  leaveSite(siteId?: string): Observable<any> {
    return from(this.sitesApi.deleteSiteMembership(siteId, '-me-'));
  }

  createSite(
    siteBody: SiteBody,
    opts?: {
      fields?: Array<string>;
      skipConfiguration?: boolean;
      skipAddToFavorites?: boolean;
    }
  ): Observable<SiteEntry> {
    return from(this.sitesApi.createSite(siteBody, opts));
  }

  getSite(siteId?: string, opts?: { relations?: Array<string>; fields?: Array<string> }): Observable<SiteEntry> {
    return from(this.sitesApi.getSite(siteId, opts));
  }

  updateLibrary(siteId: string, siteBody: SiteBody): Observable<SiteEntry> {
    return from(this.sitesApi.updateSite(siteId, siteBody));
  }

  addFavorite(nodes: Array<MinimalNodeEntity>): Observable<FavoriteEntry> {
    const payload: FavoriteBody[] = nodes.map((node) => {
      const { isFolder, nodeId, id } = node.entry as any;
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

    return from(this.favoritesApi.createFavorite('-me-', payload as any));
  }

  removeFavorite(nodes: Array<MinimalNodeEntity>): Observable<any> {
    return from(
      Promise.all(
        nodes.map((node: any) => {
          const id = node.entry.nodeId || node.entry.id;
          return this.favoritesApi.deleteFavorite('-me-', id);
        })
      )
    );
  }

  unlockNode(nodeId: string, opts?: any): Promise<MinimalNodeEntity> {
    return this.nodesApi.unlockNode(nodeId, opts);
  }

  getNodeVersions(nodeId: string, opts?: any): Observable<VersionPaging> {
    return from(this.versionsApi.listVersionHistory(nodeId, opts));
  }

  requestNodeDirectAccessUrl(nodeId: string): Observable<DirectAccessUrlEntry> {
    return from(this.nodesApi.requestDirectAccessUrl(nodeId));
  }

  requestVersionDirectAccessUrl(nodeId: string, versionId: string): Observable<DirectAccessUrlEntry> {
    return from(this.versionsApi.requestDirectAccessUrl(nodeId, versionId));
  }
}
