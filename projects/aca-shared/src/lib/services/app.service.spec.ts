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
import { AuthenticationService, AppConfigService, AlfrescoApiService, AlfrescoApiServiceMock } from '@alfresco/adf-core';
import { Subject } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { SearchQueryBuilderService } from '@alfresco/adf-content-services';

describe('AppService', () => {
  let service: AppService;
  let auth: AuthenticationService;
  let appConfig: AppConfigService;
  let searchQueryBuilderService: SearchQueryBuilderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [
        { provide: AlfrescoApiService, useClass: AlfrescoApiServiceMock },
        SearchQueryBuilderService,
        {
          provide: AuthenticationService,
          useValue: {
            onLogin: new Subject<any>(),
            onLogout: new Subject<any>(),
            isLoggedIn: () => false
          }
        }
      ]
    });

    auth = TestBed.inject(AuthenticationService);
    appConfig = TestBed.inject(AppConfigService);
    searchQueryBuilderService = TestBed.inject(SearchQueryBuilderService);

    service = new AppService(auth, appConfig, searchQueryBuilderService);
  });

  it('should be ready if [withCredentials] mode is used', (done) => {
    appConfig.config = {
      auth: {
        withCredentials: true
      }
    };

    const instance = new AppService(auth, appConfig, searchQueryBuilderService);
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
