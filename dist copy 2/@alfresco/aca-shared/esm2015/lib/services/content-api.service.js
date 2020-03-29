/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
import { from } from 'rxjs';
import { map } from 'rxjs/operators';
import * as i0 from '@angular/core';
import * as i1 from '@alfresco/adf-core';
export class ContentApiService {
  /**
   * @param {?} api
   * @param {?} preferences
   */
  constructor(api, preferences) {
    this.api = api;
    this.preferences = preferences;
  }
  /**
   * Moves a node to the trashcan.
   * @param {?} nodeId ID of the target node
   * @param {?=} options Optional parameters supported by JS-API
   * @return {?} Empty result that notifies when the deletion is complete
   */
  deleteNode(nodeId, options = {}) {
    return from(this.api.nodesApi.deleteNode(nodeId, options));
  }
  /**
   * Gets the stored information about a node.
   * @param {?} nodeId ID of the target node
   * @param {?=} options Optional parameters supported by JS-API
   * @return {?} Node information
   */
  getNode(nodeId, options = {}) {
    /** @type {?} */
    const defaults = {
      include: ['path', 'properties', 'allowableOperations', 'permissions']
    };
    /** @type {?} */
    const queryOptions = Object.assign(defaults, options);
    return from(this.api.nodesApi.getNode(nodeId, queryOptions));
  }
  /**
   * @param {?} nodeId
   * @param {?=} options
   * @return {?}
   */
  getNodeInfo(nodeId, options) {
    /** @type {?} */
    const defaults = {
      include: ['isFavorite', 'allowableOperations', 'path']
    };
    /** @type {?} */
    const queryOptions = Object.assign(defaults, options || {});
    return from(this.api.nodesApi.getNodeInfo(nodeId, queryOptions));
  }
  /**
   * Gets the items contained in a folder node.
   * @param {?} nodeId ID of the target node
   * @param {?=} options Optional parameters supported by JS-API
   * @return {?} List of child items from the folder
   */
  getNodeChildren(nodeId, options = {}) {
    /** @type {?} */
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
    /** @type {?} */
    const queryOptions = Object.assign(defaults, options);
    return from(this.api.nodesApi.getNodeChildren(nodeId, queryOptions));
  }
  /**
   * @param {?} linkId
   * @return {?}
   */
  deleteSharedLink(linkId) {
    return from(this.api.sharedLinksApi.deleteSharedLink(linkId));
  }
  /**
   * @param {?=} options
   * @return {?}
   */
  getDeletedNodes(options = {}) {
    /** @type {?} */
    const defaults = {
      include: ['path']
    };
    /** @type {?} */
    const queryOptions = Object.assign(defaults, options);
    return from(this.api.nodesApi.getDeletedNodes(queryOptions));
  }
  /**
   * @param {?} nodeId
   * @return {?}
   */
  restoreNode(nodeId) {
    return from(this.api.nodesApi.restoreNode(nodeId));
  }
  /**
   * @param {?} nodeId
   * @return {?}
   */
  purgeDeletedNode(nodeId) {
    return from(this.api.nodesApi.purgeDeletedNode(nodeId));
  }
  /**
   * Gets information about a user identified by their username.
   * @param {?} personId ID of the target user
   * @param {?=} options
   * @return {?} User information
   */
  getPerson(personId, options) {
    return from(this.api.peopleApi.getPerson(personId, options));
  }
  /**
   * Copy a node to destination node
   *
   * @param {?} nodeId The id of the node to be copied
   * @param {?} targetParentId The id of the folder-node where the node have to be copied to
   * @param {?=} name The new name for the copy that would be added on the destination folder
   * @param {?=} opts
   * @return {?}
   */
  copyNode(nodeId, targetParentId, name, opts) {
    return from(
      this.api.nodesApi.copyNode(nodeId, { targetParentId, name }, opts)
    );
  }
  /**
   * Gets product information for Content Services.
   * @return {?} ProductVersionModel containing product details
   */
  getRepositoryInformation() {
    return from(
      this.api.getInstance().discovery.discoveryApi.getRepositoryInformation()
    );
  }
  /**
   * @param {?} personId
   * @param {?=} opts
   * @return {?}
   */
  getFavorites(personId, opts) {
    return from(this.api.favoritesApi.getFavorites(personId, opts));
  }
  /**
   * @param {?=} personId
   * @param {?=} opts
   * @return {?}
   */
  getFavoriteLibraries(personId = '-me-', opts) {
    return this.getFavorites(
      personId,
      Object.assign({}, opts, { where: '(EXISTS(target/site))' })
    ).pipe(
      map(response => {
        return {
          list: {
            entries: response.list.entries.map(({ entry }) => {
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
  /**
   * @param {?=} opts
   * @return {?}
   */
  findSharedLinks(opts) {
    return from(this.api.sharedLinksApi.findSharedLinks(opts));
  }
  /**
   * @param {?} sharedId
   * @param {?=} attachment
   * @return {?}
   */
  getSharedLinkContent(sharedId, attachment) {
    return this.api.contentApi.getSharedLinkContentUrl(sharedId, attachment);
  }
  /**
   * @param {?} request
   * @return {?}
   */
  search(request) {
    return from(this.api.searchApi.search(request));
  }
  /**
   * @param {?} nodeId
   * @param {?=} attachment
   * @return {?}
   */
  getContentUrl(nodeId, attachment) {
    return this.api.contentApi.getContentUrl(nodeId, attachment);
  }
  /**
   * @param {?=} siteId
   * @param {?=} opts
   * @return {?}
   */
  deleteSite(siteId, opts) {
    return from(this.api.sitesApi.deleteSite(siteId, opts));
  }
  /**
   * @param {?=} siteId
   * @return {?}
   */
  leaveSite(siteId) {
    return from(this.api.sitesApi.removeSiteMember(siteId, '-me-'));
  }
  /**
   * @param {?} siteBody
   * @param {?=} opts
   * @return {?}
   */
  createSite(siteBody, opts) {
    return from(this.api.sitesApi.createSite(siteBody, opts));
  }
  /**
   * @param {?=} siteId
   * @param {?=} opts
   * @return {?}
   */
  getSite(siteId, opts) {
    return from(this.api.sitesApi.getSite(siteId, opts));
  }
  /**
   * @param {?} siteId
   * @param {?} siteBody
   * @return {?}
   */
  updateLibrary(siteId, siteBody) {
    return from(this.api.sitesApi.updateSite(siteId, siteBody));
  }
  /**
   * @param {?} nodes
   * @return {?}
   */
  addFavorite(nodes) {
    /** @type {?} */
    const payload = nodes.map(node => {
      const { isFolder, nodeId, id } = /** @type {?} */ (node.entry);
      /** @type {?} */
      const siteId = node.entry['guid'];
      /** @type {?} */
      const type = siteId ? 'site' : isFolder ? 'folder' : 'file';
      /** @type {?} */
      const guid = siteId || nodeId || id;
      return {
        target: {
          [type]: {
            guid
          }
        }
      };
    });
    return from(
      this.api.favoritesApi.addFavorite('-me-', /** @type {?} */ (payload))
    );
  }
  /**
   * @param {?} nodes
   * @return {?}
   */
  removeFavorite(nodes) {
    return from(
      Promise.all(
        nodes.map(node => {
          /** @type {?} */
          const id = node.entry.nodeId || node.entry.id;
          return this.api.favoritesApi.removeFavoriteSite('-me-', id);
        })
      )
    );
  }
  /**
   * @param {?} nodeId
   * @param {?=} opts
   * @return {?}
   */
  unlockNode(nodeId, opts) {
    return this.api.nodesApi.unlockNode(nodeId, opts);
  }
}
ContentApiService.decorators = [
  {
    type: Injectable,
    args: [
      {
        providedIn: 'root'
      }
    ]
  }
];
/** @nocollapse */
ContentApiService.ctorParameters = () => [
  { type: AlfrescoApiService },
  { type: UserPreferencesService }
];
/** @nocollapse */ ContentApiService.ngInjectableDef = i0.defineInjectable({
  factory: function ContentApiService_Factory() {
    return new ContentApiService(
      i0.inject(i1.AlfrescoApiService),
      i0.inject(i1.UserPreferencesService)
    );
  },
  token: ContentApiService,
  providedIn: 'root'
});
if (false) {
  /**
   * @type {?}
   * @private
   */
  ContentApiService.prototype.api;
  /**
   * @type {?}
   * @private
   */
  ContentApiService.prototype.preferences;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGVudC1hcGkuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BhbGZyZXNjby9hY2Etc2hhcmVkLyIsInNvdXJjZXMiOlsibGliL3NlcnZpY2VzL2NvbnRlbnQtYXBpLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXlCQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxzQkFBc0IsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQ2hGLE9BQU8sRUFBYyxJQUFJLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFrQnhDLE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQzs7O0FBS3JDLE1BQU0sT0FBTyxpQkFBaUI7Ozs7O0lBQzVCLFlBQ1UsR0FBdUIsRUFDdkIsV0FBbUM7UUFEbkMsUUFBRyxHQUFILEdBQUcsQ0FBb0I7UUFDdkIsZ0JBQVcsR0FBWCxXQUFXLENBQXdCO0lBQzFDLENBQUM7Ozs7Ozs7SUFRSixVQUFVLENBQ1IsTUFBYyxFQUNkLFVBQW1DLEVBQUU7UUFFckMsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDO0lBQzdELENBQUM7Ozs7Ozs7SUFRRCxPQUFPLENBQUMsTUFBYyxFQUFFLFVBQWUsRUFBRTs7Y0FDakMsUUFBUSxHQUFHO1lBQ2YsT0FBTyxFQUFFLENBQUMsTUFBTSxFQUFFLFlBQVksRUFBRSxxQkFBcUIsRUFBRSxhQUFhLENBQUM7U0FDdEU7O2NBQ0ssWUFBWSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQztRQUVyRCxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLFlBQVksQ0FB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RCxDQUFDOzs7WUFwUEYsVUFBVSxTQUFDO2dCQUNWLFVBQVUsRUFBRSxNQUFNO2FBQ25COzs7O1lBdkJRLGtCQUFrQjtZQUFFLHNCQUFzQjs7Ozs7Ozs7SUEwQi9DLGdDQUErQjs7Ozs7SUFDL0Isd0NBQTJDIiwic291cmNlc0NvbnRlbnQiOlsiLyohXG4gKiBAbGljZW5zZVxuICogQWxmcmVzY28gRXhhbXBsZSBDb250ZW50IEFwcGxpY2F0aW9uXG4gKlxuICogQ29weXJpZ2h0IChDKSAyMDA1IC0gMjAyMCBBbGZyZXNjbyBTb2Z0d2FyZSBMaW1pdGVkXG4gKlxuICogVGhpcyBmaWxlIGlzIHBhcnQgb2YgdGhlIEFsZnJlc2NvIEV4YW1wbGUgQ29udGVudCBBcHBsaWNhdGlvbi5cbiAqIElmIHRoZSBzb2Z0d2FyZSB3YXMgcHVyY2hhc2VkIHVuZGVyIGEgcGFpZCBBbGZyZXNjbyBsaWNlbnNlLCB0aGUgdGVybXMgb2ZcbiAqIHRoZSBwYWlkIGxpY2Vuc2UgYWdyZWVtZW50IHdpbGwgcHJldmFpbC4gIE90aGVyd2lzZSwgdGhlIHNvZnR3YXJlIGlzXG4gKiBwcm92aWRlZCB1bmRlciB0aGUgZm9sbG93aW5nIG9wZW4gc291cmNlIGxpY2Vuc2UgdGVybXM6XG4gKlxuICogVGhlIEFsZnJlc2NvIEV4YW1wbGUgQ29udGVudCBBcHBsaWNhdGlvbiBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG4gKiBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBMZXNzZXIgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbiAqIHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4gKiAoYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuICpcbiAqIFRoZSBBbGZyZXNjbyBFeGFtcGxlIENvbnRlbnQgQXBwbGljYXRpb24gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbiAqIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG4gKiBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG4gKiBHTlUgTGVzc2VyIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cbiAqXG4gKiBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgTGVzc2VyIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIGFsb25nIHdpdGggQWxmcmVzY28uIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbiAqL1xuXG5pbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBBbGZyZXNjb0FwaVNlcnZpY2UsIFVzZXJQcmVmZXJlbmNlc1NlcnZpY2UgfSBmcm9tICdAYWxmcmVzY28vYWRmLWNvcmUnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgZnJvbSB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtcbiAgTWluaW1hbE5vZGVFbnRpdHksXG4gIE5vZGVQYWdpbmcsXG4gIE5vZGUsXG4gIERlbGV0ZWROb2Rlc1BhZ2luZyxcbiAgUGVyc29uRW50cnksXG4gIE5vZGVFbnRyeSxcbiAgRGlzY292ZXJ5RW50cnksXG4gIEZhdm9yaXRlUGFnaW5nLFxuICBTaGFyZWRMaW5rUGFnaW5nLFxuICBTZWFyY2hSZXF1ZXN0LFxuICBSZXN1bHRTZXRQYWdpbmcsXG4gIFNpdGVCb2R5LFxuICBTaXRlRW50cnksXG4gIEZhdm9yaXRlQm9keSxcbiAgRmF2b3JpdGVFbnRyeVxufSBmcm9tICdAYWxmcmVzY28vanMtYXBpJztcbmltcG9ydCB7IG1hcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuQEluamVjdGFibGUoe1xuICBwcm92aWRlZEluOiAncm9vdCdcbn0pXG5leHBvcnQgY2xhc3MgQ29udGVudEFwaVNlcnZpY2Uge1xuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIGFwaTogQWxmcmVzY29BcGlTZXJ2aWNlLFxuICAgIHByaXZhdGUgcHJlZmVyZW5jZXM6IFVzZXJQcmVmZXJlbmNlc1NlcnZpY2VcbiAgKSB7fVxuXG4gIC8qKlxuICAgKiBNb3ZlcyBhIG5vZGUgdG8gdGhlIHRyYXNoY2FuLlxuICAgKiBAcGFyYW0gbm9kZUlkIElEIG9mIHRoZSB0YXJnZXQgbm9kZVxuICAgKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25hbCBwYXJhbWV0ZXJzIHN1cHBvcnRlZCBieSBKUy1BUElcbiAgICogQHJldHVybnMgRW1wdHkgcmVzdWx0IHRoYXQgbm90aWZpZXMgd2hlbiB0aGUgZGVsZXRpb24gaXMgY29tcGxldGVcbiAgICovXG4gIGRlbGV0ZU5vZGUoXG4gICAgbm9kZUlkOiBzdHJpbmcsXG4gICAgb3B0aW9uczogeyBwZXJtYW5lbnQ/OiBib29sZWFuIH0gPSB7fVxuICApOiBPYnNlcnZhYmxlPHZvaWQ+IHtcbiAgICByZXR1cm4gZnJvbSh0aGlzLmFwaS5ub2Rlc0FwaS5kZWxldGVOb2RlKG5vZGVJZCwgb3B0aW9ucykpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIHN0b3JlZCBpbmZvcm1hdGlvbiBhYm91dCBhIG5vZGUuXG4gICAqIEBwYXJhbSBub2RlSWQgSUQgb2YgdGhlIHRhcmdldCBub2RlXG4gICAqIEBwYXJhbSBvcHRpb25zIE9wdGlvbmFsIHBhcmFtZXRlcnMgc3VwcG9ydGVkIGJ5IEpTLUFQSVxuICAgKiBAcmV0dXJucyBOb2RlIGluZm9ybWF0aW9uXG4gICAqL1xuICBnZXROb2RlKG5vZGVJZDogc3RyaW5nLCBvcHRpb25zOiBhbnkgPSB7fSk6IE9ic2VydmFibGU8TWluaW1hbE5vZGVFbnRpdHk+IHtcbiAgICBjb25zdCBkZWZhdWx0cyA9IHtcbiAgICAgIGluY2x1ZGU6IFsncGF0aCcsICdwcm9wZXJ0aWVzJywgJ2FsbG93YWJsZU9wZXJhdGlvbnMnLCAncGVybWlzc2lvbnMnXVxuICAgIH07XG4gICAgY29uc3QgcXVlcnlPcHRpb25zID0gT2JqZWN0LmFzc2lnbihkZWZhdWx0cywgb3B0aW9ucyk7XG5cbiAgICByZXR1cm4gZnJvbSh0aGlzLmFwaS5ub2Rlc0FwaS5nZXROb2RlKG5vZGVJZCwgcXVlcnlPcHRpb25zKSk7XG4gIH1cblxuICBnZXROb2RlSW5mbyhub2RlSWQ6IHN0cmluZywgb3B0aW9ucz86IGFueSk6IE9ic2VydmFibGU8Tm9kZT4ge1xuICAgIGNvbnN0IGRlZmF1bHRzID0ge1xuICAgICAgaW5jbHVkZTogWydpc0Zhdm9yaXRlJywgJ2FsbG93YWJsZU9wZXJhdGlvbnMnLCAncGF0aCddXG4gICAgfTtcbiAgICBjb25zdCBxdWVyeU9wdGlvbnMgPSBPYmplY3QuYXNzaWduKGRlZmF1bHRzLCBvcHRpb25zIHx8IHt9KTtcblxuICAgIHJldHVybiBmcm9tKHRoaXMuYXBpLm5vZGVzQXBpLmdldE5vZGVJbmZvKG5vZGVJZCwgcXVlcnlPcHRpb25zKSk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgaXRlbXMgY29udGFpbmVkIGluIGEgZm9sZGVyIG5vZGUuXG4gICAqIEBwYXJhbSBub2RlSWQgSUQgb2YgdGhlIHRhcmdldCBub2RlXG4gICAqIEBwYXJhbSBvcHRpb25zIE9wdGlvbmFsIHBhcmFtZXRlcnMgc3VwcG9ydGVkIGJ5IEpTLUFQSVxuICAgKiBAcmV0dXJucyBMaXN0IG9mIGNoaWxkIGl0ZW1zIGZyb20gdGhlIGZvbGRlclxuICAgKi9cbiAgZ2V0Tm9kZUNoaWxkcmVuKG5vZGVJZDogc3RyaW5nLCBvcHRpb25zOiBhbnkgPSB7fSk6IE9ic2VydmFibGU8Tm9kZVBhZ2luZz4ge1xuICAgIGNvbnN0IGRlZmF1bHRzID0ge1xuICAgICAgbWF4SXRlbXM6IHRoaXMucHJlZmVyZW5jZXMucGFnaW5hdGlvblNpemUsXG4gICAgICBza2lwQ291bnQ6IDAsXG4gICAgICBpbmNsdWRlOiBbXG4gICAgICAgICdpc0xvY2tlZCcsXG4gICAgICAgICdwYXRoJyxcbiAgICAgICAgJ3Byb3BlcnRpZXMnLFxuICAgICAgICAnYWxsb3dhYmxlT3BlcmF0aW9ucycsXG4gICAgICAgICdwZXJtaXNzaW9ucydcbiAgICAgIF1cbiAgICB9O1xuICAgIGNvbnN0IHF1ZXJ5T3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oZGVmYXVsdHMsIG9wdGlvbnMpO1xuXG4gICAgcmV0dXJuIGZyb20odGhpcy5hcGkubm9kZXNBcGkuZ2V0Tm9kZUNoaWxkcmVuKG5vZGVJZCwgcXVlcnlPcHRpb25zKSk7XG4gIH1cblxuICBkZWxldGVTaGFyZWRMaW5rKGxpbmtJZDogc3RyaW5nKTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICByZXR1cm4gZnJvbSh0aGlzLmFwaS5zaGFyZWRMaW5rc0FwaS5kZWxldGVTaGFyZWRMaW5rKGxpbmtJZCkpO1xuICB9XG5cbiAgZ2V0RGVsZXRlZE5vZGVzKG9wdGlvbnM6IGFueSA9IHt9KTogT2JzZXJ2YWJsZTxEZWxldGVkTm9kZXNQYWdpbmc+IHtcbiAgICBjb25zdCBkZWZhdWx0cyA9IHtcbiAgICAgIGluY2x1ZGU6IFsncGF0aCddXG4gICAgfTtcbiAgICBjb25zdCBxdWVyeU9wdGlvbnMgPSBPYmplY3QuYXNzaWduKGRlZmF1bHRzLCBvcHRpb25zKTtcblxuICAgIHJldHVybiBmcm9tKHRoaXMuYXBpLm5vZGVzQXBpLmdldERlbGV0ZWROb2RlcyhxdWVyeU9wdGlvbnMpKTtcbiAgfVxuXG4gIHJlc3RvcmVOb2RlKG5vZGVJZDogc3RyaW5nKTogT2JzZXJ2YWJsZTxNaW5pbWFsTm9kZUVudGl0eT4ge1xuICAgIHJldHVybiBmcm9tKHRoaXMuYXBpLm5vZGVzQXBpLnJlc3RvcmVOb2RlKG5vZGVJZCkpO1xuICB9XG5cbiAgcHVyZ2VEZWxldGVkTm9kZShub2RlSWQ6IHN0cmluZyk6IE9ic2VydmFibGU8YW55PiB7XG4gICAgcmV0dXJuIGZyb20odGhpcy5hcGkubm9kZXNBcGkucHVyZ2VEZWxldGVkTm9kZShub2RlSWQpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIGluZm9ybWF0aW9uIGFib3V0IGEgdXNlciBpZGVudGlmaWVkIGJ5IHRoZWlyIHVzZXJuYW1lLlxuICAgKiBAcGFyYW0gcGVyc29uSWQgSUQgb2YgdGhlIHRhcmdldCB1c2VyXG4gICAqIEByZXR1cm5zIFVzZXIgaW5mb3JtYXRpb25cbiAgICovXG4gIGdldFBlcnNvbihcbiAgICBwZXJzb25JZDogc3RyaW5nLFxuICAgIG9wdGlvbnM/OiB7IGZpZWxkcz86IEFycmF5PHN0cmluZz4gfVxuICApOiBPYnNlcnZhYmxlPFBlcnNvbkVudHJ5PiB7XG4gICAgcmV0dXJuIGZyb20odGhpcy5hcGkucGVvcGxlQXBpLmdldFBlcnNvbihwZXJzb25JZCwgb3B0aW9ucykpO1xuICB9XG5cbiAgLyoqXG4gICAqIENvcHkgYSBub2RlIHRvIGRlc3RpbmF0aW9uIG5vZGVcbiAgICpcbiAgICogQHBhcmFtIG5vZGVJZCBUaGUgaWQgb2YgdGhlIG5vZGUgdG8gYmUgY29waWVkXG4gICAqIEBwYXJhbSB0YXJnZXRQYXJlbnRJZCBUaGUgaWQgb2YgdGhlIGZvbGRlci1ub2RlIHdoZXJlIHRoZSBub2RlIGhhdmUgdG8gYmUgY29waWVkIHRvXG4gICAqIEBwYXJhbSBuYW1lIFRoZSBuZXcgbmFtZSBmb3IgdGhlIGNvcHkgdGhhdCB3b3VsZCBiZSBhZGRlZCBvbiB0aGUgZGVzdGluYXRpb24gZm9sZGVyXG4gICAqL1xuICBjb3B5Tm9kZShcbiAgICBub2RlSWQ6IHN0cmluZyxcbiAgICB0YXJnZXRQYXJlbnRJZDogc3RyaW5nLFxuICAgIG5hbWU/OiBzdHJpbmcsXG4gICAgb3B0cz86IHsgaW5jbHVkZT86IEFycmF5PHN0cmluZz47IGZpZWxkcz86IEFycmF5PHN0cmluZz4gfVxuICApOiBPYnNlcnZhYmxlPE5vZGVFbnRyeT4ge1xuICAgIHJldHVybiBmcm9tKFxuICAgICAgdGhpcy5hcGkubm9kZXNBcGkuY29weU5vZGUobm9kZUlkLCB7IHRhcmdldFBhcmVudElkLCBuYW1lIH0sIG9wdHMpXG4gICAgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHByb2R1Y3QgaW5mb3JtYXRpb24gZm9yIENvbnRlbnQgU2VydmljZXMuXG4gICAqIEByZXR1cm5zIFByb2R1Y3RWZXJzaW9uTW9kZWwgY29udGFpbmluZyBwcm9kdWN0IGRldGFpbHNcbiAgICovXG4gIGdldFJlcG9zaXRvcnlJbmZvcm1hdGlvbigpOiBPYnNlcnZhYmxlPERpc2NvdmVyeUVudHJ5PiB7XG4gICAgcmV0dXJuIGZyb20oXG4gICAgICB0aGlzLmFwaS5nZXRJbnN0YW5jZSgpLmRpc2NvdmVyeS5kaXNjb3ZlcnlBcGkuZ2V0UmVwb3NpdG9yeUluZm9ybWF0aW9uKClcbiAgICApO1xuICB9XG5cbiAgZ2V0RmF2b3JpdGVzKFxuICAgIHBlcnNvbklkOiBzdHJpbmcsXG4gICAgb3B0cz86IHtcbiAgICAgIHNraXBDb3VudD86IG51bWJlcjtcbiAgICAgIG1heEl0ZW1zPzogbnVtYmVyO1xuICAgICAgd2hlcmU/OiBzdHJpbmc7XG4gICAgICBmaWVsZHM/OiBBcnJheTxzdHJpbmc+O1xuICAgIH1cbiAgKTogT2JzZXJ2YWJsZTxGYXZvcml0ZVBhZ2luZz4ge1xuICAgIHJldHVybiBmcm9tKHRoaXMuYXBpLmZhdm9yaXRlc0FwaS5nZXRGYXZvcml0ZXMocGVyc29uSWQsIG9wdHMpKTtcbiAgfVxuXG4gIGdldEZhdm9yaXRlTGlicmFyaWVzKFxuICAgIHBlcnNvbklkOiBzdHJpbmcgPSAnLW1lLScsXG4gICAgb3B0cz86IGFueVxuICApOiBPYnNlcnZhYmxlPEZhdm9yaXRlUGFnaW5nPiB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0RmF2b3JpdGVzKHBlcnNvbklkLCB7XG4gICAgICAuLi5vcHRzLFxuICAgICAgd2hlcmU6ICcoRVhJU1RTKHRhcmdldC9zaXRlKSknXG4gICAgfSkucGlwZShcbiAgICAgIG1hcCgocmVzcG9uc2U6IEZhdm9yaXRlUGFnaW5nKSA9PiB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgbGlzdDoge1xuICAgICAgICAgICAgZW50cmllczogcmVzcG9uc2UubGlzdC5lbnRyaWVzLm1hcCgoeyBlbnRyeSB9OiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgZW50cnkudGFyZ2V0LnNpdGUuY3JlYXRlZEF0ID0gZW50cnkuY3JlYXRlZEF0O1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGVudHJ5OiBlbnRyeS50YXJnZXQuc2l0ZVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSksXG4gICAgICAgICAgICBwYWdpbmF0aW9uOiByZXNwb25zZS5saXN0LnBhZ2luYXRpb25cbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9KVxuICAgICk7XG4gIH1cblxuICBmaW5kU2hhcmVkTGlua3Mob3B0cz86IGFueSk6IE9ic2VydmFibGU8U2hhcmVkTGlua1BhZ2luZz4ge1xuICAgIHJldHVybiBmcm9tKHRoaXMuYXBpLnNoYXJlZExpbmtzQXBpLmZpbmRTaGFyZWRMaW5rcyhvcHRzKSk7XG4gIH1cblxuICBnZXRTaGFyZWRMaW5rQ29udGVudChzaGFyZWRJZDogc3RyaW5nLCBhdHRhY2htZW50PzogYm9vbGVhbik6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuYXBpLmNvbnRlbnRBcGkuZ2V0U2hhcmVkTGlua0NvbnRlbnRVcmwoc2hhcmVkSWQsIGF0dGFjaG1lbnQpO1xuICB9XG5cbiAgc2VhcmNoKHJlcXVlc3Q6IFNlYXJjaFJlcXVlc3QpOiBPYnNlcnZhYmxlPFJlc3VsdFNldFBhZ2luZz4ge1xuICAgIHJldHVybiBmcm9tKHRoaXMuYXBpLnNlYXJjaEFwaS5zZWFyY2gocmVxdWVzdCkpO1xuICB9XG5cbiAgZ2V0Q29udGVudFVybChub2RlSWQ6IHN0cmluZywgYXR0YWNobWVudD86IGJvb2xlYW4pOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLmFwaS5jb250ZW50QXBpLmdldENvbnRlbnRVcmwobm9kZUlkLCBhdHRhY2htZW50KTtcbiAgfVxuXG4gIGRlbGV0ZVNpdGUoc2l0ZUlkPzogc3RyaW5nLCBvcHRzPzogeyBwZXJtYW5lbnQ/OiBib29sZWFuIH0pOiBPYnNlcnZhYmxlPGFueT4ge1xuICAgIHJldHVybiBmcm9tKHRoaXMuYXBpLnNpdGVzQXBpLmRlbGV0ZVNpdGUoc2l0ZUlkLCBvcHRzKSk7XG4gIH1cblxuICBsZWF2ZVNpdGUoc2l0ZUlkPzogc3RyaW5nKTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICByZXR1cm4gZnJvbSh0aGlzLmFwaS5zaXRlc0FwaS5yZW1vdmVTaXRlTWVtYmVyKHNpdGVJZCwgJy1tZS0nKSk7XG4gIH1cblxuICBjcmVhdGVTaXRlKFxuICAgIHNpdGVCb2R5OiBTaXRlQm9keSxcbiAgICBvcHRzPzoge1xuICAgICAgZmllbGRzPzogQXJyYXk8c3RyaW5nPjtcbiAgICAgIHNraXBDb25maWd1cmF0aW9uPzogYm9vbGVhbjtcbiAgICAgIHNraXBBZGRUb0Zhdm9yaXRlcz86IGJvb2xlYW47XG4gICAgfVxuICApOiBPYnNlcnZhYmxlPFNpdGVFbnRyeT4ge1xuICAgIHJldHVybiBmcm9tKHRoaXMuYXBpLnNpdGVzQXBpLmNyZWF0ZVNpdGUoc2l0ZUJvZHksIG9wdHMpKTtcbiAgfVxuXG4gIGdldFNpdGUoXG4gICAgc2l0ZUlkPzogc3RyaW5nLFxuICAgIG9wdHM/OiB7IHJlbGF0aW9ucz86IEFycmF5PHN0cmluZz47IGZpZWxkcz86IEFycmF5PHN0cmluZz4gfVxuICApOiBPYnNlcnZhYmxlPFNpdGVFbnRyeT4ge1xuICAgIHJldHVybiBmcm9tKHRoaXMuYXBpLnNpdGVzQXBpLmdldFNpdGUoc2l0ZUlkLCBvcHRzKSk7XG4gIH1cblxuICB1cGRhdGVMaWJyYXJ5KHNpdGVJZDogc3RyaW5nLCBzaXRlQm9keTogU2l0ZUJvZHkpOiBPYnNlcnZhYmxlPFNpdGVFbnRyeT4ge1xuICAgIHJldHVybiBmcm9tKHRoaXMuYXBpLnNpdGVzQXBpLnVwZGF0ZVNpdGUoc2l0ZUlkLCBzaXRlQm9keSkpO1xuICB9XG5cbiAgYWRkRmF2b3JpdGUobm9kZXM6IEFycmF5PE1pbmltYWxOb2RlRW50aXR5Pik6IE9ic2VydmFibGU8RmF2b3JpdGVFbnRyeT4ge1xuICAgIGNvbnN0IHBheWxvYWQ6IEZhdm9yaXRlQm9keVtdID0gbm9kZXMubWFwKG5vZGUgPT4ge1xuICAgICAgY29uc3QgeyBpc0ZvbGRlciwgbm9kZUlkLCBpZCB9ID0gPGFueT5ub2RlLmVudHJ5O1xuICAgICAgY29uc3Qgc2l0ZUlkID0gbm9kZS5lbnRyeVsnZ3VpZCddO1xuICAgICAgY29uc3QgdHlwZSA9IHNpdGVJZCA/ICdzaXRlJyA6IGlzRm9sZGVyID8gJ2ZvbGRlcicgOiAnZmlsZSc7XG4gICAgICBjb25zdCBndWlkID0gc2l0ZUlkIHx8IG5vZGVJZCB8fCBpZDtcblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdGFyZ2V0OiB7XG4gICAgICAgICAgW3R5cGVdOiB7XG4gICAgICAgICAgICBndWlkXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIGZyb20odGhpcy5hcGkuZmF2b3JpdGVzQXBpLmFkZEZhdm9yaXRlKCctbWUtJywgPGFueT5wYXlsb2FkKSk7XG4gIH1cblxuICByZW1vdmVGYXZvcml0ZShub2RlczogQXJyYXk8TWluaW1hbE5vZGVFbnRpdHk+KTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICByZXR1cm4gZnJvbShcbiAgICAgIFByb21pc2UuYWxsKFxuICAgICAgICBub2Rlcy5tYXAoKG5vZGU6IGFueSkgPT4ge1xuICAgICAgICAgIGNvbnN0IGlkID0gbm9kZS5lbnRyeS5ub2RlSWQgfHwgbm9kZS5lbnRyeS5pZDtcbiAgICAgICAgICByZXR1cm4gdGhpcy5hcGkuZmF2b3JpdGVzQXBpLnJlbW92ZUZhdm9yaXRlU2l0ZSgnLW1lLScsIGlkKTtcbiAgICAgICAgfSlcbiAgICAgIClcbiAgICApO1xuICB9XG5cbiAgdW5sb2NrTm9kZShub2RlSWQ6IHN0cmluZywgb3B0cz86IGFueSkge1xuICAgIHJldHVybiB0aGlzLmFwaS5ub2Rlc0FwaS51bmxvY2tOb2RlKG5vZGVJZCwgb3B0cyk7XG4gIH1cbn1cbiJdfQ==
