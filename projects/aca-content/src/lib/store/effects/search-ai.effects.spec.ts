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

import { TestBed } from '@angular/core/testing';
import { provideEffects } from '@ngrx/effects';
import { SearchAiEffects } from './search-ai.effects';
import { Store } from '@ngrx/store';
import { AppTestingModule } from '../../testing/app-testing.module';
import { SearchAiNavigationService } from '../../services/search-ai-navigation.service';
import { AppStore, SearchByTermAiAction, ToggleAISearchInput } from '@alfresco/aca-shared/store';
import { SearchAiService } from '@alfresco/adf-content-services';

describe('SearchAiEffects', () => {
  let store: Store<AppStore>;

  const agentId = '1';
  const searchTerm = 'test';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule],
      providers: [provideEffects([SearchAiEffects])]
    });
    store = TestBed.inject(Store);
  });

  describe('searchByTerm$', () => {
    it('should call navigateToSearchAi on SearchAiNavigationService', () => {
      const searchAiNavigationService = TestBed.inject(SearchAiNavigationService);
      spyOn(searchAiNavigationService, 'navigateToSearchAi');

      store.dispatch(
        new SearchByTermAiAction({
          searchTerm,
          agentId
        })
      );
      expect(searchAiNavigationService.navigateToSearchAi).toHaveBeenCalledWith({
        query: searchTerm,
        agentId
      });
    });
  });
  describe('toggleAISearchInput$', () => {
    it('should call updateSearchAiInputState on SearchAiService', () => {
      const searchAiService = TestBed.inject(SearchAiService);
      spyOn(searchAiService, 'updateSearchAiInputState');

      store.dispatch(new ToggleAISearchInput(agentId, searchTerm));
      expect(searchAiService.updateSearchAiInputState).toHaveBeenCalledWith({
        active: true,
        selectedAgentId: agentId,
        searchTerm
      });
    });
  });
});
