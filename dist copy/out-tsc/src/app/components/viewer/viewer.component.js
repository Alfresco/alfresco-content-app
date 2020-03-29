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
import { ContentApiService } from '@alfresco/aca-shared';
import {
  getAppSelection,
  isInfoDrawerOpened,
  SetSelectedNodesAction,
  ViewerActionTypes,
  ViewNodeAction,
  ReloadDocumentListAction
} from '@alfresco/aca-shared/store';
import { Component, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router, PRIMARY_OUTLET } from '@angular/router';
import {
  UserPreferencesService,
  ObjectUtils,
  UploadService,
  AlfrescoApiService
} from '@alfresco/adf-core';
import { ContentManagementService } from '../../services/content-management.service';
import { Store } from '@ngrx/store';
import { from, Subject } from 'rxjs';
import { takeUntil, debounceTime } from 'rxjs/operators';
import { AppExtensionService } from '../../extensions/extension.service';
import { Actions, ofType } from '@ngrx/effects';
var AppViewerComponent = /** @class */ (function() {
  function AppViewerComponent(
    router,
    route,
    store,
    extensions,
    contentApi,
    actions$,
    preferences,
    content,
    apiService,
    uploadService
  ) {
    this.router = router;
    this.route = route;
    this.store = store;
    this.extensions = extensions;
    this.contentApi = contentApi;
    this.actions$ = actions$;
    this.preferences = preferences;
    this.content = content;
    this.apiService = apiService;
    this.uploadService = uploadService;
    this.onDestroy$ = new Subject();
    this.folderId = null;
    this.nodeId = null;
    this.showRightSide = false;
    this.openWith = [];
    this.toolbarActions = [];
    this.navigateSource = null;
    this.navigateMultiple = true;
    this.routesSkipNavigation = ['shared', 'recent-files', 'favorites'];
    this.navigationSources = [
      'favorites',
      'libraries',
      'personal-files',
      'recent-files',
      'shared'
    ];
    this.recentFileFilters = [
      'TYPE:"content"',
      '-PNAME:"0/wiki"',
      '-TYPE:"app:filelink"',
      '-TYPE:"fm:post"',
      '-TYPE:"cm:thumbnail"',
      '-TYPE:"cm:failedThumbnail"',
      '-TYPE:"cm:rating"',
      '-TYPE:"dl:dataList"',
      '-TYPE:"dl:todoList"',
      '-TYPE:"dl:issue"',
      '-TYPE:"dl:contact"',
      '-TYPE:"dl:eventAgenda"',
      '-TYPE:"dl:event"',
      '-TYPE:"dl:task"',
      '-TYPE:"dl:simpletask"',
      '-TYPE:"dl:meetingAgenda"',
      '-TYPE:"dl:location"',
      '-TYPE:"fm:topic"',
      '-TYPE:"fm:post"',
      '-TYPE:"ia:calendarEvent"',
      '-TYPE:"lnk:link"'
    ];
    this.containersSkipNavigation = [
      'adf-viewer__sidebar',
      'cdk-overlay-container',
      'adf-image-viewer'
    ];
  }
  AppViewerComponent.prototype.ngOnInit = function() {
    var _this = this;
    this.infoDrawerOpened$ = this.store.select(isInfoDrawerOpened);
    from(this.infoDrawerOpened$)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(function(val) {
        _this.showRightSide = val;
      });
    this.store
      .select(getAppSelection)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(function(selection) {
        _this.selection = selection;
        _this.toolbarActions = _this.extensions.getViewerToolbarActions();
        _this.openWith = _this.extensions.openWithActions;
      });
    this.route.params.subscribe(function(params) {
      _this.folderId = params.folderId;
      var nodeId = params.nodeId;
      if (nodeId) {
        _this.displayNode(nodeId);
      }
    });
    this.route.queryParams.subscribe(function(params) {
      _this.navigationPath = params.path;
    });
    if (this.route.snapshot.data && this.route.snapshot.data.navigateSource) {
      var source = this.route.snapshot.data.navigateSource.toLowerCase();
      if (this.navigationSources.includes(source)) {
        this.navigateSource = this.route.snapshot.data.navigateSource;
      }
    }
    this.actions$
      .pipe(
        ofType(ViewerActionTypes.ClosePreview),
        takeUntil(this.onDestroy$)
      )
      .subscribe(function() {
        return _this.navigateToFileLocation();
      });
    this.content.nodesDeleted
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(function() {
        return _this.navigateToFileLocation();
      });
    this.uploadService.fileUploadDeleted
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(function() {
        return _this.navigateToFileLocation();
      });
    this.uploadService.fileUploadComplete
      .pipe(
        debounceTime(300),
        takeUntil(this.onDestroy$)
      )
      .subscribe(function(file) {
        _this.apiService.nodeUpdated.next(file.data.entry);
        _this.displayNode(file.data.entry.id);
      });
    this.previewLocation = this.router.url
      .substr(0, this.router.url.indexOf('/', 1))
      .replace(/\//g, '');
  };
  AppViewerComponent.prototype.onViewerVisibilityChanged = function() {
    this.store.dispatch(new ReloadDocumentListAction());
    this.navigateToFileLocation();
  };
  AppViewerComponent.prototype.ngOnDestroy = function() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  };
  AppViewerComponent.prototype.trackById = function(_, obj) {
    return obj.id;
  };
  AppViewerComponent.prototype.displayNode = function(id) {
    return tslib_1.__awaiter(this, void 0, void 0, function() {
      var _a, nearest, error_1, statusCode;
      var _this = this;
      return tslib_1.__generator(this, function(_b) {
        switch (_b.label) {
          case 0:
            if (!id) return [3 /*break*/, 6];
            _b.label = 1;
          case 1:
            _b.trys.push([1, 5, , 6]);
            _a = this;
            return [4 /*yield*/, this.contentApi.getNodeInfo(id).toPromise()];
          case 2:
            _a.node = _b.sent();
            this.store.dispatch(
              new SetSelectedNodesAction([{ entry: this.node }])
            );
            if (!(this.node && this.node.isFile)) return [3 /*break*/, 4];
            return [
              4 /*yield*/,
              this.getNearestNodes(this.node.id, this.node.parentId)
            ];
          case 3:
            nearest = _b.sent();
            this.previousNodeId = nearest.left;
            this.nextNodeId = nearest.right;
            this.nodeId = this.node.id;
            this.fileName = this.node.name;
            return [2 /*return*/];
          case 4:
            return [3 /*break*/, 6];
          case 5:
            error_1 = _b.sent();
            statusCode = JSON.parse(error_1.message).error.statusCode;
            if (statusCode !== 401) {
              this.router
                .navigate([this.previewLocation, { outlets: { viewer: null } }])
                .then(function() {
                  _this.router.navigate([_this.previewLocation, id]);
                });
            }
            return [3 /*break*/, 6];
          case 6:
            return [2 /*return*/];
        }
      });
    });
  };
  AppViewerComponent.prototype.onNavigateBefore = function(event) {
    if (event.type !== 'click' && this.shouldNavigate(event.target)) {
      return;
    }
    var location = this.getFileLocation();
    this.store.dispatch(
      new ViewNodeAction(this.previousNodeId, { location: location })
    );
  };
  AppViewerComponent.prototype.onNavigateNext = function(event) {
    if (event.type !== 'click' && this.shouldNavigate(event.target)) {
      return;
    }
    var location = this.getFileLocation();
    this.store.dispatch(
      new ViewNodeAction(this.nextNodeId, { location: location })
    );
  };
  /**
   * Retrieves nearest node information for the given node and folder.
   * @param nodeId Unique identifier of the document node
   * @param folderId Unique identifier of the containing folder node.
   */
  AppViewerComponent.prototype.getNearestNodes = function(nodeId, folderId) {
    return tslib_1.__awaiter(this, void 0, void 0, function() {
      var empty, ids, idx, _a;
      return tslib_1.__generator(this, function(_b) {
        switch (_b.label) {
          case 0:
            empty = {
              left: null,
              right: null
            };
            if (!(nodeId && folderId)) return [3 /*break*/, 5];
            _b.label = 1;
          case 1:
            _b.trys.push([1, 3, , 4]);
            return [
              4 /*yield*/,
              this.getFileIds(this.navigateSource, folderId)
            ];
          case 2:
            ids = _b.sent();
            idx = ids.indexOf(nodeId);
            if (idx >= 0) {
              return [
                2 /*return*/,
                {
                  left: ids[idx - 1] || null,
                  right: ids[idx + 1] || null
                }
              ];
            } else {
              return [2 /*return*/, empty];
            }
            return [3 /*break*/, 4];
          case 3:
            _a = _b.sent();
            return [2 /*return*/, empty];
          case 4:
            return [3 /*break*/, 6];
          case 5:
            return [2 /*return*/, empty];
          case 6:
            return [2 /*return*/];
        }
      });
    });
  };
  /**
   * Retrieves a list of node identifiers for the folder and data source.
   * @param source Data source name. Allowed values are: personal-files, libraries, favorites, shared, recent-files.
   * @param folderId Containing folder node identifier for 'personal-files' and 'libraries' sources.
   */
  AppViewerComponent.prototype.getFileIds = function(source, folderId) {
    return tslib_1.__awaiter(this, void 0, void 0, function() {
      var sortKey,
        sortDirection,
        nodes,
        entries,
        nodes,
        sortKey,
        sortDirection,
        files,
        sortingKey,
        sortingDirection,
        nodes,
        entries,
        person,
        username,
        sortingKey,
        sortingDirection,
        query,
        nodes,
        entries;
      return tslib_1.__generator(this, function(_a) {
        switch (_a.label) {
          case 0:
            if (
              !(
                (source === 'personal-files' || source === 'libraries') &&
                folderId
              )
            )
              return [3 /*break*/, 2];
            sortKey =
              this.preferences.get('personal-files.sorting.key') ||
              'modifiedAt';
            sortDirection =
              this.preferences.get('personal-files.sorting.direction') ||
              'desc';
            return [
              4 /*yield*/,
              this.contentApi
                .getNodeChildren(folderId, {
                  // orderBy: `${sortKey} ${sortDirection}`,
                  fields: ['id', this.getRootField(sortKey)],
                  where: '(isFile=true)'
                })
                .toPromise()
            ];
          case 1:
            nodes = _a.sent();
            entries = nodes.list.entries.map(function(obj) {
              return obj.entry;
            });
            this.sort(entries, sortKey, sortDirection);
            return [
              2 /*return*/,
              entries.map(function(obj) {
                return obj.id;
              })
            ];
          case 2:
            if (!(source === 'favorites')) return [3 /*break*/, 4];
            return [
              4 /*yield*/,
              this.contentApi
                .getFavorites('-me-', {
                  where: '(EXISTS(target/file))',
                  fields: ['target']
                })
                .toPromise()
            ];
          case 3:
            nodes = _a.sent();
            sortKey =
              this.preferences.get('favorites.sorting.key') || 'modifiedAt';
            sortDirection =
              this.preferences.get('favorites.sorting.direction') || 'desc';
            files = nodes.list.entries.map(function(obj) {
              return obj.entry.target.file;
            });
            this.sort(files, sortKey, sortDirection);
            return [
              2 /*return*/,
              files.map(function(f) {
                return f.id;
              })
            ];
          case 4:
            if (!(source === 'shared')) return [3 /*break*/, 6];
            sortingKey =
              this.preferences.get('shared.sorting.key') || 'modifiedAt';
            sortingDirection =
              this.preferences.get('shared.sorting.direction') || 'desc';
            return [
              4 /*yield*/,
              this.contentApi
                .findSharedLinks({
                  fields: ['nodeId', this.getRootField(sortingKey)]
                })
                .toPromise()
            ];
          case 5:
            nodes = _a.sent();
            entries = nodes.list.entries.map(function(obj) {
              return obj.entry;
            });
            this.sort(entries, sortingKey, sortingDirection);
            return [
              2 /*return*/,
              entries.map(function(obj) {
                return obj.nodeId;
              })
            ];
          case 6:
            if (!(source === 'recent-files')) return [3 /*break*/, 9];
            return [4 /*yield*/, this.contentApi.getPerson('-me-').toPromise()];
          case 7:
            person = _a.sent();
            username = person.entry.id;
            sortingKey =
              this.preferences.get('recent-files.sorting.key') || 'modifiedAt';
            sortingDirection =
              this.preferences.get('recent-files.sorting.direction') || 'desc';
            query = {
              query: {
                query: '*',
                language: 'afts'
              },
              filterQueries: [
                { query: 'cm:modified:[NOW/DAY-30DAYS TO NOW/DAY+1DAY]' },
                {
                  query:
                    'cm:modifier:' + username + ' OR cm:creator:' + username
                },
                {
                  query: this.recentFileFilters.join(' AND ')
                }
              ],
              fields: ['id', this.getRootField(sortingKey)],
              include: ['path', 'properties', 'allowableOperations'],
              sort: [
                {
                  type: 'FIELD',
                  field: 'cm:modified',
                  ascending: false
                }
              ]
            };
            return [4 /*yield*/, this.contentApi.search(query).toPromise()];
          case 8:
            nodes = _a.sent();
            entries = nodes.list.entries.map(function(obj) {
              return obj.entry;
            });
            this.sort(entries, sortingKey, sortingDirection);
            return [
              2 /*return*/,
              entries.map(function(obj) {
                return obj.id;
              })
            ];
          case 9:
            return [2 /*return*/, []];
        }
      });
    });
  };
  AppViewerComponent.prototype.sort = function(items, key, direction) {
    var options = {};
    if (key.includes('sizeInBytes') || key === 'name') {
      options.numeric = true;
    }
    items.sort(function(a, b) {
      var left = ObjectUtils.getValue(a, key);
      if (left) {
        left =
          left instanceof Date ? left.valueOf().toString() : left.toString();
      } else {
        left = '';
      }
      var right = ObjectUtils.getValue(b, key);
      if (right) {
        right =
          right instanceof Date ? right.valueOf().toString() : right.toString();
      } else {
        right = '';
      }
      return direction === 'asc'
        ? left.localeCompare(right, undefined, options)
        : right.localeCompare(left, undefined, options);
    });
  };
  /**
   * Get the root field name from the property path.
   * Example: 'property1.some.child.property' => 'property1'
   * @param path Property path
   */
  AppViewerComponent.prototype.getRootField = function(path) {
    if (path) {
      return path.split('.')[0];
    }
    return path;
  };
  AppViewerComponent.prototype.navigateToFileLocation = function() {
    var location = this.getFileLocation();
    this.router.navigateByUrl(location);
  };
  AppViewerComponent.prototype.getFileLocation = function() {
    return this.router
      .parseUrl(this.navigationPath || this.router.url)
      .root.children[PRIMARY_OUTLET].toString();
  };
  AppViewerComponent.prototype.shouldNavigate = function(element) {
    var currentElement = element.parentElement;
    while (currentElement && !this.isChild(currentElement.classList)) {
      currentElement = currentElement.parentElement;
    }
    return !!currentElement;
  };
  AppViewerComponent.prototype.isChild = function(list) {
    var _this = this;
    return Array.from(list).some(function(className) {
      return _this.containersSkipNavigation.includes(className);
    });
  };
  AppViewerComponent = tslib_1.__decorate(
    [
      Component({
        selector: 'app-viewer',
        templateUrl: './viewer.component.html',
        styleUrls: ['./viewer.component.scss'],
        encapsulation: ViewEncapsulation.None,
        host: { class: 'app-viewer' }
      }),
      tslib_1.__metadata('design:paramtypes', [
        Router,
        ActivatedRoute,
        Store,
        AppExtensionService,
        ContentApiService,
        Actions,
        UserPreferencesService,
        ContentManagementService,
        AlfrescoApiService,
        UploadService
      ])
    ],
    AppViewerComponent
  );
  return AppViewerComponent;
})();
export { AppViewerComponent };
//# sourceMappingURL=viewer.component.js.map
