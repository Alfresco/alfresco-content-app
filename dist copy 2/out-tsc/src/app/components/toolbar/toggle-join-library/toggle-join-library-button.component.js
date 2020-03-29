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
import {
  SetSelectedNodesAction,
  SnackbarErrorAction,
  SnackbarInfoAction,
  getAppSelection
} from '@alfresco/aca-shared/store';
import { Component, ViewEncapsulation } from '@angular/core';
import { Store } from '@ngrx/store';
import { ContentManagementService } from '../../../services/content-management.service';
var ToggleJoinLibraryButtonComponent = /** @class */ (function() {
  function ToggleJoinLibraryButtonComponent(store, content) {
    this.store = store;
    this.content = content;
    this.selection$ = this.store.select(getAppSelection);
  }
  ToggleJoinLibraryButtonComponent.prototype.onToggleEvent = function(event) {
    this.store.dispatch(new SnackbarInfoAction(event.i18nKey));
    if (event.shouldReload) {
      this.content.libraryJoined.next();
    } else {
      if (event.updatedEntry) {
        this.store.dispatch(
          new SetSelectedNodesAction([
            { entry: event.updatedEntry, isLibrary: true }
          ])
        );
      }
      this.content.joinLibraryToggle.next();
    }
  };
  ToggleJoinLibraryButtonComponent.prototype.onErrorEvent = function(event) {
    this.store.dispatch(new SnackbarErrorAction(event.i18nKey));
  };
  ToggleJoinLibraryButtonComponent = tslib_1.__decorate(
    [
      Component({
        selector: 'app-toggle-join-library-button',
        template:
          '\n    <button\n      mat-icon-button\n      color="primary"\n      #membership="libraryMembership"\n      (toggle)="onToggleEvent($event)"\n      (error)="onErrorEvent($event)"\n      [acaLibraryMembership]="(selection$ | async).library"\n      [attr.title]="\n        (membership.isJoinRequested | async)\n          ? (\'APP.ACTIONS.CANCEL_JOIN\' | translate)\n          : (\'APP.ACTIONS.JOIN\' | translate)\n      "\n    >\n      <mat-icon *ngIf="membership.isJoinRequested | async">cancel</mat-icon>\n      <mat-icon\n        *ngIf="!(membership.isJoinRequested | async)"\n        svgIcon="adf:join_library"\n      ></mat-icon>\n    </button>\n  ',
        encapsulation: ViewEncapsulation.None,
        host: { class: 'app-toggle-join-library' }
      }),
      tslib_1.__metadata('design:paramtypes', [Store, ContentManagementService])
    ],
    ToggleJoinLibraryButtonComponent
  );
  return ToggleJoinLibraryButtonComponent;
})();
export { ToggleJoinLibraryButtonComponent };
//# sourceMappingURL=toggle-join-library-button.component.js.map
