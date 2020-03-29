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
import { Component, ViewEncapsulation, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { ExtensionService } from '@alfresco/adf-extensions';
import {
  ReloadDocumentListAction,
  getAppSelection
} from '@alfresco/aca-shared/store';
import { Router } from '@angular/router';
var ToggleFavoriteComponent = /** @class */ (function() {
  function ToggleFavoriteComponent(store, extensionService, router) {
    this.store = store;
    this.extensionService = extensionService;
    this.router = router;
    this.reloadOnRoutes = [];
    this.selection$ = this.store.select(getAppSelection);
  }
  ToggleFavoriteComponent.prototype.ngOnInit = function() {
    if (this.data) {
      this.reloadOnRoutes = this.extensionService.runExpression(
        '$( ' + this.data + ' )'
      );
    }
  };
  ToggleFavoriteComponent.prototype.onToggleEvent = function() {
    if (this.reloadOnRoutes.includes(this.router.url)) {
      this.store.dispatch(new ReloadDocumentListAction());
    }
  };
  tslib_1.__decorate(
    [Input(), tslib_1.__metadata('design:type', Object)],
    ToggleFavoriteComponent.prototype,
    'data',
    void 0
  );
  ToggleFavoriteComponent = tslib_1.__decorate(
    [
      Component({
        selector: 'app-toggle-favorite',
        template:
          '\n    <button\n      mat-menu-item\n      #favorites="adfFavorite"\n      (toggle)="onToggleEvent()"\n      [adf-node-favorite]="(selection$ | async).nodes"\n    >\n      <mat-icon *ngIf="favorites.hasFavorites()">star</mat-icon>\n      <mat-icon *ngIf="!favorites.hasFavorites()">star_border</mat-icon>\n      <span>{{\n        (favorites.hasFavorites()\n          ? \'APP.ACTIONS.REMOVE_FAVORITE\'\n          : \'APP.ACTIONS.FAVORITE\') | translate\n      }}</span>\n    </button>\n  ',
        encapsulation: ViewEncapsulation.None,
        host: { class: 'app-toggle-favorite' }
      }),
      tslib_1.__metadata('design:paramtypes', [Store, ExtensionService, Router])
    ],
    ToggleFavoriteComponent
  );
  return ToggleFavoriteComponent;
})();
export { ToggleFavoriteComponent };
//# sourceMappingURL=toggle-favorite.component.js.map
