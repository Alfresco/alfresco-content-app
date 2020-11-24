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

import { NgModule } from '@angular/core';
import { AboutComponent } from './about.component';
import { CommonModule } from '@angular/common';
import { CoreModule } from '@alfresco/adf-core';
import { MatTableModule } from '@angular/material/table';
import { SharedModule, PageLayoutModule } from '@alfresco/aca-shared';

import { PackageListComponent } from './package-list/package-list.component';
import { ExtensionListComponent } from './extension-list/extension-list.component';
import { StatusListComponent } from './status-list/status-list.component';
import { ModuleListComponent } from './module-list/module-list.component';
import { LicenseListComponent } from './license-list/license-list.component';
import { ExtensionService, provideExtensionConfig } from '@alfresco/adf-extensions';

@NgModule({
  imports: [CommonModule, CoreModule.forChild(), MatTableModule, SharedModule, PageLayoutModule],
  declarations: [AboutComponent, PackageListComponent, ExtensionListComponent, StatusListComponent, ModuleListComponent, LicenseListComponent],
  providers: [provideExtensionConfig(['about.plugin.json'])]
})
export class AcaAboutModule {
  constructor(extensions: ExtensionService) {
    extensions.setComponents({
      'app.about.component': AboutComponent
    });
  }
}
