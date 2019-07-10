/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2019 Alfresco Software Limited
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
import { PageLayoutContentComponent } from './page-layout-content.component';
import { PageLayoutErrorComponent } from './page-layout-error.component';
import { PageLayoutHeaderComponent } from './page-layout-header.component';
import { PageLayoutComponent } from './page-layout.component';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [CommonModule],
  declarations: [
    PageLayoutContentComponent,
    PageLayoutErrorComponent,
    PageLayoutHeaderComponent,
    PageLayoutComponent
  ],
  exports: [
    PageLayoutContentComponent,
    PageLayoutErrorComponent,
    PageLayoutHeaderComponent,
    PageLayoutComponent
  ]
})
export class PageLayoutModule {}
