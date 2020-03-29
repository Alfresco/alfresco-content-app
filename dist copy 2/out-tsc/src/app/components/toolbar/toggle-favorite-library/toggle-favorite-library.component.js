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
import { getAppSelection } from '@alfresco/aca-shared/store';
import { ContentManagementService } from '../../../services/content-management.service';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { Router } from '@angular/router';
var ToggleFavoriteLibraryComponent = /** @class */ (function() {
  function ToggleFavoriteLibraryComponent(store, content, router) {
    this.store = store;
    this.content = content;
    this.router = router;
  }
  ToggleFavoriteLibraryComponent.prototype.ngOnInit = function() {
    var isFavoriteLibraries = this.router.url.startsWith('/favorite/libraries');
    this.selection$ = this.store.select(getAppSelection).pipe(
      distinctUntilChanged(),
      map(function(selection) {
        // favorite libraries list should already be marked as favorite
        if (selection.library && isFavoriteLibraries) {
          selection.library.isFavorite = true;
          return selection;
        }
        return selection;
      })
    );
  };
  ToggleFavoriteLibraryComponent.prototype.onToggleEvent = function() {
    this.content.favoriteLibraryToggle.next();
  };
  ToggleFavoriteLibraryComponent = tslib_1.__decorate(
    [
      Component({
        selector: 'app-toggle-favorite-library',
        template:
          '\n    <button\n      mat-menu-item\n      #favoriteLibrary="favoriteLibrary"\n      (toggle)="onToggleEvent()"\n      [acaFavoriteLibrary]="(selection$ | async).library"\n      [attr.title]="\n        favoriteLibrary.isFavorite()\n          ? (\'APP.ACTIONS.REMOVE_FAVORITE\' | translate)\n          : (\'APP.ACTIONS.FAVORITE\' | translate)\n      "\n    >\n      <mat-icon *ngIf="favoriteLibrary.isFavorite()">star</mat-icon>\n      <mat-icon *ngIf="!favoriteLibrary.isFavorite()">star_border</mat-icon>\n      <span>{{\n        (favoriteLibrary.isFavorite()\n          ? \'APP.ACTIONS.REMOVE_FAVORITE\'\n          : \'APP.ACTIONS.FAVORITE\') | translate\n      }}</span>\n    </button>\n  ',
        encapsulation: ViewEncapsulation.None,
        host: { class: 'app-toggle-favorite-library' }
      }),
      tslib_1.__metadata('design:paramtypes', [
        Store,
        ContentManagementService,
        Router
      ])
    ],
    ToggleFavoriteLibraryComponent
  );
  return ToggleFavoriteLibraryComponent;
})();
export { ToggleFavoriteLibraryComponent };
//# sourceMappingURL=toggle-favorite-library.component.js.map
