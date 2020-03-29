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
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
var TranslateServiceMock = /** @class */ (function(_super) {
  tslib_1.__extends(TranslateServiceMock, _super);
  function TranslateServiceMock() {
    return _super.call(this, null, null, null, null, null) || this;
  }
  TranslateServiceMock.prototype.get = function(
    key /*,
    interpolateParams?: Object*/
  ) {
    return of(key);
  };
  TranslateServiceMock.prototype.instant = function(
    key /*,
    interpolateParams?: Object*/
  ) {
    return key;
  };
  TranslateServiceMock = tslib_1.__decorate(
    [Injectable(), tslib_1.__metadata('design:paramtypes', [])],
    TranslateServiceMock
  );
  return TranslateServiceMock;
})(TranslateService);
export { TranslateServiceMock };
//# sourceMappingURL=translation.service.js.map
