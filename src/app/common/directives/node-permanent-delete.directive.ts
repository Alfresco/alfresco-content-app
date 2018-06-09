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

import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { AlfrescoApiService } from '@alfresco/adf-core';
import { MinimalNodeEntity } from 'alfresco-js-api';
import { MatDialog } from '@angular/material';
import { ConfirmDialogComponent } from '@alfresco/adf-content-services';
import { Store, Action } from '@ngrx/store';
import { AppStore } from '../../store/states/app.state';
import { SnackbarInfoAction, SnackbarWarningAction, SnackbarErrorAction } from '../../store/actions';
import { DeleteStatus } from './delete-status.interface';
import { DeletedNodeInfo } from './deleted-node-info.interface';

@Directive({
    selector: '[acaPermanentDelete]'
})
export class NodePermanentDeleteDirective {

    // tslint:disable-next-line:no-input-rename
    @Input('acaPermanentDelete')
    selection: MinimalNodeEntity[];

    @HostListener('click')
    onClick() {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
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
                this.purge();
            }
        });
    }

    constructor(
        private store: Store<AppStore>,
        private alfrescoApiService: AlfrescoApiService,
        private el: ElementRef,
        private dialog: MatDialog
    ) {}

    private purge()  {
        if (!this.selection.length) {
            return;
        }

        const batch = this.selection.map(node => this.purgeDeletedNode(node));

        Observable.forkJoin(batch)
            .subscribe(
                (purgedNodes) => {
                    const status = this.processStatus(purgedNodes);

                    this.purgeNotification(status);

                    if (status.success.length) {
                        this.el.nativeElement.dispatchEvent(
                            new CustomEvent('selection-node-deleted', { bubbles: true })
                        );
                    }

                    this.selection = [];
                    status.reset();
                }
            );
    }

    private purgeDeletedNode(node: MinimalNodeEntity): Observable<DeletedNodeInfo> {
        const { id, name } = node.entry;
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

    private purgeNotification(status: DeleteStatus): void {
        const action = this.getPurgeMessage(status);
        if (action) {
            this.store.dispatch(action);
        }
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
}
