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
import { map, take } from 'rxjs/operators';
import { NodeActionTypes, getAppSelection } from '@alfresco/aca-shared/store';
import { Store } from '@ngrx/store';
import { ContentManagementService } from '../../services/content-management.service';
var FavoriteEffects = /** @class */ (function() {
  function FavoriteEffects(store, actions$, content) {
    var _this = this;
    this.store = store;
    this.actions$ = actions$;
    this.content = content;
    this.addFavorite$ = this.actions$.pipe(
      ofType(NodeActionTypes.AddFavorite),
      map(function(action) {
        if (action.payload && action.payload.length > 0) {
          _this.content.addFavorite(action.payload);
        } else {
          _this.store
            .select(getAppSelection)
            .pipe(take(1))
            .subscribe(function(selection) {
              if (selection && !selection.isEmpty) {
                _this.content.addFavorite(selection.nodes);
              }
            });
        }
      })
    );
    this.removeFavorite$ = this.actions$.pipe(
      ofType(NodeActionTypes.RemoveFavorite),
      map(function(action) {
        if (action.payload && action.payload.length > 0) {
          _this.content.removeFavorite(action.payload);
        } else {
          _this.store
            .select(getAppSelection)
            .pipe(take(1))
            .subscribe(function(selection) {
              if (selection && !selection.isEmpty) {
                _this.content.removeFavorite(selection.nodes);
              }
            });
        }
      })
    );
  }
  tslib_1.__decorate(
    [Effect({ dispatch: false }), tslib_1.__metadata('design:type', Object)],
    FavoriteEffects.prototype,
    'addFavorite$',
    void 0
  );
  tslib_1.__decorate(
    [Effect({ dispatch: false }), tslib_1.__metadata('design:type', Object)],
    FavoriteEffects.prototype,
    'removeFavorite$',
    void 0
  );
  FavoriteEffects = tslib_1.__decorate(
    [
      Injectable(),
      tslib_1.__metadata('design:paramtypes', [
        Store,
        Actions,
        ContentManagementService
      ])
    ],
    FavoriteEffects
  );
  return FavoriteEffects;
})();
export { FavoriteEffects };
//# sourceMappingURL=favorite.effects.js.map
