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
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CoreModule } from '@alfresco/adf-core';
import { ContentDirectiveModule } from '@alfresco/adf-content-services';
import { DirectivesModule } from '../../directives/directives.module';
import { AppInfoDrawerModule } from '../info-drawer/info.drawer.module';
import { CoreExtensionsModule } from '../../extensions/core.extensions.module';
import { AppToolbarModule } from '../toolbar/toolbar.module';
import { AppViewerComponent } from './viewer.component';
var routes = [
  {
    path: '',
    data: {
      title: 'APP.PREVIEW.TITLE',
      navigateMultiple: true
    },
    component: AppViewerComponent
  }
];
var AppViewerModule = /** @class */ (function() {
  function AppViewerModule() {}
  AppViewerModule = tslib_1.__decorate(
    [
      NgModule({
        imports: [
          CommonModule,
          RouterModule.forChild(routes),
          CoreModule.forChild(),
          ContentDirectiveModule,
          DirectivesModule,
          AppInfoDrawerModule,
          CoreExtensionsModule.forChild(),
          AppToolbarModule
        ],
        declarations: [AppViewerComponent],
        exports: [AppViewerComponent]
      })
    ],
    AppViewerModule
  );
  return AppViewerModule;
})();
export { AppViewerModule };
//# sourceMappingURL=viewer.module.js.map
