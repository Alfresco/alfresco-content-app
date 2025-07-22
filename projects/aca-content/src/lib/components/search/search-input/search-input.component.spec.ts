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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatError } from '@angular/material/form-field';
import { AppStore } from '@alfresco/aca-shared/store';
import { By } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { AppTestingModule } from '../../../testing/app-testing.module';
import { SearchInputComponent } from './search-input.component';
import { SearchInputControlComponent } from '../search-input-control/search-input-control.component';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';

describe('SearchInputComponent', () => {
  let fixture: ComponentFixture<SearchInputComponent>;
  let component: SearchInputComponent;
  let store: jasmine.SpyObj<Store<AppStore>>;

  beforeEach(async () => {
    const storeSpy = jasmine.createSpyObj<Store<AppStore>>('Store', ['dispatch', 'pipe']);

    await TestBed.configureTestingModule({
      imports: [AppTestingModule, ReactiveFormsModule, SearchInputComponent, SearchInputControlComponent],
      providers: [{ provide: Store, useValue: storeSpy }],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(SearchInputComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store) as jasmine.SpyObj<Store<AppStore>>;
    store.pipe.and.returnValue(of([]));
    fixture.detectChanges();
  });

  function getFirstError(): string {
    const error = fixture.debugElement.query(By.directive(MatError));
    return error?.nativeElement.textContent.trim();
  }

  function openSearchContainer(): void {
    const menuButton = fixture.debugElement.query(By.css('.app-search-container'));
    menuButton?.nativeElement.click();
    fixture.detectChanges();
  }

  it('should show required error when field is empty and touched', () => {
    openSearchContainer();
    component.searchInputControl.searchFieldFormControl.setValue('');
    component.searchInputControl.searchFieldFormControl.markAsTouched();
    fixture.detectChanges();
    expect(getFirstError()).toBe('SEARCH.INPUT.REQUIRED');
  });

  it('should not show error when field has value', () => {
    openSearchContainer();
    component.searchInputControl.searchFieldFormControl.setValue('test');
    component.searchInputControl.searchFieldFormControl.markAsTouched();
    fixture.detectChanges();
    const error = fixture.debugElement.query(By.directive(MatError));
    expect(error).toBeNull();
  });

  it('should not show error when field is untouched', () => {
    openSearchContainer();
    component.searchInputControl.searchFieldFormControl.setValue('');
    component.searchInputControl.searchFieldFormControl.markAsUntouched();
    fixture.detectChanges();
    const error = fixture.debugElement.query(By.directive(MatError));
    expect(error).toBeNull();
  });

  it('should dispatch SearchByTermAction when libraries are checked and term is new', () => {
    spyOn(component as any, 'isLibrariesChecked').and.returnValue(true);
    spyOn(component as any, 'isFoldersChecked').and.returnValue(false);
    spyOn(component as any, 'isFilesChecked').and.returnValue(false);
    component.searchedWord = 'test';
    component.onSearchSubmit('Enter');
    expect(store.dispatch).toHaveBeenCalled();
  });

  it('should not dispatch SearchByTermAction when no checkboxes are selected and term is empty', () => {
    store.dispatch.calls.reset();

    spyOn(component as any, 'isLibrariesChecked').and.returnValue(false);
    spyOn(component as any, 'isFoldersChecked').and.returnValue(false);
    spyOn(component as any, 'isFilesChecked').and.returnValue(false);

    component.searchedWord = '';
    component.onSearchSubmit({ target: { value: '' } });

    expect(store.dispatch).not.toHaveBeenCalled();
  });
});
