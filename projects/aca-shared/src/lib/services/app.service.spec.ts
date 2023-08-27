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

import { AppService } from './app.service';
import { TestBed } from '@angular/core/testing';
import {
  AuthenticationService,
  AppConfigService,
  AlfrescoApiService,
  PageTitleService,
  AlfrescoApiServiceMock,
  TranslationMock,
  TranslationService
} from '@alfresco/adf-core';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import {
  DiscoveryApiService,
  FileUploadErrorEvent,
  GroupService,
  SearchQueryBuilderService,
  SharedLinksApiService,
  UploadService
} from '@alfresco/adf-content-services';
import { ActivatedRoute } from '@angular/router';
import { STORE_INITIAL_APP_DATA } from '../../../store/src/states/app.state';
import { provideMockStore } from '@ngrx/store/testing';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { RepositoryInfo, VersionInfo } from '@alfresco/js-api';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngrx/store';
import { SnackbarErrorAction } from '../../../store/src/actions/snackbar.actions';
import { ContentApiService } from './content-api.service';
import { SetRepositoryInfoAction, SetUserProfileAction } from '../../../store/src/actions/app.actions';

describe('AppService', () => {
  let service: AppService;
  let auth: AuthenticationService;
  let appConfig: AppConfigService;
  let searchQueryBuilderService: SearchQueryBuilderService;
  let uploadService: UploadService;
  let store: Store;
  let sharedLinksApiService: SharedLinksApiService;
  let contentApi: ContentApiService;
  let groupService: GroupService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule, HttpClientModule, TranslateModule.forRoot(), RouterTestingModule.withRoutes([]), MatDialogModule],
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
        { provide: TranslationService, useClass: TranslationMock }
      ]
    });

    appConfig = TestBed.inject(AppConfigService);
    auth = TestBed.inject(AuthenticationService);
    searchQueryBuilderService = TestBed.inject(SearchQueryBuilderService);
    uploadService = TestBed.inject(UploadService);
    store = TestBed.inject(Store);
    sharedLinksApiService = TestBed.inject(SharedLinksApiService);
    contentApi = TestBed.inject(ContentApiService);
    groupService = TestBed.inject(GroupService);
    service = TestBed.inject(AppService);
  });

  it('should be ready if [withCredentials] mode is used', (done) => {
    appConfig.config = {
      auth: {
        withCredentials: true
      }
    };

    const instance = TestBed.inject(AppService);
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

  it('should reset search to defaults upon logout', async () => {
    const resetToDefaults = spyOn(searchQueryBuilderService, 'resetToDefaults');
    auth.onLogout.next(true);

    await expect(resetToDefaults).toHaveBeenCalled();
  });

  it('should rase notification on share link error', () => {
    spyOn(store, 'select').and.returnValue(of(''));
    service.init();
    const dispatch = spyOn(store, 'dispatch');

    sharedLinksApiService.error.next({ message: 'Error Message', statusCode: 1 });
    expect(dispatch).toHaveBeenCalledWith(new SnackbarErrorAction('Error Message'));
  });

  it('should raise notification on upload error', async () => {
    spyOn(store, 'select').and.returnValue(of(''));
    service.init();
    const dispatch = spyOn(store, 'dispatch');

    uploadService.fileUploadError.next(new FileUploadErrorEvent(null, { status: 403 }));
    expect(dispatch).toHaveBeenCalledWith(new SnackbarErrorAction('APP.MESSAGES.UPLOAD.ERROR.403'));
    dispatch.calls.reset();

    uploadService.fileUploadError.next(new FileUploadErrorEvent(null, { status: 404 }));
    expect(dispatch).toHaveBeenCalledWith(new SnackbarErrorAction('APP.MESSAGES.UPLOAD.ERROR.404'));
    dispatch.calls.reset();

    uploadService.fileUploadError.next(new FileUploadErrorEvent(null, { status: 409 }));
    expect(dispatch).toHaveBeenCalledWith(new SnackbarErrorAction('APP.MESSAGES.UPLOAD.ERROR.CONFLICT'));
    dispatch.calls.reset();

    uploadService.fileUploadError.next(new FileUploadErrorEvent(null, { status: 500 }));
    expect(dispatch).toHaveBeenCalledWith(new SnackbarErrorAction('APP.MESSAGES.UPLOAD.ERROR.500'));
    dispatch.calls.reset();

    uploadService.fileUploadError.next(new FileUploadErrorEvent(null, { status: 504 }));
    expect(dispatch).toHaveBeenCalledWith(new SnackbarErrorAction('APP.MESSAGES.UPLOAD.ERROR.504'));
    dispatch.calls.reset();

    uploadService.fileUploadError.next(new FileUploadErrorEvent(null, { status: 403 }));
    expect(dispatch).toHaveBeenCalledWith(new SnackbarErrorAction('APP.MESSAGES.UPLOAD.ERROR.403'));
    dispatch.calls.reset();

    uploadService.fileUploadError.next(new FileUploadErrorEvent(null, {}));
    expect(dispatch).toHaveBeenCalledWith(new SnackbarErrorAction('APP.MESSAGES.UPLOAD.ERROR.GENERIC'));
  });

  it('should load custom css', () => {
    const appendChild = spyOn(document.head, 'appendChild');
    spyOn(store, 'select').and.returnValue(of('/custom.css'));
    service.init();

    const cssLinkElement = document.createElement('link');
    cssLinkElement.setAttribute('rel', 'stylesheet');
    cssLinkElement.setAttribute('type', 'text/css');
    cssLinkElement.setAttribute('href', '/custom.css');

    expect(appendChild).toHaveBeenCalledWith(cssLinkElement);
  });

  it('should load repository status on login', () => {
    const repository: any = {};
    spyOn(contentApi, 'getRepositoryInformation').and.returnValue(of({ entry: { repository } }));
    spyOn(store, 'select').and.returnValue(of(''));
    service.init();

    const dispatch = spyOn(store, 'dispatch');
    auth.onLogin.next(true);

    expect(dispatch).toHaveBeenCalledWith(new SetRepositoryInfoAction(repository));
  });

  it('should load user profile on login', async () => {
    const person: any = { id: 'person' };

    const group: any = { entry: {} };
    const groups: any[] = [group];

    spyOn(contentApi, 'getRepositoryInformation').and.returnValue(of({} as any));
    spyOn(groupService, 'listAllGroupMembershipsForPerson').and.returnValue(Promise.resolve(groups));
    spyOn(contentApi, 'getPerson').and.returnValue(of({ entry: person }));

    spyOn(store, 'select').and.returnValue(of(''));
    service.init();

    const dispatch = spyOn(store, 'dispatch');
    auth.onLogin.next(true);

    await expect(groupService.listAllGroupMembershipsForPerson).toHaveBeenCalled();
    await expect(dispatch).toHaveBeenCalledWith(new SetUserProfileAction({ person, groups: [group.entry] }));
  });
});
