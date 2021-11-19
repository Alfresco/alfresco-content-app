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
import { AppCreateMenuModule } from '../create-menu/create-menu.module';
import { CommonModule } from '@angular/common';
import { CoreModule } from '@alfresco/adf-core';
import { RouterModule } from '@angular/router';
import { ExtensionsModule } from '@alfresco/adf-extensions';
import { CoreExtensionsModule } from '../../extensions/core.extensions.module';
import { ExpansionPanelDirective } from './directives/expansion-panel.directive';
import { MenuPanelDirective } from './directives/menu-panel.directive';
import { SidenavComponent } from './sidenav.component';
import { ActiveLinkDirective } from './directives/active-link.directive';
import { ExpandMenuComponent } from './components/expand-menu.component';
import { ButtonMenuComponent } from './components/button-menu.component';
import { ActionDirective } from './directives/action.directive';
import { MainActionModule } from '../main-action/main-action.module';

@NgModule({
  imports: [
    CommonModule,
    CoreModule.forChild(),
    CoreExtensionsModule.forChild(),
    ExtensionsModule.forChild(),
    RouterModule,
    AppCreateMenuModule,
    MainActionModule
  ],
  declarations: [
    MenuPanelDirective,
    ExpansionPanelDirective,
    ActiveLinkDirective,
    ActionDirective,
    ExpandMenuComponent,
    ButtonMenuComponent,
    SidenavComponent
  ],
  exports: [
    MenuPanelDirective,
    ExpansionPanelDirective,
    ActiveLinkDirective,
    ActionDirective,
    ExpandMenuComponent,
    ButtonMenuComponent,
    SidenavComponent
  ]
})
export class AppSidenavModule {}
