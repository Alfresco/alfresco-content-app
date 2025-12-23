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
import { of, Subject } from 'rxjs';

import { SavedSearchesContextService } from './saved-searches-context.service';
import { SavedSearch, SavedSearchesLegacyService, SavedSearchesService } from '@alfresco/adf-content-services';
import { IsFeatureSupportedInCurrentAcsPipe } from '../pipes/is-feature-supported.pipe';
import { NodeEntry } from '@alfresco/js-api';

describe('SavedSearchesContextService', () => {
  let legacySpy: jasmine.SpyObj<SavedSearchesLegacyService>;
  let modernSpy: jasmine.SpyObj<SavedSearchesService>;
  let isSupportedPipeMock: Partial<IsFeatureSupportedInCurrentAcsPipe>;
  let service: SavedSearchesContextService;
  let isSupported: Subject<boolean>;

  beforeEach(() => {
    legacySpy = jasmine.createSpyObj('SavedSearchesLegacyService', [
      'init',
      'getSavedSearches',
      'saveSearch',
      'editSavedSearch',
      'deleteSavedSearch',
      'changeOrder'
    ]);
    legacySpy.getSavedSearches.and.returnValue(of([]));
    legacySpy.saveSearch.and.returnValue(of({} as NodeEntry));
    legacySpy.editSavedSearch.and.returnValue(of({} as NodeEntry));
    legacySpy.deleteSavedSearch.and.returnValue(of({} as NodeEntry));

    modernSpy = jasmine.createSpyObj('SavedSearchesService', [
      'init',
      'getSavedSearches',
      'saveSearch',
      'editSavedSearch',
      'deleteSavedSearch',
      'changeOrder'
    ]);
    modernSpy.getSavedSearches.and.returnValue(of([]));
    modernSpy.saveSearch.and.returnValue(of({} as NodeEntry));
    modernSpy.editSavedSearch.and.returnValue(of({} as NodeEntry));
    modernSpy.deleteSavedSearch.and.returnValue(of({} as NodeEntry));

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

    it('should use modern service when feature is supported', (done) => {
      service.init();
      setTimeout(() => {
        expect(legacySpy.init).not.toHaveBeenCalled();
        expect(modernSpy.init).toHaveBeenCalled();
        done();
      });
    });

    it('should delegate init() call to a current strategy', (done) => {
      service.init();
      setTimeout(() => {
        expect(modernSpy.init).toHaveBeenCalled();
        done();
      });
    });

    it('should delegate getSavedSearches() call to a current strategy', (done) => {
      service.getSavedSearches().subscribe(() => {
        expect(modernSpy.getSavedSearches).toHaveBeenCalled();
        done();
      });
    });

    it('should delegate saveSearch() call to a current strategy', (done) => {
      const newSavedSearch = { name: 'Test Search', description: 'Test Description', encodedUrl: 'http://example.com' };
      service.saveSearch(newSavedSearch).subscribe(() => {
        expect(modernSpy.saveSearch).toHaveBeenCalledWith(newSavedSearch);
        done();
      });
    });

    it('should delegate editSavedSearch() call to a current strategy', (done) => {
      const updatedSavedSearch = {
        name: 'Updated Search',
        description: 'Updated Description',
        encodedUrl: 'http://example.com',
        order: 1
      };
      service.editSavedSearch(updatedSavedSearch).subscribe(() => {
        expect(modernSpy.editSavedSearch).toHaveBeenCalledWith(updatedSavedSearch);
        done();
      });
    });

    it('should delegate deleteSavedSearch() call to a current strategy', (done) => {
      const deletedSavedSearch = {
        name: 'Deleted Search',
        description: 'Deleted Description',
        encodedUrl: 'http://example.com',
        order: 2
      };
      service.deleteSavedSearch(deletedSavedSearch).subscribe(() => {
        expect(modernSpy.deleteSavedSearch).toHaveBeenCalledWith(deletedSavedSearch);
        done();
      });
    });

    it('should delegate changeOrder() call to a current strategy', (done) => {
      service.changeOrder(0, 1);
      setTimeout(() => {
        expect(modernSpy.changeOrder).toHaveBeenCalledWith(0, 1);
        done();
      });
    });
  });

  describe('legacy strategy', () => {
    beforeEach(() => {
      isSupported.next(false);
    });

    it('should use legacy service when feature is NOT supported', (done) => {
      service.init();
      setTimeout(() => {
        expect(legacySpy.init).toHaveBeenCalled();
        expect(modernSpy.init).not.toHaveBeenCalled();
        done();
      });
    });

    it('should delegate init() call to a current strategy', (done) => {
      service.init();
      setTimeout(() => {
        expect(legacySpy.init).toHaveBeenCalled();
        done();
      });
    });

    it('should delegate getSavedSearches() call to a current strategy', (done) => {
      service.getSavedSearches().subscribe(() => {
        expect(legacySpy.getSavedSearches).toHaveBeenCalled();
        done();
      });
    });

    it('should delegate saveSearch() call to a current strategy', (done) => {
      const newSavedSearch = { name: 'Test Search', description: 'Test Description', encodedUrl: 'http://example.com' } as SavedSearch;
      service.saveSearch(newSavedSearch).subscribe(() => {
        expect(legacySpy.saveSearch).toHaveBeenCalledWith(newSavedSearch);
        done();
      });
    });

    it('should delegate editSavedSearch() call to a current strategy', (done) => {
      const updatedSavedSearch: SavedSearch = {
        name: 'Updated Search',
        description: 'Updated Description',
        encodedUrl: 'http://example.com',
        order: 1
      };
      service.editSavedSearch(updatedSavedSearch).subscribe(() => {
        expect(legacySpy.editSavedSearch).toHaveBeenCalledWith(updatedSavedSearch);
        done();
      });
    });

    it('should delegate deleteSavedSearch() call to a current strategy', (done) => {
      const deletedSavedSearch: SavedSearch = {
        name: 'Deleted Search',
        description: 'Deleted Description',
        encodedUrl: 'http://example.com',
        order: 2
      };
      service.deleteSavedSearch(deletedSavedSearch).subscribe(() => {
        expect(legacySpy.deleteSavedSearch).toHaveBeenCalledWith(deletedSavedSearch);
        done();
      });
    });

    it('should delegate changeOrder() call to a current strategy', (done) => {
      service.changeOrder(0, 1);
      setTimeout(() => {
        expect(legacySpy.changeOrder).toHaveBeenCalledWith(0, 1);
        done();
      });
    });
  });
});
