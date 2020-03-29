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
import { AppExtensionService } from '../../../extensions/extension.service';
export var ToolbarButtonType;
(function(ToolbarButtonType) {
  ToolbarButtonType['ICON_BUTTON'] = 'icon-button';
  ToolbarButtonType['MENU_ITEM'] = 'menu-item';
})(ToolbarButtonType || (ToolbarButtonType = {}));
var ToolbarButtonComponent = /** @class */ (function() {
  function ToolbarButtonComponent(extensions) {
    this.extensions = extensions;
    this.type = ToolbarButtonType.ICON_BUTTON;
    this.color = '';
  }
  ToolbarButtonComponent.prototype.runAction = function() {
    if (this.hasClickAction(this.actionRef)) {
      this.extensions.runActionById(this.actionRef.actions.click);
    }
  };
  ToolbarButtonComponent.prototype.hasClickAction = function(actionRef) {
    if (actionRef && actionRef.actions && actionRef.actions.click) {
      return true;
    }
    return false;
  };
  tslib_1.__decorate(
    [Input(), tslib_1.__metadata('design:type', String)],
    ToolbarButtonComponent.prototype,
    'type',
    void 0
  );
  tslib_1.__decorate(
    [Input(), tslib_1.__metadata('design:type', Object)],
    ToolbarButtonComponent.prototype,
    'color',
    void 0
  );
  tslib_1.__decorate(
    [Input(), tslib_1.__metadata('design:type', Object)],
    ToolbarButtonComponent.prototype,
    'actionRef',
    void 0
  );
  ToolbarButtonComponent = tslib_1.__decorate(
    [
      Component({
        selector: 'app-toolbar-button',
        templateUrl: 'toolbar-button.component.html',
        encapsulation: ViewEncapsulation.None,
        host: { class: 'app-toolbar-button' }
      }),
      tslib_1.__metadata('design:paramtypes', [AppExtensionService])
    ],
    ToolbarButtonComponent
  );
  return ToolbarButtonComponent;
})();
export { ToolbarButtonComponent };
//# sourceMappingURL=toolbar-button.component.js.map
