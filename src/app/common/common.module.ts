/*!
 * @license
 * Copyright 2017 Alfresco Software, Ltd.
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

import { NgModule } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AdfModule } from '../adf.module';
import { MaterialModule } from './material.module';

import { FolderDialogComponent } from './dialogs/folder-dialog.component';
import { FolderEditDirective } from './directives/folder-edit.directive';
import { NodeCopyDirective } from './directives/node-copy.directive';
import { NodeDeleteDirective } from './directives/node-delete.directive';
import { NodeMoveDirective } from './directives/node-move.directive';
import { DownloadFileDirective } from './directives/node-download.directive';
import { NodeRestoreDirective } from './directives/node-restore.directive';
import { NodePermanentDeleteDirective } from './directives/node-permanent-delete.directive';
import { NodeFavoriteDirective } from './directives/node-favorite.directive';

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
        FolderDialogComponent,
        FolderEditDirective,
        NodeCopyDirective,
        NodeDeleteDirective,
        NodeMoveDirective,
        DownloadFileDirective,
        NodeRestoreDirective,
        NodePermanentDeleteDirective,
        NodeFavoriteDirective
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
    entryComponents: [
        FolderDialogComponent
    ],
    providers: providers(),
    exports: [
        ...modules(),
        ...declarations()
    ]
})
export class CommonModule {}
