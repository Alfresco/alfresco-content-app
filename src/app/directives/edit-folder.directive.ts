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

import { Directive, Input, HostListener } from '@angular/core';
import { MinimalNodeEntryEntity, MinimalNodeEntity } from 'alfresco-js-api';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { FolderDialogComponent } from '@alfresco/adf-content-services';
import { Store } from '@ngrx/store';
import { AppStore } from '../store/states/app.state';
import { SnackbarErrorAction } from '../store/actions';
import { ContentManagementService } from '../common/services/content-management.service';

@Directive({
    selector: '[acaEditFolder]'
})
export class EditFolderDirective {

    /** Folder node to edit. */
    // tslint:disable-next-line:no-input-rename
    @Input('acaEditFolder')
    folder: MinimalNodeEntity;

    @HostListener('click', [ '$event' ])
    onClick(event) {
        event.preventDefault();

        if (this.folder) {
            this.openDialog();
        }
    }

    constructor(
        private store: Store<AppStore>,
        private dialogRef: MatDialog,
        private content: ContentManagementService
    ) {}

    private get dialogConfig(): MatDialogConfig {
        return {
            data: {
                folder: this.folder.entry
            },
            width: '400px'
        };
    }

    private openDialog(): void {
        const dialog = this.dialogRef.open(FolderDialogComponent, this.dialogConfig);

        dialog.componentInstance.error.subscribe(message => {
            this.store.dispatch(new SnackbarErrorAction(message));
        });

        dialog.afterClosed().subscribe((node: MinimalNodeEntryEntity) => {
            if (node) {
                this.content.folderEdited.next(node);
            }
        });
    }
}
