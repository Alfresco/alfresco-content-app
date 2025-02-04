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

import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { SearchAiActionTypes, SearchByTermAiAction, ToggleAISearchInput } from '@alfresco/aca-shared/store';
import { map } from 'rxjs/operators';
import { SearchAiNavigationService } from '../../services/search-ai-navigation.service';
import { SearchAiService } from '@alfresco/adf-content-services';
import { Params } from '@angular/router';

@Injectable()
export class SearchAiEffects {
  private actions$ = inject(Actions);
  private searchNavigationService = inject(SearchAiNavigationService);
  private searchAiService = inject(SearchAiService);
  searchByTerm$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType<SearchByTermAiAction>(SearchAiActionTypes.SearchByTermAi),
        map((action) => {
          const queryParams: Params = {
            query: encodeURIComponent(action.payload.searchTerm),
            agentId: action.payload.agentId
          };
          this.searchNavigationService.navigateToSearchAi(queryParams);
        })
      ),
    { dispatch: false }
  );

  toggleAISearchInput$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType<ToggleAISearchInput>(SearchAiActionTypes.ToggleAiSearchInput),
        map((action) =>
          this.searchAiService.updateSearchAiInputState({
            active: true,
            selectedAgentId: action.agentId,
            searchTerm: action.searchTerm
          })
        )
      ),
    { dispatch: false }
  );
}
