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
import { getUserProfile } from '@alfresco/aca-shared/store';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppExtensionService } from '../../extensions/extension.service';
import { ContentManagementService } from '../../services/content-management.service';
import { PageComponent } from '../page.component';
var TrashcanComponent = /** @class */ (function(_super) {
  tslib_1.__extends(TrashcanComponent, _super);
  function TrashcanComponent(content, extensions, store, breakpointObserver) {
    var _this = _super.call(this, store, extensions, content) || this;
    _this.breakpointObserver = breakpointObserver;
    _this.isSmallScreen = false;
    _this.columns = [];
    _this.user$ = _this.store.select(getUserProfile);
    return _this;
  }
  TrashcanComponent.prototype.ngOnInit = function() {
    var _this = this;
    _super.prototype.ngOnInit.call(this);
    this.subscriptions.push(
      this.breakpointObserver
        .observe([Breakpoints.HandsetPortrait, Breakpoints.HandsetLandscape])
        .subscribe(function(result) {
          _this.isSmallScreen = result.matches;
        })
    );
    this.columns = this.extensions.documentListPresets.trashcan || [];
  };
  TrashcanComponent = tslib_1.__decorate(
    [
      Component({
        templateUrl: './trashcan.component.html'
      }),
      tslib_1.__metadata('design:paramtypes', [
        ContentManagementService,
        AppExtensionService,
        Store,
        BreakpointObserver
      ])
    ],
    TrashcanComponent
  );
  return TrashcanComponent;
})(PageComponent);
export { TrashcanComponent };
//# sourceMappingURL=trashcan.component.js.map
