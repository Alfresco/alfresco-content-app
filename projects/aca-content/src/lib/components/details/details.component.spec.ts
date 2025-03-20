/*!
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppTestingModule } from '../../testing/app-testing.module';
import { DetailsComponent } from './details.component';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, of, Subject } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Store } from '@ngrx/store';
import { ContentApiService } from '@alfresco/aca-shared';
import { NavigateToFolder, SetSelectedNodesAction } from '@alfresco/aca-shared/store';
import { Node, NodeEntry, PathElement } from '@alfresco/js-api';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthenticationService, CORE_PIPES, PageTitleService } from '@alfresco/adf-core';
import { BreadcrumbComponent, ContentService, NodesApiService, SearchQueryBuilderService } from '@alfresco/adf-content-services';
import { By } from '@angular/platform-browser';
import { ContentActionRef } from '@alfresco/adf-extensions';
import { MatSnackBarModule } from '@angular/material/snack-bar';

describe('DetailsComponent', () => {
  let component: DetailsComponent;
  let fixture: ComponentFixture<DetailsComponent>;
  let contentApiService: ContentApiService;
  let contentService: ContentService;
  let nodesApiService: NodesApiService;
  let store: Store;
  let node: NodeEntry;

  const mockStream = new Subject();
  const storeMock = {
    dispatch: jasmine.createSpy('dispatch').and.stub(),
    select: () => mockStream
  };

  const extensionsServiceMock = {
    getAllowedSidebarActions: jasmine.createSpy('getAllowedSidebarActions')
  };

  const mockAspectActions: ContentActionRef[] = [];

  const mockAspectActionsSubject$ = new BehaviorSubject(mockAspectActions);
  extensionsServiceMock.getAllowedSidebarActions.and.returnValue(mockAspectActionsSubject$.asObservable());

  const getBreadcrumb = (): BreadcrumbComponent => fixture.debugElement.query(By.directive(BreadcrumbComponent)).componentInstance;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule, DetailsComponent, ...CORE_PIPES, MatSnackBarModule],
      providers: [
        RouterTestingModule,
        SearchQueryBuilderService,
        { provide: Store, useValue: storeMock },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { data: { preferencePrefix: 'prefix' } },
            params: of({ nodeId: 'someId', activeTab: 'permissions' })
          }
        },
        {
          provide: PageTitleService,
          useValue: {}
        },
        {
          provide: AuthenticationService,
          useValue: {
            onLogin: new Subject<any>(),
            onLogout: new Subject<any>(),
            isLoggedIn: () => true
          }
        },
        ...CORE_PIPES
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });

    fixture = TestBed.createComponent(DetailsComponent);
    component = fixture.componentInstance;
    contentApiService = TestBed.inject(ContentApiService);
    contentService = TestBed.inject(ContentService);
    nodesApiService = TestBed.inject(NodesApiService);
    store = TestBed.inject(Store);
    storeMock.dispatch.calls.reset();

    node = {
      entry: {
        id: 'libraryId',
        name: 'my library',
        isFile: false,
        isFolder: false,
        modifiedAt: new Date(),
        createdAt: new Date(),
        nodeType: '',
        createdByUser: { id: '', displayName: '' },
        modifiedByUser: { id: '', displayName: '' },
        aspectNames: []
      }
    };
    spyOn(contentApiService, 'getNode').and.returnValue(of(node));
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should get node id from router', () => {
    fixture.detectChanges();
    expect(component.nodeId).toBe('someId');
  });

  it('should set active tab from router', () => {
    fixture.detectChanges();
    expect(component.activeTab).toBe(2);
  });

  it('should get node info after setting node from router', () => {
    fixture.detectChanges();
    expect(contentApiService.getNode).toHaveBeenCalled();
  });

  it('should dispatch navigation to a given folder', () => {
    const pathElement: PathElement = {
      id: 'fake-id'
    };
    getBreadcrumb().navigate.emit(pathElement);
    fixture.detectChanges();

    expect(store.dispatch).toHaveBeenCalledWith(new NavigateToFolder({ entry: pathElement } as NodeEntry));
  });

  it('should pass different node as folderNode to breadcrumb when nodeUpdated from nodesApiService is triggered', () => {
    fixture.detectChanges();
    const breadcrumbComponent = getBreadcrumb();
    const updatedNode = {
      name: 'other node'
    } as Node;

    nodesApiService.nodeUpdated.next(updatedNode);
    fixture.detectChanges();
    expect(breadcrumbComponent.folderNode).toEqual(updatedNode);
    expect(breadcrumbComponent.folderNode).not.toBe(updatedNode);
    expect(updatedNode).not.toEqual(node.entry);
  });

  it('should dispatch node selection', () => {
    fixture.detectChanges();
    expect(store.dispatch).toHaveBeenCalledWith(new SetSelectedNodesAction([node]));
  });

  it('should set aspectActions from extensions', async () => {
    extensionsServiceMock.getAllowedSidebarActions.and.returnValue(of(mockAspectActions));
    fixture.detectChanges();
    await fixture.whenStable().then(() => {
      expect(component.aspectActions).toEqual(mockAspectActions);
    });
  });

  it('should return the icon when getNodeIcon is called', () => {
    const expectedIcon = 'assets/images/ft_ic_folder';
    spyOn(contentService, 'getNodeIcon').and.returnValue(expectedIcon);
    fixture.detectChanges();
    component.ngOnInit();
    expect(contentService.getNodeIcon).toHaveBeenCalled();
    expect(component.nodeIcon).toContain(expectedIcon);
  });

  it('should set aspectActions from extension mock', () => {
    const extensionMock = {
      getAllowedSidebarActions: () =>
        of([
          {
            id: 'app.sidebar.close',
            order: 100,
            title: 'close',
            icon: 'highlight_off'
          }
        ])
    };

    extensionsServiceMock.getAllowedSidebarActions.and.returnValue(of(extensionMock));
    fixture.detectChanges();
    fixture
      .whenStable()
      .then(() => {
        expect(component.aspectActions).toEqual([
          {
            id: 'app.sidebar.close',
            order: 100,
            title: 'close',
            icon: 'highlight_off'
          } as ContentActionRef
        ]);
      })
      .catch((error) => {
        fail(`An error occurred: ${error}`);
      });
  });

  it('should disable the permissions tab for smart folders based on aspects', () => {
    node.entry.isFolder = true;
    node.entry.aspectNames = ['smf:customConfigSmartFolder'];
    fixture.detectChanges();
    component.ngOnInit();
    expect(component.canManagePermissions).toBeFalse();
    expect(component.activeTab).not.toBe(2);
  });

  it('should enable the permissions tab for regular folders based on aspects', () => {
    node.entry.isFolder = true;
    node.entry.aspectNames = [];
    fixture.detectChanges();
    component.ngOnInit();

    expect(component.canManagePermissions).toBeTrue();
  });

  it('should change active tab based on canManagePermissions and tabName', () => {
    component.nodeId = 'someNodeId';
    component.activeTab = 0;

    node.entry.isFolder = true;
    node.entry.aspectNames = [];

    fixture.detectChanges();
    component.ngOnInit();

    component.setActiveTab('permissions');
    expect(component.activeTab).toBe(2);

    node.entry.isFolder = true;
    node.entry.aspectNames = ['smf:customConfigSmartFolder'];

    fixture.detectChanges();
    component.ngOnInit();

    component.setActiveTab('permissions');
    expect(component.activeTab).not.toBe(2);
  });
});
