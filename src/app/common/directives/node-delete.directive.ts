/*!
 * @license
 * Copyright 2017 Alfresco Software, Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Directive, HostListener, Input } from '@angular/core';

import { TranslationService, NodesApiService, NotificationService } from '@alfresco/adf-core';
import { MinimalNodeEntity } from 'alfresco-js-api';
import { Observable } from 'rxjs/Rx';

import { ContentManagementService } from '../services/content-management.service';

@Directive({
    selector: '[app-delete-node]'
})
export class NodeDeleteDirective {
    static RESTORE_MESSAGE_DURATION: number = 3000;
    static DELETE_MESSAGE_DURATION: number = 10000;

    @Input('app-delete-node')
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
        const batch = [];

        this.selection.forEach((node) => {
            batch.push(this.performAction('delete', node.entry));
        });

        Observable.forkJoin(...batch)
            .subscribe(
                (data) => {
                    const processedData = this.processStatus(data);

                    this.getDeleteMesssage(processedData)
                        .subscribe((message) => {
                            const withUndo = processedData.someSucceeded ? this.translation.translate.instant('APP.ACTIONS.UNDO') : '';

                            this.notification.openSnackMessageAction(message, withUndo, NodeDeleteDirective.DELETE_MESSAGE_DURATION)
                                .onAction()
                                .subscribe(() => this.restore(processedData.success));

                            if (processedData.someSucceeded) {
                                this.content.deleteNode.next(null);
                            }
                        });
                }
            );
    }

    private restore(items): void {
        const batch = [];

        items.forEach((item) => {
            batch.push(this.performAction('restore', item));
        });

        Observable.forkJoin(...batch)
            .subscribe(
                (data) => {
                    const processedData = this.processStatus(data);

                    if (processedData.failed.length) {
                        this.getRestoreMessage(processedData)
                            .subscribe((message) => {
                                this.notification.openSnackMessageAction(
                                    message, '' , NodeDeleteDirective.RESTORE_MESSAGE_DURATION
                                );
                            });
                    }

                    if (processedData.someSucceeded) {
                        this.content.restoreNode.next(null);
                    }
                }
            );
    }

    private performAction(action: string, item: any): Observable<any> {
        const { name } = item;
        // Check if there's nodeId for Shared Files
        const id = item.nodeId || item.id;

        let performedAction: any = null;

        if (action === 'delete') {
            performedAction = this.nodesApi.deleteNode(id);
        } else {
            performedAction = this.nodesApi.restoreNode(id);
        }

        return performedAction
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

    private processStatus(data): any {
        const deleteStatus = {
            success: [],
            failed: [],
            get someFailed() {
                return !!(this.failed.length);
            },
            get someSucceeded() {
                return !!(this.success.length);
            },
            get oneFailed() {
                return this.failed.length === 1;
            },
            get oneSucceeded() {
                return this.success.length === 1;
            },
            get allSucceeded() {
                return this.someSucceeded && !this.someFailed;
            },
            get allFailed() {
                return this.someFailed && !this.someSucceeded;
            }
        };

        return data.reduce(
            (acc, next) => {
                if (next.status === 1) {
                    acc.success.push(next);
                } else {
                    acc.failed.push(next);
                }

                return acc;
            },
            deleteStatus
        );
    }

    private getRestoreMessage(status): Observable<string> {
        if (status.someFailed && !status.oneFailed) {
            return this.translation.get(
                'APP.MESSAGES.ERRORS.NODE_RESTORE_PLURAL',
                { number: status.failed.length }
            );
        }

        if (status.oneFailed) {
            return this.translation.get(
                'APP.MESSAGES.ERRORS.NODE_RESTORE',
                { name: status.failed[0].name }
            );
        }
    }

    private getDeleteMesssage(status): Observable<string> {
        if (status.allFailed && !status.oneFailed) {
            return this.translation.get(
                'APP.MESSAGES.ERRORS.NODE_DELETION_PLURAL',
                { number: status.failed.length }
            );
        }

        if (status.allSucceeded && !status.oneSucceeded) {
            return this.translation.get(
                'APP.MESSAGES.INFO.NODE_DELETION.PLURAL',
                { number: status.success.length  }
            );
        }

        if (status.someFailed && status.someSucceeded && !status.oneSucceeded) {
            return this.translation.get(
                'APP.MESSAGES.INFO.NODE_DELETION.PARTIAL_PLURAL',
                {
                    success: status.success.length,
                    failed: status.failed.length
                }
            );
        }

        if (status.someFailed && status.oneSucceeded) {
            return this.translation.get(
                'APP.MESSAGES.INFO.NODE_DELETION.PARTIAL_SINGULAR',
                {
                    success: status.success.length,
                    failed: status.failed.length
                }
            );
        }

        if (status.oneFailed && !status.someSucceeded) {
            return this.translation.get(
                'APP.MESSAGES.ERRORS.NODE_DELETION',
                { name: status.failed[0].name }
            );
        }

        if (status.oneSucceeded && !status.someFailed) {
            return this.translation.get(
                'APP.MESSAGES.INFO.NODE_DELETION.SINGULAR',
                { name: status.success[0].name }
            );
        }
    }
}
