/*!
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * Alfresco Example Content Application
 *
 * This file is part of the Alfresco Example Content Application.
 * If the software was purchased under a paid Alfresco license, the terms of
 * the paid license agreement will prevail. Otherwise, the software is
 * provided under the following open source license terms:
 *
 * The Alfresco Example Content Application is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * The Alfresco Example Content Application is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * from Hyland Software. If not, see <http://www.gnu.org/licenses/>.
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from '@alfresco/adf-core';
import { ExtensionsModule } from '@alfresco/adf-extensions';
import { ToolbarButtonComponent } from '../components/toolbar/toolbar-button/toolbar-button.component';
import { ToolbarActionComponent } from '../components/toolbar/toolbar-action/toolbar-action.component';
import { ToolbarMenuItemComponent } from '../components/toolbar/toolbar-menu-item/toolbar-menu-item.component';
import { ToolbarMenuComponent } from '../components/toolbar/toolbar-menu/toolbar-menu.component';

// @deprecated
@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    ExtensionsModule,
    ToolbarButtonComponent,
    ToolbarActionComponent,
    ToolbarMenuItemComponent,
    ToolbarMenuComponent
  ],
  exports: [ToolbarButtonComponent, ToolbarActionComponent, ToolbarMenuItemComponent, ToolbarMenuComponent]
})
export class SharedToolbarModule {}
