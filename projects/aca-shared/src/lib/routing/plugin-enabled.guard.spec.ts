/*!
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { AppConfigService } from '@alfresco/adf-core';
import { TestBed } from '@angular/core/testing';
import { PluginEnabledGuard } from './plugin-enabled.guard';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('PluginEnabledGuard', () => {
  let getSpy: jasmine.Spy<(key: string, defaultValue?: boolean) => boolean>;
  let route: ActivatedRouteSnapshot;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
    });
    getSpy = spyOn(TestBed.inject(AppConfigService), 'get');
    route = new ActivatedRouteSnapshot();
    route.data = {
      plugin: 'some plugin'
    };
  });

  it('should call appConfigService.get with correct parameters', () => {
    TestBed.runInInjectionContext(() => PluginEnabledGuard(route, {} as RouterStateSnapshot));
    expect(getSpy).toHaveBeenCalledWith(route.data.plugin, true);
  });

  it('should return true if appConfigService.get returns true', () => {
    getSpy.and.returnValue(true);
    const result = TestBed.runInInjectionContext(() => PluginEnabledGuard(route, {} as RouterStateSnapshot));

    expect(result).toBeTrue();
  });

  it('should return false if appConfigService.get returns false', () => {
    getSpy.and.returnValue(false);
    const result = TestBed.runInInjectionContext(() => PluginEnabledGuard(route, {} as RouterStateSnapshot));

    expect(result).toBeFalse();
  });

  it('should navigate to root if plugin is not enabled', () => {
    getSpy.and.returnValue(false);
    const routerSpy = spyOn(TestBed.inject(Router), 'navigate');

    TestBed.runInInjectionContext(() => PluginEnabledGuard(route, {} as RouterStateSnapshot));

    expect(routerSpy).toHaveBeenCalledWith(['/']);
  });
});
