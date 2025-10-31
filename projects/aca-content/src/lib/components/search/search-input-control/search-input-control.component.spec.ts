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

import { SearchInputControlComponent } from './search-input-control.component';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { AppTestingModule } from '../../../testing/app-testing.module';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { of } from 'rxjs';

describe('SearchInputControlComponent', () => {
  let fixture: ComponentFixture<SearchInputControlComponent>;
  let component: SearchInputControlComponent;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule, SearchInputControlComponent],
      schemas: [NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(SearchInputControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should emit submit event if form is valid', () => {
    component.searchTerm = 'valid';
    spyOn(component.submit, 'emit');

    component.searchSubmit();

    expect(component.submit.emit).toHaveBeenCalledWith('valid');
  });

  it('should not emit submit event if form is invalid', () => {
    component.searchTerm = '';
    spyOn(component.submit, 'emit');

    component.searchSubmit();

    expect(component.submit.emit).not.toHaveBeenCalled();
  });

  it('should emit searchChange event on inputChange', () => {
    let emittedSearchTerm = '';
    component.searchChange.subscribe((searchTerm) => (emittedSearchTerm = searchTerm));
    component.searchTerm = 'mock-search-term';
    expect(emittedSearchTerm).toBe('mock-search-term');
  });

  it('should emit searchChange event on clear', () => {
    let emittedSearchTerm: string = null;
    component.searchChange.subscribe((searchTerm) => (emittedSearchTerm = searchTerm));
    component.clear();
    expect(emittedSearchTerm).toBe('');
  });

  it('should clear searchTerm', () => {
    component.searchTerm = 'c';
    fixture.detectChanges();
    component.clear();
    expect(component.searchTerm).toBe('');
  });

  it('should check if searchTerm has a length less than 2', () => {
    component.searchTerm = 'd';
    fixture.detectChanges();
    expect(component.isTermTooShort()).toBe(true);
    component.searchTerm = 'dd';
    fixture.detectChanges();
    expect(component.isTermTooShort()).toBe(false);
  });

  describe('ngOnInit', () => {
    let route: ActivatedRoute;
    let router: Router;

    beforeEach(() => {
      route = TestBed.inject(ActivatedRoute);
      router = TestBed.inject(Router);
      spyOnProperty(router, 'events').and.returnValue(of(new NavigationStart(1, '')));
    });

    it('should set * as value when url params has q parameter and input is empty', fakeAsync(() => {
      spyOn(component.searchFieldFormControl, 'setValue');
      route.queryParams = of({ q: 'someQueryParams' });

      component.ngOnInit();
      tick();
      expect(component.searchFieldFormControl.setValue).toHaveBeenCalledWith('*');
    }));

    it('should not set * as value when url params has missing q parameter and input is empty', fakeAsync(() => {
      spyOn(component.searchFieldFormControl, 'setValue');
      route.queryParams = of({ otherQueryParam: 'someQueryParams' });

      component.ngOnInit();
      tick();
      expect(component.searchFieldFormControl.setValue).not.toHaveBeenCalled();
    }));

    it('should not set * as value when url params has q parameter and input is not empty', fakeAsync(() => {
      component.searchFieldFormControl.setValue('some value');
      spyOn(component.searchFieldFormControl, 'setValue');
      route.queryParams = of({ q: 'someQueryParams' });

      component.ngOnInit();
      tick();
      expect(component.searchFieldFormControl.setValue).not.toHaveBeenCalled();
    }));
  });
});
