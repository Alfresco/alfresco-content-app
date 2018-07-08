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

import { Subject } from 'rxjs/Rx';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { FolderDialogComponent } from '@alfresco/adf-content-services';
import { SnackbarErrorAction } from '../../store/actions';
import { Store } from '@ngrx/store';
import { AppStore } from '../../store/states';
import {
    MinimalNodeEntity,
    MinimalNodeEntryEntity,
    Node
} from 'alfresco-js-api';
import { NodePermissionService } from './node-permission.service';

@Injectable()
export class ContentManagementService {
    nodesMoved = new Subject<any>();
    nodesDeleted = new Subject<any>();
    nodesPurged = new Subject<any>();
    nodesRestored = new Subject<any>();
    folderEdited = new Subject<any>();
    folderCreated = new Subject<any>();
    siteDeleted = new Subject<string>();
    linksUnshared = new Subject<any>();

    constructor(
        private store: Store<AppStore>,
        private permission: NodePermissionService,
        private dialogRef: MatDialog
    ) {}

    createFolder(parentNodeId: string) {
        const dialogInstance = this.dialogRef.open(FolderDialogComponent, {
            data: {
                parentNodeId: parentNodeId,
                createTitle: undefined,
                nodeType: 'cm:folder'
            },
            width: '400px'
        });

        dialogInstance.componentInstance.error.subscribe(message => {
            this.store.dispatch(new SnackbarErrorAction(message));
        });

        dialogInstance.afterClosed().subscribe(node => {
            if (node) {
                this.folderCreated.next(node);
            }
        });
    }

    editFolder(folder: MinimalNodeEntity) {
        if (!folder) {
            return;
        }

        const dialog = this.dialogRef.open(FolderDialogComponent, {
            data: {
                folder: folder.entry
            },
            width: '400px'
        });

        dialog.componentInstance.error.subscribe(message => {
            this.store.dispatch(new SnackbarErrorAction(message));
        });

        dialog.afterClosed().subscribe((node: MinimalNodeEntryEntity) => {
            if (node) {
                this.folderEdited.next(node);
            }
        });
    }

    canDeleteNode(node: MinimalNodeEntity | Node): boolean {
        return this.permission.check(node, ['delete']);
    }

    canDeleteNodes(nodes: MinimalNodeEntity[]): boolean {
        return this.permission.check(nodes, ['delete']);
    }

    canUpdateNode(node: MinimalNodeEntity | Node): boolean {
        return this.permission.check(node, ['update']);
    }

    canUploadContent(folderNode: MinimalNodeEntity | Node): boolean {
        return this.permission.check(folderNode, ['create']);
    }

    canDeleteSharedNodes(sharedLinks: MinimalNodeEntity[]): boolean {
        return this.permission.check(sharedLinks, ['delete'], {
            target: 'allowableOperationsOnTarget'
        });
    }

    canUpdateSharedNode(sharedLink: MinimalNodeEntity): boolean {
        return this.permission.check(sharedLink, ['update'], {
            target: 'allowableOperationsOnTarget'
        });
    }
}
