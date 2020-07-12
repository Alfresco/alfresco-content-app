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
import { CommonModule } from '@angular/common';
import { ToolbarMenuItemComponent } from './toolbar-menu-item/toolbar-menu-item.component';
import { ToolbarMenuComponent } from './toolbar-menu/toolbar-menu.component';
import { ToolbarActionComponent } from './toolbar-action/toolbar-action.component';
import { ToolbarButtonComponent } from './toolbar-button/toolbar-button.component';
import { CoreModule } from '@alfresco/adf-core';
import { ExtensionsModule } from '@alfresco/adf-extensions';

@NgModule({
  imports: [CommonModule, CoreModule, ExtensionsModule],
  declarations: [ToolbarButtonComponent, ToolbarActionComponent, ToolbarMenuItemComponent, ToolbarMenuComponent],
  exports: [ToolbarButtonComponent, ToolbarActionComponent, ToolbarMenuItemComponent, ToolbarMenuComponent]
})
export class SharedToolbarModule {}
