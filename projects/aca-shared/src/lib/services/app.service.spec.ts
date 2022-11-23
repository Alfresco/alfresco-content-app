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

import { AppService } from './app.service';
import { TestBed } from '@angular/core/testing';
import {
  AuthenticationService,
  AppConfigService,
  AlfrescoApiService,
  PageTitleService,
  UserPreferencesService,
  UploadService,
  SharedLinksApiService,
  AlfrescoApiServiceMock,
  TranslationMock,
  TranslationService,
  DiscoveryApiService
} from '@alfresco/adf-core';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { GroupService, SearchQueryBuilderService } from '@alfresco/adf-content-services';
import { ActivatedRoute, Router } from '@angular/router';
import { ContentApiService } from './content-api.service';
import { RouterExtensionService } from './router.extension.service';
import { OverlayContainer } from '@angular/cdk/overlay';
import { AppStore, STORE_INITIAL_APP_DATA } from '../../../store/src/states/app.state';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { CommonModule } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { TranslateServiceMock } from '../testing/translation.service';
import { RouterTestingModule } from '@angular/router/testing';
import { RepositoryInfo } from '@alfresco/js-api';

describe('AppService', () => {
  let service: AppService;
  let auth: AuthenticationService;
  let appConfig: AppConfigService;
  let searchQueryBuilderService: SearchQueryBuilderService;
  let userPreferencesService: UserPreferencesService;
  let router: Router;
  let activatedRoute: ActivatedRoute;
  let routerExtensionService: RouterExtensionService;
  let pageTitleService: PageTitleService;
  let uploadService: UploadService;
  let contentApiService: ContentApiService;
  let sharedLinksApiService: SharedLinksApiService;
  let overlayContainer: OverlayContainer;
  let alfrescoApiService: AlfrescoApiService;
  let groupService: GroupService;
  let storeInitialAppData: any;
  let store: MockStore<AppStore>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, RouterTestingModule.withRoutes([])],
      providers: [
        CommonModule,
        SearchQueryBuilderService,
        UserPreferencesService,
        RouterExtensionService,
        UploadService,
        ContentApiService,
        SharedLinksApiService,
        OverlayContainer,
        provideMockStore({}),
        {
          provide: PageTitleService,
          useValue: {}
        },
        {
          provide: DiscoveryApiService,
          useValue: {
            ecmProductInfo$: new BehaviorSubject<RepositoryInfo>(null),
            getEcmProductInfo: (): Observable<RepositoryInfo> => of(new RepositoryInfo({ version: '10.0.0' }))
          }
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {}
          }
        },
        {
          provide: STORE_INITIAL_APP_DATA,
          useValue: {}
        },
        {
          provide: AlfrescoApiService,
          useClass: AlfrescoApiServiceMock
        },
        {
          provide: AuthenticationService,
          useValue: {
            onLogin: new Subject<any>(),
            onLogout: new Subject<any>(),
            isLoggedIn: () => false
          }
        },
        { provide: TranslationService, useClass: TranslationMock },
        { provide: TranslateService, useClass: TranslateServiceMock }
      ]
    });

    appConfig = TestBed.inject(AppConfigService);
    searchQueryBuilderService = TestBed.inject(SearchQueryBuilderService);
    userPreferencesService = TestBed.inject(UserPreferencesService);
    router = TestBed.inject(Router);
    activatedRoute = TestBed.inject(ActivatedRoute);
    routerExtensionService = TestBed.inject(RouterExtensionService);
    pageTitleService = TestBed.inject(PageTitleService);
    uploadService = TestBed.inject(UploadService);
    contentApiService = TestBed.inject(ContentApiService);
    sharedLinksApiService = TestBed.inject(SharedLinksApiService);
    overlayContainer = TestBed.inject(OverlayContainer);
    alfrescoApiService = TestBed.inject(AlfrescoApiService);
    groupService = TestBed.inject(GroupService);
    storeInitialAppData = TestBed.inject(STORE_INITIAL_APP_DATA);
    store = TestBed.inject(MockStore);
    auth = TestBed.inject(AuthenticationService);

    service = new AppService(
      userPreferencesService,
      auth,
      store,
      router,
      activatedRoute,
      appConfig,
      pageTitleService,
      alfrescoApiService,
      uploadService,
      routerExtensionService,
      contentApiService,
      sharedLinksApiService,
      groupService,
      overlayContainer,
      storeInitialAppData,
      searchQueryBuilderService
    );
  });

  it('should be ready if [withCredentials] mode is used', (done) => {
    appConfig.config = {
      auth: {
        withCredentials: true
      }
    };

    const instance = new AppService(
      userPreferencesService,
      auth,
      store,
      router,
      activatedRoute,
      appConfig,
      pageTitleService,
      alfrescoApiService,
      uploadService,
      routerExtensionService,
      contentApiService,
      sharedLinksApiService,
      groupService,
      overlayContainer,
      storeInitialAppData,
      searchQueryBuilderService
    );

    expect(instance.withCredentials).toBeTruthy();

    instance.ready$.subscribe(() => {
      done();
    });
  });

  it('should be ready after login', async () => {
    let isReady = false;
    service.ready$.subscribe((value) => {
      isReady = value;
    });
    auth.onLogin.next();
    await expect(isReady).toEqual(true);
  });
});
