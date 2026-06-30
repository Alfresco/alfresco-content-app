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

import { TestBed } from '@angular/core/testing';
import { SearchNavigationService } from './search-navigation.service';
import { Router } from '@angular/router';
import { AppTestingModule } from '../../testing/app-testing.module';
import { Buffer } from 'buffer';

describe('SearchNavigationService', () => {
  let service: SearchNavigationService;
  let router: Router;

  const encodeQuery = (query: any): string => Buffer.from(JSON.stringify(query)).toString('base64');

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule]
    });
    service = TestBed.inject(SearchNavigationService);
    router = TestBed.inject(Router);
  });

  it('should not navigate to saved route when exitSearch function is called if saved route is null', () => {
    const routerNavigate = spyOn(router, 'navigate');
    service.saveRoute('');
    service.navigateBack();

    expect(routerNavigate).not.toHaveBeenCalledWith([service.previousRoute]);
  });

  it('should navigate to saved route when exitSearch function is called', () => {
    const routerNavigate = spyOn(router, 'navigate');
    service.saveRoute('/personal-files');
    service.navigateBack();

    expect(routerNavigate).toHaveBeenCalledWith([service.previousRoute]);
  });

  it('should navigate to Search when navigateToSearch function is called', () => {
    const routerNavigate = spyOn(router, 'navigate');
    service.navigateToSearch();

    expect(routerNavigate).toHaveBeenCalledWith(['/search']);
  });

  it('should navigate back to the previous route when call the navigateBack function', () => {
    const routerNavigate = spyOn(router, 'navigate');
    service.saveRoute('');
    service.navigateBack();

    expect(routerNavigate).toHaveBeenCalledWith(['/personal-files']);
  });

  describe('getUrlSearchTerm', () => {
    it('should return empty string when not on a search results route', () => {
      spyOnProperty(router, 'url', 'get').and.returnValue('/personal-files');
      expect(service.getUrlSearchTerm()).toBe('');
    });

    it('should return the raw user query extracted from the encoded q parameter', () => {
      const encodedQuery = encodeQuery({ userQuery: 'my term' });
      spyOnProperty(router, 'url', 'get').and.returnValue(`/search;q=${encodedQuery}`);
      expect(service.getUrlSearchTerm()).toBe('my term');
    });
  });

  describe('isSameSearchTerm', () => {
    it('should return true when the provided term matches the url search term', () => {
      const encodedQuery = encodeQuery({ userQuery: 'my term' });
      spyOnProperty(router, 'url', 'get').and.returnValue(`/search;q=${encodedQuery}`);
      expect(service.isSameSearchTerm('my term')).toBeTrue();
    });

    it('should return false when the provided term differs from the url search term', () => {
      const encodedQuery = encodeQuery({ userQuery: 'my term' });
      spyOnProperty(router, 'url', 'get').and.returnValue(`/search;q=${encodedQuery}`);
      expect(service.isSameSearchTerm('other term')).toBeFalse();
    });
  });
});
