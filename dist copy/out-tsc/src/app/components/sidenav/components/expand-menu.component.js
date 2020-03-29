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
  Input,
  ViewEncapsulation,
  ChangeDetectorRef
} from '@angular/core';
var ExpandMenuComponent = /** @class */ (function() {
  function ExpandMenuComponent(cd) {
    this.cd = cd;
  }
  ExpandMenuComponent.prototype.ngOnInit = function() {
    this.cd.detectChanges();
  };
  ExpandMenuComponent.prototype.trackById = function(index, obj) {
    return obj.id;
  };
  tslib_1.__decorate(
    [Input(), tslib_1.__metadata('design:type', Object)],
    ExpandMenuComponent.prototype,
    'item',
    void 0
  );
  ExpandMenuComponent = tslib_1.__decorate(
    [
      Component({
        selector: 'app-expand-menu',
        encapsulation: ViewEncapsulation.None,
        templateUrl: './expand-menu.component.html',
        host: { class: 'app-expand-menu' }
      }),
      tslib_1.__metadata('design:paramtypes', [ChangeDetectorRef])
    ],
    ExpandMenuComponent
  );
  return ExpandMenuComponent;
})();
export { ExpandMenuComponent };
//# sourceMappingURL=expand-menu.component.js.map
