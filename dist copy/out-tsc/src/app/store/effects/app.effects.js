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
import { AppActionTypes } from '@alfresco/aca-shared/store';
import { AuthenticationService } from '@alfresco/adf-core';
import { Router } from '@angular/router';
import { ContentManagementService } from '../../services/content-management.service';
var AppEffects = /** @class */ (function() {
  function AppEffects(actions$, auth, router, content) {
    var _this = this;
    this.actions$ = actions$;
    this.auth = auth;
    this.router = router;
    this.content = content;
    this.reload = this.actions$.pipe(
      ofType(AppActionTypes.ReloadDocumentList),
      map(function(action) {
        _this.content.reload.next(action);
      })
    );
    this.resetSelection = this.actions$.pipe(
      ofType(AppActionTypes.ResetSelection),
      map(function(action) {
        _this.content.reset.next(action);
      })
    );
    this.logout$ = this.actions$.pipe(
      ofType(AppActionTypes.Logout),
      map(function() {
        _this.auth.logout().subscribe(
          function() {
            return _this.redirectToLogin();
          },
          function() {
            return _this.redirectToLogin();
          }
        );
      })
    );
  }
  AppEffects.prototype.redirectToLogin = function() {
    this.router.navigate(['login']);
  };
  tslib_1.__decorate(
    [Effect({ dispatch: false }), tslib_1.__metadata('design:type', Object)],
    AppEffects.prototype,
    'reload',
    void 0
  );
  tslib_1.__decorate(
    [Effect({ dispatch: false }), tslib_1.__metadata('design:type', Object)],
    AppEffects.prototype,
    'resetSelection',
    void 0
  );
  tslib_1.__decorate(
    [Effect({ dispatch: false }), tslib_1.__metadata('design:type', Object)],
    AppEffects.prototype,
    'logout$',
    void 0
  );
  AppEffects = tslib_1.__decorate(
    [
      Injectable(),
      tslib_1.__metadata('design:paramtypes', [
        Actions,
        AuthenticationService,
        Router,
        ContentManagementService
      ])
    ],
    AppEffects
  );
  return AppEffects;
})();
export { AppEffects };
//# sourceMappingURL=app.effects.js.map
