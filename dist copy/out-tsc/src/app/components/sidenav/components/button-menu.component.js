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
import { OverlayContainer } from '@angular/cdk/overlay';
var ButtonMenuComponent = /** @class */ (function() {
  function ButtonMenuComponent(cd, overlayContainer) {
    this.cd = cd;
    this.overlayContainer = overlayContainer;
    this.overlayContainer.getContainerElement().classList.add('aca-menu-panel');
  }
  ButtonMenuComponent.prototype.ngOnInit = function() {
    this.cd.detectChanges();
  };
  ButtonMenuComponent.prototype.trackById = function(index, obj) {
    return obj.id;
  };
  tslib_1.__decorate(
    [Input(), tslib_1.__metadata('design:type', Object)],
    ButtonMenuComponent.prototype,
    'item',
    void 0
  );
  ButtonMenuComponent = tslib_1.__decorate(
    [
      Component({
        selector: 'app-button-menu',
        templateUrl: './button-menu.component.html',
        host: { class: 'app-button-menu' },
        encapsulation: ViewEncapsulation.None
      }),
      tslib_1.__metadata('design:paramtypes', [
        ChangeDetectorRef,
        OverlayContainer
      ])
    ],
    ButtonMenuComponent
  );
  return ButtonMenuComponent;
})();
export { ButtonMenuComponent };
//# sourceMappingURL=button-menu.component.js.map
