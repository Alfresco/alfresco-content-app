/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2018 Alfresco Software Limited
 *
 * This file is part of the Alfresco Example Content Application.
 * If the software was purchased under a paid Alfresco license, the terms of
 * the paid license agreement will prevail.  Otherwise, the software is
 * provided under the following open source license terms:
 *
 * The Alfresco Example Content Application is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * The Alfresco Example Content Application is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with Alfresco. If not, see <http://www.gnu.org/licenses/>.
 */

import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  TestBed,
  async,
  ComponentFixture,
  fakeAsync,
  tick
} from '@angular/core/testing';

import { SearchInputComponent } from './search-input.component';
import { AppTestingModule } from '../../../testing/app-testing.module';
import { Actions, ofType } from '@ngrx/effects';
import { SEARCH_BY_TERM, SearchByTermAction } from '../../../store/actions';
import { map } from 'rxjs/operators';

describe('SearchInputComponent', () => {
  let fixture: ComponentFixture<SearchInputComponent>;
  let component: SearchInputComponent;
  let actions$: Actions;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule],
      declarations: [SearchInputComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .then(() => {
        actions$ = TestBed.get(Actions);
        fixture = TestBed.createComponent(SearchInputComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
      });
  }));

  describe('onSearchSubmit()', () => {
    it('should call search action with correct search options', fakeAsync(done => {
      const searchedTerm = 's';
      const currentSearchOptions = [{ key: 'test' }];
      actions$.pipe(
        ofType<SearchByTermAction>(SEARCH_BY_TERM),
        map(action => {
          expect(action.searchOptions[0].key).toBe(currentSearchOptions[0].key);
          done();
        })
      );
      component.onSearchSubmit(<any>{ target: { value: searchedTerm } });
      tick();
    }));

    it('should call search action with correct searched term', fakeAsync(done => {
      const searchedTerm = 's';
      actions$.pipe(
        ofType<SearchByTermAction>(SEARCH_BY_TERM),
        map(action => {
          expect(action.payload).toBe(searchedTerm);
          done();
        })
      );
      component.onSearchSubmit(<any>{ target: { value: searchedTerm } });
      tick();
    }));
  });
});
