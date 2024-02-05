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

import { TestBed, ComponentFixture } from '@angular/core/testing';
import {
  UserPreferencesService,
  AlfrescoApiService,
  AlfrescoApiServiceMock,
  AuthenticationService,
  TranslationMock,
  TranslationService,
  PipeModule
} from '@alfresco/adf-core';
import { DiscoveryApiService, NodesApiService } from '@alfresco/adf-content-services';
import { AppState, RefreshPreviewAction } from '@alfresco/aca-shared/store';
import { AcaViewerComponent } from './viewer.component';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { ContentApiService, DocumentBasePageService } from '@alfresco/aca-shared';
import { Store, StoreModule } from '@ngrx/store';
import { NodePaging, RepositoryInfo, VersionInfo, Node } from '@alfresco/js-api';
import { AcaViewerModule } from '../../viewer.module';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { EffectsModule } from '@ngrx/effects';

class DocumentBasePageServiceMock extends DocumentBasePageService {
  canUpdateNode(): boolean {
    return true;
  }
  canUploadContent(): boolean {
    return true;
  }
}

export const INITIAL_APP_STATE: AppState = {
  appName: 'Alfresco Content Application',
  logoPath: 'assets/images/alfresco-logo-white.svg',
  customCssPath: '',
  webFontPath: '',
  sharedUrl: '',
  user: {
    isAdmin: null,
    id: null,
    firstName: '',
    lastName: ''
  },
  selection: {
    nodes: [],
    libraries: [],
    isEmpty: true,
    count: 0
  },
  navigation: {
    currentFolder: null
  },
  currentNodeVersion: null,
  infoDrawerOpened: false,
  infoDrawerPreview: false,
  infoDrawerMetadataAspect: '',
  showFacetFilter: true,
  fileUploadingDialog: true,
  showLoader: false,
  repository: {
    status: {
      isQuickShareEnabled: true
    }
  } as any
};

describe('ViewerComponent', () => {
  let fixture: ComponentFixture<AcaViewerComponent>;
  let component: AcaViewerComponent;
  let preferences: UserPreferencesService;
  let contentApi: ContentApiService;
  let nodesApiService: NodesApiService;
  let store: Store<any>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        AcaViewerModule,
        NoopAnimationsModule,
        HttpClientModule,
        RouterTestingModule,
        TranslateModule.forRoot(),
        StoreModule.forRoot(
          { app: (state) => state },
          {
            initialState: {
              app: INITIAL_APP_STATE
            },
            runtimeChecks: {
              strictStateImmutability: false,
              strictActionImmutability: false
            }
          }
        ),
        EffectsModule.forRoot([]),
        PipeModule
      ],
      providers: [
        { provide: AlfrescoApiService, useClass: AlfrescoApiServiceMock },
        { provide: TranslationService, useClass: TranslationMock },
        { provide: DocumentBasePageService, useVale: new DocumentBasePageServiceMock() },
        {
          provide: DiscoveryApiService,
          useValue: {
            ecmProductInfo$: new BehaviorSubject<RepositoryInfo | null>(null),
            getEcmProductInfo: (): Observable<RepositoryInfo> =>
              of(
                new RepositoryInfo({
                  version: {
                    major: '10.0.0'
                  } as VersionInfo
                })
              )
          }
        },
        {
          provide: AuthenticationService,
          useValue: {
            isEcmLoggedIn: (): boolean => true,
            getRedirect: (): string | null => null,
            setRedirect() {},
            isOauth: (): boolean => false,
            isOAuthWithoutSilentLogin: (): boolean => false
          }
        }
      ]
    });

    fixture = TestBed.createComponent(AcaViewerComponent);
    component = fixture.componentInstance;

    preferences = TestBed.inject(UserPreferencesService);
    contentApi = TestBed.inject(ContentApiService);
    nodesApiService = TestBed.inject(NodesApiService);
    store = TestBed.inject(Store);
  });

  it('should fetch and sort file ids for personal-files', async () => {
    spyOn(preferences, 'get').and.returnValues('name', 'desc', 'client');

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
    spyOn(preferences, 'get').and.returnValues('missing', 'desc', 'client');

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

  it('should not sort personal files when server-side sorting is set', async () => {
    spyOn(preferences, 'get').and.returnValues('name', 'desc', 'server');

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
    expect(ids).toEqual(['node1', 'node2']);
  });

  it('should call node update after RefreshPreviewAction is triggered', () => {
    spyOn(nodesApiService.nodeUpdated, 'next');
    component.ngOnInit();
    const node = new Node();

    store.dispatch(new RefreshPreviewAction(node));
    expect(nodesApiService.nodeUpdated.next).toHaveBeenCalledWith(node);
  });
});
