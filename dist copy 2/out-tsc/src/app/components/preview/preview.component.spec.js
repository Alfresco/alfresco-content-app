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
var _this = this;
import * as tslib_1 from 'tslib';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TestBed, async, fakeAsync, tick } from '@angular/core/testing';
import {
  UserPreferencesService,
  AppConfigPipe,
  NodeFavoriteDirective,
  UploadService,
  AlfrescoApiService
} from '@alfresco/adf-core';
import { ClosePreviewAction } from '@alfresco/aca-shared/store';
import { PreviewComponent } from './preview.component';
import { of, throwError } from 'rxjs';
import { EffectsModule } from '@ngrx/effects';
import { NodeEffects } from '../../store/effects/node.effects';
import { AppTestingModule } from '../../testing/app-testing.module';
import { ContentApiService } from '@alfresco/aca-shared';
import { ContentManagementService } from '../../services/content-management.service';
import { Store } from '@ngrx/store';
describe('PreviewComponent', function() {
  var fixture;
  var component;
  var router;
  var route;
  var preferences;
  var contentApi;
  var uploadService;
  var alfrescoApiService;
  var contentManagementService;
  var store;
  beforeEach(function() {
    TestBed.configureTestingModule({
      imports: [AppTestingModule, EffectsModule.forRoot([NodeEffects])],
      providers: [AlfrescoApiService, ContentManagementService],
      declarations: [AppConfigPipe, PreviewComponent, NodeFavoriteDirective],
      schemas: [NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(PreviewComponent);
    component = fixture.componentInstance;
    router = TestBed.get(Router);
    route = TestBed.get(ActivatedRoute);
    preferences = TestBed.get(UserPreferencesService);
    contentApi = TestBed.get(ContentApiService);
    uploadService = TestBed.get(UploadService);
    alfrescoApiService = TestBed.get(AlfrescoApiService);
    contentManagementService = TestBed.get(ContentManagementService);
    store = TestBed.get(Store);
  });
  it('should extract the property path root', function() {
    expect(component.getRootField('some.property.path')).toBe('some');
    expect(component.getRootField('some')).toBe('some');
    expect(component.getRootField('')).toBe('');
    expect(component.getRootField(null)).toBe(null);
  });
  it('should navigate to previous node in sub-folder', function() {
    spyOn(router, 'navigate').and.stub();
    var clickEvent = new MouseEvent('click');
    component.previewLocation = 'personal-files';
    component.folderId = 'folder1';
    component.previousNodeId = 'previous1';
    component.onNavigateBefore(clickEvent);
    expect(router.navigate).toHaveBeenCalledWith([
      'personal-files',
      'folder1',
      'preview',
      'previous1'
    ]);
  });
  it('should navigate back to previous node in the root path', function() {
    spyOn(router, 'navigate').and.stub();
    var clickEvent = new MouseEvent('click');
    component.previewLocation = 'personal-files';
    component.folderId = null;
    component.previousNodeId = 'previous1';
    component.onNavigateBefore(clickEvent);
    expect(router.navigate).toHaveBeenCalledWith([
      'personal-files',
      'preview',
      'previous1'
    ]);
  });
  it('should not navigate back if node unset', function() {
    spyOn(router, 'navigate').and.stub();
    var clickEvent = new MouseEvent('click');
    component.previousNodeId = null;
    component.onNavigateBefore(clickEvent);
    expect(router.navigate).not.toHaveBeenCalled();
  });
  it('should navigate to next node in sub-folder', function() {
    spyOn(router, 'navigate').and.stub();
    var clickEvent = new MouseEvent('click');
    component.previewLocation = 'personal-files';
    component.folderId = 'folder1';
    component.nextNodeId = 'next1';
    component.onNavigateNext(clickEvent);
    expect(router.navigate).toHaveBeenCalledWith([
      'personal-files',
      'folder1',
      'preview',
      'next1'
    ]);
  });
  it('should navigate to next node in the root path', function() {
    spyOn(router, 'navigate').and.stub();
    var clickEvent = new MouseEvent('click');
    component.previewLocation = 'personal-files';
    component.folderId = null;
    component.nextNodeId = 'next1';
    component.onNavigateNext(clickEvent);
    expect(router.navigate).toHaveBeenCalledWith([
      'personal-files',
      'preview',
      'next1'
    ]);
  });
  it('should not navigate back if node unset', function() {
    spyOn(router, 'navigate').and.stub();
    var clickEvent = new MouseEvent('click');
    component.nextNodeId = null;
    component.onNavigateNext(clickEvent);
    expect(router.navigate).not.toHaveBeenCalled();
  });
  it('should generate preview path for a folder only', function() {
    component.previewLocation = 'personal-files';
    expect(component.getPreviewPath('folder1', null)).toEqual([
      'personal-files',
      'folder1'
    ]);
  });
  it('should generate preview path for a folder and a node', function() {
    component.previewLocation = 'personal-files';
    expect(component.getPreviewPath('folder1', 'node1')).toEqual([
      'personal-files',
      'folder1',
      'preview',
      'node1'
    ]);
  });
  it('should generate preview path for a node only', function() {
    component.previewLocation = 'personal-files';
    expect(component.getPreviewPath(null, 'node1')).toEqual([
      'personal-files',
      'preview',
      'node1'
    ]);
  });
  it('should generate preview for the location only', function() {
    component.previewLocation = 'personal-files';
    expect(component.getPreviewPath(null, null)).toEqual(['personal-files']);
  });
  it('should navigate back to root path upon close', function() {
    spyOn(router, 'navigate').and.stub();
    component.routesSkipNavigation = [];
    component.previewLocation = 'libraries';
    component.folderId = null;
    component.onVisibilityChanged(false);
    expect(router.navigate).toHaveBeenCalledWith(['libraries', {}]);
  });
  it('should navigate back to folder path upon close', function() {
    spyOn(router, 'navigate').and.stub();
    component.routesSkipNavigation = [];
    component.previewLocation = 'libraries';
    component.folderId = 'site1';
    component.onVisibilityChanged(false);
    expect(router.navigate).toHaveBeenCalledWith(['libraries', {}, 'site1']);
  });
  it('should not navigate to root path for certain routes upon close', function() {
    spyOn(router, 'navigate').and.stub();
    component.routesSkipNavigation = ['shared'];
    component.previewLocation = 'shared';
    component.folderId = 'folder1';
    component.onVisibilityChanged(false);
    expect(router.navigate).toHaveBeenCalledWith(['shared', {}]);
  });
  it('should not navigate back if viewer is still visible', function() {
    spyOn(router, 'navigate').and.stub();
    component.routesSkipNavigation = [];
    component.previewLocation = 'shared';
    component.onVisibilityChanged(true);
    expect(router.navigate).not.toHaveBeenCalled();
  });
  it('should enable multiple document navigation from route data', function() {
    route.snapshot.data = {
      navigateMultiple: true
    };
    component.ngOnInit();
    expect(component.navigateMultiple).toBeTruthy();
  });
  it('should not enable multiple document navigation from route data', function() {
    route.snapshot.data = {};
    component.ngOnInit();
    expect(component.navigateMultiple).toBeFalsy();
  });
  it('should fetch navigation source from route', function() {
    route.snapshot.data = {
      navigateSource: 'personal-files'
    };
    component.ngOnInit();
    expect(component.navigateSource).toBe('personal-files');
  });
  it('should fetch case-insensitive source from route', function() {
    route.snapshot.data = {
      navigateSource: 'PERSONAL-FILES'
    };
    component.navigationSources = ['personal-files'];
    component.ngOnInit();
    expect(component.navigateSource).toBe('PERSONAL-FILES');
  });
  it('should fetch only permitted navigation source from route', function() {
    route.snapshot.data = {
      navigateSource: 'personal-files'
    };
    component.navigationSources = ['shared'];
    component.ngOnInit();
    expect(component.navigateSource).toBeNull();
  });
  it('should display document upon init', function() {
    route.params = of({
      folderId: 'folder1',
      nodeId: 'node1'
    });
    spyOn(component, 'displayNode').and.stub();
    component.ngOnInit();
    expect(component.folderId).toBe('folder1');
    expect(component.displayNode).toHaveBeenCalledWith('node1');
  });
  it('should return empty nearest nodes for missing node id', function() {
    return tslib_1.__awaiter(_this, void 0, void 0, function() {
      var nearest;
      return tslib_1.__generator(this, function(_a) {
        switch (_a.label) {
          case 0:
            return [4 /*yield*/, component.getNearestNodes(null, 'folder1')];
          case 1:
            nearest = _a.sent();
            expect(nearest).toEqual({ left: null, right: null });
            return [2 /*return*/];
        }
      });
    });
  });
  it('should return empty nearest nodes for missing folder id', function() {
    return tslib_1.__awaiter(_this, void 0, void 0, function() {
      var nearest;
      return tslib_1.__generator(this, function(_a) {
        switch (_a.label) {
          case 0:
            return [4 /*yield*/, component.getNearestNodes('node1', null)];
          case 1:
            nearest = _a.sent();
            expect(nearest).toEqual({ left: null, right: null });
            return [2 /*return*/];
        }
      });
    });
  });
  it('should return empty nearest nodes for crashed fields id request', function() {
    return tslib_1.__awaiter(_this, void 0, void 0, function() {
      var nearest;
      return tslib_1.__generator(this, function(_a) {
        switch (_a.label) {
          case 0:
            spyOn(component, 'getFileIds').and.returnValue(
              Promise.reject('err')
            );
            return [4 /*yield*/, component.getNearestNodes('node1', 'folder1')];
          case 1:
            nearest = _a.sent();
            expect(nearest).toEqual({ left: null, right: null });
            return [2 /*return*/];
        }
      });
    });
  });
  it('should return nearest nodes', function() {
    return tslib_1.__awaiter(_this, void 0, void 0, function() {
      var nearest;
      return tslib_1.__generator(this, function(_a) {
        switch (_a.label) {
          case 0:
            spyOn(component, 'getFileIds').and.returnValue(
              Promise.resolve(['node1', 'node2', 'node3', 'node4', 'node5'])
            );
            return [4 /*yield*/, component.getNearestNodes('node1', 'folder1')];
          case 1:
            nearest = _a.sent();
            expect(nearest).toEqual({ left: null, right: 'node2' });
            return [4 /*yield*/, component.getNearestNodes('node3', 'folder1')];
          case 2:
            nearest = _a.sent();
            expect(nearest).toEqual({ left: 'node2', right: 'node4' });
            return [4 /*yield*/, component.getNearestNodes('node5', 'folder1')];
          case 3:
            nearest = _a.sent();
            expect(nearest).toEqual({ left: 'node4', right: null });
            return [2 /*return*/];
        }
      });
    });
  });
  it('should return empty nearest nodes if node is already deleted', function() {
    return tslib_1.__awaiter(_this, void 0, void 0, function() {
      var nearest;
      return tslib_1.__generator(this, function(_a) {
        switch (_a.label) {
          case 0:
            spyOn(component, 'getFileIds').and.returnValue(
              Promise.resolve(['node1', 'node2', 'node3', 'node4', 'node5'])
            );
            return [4 /*yield*/, component.getNearestNodes('node9', 'folder1')];
          case 1:
            nearest = _a.sent();
            expect(nearest).toEqual({ left: null, right: null });
            return [2 /*return*/];
        }
      });
    });
  });
  it('should not display node when id is missing', function() {
    return tslib_1.__awaiter(_this, void 0, void 0, function() {
      return tslib_1.__generator(this, function(_a) {
        switch (_a.label) {
          case 0:
            spyOn(router, 'navigate').and.stub();
            spyOn(contentApi, 'getNodeInfo').and.returnValue(of(null));
            return [4 /*yield*/, component.displayNode(null)];
          case 1:
            _a.sent();
            expect(contentApi.getNodeInfo).not.toHaveBeenCalled();
            expect(router.navigate).not.toHaveBeenCalled();
            return [2 /*return*/];
        }
      });
    });
  });
  it('should navigate to original location if node not found', function() {
    return tslib_1.__awaiter(_this, void 0, void 0, function() {
      return tslib_1.__generator(this, function(_a) {
        switch (_a.label) {
          case 0:
            spyOn(router, 'navigate').and.stub();
            spyOn(contentApi, 'getNodeInfo').and.returnValue(
              Promise.reject('error')
            );
            component.previewLocation = 'personal-files';
            return [4 /*yield*/, component.displayNode('folder1')];
          case 1:
            _a.sent();
            expect(contentApi.getNodeInfo).toHaveBeenCalledWith('folder1');
            expect(router.navigate).toHaveBeenCalledWith([
              'personal-files',
              'folder1'
            ]);
            return [2 /*return*/];
        }
      });
    });
  });
  it('should navigate to original location if node is not a File', function() {
    return tslib_1.__awaiter(_this, void 0, void 0, function() {
      return tslib_1.__generator(this, function(_a) {
        switch (_a.label) {
          case 0:
            spyOn(router, 'navigate').and.stub();
            spyOn(contentApi, 'getNodeInfo').and.returnValue(
              of({
                isFile: false
              })
            );
            component.previewLocation = 'personal-files';
            return [4 /*yield*/, component.displayNode('folder1')];
          case 1:
            _a.sent();
            expect(contentApi.getNodeInfo).toHaveBeenCalledWith('folder1');
            expect(router.navigate).toHaveBeenCalledWith([
              'personal-files',
              'folder1'
            ]);
            return [2 /*return*/];
        }
      });
    });
  });
  it('should navigate to original location in case of Alfresco API errors', function() {
    return tslib_1.__awaiter(_this, void 0, void 0, function() {
      return tslib_1.__generator(this, function(_a) {
        switch (_a.label) {
          case 0:
            spyOn(router, 'navigate').and.stub();
            spyOn(contentApi, 'getNodeInfo').and.returnValue(
              throwError('error')
            );
            component.previewLocation = 'personal-files';
            return [4 /*yield*/, component.displayNode('folder1')];
          case 1:
            _a.sent();
            expect(contentApi.getNodeInfo).toHaveBeenCalledWith('folder1');
            expect(router.navigate).toHaveBeenCalledWith([
              'personal-files',
              'folder1'
            ]);
            return [2 /*return*/];
        }
      });
    });
  });
  // todo: Fix after Angular6 migration
  xit('should navigate to original location in case of internal errors', function() {
    return tslib_1.__awaiter(_this, void 0, void 0, function() {
      return tslib_1.__generator(this, function(_a) {
        switch (_a.label) {
          case 0:
            spyOn(router, 'navigate').and.stub();
            spyOn(contentApi, 'getNodeInfo').and.returnValue(
              of({
                isFile: true
              })
            );
            spyOn(component, 'getNearestNodes').and.returnValue(
              Promise.reject('error')
            );
            component.previewLocation = 'personal-files';
            return [4 /*yield*/, component.displayNode('folder1')];
          case 1:
            _a.sent();
            expect(contentApi.getNodeInfo).toHaveBeenCalledWith('folder1');
            expect(router.navigate).toHaveBeenCalledWith([
              'personal-files',
              'folder1'
            ]);
            return [2 /*return*/];
        }
      });
    });
  });
  xit('should setup node for displaying', function() {
    return tslib_1.__awaiter(_this, void 0, void 0, function() {
      return tslib_1.__generator(this, function(_a) {
        switch (_a.label) {
          case 0:
            spyOn(router, 'navigate').and.stub();
            spyOn(component, 'getNearestNodes').and.returnValue({
              left: 'node1',
              right: 'node3'
            });
            spyOn(contentApi, 'getNodeInfo').and.returnValue(
              of({
                id: 'node2',
                parentId: 'parent1',
                isFile: true
              })
            );
            return [4 /*yield*/, component.displayNode('node2')];
          case 1:
            _a.sent();
            expect(component.previousNodeId).toBe('node1');
            expect(component.nextNodeId).toBe('node3');
            expect(component.nodeId).toBe('node2');
            expect(router.navigate).not.toHaveBeenCalled();
            return [2 /*return*/];
        }
      });
    });
  });
  it('should fetch and sort file ids for personal-files', function() {
    return tslib_1.__awaiter(_this, void 0, void 0, function() {
      var ids;
      return tslib_1.__generator(this, function(_a) {
        switch (_a.label) {
          case 0:
            preferences.set('personal-files.sorting.key', 'name');
            preferences.set('personal-files.sorting.direction', 'desc');
            spyOn(contentApi, 'getNodeChildren').and.returnValue(
              of({
                list: {
                  entries: [
                    { entry: { id: 'node1', name: 'node 1' } },
                    { entry: { id: 'node2', name: 'node 2' } }
                  ]
                }
              })
            );
            return [
              4 /*yield*/,
              component.getFileIds('personal-files', 'folder1')
            ];
          case 1:
            ids = _a.sent();
            expect(ids).toEqual(['node2', 'node1']);
            return [2 /*return*/];
        }
      });
    });
  });
  it('should fetch file ids for personal-files with default sorting for missing key', function() {
    return tslib_1.__awaiter(_this, void 0, void 0, function() {
      var ids;
      return tslib_1.__generator(this, function(_a) {
        switch (_a.label) {
          case 0:
            preferences.set('personal-files.sorting.key', 'missing');
            preferences.set('personal-files.sorting.direction', 'desc');
            spyOn(contentApi, 'getNodeChildren').and.returnValue(
              of({
                list: {
                  entries: [
                    { entry: { id: 'node1', name: 'node 1' } },
                    { entry: { id: 'node2', name: 'node 2' } }
                  ]
                }
              })
            );
            return [
              4 /*yield*/,
              component.getFileIds('personal-files', 'folder1')
            ];
          case 1:
            ids = _a.sent();
            expect(ids).toEqual(['node1', 'node2']);
            return [2 /*return*/];
        }
      });
    });
  });
  xit('should require folder id to fetch ids for personal-files', function() {
    return tslib_1.__awaiter(_this, void 0, void 0, function() {
      var ids;
      return tslib_1.__generator(this, function(_a) {
        switch (_a.label) {
          case 0:
            return [4 /*yield*/, component.getFileIds('personal-files', null)];
          case 1:
            ids = _a.sent();
            expect(ids).toEqual([]);
            return [2 /*return*/];
        }
      });
    });
  });
  it('should sort file ids for personal-files with [modifiedAt desc]', function() {
    return tslib_1.__awaiter(_this, void 0, void 0, function() {
      var ids;
      return tslib_1.__generator(this, function(_a) {
        switch (_a.label) {
          case 0:
            spyOn(preferences, 'get').and.returnValue(null);
            spyOn(contentApi, 'getNodeChildren').and.returnValue(
              of({
                list: {
                  entries: [
                    { entry: { id: 'node1', name: 'node 1', modifiedAt: 1 } },
                    { entry: { id: 'node2', name: 'node 2', modifiedAt: 2 } }
                  ]
                }
              })
            );
            return [
              4 /*yield*/,
              component.getFileIds('personal-files', 'folder1')
            ];
          case 1:
            ids = _a.sent();
            expect(ids).toEqual(['node2', 'node1']);
            return [2 /*return*/];
        }
      });
    });
  });
  it('should fetch and sort file ids for libraries', function() {
    return tslib_1.__awaiter(_this, void 0, void 0, function() {
      var ids;
      return tslib_1.__generator(this, function(_a) {
        switch (_a.label) {
          case 0:
            preferences.set('personal-files.sorting.key', 'name');
            preferences.set('personal-files.sorting.direction', 'desc');
            spyOn(contentApi, 'getNodeChildren').and.returnValue(
              of({
                list: {
                  entries: [
                    { entry: { id: 'node1', name: 'node 1' } },
                    { entry: { id: 'node2', name: 'node 2' } }
                  ]
                }
              })
            );
            return [4 /*yield*/, component.getFileIds('libraries', 'site1')];
          case 1:
            ids = _a.sent();
            expect(ids).toEqual(['node2', 'node1']);
            return [2 /*return*/];
        }
      });
    });
  });
  it('should require folder id to fetch ids for libraries', function() {
    return tslib_1.__awaiter(_this, void 0, void 0, function() {
      var ids;
      return tslib_1.__generator(this, function(_a) {
        switch (_a.label) {
          case 0:
            return [4 /*yield*/, component.getFileIds('libraries', null)];
          case 1:
            ids = _a.sent();
            expect(ids).toEqual([]);
            return [2 /*return*/];
        }
      });
    });
  });
  it('should sort file ids for libraries with [modifiedAt desc]', function() {
    return tslib_1.__awaiter(_this, void 0, void 0, function() {
      var ids;
      return tslib_1.__generator(this, function(_a) {
        switch (_a.label) {
          case 0:
            spyOn(preferences, 'get').and.returnValue(null);
            spyOn(contentApi, 'getNodeChildren').and.returnValue(
              of({
                list: {
                  entries: [
                    {
                      entry: {
                        id: 'node1',
                        name: 'node 1',
                        modifiedAt: new Date(1)
                      }
                    },
                    {
                      entry: {
                        id: 'node2',
                        name: 'node 2',
                        modifiedAt: new Date(2)
                      }
                    }
                  ]
                }
              })
            );
            return [4 /*yield*/, component.getFileIds('libraries', 'folder1')];
          case 1:
            ids = _a.sent();
            expect(ids).toEqual(['node2', 'node1']);
            return [2 /*return*/];
        }
      });
    });
  });
  it('should fetch and sort ids for favorites', function() {
    return tslib_1.__awaiter(_this, void 0, void 0, function() {
      var ids;
      return tslib_1.__generator(this, function(_a) {
        switch (_a.label) {
          case 0:
            preferences.set('favorites.sorting.key', 'name');
            preferences.set('favorites.sorting.direction', 'desc');
            spyOn(contentApi, 'getFavorites').and.returnValue(
              of({
                list: {
                  entries: [
                    {
                      entry: {
                        target: { file: { id: 'file3', name: 'file 3' } }
                      }
                    },
                    {
                      entry: {
                        target: { file: { id: 'file1', name: 'file 1' } }
                      }
                    },
                    {
                      entry: {
                        target: { file: { id: 'file2', name: 'file 2' } }
                      }
                    }
                  ]
                }
              })
            );
            return [4 /*yield*/, component.getFileIds('favorites')];
          case 1:
            ids = _a.sent();
            expect(ids).toEqual(['file3', 'file2', 'file1']);
            return [2 /*return*/];
        }
      });
    });
  });
  it('should sort file ids for favorites with [modifiedAt desc]', function() {
    return tslib_1.__awaiter(_this, void 0, void 0, function() {
      var ids;
      return tslib_1.__generator(this, function(_a) {
        switch (_a.label) {
          case 0:
            spyOn(preferences, 'get').and.returnValue(null);
            spyOn(contentApi, 'getFavorites').and.returnValue(
              of({
                list: {
                  entries: [
                    {
                      entry: {
                        target: {
                          file: { id: 'file3', modifiedAt: new Date(3) }
                        }
                      }
                    },
                    {
                      entry: {
                        target: {
                          file: { id: 'file1', modifiedAt: new Date(1) }
                        }
                      }
                    },
                    {
                      entry: {
                        target: {
                          file: { id: 'file2', modifiedAt: new Date(2) }
                        }
                      }
                    }
                  ]
                }
              })
            );
            return [4 /*yield*/, component.getFileIds('favorites')];
          case 1:
            ids = _a.sent();
            expect(ids).toEqual(['file3', 'file2', 'file1']);
            return [2 /*return*/];
        }
      });
    });
  });
  it('should fetch and sort file ids for shared files', function() {
    return tslib_1.__awaiter(_this, void 0, void 0, function() {
      var ids;
      return tslib_1.__generator(this, function(_a) {
        switch (_a.label) {
          case 0:
            preferences.set('shared.sorting.key', 'name');
            preferences.set('shared.sorting.direction', 'asc');
            spyOn(contentApi, 'findSharedLinks').and.returnValue(
              of({
                list: {
                  entries: [
                    {
                      entry: {
                        nodeId: 'node2',
                        name: 'node 2',
                        modifiedAt: new Date(2)
                      }
                    },
                    {
                      entry: {
                        nodeId: 'node1',
                        name: 'node 1',
                        modifiedAt: new Date(1)
                      }
                    }
                  ]
                }
              })
            );
            return [4 /*yield*/, component.getFileIds('shared')];
          case 1:
            ids = _a.sent();
            expect(ids).toEqual(['node1', 'node2']);
            return [2 /*return*/];
        }
      });
    });
  });
  it('should sort file ids for favorites with [modifiedAt desc]', function() {
    return tslib_1.__awaiter(_this, void 0, void 0, function() {
      var ids;
      return tslib_1.__generator(this, function(_a) {
        switch (_a.label) {
          case 0:
            spyOn(preferences, 'get').and.returnValue(null);
            spyOn(contentApi, 'findSharedLinks').and.returnValue(
              of({
                list: {
                  entries: [
                    {
                      entry: {
                        nodeId: 'node2',
                        name: 'node 2',
                        modifiedAt: new Date(2)
                      }
                    },
                    {
                      entry: {
                        nodeId: 'node1',
                        name: 'node 1',
                        modifiedAt: new Date(1)
                      }
                    }
                  ]
                }
              })
            );
            return [4 /*yield*/, component.getFileIds('shared')];
          case 1:
            ids = _a.sent();
            expect(ids).toEqual(['node2', 'node1']);
            return [2 /*return*/];
        }
      });
    });
  });
  it('should fetch and sort ids for recent-files', function() {
    return tslib_1.__awaiter(_this, void 0, void 0, function() {
      var ids;
      return tslib_1.__generator(this, function(_a) {
        switch (_a.label) {
          case 0:
            preferences.set('recent-files.sorting.key', 'name');
            preferences.set('recent-files.sorting.direction', 'asc');
            spyOn(contentApi, 'getPerson').and.returnValue(
              of({
                entry: { id: 'user' }
              })
            );
            spyOn(contentApi, 'search').and.returnValue(
              of({
                list: {
                  entries: [
                    {
                      entry: {
                        id: 'node2',
                        name: 'node 2',
                        modifiedAt: new Date(2)
                      }
                    },
                    {
                      entry: {
                        id: 'node1',
                        name: 'node 1',
                        modifiedAt: new Date(1)
                      }
                    }
                  ]
                }
              })
            );
            return [4 /*yield*/, component.getFileIds('recent-files')];
          case 1:
            ids = _a.sent();
            expect(ids).toEqual(['node1', 'node2']);
            return [2 /*return*/];
        }
      });
    });
  });
  it('should sort file ids for favorites with [modifiedAt desc]', function() {
    return tslib_1.__awaiter(_this, void 0, void 0, function() {
      var ids;
      return tslib_1.__generator(this, function(_a) {
        switch (_a.label) {
          case 0:
            spyOn(preferences, 'get').and.returnValue(null);
            spyOn(contentApi, 'getPerson').and.returnValue(
              of({
                entry: { id: 'user' }
              })
            );
            spyOn(contentApi, 'search').and.returnValue(
              of({
                list: {
                  entries: [
                    {
                      entry: {
                        id: 'node2',
                        name: 'node 2',
                        modifiedAt: new Date(2)
                      }
                    },
                    {
                      entry: {
                        id: 'node1',
                        name: 'node 1',
                        modifiedAt: new Date(1)
                      }
                    }
                  ]
                }
              })
            );
            return [4 /*yield*/, component.getFileIds('recent-files')];
          case 1:
            ids = _a.sent();
            expect(ids).toEqual(['node2', 'node1']);
            return [2 /*return*/];
        }
      });
    });
  });
  it('should return to parent folder on nodesDeleted event', async(function() {
    spyOn(component, 'navigateToFileLocation');
    fixture.detectChanges();
    contentManagementService.nodesDeleted.next();
    expect(component.navigateToFileLocation).toHaveBeenCalled();
  }));
  it('should return to parent folder on fileUploadDeleted event', async(function() {
    spyOn(component, 'navigateToFileLocation');
    fixture.detectChanges();
    uploadService.fileUploadDeleted.next();
    expect(component.navigateToFileLocation).toHaveBeenCalled();
  }));
  it('should emit nodeUpdated event on fileUploadComplete event', fakeAsync(function() {
    spyOn(alfrescoApiService.nodeUpdated, 'next');
    fixture.detectChanges();
    uploadService.fileUploadComplete.next({ data: { entry: {} } });
    tick(300);
    expect(alfrescoApiService.nodeUpdated.next).toHaveBeenCalled();
  }));
  it('should return to parent folder when event emitted from extension', async(function() {
    spyOn(component, 'navigateToFileLocation');
    fixture.detectChanges();
    store.dispatch(new ClosePreviewAction());
    expect(component.navigateToFileLocation).toHaveBeenCalled();
  }));
  describe('Keyboard navigation', function() {
    beforeEach(function() {
      component.nextNodeId = 'nextNodeId';
      component.previousNodeId = 'previousNodeId';
      spyOn(router, 'navigate').and.stub();
    });
    afterEach(function() {
      fixture.destroy();
    });
    it('should not navigate on keyboard event if target is child of sidebar container', function() {
      var parent = document.createElement('div');
      parent.className = 'adf-viewer__sidebar';
      var child = document.createElement('button');
      child.addEventListener('keyup', function(e) {
        component.onNavigateNext(e);
      });
      parent.appendChild(child);
      document.body.appendChild(parent);
      child.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowLeft' }));
      expect(router.navigate).not.toHaveBeenCalled();
    });
    it('should not navigate on keyboard event if target is child of cdk overlay', function() {
      var parent = document.createElement('div');
      parent.className = 'cdk-overlay-container';
      var child = document.createElement('button');
      child.addEventListener('keyup', function(e) {
        component.onNavigateNext(e);
      });
      parent.appendChild(child);
      document.body.appendChild(parent);
      child.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowLeft' }));
      expect(router.navigate).not.toHaveBeenCalled();
    });
  });
});
//# sourceMappingURL=preview.component.spec.js.map
