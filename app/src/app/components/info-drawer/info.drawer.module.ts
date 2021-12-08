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

import { ContentMetadataModule, ContentModule, VersionManagerModule } from '@alfresco/adf-content-services';
import { CoreModule } from '@alfresco/adf-core';
import { ExtensionsModule } from '@alfresco/adf-extensions';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DirectivesModule } from '../../directives/directives.module';
import { MaterialModule } from '../../material.module';
import { CommentsTabComponent } from './comments-tab/comments-tab.component';
import { MetadataTabComponent } from './metadata-tab/metadata-tab.component';
import { LibraryMetadataTabComponent } from './library-metadata-tab/library-metadata-tab.component';
import { LibraryMetadataFormComponent } from './library-metadata-tab/library-metadata-form.component';
import { VersionsTabComponent } from './versions-tab/versions-tab.component';
import { A11yModule } from '@angular/cdk/a11y';
import { SharedInfoDrawerModule } from '@alfresco/aca-shared';

export function components() {
  return [MetadataTabComponent, CommentsTabComponent, VersionsTabComponent, LibraryMetadataTabComponent, LibraryMetadataFormComponent];
}

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    CoreModule.forChild(),
    ContentModule.forChild(),
    ExtensionsModule,
    ContentMetadataModule,
    VersionManagerModule,
    DirectivesModule,
    A11yModule,
    SharedInfoDrawerModule
  ],
  declarations: [...components()],
  exports: [...components(), SharedInfoDrawerModule]
})
export class AppInfoDrawerModule {}
