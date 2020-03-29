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
import { AppExtensionService } from '../../extensions/extension.service';
var UserMenuItemComponent = /** @class */ (function() {
  function UserMenuItemComponent(extensions) {
    this.extensions = extensions;
  }
  UserMenuItemComponent.prototype.runAction = function() {
    if (this.hasClickAction(this.actionRef)) {
      this.extensions.runActionById(this.actionRef.actions.click);
    }
  };
  UserMenuItemComponent.prototype.hasClickAction = function(actionRef) {
    if (actionRef && actionRef.actions && actionRef.actions.click) {
      return true;
    }
    return false;
  };
  UserMenuItemComponent.prototype.trackById = function(_, obj) {
    return obj.id;
  };
  tslib_1.__decorate(
    [Input(), tslib_1.__metadata('design:type', Object)],
    UserMenuItemComponent.prototype,
    'actionRef',
    void 0
  );
  UserMenuItemComponent = tslib_1.__decorate(
    [
      Component({
        selector: 'app-user-menu-item',
        templateUrl: 'user-menu-item.component.html',
        encapsulation: ViewEncapsulation.None,
        host: { class: 'app-user-menu-item' }
      }),
      tslib_1.__metadata('design:paramtypes', [AppExtensionService])
    ],
    UserMenuItemComponent
  );
  return UserMenuItemComponent;
})();
export { UserMenuItemComponent };
//# sourceMappingURL=user-menu-item.component.js.map
