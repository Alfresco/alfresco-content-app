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

import { Effect, Actions, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppStore } from '../states/app.state';
import {
    SnackbarWarningAction,
    SnackbarInfoAction,
    SnackbarErrorAction,
    PurgeDeletedNodesAction,
    PURGE_DELETED_NODES,
    DeleteNodesAction,
    DELETE_NODES,
    SnackbarUserAction,
    SnackbarAction,
    UndoDeleteNodesAction,
    UNDO_DELETE_NODES,
    CreateFolderAction,
    CREATE_FOLDER
} from '../actions';
import { ContentManagementService } from '../../services/content-management.service';
import { Observable } from 'rxjs/Rx';
import { NodeInfo, DeleteStatus, DeletedNodeInfo } from '../models';
import { ContentApiService } from '../../services/content-api.service';
import { currentFolder, appSelection } from '../selectors/app.selectors';
import { EditFolderAction, EDIT_FOLDER, RestoreDeletedNodesAction, RESTORE_DELETED_NODES } from '../actions/node.actions';

@Injectable()
export class NodeEffects {
    constructor(
        private store: Store<AppStore>,
        private actions$: Actions,
        private contentManagementService: ContentManagementService,
        private contentApi: ContentApiService
    ) {}

    @Effect({ dispatch: false })
    purgeDeletedNodes$ = this.actions$.pipe(
        ofType<PurgeDeletedNodesAction>(PURGE_DELETED_NODES),
        map(action => {
            if (action && action.payload && action.payload.length > 0) {
                this.contentManagementService.purgeDeletedNodes(action.payload);
            } else {
                this.store
                    .select(appSelection)
                    .take(1)
                    .subscribe(selection => {
                        if (selection && selection.count > 0) {
                            this.contentManagementService.purgeDeletedNodes(selection.nodes);
                        }
                    });
            }
        })
    );

    @Effect({ dispatch: false })
    restoreDeletedNodes$ = this.actions$.pipe(
        ofType<RestoreDeletedNodesAction>(RESTORE_DELETED_NODES),
        map(action => {
            if (action && action.payload && action.payload.length > 0) {
                this.contentManagementService.restoreDeletedNodes(action.payload);
            } else {
                this.store
                    .select(appSelection)
                    .take(1)
                    .subscribe(selection => {
                        if (selection && selection.count > 0) {
                            this.contentManagementService.restoreDeletedNodes(selection.nodes);
                        }
                    });
            }
        })
    );

    @Effect({ dispatch: false })
    deleteNodes$ = this.actions$.pipe(
        ofType<DeleteNodesAction>(DELETE_NODES),
        map(action => {
            if (action.payload.length > 0) {
                this.deleteNodes(action.payload);
            }
        })
    );

    @Effect({ dispatch: false })
    undoDeleteNodes$ = this.actions$.pipe(
        ofType<UndoDeleteNodesAction>(UNDO_DELETE_NODES),
        map(action => {
            if (action.payload.length > 0) {
                this.undoDeleteNodes(action.payload);
            }
        })
    );

    @Effect({ dispatch: false })
    createFolder$ = this.actions$.pipe(
        ofType<CreateFolderAction>(CREATE_FOLDER),
        map(action => {
            if (action.payload) {
                this.contentManagementService.createFolder(action.payload);
            } else {
                this.store
                    .select(currentFolder)
                    .take(1)
                    .subscribe(node => {
                        if (node && node.id) {
                            this.contentManagementService.createFolder(node.id);
                        }
                    });
            }
        })
    );

    @Effect({ dispatch: false })
    editFolder$ = this.actions$.pipe(
        ofType<EditFolderAction>(EDIT_FOLDER),
        map(action => {
            if (action.payload) {
                this.contentManagementService.editFolder(action.payload);
            } else {
                this.store
                    .select(appSelection)
                    .take(1)
                    .subscribe(selection => {
                        if (selection && selection.folder) {
                            this.contentManagementService.editFolder(selection.folder);
                        }
                    });
            }
        })
    );

