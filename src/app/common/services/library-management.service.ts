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

import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { LibraryDialogComponent } from '../../dialogs/library/library.dialog';
import { SnackbarErrorAction } from '../../store/actions';
import { Store } from '@ngrx/store';
import { AppStore } from '../../store/states';
import { ContentManagementService } from './content-management.service';

@Injectable()
export class LibraryManagementService {

    constructor(
        private store: Store<AppStore>,
        private dialogRef: MatDialog,
        private contentManagementService: ContentManagementService,
    ) {}

    createLibrary() {
        const dialogInstance =  this.dialogRef.open(LibraryDialogComponent, {
            width: '400px'
        });

        dialogInstance.componentInstance.error.subscribe(message => {
            this.store.dispatch(new SnackbarErrorAction(message));
        });

        dialogInstance.afterClosed().subscribe(node => {
            if (node) {
                this.contentManagementService.siteCreated.next(node);
            }
        });
    }
}
