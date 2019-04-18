/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2019 Alfresco Software Limited
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
import { AppTestingModule } from '../testing/app-testing.module';
import { AuthenticationService, AppConfigService } from '@alfresco/adf-core';
import { AppRouteReuseStrategy } from '@alfresco/aca-shared';
import { Subject } from 'rxjs';

describe('AppService', () => {
  let service: AppService;
  let auth: AuthenticationService;
  let routeReuse: AppRouteReuseStrategy;
  let appConfig: AppConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule],
      providers: [
        AppRouteReuseStrategy,
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

    routeReuse = TestBed.get(AppRouteReuseStrategy);
    auth = TestBed.get(AuthenticationService);
    appConfig = TestBed.get(AppConfigService);
    spyOn(routeReuse, 'resetCache').and.stub();

    service = new AppService(auth, appConfig, routeReuse);
  });

  it('should be ready if [withCredentials] mode is used', done => {
    appConfig.config = {
      auth: {
        withCredentials: true
      }
    };

    const instance = new AppService(auth, appConfig, routeReuse);
    expect(instance.withCredentials).toBeTruthy();

    instance.ready$.subscribe(() => {
      done();
    });
  });

  it('should reset route cache on login', async () => {
    auth.onLogin.next();
    await expect(routeReuse.resetCache).toHaveBeenCalled();
  });

  it('should reset route cache on logout', async () => {
    auth.onLogout.next();
    await expect(routeReuse.resetCache).toHaveBeenCalled();
  });

  it('should be ready after login', async () => {
    let isReady = false;
    service.ready$.subscribe(value => {
      isReady = value;
    });
    auth.onLogin.next();
    await expect(<any>isReady).toEqual(true);
  });
});
