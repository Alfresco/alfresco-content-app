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

import { AppConfigService } from '@alfresco/adf-core';
import { TestBed } from '@angular/core/testing';
import { PluginEnabledGuard } from './plugin-enabled.guard';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('PluginEnabledGuard', () => {
  let service: PluginEnabledGuard;
  let getSpy: jasmine.Spy<(key: string, defaultValue?: boolean) => boolean>;
  let route: ActivatedRouteSnapshot;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(PluginEnabledGuard);
    getSpy = spyOn(TestBed.inject(AppConfigService), 'get');
    route = new ActivatedRouteSnapshot();
    route.data = {
      plugin: 'some plugin'
    };
  });

  describe('canActivate', () => {
    it('should call appConfigService.get with correct parameters', () => {
      service.canActivate(route);
      expect(getSpy).toHaveBeenCalledWith(route.data.plugin, true);
    });

    it('should return true if appConfigService.get returns true', () => {
      getSpy.and.returnValue(true);

      expect(service.canActivate(route)).toBeTrue();
    });

    it('should return false if appConfigService.get returns false', () => {
      getSpy.and.returnValue(true);

      expect(service.canActivate(route)).toBeTrue();
    });

    it('should navigate to root if plugin is not enabled', () => {
      getSpy.and.returnValue(false);
      const routerSpy = spyOn(TestBed.inject(Router), 'navigate');

      service.canActivate(route);

      expect(routerSpy).toHaveBeenCalledWith(['/']);
    });
  });

  describe('canActivateChild', () => {
    it('should call canActivate with the same route and return its result', () => {
      spyOn(service, 'canActivate').and.callThrough();
      const result = service.canActivateChild(route);

      expect(service.canActivate).toHaveBeenCalledWith(route);
      expect(result).toBe(service.canActivate(route));
    });
  });
});
