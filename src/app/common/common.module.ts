/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2017 Alfresco Software Limited
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
import { DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AdfModule } from '../adf.module';
import { MaterialModule } from './material.module';

import { NodeCopyDirective } from './directives/node-copy.directive';
import { NodeDeleteDirective } from './directives/node-delete.directive';
import { NodeMoveDirective } from './directives/node-move.directive';
import { DownloadFileDirective } from './directives/node-download.directive';
import { NodeRestoreDirective } from './directives/node-restore.directive';
import { NodePermanentDeleteDirective } from './directives/node-permanent-delete.directive';

import { ContentManagementService } from './services/content-management.service';
import { BrowsingFilesService } from './services/browsing-files.service';
import { NodeActionsService } from './services/node-actions.service';

export function modules() {
    return [
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        RouterModule,
        AdfModule
    ];
}

export function declarations() {
    return [
        NodeCopyDirective,
        NodeDeleteDirective,
        NodeMoveDirective,
        DownloadFileDirective,
        NodeRestoreDirective,
        NodePermanentDeleteDirective
    ];
}

export function providers() {
    return [
        DatePipe,
        BrowsingFilesService,
        ContentManagementService,
        NodeActionsService
    ];
}

@NgModule({
    imports: modules(),
    declarations: declarations(),
    entryComponents: [],
    providers: providers(),
    exports: [
        ...modules(),
        ...declarations()
    ]
})
export class CommonModule {}
