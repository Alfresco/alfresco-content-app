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

import { Action } from '@ngrx/store';

export const SEARCH_BY_TERM = 'SEARCH_BY_TERM';
export const TOGGLE_SEARCH_FILTER = 'TOGGLE_SEARCH_FILTER';
export const SHOW_SEARCH_FILTER = 'SHOW_SEARCH_FILTER';
export const HIDE_SEARCH_FILTER = 'HIDE_SEARCH_FILTER';

export class SearchByTermAction implements Action {
  readonly type = SEARCH_BY_TERM;
  constructor(public payload: string, public searchOptions?: any) {}
}

export class ToggleSearchFilterAction implements Action {
  readonly type = TOGGLE_SEARCH_FILTER;
}

export class ShowSearchFilterAction implements Action {
  readonly type = SHOW_SEARCH_FILTER;
}

export class HideSearchFilterAction implements Action {
  readonly type = HIDE_SEARCH_FILTER;
}
