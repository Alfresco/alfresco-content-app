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
var _this = this;
import * as tslib_1 from 'tslib';
import { AppService } from './app.service';
import { TestBed } from '@angular/core/testing';
import { AuthenticationService, AppConfigService } from '@alfresco/adf-core';
import { Subject } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { AppRouteReuseStrategy } from '../routing/app.routes.strategy';
describe('AppService', function() {
  var service;
  var auth;
  var routeReuse;
  var appConfig;
  beforeEach(function() {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [
        AppRouteReuseStrategy,
        {
          provide: AuthenticationService,
          useValue: {
            onLogin: new Subject(),
            onLogout: new Subject(),
            isLoggedIn: function() {
              return false;
            }
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
  it('should be ready if [withCredentials] mode is used', function(done) {
    appConfig.config = {
      auth: {
        withCredentials: true
      }
    };
    var instance = new AppService(auth, appConfig, routeReuse);
    expect(instance.withCredentials).toBeTruthy();
    instance.ready$.subscribe(function() {
      done();
    });
  });
  it('should reset route cache on login', function() {
    return tslib_1.__awaiter(_this, void 0, void 0, function() {
      return tslib_1.__generator(this, function(_a) {
        switch (_a.label) {
          case 0:
            auth.onLogin.next();
            return [
              4 /*yield*/,
              expect(routeReuse.resetCache).toHaveBeenCalled()
            ];
          case 1:
            _a.sent();
            return [2 /*return*/];
        }
      });
    });
  });
  it('should reset route cache on logout', function() {
    return tslib_1.__awaiter(_this, void 0, void 0, function() {
      return tslib_1.__generator(this, function(_a) {
        switch (_a.label) {
          case 0:
            auth.onLogout.next();
            return [
              4 /*yield*/,
              expect(routeReuse.resetCache).toHaveBeenCalled()
            ];
          case 1:
            _a.sent();
            return [2 /*return*/];
        }
      });
    });
  });
  it('should be ready after login', function() {
    return tslib_1.__awaiter(_this, void 0, void 0, function() {
      var isReady;
      return tslib_1.__generator(this, function(_a) {
        switch (_a.label) {
          case 0:
            isReady = false;
            service.ready$.subscribe(function(value) {
              isReady = value;
            });
            auth.onLogin.next();
            return [4 /*yield*/, expect(isReady).toEqual(true)];
          case 1:
            _a.sent();
            return [2 /*return*/];
        }
      });
    });
  });
});
//# sourceMappingURL=app.service.spec.js.map
