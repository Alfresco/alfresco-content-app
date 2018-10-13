/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2018 Alfresco Software Limited
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
import { GenericErrorComponent } from './generic-error/generic-error.component';
import { CoreModule } from '@alfresco/adf-core';
import { LocationLinkComponent } from './location-link/location-link.component';
import { NameColumnComponent } from './name-column/name-column.component';
import { LibraryNameColumnComponent } from './library-name-column/library-name-column.component';
import { LibraryStatusColumnComponent } from './library-status-column/library-status-column.component';
import { TrashcanNameColumnComponent } from './trashcan-name-column/trashcan-name-column.component';
import { DynamicColumnComponent } from './dynamic-column/dynamic-column.component';

@NgModule({
  imports: [CommonModule, CoreModule.forChild()],
  declarations: [
    GenericErrorComponent,
    LocationLinkComponent,
    NameColumnComponent,
    LibraryNameColumnComponent,
    LibraryStatusColumnComponent,
    TrashcanNameColumnComponent,
    DynamicColumnComponent
  ],
  exports: [
    GenericErrorComponent,
    LocationLinkComponent,
    NameColumnComponent,
    LibraryNameColumnComponent,
    LibraryStatusColumnComponent,
    TrashcanNameColumnComponent,
    DynamicColumnComponent
  ],
  entryComponents: [
    LocationLinkComponent,
    NameColumnComponent,
    LibraryNameColumnComponent,
    LibraryStatusColumnComponent,
    TrashcanNameColumnComponent
  ]
})
export class AppCommonModule {}
