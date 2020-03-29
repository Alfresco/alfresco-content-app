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
import { ContextMenuActionTypes } from '@alfresco/aca-shared/store';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { map } from 'rxjs/operators';
import { ContextMenuService } from '../../components/context-menu/context-menu.service';
var ContextMenuEffects = /** @class */ (function() {
  function ContextMenuEffects(contextMenuService, actions$) {
    var _this = this;
    this.contextMenuService = contextMenuService;
    this.actions$ = actions$;
    this.overlayRef = null;
    this.contextMenu$ = this.actions$.pipe(
      ofType(ContextMenuActionTypes.ContextMenu),
      map(function(action) {
        if (_this.overlayRef) {
          _this.overlayRef.close();
        }
        _this.overlayRef = _this.contextMenuService.open({
          source: action.event,
          hasBackdrop: false,
          backdropClass: 'cdk-overlay-transparent-backdrop',
          panelClass: 'cdk-overlay-pane'
        });
      })
    );
  }
  tslib_1.__decorate(
    [Effect({ dispatch: false }), tslib_1.__metadata('design:type', Object)],
    ContextMenuEffects.prototype,
    'contextMenu$',
    void 0
  );
  ContextMenuEffects = tslib_1.__decorate(
    [
      Injectable(),
      tslib_1.__metadata('design:paramtypes', [ContextMenuService, Actions])
    ],
    ContextMenuEffects
  );
  return ContextMenuEffects;
})();
export { ContextMenuEffects };
//# sourceMappingURL=contextmenu.effects.js.map
