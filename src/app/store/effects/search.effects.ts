/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2019 Alfresco Software Limited
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

import { Effect, Actions, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import {
  SearchActionTypes,
  SearchByTermAction,
  SearchOptionIds
} from '@alfresco/aca-shared/store';
import { Router } from '@angular/router';

@Injectable()
export class SearchEffects {
  constructor(private actions$: Actions, private router: Router) {}

  @Effect({ dispatch: false })
  searchByTerm$ = this.actions$.pipe(
    ofType<SearchByTermAction>(SearchActionTypes.SearchByTerm),
    map(action => {
      const query = action.payload
        .replace(/[(]/g, '%28')
        .replace(/[)]/g, '%29');

      const libItem = action.searchOptions.find(
        item => item.id === SearchOptionIds.Libraries
      );
      const librarySelected = !!libItem && libItem.value;
      if (librarySelected) {
        this.router.navigateByUrl(
          '/search-libraries;q=' + encodeURIComponent(query)
        );
      } else {
        this.router.navigateByUrl('/search;q=' + encodeURIComponent(query));
      }
    })
  );
}
