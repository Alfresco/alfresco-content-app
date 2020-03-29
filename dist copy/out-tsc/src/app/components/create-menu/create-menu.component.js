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
import { Component, Input, ViewEncapsulation } from '@angular/core';
import { getCurrentFolder } from '@alfresco/aca-shared/store';
import { AppExtensionService } from '../../extensions/extension.service';
import { Store } from '@ngrx/store';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
var CreateMenuComponent = /** @class */ (function() {
  function CreateMenuComponent(store, extensions) {
    this.store = store;
    this.extensions = extensions;
    this.createActions = [];
    this.onDestroy$ = new Subject();
  }
  CreateMenuComponent.prototype.ngOnInit = function() {
    var _this = this;
    this.store
      .select(getCurrentFolder)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(function() {
        _this.createActions = _this.extensions.getCreateActions();
      });
  };
  CreateMenuComponent.prototype.ngOnDestroy = function() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  };
  CreateMenuComponent.prototype.trackById = function(_, obj) {
    return obj.id;
  };
  tslib_1.__decorate(
    [Input(), tslib_1.__metadata('design:type', Boolean)],
    CreateMenuComponent.prototype,
    'showLabel',
    void 0
  );
  tslib_1.__decorate(
    [Input(), tslib_1.__metadata('design:type', Boolean)],
    CreateMenuComponent.prototype,
    'expanded',
    void 0
  );
  CreateMenuComponent = tslib_1.__decorate(
    [
      Component({
        selector: 'app-create-menu',
        templateUrl: 'create-menu.component.html',
        styleUrls: ['./create-menu.component.scss'],
        encapsulation: ViewEncapsulation.None,
        host: { class: 'app-create-menu' }
      }),
      tslib_1.__metadata('design:paramtypes', [Store, AppExtensionService])
    ],
    CreateMenuComponent
  );
  return CreateMenuComponent;
})();
export { CreateMenuComponent };
//# sourceMappingURL=create-menu.component.js.map
