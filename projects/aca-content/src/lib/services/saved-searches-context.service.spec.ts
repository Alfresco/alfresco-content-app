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
import { Subject } from 'rxjs';

import { SavedSearchesContextService } from './saved-searches-context.service';
import { SavedSearch, SavedSearchesLegacyService, SavedSearchesService } from '@alfresco/adf-content-services';
import { IsFeatureSupportedInCurrentAcsPipe } from '../pipes/is-feature-supported.pipe';

describe('SavedSearchesContextService', () => {
  let legacySpy: jasmine.SpyObj<SavedSearchesLegacyService>;
  let modernSpy: jasmine.SpyObj<SavedSearchesService>;
  let isSupportedPipeMock: Partial<IsFeatureSupportedInCurrentAcsPipe>;
  let service: SavedSearchesContextService;
  let isSupported: Subject<boolean>;

  beforeEach(() => {
    legacySpy = jasmine.createSpyObj('SavedSearchesLegacyService', [
      'savedSearches$',
      'init',
      'getSavedSearches',
      'saveSearch',
      'editSavedSearch',
      'deleteSavedSearch',
      'changeOrder'
    ]);

    modernSpy = jasmine.createSpyObj('SavedSearchesService', [
      'savedSearches$',
      'init',
      'getSavedSearches',
      'saveSearch',
      'editSavedSearch',
      'deleteSavedSearch',
      'changeOrder'
    ]);

    isSupported = new Subject<boolean>();

    isSupportedPipeMock = {
      transform: () => isSupported
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: IsFeatureSupportedInCurrentAcsPipe, useValue: isSupportedPipeMock },
        { provide: SavedSearchesLegacyService, useValue: legacySpy },
        { provide: SavedSearchesService, useValue: modernSpy }
      ]
    });

    service = TestBed.inject(SavedSearchesContextService);
  });

  describe('modern strategy', () => {
    beforeEach(() => {
      isSupported.next(true);
    });

    it('should use modern service when feature is supported', () => {
      service.init();
      expect(legacySpy.init).not.toHaveBeenCalled();
      expect(modernSpy.init).toHaveBeenCalled();
    });

    it('should delegate init() call to a current strategy', () => {
      service.init();
      expect(modernSpy.init).toHaveBeenCalled();
    });

    it('should delegate getSavedSearches() call to a current strategy', () => {
      service.getSavedSearches();
      expect(modernSpy.getSavedSearches).toHaveBeenCalled();
    });

    it('should delegate saveSearch() call to a current strategy', () => {
      const newSavedSearch = { name: 'Test Search', description: 'Test Description', encodedUrl: 'http://example.com' };
      service.saveSearch(newSavedSearch);
      expect(modernSpy.saveSearch).toHaveBeenCalledWith(newSavedSearch);
    });

    it('should delegate editSavedSearch() call to a current strategy', () => {
      const updatedSavedSearch = {
        name: 'Updated Search',
        description: 'Updated Description',
        encodedUrl: 'http://example.com',
        order: 1
      };
      service.editSavedSearch(updatedSavedSearch);
      expect(modernSpy.editSavedSearch).toHaveBeenCalledWith(updatedSavedSearch);
    });

    it('should delegate deleteSavedSearch() call to a current strategy', () => {
      const deletedSavedSearch = {
        name: 'Deleted Search',
        description: 'Deleted Description',
        encodedUrl: 'http://example.com',
        order: 2
      };
      service.deleteSavedSearch(deletedSavedSearch);
      expect(modernSpy.deleteSavedSearch).toHaveBeenCalledWith(deletedSavedSearch);
    });

    it('should delegate changeOrder() call to a current strategy', () => {
      service.changeOrder(0, 1);
      expect(modernSpy.changeOrder).toHaveBeenCalledWith(0, 1);
    });
  });

  describe('legacy strategy', () => {
    beforeEach(() => {
      isSupported.next(false);
    });

    it('should use legacy service when feature is NOT supported', () => {
      service.init();
      expect(legacySpy.init).toHaveBeenCalled();
      expect(modernSpy.init).not.toHaveBeenCalled();
    });

    it('should delegate init() call to a current strategy', () => {
      service.init();
      expect(legacySpy.init).toHaveBeenCalled();
    });

    it('should delegate getSavedSearches() call to a current strategy', () => {
      service.getSavedSearches();
      expect(legacySpy.getSavedSearches).toHaveBeenCalled();
    });

    it('should delegate saveSearch() call to a current strategy', () => {
      const newSavedSearch = { name: 'Test Search', description: 'Test Description', encodedUrl: 'http://example.com' } as SavedSearch;
      service.saveSearch(newSavedSearch);
      expect(legacySpy.saveSearch).toHaveBeenCalledWith(newSavedSearch);
    });

    it('should delegate editSavedSearch() call to a current strategy', () => {
      const updatedSavedSearch: SavedSearch = {
        name: 'Updated Search',
        description: 'Updated Description',
        encodedUrl: 'http://example.com',
        order: 1
      };
      service.editSavedSearch(updatedSavedSearch);
      expect(legacySpy.editSavedSearch).toHaveBeenCalledWith(updatedSavedSearch);
    });

    it('should delegate deleteSavedSearch() call to a current strategy', () => {
      const deletedSavedSearch: SavedSearch = {
        name: 'Deleted Search',
        description: 'Deleted Description',
        encodedUrl: 'http://example.com',
        order: 2
      };
      service.deleteSavedSearch(deletedSavedSearch);
      expect(legacySpy.deleteSavedSearch).toHaveBeenCalledWith(deletedSavedSearch);
    });

    it('should delegate changeOrder() call to a current strategy', () => {
      service.changeOrder(0, 1);
      expect(legacySpy.changeOrder).toHaveBeenCalledWith(0, 1);
    });
  });
});
