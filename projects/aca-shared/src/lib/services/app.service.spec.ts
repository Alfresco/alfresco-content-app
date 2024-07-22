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

import { AppService } from './app.service';
import { TestBed } from '@angular/core/testing';
import {
  AuthenticationService,
  AlfrescoApiService,
  PageTitleService,
  AlfrescoApiServiceMock,
  TranslationMock,
  TranslationService,
  UserPreferencesService,
  NotificationService
} from '@alfresco/adf-core';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import {
  DiscoveryApiService,
  FileUploadErrorEvent,
  SearchQueryBuilderService,
  SharedLinksApiService,
  UploadService
} from '@alfresco/adf-content-services';
import { ActivatedRoute } from '@angular/router';
import { provideMockStore } from '@ngrx/store/testing';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { RepositoryInfo, VersionInfo } from '@alfresco/js-api';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngrx/store';
import { ContentApiService } from './content-api.service';
import { AppSettingsService, UserProfileService } from '@alfresco/aca-shared';
import { MatSnackBarModule } from '@angular/material/snack-bar';

describe('AppService', () => {
  let service: AppService;
  let auth: AuthenticationService;
  let searchQueryBuilderService: SearchQueryBuilderService;
  let uploadService: UploadService;
  let store: Store;
  let sharedLinksApiService: SharedLinksApiService;
  let contentApi: ContentApiService;
  let preferencesService: UserPreferencesService;
  let appSettingsService: AppSettingsService;
  let userProfileService: UserProfileService;
  let notificationService: NotificationService;
  let loadUserProfileSpy: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule, HttpClientModule, TranslateModule.forRoot(), RouterTestingModule.withRoutes([]), MatDialogModule, MatSnackBarModule],
      providers: [
        SearchQueryBuilderService,
        provideMockStore({}),
        {
          provide: PageTitleService,
          useValue: {}
        },
        {
          provide: DiscoveryApiService,
          useValue: {
            ecmProductInfo$: new BehaviorSubject<RepositoryInfo>(null),
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
          provide: ActivatedRoute,
          useValue: {
            snapshot: {}
          }
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
            isLoggedIn: () => false,
            getUsername: () => null
          }
        },
        { provide: TranslationService, useClass: TranslationMock },
        { provide: UserPreferencesService, useValue: { setStoragePrefix: () => null } }
      ]
    });

    appSettingsService = TestBed.inject(AppSettingsService);
    auth = TestBed.inject(AuthenticationService);
    searchQueryBuilderService = TestBed.inject(SearchQueryBuilderService);
    uploadService = TestBed.inject(UploadService);
    store = TestBed.inject(Store);
    sharedLinksApiService = TestBed.inject(SharedLinksApiService);
    contentApi = TestBed.inject(ContentApiService);
    spyOn(contentApi, 'getRepositoryInformation').and.returnValue(of({} as any));
    service = TestBed.inject(AppService);
    preferencesService = TestBed.inject(UserPreferencesService);
    userProfileService = TestBed.inject(UserProfileService);
    loadUserProfileSpy = spyOn(userProfileService, 'loadUserProfile').and.returnValue(Promise.resolve({} as any));
    notificationService = TestBed.inject(NotificationService);
  });

  it('should be ready after login', async () => {
    let isReady = false;
    service.ready$.subscribe((value) => {
      isReady = value;
    });
    auth.onLogin.next();
    await expect(isReady).toEqual(true);
  });

  it('should set local storage prefix after login', () => {
    spyOn(preferencesService, 'setStoragePrefix');
    spyOn(auth, 'getUsername').and.returnValue('test-username');
    auth.onLogin.next();

    expect(preferencesService.setStoragePrefix).toHaveBeenCalledWith('test-username');
  });

  it('should reset search to defaults upon logout', async () => {
    const resetToDefaults = spyOn(searchQueryBuilderService, 'resetToDefaults');
    auth.onLogout.next(true);

    await expect(resetToDefaults).toHaveBeenCalled();
  });

  it('should raise notification on share link error', () => {
    const showError = spyOn(notificationService, 'showError').and.stub();
    spyOn(store, 'select').and.returnValue(of(''));
    service.init();

    sharedLinksApiService.error.next({ message: 'Error Message', statusCode: 1 });
    expect(showError).toHaveBeenCalledWith('Error Message');
  });

  it('should raise notification on upload error', async () => {
    spyOn(store, 'select').and.returnValue(of(''));
    service.init();

    const showError = spyOn(notificationService, 'showError').and.stub();

    uploadService.fileUploadError.next(new FileUploadErrorEvent(null, { status: 403 }));
    expect(showError).toHaveBeenCalledWith('APP.MESSAGES.UPLOAD.ERROR.403');
    showError.calls.reset();

    uploadService.fileUploadError.next(new FileUploadErrorEvent(null, { status: 404 }));
    expect(showError).toHaveBeenCalledWith('APP.MESSAGES.UPLOAD.ERROR.404');
    showError.calls.reset();

    uploadService.fileUploadError.next(new FileUploadErrorEvent(null, { status: 409 }));
    expect(showError).toHaveBeenCalledWith('APP.MESSAGES.UPLOAD.ERROR.CONFLICT');
    showError.calls.reset();

    uploadService.fileUploadError.next(new FileUploadErrorEvent(null, { status: 500 }));
    expect(showError).toHaveBeenCalledWith('APP.MESSAGES.UPLOAD.ERROR.500');
    showError.calls.reset();

    uploadService.fileUploadError.next(new FileUploadErrorEvent(null, { status: 504 }));
    expect(showError).toHaveBeenCalledWith('APP.MESSAGES.UPLOAD.ERROR.504');
    showError.calls.reset();

    uploadService.fileUploadError.next(new FileUploadErrorEvent(null, { status: 403 }));
    expect(showError).toHaveBeenCalledWith('APP.MESSAGES.UPLOAD.ERROR.403');
    showError.calls.reset();

    uploadService.fileUploadError.next(new FileUploadErrorEvent(null, {}));
    expect(showError).toHaveBeenCalledWith('APP.MESSAGES.UPLOAD.ERROR.GENERIC');
  });

  it('should load custom css', () => {
    const appendChild = spyOn(document.head, 'appendChild');
    spyOnProperty(appSettingsService, 'customCssPath').and.returnValue('/custom.css');
    service.init();

    const cssLinkElement = document.createElement('link');
    cssLinkElement.setAttribute('rel', 'stylesheet');
    cssLinkElement.setAttribute('type', 'text/css');
    cssLinkElement.setAttribute('href', '/custom.css');

    expect(appendChild).toHaveBeenCalledWith(cssLinkElement);
  });

  it('should load repository status on login', () => {
    service.init();
    auth.onLogin.next(true);
    expect(contentApi.getRepositoryInformation).toHaveBeenCalled();
  });

  it('should load user profile on login', async () => {
    const person: any = { id: 'person' };

    loadUserProfileSpy.and.returnValue(Promise.resolve(person));
    spyOn(store, 'select').and.returnValue(of(''));
    service.init();
    auth.onLogin.next(true);

    expect(loadUserProfileSpy).toHaveBeenCalled();
  });
});
