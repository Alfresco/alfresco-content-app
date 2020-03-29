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
import { ContentManagementService } from '../../../services/content-management.service';
import { ToggleJoinLibraryButtonComponent } from './toggle-join-library-button.component';
var ToggleJoinLibraryMenuComponent = /** @class */ (function(_super) {
  tslib_1.__extends(ToggleJoinLibraryMenuComponent, _super);
  function ToggleJoinLibraryMenuComponent(store, content) {
    return _super.call(this, store, content) || this;
  }
  ToggleJoinLibraryMenuComponent = tslib_1.__decorate(
    [
      Component({
        selector: 'app-toggle-join-library-menu',
        template:
          '\n    <button\n      mat-menu-item\n      #membership="libraryMembership"\n      (toggle)="onToggleEvent($event)"\n      (error)="onErrorEvent($event)"\n      [acaLibraryMembership]="(selection$ | async).library"\n      [attr.title]="\n        (membership.isJoinRequested | async)\n          ? (\'APP.ACTIONS.CANCEL_JOIN\' | translate)\n          : (\'APP.ACTIONS.JOIN\' | translate)\n      "\n    >\n      <mat-icon *ngIf="membership.isJoinRequested | async">cancel</mat-icon>\n      <mat-icon\n        *ngIf="!(membership.isJoinRequested | async)"\n        svgIcon="adf:join_library"\n      ></mat-icon>\n      <span>{{\n        (membership.isJoinRequested | async)\n          ? (\'APP.ACTIONS.CANCEL_JOIN\' | translate)\n          : (\'APP.ACTIONS.JOIN\' | translate)\n      }}</span>\n    </button>\n  ',
        encapsulation: ViewEncapsulation.None,
        host: { class: 'app-toggle-join-library' }
      }),
      tslib_1.__metadata('design:paramtypes', [Store, ContentManagementService])
    ],
    ToggleJoinLibraryMenuComponent
  );
  return ToggleJoinLibraryMenuComponent;
})(ToggleJoinLibraryButtonComponent);
export { ToggleJoinLibraryMenuComponent };
//# sourceMappingURL=toggle-join-library-menu.component.js.map
