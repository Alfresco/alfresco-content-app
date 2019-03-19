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

import { AppAuthGuard } from './auth.guard';
import { TestBed } from '@angular/core/testing';
import { AppTestingModule } from '../testing/app-testing.module';
import { AuthenticationService, AppConfigService } from '@alfresco/adf-core';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

describe('AppAuthGuard', () => {
  let auth: AuthenticationService;
  let guard: AppAuthGuard;
  let router: Router;
  let config: AppConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule, RouterTestingModule],
      providers: [AppAuthGuard]
    });

    auth = TestBed.get(AuthenticationService);
    guard = TestBed.get(AppAuthGuard);
    router = TestBed.get(Router);
    config = TestBed.get(AppConfigService);

    spyOn(router, 'navigateByUrl').and.stub();
  });

  it('should fall through when withCredentials enabled', () => {
    spyOn(auth, 'isEcmLoggedIn').and.returnValue(false);

    config.config = {
      auth: {
        withCredentials: false
      }
    };

    expect(guard.checkLogin(null)).toBe(false);

    config.config = {
      auth: {
        withCredentials: true
      }
    };

    expect(guard.checkLogin(null)).toBe(true);
  });

  it('should evaluate to [true] if logged in already', () => {
    spyOn(auth, 'isEcmLoggedIn').and.returnValue(true);

    expect(guard.checkLogin(null)).toBe(true);
  });

  it('should navigate to login with the redirect url', () => {
    spyOn(auth, 'isEcmLoggedIn').and.returnValue(false);
    expect(guard.checkLogin('test/url')).toBe(false);
    expect(router.navigateByUrl).toHaveBeenCalledWith(
      '/login?redirectUrl=test/url'
    );
  });

  it('should evaluate to [false] with OAuth enabled', () => {
    spyOn(auth, 'isEcmLoggedIn').and.returnValue(false);
    spyOn(auth, 'isOauth').and.returnValue(true);
    spyOn(guard, 'isOAuthWithoutSilentLogin').and.returnValue(false);

    expect(guard.checkLogin(null)).toBe(false);
    expect(router.navigateByUrl).not.toHaveBeenCalled();
  });
});
