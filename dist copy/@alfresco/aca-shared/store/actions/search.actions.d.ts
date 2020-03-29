/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2020 Alfresco Software Limited
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
import { Action } from '@ngrx/store';
import { SearchOptionModel } from '../models/search-option.model';
export declare enum SearchActionTypes {
  SearchByTerm = 'SEARCH_BY_TERM',
  ToggleFilter = 'TOGGLE_SEARCH_FILTER',
  ShowFilter = 'SHOW_SEARCH_FILTER',
  HideFilter = 'HIDE_SEARCH_FILTER'
}
export declare class SearchByTermAction implements Action {
  payload: string;
  searchOptions?: SearchOptionModel[];
  readonly type = SearchActionTypes.SearchByTerm;
  constructor(payload: string, searchOptions?: SearchOptionModel[]);
}
export declare class ToggleSearchFilterAction implements Action {
  readonly type = SearchActionTypes.ToggleFilter;
}
export declare class ShowSearchFilterAction implements Action {
  readonly type = SearchActionTypes.ShowFilter;
}
export declare class HideSearchFilterAction implements Action {
  readonly type = SearchActionTypes.HideFilter;
}
