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
import { UnitTestingUtils } from '@alfresco/adf-core';
import { MatError } from '@angular/material/form-field';
import { AppStore } from '@alfresco/aca-shared/store';
import { AppTestingModule } from '../../../testing/app-testing.module';
import { SearchInputComponent } from './search-input.component';
import { Store } from '@ngrx/store';
import { of, Subject } from 'rxjs';
import { NavigationStart, Router, RouterEvent } from '@angular/router';
import { SearchConfiguration, SearchQueryBuilderService } from '@alfresco/adf-content-services';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatMenuHarness } from '@angular/material/menu/testing';
import { MatCheckboxHarness } from '@angular/material/checkbox/testing';

describe('SearchInputComponent', () => {
  let fixture: ComponentFixture<SearchInputComponent>;
  let component: SearchInputComponent;
  let store: jasmine.SpyObj<Store<AppStore>>;
  let unitTestingUtils: UnitTestingUtils;
  let loader: HarnessLoader;
  let router: Router;
  const routerEventsSubject = new Subject<RouterEvent>();
  const configUpdatedSubject = new Subject<SearchConfiguration>();

  function getFirstError(): string {
    const error = unitTestingUtils.getByDirective(MatError);
    return error?.nativeElement.textContent.trim();
  }

  async function openMenu(): Promise<MatMenuHarness> {
    const menu = await loader.getHarness(MatMenuHarness);
    await menu.open();
    return menu;
  }

  function getCheckbox(id: string): Promise<MatCheckboxHarness> {
    const overlayLoader = TestbedHarnessEnvironment.documentRootLoader(fixture);
    return overlayLoader.getHarness(MatCheckboxHarness.with({ selector: `#${id}` }));
  }

  async function uncheckAllCheckboxes() {
    const checkboxIds = ['libraries', 'folder', 'content'];
    for (const id of checkboxIds) {
      try {
        const checkbox = await getCheckbox(id);
        if (await checkbox.isChecked()) {
          await checkbox.uncheck();
          fixture.detectChanges();
        }
      } catch (err) {
        fail(`Checkbox with id ${id} not found`);
        throw err;
      }
    }
  }

  beforeEach(async () => {
    const storeSpy = jasmine.createSpyObj<Store<AppStore>>('Store', ['dispatch', 'pipe']);

    const queryBuilderSpy = {
      configUpdated: configUpdatedSubject,
      removeFilterQuery: () => {}
    } as Partial<SearchQueryBuilderService>;

    await TestBed.configureTestingModule({
      imports: [AppTestingModule, SearchInputComponent],
      providers: [
        { provide: Store, useValue: storeSpy },
        { provide: SearchQueryBuilderService, useValue: queryBuilderSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SearchInputComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store) as jasmine.SpyObj<Store<AppStore>>;
    router = TestBed.inject(Router);
    store.pipe.and.returnValue(of([]));
    fixture.detectChanges();
    unitTestingUtils = new UnitTestingUtils(fixture.debugElement);
    loader = TestbedHarnessEnvironment.loader(fixture);

    Object.defineProperty(router, 'events', {
      get: () => routerEventsSubject.asObservable()
    });
  });

  it('should show required error when field is empty and touched', async () => {
    await openMenu();

    component.searchInputControl.searchFieldFormControl.setValue('');
    component.searchInputControl.searchFieldFormControl.markAsTouched();
    fixture.detectChanges();

    expect(getFirstError()).toBe('SEARCH.INPUT.REQUIRED');
  });

  it('should not show error when field has value', async () => {
    await openMenu();

    component.searchInputControl.searchFieldFormControl.setValue('not giving up');
    component.searchInputControl.searchFieldFormControl.markAsTouched();
    fixture.detectChanges();

    const error = unitTestingUtils.getByDirective(MatError);
    expect(error).toBeNull();
  });

  it('should not show error when field is untouched', async () => {
    await openMenu();

    component.searchInputControl.searchFieldFormControl.setValue('');
    component.searchInputControl.searchFieldFormControl.markAsUntouched();
    fixture.detectChanges();

    const error = unitTestingUtils.getByDirective(MatError);
    expect(error).toBeNull();
  });

  it('should dispatch action when Libraries checkbox selected and term is entered', async () => {
    await openMenu();
    const checkbox = await getCheckbox('libraries');
    await checkbox.check();
    fixture.detectChanges();

    component.onSearchSubmit({ target: { value: 'happy faces only' } });
    expect(store.dispatch).toHaveBeenCalled();
  });

  it('should not dispatch SearchByTermAction when no checkboxes are selected and term is empty', async () => {
    store.dispatch.calls.reset();

    await openMenu();
    await uncheckAllCheckboxes();

    expect(component.searchOptions.every((option) => !option.value)).toBeTrue();

    component.searchedWord = '';
    fixture.detectChanges();

    component.onSearchSubmit({ target: { value: '' } });
    expect(store.dispatch).not.toHaveBeenCalled();
  });

  describe('queryBuilder configUpdated handling', () => {
    it('should call searchByOption when searchedWord set and navigation has query params', () => {
      spyOn(component, 'searchByOption').and.stub();

      component.ngOnInit();

      component.searchedWord = 'term';

      routerEventsSubject.next(new NavigationStart(1, '/path?q=term'));
      configUpdatedSubject.next({
        id: 'config1'
      });

      expect(component.searchByOption).toHaveBeenCalled();
    });

    it('should NOT call searchByOption when searchedWord set and navigation has NO query params', () => {
      component.searchedWord = 'term';

      routerEventsSubject.next(new NavigationStart(1, '/path'));

      configUpdatedSubject.next({
        id: 'config1'
      });
      spyOn(component, 'searchByOption').and.stub();

      component.ngOnInit();

      expect(component.searchByOption).not.toHaveBeenCalled();
    });
  });
});
