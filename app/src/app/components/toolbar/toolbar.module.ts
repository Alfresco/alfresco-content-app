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
import { DocumentDisplayModeComponent } from './document-display-mode/document-display-mode.component';
import { ToggleFavoriteComponent } from './toggle-favorite/toggle-favorite.component';
import { ToggleInfoDrawerComponent } from './toggle-info-drawer/toggle-info-drawer.component';
import { CommonModule } from '@angular/common';
import { CoreModule } from '@alfresco/adf-core';
import { ExtensionsModule } from '@alfresco/adf-extensions';
import { ToggleJoinLibraryButtonComponent } from './toggle-join-library/toggle-join-library-button.component';
import { ToggleJoinLibraryMenuComponent } from './toggle-join-library/toggle-join-library-menu.component';
import { DirectivesModule } from '../../directives/directives.module';
import { ToggleFavoriteLibraryComponent } from './toggle-favorite-library/toggle-favorite-library.component';
import { ToggleEditOfflineComponent } from './toggle-edit-offline/toggle-edit-offline.component';
import { ViewNodeComponent } from './view-node/view-node.component';
import { AppCommonModule } from '../common/common.module';
import { SharedToolbarModule } from '@alfresco/aca-shared';

export function components() {
  return [
    DocumentDisplayModeComponent,
    ToggleFavoriteComponent,
    ToggleInfoDrawerComponent,
    ToggleJoinLibraryButtonComponent,
    ToggleJoinLibraryMenuComponent,
    ToggleFavoriteLibraryComponent,
    ToggleEditOfflineComponent,
    ViewNodeComponent
  ];
}

@NgModule({
  imports: [CommonModule, CoreModule.forChild(), AppCommonModule, ExtensionsModule, SharedToolbarModule, DirectivesModule],
  declarations: components(),
  exports: [components(), SharedToolbarModule]
})
export class AppToolbarModule {}
