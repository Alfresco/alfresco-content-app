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
import { TranslationService } from '@alfresco/adf-core';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';
import { SnackbarActionTypes } from '../actions/snackbar.actions';
var SnackbarEffects = /** @class */ (function() {
  function SnackbarEffects(store, actions$, snackBar, translationService) {
    var _this = this;
    this.store = store;
    this.actions$ = actions$;
    this.snackBar = snackBar;
    this.translationService = translationService;
    this.infoEffect = this.actions$.pipe(
      ofType(SnackbarActionTypes.Info),
      map(function(action) {
        _this.showSnackBar(action, 'info-snackbar');
      })
    );
    this.warningEffect = this.actions$.pipe(
      ofType(SnackbarActionTypes.Warning),
      map(function(action) {
        _this.showSnackBar(action, 'warning-snackbar');
      })
    );
    this.errorEffect = this.actions$.pipe(
      ofType(SnackbarActionTypes.Error),
      map(function(action) {
        _this.showSnackBar(action, 'error-snackbar');
      })
    );
  }
  SnackbarEffects.prototype.showSnackBar = function(action, panelClass) {
    var _this = this;
    var message = this.translate(action.payload, action.params);
    var actionName = null;
    if (action.userAction) {
      actionName = this.translate(action.userAction.title);
    }
    var snackBarRef = this.snackBar.open(message, actionName, {
      duration: action.duration || 4000,
      panelClass: panelClass
    });
    if (action.userAction) {
      snackBarRef.onAction().subscribe(function() {
        _this.store.dispatch(action.userAction.action);
      });
    }
  };
  SnackbarEffects.prototype.translate = function(message, params) {
    return this.translationService.instant(message, params);
  };
  tslib_1.__decorate(
    [Effect({ dispatch: false }), tslib_1.__metadata('design:type', Object)],
    SnackbarEffects.prototype,
    'infoEffect',
    void 0
  );
  tslib_1.__decorate(
    [Effect({ dispatch: false }), tslib_1.__metadata('design:type', Object)],
    SnackbarEffects.prototype,
    'warningEffect',
    void 0
  );
  tslib_1.__decorate(
    [Effect({ dispatch: false }), tslib_1.__metadata('design:type', Object)],
    SnackbarEffects.prototype,
    'errorEffect',
    void 0
  );
  SnackbarEffects = tslib_1.__decorate(
    [
      Injectable(),
      tslib_1.__metadata('design:paramtypes', [
        Store,
        Actions,
        MatSnackBar,
        TranslationService
      ])
    ],
    SnackbarEffects
  );
  return SnackbarEffects;
})();
export { SnackbarEffects };
//# sourceMappingURL=snackbar.effects.js.map
