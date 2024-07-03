/*!
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AppTestingModule } from '../../testing/app-testing.module';
import { SearchEffects } from './search.effects';
import { EffectsModule } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { SearchOptionIds, SearchByTermAction, SearchAction } from '@alfresco/aca-shared/store';

describe('SearchEffects', () => {
  let store: Store<any>;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule, EffectsModule.forRoot([SearchEffects])]
    });

    store = TestBed.inject(Store);
    router = TestBed.inject(Router);

    spyOn(router, 'navigateByUrl').and.stub();
  });

  describe('searchByTerm$', () => {
    it('should navigate to `search` when search options has library false', fakeAsync(() => {
      store.dispatch(new SearchByTermAction('test', []));
      tick();
      expect(router.navigateByUrl).toHaveBeenCalledWith('/search;q=test');
    }));

    it('should navigate to `search-libraries` when search options has library true', fakeAsync(() => {
      store.dispatch(
        new SearchByTermAction('test', [
          {
            id: SearchOptionIds.Libraries,
            value: true,
            key: '',
            shouldDisable: null
          }
        ])
      );

      tick();

      expect(router.navigateByUrl).toHaveBeenCalledWith('/search-libraries;q=test');
    }));

    it('should encode search string for parentheses', fakeAsync(() => {
      store.dispatch(new SearchByTermAction('(test)', []));

      tick();

      expect(router.navigateByUrl).toHaveBeenCalledWith('/search;q=%2528test%2529');
    }));

    it('should encode %', fakeAsync(() => {
      store.dispatch(new SearchByTermAction('%test%', []));

      tick();

      expect(router.navigateByUrl).toHaveBeenCalledWith('/search;q=%2525test%2525');
    }));
  });

  describe('search$', () => {
    it('should navigate to search when the toolbar search icon is clicked', fakeAsync(() => {
      const routerNavigate = spyOn(router, 'navigate');
      store.dispatch(new SearchAction());

      tick();

      expect(routerNavigate).toHaveBeenCalledWith(['/search']);
    }));
  });
});
