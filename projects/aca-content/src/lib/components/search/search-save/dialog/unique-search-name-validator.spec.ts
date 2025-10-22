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
import { UniqueSearchNameValidator } from './unique-search-name-validator';
import { of } from 'rxjs';
import { FormControl } from '@angular/forms';
import { NoopTranslateModule } from '@alfresco/adf-core';
import { SavedSearchesContextService } from '../../../../services/saved-searches-context.service';

describe('UniqueSearchNameValidator', () => {
  let validator: UniqueSearchNameValidator;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NoopTranslateModule]
    });
  });

  describe('Save searches returns results', () => {
    beforeEach(() => {
      TestBed.overrideProvider(SavedSearchesContextService, { useValue: { getSavedSearches: () => of([{ name: 'test' }]) } });
      validator = TestBed.inject(UniqueSearchNameValidator);
    });

    it('should return null when name is unique', (done) => {
      validator.validate(new FormControl({ value: 'unique', disabled: false })).subscribe((result) => {
        expect(result).toBe(null);
        done();
      });
    });

    it('should return error when name is not unique', (done) => {
      const form = new FormControl({ value: 'test', disabled: false });
      form.markAsDirty();
      validator.validate(form).subscribe((result) => {
        expect(result).toEqual({ message: 'APP.BROWSE.SEARCH.SAVE_SEARCH.SEARCH_NAME_NOT_UNIQUE_ERROR' });
        done();
      });
    });
  });

  describe('Save searches returns error', () => {
    beforeEach(() => {
      TestBed.overrideProvider(SavedSearchesContextService, { useValue: { getSavedSearches: () => of(null) } });
      validator = TestBed.inject(UniqueSearchNameValidator);
    });

    it('should return null when error occurs', (done) => {
      validator.validate(new FormControl({ value: 'test', disabled: false })).subscribe((result) => {
        expect(result).toBe(null);
        done();
      });
    });
  });
});
