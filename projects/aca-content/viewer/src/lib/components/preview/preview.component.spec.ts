/*!
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * Alfresco Example Content Application
 *
 * This file is part of the Alfresco Example Content Application.
 * If the software was purchased under a paid Alfresco license, the terms of
 * the paid license agreement will prevail. Otherwise, the software is
 * provided under the following open source license terms:
 *
 * The Alfresco Example Content Application is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * The Alfresco Example Content Application is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * from Hyland Software. If not, see <http://www.gnu.org/licenses/>.
 */

import { Router, ActivatedRoute } from '@angular/router';
import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { AuthenticationService } from '@alfresco/adf-core';
import { UploadService, NodesApiService, DiscoveryApiService } from '@alfresco/adf-content-services';
import { ClosePreviewAction } from '@alfresco/aca-shared/store';
import { PreviewComponent } from './preview.component';
import { of, throwError } from 'rxjs';
import {
  ContentApiService,
  AppHookService,
  DocumentBasePageService,
  LibTestingModule,
  discoveryApiServiceMockValue,
  DocumentBasePageServiceMock
} from '@alfresco/aca-shared';
import { Store } from '@ngrx/store';
import { Node } from '@alfresco/js-api';
import { AcaViewerModule } from '../../viewer.module';

const clickEvent = new MouseEvent('click');

describe('PreviewComponent', () => {
  let fixture: ComponentFixture<PreviewComponent>;
  let component: PreviewComponent;
  let router: Router;
  let route: ActivatedRoute;
  let contentApi: ContentApiService;
  let uploadService: UploadService;
  let nodesApiService: NodesApiService;
  let appHookService: AppHookService;
  let store: Store<any>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LibTestingModule, AcaViewerModule],
      providers: [
        { provide: DocumentBasePageService, useValue: DocumentBasePageServiceMock },
        { provide: DiscoveryApiService, useValue: discoveryApiServiceMockValue },
        { provide: AuthenticationService, useValue: {} }
      ]
    });

    fixture = TestBed.createComponent(PreviewComponent);
    component = fixture.componentInstance;

    router = TestBed.inject(Router);
    route = TestBed.inject(ActivatedRoute);
    contentApi = TestBed.inject(ContentApiService);
    uploadService = TestBed.inject(UploadService);
    nodesApiService = TestBed.inject(NodesApiService);
    appHookService = TestBed.inject(AppHookService);
    store = TestBed.inject(Store);
  });

  describe('Navigation', () => {
    beforeEach(() => {
      spyOn(router, 'navigate').and.stub();
    });

    describe('From personal-files', () => {
      beforeEach(() => {
        component.previewLocation = 'personal-files';
      });

      it('should navigate to previous node in sub-folder', () => {
        component.folderId = 'folder1';
        component.previousNodeId = 'previous1';
        component.onNavigateBefore(clickEvent);

        expect(router.navigate).toHaveBeenCalledWith(['personal-files', 'folder1', 'preview', 'previous1']);
      });

      it('should navigate back to previous node in the root path', () => {
        component.folderId = null;
        component.previousNodeId = 'previous1';
        component.onNavigateBefore(clickEvent);

        expect(router.navigate).toHaveBeenCalledWith(['personal-files', 'preview', 'previous1']);
      });

      it('should navigate to next node in sub-folder', () => {
        component.folderId = 'folder1';
        component.nextNodeId = 'next1';

        component.onNavigateNext(clickEvent);

        expect(router.navigate).toHaveBeenCalledWith(['personal-files', 'folder1', 'preview', 'next1']);
      });

      it('should navigate to next node in the root path', () => {
        component.folderId = null;
        component.nextNodeId = 'next1';

        component.onNavigateNext(clickEvent);

        expect(router.navigate).toHaveBeenCalledWith(['personal-files', 'preview', 'next1']);
      });
    });

    it('should not navigate to nearest nodes if node unset', () => {
      component.previousNodeId = null;
      component.nextNodeId = null;

      component.onNavigateBefore(clickEvent);
      component.onNavigateNext(clickEvent);

      expect(router.navigate).not.toHaveBeenCalled();
    });

    it('should navigate back to root path upon close', () => {
      component.routesSkipNavigation = [];
      component.previewLocation = 'libraries';
      component.folderId = null;

      component.onVisibilityChanged(false);

      expect(router.navigate).toHaveBeenCalledWith(['libraries', {}]);
    });

    it('should navigate back to folder path upon close', () => {
      component.routesSkipNavigation = [];
      component.previewLocation = 'libraries';
      component.folderId = 'site1';

      component.onVisibilityChanged(false);

      expect(router.navigate).toHaveBeenCalledWith(['libraries', {}, 'site1']);
    });

    it('should not navigate to root path for certain routes upon close', () => {
      component.routesSkipNavigation = ['shared'];
      component.previewLocation = 'shared';
      component.folderId = 'folder1';

      component.onVisibilityChanged(false);

      expect(router.navigate).toHaveBeenCalledWith(['shared', {}]);
    });

    it('should not navigate back if viewer is still visible', () => {
      component.routesSkipNavigation = [];
      component.previewLocation = 'shared';

      component.onVisibilityChanged(true);

      expect(router.navigate).not.toHaveBeenCalled();
    });
  });

  describe('Generate paths', () => {
    beforeEach(() => {
      component.previewLocation = 'personal-files';
    });

    it('should generate preview path for a folder only', () => {
      expect(component.getPreviewPath('folder1', null)).toEqual(['personal-files', 'folder1']);
    });

    it('should generate preview path for a folder and a node', () => {
      expect(component.getPreviewPath('folder1', 'node1')).toEqual(['personal-files', 'folder1', 'preview', 'node1']);
    });

    it('should generate preview path for a node only', () => {
      expect(component.getPreviewPath(null, 'node1')).toEqual(['personal-files', 'preview', 'node1']);
    });

    it('should generate preview for the location only', () => {
      expect(component.getPreviewPath(null, null)).toEqual(['personal-files']);
    });
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

  it('should set folderId and call displayNode with nodeId upon init', () => {
    route.params = of({
      folderId: 'folder1',
      nodeId: 'node1'
    });

    spyOn(component, 'displayNode').and.stub();

    component.ngOnInit();

    expect(component.folderId).toBe('folder1');
    expect(component.displayNode).toHaveBeenCalledWith('node1');
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
    spyOn(nodesApiService.nodeUpdated, 'next');
    fixture.detectChanges();
    uploadService.fileUploadComplete.next({ data: { entry: {} } } as any);
    tick(300);

    expect(nodesApiService.nodeUpdated.next).toHaveBeenCalled();
  }));

  it('should return to parent folder when event emitted from extension', async () => {
    spyOn(component, 'navigateToFileLocation');
    fixture.detectChanges();
    await fixture.whenStable();
    store.dispatch(new ClosePreviewAction());
    expect(component.navigateToFileLocation).toHaveBeenCalled();
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

  it('should not navigate on keyboard event if target is child of sidebar container or cdk overlay', () => {
    component.nextNodeId = 'node';
    spyOn(router, 'navigate').and.stub();

    const parent = document.createElement('div');
    const child = document.createElement('button');
    child.addEventListener('keyup', function (e) {
      component.onNavigateNext(e);
    });
    parent.appendChild(child);
    document.body.appendChild(parent);

    parent.className = 'adf-viewer__sidebar';
    child.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowRight' }));
    expect(router.navigate).not.toHaveBeenCalled();

    parent.className = 'cdk-overlay-container';
    child.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowRight' }));
    expect(router.navigate).not.toHaveBeenCalled();
  });
});
