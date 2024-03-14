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

import { Router, ActivatedRoute } from '@angular/router';
import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import {
  AlfrescoApiService,
  AlfrescoApiServiceMock,
  AuthenticationService,
  TranslationMock,
  TranslationService,
  PipeModule
} from '@alfresco/adf-core';
import { UploadService, NodesApiService, DiscoveryApiService } from '@alfresco/adf-content-services';
import { AppState, ClosePreviewAction, ReloadDocumentListAction, ViewNodeAction } from '@alfresco/aca-shared/store';
import { AcaViewerComponent } from './viewer.component';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { ContentApiService, AppHookService, DocumentBasePageService } from '@alfresco/aca-shared';
import { Store, StoreModule } from '@ngrx/store';
import { RepositoryInfo, VersionInfo } from '@alfresco/js-api';
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
  let store: Store<any>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        AcaViewerModule,
        NoopAnimationsModule,
        HttpClientModule,
        RouterTestingModule.withRoutes([]),
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

    router = TestBed.inject(Router);
    route = TestBed.inject(ActivatedRoute);
    contentApi = TestBed.inject(ContentApiService);
    uploadService = TestBed.inject(UploadService);
    nodesApiService = TestBed.inject(NodesApiService);
    appHookService = TestBed.inject(AppHookService);
    store = TestBed.inject(Store);
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

  it('should not display node when id is missing', async () => {
    spyOn(router, 'navigate').and.stub();
    spyOn(contentApi, 'getNodeInfo').and.returnValue(of(null));

    await component.displayNode(null);

    expect(contentApi.getNodeInfo).not.toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
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

  it('should reload document list and navigate to correct location upon close', async () => {
    spyOn(store, 'dispatch');
    spyOn<any>(component, 'navigateToFileLocation').and.callThrough();
    spyOn<any>(component, 'getFileLocation').and.returnValue(fakeLocation);
    spyOn(router, 'navigateByUrl').and.returnValue(Promise.resolve(true));

    component.onViewerVisibilityChanged();

    expect(store.dispatch).toHaveBeenCalledWith(new ReloadDocumentListAction());
    expect(component['navigateToFileLocation']).toHaveBeenCalled();
    expect(router.navigateByUrl).toHaveBeenCalledWith(fakeLocation);
  });

  it('should navigate to original location in case of Alfresco API errors', async () => {
    component['previewLocation'] = 'personal-files';
    spyOn(contentApi, 'getNodeInfo').and.returnValue(throwError('error'));
    spyOn(JSON, 'parse').and.returnValue({ error: { statusCode: '123' } });
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

  it('should call node update after RefreshPreviewAction is triggered', () => {
    spyOn(nodesApiService.nodeUpdated, 'next');
    component.ngOnInit();
    const node = new Node();

    store.dispatch(new RefreshPreviewAction(node));
    expect(nodesApiService.nodeUpdated.next).toHaveBeenCalledWith(node);
  });
});
