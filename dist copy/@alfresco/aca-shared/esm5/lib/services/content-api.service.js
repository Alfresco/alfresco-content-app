/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from 'tslib';
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
var ContentApiService = /** @class */ (function() {
  function ContentApiService(api, preferences) {
    this.api = api;
    this.preferences = preferences;
  }
  /**
   * Moves a node to the trashcan.
   * @param nodeId ID of the target node
   * @param options Optional parameters supported by JS-API
   * @returns Empty result that notifies when the deletion is complete
   */
  /**
   * Moves a node to the trashcan.
   * @param {?} nodeId ID of the target node
   * @param {?=} options Optional parameters supported by JS-API
   * @return {?} Empty result that notifies when the deletion is complete
   */
  ContentApiService.prototype.deleteNode
  /**
   * Moves a node to the trashcan.
   * @param {?} nodeId ID of the target node
   * @param {?=} options Optional parameters supported by JS-API
   * @return {?} Empty result that notifies when the deletion is complete
   */ = function(nodeId, options) {
    if (options === void 0) {
      options = {};
    }
    return from(this.api.nodesApi.deleteNode(nodeId, options));
  };
  /**
   * Gets the stored information about a node.
   * @param nodeId ID of the target node
   * @param options Optional parameters supported by JS-API
   * @returns Node information
   */
  /**
   * Gets the stored information about a node.
   * @param {?} nodeId ID of the target node
   * @param {?=} options Optional parameters supported by JS-API
   * @return {?} Node information
   */
  ContentApiService.prototype.getNode
  /**
   * Gets the stored information about a node.
   * @param {?} nodeId ID of the target node
   * @param {?=} options Optional parameters supported by JS-API
   * @return {?} Node information
   */ = function(nodeId, options) {
    if (options === void 0) {
      options = {};
    }
    /** @type {?} */
    var defaults = {
      include: ['path', 'properties', 'allowableOperations', 'permissions']
    };
    /** @type {?} */
    var queryOptions = Object.assign(defaults, options);
    return from(this.api.nodesApi.getNode(nodeId, queryOptions));
  };
  /**
   * @param {?} nodeId
   * @param {?=} options
   * @return {?}
   */
  ContentApiService.prototype.getNodeInfo
  /**
   * @param {?} nodeId
   * @param {?=} options
   * @return {?}
   */ = function(nodeId, options) {
    /** @type {?} */
    var defaults = {
      include: ['isFavorite', 'allowableOperations', 'path']
    };
    /** @type {?} */
    var queryOptions = Object.assign(defaults, options || {});
    return from(this.api.nodesApi.getNodeInfo(nodeId, queryOptions));
  };
  /**
   * Gets the items contained in a folder node.
   * @param nodeId ID of the target node
   * @param options Optional parameters supported by JS-API
   * @returns List of child items from the folder
   */
  /**
   * Gets the items contained in a folder node.
   * @param {?} nodeId ID of the target node
   * @param {?=} options Optional parameters supported by JS-API
   * @return {?} List of child items from the folder
   */
  ContentApiService.prototype.getNodeChildren
  /**
   * Gets the items contained in a folder node.
   * @param {?} nodeId ID of the target node
   * @param {?=} options Optional parameters supported by JS-API
   * @return {?} List of child items from the folder
   */ = function(nodeId, options) {
    if (options === void 0) {
      options = {};
    }
    /** @type {?} */
    var defaults = {
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
    var queryOptions = Object.assign(defaults, options);
    return from(this.api.nodesApi.getNodeChildren(nodeId, queryOptions));
  };
  /**
   * @param {?} linkId
   * @return {?}
   */
  ContentApiService.prototype.deleteSharedLink
  /**
   * @param {?} linkId
   * @return {?}
   */ = function(linkId) {
    return from(this.api.sharedLinksApi.deleteSharedLink(linkId));
  };
  /**
   * @param {?=} options
   * @return {?}
   */
  ContentApiService.prototype.getDeletedNodes
  /**
   * @param {?=} options
   * @return {?}
   */ = function(options) {
    if (options === void 0) {
      options = {};
    }
    /** @type {?} */
    var defaults = {
      include: ['path']
    };
    /** @type {?} */
    var queryOptions = Object.assign(defaults, options);
    return from(this.api.nodesApi.getDeletedNodes(queryOptions));
  };
  /**
   * @param {?} nodeId
   * @return {?}
   */
  ContentApiService.prototype.restoreNode
  /**
   * @param {?} nodeId
   * @return {?}
   */ = function(nodeId) {
    return from(this.api.nodesApi.restoreNode(nodeId));
  };
  /**
   * @param {?} nodeId
   * @return {?}
   */
  ContentApiService.prototype.purgeDeletedNode
  /**
   * @param {?} nodeId
   * @return {?}
   */ = function(nodeId) {
    return from(this.api.nodesApi.purgeDeletedNode(nodeId));
  };
  /**
   * Gets information about a user identified by their username.
   * @param personId ID of the target user
   * @returns User information
   */
  /**
   * Gets information about a user identified by their username.
   * @param {?} personId ID of the target user
   * @param {?=} options
   * @return {?} User information
   */
  ContentApiService.prototype.getPerson
  /**
   * Gets information about a user identified by their username.
   * @param {?} personId ID of the target user
   * @param {?=} options
   * @return {?} User information
   */ = function(personId, options) {
    return from(this.api.peopleApi.getPerson(personId, options));
  };
  /**
   * Copy a node to destination node
   *
   * @param nodeId The id of the node to be copied
   * @param targetParentId The id of the folder-node where the node have to be copied to
   * @param name The new name for the copy that would be added on the destination folder
   */
  /**
   * Copy a node to destination node
   *
   * @param {?} nodeId The id of the node to be copied
   * @param {?} targetParentId The id of the folder-node where the node have to be copied to
   * @param {?=} name The new name for the copy that would be added on the destination folder
   * @param {?=} opts
   * @return {?}
   */
  ContentApiService.prototype.copyNode
  /**
   * Copy a node to destination node
   *
   * @param {?} nodeId The id of the node to be copied
   * @param {?} targetParentId The id of the folder-node where the node have to be copied to
   * @param {?=} name The new name for the copy that would be added on the destination folder
   * @param {?=} opts
   * @return {?}
   */ = function(nodeId, targetParentId, name, opts) {
    return from(
      this.api.nodesApi.copyNode(
        nodeId,
        { targetParentId: targetParentId, name: name },
        opts
      )
    );
  };
  /**
   * Gets product information for Content Services.
   * @returns ProductVersionModel containing product details
   */
  /**
   * Gets product information for Content Services.
   * @return {?} ProductVersionModel containing product details
   */
  ContentApiService.prototype.getRepositoryInformation
  /**
   * Gets product information for Content Services.
   * @return {?} ProductVersionModel containing product details
   */ = function() {
    return from(
      this.api.getInstance().discovery.discoveryApi.getRepositoryInformation()
    );
  };
  /**
   * @param {?} personId
   * @param {?=} opts
   * @return {?}
   */
  ContentApiService.prototype.getFavorites
  /**
   * @param {?} personId
   * @param {?=} opts
   * @return {?}
   */ = function(personId, opts) {
    return from(this.api.favoritesApi.getFavorites(personId, opts));
  };
  /**
   * @param {?=} personId
   * @param {?=} opts
   * @return {?}
   */
  ContentApiService.prototype.getFavoriteLibraries
  /**
   * @param {?=} personId
   * @param {?=} opts
   * @return {?}
   */ = function(personId, opts) {
    if (personId === void 0) {
      personId = '-me-';
    }
    return this.getFavorites(
      personId,
      tslib_1.__assign({}, opts, { where: '(EXISTS(target/site))' })
    ).pipe(
      map(function(response) {
        return {
          list: {
            entries: response.list.entries.map(function(_a) {
              var entry = _a.entry;
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
  };
  /**
   * @param {?=} opts
   * @return {?}
   */
  ContentApiService.prototype.findSharedLinks
  /**
   * @param {?=} opts
   * @return {?}
   */ = function(opts) {
    return from(this.api.sharedLinksApi.findSharedLinks(opts));
  };
  /**
   * @param {?} sharedId
   * @param {?=} attachment
   * @return {?}
   */
  ContentApiService.prototype.getSharedLinkContent
  /**
   * @param {?} sharedId
   * @param {?=} attachment
   * @return {?}
   */ = function(sharedId, attachment) {
    return this.api.contentApi.getSharedLinkContentUrl(sharedId, attachment);
  };
  /**
   * @param {?} request
   * @return {?}
   */
  ContentApiService.prototype.search
  /**
   * @param {?} request
   * @return {?}
   */ = function(request) {
    return from(this.api.searchApi.search(request));
  };
  /**
   * @param {?} nodeId
   * @param {?=} attachment
   * @return {?}
   */
  ContentApiService.prototype.getContentUrl
  /**
   * @param {?} nodeId
   * @param {?=} attachment
   * @return {?}
   */ = function(nodeId, attachment) {
    return this.api.contentApi.getContentUrl(nodeId, attachment);
  };
  /**
   * @param {?=} siteId
   * @param {?=} opts
   * @return {?}
   */
  ContentApiService.prototype.deleteSite
  /**
   * @param {?=} siteId
   * @param {?=} opts
   * @return {?}
   */ = function(siteId, opts) {
    return from(this.api.sitesApi.deleteSite(siteId, opts));
  };
  /**
   * @param {?=} siteId
   * @return {?}
   */
  ContentApiService.prototype.leaveSite
  /**
   * @param {?=} siteId
   * @return {?}
   */ = function(siteId) {
    return from(this.api.sitesApi.removeSiteMember(siteId, '-me-'));
  };
  /**
   * @param {?} siteBody
   * @param {?=} opts
   * @return {?}
   */
  ContentApiService.prototype.createSite
  /**
   * @param {?} siteBody
   * @param {?=} opts
   * @return {?}
   */ = function(siteBody, opts) {
    return from(this.api.sitesApi.createSite(siteBody, opts));
  };
  /**
   * @param {?=} siteId
   * @param {?=} opts
   * @return {?}
   */
  ContentApiService.prototype.getSite
  /**
   * @param {?=} siteId
   * @param {?=} opts
   * @return {?}
   */ = function(siteId, opts) {
    return from(this.api.sitesApi.getSite(siteId, opts));
  };
  /**
   * @param {?} siteId
   * @param {?} siteBody
   * @return {?}
   */
  ContentApiService.prototype.updateLibrary
  /**
   * @param {?} siteId
   * @param {?} siteBody
   * @return {?}
   */ = function(siteId, siteBody) {
    return from(this.api.sitesApi.updateSite(siteId, siteBody));
  };
  /**
   * @param {?} nodes
   * @return {?}
   */
  ContentApiService.prototype.addFavorite
  /**
   * @param {?} nodes
   * @return {?}
   */ = function(nodes) {
    /** @type {?} */
    var payload = nodes.map(function(node) {
      var _a;
      var _b = /** @type {?} */ (node.entry),
        isFolder = _b.isFolder,
        nodeId = _b.nodeId,
        id = _b.id;
      /** @type {?} */
      var siteId = node.entry['guid'];
      /** @type {?} */
      var type = siteId ? 'site' : isFolder ? 'folder' : 'file';
      /** @type {?} */
      var guid = siteId || nodeId || id;
      return {
        target: ((_a = {}),
        (_a[type] = {
          guid: guid
        }),
        _a)
      };
    });
    return from(
      this.api.favoritesApi.addFavorite('-me-', /** @type {?} */ (payload))
    );
  };
  /**
   * @param {?} nodes
   * @return {?}
   */
  ContentApiService.prototype.removeFavorite
  /**
   * @param {?} nodes
   * @return {?}
   */ = function(nodes) {
    var _this = this;
    return from(
      Promise.all(
        nodes.map(function(node) {
          /** @type {?} */
          var id = node.entry.nodeId || node.entry.id;
          return _this.api.favoritesApi.removeFavoriteSite('-me-', id);
        })
      )
    );
  };
  /**
   * @param {?} nodeId
   * @param {?=} opts
   * @return {?}
   */
  ContentApiService.prototype.unlockNode
  /**
   * @param {?} nodeId
   * @param {?=} opts
   * @return {?}
   */ = function(nodeId, opts) {
    return this.api.nodesApi.unlockNode(nodeId, opts);
  };
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
  ContentApiService.ctorParameters = function() {
    return [{ type: AlfrescoApiService }, { type: UserPreferencesService }];
  };
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
  return ContentApiService;
})();
export { ContentApiService };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGVudC1hcGkuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BhbGZyZXNjby9hY2Etc2hhcmVkLyIsInNvdXJjZXMiOlsibGliL3NlcnZpY2VzL2NvbnRlbnQtYXBpLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF5QkEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUNoRixPQUFPLEVBQWMsSUFBSSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBa0J4QyxPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7OztBQUVyQztJQUlFLDJCQUNVLEdBQXVCLEVBQ3ZCLFdBQW1DO1FBRG5DLFFBQUcsR0FBSCxHQUFHLENBQW9CO1FBQ3ZCLGdCQUFXLEdBQVgsV0FBVyxDQUF3QjtJQUMxQyxDQUFDO0lBRUo7Ozs7O09BS0c7Ozs7Ozs7SUFDSCxzQ0FBVTs7Ozs7O0lBQVYsVUFDRSxNQUFjLEVBQ2QsT0FBcUM7UUFBckMsd0JBQUEsRUFBQSxZQUFxQztRQUVyQyxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUM7SUFDN0QsQ0FBQztJQUVEOzs7OztPQUtHOzs7Ozs7O0lBQ0gsbUNBQU87Ozs7OztJQUFQLFVBQVEsTUFBYyxFQUFFLE9BQWlCO1FBQWpCLHdCQUFBLEVBQUEsWUFBaUI7O1lBQ2pDLFFBQVEsR0FBRztZQUNmLE9BQU8sRUFBRSxDQUFDLE1BQU0sRUFBRSxZQUFZLEVBQUUscUJBQXFCLEVBQUUsYUFBYSxDQUFDO1NBQ3RFOztZQUNLLFlBQVksR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUM7UUFFckQsT0FBTyxJ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Q0FDVCxPQUFPLENBQUMsR0FBRyxDQUNULEtBQUssQ0FBQyxHQUFHLENBQUMsVUFBQyxJQUFTOztnQkFDWixFQUFFLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQzdDLE9BQU8sS0FBSSxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsa0JBQWtCLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQzlELENBQUMsQ0FBQyxDQUNILENBQ0YsQ0FBQztJQUNKLENBQUM7Ozs7OztJQUVELHNDQUFVOzs7OztJQUFWLFVBQVcsTUFBYyxFQUFFLElBQVU7UUFDbkMsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ3BELENBQUM7O2dCQXBQRixVQUFVLFNBQUM7b0JBQ1YsVUFBVSxFQUFFLE1BQU07aUJBQ25COzs7O2dCQXZCUSxrQkFBa0I7Z0JBQUUsc0JBQXNCOzs7NEJBMUJuRDtDQW9TQyxBQXJQRCxJQXFQQztTQWxQWSxpQkFBaUI7Ozs7OztJQUUxQixnQ0FBK0I7Ozs7O0lBQy9CLHdDQUEyQyIsInNvdXJjZXNDb250ZW50IjpbIi8qIVxuICogQGxpY2Vuc2VcbiAqIEFsZnJlc2NvIEV4YW1wbGUgQ29udGVudCBBcHBsaWNhdGlvblxuICpcbiAqIENvcHlyaWdodCAoQykgMjAwNSAtIDIwMjAgQWxmcmVzY28gU29mdHdhcmUgTGltaXRlZFxuICpcbiAqIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIHRoZSBBbGZyZXNjbyBFeGFtcGxlIENvbnRlbnQgQXBwbGljYXRpb24uXG4gKiBJZiB0aGUgc29mdHdhcmUgd2FzIHB1cmNoYXNlZCB1bmRlciBhIHBhaWQgQWxmcmVzY28gbGljZW5zZSwgdGhlIHRlcm1zIG9mXG4gKiB0aGUgcGFpZCBsaWNlbnNlIGFncmVlbWVudCB3aWxsIHByZXZhaWwuICBPdGhlcndpc2UsIHRoZSBzb2Z0d2FyZSBpc1xuICogcHJvdmlkZWQgdW5kZXIgdGhlIGZvbGxvd2luZyBvcGVuIHNvdXJjZSBsaWNlbnNlIHRlcm1zOlxuICpcbiAqIFRoZSBBbGZyZXNjbyBFeGFtcGxlIENvbnRlbnQgQXBwbGljYXRpb24gaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuICogaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgTGVzc2VyIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG4gKiB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuICogKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cbiAqXG4gKiBUaGUgQWxmcmVzY28gRXhhbXBsZSBDb250ZW50IEFwcGxpY2F0aW9uIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG4gKiBidXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuICogTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuICogR05VIExlc3NlciBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG4gKlxuICogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIExlc3NlciBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiBhbG9uZyB3aXRoIEFsZnJlc2NvLiBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG4gKi9cblxuaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQWxmcmVzY29BcGlTZXJ2aWNlLCBVc2VyUHJlZmVyZW5jZXNTZXJ2aWNlIH0gZnJvbSAnQGFsZnJlc2NvL2FkZi1jb3JlJztcbmltcG9ydCB7IE9ic2VydmFibGUsIGZyb20gfSBmcm9tICdyeGpzJztcbmltcG9ydCB7XG4gIE1pbmltYWxOb2RlRW50aXR5LFxuICBOb2RlUGFnaW5nLFxuICBOb2RlLFxuICBEZWxldGVkTm9kZXNQYWdpbmcsXG4gIFBlcnNvbkVudHJ5LFxuICBOb2RlRW50cnksXG4gIERpc2NvdmVyeUVudHJ5LFxuICBGYXZvcml0ZVBhZ2luZyxcbiAgU2hhcmVkTGlua1BhZ2luZyxcbiAgU2VhcmNoUmVxdWVzdCxcbiAgUmVzdWx0U2V0UGFnaW5nLFxuICBTaXRlQm9keSxcbiAgU2l0ZUVudHJ5LFxuICBGYXZvcml0ZUJvZHksXG4gIEZhdm9yaXRlRW50cnlcbn0gZnJvbSAnQGFsZnJlc2NvL2pzLWFwaSc7XG5pbXBvcnQgeyBtYXAgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbkBJbmplY3RhYmxlKHtcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnXG59KVxuZXhwb3J0IGNsYXNzIENvbnRlbnRBcGlTZXJ2aWNlIHtcbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBhcGk6IEFsZnJlc2NvQXBpU2VydmljZSxcbiAgICBwcml2YXRlIHByZWZlcmVuY2VzOiBVc2VyUHJlZmVyZW5jZXNTZXJ2aWNlXG4gICkge31cblxuICAvKipcbiAgICogTW92ZXMgYSBub2RlIHRvIHRoZSB0cmFzaGNhbi5cbiAgICogQHBhcmFtIG5vZGVJZCBJRCBvZiB0aGUgdGFyZ2V0IG5vZGVcbiAgICogQHBhcmFtIG9wdGlvbnMgT3B0aW9uYWwgcGFyYW1ldGVycyBzdXBwb3J0ZWQgYnkgSlMtQVBJXG4gICAqIEByZXR1cm5zIEVtcHR5IHJlc3VsdCB0aGF0IG5vdGlmaWVzIHdoZW4gdGhlIGRlbGV0aW9uIGlzIGNvbXBsZXRlXG4gICAqL1xuICBkZWxldGVOb2RlKFxuICAgIG5vZGVJZDogc3RyaW5nLFxuICAgIG9wdGlvbnM6IHsgcGVybWFuZW50PzogYm9vbGVhbiB9ID0ge31cbiAgKTogT2JzZXJ2YWJsZTx2b2lkPiB7XG4gICAgcmV0dXJuIGZyb20odGhpcy5hcGkubm9kZXNBcGkuZGVsZXRlTm9kZShub2RlSWQsIG9wdGlvbnMpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBzdG9yZWQgaW5mb3JtYXRpb24gYWJvdXQgYSBub2RlLlxuICAgKiBAcGFyYW0gbm9kZUlkIElEIG9mIHRoZSB0YXJnZXQgbm9kZVxuICAgKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25hbCBwYXJhbWV0ZXJzIHN1cHBvcnRlZCBieSBKUy1BUElcbiAgICogQHJldHVybnMgTm9kZSBpbmZvcm1hdGlvblxuICAgKi9cbiAgZ2V0Tm9kZShub2RlSWQ6IHN0cmluZywgb3B0aW9uczogYW55ID0ge30pOiBPYnNlcnZhYmxlPE1pbmltYWxOb2RlRW50aXR5PiB7XG4gICAgY29uc3QgZGVmYXVsdHMgPSB7XG4gICAgICBpbmNsdWRlOiBbJ3BhdGgnLCAncHJvcGVydGllcycsICdhbGxvd2FibGVPcGVyYXRpb25zJywgJ3Blcm1pc3Npb25zJ11cbiAgICB9O1xuICAgIGNvbnN0IHF1ZXJ5T3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oZGVmYXVsdHMsIG9wdGlvbnMpO1xuXG4gICAgcmV0dXJuIGZyb20odGhpcy5hcGkubm9kZXNBcGkuZ2V0Tm9kZShub2RlSWQsIHF1ZXJ5T3B0aW9ucykpO1xuICB9XG5cbiAgZ2V0Tm9kZUluZm8obm9kZUlkOiBzdHJpbmcsIG9wdGlvbnM/OiBhbnkpOiBPYnNlcnZhYmxlPE5vZGU+IHtcbiAgICBjb25zdCBkZWZhdWx0cyA9IHtcbiAgICAgIGluY2x1ZGU6IFsnaXNGYXZvcml0ZScsICdhbGxvd2FibGVPcGVyYXRpb25zJywgJ3BhdGgnXVxuICAgIH07XG4gICAgY29uc3QgcXVlcnlPcHRpb25zID0gT2JqZWN0LmFzc2lnbihkZWZhdWx0cywgb3B0aW9ucyB8fCB7fSk7XG5cbiAgICByZXR1cm4gZnJvbSh0aGlzLmFwaS5ub2Rlc0FwaS5nZXROb2RlSW5mbyhub2RlSWQsIHF1ZXJ5T3B0aW9ucykpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIGl0ZW1zIGNvbnRhaW5lZCBpbiBhIGZvbGRlciBub2RlLlxuICAgKiBAcGFyYW0gbm9kZUlkIElEIG9mIHRoZSB0YXJnZXQgbm9kZVxuICAgKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25hbCBwYXJhbWV0ZXJzIHN1cHBvcnRlZCBieSBKUy1BUElcbiAgICogQHJldHVybnMgTGlzdCBvZiBjaGlsZCBpdGVtcyBmcm9tIHRoZSBmb2xkZXJcbiAgICovXG4gIGdldE5vZGVDaGlsZHJlbihub2RlSWQ6IHN0cmluZywgb3B0aW9uczogYW55ID0ge30pOiBPYnNlcnZhYmxlPE5vZGVQYWdpbmc+IHtcbiAgICBjb25zdCBkZWZhdWx0cyA9IHtcbiAgICAgIG1heEl0ZW1zOiB0aGlzLnByZWZlcmVuY2VzLnBhZ2luYXRpb25TaXplLFxuICAgICAgc2tpcENvdW50OiAwLFxuICAgICAgaW5jbHVkZTogW1xuICAgICAgICAnaXNMb2NrZWQnLFxuICAgICAgICAncGF0aCcsXG4gICAgICAgICdwcm9wZXJ0aWVzJyxcbiAgICAgICAgJ2FsbG93YWJsZU9wZXJhdGlvbnMnLFxuICAgICAgICAncGVybWlzc2lvbnMnXG4gICAgICBdXG4gICAgfTtcbiAgICBjb25zdCBxdWVyeU9wdGlvbnMgPSBPYmplY3QuYXNzaWduKGRlZmF1bHRzLCBvcHRpb25zKTtcblxuICAgIHJldHVybiBmcm9tKHRoaXMuYXBpLm5vZGVzQXBpLmdldE5vZGVDaGlsZHJlbihub2RlSWQsIHF1ZXJ5T3B0aW9ucykpO1xuICB9XG5cbiAgZGVsZXRlU2hhcmVkTGluayhsaW5rSWQ6IHN0cmluZyk6IE9ic2VydmFibGU8YW55PiB7XG4gICAgcmV0dXJuIGZyb20odGhpcy5hcGkuc2hhcmVkTGlua3NBcGkuZGVsZXRlU2hhcmVkTGluayhsaW5rSWQpKTtcbiAgfVxuXG4gIGdldERlbGV0ZWROb2RlcyhvcHRpb25zOiBhbnkgPSB7fSk6IE9ic2VydmFibGU8RGVsZXRlZE5vZGVzUGFnaW5nPiB7XG4gICAgY29uc3QgZGVmYXVsdHMgPSB7XG4gICAgICBpbmNsdWRlOiBbJ3BhdGgnXVxuICAgIH07XG4gICAgY29uc3QgcXVlcnlPcHRpb25zID0gT2JqZWN0LmFzc2lnbihkZWZhdWx0cywgb3B0aW9ucyk7XG5cbiAgICByZXR1cm4gZnJvbSh0aGlzLmFwaS5ub2Rlc0FwaS5nZXREZWxldGVkTm9kZXMocXVlcnlPcHRpb25zKSk7XG4gIH1cblxuICByZXN0b3JlTm9kZShub2RlSWQ6IHN0cmluZyk6IE9ic2VydmFibGU8TWluaW1hbE5vZGVFbnRpdHk+IHtcbiAgICByZXR1cm4gZnJvbSh0aGlzLmFwaS5ub2Rlc0FwaS5yZXN0b3JlTm9kZShub2RlSWQpKTtcbiAgfVxuXG4gIHB1cmdlRGVsZXRlZE5vZGUobm9kZUlkOiBzdHJpbmcpOiBPYnNlcnZhYmxlPGFueT4ge1xuICAgIHJldHVybiBmcm9tKHRoaXMuYXBpLm5vZGVzQXBpLnB1cmdlRGVsZXRlZE5vZGUobm9kZUlkKSk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyBpbmZvcm1hdGlvbiBhYm91dCBhIHVzZXIgaWRlbnRpZmllZCBieSB0aGVpciB1c2VybmFtZS5cbiAgICogQHBhcmFtIHBlcnNvbklkIElEIG9mIHRoZSB0YXJnZXQgdXNlclxuICAgKiBAcmV0dXJucyBVc2VyIGluZm9ybWF0aW9uXG4gICAqL1xuICBnZXRQZXJzb24oXG4gICAgcGVyc29uSWQ6IHN0cmluZyxcbiAgICBvcHRpb25zPzogeyBmaWVsZHM/OiBBcnJheTxzdHJpbmc+IH1cbiAgKTogT2JzZXJ2YWJsZTxQZXJzb25FbnRyeT4ge1xuICAgIHJldHVybiBmcm9tKHRoaXMuYXBpLnBlb3BsZUFwaS5nZXRQZXJzb24ocGVyc29uSWQsIG9wdGlvbnMpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb3B5IGEgbm9kZSB0byBkZXN0aW5hdGlvbiBub2RlXG4gICAqXG4gICAqIEBwYXJhbSBub2RlSWQgVGhlIGlkIG9mIHRoZSBub2RlIHRvIGJlIGNvcGllZFxuICAgKiBAcGFyYW0gdGFyZ2V0UGFyZW50SWQgVGhlIGlkIG9mIHRoZSBmb2xkZXItbm9kZSB3aGVyZSB0aGUgbm9kZSBoYXZlIHRvIGJlIGNvcGllZCB0b1xuICAgKiBAcGFyYW0gbmFtZSBUaGUgbmV3IG5hbWUgZm9yIHRoZSBjb3B5IHRoYXQgd291bGQgYmUgYWRkZWQgb24gdGhlIGRlc3RpbmF0aW9uIGZvbGRlclxuICAgKi9cbiAgY29weU5vZGUoXG4gICAgbm9kZUlkOiBzdHJpbmcsXG4gICAgdGFyZ2V0UGFyZW50SWQ6IHN0cmluZyxcbiAgICBuYW1lPzogc3RyaW5nLFxuICAgIG9wdHM/OiB7IGluY2x1ZGU/OiBBcnJheTxzdHJpbmc+OyBmaWVsZHM/OiBBcnJheTxzdHJpbmc+IH1cbiAgKTogT2JzZXJ2YWJsZTxOb2RlRW50cnk+IHtcbiAgICByZXR1cm4gZnJvbShcbiAgICAgIHRoaXMuYXBpLm5vZGVzQXBpLmNvcHlOb2RlKG5vZGVJZCwgeyB0YXJnZXRQYXJlbnRJZCwgbmFtZSB9LCBvcHRzKVxuICAgICk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyBwcm9kdWN0IGluZm9ybWF0aW9uIGZvciBDb250ZW50IFNlcnZpY2VzLlxuICAgKiBAcmV0dXJucyBQcm9kdWN0VmVyc2lvbk1vZGVsIGNvbnRhaW5pbmcgcHJvZHVjdCBkZXRhaWxzXG4gICAqL1xuICBnZXRSZXBvc2l0b3J5SW5mb3JtYXRpb24oKTogT2JzZXJ2YWJsZTxEaXNjb3ZlcnlFbnRyeT4ge1xuICAgIHJldHVybiBmcm9tKFxuICAgICAgdGhpcy5hcGkuZ2V0SW5zdGFuY2UoKS5kaXNjb3ZlcnkuZGlzY292ZXJ5QXBpLmdldFJlcG9zaXRvcnlJbmZvcm1hdGlvbigpXG4gICAgKTtcbiAgfVxuXG4gIGdldEZhdm9yaXRlcyhcbiAgICBwZXJzb25JZDogc3RyaW5nLFxuICAgIG9wdHM/OiB7XG4gICAgICBza2lwQ291bnQ/OiBudW1iZXI7XG4gICAgICBtYXhJdGVtcz86IG51bWJlcjtcbiAgICAgIHdoZXJlPzogc3RyaW5nO1xuICAgICAgZmllbGRzPzogQXJyYXk8c3RyaW5nPjtcbiAgICB9XG4gICk6IE9ic2VydmFibGU8RmF2b3JpdGVQYWdpbmc+IHtcbiAgICByZXR1cm4gZnJvbSh0aGlzLmFwaS5mYXZvcml0ZXNBcGkuZ2V0RmF2b3JpdGVzKHBlcnNvbklkLCBvcHRzKSk7XG4gIH1cblxuICBnZXRGYXZvcml0ZUxpYnJhcmllcyhcbiAgICBwZXJzb25JZDogc3RyaW5nID0gJy1tZS0nLFxuICAgIG9wdHM/OiBhbnlcbiAgKTogT2JzZXJ2YWJsZTxGYXZvcml0ZVBhZ2luZz4ge1xuICAgIHJldHVybiB0aGlzLmdldEZhdm9yaXRlcyhwZXJzb25JZCwge1xuICAgICAgLi4ub3B0cyxcbiAgICAgIHdoZXJlOiAnKEVYSVNUUyh0YXJnZXQvc2l0ZSkpJ1xuICAgIH0pLnBpcGUoXG4gICAgICBtYXAoKHJlc3BvbnNlOiBGYXZvcml0ZVBhZ2luZykgPT4ge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGxpc3Q6IHtcbiAgICAgICAgICAgIGVudHJpZXM6IHJlc3BvbnNlLmxpc3QuZW50cmllcy5tYXAoKHsgZW50cnkgfTogYW55KSA9PiB7XG4gICAgICAgICAgICAgIGVudHJ5LnRhcmdldC5zaXRlLmNyZWF0ZWRBdCA9IGVudHJ5LmNyZWF0ZWRBdDtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBlbnRyeTogZW50cnkudGFyZ2V0LnNpdGVcbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgcGFnaW5hdGlvbjogcmVzcG9uc2UubGlzdC5wYWdpbmF0aW9uXG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfSlcbiAgICApO1xuICB9XG5cbiAgZmluZFNoYXJlZExpbmtzKG9wdHM/OiBhbnkpOiBPYnNlcnZhYmxlPFNoYXJlZExpbmtQYWdpbmc+IHtcbiAgICByZXR1cm4gZnJvbSh0aGlzLmFwaS5zaGFyZWRMaW5rc0FwaS5maW5kU2hhcmVkTGlua3Mob3B0cykpO1xuICB9XG5cbiAgZ2V0U2hhcmVkTGlua0NvbnRlbnQoc2hhcmVkSWQ6IHN0cmluZywgYXR0YWNobWVudD86IGJvb2xlYW4pOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLmFwaS5jb250ZW50QXBpLmdldFNoYXJlZExpbmtDb250ZW50VXJsKHNoYXJlZElkLCBhdHRhY2htZW50KTtcbiAgfVxuXG4gIHNlYXJjaChyZXF1ZXN0OiBTZWFyY2hSZXF1ZXN0KTogT2JzZXJ2YWJsZTxSZXN1bHRTZXRQYWdpbmc+IHtcbiAgICByZXR1cm4gZnJvbSh0aGlzLmFwaS5zZWFyY2hBcGkuc2VhcmNoKHJlcXVlc3QpKTtcbiAgfVxuXG4gIGdldENvbnRlbnRVcmwobm9kZUlkOiBzdHJpbmcsIGF0dGFjaG1lbnQ/OiBib29sZWFuKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5hcGkuY29udGVudEFwaS5nZXRDb250ZW50VXJsKG5vZGVJZCwgYXR0YWNobWVudCk7XG4gIH1cblxuICBkZWxldGVTaXRlKHNpdGVJZD86IHN0cmluZywgb3B0cz86IHsgcGVybWFuZW50PzogYm9vbGVhbiB9KTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICByZXR1cm4gZnJvbSh0aGlzLmFwaS5zaXRlc0FwaS5kZWxldGVTaXRlKHNpdGVJZCwgb3B0cykpO1xuICB9XG5cbiAgbGVhdmVTaXRlKHNpdGVJZD86IHN0cmluZyk6IE9ic2VydmFibGU8YW55PiB7XG4gICAgcmV0dXJuIGZyb20odGhpcy5hcGkuc2l0ZXNBcGkucmVtb3ZlU2l0ZU1lbWJlcihzaXRlSWQsICctbWUtJykpO1xuICB9XG5cbiAgY3JlYXRlU2l0ZShcbiAgICBzaXRlQm9keTogU2l0ZUJvZHksXG4gICAgb3B0cz86IHtcbiAgICAgIGZpZWxkcz86IEFycmF5PHN0cmluZz47XG4gICAgICBza2lwQ29uZmlndXJhdGlvbj86IGJvb2xlYW47XG4gICAgICBza2lwQWRkVG9GYXZvcml0ZXM/OiBib29sZWFuO1xuICAgIH1cbiAgKTogT2JzZXJ2YWJsZTxTaXRlRW50cnk+IHtcbiAgICByZXR1cm4gZnJvbSh0aGlzLmFwaS5zaXRlc0FwaS5jcmVhdGVTaXRlKHNpdGVCb2R5LCBvcHRzKSk7XG4gIH1cblxuICBnZXRTaXRlKFxuICAgIHNpdGVJZD86IHN0cmluZyxcbiAgICBvcHRzPzogeyByZWxhdGlvbnM/OiBBcnJheTxzdHJpbmc+OyBmaWVsZHM/OiBBcnJheTxzdHJpbmc+IH1cbiAgKTogT2JzZXJ2YWJsZTxTaXRlRW50cnk+IHtcbiAgICByZXR1cm4gZnJvbSh0aGlzLmFwaS5zaXRlc0FwaS5nZXRTaXRlKHNpdGVJZCwgb3B0cykpO1xuICB9XG5cbiAgdXBkYXRlTGlicmFyeShzaXRlSWQ6IHN0cmluZywgc2l0ZUJvZHk6IFNpdGVCb2R5KTogT2JzZXJ2YWJsZTxTaXRlRW50cnk+IHtcbiAgICByZXR1cm4gZnJvbSh0aGlzLmFwaS5zaXRlc0FwaS51cGRhdGVTaXRlKHNpdGVJZCwgc2l0ZUJvZHkpKTtcbiAgfVxuXG4gIGFkZEZhdm9yaXRlKG5vZGVzOiBBcnJheTxNaW5pbWFsTm9kZUVudGl0eT4pOiBPYnNlcnZhYmxlPEZhdm9yaXRlRW50cnk+IHtcbiAgICBjb25zdCBwYXlsb2FkOiBGYXZvcml0ZUJvZHlbXSA9IG5vZGVzLm1hcChub2RlID0+IHtcbiAgICAgIGNvbnN0IHsgaXNGb2xkZXIsIG5vZGVJZCwgaWQgfSA9IDxhbnk+bm9kZS5lbnRyeTtcbiAgICAgIGNvbnN0IHNpdGVJZCA9IG5vZGUuZW50cnlbJ2d1aWQnXTtcbiAgICAgIGNvbnN0IHR5cGUgPSBzaXRlSWQgPyAnc2l0ZScgOiBpc0ZvbGRlciA/ICdmb2xkZXInIDogJ2ZpbGUnO1xuICAgICAgY29uc3QgZ3VpZCA9IHNpdGVJZCB8fCBub2RlSWQgfHwgaWQ7XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIHRhcmdldDoge1xuICAgICAgICAgIFt0eXBlXToge1xuICAgICAgICAgICAgZ3VpZFxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9KTtcblxuICAgIHJldHVybiBmcm9tKHRoaXMuYXBpLmZhdm9yaXRlc0FwaS5hZGRGYXZvcml0ZSgnLW1lLScsIDxhbnk+cGF5bG9hZCkpO1xuICB9XG5cbiAgcmVtb3ZlRmF2b3JpdGUobm9kZXM6IEFycmF5PE1pbmltYWxOb2RlRW50aXR5Pik6IE9ic2VydmFibGU8YW55PiB7XG4gICAgcmV0dXJuIGZyb20oXG4gICAgICBQcm9taXNlLmFsbChcbiAgICAgICAgbm9kZXMubWFwKChub2RlOiBhbnkpID0+IHtcbiAgICAgICAgICBjb25zdCBpZCA9IG5vZGUuZW50cnkubm9kZUlkIHx8IG5vZGUuZW50cnkuaWQ7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuYXBpLmZhdm9yaXRlc0FwaS5yZW1vdmVGYXZvcml0ZVNpdGUoJy1tZS0nLCBpZCk7XG4gICAgICAgIH0pXG4gICAgICApXG4gICAgKTtcbiAgfVxuXG4gIHVubG9ja05vZGUobm9kZUlkOiBzdHJpbmcsIG9wdHM/OiBhbnkpIHtcbiAgICByZXR1cm4gdGhpcy5hcGkubm9kZXNBcGkudW5sb2NrTm9kZShub2RlSWQsIG9wdHMpO1xuICB9XG59XG4iXX0=
