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

import { Subject, Observable } from 'rxjs/Rx';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { FolderDialogComponent, ConfirmDialogComponent } from '@alfresco/adf-content-services';
import { LibraryDialogComponent } from '../dialogs/library/library.dialog';
import { SnackbarErrorAction, SnackbarInfoAction, SnackbarAction, SnackbarWarningAction } from '../store/actions';
import { Store } from '@ngrx/store';
import { AppStore } from '../store/states';
import {
    MinimalNodeEntity,
    MinimalNodeEntryEntity,
    Node,
    SiteEntry
} from 'alfresco-js-api';
import { NodePermissionService } from './node-permission.service';
import { NodeInfo, DeletedNodeInfo, DeleteStatus } from '../store/models';
import { ContentApiService } from './content-api.service';

@Injectable()
export class ContentManagementService {
    nodesMoved = new Subject<any>();
    nodesDeleted = new Subject<any>();
    nodesPurged = new Subject<any>();
    nodesRestored = new Subject<any>();
    folderEdited = new Subject<any>();
    folderCreated = new Subject<any>();
    libraryDeleted = new Subject<string>();
    libraryCreated = new Subject<SiteEntry>();
    linksUnshared = new Subject<any>();

    constructor(
        private store: Store<AppStore>,
        private contentApi: ContentApiService,
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

    createLibrary() {
        const dialogInstance =  this.dialogRef.open(LibraryDialogComponent, {
            width: '400px'
        });

        dialogInstance.componentInstance.error.subscribe(message => {
            this.store.dispatch(new SnackbarErrorAction(message));
        });

        dialogInstance.afterClosed().subscribe((node: SiteEntry) => {
            if (node) {
                this.libraryCreated.next(node);
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

    purgeDeletedNodes(nodes: MinimalNodeEntity[]) {
        if (!nodes || nodes.length === 0) {
            return;
        }

        const dialogRef = this.dialogRef.open(ConfirmDialogComponent, {
            data: {
                title: 'APP.DIALOGS.CONFIRM_PURGE.TITLE',
                message: 'APP.DIALOGS.CONFIRM_PURGE.MESSAGE',
                yesLabel: 'APP.DIALOGS.CONFIRM_PURGE.YES_LABEL',
                noLabel: 'APP.DIALOGS.CONFIRM_PURGE.NO_LABEL'
            },
            minWidth: '250px'
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result === true) {
                const nodesToDelete: NodeInfo[] = nodes.map(node => {
                    const { name } = node.entry;
                    const id = node.entry.nodeId || node.entry.id;

                    return {
                        id,
                        name
                    };
                });
                this.purgeNodes(nodesToDelete);
            }
        });
    }

    private purgeNodes(selection: NodeInfo[] = []) {
        if (!selection.length) {
            return;
        }

        const batch = selection.map(node => this.purgeDeletedNode(node));

        Observable.forkJoin(batch).subscribe(purgedNodes => {
            const status = this.processStatus(purgedNodes);

            if (status.success.length) {
                this.nodesPurged.next();
            }
            const message = this.getPurgeMessage(status);
            if (message) {
                this.store.dispatch(message);
            }
        });
    }

    private purgeDeletedNode(node: NodeInfo): Observable<DeletedNodeInfo> {
        const { id, name } = node;

        return this.contentApi
            .purgeDeletedNode(id)
            .map(() => ({
                status: 1,
                id,
                name
            }))
            .catch(error => {
                return Observable.of({
                    status: 0,
                    id,
                    name
                });
            });
    }

    private processStatus(data: DeletedNodeInfo[] = []): DeleteStatus {
        const status = {
            fail: [],
            success: [],
            get someFailed() {
                return !!this.fail.length;
            },
            get someSucceeded() {
                return !!this.success.length;
            },
            get oneFailed() {
                return this.fail.length === 1;
            },
            get oneSucceeded() {
                return this.success.length === 1;
            },
            get allSucceeded() {
                return this.someSucceeded && !this.someFailed;
            },
            get allFailed() {
                return this.someFailed && !this.someSucceeded;
            },
            reset() {
                this.fail = [];
                this.success = [];
            }
        };

        return data.reduce((acc, node) => {
            if (node.status) {
                acc.success.push(node);
            } else {
                acc.fail.push(node);
            }

            return acc;
        }, status);
    }

    private getPurgeMessage(status: DeleteStatus): SnackbarAction {
        if (status.oneSucceeded && status.someFailed && !status.oneFailed) {
            return new SnackbarWarningAction(
                'APP.MESSAGES.INFO.TRASH.NODES_PURGE.PARTIAL_SINGULAR',
                {
                    name: status.success[0].name,
                    failed: status.fail.length
                }
            );
        }

        if (status.someSucceeded && !status.oneSucceeded && status.someFailed) {
            return new SnackbarWarningAction(
                'APP.MESSAGES.INFO.TRASH.NODES_PURGE.PARTIAL_PLURAL',
                {
                    number: status.success.length,
                    failed: status.fail.length
                }
            );
        }

        if (status.oneSucceeded) {
            return new SnackbarInfoAction(
                'APP.MESSAGES.INFO.TRASH.NODES_PURGE.SINGULAR',
                { name: status.success[0].name }
            );
        }

        if (status.oneFailed) {
            return new SnackbarErrorAction(
                'APP.MESSAGES.ERRORS.TRASH.NODES_PURGE.SINGULAR',
                { name: status.fail[0].name }
            );
        }

        if (status.allSucceeded) {
            return new SnackbarInfoAction(
                'APP.MESSAGES.INFO.TRASH.NODES_PURGE.PLURAL',
                { number: status.success.length }
            );
        }

        if (status.allFailed) {
            return new SnackbarErrorAction(
                'APP.MESSAGES.ERRORS.TRASH.NODES_PURGE.PLURAL',
                { number: status.fail.length }
            );
        }

        return null;
    }
}
