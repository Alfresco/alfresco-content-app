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
import { SHELL_NAVBAR_MIN_WIDTH } from '@alfresco/adf-core/shell';
import { ContentModule } from '@alfresco/adf-content-services';
import { RouterModule } from '@angular/router';
import { AppSidenavModule } from '../sidenav/sidenav.module';
import { AppCommonModule } from '../common/common.module';
import { HttpClientModule } from '@angular/common/http';
import { PageLayoutModule } from '@alfresco/aca-shared';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    CoreModule.forChild(),
    ContentModule.forChild(),
    AppCommonModule,
    AppSidenavModule,
    HttpClientModule,
    PageLayoutModule
  ],
  exports: [PageLayoutModule],
  providers: [{ provide: SHELL_NAVBAR_MIN_WIDTH, useValue: 0 }]
})
export class AppLayoutModule {}
