/*!
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { STORE_INITIAL_APP_DATA, SetSelectedNodesAction, NavigateToFolder } from '@alfresco/aca-shared/store';
import { NodeEntry, PathElement } from '@alfresco/js-api';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthenticationService, PageTitleService, ThumbnailService } from '@alfresco/adf-core';
import { BreadcrumbComponent, SearchQueryBuilderService } from '@alfresco/adf-content-services';
import { By } from '@angular/platform-browser';

describe('DetailsComponent', () => {
  let component: DetailsComponent;
  let fixture: ComponentFixture<DetailsComponent>;
  let contentApiService: ContentApiService;
  let thumbnailService: ThumbnailService;
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

  const mockAspectActions = [];

  const mockObservable = new BehaviorSubject(mockAspectActions);
  extensionsServiceMock.getAllowedSidebarActions.and.returnValue(mockObservable);

  const mockNode = {
    isFile: false,
    createdByUser: { id: 'admin', displayName: 'Administrator' },
    modifiedAt: new Date('2017-05-24T15:08:55.640Z'),
    nodeType: 'cm:content',
    content: {
      mimeType: 'application/rtf',
      mimeTypeName: 'Rich Text Format',
      sizeInBytes: 14530
    },
    createdAt: new Date('2017-05-24T15:08:55.640Z'),
    isFolder: true,
    modifiedByUser: { id: 'admin', displayName: 'Administrator' },
    name: 'b_txt_file.rtf',
    id: 'test node 1'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule, DetailsComponent],
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
          provide: STORE_INITIAL_APP_DATA,
          useValue: {}
        },
        {
          provide: AuthenticationService,
          useValue: {
            onLogin: new Subject<any>(),
            onLogout: new Subject<any>(),
            isLoggedIn: () => true
          }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });

    fixture = TestBed.createComponent(DetailsComponent);
    component = fixture.componentInstance;
    contentApiService = TestBed.inject(ContentApiService);
    thumbnailService = TestBed.inject(ThumbnailService);
    store = TestBed.inject(Store);

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
    const breadcrumbComponent: BreadcrumbComponent = fixture.debugElement.query(By.directive(BreadcrumbComponent)).componentInstance;
    const pathElement: PathElement = {
      id: 'fake-id'
    };
    breadcrumbComponent.navigate.emit(pathElement);
    fixture.detectChanges();

    expect(store.dispatch).toHaveBeenCalledWith(new NavigateToFolder({ entry: pathElement } as NodeEntry));
  });

  it('should dispatch node selection', () => {
    fixture.detectChanges();
    expect(store.dispatch).toHaveBeenCalledWith(new SetSelectedNodesAction([node]));
  });

  it('should set aspectActions from extensions', () => {
    extensionsServiceMock.getAllowedSidebarActions.and.returnValue(of(mockAspectActions));
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.aspectActions).toEqual(mockAspectActions);
    });
  });

  it('should return the icon when getNodeIcon is called', () => {
    const expectedIcon = 'assets/images/ft_ic_folder';
    spyOn(thumbnailService, 'getNodeIcon').and.returnValue(expectedIcon);
    fixture.detectChanges();
    component.getNodeIcon(mockNode);
    expect(component.getIcon).toContain(expectedIcon);
  });
});
