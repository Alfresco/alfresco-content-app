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

import { Directive, HostListener, Input } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { ContentService } from '@alfresco/adf-core';
import { FolderDialogComponent } from '@alfresco/adf-content-services';
import { Store } from '@ngrx/store';
import { AppStore } from '../store/states/app.state';
import { SnackbarErrorAction } from '../store/actions';

@Directive({
    selector: '[acaCreateFolder]'
})
export class CreateFolderDirective {
    /** Parent folder where the new folder will be located after creation. */
    // tslint:disable-next-line:no-input-rename
    @Input('acaCreateFolder') parentNodeId: string;

    /** Title of folder creation dialog. */
    @Input() dialogTitle: string = null;

    /** Type of node to create. */
    @Input() nodeType = 'cm:folder';

    @HostListener('click', ['$event'])
    onClick(event: Event) {
        if (this.parentNodeId) {
            event.preventDefault();
            this.openDialog();
        }
    }

    constructor(
        private store: Store<AppStore>,
        private dialogRef: MatDialog,
        private content: ContentService
    ) {}

    private get dialogConfig(): MatDialogConfig {
        return {
            data: {
                parentNodeId: this.parentNodeId,
                createTitle: this.dialogTitle,
                nodeType: this.nodeType
            },
            width: '400px'
        };
    }

    private openDialog(): void {
        const dialogInstance = this.dialogRef.open(
            FolderDialogComponent,
            this.dialogConfig
        );

        dialogInstance.componentInstance.error.subscribe(message => {
            this.store.dispatch(new SnackbarErrorAction(message));
        });

        dialogInstance.afterClosed().subscribe(node => {
            if (node) {
                this.content.folderCreate.next(node);
            }
        });
    }
}
