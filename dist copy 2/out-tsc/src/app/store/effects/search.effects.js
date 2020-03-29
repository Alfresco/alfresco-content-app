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
import * as tslib_1 from 'tslib';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { SearchActionTypes, SearchOptionIds } from '@alfresco/aca-shared/store';
import { Router } from '@angular/router';
var SearchEffects = /** @class */ (function() {
  function SearchEffects(actions$, router) {
    var _this = this;
    this.actions$ = actions$;
    this.router = router;
    this.searchByTerm$ = this.actions$.pipe(
      ofType(SearchActionTypes.SearchByTerm),
      map(function(action) {
        var query = action.payload
          .replace(/[(]/g, '%28')
          .replace(/[)]/g, '%29');
        var libItem = action.searchOptions.find(function(item) {
          return item.id === SearchOptionIds.Libraries;
        });
        var librarySelected = !!libItem && libItem.value;
        if (librarySelected) {
          _this.router.navigateByUrl(
            '/search-libraries;q=' + encodeURIComponent(query)
          );
        } else {
          _this.router.navigateByUrl('/search;q=' + encodeURIComponent(query));
        }
      })
    );
  }
  tslib_1.__decorate(
    [Effect({ dispatch: false }), tslib_1.__metadata('design:type', Object)],
    SearchEffects.prototype,
    'searchByTerm$',
    void 0
  );
  SearchEffects = tslib_1.__decorate(
    [Injectable(), tslib_1.__metadata('design:paramtypes', [Actions, Router])],
    SearchEffects
  );
  return SearchEffects;
})();
export { SearchEffects };
//# sourceMappingURL=search.effects.js.map
