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

  afterEach(() => {
    sessionStorage.clear();
  });

  it('should return null when nothing is stored', () => {
    expect(service.getPaginationState('folder-1')).toBeNull();
  });

  it('should store and return the pagination for a key', () => {
    service.setPaginationState('folder-1', { skipCount: 25, maxItems: 25 });

    expect(service.getPaginationState('folder-1')).toEqual({ skipCount: 25, maxItems: 25 });
  });

  it('should keep a separate state per key', () => {
    service.setPaginationState('folder-1', { skipCount: 25, maxItems: 25 });
    service.setPaginationState('folder-2', { skipCount: 50, maxItems: 25 });

    expect(service.getPaginationState('folder-1')).toEqual({ skipCount: 25, maxItems: 25 });
    expect(service.getPaginationState('folder-2')).toEqual({ skipCount: 50, maxItems: 25 });
  });

  it('should not store the first page (skipCount 0) and clear any previous state', () => {
    service.setPaginationState('folder-1', { skipCount: 25, maxItems: 25 });
    service.setPaginationState('folder-1', { skipCount: 0, maxItems: 25 });

    expect(service.getPaginationState('folder-1')).toBeNull();
  });

  it('should reset the state for a key', () => {
    service.setPaginationState('folder-1', { skipCount: 25, maxItems: 25 });
    service.resetPaginationState('folder-1');

    expect(service.getPaginationState('folder-1')).toBeNull();
  });

  it('should isolate the state per user', () => {
    service.setPaginationState('folder-1', { skipCount: 25, maxItems: 25 });

    username = 'user2';
    expect(service.getPaginationState('folder-1')).toBeNull();

    username = 'user1';
    expect(service.getPaginationState('folder-1')).toEqual({ skipCount: 25, maxItems: 25 });
  });

  it('should clear all stored pagination entries', () => {
    service.setPaginationState('folder-1', { skipCount: 25, maxItems: 25 });
    username = 'user2';
    service.setPaginationState('folder-2', { skipCount: 50, maxItems: 25 });

    service.clearAll();

    username = 'user1';
    expect(service.getPaginationState('folder-1')).toBeNull();
    username = 'user2';
    expect(service.getPaginationState('folder-2')).toBeNull();
  });

  it('should ignore a missing key', () => {
    expect(service.getPaginationState('')).toBeNull();
    expect(() => service.setPaginationState('', { skipCount: 25, maxItems: 25 })).not.toThrow();
    expect(() => service.resetPaginationState('')).not.toThrow();
  });

  it('should return null for a malformed entry', () => {
    sessionStorage.setItem(`${username}_pagination_folder-1`, 'not-json');

    expect(service.getPaginationState('folder-1')).toBeNull();
  });

  describe('prepareContext', () => {
    it('should not clear existing state on the first call after creation (page reload)', () => {
      service.setPaginationState('folder-1', { skipCount: 25, maxItems: 25 });
      routerMock.url = '/personal-files';

      service.prepareContext();

      expect(service.getPaginationState('folder-1')).toEqual({ skipCount: 25, maxItems: 25 });
    });

    it('should retain state while navigating within the same context', () => {
      routerMock.url = '/personal-files';
      service.prepareContext();
      service.setPaginationState('folder-1', { skipCount: 25, maxItems: 25 });

      routerMock.url = '/personal-files/folder-1';
      service.prepareContext();

      expect(service.getPaginationState('folder-1')).toEqual({ skipCount: 25, maxItems: 25 });
    });

    it('should clear all state when the context changes', () => {
      routerMock.url = '/personal-files';
      service.prepareContext();
      service.setPaginationState('folder-1', { skipCount: 25, maxItems: 25 });

      routerMock.url = '/repository';
      service.prepareContext();

      expect(service.getPaginationState('folder-1')).toBeNull();
    });

    it('should treat favorite libraries as a single context', () => {
      routerMock.url = '/favorite/libraries';
      service.prepareContext();
      service.setPaginationState('favorite-libraries', { skipCount: 25, maxItems: 25 });

      routerMock.url = '/favorite/libraries/site-1';
      service.prepareContext();

      expect(service.getPaginationState('favorite-libraries')).toEqual({ skipCount: 25, maxItems: 25 });
    });
  });
});