    private deleteNodes(items: NodeInfo[]): void {
        const batch: Observable<DeletedNodeInfo>[] = [];

        items.forEach(node => {
            batch.push(this.deleteNode(node));
        });

        Observable.forkJoin(...batch).subscribe((data: DeletedNodeInfo[]) => {
            const status = this.processStatus(data);
            const message = this.getDeleteMessage(status);

            if (message && status.someSucceeded) {
                message.duration = 10000;
                message.userAction = new SnackbarUserAction(
                    'APP.ACTIONS.UNDO',
                    new UndoDeleteNodesAction([...status.success])
                );
            }

            this.store.dispatch(message);

            if (status.someSucceeded) {
                this.contentManagementService.nodesDeleted.next();
            }
        });
    }

    private deleteNode(node: NodeInfo): Observable<DeletedNodeInfo> {
        const { id, name } = node;

        return this.contentApi
            .deleteNode(id)
            .map(() => {
                return {
                    id,
                    name,
                    status: 1
                };
            })
            .catch((error: any) => {
                return Observable.of({
                    id,
                    name,
                    status: 0
                });
            });
    }

    private getDeleteMessage(status: DeleteStatus): SnackbarAction {
        if (status.allFailed && !status.oneFailed) {
            return new SnackbarErrorAction(
                'APP.MESSAGES.ERRORS.NODE_DELETION_PLURAL',
                { number: status.fail.length }
            );
        }

        if (status.allSucceeded && !status.oneSucceeded) {
            return new SnackbarInfoAction(
                'APP.MESSAGES.INFO.NODE_DELETION.PLURAL',
                { number: status.success.length }
            );
        }

        if (status.someFailed && status.someSucceeded && !status.oneSucceeded) {
            return new SnackbarWarningAction(
                'APP.MESSAGES.INFO.NODE_DELETION.PARTIAL_PLURAL',
                {
                    success: status.success.length,
                    failed: status.fail.length
                }
            );
        }

        if (status.someFailed && status.oneSucceeded) {
            return new SnackbarWarningAction(
                'APP.MESSAGES.INFO.NODE_DELETION.PARTIAL_SINGULAR',
                {
                    success: status.success.length,
                    failed: status.fail.length
                }
            );
        }

        if (status.oneFailed && !status.someSucceeded) {
            return new SnackbarErrorAction(
                'APP.MESSAGES.ERRORS.NODE_DELETION',
                { name: status.fail[0].name }
            );
        }

        if (status.oneSucceeded && !status.someFailed) {
            return new SnackbarInfoAction(
                'APP.MESSAGES.INFO.NODE_DELETION.SINGULAR',
                { name: status.success[0].name }
            );
        }

        return null;
    }

    private undoDeleteNodes(items: DeletedNodeInfo[]): void {
        const batch: Observable<DeletedNodeInfo>[] = [];

        items.forEach(item => {
            batch.push(this.undoDeleteNode(item));
        });

        Observable.forkJoin(...batch).subscribe(data => {
            const processedData = this.processStatus(data);

            if (processedData.fail.length) {
                const message = this.getUndoDeleteMessage(processedData);
                this.store.dispatch(message);
            }

            if (processedData.someSucceeded) {
                this.contentManagementService.nodesRestored.next();
            }
        });
    }

    private undoDeleteNode(item: DeletedNodeInfo): Observable<DeletedNodeInfo> {
        const { id, name } = item;

        return this.contentApi
            .restoreNode(id)
            .map(() => {
                return {
                    id,
                    name,
                    status: 1
                };
            })
            .catch((error: any) => {
                return Observable.of({
                    id,
                    name,
                    status: 0
                });
            });
    }

    private getUndoDeleteMessage(status: DeleteStatus): SnackbarAction {
        if (status.someFailed && !status.oneFailed) {
            return new SnackbarErrorAction(
                'APP.MESSAGES.ERRORS.NODE_RESTORE_PLURAL',
                { number: status.fail.length }
            );
        }

        if (status.oneFailed) {
            return new SnackbarErrorAction('APP.MESSAGES.ERRORS.NODE_RESTORE', {
                name: status.fail[0].name
            });
        }

        return null;
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
}
