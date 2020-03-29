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
  DownloadNodesAction,
  EditOfflineAction,
  SnackbarErrorAction,
  getAppSelection
} from '@alfresco/aca-shared/store';
import { Component, ViewEncapsulation } from '@angular/core';
import { Store } from '@ngrx/store';
var ToggleEditOfflineComponent = /** @class */ (function() {
  function ToggleEditOfflineComponent(store) {
    this.store = store;
  }
  ToggleEditOfflineComponent.prototype.ngOnInit = function() {
    var _this = this;
    this.store.select(getAppSelection).subscribe(function(_a) {
      var file = _a.file;
      _this.selection = file;
    });
  };
  ToggleEditOfflineComponent.prototype.onToggleEvent = function(isNodeLocked) {
    if (isNodeLocked) {
      this.store.dispatch(new DownloadNodesAction([this.selection]));
    }
    this.store.dispatch(new EditOfflineAction(this.selection));
  };
  ToggleEditOfflineComponent.prototype.onLockError = function() {
    this.store.dispatch(
      new SnackbarErrorAction('APP.MESSAGES.ERRORS.LOCK_NODE', {
        fileName: this.selection.entry.name
      })
    );
  };
  ToggleEditOfflineComponent.prototype.onUnlockLockError = function() {
    this.store.dispatch(
      new SnackbarErrorAction('APP.MESSAGES.ERRORS.UNLOCK_NODE', {
        fileName: this.selection.entry.name
      })
    );
  };
  ToggleEditOfflineComponent = tslib_1.__decorate(
    [
      Component({
        selector: 'app-toggle-edit-offline',
        template:
          '\n    <button\n      #lock="lockNode"\n      mat-menu-item\n      (toggle)="onToggleEvent($event)"\n      (lockError)="onLockError()"\n      (unlockError)="onUnlockLockError()"\n      [acaLockNode]="selection"\n      [attr.title]="\n        lock.isNodeLocked()\n          ? (\'APP.ACTIONS.EDIT_OFFLINE_CANCEL\' | translate)\n          : (\'APP.ACTIONS.EDIT_OFFLINE\' | translate)\n      "\n    >\n      <ng-container *ngIf="lock.isNodeLocked()">\n        <mat-icon>cancel</mat-icon>\n        <span>{{ \'APP.ACTIONS.EDIT_OFFLINE_CANCEL\' | translate }}</span>\n      </ng-container>\n\n      <ng-container *ngIf="!lock.isNodeLocked()">\n        <mat-icon>edit</mat-icon>\n        <span>{{ \'APP.ACTIONS.EDIT_OFFLINE\' | translate }}</span>\n      </ng-container>\n    </button>\n  ',
        encapsulation: ViewEncapsulation.None,
        host: { class: 'app-toggle-edit-offline' }
      }),
      tslib_1.__metadata('design:paramtypes', [Store])
    ],
    ToggleEditOfflineComponent
  );
  return ToggleEditOfflineComponent;
})();
export { ToggleEditOfflineComponent };
//# sourceMappingURL=toggle-edit-offline.component.js.map
