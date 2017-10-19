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

import { Directive, HostListener, ElementRef, Input } from '@angular/core';
import { MdDialog, MdDialogConfig } from '@angular/material';

import { MinimalNodeEntryEntity } from 'alfresco-js-api';

import { FolderDialogComponent } from '../dialogs/folder-dialog.component';
import { ContentManagementService } from '../services/content-management.service';

@Directive({
    selector: '[app-edit-folder]'
})
export class FolderEditDirective {
    static DIALOG_WIDTH: number = 400;

    @Input('app-edit-folder')
    folder: MinimalNodeEntryEntity;

    @HostListener('click', [ '$event' ])
    onClick(event) {
        event.preventDefault();
        this.openDialog();
    }

    constructor(
        public dialogRef: MdDialog,
        public elementRef: ElementRef,
        public content: ContentManagementService
    ) {}

    private get dialogConfig(): MdDialogConfig {
        const { DIALOG_WIDTH: width } = FolderEditDirective;
        const { folder } = this;

        return {
            data: { folder },
            width: `${width}px`
        };
    }

    private openDialog(): void {
        const { dialogRef, dialogConfig, content } = this;
        const dialogInstance = dialogRef.open(FolderDialogComponent, dialogConfig);

        dialogInstance.afterClosed().subscribe((node: MinimalNodeEntryEntity) => {
            if (node) {
                content.editFolder.next(node);
            }
        });
    }
}
