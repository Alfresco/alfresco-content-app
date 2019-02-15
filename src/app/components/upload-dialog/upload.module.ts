/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
import { CoreModule } from '@alfresco/adf-core';
import { AppFileUploadingDialogComponent } from './file-uploading-dialog.component';
import { AppFileUploadingListRowComponent } from './file-uploading-list-row.component';
import { AppFileUploadingListComponent } from './file-uploading-list.component';
import { UploadModule } from '@alfresco/adf-content-services';

@NgModule({
  imports: [CommonModule, CoreModule.forChild(), UploadModule],
  declarations: [
    AppFileUploadingDialogComponent,
    AppFileUploadingListRowComponent,
    AppFileUploadingListComponent
  ],
  exports: [
    AppFileUploadingDialogComponent,
    AppFileUploadingListRowComponent,
    AppFileUploadingListComponent
  ]
})
export class AppUploadingDialogModule {}
