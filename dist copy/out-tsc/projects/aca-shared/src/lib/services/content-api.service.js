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
import * as tslib_1 from 'tslib';
import { Injectable } from '@angular/core';
import { AlfrescoApiService, UserPreferencesService } from '@alfresco/adf-core';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';
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
  ContentApiService.prototype.deleteNode = function(nodeId, options) {
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
  ContentApiService.prototype.getNode = function(nodeId, options) {
    if (options === void 0) {
      options = {};
    }
    var defaults = {
      include: ['path', 'properties', 'allowableOperations', 'permissions']
    };
    var queryOptions = Object.assign(defaults, options);
    return from(this.api.nodesApi.getNode(nodeId, queryOptions));
  };
  ContentApiService.prototype.getNodeInfo = function(nodeId, options) {
    var defaults = {
      include: ['isFavorite', 'allowableOperations', 'path']
    };
    var queryOptions = Object.assign(defaults, options || {});
    return from(this.api.nodesApi.getNodeInfo(nodeId, queryOptions));
  };
  /**
   * Gets the items contained in a folder node.
   * @param nodeId ID of the target node
   * @param options Optional parameters supported by JS-API
   * @returns List of child items from the folder
   */
  ContentApiService.prototype.getNodeChildren = function(nodeId, options) {
    if (options === void 0) {
      options = {};
    }
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
    var queryOptions = Object.assign(defaults, options);
    return from(this.api.nodesApi.getNodeChildren(nodeId, queryOptions));
  };
  ContentApiService.prototype.deleteSharedLink = function(linkId) {
    return from(this.api.sharedLinksApi.deleteSharedLink(linkId));
  };
  ContentApiService.prototype.getDeletedNodes = function(options) {
    if (options === void 0) {
      options = {};
    }
    var defaults = {
      include: ['path']
    };
    var queryOptions = Object.assign(defaults, options);
    return from(this.api.nodesApi.getDeletedNodes(queryOptions));
  };
  ContentApiService.prototype.restoreNode = function(nodeId) {
    return from(this.api.nodesApi.restoreNode(nodeId));
  };
  ContentApiService.prototype.purgeDeletedNode = function(nodeId) {
    return from(this.api.nodesApi.purgeDeletedNode(nodeId));
  };
  /**
   * Gets information about a user identified by their username.
   * @param personId ID of the target user
   * @returns User information
   */
  ContentApiService.prototype.getPerson = function(personId, options) {
    return from(this.api.peopleApi.getPerson(personId, options));
  };
  /**
   * Copy a node to destination node
   *
   * @param nodeId The id of the node to be copied
   * @param targetParentId The id of the folder-node where the node have to be copied to
   * @param name The new name for the copy that would be added on the destination folder
   */
  ContentApiService.prototype.copyNode = function(
    nodeId,
    targetParentId,
    name,
    opts
  ) {
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
  ContentApiService.prototype.getRepositoryInformation = function() {
    return from(
      this.api.getInstance().discovery.discoveryApi.getRepositoryInformation()
    );
  };
  ContentApiService.prototype.getFavorites = function(personId, opts) {
    return from(this.api.favoritesApi.getFavorites(personId, opts));
  };
  ContentApiService.prototype.getFavoriteLibraries = function(personId, opts) {
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
  ContentApiService.prototype.findSharedLinks = function(opts) {
    return from(this.api.sharedLinksApi.findSharedLinks(opts));
  };
  ContentApiService.prototype.getSharedLinkContent = function(
    sharedId,
    attachment
  ) {
    return this.api.contentApi.getSharedLinkContentUrl(sharedId, attachment);
  };
  ContentApiService.prototype.search = function(request) {
    return from(this.api.searchApi.search(request));
  };
  ContentApiService.prototype.getContentUrl = function(nodeId, attachment) {
    return this.api.contentApi.getContentUrl(nodeId, attachment);
  };
  ContentApiService.prototype.deleteSite = function(siteId, opts) {
    return from(this.api.sitesApi.deleteSite(siteId, opts));
  };
  ContentApiService.prototype.leaveSite = function(siteId) {
    return from(this.api.sitesApi.removeSiteMember(siteId, '-me-'));
  };
  ContentApiService.prototype.createSite = function(siteBody, opts) {
    return from(this.api.sitesApi.createSite(siteBody, opts));
  };
  ContentApiService.prototype.getSite = function(siteId, opts) {
    return from(this.api.sitesApi.getSite(siteId, opts));
  };
  ContentApiService.prototype.updateLibrary = function(siteId, siteBody) {
    return from(this.api.sitesApi.updateSite(siteId, siteBody));
  };
  ContentApiService.prototype.addFavorite = function(nodes) {
    var payload = nodes.map(function(node) {
      var _a;
      var _b = node.entry,
        isFolder = _b.isFolder,
        nodeId = _b.nodeId,
        id = _b.id;
      var siteId = node.entry['guid'];
      var type = siteId ? 'site' : isFolder ? 'folder' : 'file';
      var guid = siteId || nodeId || id;
      return {
        target: ((_a = {}),
        (_a[type] = {
          guid: guid
        }),
        _a)
      };
    });
    return from(this.api.favoritesApi.addFavorite('-me-', payload));
  };
  ContentApiService.prototype.removeFavorite = function(nodes) {
    var _this = this;
    return from(
      Promise.all(
        nodes.map(function(node) {
          var id = node.entry.nodeId || node.entry.id;
          return _this.api.favoritesApi.removeFavoriteSite('-me-', id);
        })
      )
    );
  };
  ContentApiService.prototype.unlockNode = function(nodeId, opts) {
    return this.api.nodesApi.unlockNode(nodeId, opts);
  };
  ContentApiService = tslib_1.__decorate(
    [
      Injectable({
        providedIn: 'root'
      }),
      tslib_1.__metadata('design:paramtypes', [
        AlfrescoApiService,
        UserPreferencesService
      ])
    ],
    ContentApiService
  );
  return ContentApiService;
})();
export { ContentApiService };
//# sourceMappingURL=content-api.service.js.map
