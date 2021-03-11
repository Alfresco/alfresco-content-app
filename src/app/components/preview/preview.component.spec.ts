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

import { Router, ActivatedRoute } from '@angular/router';
import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { UserPreferencesService, UploadService, AlfrescoApiService } from '@alfresco/adf-core';
import { ClosePreviewAction } from '@alfresco/aca-shared/store';
import { PreviewComponent } from './preview.component';
import { of, throwError } from 'rxjs';
import { EffectsModule } from '@ngrx/effects';
import { NodeEffects } from '../../store/effects/node.effects';
import { AppTestingModule } from '../../testing/app-testing.module';
import { ContentApiService, AppHookService } from '@alfresco/aca-shared';
import { Store } from '@ngrx/store';
import { Node, NodePaging, FavoritePaging, SharedLinkPaging, PersonEntry, ResultSetPaging } from '@alfresco/js-api';
import { PreviewModule } from './preview.module';

describe('PreviewComponent', () => {
  let fixture: ComponentFixture<PreviewComponent>;
  let component: PreviewComponent;
  let router: Router;
  let route: ActivatedRoute;
  let preferences: UserPreferencesService;
  let contentApi: ContentApiService;
  let uploadService: UploadService;
  let alfrescoApiService: AlfrescoApiService;
  let appHookService: AppHookService;
  let store: Store<any>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EffectsModule.forRoot([NodeEffects]), PreviewModule, AppTestingModule]
    });

    fixture = TestBed.createComponent(PreviewComponent);
    component = fixture.componentInstance;

    router = TestBed.inject(Router);
    route = TestBed.inject(ActivatedRoute);
    preferences = TestBed.inject(UserPreferencesService);
    contentApi = TestBed.inject(ContentApiService);
    uploadService = TestBed.inject(UploadService);
    alfrescoApiService = TestBed.inject(AlfrescoApiService);
    appHookService = TestBed.inject(AppHookService);
    store = TestBed.inject(Store);
  });

  it('should extract the property path root', () => {
    expect(component.getRootField('some.property.path')).toBe('some');
    expect(component.getRootField('some')).toBe('some');
    expect(component.getRootField('')).toBe('');
    expect(component.getRootField(null)).toBe(null);
  });

  it('should navigate to previous node in sub-folder', () => {
    spyOn(router, 'navigate').and.stub();
    const clickEvent = new MouseEvent('click');

    component.previewLocation = 'personal-files';
    component.folderId = 'folder1';
    component.previousNodeId = 'previous1';
    component.onNavigateBefore(clickEvent);

    expect(router.navigate).toHaveBeenCalledWith(['personal-files', 'folder1', 'preview', 'previous1']);
  });

  it('should navigate back to previous node in the root path', () => {
    spyOn(router, 'navigate').and.stub();
    const clickEvent = new MouseEvent('click');

    component.previewLocation = 'personal-files';
    component.folderId = null;
    component.previousNodeId = 'previous1';
    component.onNavigateBefore(clickEvent);

    expect(router.navigate).toHaveBeenCalledWith(['personal-files', 'preview', 'previous1']);
  });

  it('should not navigate back if node unset', () => {
    spyOn(router, 'navigate').and.stub();
    const clickEvent = new MouseEvent('click');

    component.previousNodeId = null;
    component.onNavigateBefore(clickEvent);

    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should navigate to next node in sub-folder', () => {
    spyOn(router, 'navigate').and.stub();
    const clickEvent = new MouseEvent('click');

    component.previewLocation = 'personal-files';
    component.folderId = 'folder1';
    component.nextNodeId = 'next1';
    component.onNavigateNext(clickEvent);

    expect(router.navigate).toHaveBeenCalledWith(['personal-files', 'folder1', 'preview', 'next1']);
  });

  it('should navigate to next node in the root path', () => {
    spyOn(router, 'navigate').and.stub();
    const clickEvent = new MouseEvent('click');

    component.previewLocation = 'personal-files';
    component.folderId = null;
    component.nextNodeId = 'next1';
    component.onNavigateNext(clickEvent);

    expect(router.navigate).toHaveBeenCalledWith(['personal-files', 'preview', 'next1']);
  });

  it('should not navigate back if node unset', () => {
    spyOn(router, 'navigate').and.stub();
    const clickEvent = new MouseEvent('click');

    component.nextNodeId = null;
    component.onNavigateNext(clickEvent);

    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should generate preview path for a folder only', () => {
    component.previewLocation = 'personal-files';

    expect(component.getPreviewPath('folder1', null)).toEqual(['personal-files', 'folder1']);
  });

  it('should generate preview path for a folder and a node', () => {
    component.previewLocation = 'personal-files';

    expect(component.getPreviewPath('folder1', 'node1')).toEqual(['personal-files', 'folder1', 'preview', 'node1']);
  });

  it('should generate preview path for a node only', () => {
    component.previewLocation = 'personal-files';

    expect(component.getPreviewPath(null, 'node1')).toEqual(['personal-files', 'preview', 'node1']);
  });

  it('should generate preview for the location only', () => {
    component.previewLocation = 'personal-files';

    expect(component.getPreviewPath(null, null)).toEqual(['personal-files']);
  });

  it('should navigate back to root path upon close', () => {
    spyOn(router, 'navigate').and.stub();

    component.routesSkipNavigation = [];
    component.previewLocation = 'libraries';
    component.folderId = null;

    component.onVisibilityChanged(false);

    expect(router.navigate).toHaveBeenCalledWith(['libraries', {}]);
  });

  it('should navigate back to folder path upon close', () => {
    spyOn(router, 'navigate').and.stub();

    component.routesSkipNavigation = [];
    component.previewLocation = 'libraries';
    component.folderId = 'site1';

    component.onVisibilityChanged(false);

    expect(router.navigate).toHaveBeenCalledWith(['libraries', {}, 'site1']);
  });

  it('should not navigate to root path for certain routes upon close', () => {
    spyOn(router, 'navigate').and.stub();

    component.routesSkipNavigation = ['shared'];
    component.previewLocation = 'shared';
    component.folderId = 'folder1';

    component.onVisibilityChanged(false);

    expect(router.navigate).toHaveBeenCalledWith(['shared', {}]);
  });

  it('should not navigate back if viewer is still visible', () => {
    spyOn(router, 'navigate').and.stub();

    component.routesSkipNavigation = [];
    component.previewLocation = 'shared';

    component.onVisibilityChanged(true);

    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should enable multiple document navigation from route data', () => {
    route.snapshot.data = {
      navigateMultiple: true
    };

    component.ngOnInit();

    expect(component.navigateMultiple).toBeTruthy();
  });

  it('should not enable multiple document navigation from route data', () => {
    route.snapshot.data = {};

    component.ngOnInit();

    expect(component.navigateMultiple).toBeFalsy();
  });

  it('should fetch navigation source from route', () => {
    route.snapshot.data = {
      navigateSource: 'personal-files'
    };

    component.ngOnInit();

    expect(component.navigateSource).toBe('personal-files');
  });

  it('should fetch case-insensitive source from route', () => {
    route.snapshot.data = {
      navigateSource: 'PERSONAL-FILES'
    };

    component.navigationSources = ['personal-files'];
    component.ngOnInit();

    expect(component.navigateSource).toBe('PERSONAL-FILES');
  });

  it('should fetch only permitted navigation source from route', () => {
    route.snapshot.data = {
      navigateSource: 'personal-files'
    };

    component.navigationSources = ['shared'];
    component.ngOnInit();

    expect(component.navigateSource).toBeNull();
  });

  it('should display document upon init', () => {
    route.params = of({
      folderId: 'folder1',
      nodeId: 'node1'
    });

    spyOn(component, 'displayNode').and.stub();

    component.ngOnInit();

    expect(component.folderId).toBe('folder1');
    expect(component.displayNode).toHaveBeenCalledWith('node1');
  });

  it('should return empty nearest nodes for missing node id', async () => {
    const nearest = await component.getNearestNodes(null, 'folder1');

    expect(nearest).toEqual({ left: null, right: null });
  });

  it('should return empty nearest nodes for missing folder id', async () => {
    const nearest = await component.getNearestNodes('node1', null);

    expect(nearest).toEqual({ left: null, right: null });
  });

  it('should return empty nearest nodes for crashed fields id request', async () => {
    spyOn(component, 'getFileIds').and.returnValue(Promise.reject('err'));

    const nearest = await component.getNearestNodes('node1', 'folder1');

    expect(nearest).toEqual({ left: null, right: null });
  });

  it('should return nearest nodes', async () => {
    spyOn(component, 'getFileIds').and.returnValue(Promise.resolve(['node1', 'node2', 'node3', 'node4', 'node5']));

    let nearest = await component.getNearestNodes('node1', 'folder1');
    expect(nearest).toEqual({ left: null, right: 'node2' });

    nearest = await component.getNearestNodes('node3', 'folder1');
    expect(nearest).toEqual({ left: 'node2', right: 'node4' });

    nearest = await component.getNearestNodes('node5', 'folder1');
    expect(nearest).toEqual({ left: 'node4', right: null });
  });

  it('should return empty nearest nodes if node is already deleted', async () => {
    spyOn(component, 'getFileIds').and.returnValue(Promise.resolve(['node1', 'node2', 'node3', 'node4', 'node5']));

    const nearest = await component.getNearestNodes('node9', 'folder1');
    expect(nearest).toEqual({ left: null, right: null });
  });

  it('should not display node when id is missing', async () => {
    spyOn(router, 'navigate').and.stub();
    spyOn(contentApi, 'getNodeInfo').and.returnValue(of(null));

    await component.displayNode(null);

    expect(contentApi.getNodeInfo).not.toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should navigate to original location if node not found', async () => {
    spyOn(router, 'navigate').and.stub();
    spyOn(contentApi, 'getNodeInfo').and.returnValue(throwError('error'));

    component.previewLocation = 'personal-files';
    await component.displayNode('folder1');

    expect(contentApi.getNodeInfo).toHaveBeenCalledWith('folder1');
    expect(router.navigate).toHaveBeenCalledWith(['personal-files', 'folder1']);
  });

  it('should navigate to original location if node is not a File', async () => {
    spyOn(router, 'navigate').and.stub();
    spyOn(contentApi, 'getNodeInfo').and.returnValue(
      of({
        isFile: false
      } as Node)
    );

    component.previewLocation = 'personal-files';
    await component.displayNode('folder1');

    expect(contentApi.getNodeInfo).toHaveBeenCalledWith('folder1');
    expect(router.navigate).toHaveBeenCalledWith(['personal-files', 'folder1']);
  });

  it('should navigate to original location in case of Alfresco API errors', async () => {
    spyOn(router, 'navigate').and.stub();
    spyOn(contentApi, 'getNodeInfo').and.returnValue(throwError('error'));

    component.previewLocation = 'personal-files';
    await component.displayNode('folder1');

    expect(contentApi.getNodeInfo).toHaveBeenCalledWith('folder1');
    expect(router.navigate).toHaveBeenCalledWith(['personal-files', 'folder1']);
  });

  it('should fetch and sort file ids for personal-files', async () => {
    preferences.set('personal-files.sorting.key', 'name');
    preferences.set('personal-files.sorting.direction', 'desc');

    spyOn(contentApi, 'getNodeChildren').and.returnValue(
      of({
        list: {
          entries: [{ entry: { id: 'node1', name: 'node 1' } }, { entry: { id: 'node2', name: 'node 2' } }]
        }
      } as NodePaging)
    );

    const ids = await component.getFileIds('personal-files', 'folder1');
    expect(ids).toEqual(['node2', 'node1']);
  });

  it('should fetch file ids for personal-files with default sorting for missing key', async () => {
    preferences.set('personal-files.sorting.key', 'missing');
    preferences.set('personal-files.sorting.direction', 'desc');

    spyOn(contentApi, 'getNodeChildren').and.returnValue(
      of({
        list: {
          entries: [{ entry: { id: 'node1', name: 'node 1' } }, { entry: { id: 'node2', name: 'node 2' } }]
        }
      } as NodePaging)
    );

    const ids = await component.getFileIds('personal-files', 'folder1');
    expect(ids).toEqual(['node1', 'node2']);
  });

  it('should sort file ids for personal-files with [modifiedAt desc]', async () => {
    spyOn(preferences, 'get').and.returnValue(null);

    spyOn(contentApi, 'getNodeChildren').and.returnValue(
      of({
        list: {
          entries: [
            { entry: { id: 'node1', name: 'node 1', modifiedAt: new Date(1) } },
            { entry: { id: 'node2', name: 'node 2', modifiedAt: new Date(2) } }
          ]
        }
      } as NodePaging)
    );

    const ids = await component.getFileIds('personal-files', 'folder1');
    expect(ids).toEqual(['node2', 'node1']);
  });

  it('should fetch and sort file ids for libraries', async () => {
    preferences.set('personal-files.sorting.key', 'name');
    preferences.set('personal-files.sorting.direction', 'desc');

    spyOn(contentApi, 'getNodeChildren').and.returnValue(
      of({
        list: {
          entries: [{ entry: { id: 'node1', name: 'node 1' } }, { entry: { id: 'node2', name: 'node 2' } }]
        }
      } as NodePaging)
    );

    const ids = await component.getFileIds('libraries', 'site1');
    expect(ids).toEqual(['node2', 'node1']);
  });

  it('should require folder id to fetch ids for libraries', async () => {
    const ids = await component.getFileIds('libraries', null);
    expect(ids).toEqual([]);
  });

  it('should sort file ids for libraries with [modifiedAt desc]', async () => {
    spyOn(preferences, 'get').and.returnValue(null);

    spyOn(contentApi, 'getNodeChildren').and.returnValue(
      of({
        list: {
          entries: [
            { entry: { id: 'node1', name: 'node 1', modifiedAt: new Date(1) } },
            { entry: { id: 'node2', name: 'node 2', modifiedAt: new Date(2) } }
          ]
        }
      } as NodePaging)
    );

    const ids = await component.getFileIds('libraries', 'folder1');
    expect(ids).toEqual(['node2', 'node1']);
  });

  it('should fetch and sort ids for favorites', async () => {
    preferences.set('favorites.sorting.key', 'name');
    preferences.set('favorites.sorting.direction', 'desc');

    spyOn(contentApi, 'getFavorites').and.returnValue(
      of({
        list: {
          entries: [
            { entry: { target: { file: { id: 'file3', name: 'file 3' } } } },
            { entry: { target: { file: { id: 'file1', name: 'file 1' } } } },
            { entry: { target: { file: { id: 'file2', name: 'file 2' } } } }
          ]
        }
      } as FavoritePaging)
    );

    const ids = await component.getFileIds('favorites');
    expect(ids).toEqual(['file3', 'file2', 'file1']);
  });

  it('should sort file ids for favorites with [modifiedAt desc]', async () => {
    spyOn(preferences, 'get').and.returnValue(null);

    spyOn(contentApi, 'getFavorites').and.returnValue(
      of({
        list: {
          entries: [
            {
              entry: {
                target: { file: { id: 'file3', modifiedAt: new Date(3) } }
              }
            },
            {
              entry: {
                target: { file: { id: 'file1', modifiedAt: new Date(1) } }
              }
            },
            {
              entry: {
                target: { file: { id: 'file2', modifiedAt: new Date(2) } }
              }
            }
          ]
        }
      } as FavoritePaging)
    );

    const ids = await component.getFileIds('favorites');
    expect(ids).toEqual(['file3', 'file2', 'file1']);
  });

  it('should fetch and sort file ids for shared files', async () => {
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
      } as SharedLinkPaging)
    );

    const ids = await component.getFileIds('shared');
    expect(ids).toEqual(['node1', 'node2']);
  });

  it('should sort file ids for favorites with [modifiedAt desc]', async () => {
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
      } as SharedLinkPaging)
    );

    const ids = await component.getFileIds('shared');
    expect(ids).toEqual(['node2', 'node1']);
  });

  it('should fetch and sort ids for recent-files', async () => {
    preferences.set('recent-files.sorting.key', 'name');
    preferences.set('recent-files.sorting.direction', 'asc');

    spyOn(contentApi, 'getPerson').and.returnValue(
      of({
        entry: { id: 'user' }
      } as PersonEntry)
    );

    spyOn(contentApi, 'search').and.returnValue(
      of({
        list: {
          entries: [
            { entry: { id: 'node2', name: 'node 2', modifiedAt: new Date(2) } },
            { entry: { id: 'node1', name: 'node 1', modifiedAt: new Date(1) } }
          ]
        }
      } as ResultSetPaging)
    );

    const ids = await component.getFileIds('recent-files');
    expect(ids).toEqual(['node1', 'node2']);
  });

  it('should sort file ids for favorites with [modifiedAt desc]', async () => {
    spyOn(preferences, 'get').and.returnValue(null);

    spyOn(contentApi, 'getPerson').and.returnValue(
      of({
        entry: { id: 'user' }
      } as PersonEntry)
    );

    spyOn(contentApi, 'search').and.returnValue(
      of({
        list: {
          entries: [
            { entry: { id: 'node2', name: 'node 2', modifiedAt: new Date(2) } },
            { entry: { id: 'node1', name: 'node 1', modifiedAt: new Date(1) } }
          ]
        }
      } as ResultSetPaging)
    );

    const ids = await component.getFileIds('recent-files');
    expect(ids).toEqual(['node2', 'node1']);
  });

  it('should return to parent folder on nodesDeleted event', async () => {
    spyOn(component, 'navigateToFileLocation');
    fixture.detectChanges();
    await fixture.whenStable();
    appHookService.nodesDeleted.next();

    expect(component.navigateToFileLocation).toHaveBeenCalled();
  });

  it('should return to parent folder on fileUploadDeleted event', async () => {
    spyOn(component, 'navigateToFileLocation');
    fixture.detectChanges();
    await fixture.whenStable();
    uploadService.fileUploadDeleted.next();

    expect(component.navigateToFileLocation).toHaveBeenCalled();
  });

  it('should emit nodeUpdated event on fileUploadComplete event', fakeAsync(() => {
    spyOn(alfrescoApiService.nodeUpdated, 'next');
    fixture.detectChanges();
    uploadService.fileUploadComplete.next({ data: { entry: {} } } as any);
    tick(300);

    expect(alfrescoApiService.nodeUpdated.next).toHaveBeenCalled();
  }));

  it('should return to parent folder when event emitted from extension', async () => {
    spyOn(component, 'navigateToFileLocation');
    fixture.detectChanges();
    await fixture.whenStable();
    store.dispatch(new ClosePreviewAction());
    expect(component.navigateToFileLocation).toHaveBeenCalled();
  });

  describe('Keyboard navigation', () => {
    beforeEach(() => {
      component.nextNodeId = 'nextNodeId';
      component.previousNodeId = 'previousNodeId';
      spyOn(router, 'navigate').and.stub();
    });

    afterEach(() => {
      fixture.destroy();
    });

    it('should not navigate on keyboard event if target is child of sidebar container', () => {
      const parent = document.createElement('div');
      parent.className = 'adf-viewer__sidebar';

      const child = document.createElement('button');
      child.addEventListener('keyup', function (e) {
        component.onNavigateNext(e);
      });
      parent.appendChild(child);
      document.body.appendChild(parent);

      child.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowLeft' }));

      expect(router.navigate).not.toHaveBeenCalled();
    });

    it('should not navigate on keyboard event if target is child of cdk overlay', () => {
      const parent = document.createElement('div');
      parent.className = 'cdk-overlay-container';

      const child = document.createElement('button');
      child.addEventListener('keyup', function (e) {
        component.onNavigateNext(e);
      });
      parent.appendChild(child);
      document.body.appendChild(parent);

      child.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowLeft' }));

      expect(router.navigate).not.toHaveBeenCalled();
    });
  });
});
