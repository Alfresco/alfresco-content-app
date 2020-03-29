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
  ToggleDocumentDisplayMode,
  getDocumentDisplayMode
} from '@alfresco/aca-shared/store';
var DocumentDisplayModeComponent = /** @class */ (function() {
  function DocumentDisplayModeComponent(store) {
    this.store = store;
    this.displayMode$ = store.select(getDocumentDisplayMode);
  }
  DocumentDisplayModeComponent.prototype.getTitle = function(displayMode) {
    return displayMode === 'list'
      ? 'APP.ACTIONS.LIST_MODE'
      : 'APP.ACTIONS.GALLERY_MODE';
  };
  DocumentDisplayModeComponent.prototype.onClick = function() {
    this.store.dispatch(new ToggleDocumentDisplayMode());
  };
  DocumentDisplayModeComponent = tslib_1.__decorate(
    [
      Component({
        selector: 'app-document-display-mode',
        template:
          '\n    <ng-container *ngIf="displayMode$ | async as displayMode">\n      <button\n        [attr.title]="getTitle(displayMode) | translate"\n        [attr.aria-label]="getTitle(displayMode) | translate"\n        mat-icon-button\n        color="primary"\n        (click)="onClick()"\n      >\n        <mat-icon *ngIf="displayMode === \'list\'">view_comfy</mat-icon>\n        <mat-icon *ngIf="displayMode === \'gallery\'">list</mat-icon>\n      </button>\n    </ng-container>\n  ',
        encapsulation: ViewEncapsulation.None,
        host: { class: 'app-document-display-mode' }
      }),
      tslib_1.__metadata('design:paramtypes', [Store])
    ],
    DocumentDisplayModeComponent
  );
  return DocumentDisplayModeComponent;
})();
export { DocumentDisplayModeComponent };
//# sourceMappingURL=document-display-mode.component.js.map
