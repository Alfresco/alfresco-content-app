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
import { STORE_INITIAL_APP_DATA, SetSelectedNodesAction } from '@alfresco/aca-shared/store';
import { MinimalNodeEntryEntity, NodeEntry } from '@alfresco/js-api';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthenticationService, PageTitleService } from '@alfresco/adf-core';
import { NodeAspectService, SearchQueryBuilderService } from '@alfresco/adf-content-services';

describe('DetailsComponent', () => {
  let component: DetailsComponent;
  let fixture: ComponentFixture<DetailsComponent>;
  let contentApiService: ContentApiService;
  let store: Store;
  let node: NodeEntry;
  let nodeAspectService: NodeAspectService;

  const mockStream = new Subject();
  const storeMock = {
    dispatch: jasmine.createSpy('dispatch'),
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
      sizeInBytes: 14530,
      encoding: 'UTF-8'
    },
    parentId: 'd124de26-6ba0-4f40-8d98-4907da2d337a',
    createdAt: new Date('2017-05-24T15:08:55.640Z'),
    path: {
      name: '/Company Home/Guest Home',
      isComplete: true,
      elements: [
        {
          id: '94acfc73-7014-4475-9bd9-93a2162f0f8c',
          name: 'Company Home'
        },
        { id: 'd124de26-6ba0-4f40-8d98-4907da2d337a', name: 'Guest Home' }
      ]
    },
    isFolder: true,
    modifiedByUser: { id: 'admin', displayName: 'Administrator' },
    name: 'b_txt_file.rtf',
    id: '70e1cc6a-6918-468a-b84a-1048093b06fd',
    properties: { 'cm:versionLabel': '1.0', 'cm:versionType': 'MAJOR' },
    allowableOperations: ['delete', 'update']
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
    nodeAspectService = TestBed.inject(NodeAspectService);
    component.node = { id: 'test-id' } as MinimalNodeEntryEntity;
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
    spyOn(nodeAspectService, 'updateNodeAspects').and.callThrough();
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
    spyOn(component['nodeActionsService'], 'getNodeIcon').and.returnValue(expectedIcon);
    fixture.detectChanges();
    const result = component.getNodeIcon(mockNode);
    expect(result).toContain(expectedIcon);
  });
});
