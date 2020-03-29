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
  ChangeDetectionStrategy,
  Input,
  ChangeDetectorRef
} from '@angular/core';
var ToolbarActionComponent = /** @class */ (function() {
  function ToolbarActionComponent(cd) {
    this.cd = cd;
    this.type = 'icon-button';
    this.color = '';
  }
  // todo: review after ADF 2.6
  // preview component : change detection workaround for children without input
  ToolbarActionComponent.prototype.ngDoCheck = function() {
    if (this.actionRef.id.includes('app.viewer')) {
      this.cd.markForCheck();
    }
  };
  tslib_1.__decorate(
    [Input(), tslib_1.__metadata('design:type', Object)],
    ToolbarActionComponent.prototype,
    'type',
    void 0
  );
  tslib_1.__decorate(
    [Input(), tslib_1.__metadata('design:type', Object)],
    ToolbarActionComponent.prototype,
    'color',
    void 0
  );
  tslib_1.__decorate(
    [Input(), tslib_1.__metadata('design:type', Object)],
    ToolbarActionComponent.prototype,
    'actionRef',
    void 0
  );
  ToolbarActionComponent = tslib_1.__decorate(
    [
      Component({
        selector: 'aca-toolbar-action',
        templateUrl: './toolbar-action.component.html',
        encapsulation: ViewEncapsulation.None,
        changeDetection: ChangeDetectionStrategy.OnPush,
        host: { class: 'aca-toolbar-action' }
      }),
      tslib_1.__metadata('design:paramtypes', [ChangeDetectorRef])
    ],
    ToolbarActionComponent
  );
  return ToolbarActionComponent;
})();
export { ToolbarActionComponent };
//# sourceMappingURL=toolbar-action.component.js.map
