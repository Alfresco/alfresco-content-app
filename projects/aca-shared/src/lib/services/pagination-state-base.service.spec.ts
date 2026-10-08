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

import { PaginationStateBaseService } from './pagination-state-base.service';

class TestPaginationStateService extends PaginationStateBaseService {
  username = 'user1';
  context = 'context-a';

  protected getUsername(): string {
    return this.username;
  }

  protected getCurrentContext(): string {
    return this.context;
  }
}

describe('PaginationStateBaseService', () => {
  let service: TestPaginationStateService;

  beforeEach(() => {
    sessionStorage.clear();
    service = new TestPaginationStateService();
  });

  afterEach(() => sessionStorage.clear());

  describe('storage', () => {
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

      service.username = 'user2';
      expect(service.getPaginationState('folder-1')).toBeNull();

      service.username = 'user1';
      expect(service.getPaginationState('folder-1')).toEqual({ skipCount: 25, maxItems: 25 });
    });

    it('should clear all stored pagination entries', () => {
      service.setPaginationState('folder-1', { skipCount: 25, maxItems: 25 });
      service.username = 'user2';
      service.setPaginationState('folder-2', { skipCount: 50, maxItems: 25 });

      service.clearAll();

      service.username = 'user1';
      expect(service.getPaginationState('folder-1')).toBeNull();
      service.username = 'user2';
      expect(service.getPaginationState('folder-2')).toBeNull();
    });

    it('should ignore a missing key', () => {
      expect(service.getPaginationState('')).toBeNull();
      expect(() => service.setPaginationState('', { skipCount: 25, maxItems: 25 })).not.toThrow();
      expect(() => service.resetPaginationState('')).not.toThrow();
    });

    it('should return null for a malformed entry', () => {
      sessionStorage.setItem(`${service.username}_pagination_folder-1`, 'not-json');

      expect(service.getPaginationState('folder-1')).toBeNull();
    });
  });

  describe('prepareContext', () => {
    it('should not clear existing state on the first call after creation (page reload)', () => {
      service.setPaginationState('folder-1', { skipCount: 25, maxItems: 25 });

      service.prepareContext();

      expect(service.getPaginationState('folder-1')).toEqual({ skipCount: 25, maxItems: 25 });
    });

    it('should retain state while the context does not change', () => {
      service.context = 'context-a';
      service.prepareContext();
      service.setPaginationState('folder-1', { skipCount: 25, maxItems: 25 });

      service.prepareContext();

      expect(service.getPaginationState('folder-1')).toEqual({ skipCount: 25, maxItems: 25 });
    });

    it('should clear all state when the context changes', () => {
      service.context = 'context-a';
      service.prepareContext();
      service.setPaginationState('folder-1', { skipCount: 25, maxItems: 25 });

      service.context = 'context-b';
      service.prepareContext();

      expect(service.getPaginationState('folder-1')).toBeNull();
    });
  });
});
