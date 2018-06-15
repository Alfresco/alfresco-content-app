import { Effect, Actions, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { DeleteStatus } from '../../common/directives/delete-status.interface';
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
    UNDO_DELETE_NODES
} from '../actions';
import { ContentManagementService } from '../../common/services/content-management.service';
import { Observable } from 'rxjs/Rx';
import { DeletedNodeInfo } from '../../common/directives/deleted-node-info.interface';
import { AlfrescoApiService } from '@alfresco/adf-core';
import { NodeInfo } from '../models';

@Injectable()
export class NodeEffects {
    constructor(
        private store: Store<AppStore>,
        private actions$: Actions,
        private contentManagementService: ContentManagementService,
        private alfrescoApiService: AlfrescoApiService
    ) {}

    @Effect({ dispatch: false })
    purgeDeletedNodes$ = this.actions$.pipe(
        ofType<PurgeDeletedNodesAction>(PURGE_DELETED_NODES),
        map(action => {
            this.purgeNodes(action.payload);
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

        return Observable.fromPromise(
            this.alfrescoApiService.nodesApi.deleteNode(id)
        )
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

        return Observable.fromPromise(
            this.alfrescoApiService.nodesApi.restoreNode(id)
        )
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

    private purgeNodes(selection: NodeInfo[] = []) {
        if (!selection.length) {
            return;
        }

        const batch = selection.map(node => this.purgeDeletedNode(node));

        Observable.forkJoin(batch).subscribe(purgedNodes => {
            const status = this.processStatus(purgedNodes);

            if (status.success.length) {
                this.contentManagementService.nodesPurged.next();
            }
            const message = this.getPurgeMessage(status);
            if (message) {
                this.store.dispatch(message);
            }
        });
    }

    private purgeDeletedNode(node: NodeInfo): Observable<DeletedNodeInfo> {
        const { id, name } = node;
        const promise = this.alfrescoApiService.nodesApi.purgeDeletedNode(id);

        return Observable.from(promise)
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
