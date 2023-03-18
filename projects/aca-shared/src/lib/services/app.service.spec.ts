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
  AlfrescoApiServiceMock,
  TranslationMock,
  TranslationService
} from '@alfresco/adf-core';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { DiscoveryApiService, SearchQueryBuilderService } from '@alfresco/adf-content-services';
import { ActivatedRoute } from '@angular/router';
import { STORE_INITIAL_APP_DATA } from '../../../store/src/states/app.state';
import { provideMockStore } from '@ngrx/store/testing';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { RepositoryInfo } from '@alfresco/js-api';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';

describe('AppService', () => {
  let service: AppService;
  let auth: AuthenticationService;
  let appConfig: AppConfigService;

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
        { provide: TranslationService, useClass: TranslationMock }
      ]
    });

    appConfig = TestBed.inject(AppConfigService);
    auth = TestBed.inject(AuthenticationService);
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
});
