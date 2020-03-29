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
export var SearchActionTypes;
(function(SearchActionTypes) {
  SearchActionTypes['SearchByTerm'] = 'SEARCH_BY_TERM';
  SearchActionTypes['ToggleFilter'] = 'TOGGLE_SEARCH_FILTER';
  SearchActionTypes['ShowFilter'] = 'SHOW_SEARCH_FILTER';
  SearchActionTypes['HideFilter'] = 'HIDE_SEARCH_FILTER';
})(SearchActionTypes || (SearchActionTypes = {}));
var SearchByTermAction = /** @class */ (function() {
  function SearchByTermAction(payload, searchOptions) {
    this.payload = payload;
    this.searchOptions = searchOptions;
    this.type = SearchActionTypes.SearchByTerm;
  }
  return SearchByTermAction;
})();
export { SearchByTermAction };
var ToggleSearchFilterAction = /** @class */ (function() {
  function ToggleSearchFilterAction() {
    this.type = SearchActionTypes.ToggleFilter;
  }
  return ToggleSearchFilterAction;
})();
export { ToggleSearchFilterAction };
var ShowSearchFilterAction = /** @class */ (function() {
  function ShowSearchFilterAction() {
    this.type = SearchActionTypes.ShowFilter;
  }
  return ShowSearchFilterAction;
})();
export { ShowSearchFilterAction };
var HideSearchFilterAction = /** @class */ (function() {
  function HideSearchFilterAction() {
    this.type = SearchActionTypes.HideFilter;
  }
  return HideSearchFilterAction;
})();
export { HideSearchFilterAction };
//# sourceMappingURL=search.actions.js.map
