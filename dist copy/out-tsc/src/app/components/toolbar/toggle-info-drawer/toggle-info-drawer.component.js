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
import { Component, ViewEncapsulation } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  ToggleInfoDrawerAction,
  isInfoDrawerOpened
} from '@alfresco/aca-shared/store';
var ToggleInfoDrawerComponent = /** @class */ (function() {
  function ToggleInfoDrawerComponent(store) {
    this.store = store;
    this.infoDrawerOpened$ = this.store.select(isInfoDrawerOpened);
  }
  ToggleInfoDrawerComponent.prototype.onClick = function() {
    this.store.dispatch(new ToggleInfoDrawerAction());
  };
  ToggleInfoDrawerComponent = tslib_1.__decorate(
    [
      Component({
        selector: 'app-toggle-info-drawer',
        template:
          '\n    <button\n      mat-icon-button\n      [color]="(infoDrawerOpened$ | async) ? \'primary\' : \'\'"\n      [attr.aria-label]="\'APP.ACTIONS.DETAILS\' | translate"\n      [attr.aria-expanded]="infoDrawerOpened$ | async"\n      [attr.title]="\'APP.ACTIONS.DETAILS\' | translate"\n      (click)="onClick()"\n    >\n      <mat-icon>info_outline</mat-icon>\n    </button>\n  ',
        encapsulation: ViewEncapsulation.None,
        host: { class: 'app-toggle-info-drawer' }
      }),
      tslib_1.__metadata('design:paramtypes', [Store])
    ],
    ToggleInfoDrawerComponent
  );
  return ToggleInfoDrawerComponent;
})();
export { ToggleInfoDrawerComponent };
//# sourceMappingURL=toggle-info-drawer.component.js.map
