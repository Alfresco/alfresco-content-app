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
import {
  getUserProfile,
  getLanguagePickerState
} from '@alfresco/aca-shared/store';
import { AppExtensionService } from '../../extensions/extension.service';
var CurrentUserComponent = /** @class */ (function() {
  function CurrentUserComponent(store, extensions) {
    this.store = store;
    this.extensions = extensions;
    this.actions = [];
  }
  CurrentUserComponent.prototype.ngOnInit = function() {
    this.profile$ = this.store.select(getUserProfile);
    this.languagePicker$ = this.store.select(getLanguagePickerState);
    this.actions = this.extensions.getUserActions();
  };
  CurrentUserComponent.prototype.trackByActionId = function(_, action) {
    return action.id;
  };
  CurrentUserComponent = tslib_1.__decorate(
    [
      Component({
        selector: 'aca-current-user',
        templateUrl: './current-user.component.html',
        encapsulation: ViewEncapsulation.None,
        host: { class: 'aca-current-user' }
      }),
      tslib_1.__metadata('design:paramtypes', [Store, AppExtensionService])
    ],
    CurrentUserComponent
  );
  return CurrentUserComponent;
})();
export { CurrentUserComponent };
//# sourceMappingURL=current-user.component.js.map
