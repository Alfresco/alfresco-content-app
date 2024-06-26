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

import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { SearchAiActionTypes, SearchByTermAiAction } from '@alfresco/aca-shared/store';
import { map } from 'rxjs/operators';
import { SearchAiNavigationService } from '../../components/knowledge-retrieval/search-ai/search-ai-navigation.service';

@Injectable()
export class SearchAiEffects {
  constructor(private actions$: Actions, private searchNavigationService: SearchAiNavigationService) {}

  searchByTerm$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType<SearchByTermAiAction>(SearchAiActionTypes.SearchByTermAi),
        map((action) => {
          const query = action.payload.searchTerm.replace(/[(]/g, '%28').replace(/[)]/g, '%29');
          const queryParams = {
            q: encodeURIComponent(query),
            ...(action.payload.hideAiToggle && { hideAiToggle: action.payload.hideAiToggle }),
            ...(action.payload.restrictionQuery && { restrictionQuery: action.payload.restrictionQuery })
          };
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          this.searchNavigationService.navigateToSearchAi(queryParams);
        })
      ),
    { dispatch: false }
  );
}
