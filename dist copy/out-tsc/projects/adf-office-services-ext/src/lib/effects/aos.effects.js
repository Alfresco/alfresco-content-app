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
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { map } from 'rxjs/operators';
import { AOS_ACTION } from '../actions/aos.actions';
import { AosEditOnlineService } from '../aos-extension.service';
var AosEffects = /** @class */ (function() {
  function AosEffects(actions$, aosEditOnlineService) {
    var _this = this;
    this.actions$ = actions$;
    this.aosEditOnlineService = aosEditOnlineService;
    this.openOffice$ = this.actions$.pipe(
      ofType(AOS_ACTION),
      map(function(action) {
        if (action.payload) {
          _this.aosEditOnlineService.onActionEditOnlineAos(action.payload);
        }
      })
    );
  }
  tslib_1.__decorate(
    [Effect({ dispatch: false }), tslib_1.__metadata('design:type', Object)],
    AosEffects.prototype,
    'openOffice$',
    void 0
  );
  AosEffects = tslib_1.__decorate(
    [
      Injectable(),
      tslib_1.__metadata('design:paramtypes', [Actions, AosEditOnlineService])
    ],
    AosEffects
  );
  return AosEffects;
})();
export { AosEffects };
//# sourceMappingURL=aos.effects.js.map
