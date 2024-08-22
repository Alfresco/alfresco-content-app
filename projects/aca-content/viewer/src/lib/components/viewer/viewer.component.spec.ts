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
import { UploadService, NodesApiService, DiscoveryApiService, DocumentListService } from '@alfresco/adf-content-services';
import { ClosePreviewAction, RefreshPreviewAction, ViewNodeAction } from '@alfresco/aca-shared/store';
import { AcaViewerComponent } from './viewer.component';
import { of } from 'rxjs';
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

const apiError = `{
"error": {
  "errorKey":"EntityNotFound",
  "statusCode":404,
  "briefSummary":"The entity with id: someId was not found",
  "stackTrace":"not displayed",
  "descriptionURL":"some url",
  "logId":"some logId"
  }
}`;

const fakeLocation = 'fakeLocation';

describe('AcaViewerComponent', () => {
  let fixture: ComponentFixture<AcaViewerComponent>;
  let component: AcaViewerComponent;
  let router: Router;
  let route: ActivatedRoute;
  let contentApi: ContentApiService;
  let uploadService: UploadService;
  let nodesApiService: NodesApiService;
  let appHookService: AppHookService;
  let documentListService: DocumentListService;
  let store: Store<any>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LibTestingModule, AcaViewerComponent],
      providers: [
        { provide: DocumentBasePageService, useValue: DocumentBasePageServiceMock },
        { provide: DiscoveryApiService, useValue: discoveryApiServiceMockValue },
        { provide: AuthenticationService, useValue: {} }
      ]
    });

    fixture = TestBed.createComponent(AcaViewerComponent);
    component = fixture.componentInstance;

    router = TestBed.inject(Router);
    route = TestBed.inject(ActivatedRoute);
    contentApi = TestBed.inject(ContentApiService);
    uploadService = TestBed.inject(UploadService);
    nodesApiService = TestBed.inject(NodesApiService);
    appHookService = TestBed.inject(AppHookService);
    documentListService = TestBed.inject(DocumentListService);
    store = TestBed.inject(Store);
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

  it('should navigate to next and previous nodes', () => {
    spyOn(store, 'dispatch');
    spyOn<any>(component, 'getFileLocation').and.returnValue(fakeLocation);
    const clickEvent = new MouseEvent('click');

    component.previousNodeId = 'previous';
    component.onNavigateBefore(clickEvent);
    expect(store.dispatch).toHaveBeenCalledWith(new ViewNodeAction('previous', { location: fakeLocation }));

    component.nextNodeId = 'next';
    component.onNavigateNext(clickEvent);
    expect(store.dispatch).toHaveBeenCalledWith(new ViewNodeAction('next', { location: fakeLocation }));
  });

  describe('Navigate back to node location', () => {
    beforeEach(async () => {
      spyOn<any>(component, 'navigateToFileLocation').and.callThrough();
      component['navigationPath'] = fakeLocation;
      spyOn(router, 'navigateByUrl').and.stub();
    });

    it('should reload document list and navigate to node location upon close', async () => {
      spyOn(documentListService, 'reload');

      component.onViewerVisibilityChanged();

      expect(documentListService.reload).toHaveBeenCalled();
      expect(component['navigateToFileLocation']).toHaveBeenCalled();
      expect(router.navigateByUrl).toHaveBeenCalledWith(fakeLocation);
    });

    it('should navigate to node location if it is not a file', async () => {
      spyOn(contentApi, 'getNodeInfo').and.returnValue(
        of({
          isFile: false
        } as Node)
      );

      await component.displayNode('folder1');

      expect(contentApi.getNodeInfo).toHaveBeenCalledWith('folder1');
      expect(component['navigateToFileLocation']).toHaveBeenCalled();
      expect(router.navigateByUrl).toHaveBeenCalledWith(fakeLocation);
    });
  });

  it('should navigate to node location in case of Alfresco API errors', async () => {
    component['previewLocation'] = 'personal-files';
    spyOn(contentApi, 'getNodeInfo').and.throwError(apiError);
    spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));

    await component.displayNode('folder1');

    expect(contentApi.getNodeInfo).toHaveBeenCalledWith('folder1');
    expect(router.navigate).toHaveBeenCalledWith(['personal-files', 'folder1']);
  });

  it('should emit nodeUpdated event on fileUploadComplete event', fakeAsync(() => {
    spyOn(nodesApiService.nodeUpdated, 'next');
    fixture.detectChanges();
    uploadService.fileUploadComplete.next({ data: { entry: {} } } as any);
    tick(300);

    expect(nodesApiService.nodeUpdated.next).toHaveBeenCalled();
  }));

  describe('return on event', () => {
    beforeEach(async () => {
      spyOn<any>(component, 'navigateToFileLocation');
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('should return to parent folder on fileUploadDeleted event', async () => {
      uploadService.fileUploadDeleted.next();

      expect(component['navigateToFileLocation']).toHaveBeenCalled();
    });

    it('should return to parent folder when event emitted from extension', async () => {
      store.dispatch(new ClosePreviewAction());

      expect(component['navigateToFileLocation']).toHaveBeenCalled();
    });

    it('should return to parent folder on nodesDeleted event', async () => {
      appHookService.nodesDeleted.next();

      expect(component['navigateToFileLocation']).toHaveBeenCalled();
    });
  });

  it('should fetch navigation source from route', () => {
    route.snapshot.data = {
      navigateSource: 'personal-files'
    };

    component.ngOnInit();

    expect(component.navigateSource).toBe('personal-files');
  });

  it('should fetch only permitted navigation source from route', () => {
    route.snapshot.data = {
      navigateSource: 'personal-files'
    };

    component.navigationSources = ['shared'];
    component.ngOnInit();

    expect(component.navigateSource).toBeNull();
  });

  it('should fetch case-insensitive source from route', () => {
    route.snapshot.data = {
      navigateSource: 'PERSONAL-FILES'
    };

    component.navigationSources = ['personal-files'];
    component.ngOnInit();

    expect(component.navigateSource).toBe('PERSONAL-FILES');
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

  it('should call node update after RefreshPreviewAction is triggered', () => {
    spyOn(nodesApiService.nodeUpdated, 'next');
    component.ngOnInit();
    const node = new Node();

    store.dispatch(new RefreshPreviewAction(node));
    expect(nodesApiService.nodeUpdated.next).toHaveBeenCalledWith(node);
  });
});
