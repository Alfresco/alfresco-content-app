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
import { Component, ViewEncapsulation, HostListener } from '@angular/core';
import { ActivatedRoute, Router, PRIMARY_OUTLET } from '@angular/router';
import { debounceTime, map, takeUntil } from 'rxjs/operators';
import {
  UserPreferencesService,
  ObjectUtils,
  UploadService,
  AlfrescoApiService
} from '@alfresco/adf-core';
import { Store } from '@ngrx/store';
import {
  ViewerActionTypes,
  SetSelectedNodesAction
} from '@alfresco/aca-shared/store';
import { PageComponent } from '../page.component';
import { ContentApiService } from '@alfresco/aca-shared';
import { AppExtensionService } from '../../extensions/extension.service';
import { ContentManagementService } from '../../services/content-management.service';
import { from } from 'rxjs';
import { Actions, ofType } from '@ngrx/effects';
var PreviewComponent = /** @class */ (function(_super) {
  tslib_1.__extends(PreviewComponent, _super);
  function PreviewComponent(
    contentApi,
    preferences,
    route,
    router,
    apiService,
    uploadService,
    actions$,
    store,
    extensions,
    content
  ) {
    var _this = _super.call(this, store, extensions, content) || this;
    _this.contentApi = contentApi;
    _this.preferences = preferences;
    _this.route = route;
    _this.router = router;
    _this.apiService = apiService;
    _this.uploadService = uploadService;
    _this.actions$ = actions$;
    _this.previewLocation = null;
    _this.routesSkipNavigation = ['shared', 'recent-files', 'favorites'];
    _this.navigateSource = null;
    _this.navigationSources = [
      'favorites',
      'libraries',
      'personal-files',
      'recent-files',
      'shared'
    ];
    _this.folderId = null;
    _this.nodeId = null;
    _this.navigateMultiple = false;
    _this.openWith = [];
    _this.contentExtensions = [];
    _this.showRightSide = false;
    _this.recentFileFilters = [
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
    _this.containersSkipNavigation = [
      'adf-viewer__sidebar',
      'cdk-overlay-container',
      'adf-image-viewer'
    ];
    return _this;
  }
  PreviewComponent.prototype.ngOnInit = function() {
    var _this = this;
    _super.prototype.ngOnInit.call(this);
    from(this.infoDrawerOpened$)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(function(val) {
        _this.showRightSide = val;
      });
    this.previewLocation = this.router.url
      .substr(0, this.router.url.indexOf('/', 1))
      .replace(/\//g, '');
    var routeData = this.route.snapshot.data;
    if (routeData.navigateMultiple) {
      this.navigateMultiple = true;
    }
    if (routeData.navigateSource) {
      var source = routeData.navigateSource.toLowerCase();
      if (this.navigationSources.includes(source)) {
        this.navigateSource = routeData.navigateSource;
      }
    }
    this.route.params.subscribe(function(params) {
      _this.folderId = params.folderId;
      var id = params.nodeId;
      if (id) {
        _this.displayNode(id);
      }
    });
    this.subscriptions = this.subscriptions.concat([
      this.content.nodesDeleted.subscribe(function() {
        return _this.navigateToFileLocation(true);
      }),
      this.uploadService.fileUploadDeleted.subscribe(function() {
        return _this.navigateToFileLocation(true);
      }),
      this.uploadService.fileUploadComplete
        .pipe(debounceTime(300))
        .subscribe(function(file) {
          return _this.apiService.nodeUpdated.next(file.data.entry);
        }),
      this.actions$
        .pipe(
          ofType(ViewerActionTypes.ClosePreview),
          map(function() {
            return _this.navigateToFileLocation(true);
          })
        )
        .subscribe(function() {})
    ]);
    this.openWith = this.extensions.openWithActions;
  };
  PreviewComponent.prototype.ngOnDestroy = function() {
    _super.prototype.ngOnDestroy.call(this);
  };
  /**
   * Loads the particular node into the Viewer
   * @param id Unique identifier for the Node to display
   */
  PreviewComponent.prototype.displayNode = function(id) {
    return tslib_1.__awaiter(this, void 0, void 0, function() {
      var _a, nearest, err_1;
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
            return [2 /*return*/];
          case 4:
            this.router.navigate([this.previewLocation, id]);
            return [3 /*break*/, 6];
          case 5:
            err_1 = _b.sent();
            if (!err_1 || err_1.status !== 401) {
              this.router.navigate([this.previewLocation, id]);
            }
            return [3 /*break*/, 6];
          case 6:
            return [2 /*return*/];
        }
      });
    });
  };
  PreviewComponent.prototype.handleKeyboardEvent = function(event) {
    var key = event.keyCode;
    var rightArrow = 39;
    var leftArrow = 37;
    if (key === rightArrow || key === leftArrow) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  };
  /**
   * Handles the visibility change of the Viewer component.
   * @param isVisible Indicator whether Viewer is visible or hidden.
   */
  PreviewComponent.prototype.onVisibilityChanged = function(isVisible) {
    var shouldNavigate = !isVisible;
    this.navigateToFileLocation(shouldNavigate);
  };
  PreviewComponent.prototype.navigateToFileLocation = function(shouldNavigate) {
    var shouldSkipNavigation = this.routesSkipNavigation.includes(
      this.previewLocation
    );
    if (shouldNavigate) {
      var route = this.getNavigationCommands(this.previewLocation);
      if (!shouldSkipNavigation && this.folderId) {
        route.push(this.folderId);
      }
      this.router.navigate(route);
    }
  };
  /** Handles navigation to a previous document */
  PreviewComponent.prototype.onNavigateBefore = function(event) {
    if (event.type !== 'click' && this.shouldNavigate(event.target)) {
      return;
    }
    if (this.previousNodeId) {
      this.router.navigate(
        this.getPreviewPath(this.folderId, this.previousNodeId)
      );
    }
  };
  /** Handles navigation to a next document */
  PreviewComponent.prototype.onNavigateNext = function(event) {
    if (event.type !== 'click' && this.shouldNavigate(event.target)) {
      return;
    }
    if (this.nextNodeId) {
      this.router.navigate(this.getPreviewPath(this.folderId, this.nextNodeId));
    }
  };
  /**
   * Generates a node preview route based on folder and node IDs.
   * @param folderId Folder ID
   * @param nodeId Node ID
   */
  PreviewComponent.prototype.getPreviewPath = function(folderId, nodeId) {
    var route = [this.previewLocation];
    if (folderId) {
      route.push(folderId);
    }
    if (nodeId) {
      route.push('preview', nodeId);
    }
    return route;
  };
  /**
   * Retrieves nearest node information for the given node and folder.
   * @param nodeId Unique identifier of the document node
   * @param folderId Unique identifier of the containing folder node.
   */
  PreviewComponent.prototype.getNearestNodes = function(nodeId, folderId) {
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
  PreviewComponent.prototype.getFileIds = function(source, folderId) {
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
  PreviewComponent.prototype.sort = function(items, key, direction) {
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
  PreviewComponent.prototype.getRootField = function(path) {
    if (path) {
      return path.split('.')[0];
    }
    return path;
  };
  PreviewComponent.prototype.getNavigationCommands = function(url) {
    var urlTree = this.router.parseUrl(url);
    var urlSegmentGroup = urlTree.root.children[PRIMARY_OUTLET];
    if (!urlSegmentGroup) {
      return [url];
    }
    var urlSegments = urlSegmentGroup.segments;
    return urlSegments.reduce(function(acc, item) {
      acc.push(item.path, item.parameters);
      return acc;
    }, []);
  };
  PreviewComponent.prototype.shouldNavigate = function(element) {
    var currentElement = element.parentElement;
    while (currentElement && !this.isChild(currentElement.classList)) {
      currentElement = currentElement.parentElement;
    }
    return !!currentElement;
  };
  PreviewComponent.prototype.isChild = function(list) {
    var _this = this;
    return Array.from(list).some(function(className) {
      return _this.containersSkipNavigation.includes(className);
    });
  };
  tslib_1.__decorate(
    [
      HostListener('document:keydown', ['$event']),
      tslib_1.__metadata('design:type', Function),
      tslib_1.__metadata('design:paramtypes', [KeyboardEvent]),
      tslib_1.__metadata('design:returntype', void 0)
    ],
    PreviewComponent.prototype,
    'handleKeyboardEvent',
    null
  );
  PreviewComponent = tslib_1.__decorate(
    [
      Component({
        selector: 'app-preview',
        templateUrl: 'preview.component.html',
        styleUrls: ['preview.component.scss'],
        encapsulation: ViewEncapsulation.None,
        host: { class: 'app-preview' }
      }),
      tslib_1.__metadata('design:paramtypes', [
        ContentApiService,
        UserPreferencesService,
        ActivatedRoute,
        Router,
        AlfrescoApiService,
        UploadService,
        Actions,
        Store,
        AppExtensionService,
        ContentManagementService
      ])
    ],
    PreviewComponent
  );
  return PreviewComponent;
})(PageComponent);
export { PreviewComponent };
//# sourceMappingURL=preview.component.js.map
