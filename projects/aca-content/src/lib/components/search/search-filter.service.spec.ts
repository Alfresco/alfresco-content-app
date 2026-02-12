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
import { SearchFilterService } from './search-filter.service';
import { SearchQueryBuilderService } from '@alfresco/adf-content-services';

describe('SearchFilterService', () => {
  let service: SearchFilterService;
  let queryBuilder: jasmine.SpyObj<SearchQueryBuilderService>;

  beforeEach(() => {
    queryBuilder = jasmine.createSpyObj<SearchQueryBuilderService>('SearchQueryBuilderService', ['addFilterQuery', 'removeFilterQuery']);

    TestBed.configureTestingModule({
      providers: [SearchFilterService, { provide: SearchQueryBuilderService, useValue: queryBuilder }]
    });

    service = TestBed.inject(SearchFilterService);
  });

  describe('getSearchInLabel', () => {
    it('should return libraries label in libraries mode', () => {
      service.searchInMode = 'libraries';
      expect(service.getSearchInLabel()).toBe('SEARCH.INPUT.LIBRARIES');
    });

    it('should return filter and folders label when both checked', () => {
      service.searchInMode = 'content';
      service.filesChecked = true;
      service.foldersChecked = true;
      expect(service.getSearchInLabel()).toBe('SEARCH.INPUT.FILES_AND_FOLDERS');
    });

    it('should return files label when only files checked', () => {
      service.searchInMode = 'content';
      service.filesChecked = true;
      service.foldersChecked = false;
      expect(service.getSearchInLabel()).toBe('SEARCH.INPUT.FILES');
    });

    it('should return folders when only folders checked', () => {
      service.searchInMode = 'content';
      service.filesChecked = false;
      service.foldersChecked = true;
      expect(service.getSearchInLabel()).toBe('SEARCH.INPUT.FOLDERS');
    });
  });

  describe('validateSearchTerm', () => {
    it('should return error for empty term', () => {
      expect(service.validateSearchTerm('')).toBe('SEARCH.INPUT.REQUIRED');
    });

    it('should return error for null/undefined', () => {
      expect(service.validateSearchTerm(null)).toBe('SEARCH.INPUT.REQUIRED');
    });

    it('should return error for whitespace-only term', () => {
      expect(service.validateSearchTerm('   ')).toBe('SEARCH.INPUT.WHITESPACE');
    });

    it('should return error for term starting with operator', () => {
      expect(service.validateSearchTerm('+test')).toBe('SEARCH.INPUT.OPERATORS');
    });

    it('should return error for single char in libraries mode', () => {
      service.searchInMode = 'libraries';
      expect(service.validateSearchTerm('a')).toBe('SEARCH.INPUT.MIN_LENGTH');
    });

    it('should return null for valid term', () => {
      expect(service.validateSearchTerm('valid search')).toBeNull();
    });
  });

  describe('applyContentFilters', () => {
    it('should add folder filter when only folders checked in content mode', () => {
      service.searchInMode = 'content';
      service.filesChecked = false;
      service.foldersChecked = true;
      service.applyContentFilters();

      expect(queryBuilder.addFilterQuery).toHaveBeenCalledWith("+TYPE:'cm:folder'");
      expect(queryBuilder.removeFilterQuery).toHaveBeenCalledWith("+TYPE:'cm:content'");
    });

    it('should add content filter when only files checked in content mode', () => {
      service.searchInMode = 'content';
      service.filesChecked = true;
      service.foldersChecked = false;
      service.applyContentFilters();

      expect(queryBuilder.addFilterQuery).toHaveBeenCalledWith("+TYPE:'cm:content'");
      expect(queryBuilder.removeFilterQuery).toHaveBeenCalledWith("+TYPE:'cm:folder'");
    });

    it('should remove all content filters when both checked', () => {
      service.searchInMode = 'content';
      service.filesChecked = true;
      service.foldersChecked = true;
      service.applyContentFilters();

      expect(queryBuilder.removeFilterQuery).toHaveBeenCalledWith("+TYPE:'cm:content'");
      expect(queryBuilder.removeFilterQuery).toHaveBeenCalledWith("+TYPE:'cm:folder'");
    });

    it('should remove content filters in libraries mode', () => {
      service.searchInMode = 'libraries';
      service.filesChecked = false;
      service.foldersChecked = false;
      service.applyContentFilters();

      expect(queryBuilder.removeFilterQuery).toHaveBeenCalledWith("+TYPE:'cm:content'");
      expect(queryBuilder.removeFilterQuery).toHaveBeenCalledWith("+TYPE:'cm:folder'");
    });
  });

  describe('initForLibrariesRoute', () => {
    it('should set libraries mode and uncheck files/folders', () => {
      service.initForLibrariesRoute();
      expect(service.searchInMode).toBe('libraries');
      expect(service.filesChecked).toBeFalse();
      expect(service.foldersChecked).toBeFalse();
    });
  });
});
