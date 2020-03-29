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
import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { ShareNodeAction, getAppSelection } from '@alfresco/aca-shared/store';
var ToggleSharedComponent = /** @class */ (function() {
  function ToggleSharedComponent(store) {
    this.store = store;
  }
  ToggleSharedComponent.prototype.ngOnInit = function() {
    this.selection$ = this.store.select(getAppSelection);
  };
  ToggleSharedComponent.prototype.isShared = function(selection) {
    // workaround for shared files
    if (
      selection.first &&
      selection.first.entry &&
      selection.first.entry.sharedByUser
    ) {
      return true;
    }
    return (
      selection.first &&
      selection.first.entry &&
      selection.first.entry.properties &&
      !!selection.first.entry.properties['qshare:sharedId']
    );
  };
  ToggleSharedComponent.prototype.editSharedNode = function(selection) {
    this.store.dispatch(new ShareNodeAction(selection.first));
  };
  tslib_1.__decorate(
    [Input(), tslib_1.__metadata('design:type', Object)],
    ToggleSharedComponent.prototype,
    'data',
    void 0
  );
  ToggleSharedComponent = tslib_1.__decorate(
    [
      Component({
        selector: 'app-toggle-shared',
        templateUrl: './toggle-shared.component.html'
      }),
      tslib_1.__metadata('design:paramtypes', [Store])
    ],
    ToggleSharedComponent
  );
  return ToggleSharedComponent;
})();
export { ToggleSharedComponent };
//# sourceMappingURL=toggle-shared.component.js.map
