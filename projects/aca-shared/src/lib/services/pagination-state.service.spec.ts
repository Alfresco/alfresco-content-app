/*!
 * Copyright © 2005-2026 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { Router } from '@angular/router';
import { AuthenticationService } from '@alfresco/adf-core';
import { PaginationStateService } from './pagination-state.service';

describe('PaginationStateService', () => {
  let service: PaginationStateService;
  let username: string;
  const routerMock: { url: string } = { url: '/personal-files' };

  beforeEach(() => {
    sessionStorage.clear();
    username = 'user1';
    routerMock.url = '/personal-files';

    TestBed.configureTestingModule({
      providers: [
        PaginationStateService,
        { provide: AuthenticationService, useValue: { getUsername: () => username } },
        { provide: Router, useValue: routerMock }
      ]
    });

    service = TestBed.inject(PaginationStateService);
  });

  afterEach(() => sessionStorage.clear());

  describe('getUsername', () => {
    it('should namespace the stored state with the authenticated user', () => {
      service.setPaginationState('folder-1', { skipCount: 25, maxItems: 25 });

      username = 'user2';
      expect(service.getPaginationState('folder-1')).toBeNull();

      username = 'user1';
      expect(service.getPaginationState('folder-1')).toEqual({ skipCount: 25, maxItems: 25 });
    });
  });

  describe('getCurrentContext', () => {
    it('should retain state while navigating within personal files', () => {
      routerMock.url = '/personal-files';
      service.prepareContext();
      service.setPaginationState('folder-1', { skipCount: 25, maxItems: 25 });

      routerMock.url = '/personal-files/folder-1';
      service.prepareContext();

      expect(service.getPaginationState('folder-1')).toEqual({ skipCount: 25, maxItems: 25 });
    });

    it('should clear state when switching from personal files to repository', () => {
      routerMock.url = '/personal-files';
      service.prepareContext();
      service.setPaginationState('folder-1', { skipCount: 25, maxItems: 25 });

      routerMock.url = '/repository';
      service.prepareContext();

      expect(service.getPaginationState('folder-1')).toBeNull();
    });

    it('should keep the state when navigating from all libraries into a library', () => {
      routerMock.url = '/all/libraries';
      service.prepareContext();
      service.setPaginationState('all-libraries', { skipCount: 25, maxItems: 25 });

      routerMock.url = '/libraries/site-1';
      service.prepareContext();

      expect(service.getPaginationState('all-libraries')).toEqual({ skipCount: 25, maxItems: 25 });
    });

    it('should treat all library lists and library browsing as one context', () => {
      routerMock.url = '/libraries';
      service.prepareContext();
      service.setPaginationState('my-libraries', { skipCount: 25, maxItems: 25 });

      routerMock.url = '/all/libraries';
      service.prepareContext();

      expect(service.getPaginationState('my-libraries')).toEqual({ skipCount: 25, maxItems: 25 });
    });

    it('should treat favorite libraries as a separate context', () => {
      routerMock.url = '/favorite/libraries';
      service.prepareContext();
      service.setPaginationState('favorite-libraries', { skipCount: 25, maxItems: 25 });

      routerMock.url = '/favorite/libraries/site-1';
      service.prepareContext();

      expect(service.getPaginationState('favorite-libraries')).toEqual({ skipCount: 25, maxItems: 25 });
    });
  });
});
