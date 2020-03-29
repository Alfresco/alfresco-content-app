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
import { NgModule } from '@angular/core';
import { ContentApiService } from './services/content-api.service';
import { NodePermissionService } from './services/node-permission.service';
import { AppService } from './services/app.service';
import { ContextActionsModule } from './directives/contextmenu/contextmenu.module';
var SharedModule = /** @class */ (function() {
  function SharedModule() {}
  SharedModule_1 = SharedModule;
  SharedModule.forRoot = function() {
    return {
      ngModule: SharedModule_1,
      providers: [ContentApiService, NodePermissionService, AppService]
    };
  };
  var SharedModule_1;
  SharedModule = SharedModule_1 = tslib_1.__decorate(
    [
      NgModule({
        imports: [ContextActionsModule],
        exports: [ContextActionsModule]
      })
    ],
    SharedModule
  );
  return SharedModule;
})();
export { SharedModule };
//# sourceMappingURL=shared.module.js.map
