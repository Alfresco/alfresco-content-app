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

import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs';
import { SavedSearchEditDialogComponent } from './saved-search-edit-dialog.component';
import { ContentTestingModule, SavedSearch, SavedSearchesService } from '@alfresco/adf-content-services';
import { provideMockStore } from '@ngrx/store/testing';
import { Store } from '@ngrx/store';
import { SnackbarErrorAction, SnackbarInfoAction } from '@alfresco/aca-shared/store';
import { AppTestingModule } from '../../../../../testing/app-testing.module';

describe('SaveSearchEditDialogComponent', () => {
  let fixture: ComponentFixture<SavedSearchEditDialogComponent>;
  let component: SavedSearchEditDialogComponent;
  let savedSearchesService: SavedSearchesService;
  let store: Store;
  let submitButton: HTMLButtonElement;

  const savedSearchToDelete: SavedSearch = {
    name: 'test',
    encodedUrl: '1234',
    order: 0
  };

  const dialogRef = {
    close: jasmine.createSpy('close')
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ContentTestingModule, AppTestingModule],
      providers: [
        { provide: MatDialogRef, useValue: dialogRef },
        provideMockStore(),
        { provide: SavedSearchesService, useValue: { editSavedSearch: () => of(), getSavedSearches: () => of([]) } },
        { provide: MAT_DIALOG_DATA, useValue: savedSearchToDelete }
      ]
    });
    dialogRef.close.calls.reset();
    fixture = TestBed.createComponent(SavedSearchEditDialogComponent);
    component = fixture.componentInstance;
    savedSearchesService = TestBed.inject(SavedSearchesService);
    store = TestBed.inject(Store);

    submitButton = fixture.nativeElement.querySelector('#aca-saved-search-edit-dialog-submit-button');
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should not save search if form is invalid', fakeAsync(() => {
    spyOn(savedSearchesService, 'editSavedSearch').and.callThrough();
    component.form.controls['name'].setValue('');
    tick();
    submitButton.click();
    expect(savedSearchesService.editSavedSearch).not.toHaveBeenCalled();
  }));

  it('should save search, show snackbar message and close modal if form is valid', fakeAsync(() => () => {
    spyOn(savedSearchesService, 'editSavedSearch').and.callThrough();
    setFormValuesAndSubmit();
    expect(store.dispatch).toHaveBeenCalledWith(new SnackbarInfoAction('APP.BROWSE.SEARCH.SAVE_SEARCH.EDIT_DIALOG.SUCCESS_MESSAGE'));
    expect(dialogRef.close).toHaveBeenCalled();
  }));

  it('should show snackbar error if there is save error', fakeAsync(() => () => {
    spyOn(savedSearchesService, 'editSavedSearch').and.throwError('');
    setFormValuesAndSubmit();
    expect(store.dispatch).toHaveBeenCalledWith(new SnackbarErrorAction('APP.BROWSE.SEARCH.SAVE_SEARCH.EDIT_DIALOG.ERROR_MESSAGE'));
    expect(dialogRef.close).not.toHaveBeenCalled();
  }));

  function setFormValuesAndSubmit() {
    spyOn(store, 'dispatch');
    component.form.controls['name'].setValue('ABCDEF');
    component.form.controls['description'].setValue('TEST');
    submitButton.click();
    tick();
    expect(savedSearchesService.editSavedSearch).toHaveBeenCalledWith({
      name: 'ABCDEF',
      description: 'TEST',
      encodedUrl: '1234',
      order: 0
    });
  }
});
