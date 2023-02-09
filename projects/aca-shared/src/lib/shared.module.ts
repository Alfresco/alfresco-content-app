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

import { ModuleWithProviders, NgModule } from '@angular/core';
import { ContentApiService } from './services/content-api.service';
import { NodePermissionService } from './services/node-permission.service';
import { AppService } from './services/app.service';
import { ContextActionsModule } from './directives/contextmenu/contextmenu.module';
import { OpenInAppComponent } from './components/open-in-app/open-in-app.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  imports: [ContextActionsModule, MatButtonModule, MatIconModule, MatDialogModule],
  exports: [ContextActionsModule, MatButtonModule, MatIconModule, MatDialogModule],
  declarations: [OpenInAppComponent]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule,
      providers: [ContentApiService, NodePermissionService, AppService]
    };
  }
}
