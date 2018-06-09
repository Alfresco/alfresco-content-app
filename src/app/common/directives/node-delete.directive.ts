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
import { TranslationService, NodesApiService, NotificationService } from '@alfresco/adf-core';
import { MinimalNodeEntity } from 'alfresco-js-api';
import { Observable } from 'rxjs/Rx';

import { DeletedNodeInfo } from './deleted-node-info.interface';
import { DeleteStatus } from './delete-status.interface';
import { ContentManagementService } from '../services/content-management.service';

@Directive({
    selector: '[acaDeleteNode]'
})
export class NodeDeleteDirective {
    static RESTORE_MESSAGE_DURATION = 3000;
    static DELETE_MESSAGE_DURATION = 10000;

    // tslint:disable-next-line:no-input-rename
    @Input('acaDeleteNode')
    selection: MinimalNodeEntity[];

    @HostListener('click')
    onClick() {
        this.deleteSelected();
    }

    constructor(
        private nodesApi: NodesApiService,
        private notification: NotificationService,
        private content: ContentManagementService,
        private translation: TranslationService
    ) {}

    private deleteSelected(): void {
        const batch: Observable<DeletedNodeInfo>[] = [];

        this.selection.forEach((node) => {
            batch.push(this.deleteNode(node));
        });

        Observable.forkJoin(...batch)
            .subscribe(
                (data: DeletedNodeInfo[]) => {
                    const processedData = this.processStatus(data);
                    const message = this.getDeleteMessage(processedData);
                    const withUndo = processedData.someSucceeded ? this.translation.instant('APP.ACTIONS.UNDO') : '';

                    this.notification.openSnackMessageAction(message, withUndo, NodeDeleteDirective.DELETE_MESSAGE_DURATION)
                        .onAction()
                        .subscribe(() => this.restore(processedData.success));

                    if (processedData.someSucceeded) {
                        this.content.nodeDeleted.next(null);
                    }
                }
            );
    }

    private restore(items: DeletedNodeInfo[]): void {
        const batch: Observable<DeletedNodeInfo>[] = [];

        items.forEach(item => {
            batch.push(this.restoreNode(item));
        });

        Observable.forkJoin(...batch)
            .subscribe(
                (data) => {
                    const processedData = this.processStatus(data);

                    if (processedData.fail.length) {
                        const message = this.getRestoreMessage(processedData);
                        this.notification.openSnackMessageAction(
                            message, '' , NodeDeleteDirective.RESTORE_MESSAGE_DURATION
                        );
                    }

                    if (processedData.someSucceeded) {
                        this.content.nodeRestored.next(null);
                    }
                }
            );
    }

    private deleteNode(node: MinimalNodeEntity): Observable<DeletedNodeInfo> {
        const { name } = node.entry;
        // Check if there's nodeId for Shared Files
        const id = node.entry.nodeId || node.entry.id;

        return this.nodesApi.deleteNode(id)
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

    private restoreNode(item: DeletedNodeInfo): Observable<DeletedNodeInfo> {
        const { id, name } = item;

        return this.nodesApi.restoreNode(id)
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

    private processStatus(data: DeletedNodeInfo[]): DeleteStatus {
        const deleteStatus = {
            success: [],
            fail: [],
            get someFailed(): boolean {
                return !!(this.fail.length);
            },
            get someSucceeded(): boolean {
                return !!(this.success.length);
            },
            get oneFailed(): boolean {
                return this.fail.length === 1;
            },
            get oneSucceeded(): boolean {
                return this.success.length === 1;
            },
            get allSucceeded(): boolean {
                return this.someSucceeded && !this.someFailed;
            },
            get allFailed(): boolean {
                return this.someFailed && !this.someSucceeded;
            },
            reset() {
                this.fail = [];
                this.success = [];
            }
        };

        return data.reduce(
            (acc, next) => {
                if (next.status === 1) {
                    acc.success.push(next);
                } else {
                    acc.fail.push(next);
                }

                return acc;
            },
            deleteStatus
        );
    }

    private getRestoreMessage(status: DeleteStatus): string {
        if (status.someFailed && !status.oneFailed) {
            return this.translation.instant(
                'APP.MESSAGES.ERRORS.NODE_RESTORE_PLURAL',
                { number: status.fail.length }
            );
        }

        if (status.oneFailed) {
            return this.translation.instant(
                'APP.MESSAGES.ERRORS.NODE_RESTORE',
                { name: status.fail[0].name }
            );
        }
    }

    private getDeleteMessage(status: DeleteStatus): string {
        if (status.allFailed && !status.oneFailed) {
            return this.translation.instant(
                'APP.MESSAGES.ERRORS.NODE_DELETION_PLURAL',
                { number: status.fail.length }
            );
        }

        if (status.allSucceeded && !status.oneSucceeded) {
            return this.translation.instant(
                'APP.MESSAGES.INFO.NODE_DELETION.PLURAL',
                { number: status.success.length  }
            );
        }

        if (status.someFailed && status.someSucceeded && !status.oneSucceeded) {
            return this.translation.instant(
                'APP.MESSAGES.INFO.NODE_DELETION.PARTIAL_PLURAL',
                {
                    success: status.success.length,
                    failed: status.fail.length
                }
            );
        }

        if (status.someFailed && status.oneSucceeded) {
            return this.translation.instant(
                'APP.MESSAGES.INFO.NODE_DELETION.PARTIAL_SINGULAR',
                {
                    success: status.success.length,
                    failed: status.fail.length
                }
            );
        }

        if (status.oneFailed && !status.someSucceeded) {
            return this.translation.instant(
                'APP.MESSAGES.ERRORS.NODE_DELETION',
                { name: status.fail[0].name }
            );
        }

        if (status.oneSucceeded && !status.someFailed) {
            return this.translation.instant(
                'APP.MESSAGES.INFO.NODE_DELETION.SINGULAR',
                { name: status.success[0].name }
            );
        }
    }
}
