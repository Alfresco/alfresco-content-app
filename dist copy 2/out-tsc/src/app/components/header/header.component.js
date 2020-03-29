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
  Component,
  ViewEncapsulation,
  Output,
  EventEmitter,
  Input
} from '@angular/core';
import { Store } from '@ngrx/store';
import { AppExtensionService } from '../../extensions/extension.service';
import {
  getHeaderColor,
  getAppName,
  getLogoPath
} from '@alfresco/aca-shared/store';
var AppHeaderComponent = /** @class */ (function() {
  function AppHeaderComponent(store, appExtensions) {
    this.appExtensions = appExtensions;
    this.toggleClicked = new EventEmitter();
    this.expandedSidenav = true;
    this.actions = [];
    this.headerColor$ = store.select(getHeaderColor);
    this.appName$ = store.select(getAppName);
    this.logo$ = store.select(getLogoPath);
  }
  AppHeaderComponent.prototype.ngOnInit = function() {
    this.actions = this.appExtensions.getHeaderActions();
  };
  AppHeaderComponent.prototype.trackByActionId = function(_, action) {
    return action.id;
  };
  tslib_1.__decorate(
    [Output(), tslib_1.__metadata('design:type', Object)],
    AppHeaderComponent.prototype,
    'toggleClicked',
    void 0
  );
  tslib_1.__decorate(
    [Input(), tslib_1.__metadata('design:type', Object)],
    AppHeaderComponent.prototype,
    'expandedSidenav',
    void 0
  );
  AppHeaderComponent = tslib_1.__decorate(
    [
      Component({
        selector: 'app-header',
        templateUrl: 'header.component.html',
        styleUrls: ['header.component.scss'],
        encapsulation: ViewEncapsulation.None,
        host: { class: 'app-header' }
      }),
      tslib_1.__metadata('design:paramtypes', [Store, AppExtensionService])
    ],
    AppHeaderComponent
  );
  return AppHeaderComponent;
})();
export { AppHeaderComponent };
//# sourceMappingURL=header.component.js.map
