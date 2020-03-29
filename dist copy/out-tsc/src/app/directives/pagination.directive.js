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
import { Directive } from '@angular/core';
import {
  PaginationComponent,
  UserPreferencesService,
  AppConfigService
} from '@alfresco/adf-core';
var PaginationDirective = /** @class */ (function() {
  function PaginationDirective(pagination, preferences, config) {
    this.pagination = pagination;
    this.preferences = preferences;
    this.config = config;
    this.subscriptions = [];
  }
  PaginationDirective.prototype.ngOnInit = function() {
    var _this = this;
    this.pagination.supportedPageSizes = this.config.get(
      'pagination.supportedPageSizes'
    );
    this.subscriptions.push(
      this.pagination.changePageSize.subscribe(function(event) {
        _this.preferences.paginationSize = event.maxItems;
      })
    );
  };
  PaginationDirective.prototype.ngOnDestroy = function() {
    this.subscriptions.forEach(function(subscription) {
      return subscription.unsubscribe();
    });
    this.subscriptions = [];
  };
  PaginationDirective = tslib_1.__decorate(
    [
      Directive({
        selector: '[acaPagination]'
      }),
      tslib_1.__metadata('design:paramtypes', [
        PaginationComponent,
        UserPreferencesService,
        AppConfigService
      ])
    ],
    PaginationDirective
  );
  return PaginationDirective;
})();
export { PaginationDirective };
//# sourceMappingURL=pagination.directive.js.map
