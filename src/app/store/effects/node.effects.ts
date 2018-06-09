import { Effect, Actions, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { DeleteStatus } from '../../common/directives/delete-status.interface';
import { Store, Action } from '@ngrx/store';
import { AppStore } from '../states/app.state';
import {
    SnackbarWarningAction,
    SnackbarInfoAction,
    SnackbarErrorAction,
    PurgeDeletedNodesAction,
    PURGE_DELETED_NODES,
    NodeInfo
} from '../actions';
import { ContentManagementService } from '../../common/services/content-management.service';
import { Observable } from 'rxjs/Rx';
import { DeletedNodeInfo } from '../../common/directives/deleted-node-info.interface';
import { AlfrescoApiService } from '@alfresco/adf-core';

@Injectable()
export class NodeEffects {
    constructor(
        private store: Store<AppStore>,
        private actions$: Actions,
        private contentManagementService: ContentManagementService,
        private alfrescoApiService: AlfrescoApiService,
    ) {}

    @Effect({ dispatch: false })
    purgeDeletedNodes$ = this.actions$.pipe(
        ofType<PurgeDeletedNodesAction>(PURGE_DELETED_NODES),
        map(action => {
            this.purgeNodes(action.payload);
        })
    );

    private purgeNodes(selection: NodeInfo[] = [])  {
        if (!selection.length) {
            return;
        }

        const batch = selection.map(node => this.purgeDeletedNode(node));

        Observable.forkJoin(batch)
            .subscribe(
                purgedNodes => {
                    const status = this.processStatus(purgedNodes);

                    if (status.success.length) {
                        this.contentManagementService.nodesPurged.next();
                    }
                    const message = this.getPurgeMessage(status);
                    if (message) {
                        this.store.dispatch(message);
                    }
                }
            );
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
            .catch((error) => {
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
                return !!(this.fail.length);
            },
            get someSucceeded() {
                return !!(this.success.length);
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

        return data.reduce(
            (acc, node) => {
                if (node.status) {
                    acc.success.push(node);
                } else {
                    acc.fail.push(node);
                }

                return acc;
            },
            status
        );
    }

    private getPurgeMessage(status: DeleteStatus): Action {
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
