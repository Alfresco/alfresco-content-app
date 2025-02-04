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

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { SearchAction, SearchActionTypes, SearchByTermAction, SearchOptionIds } from '@alfresco/aca-shared/store';
import { SearchNavigationService } from '../../components/search/search-navigation.service';
import { SearchQueryBuilderService } from '@alfresco/adf-content-services';
import { formatSearchTerm } from '../../utils/aca-search-utils';

@Injectable()
export class SearchEffects {
  private readonly actions$ = inject(Actions);
  private readonly queryBuilder = inject(SearchQueryBuilderService);
  private readonly searchNavigationService = inject(SearchNavigationService);

  search$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType<SearchAction>(SearchActionTypes.Search),
        map(() => {
          this.searchNavigationService.navigateToSearch();
        })
      ),
    { dispatch: false }
  );

  searchByTerm$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType<SearchByTermAction>(SearchActionTypes.SearchByTerm),
        map((action) => {
          const query = formatSearchTerm(action.payload, this.queryBuilder.config['app:fields']);
          const libItem = action.searchOptions.find((item) => item.id === SearchOptionIds.Libraries);
          const librarySelected = !!libItem && libItem.value;
          this.queryBuilder.navigateToSearch(query, librarySelected ? '/search-libraries' : '/search');
        })
      ),
    { dispatch: false }
  );
}
