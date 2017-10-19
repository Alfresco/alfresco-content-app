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

import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { TranslationService, AlfrescoApiService, NotificationService } from 'ng2-alfresco-core';
import { MinimalNodeEntity, DeletedNodeEntry, PathInfoEntity } from 'alfresco-js-api';

@Directive({
    selector: '[app-permanent-delete-node]'
})
export class NodePermanentDeleteDirective {

    @Input('app-permanent-delete-node')
    selection: MinimalNodeEntity[];

    @HostListener('click')
    onClick() {
        this.purge();
    }

    constructor(
        private alfrescoApiService: AlfrescoApiService,
        private translation: TranslationService,
        private notification: NotificationService,
        private el: ElementRef
    ) {}

    private purge()  {
        if (!this.selection.length) {
            return;
        }

        const batch = this.getPurgedNodesBatch(this.selection);

        Observable.forkJoin(batch)
            .subscribe(
                (purgedNodes) => {
                    const status = this.processStatus(purgedNodes);

                    this.purgeNotification(status);

                    if (status.success.length) {
                        this.emitDone();
                    }

                    this.selection = [];
                    status.reset();
                }
            );
    }

    private getPurgedNodesBatch(selection): Observable<MinimalNodeEntity[]> {
        return selection.map((node: MinimalNodeEntity) => this.purgeDeletedNode(node));
    }

    private purgeDeletedNode(node): Observable<any> {
        const { id, name } = node.entry;
        const promise = this.alfrescoApiService.getInstance().nodes.purgeDeletedNode(id);

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

    private purgeNotification(status): void {
        this.getPurgeMessage(status)
            .subscribe((message) => {
                this.notification.openSnackMessage(message, 3000);
            });
    }

    private getPurgeMessage(status): Observable<string|any> {
        if (status.oneSucceeded && status.someFailed && !status.oneFailed) {
            return this.translation.get(
                'APP.MESSAGES.INFO.TRASH.NODES_PURGE.PARTIAL_SINGULAR',
                {
                    name: status.success[0].name,
                    failed: status.fail.length
                }
            );
        }

        if (status.someSucceeded && !status.oneSucceeded && status.someFailed) {
            return this.translation.get(
                'APP.MESSAGES.INFO.TRASH.NODES_PURGE.PARTIAL_PLURAL',
                {
                    number: status.success.length,
                    failed: status.fail.length
                }
            );
        }

        if (status.oneSucceeded) {
            return this.translation.get(
                'APP.MESSAGES.INFO.TRASH.NODES_PURGE.SINGULAR',
                { name: status.success[0].name }
            );
        }

        if (status.oneFailed) {
            return this.translation.get(
                'APP.MESSAGES.ERRORS.TRASH.NODES_PURGE.SINGULAR',
                { name: status.fail[0].name }
            );
        }

        if (status.allSucceeded) {
            return this.translation.get(
                'APP.MESSAGES.INFO.TRASH.NODES_PURGE.PLURAL',
                { number: status.success.length }
            );
        }

        if (status.allFailed) {
            return this.translation.get(
                'APP.MESSAGES.ERRORS.TRASH.NODES_PURGE.PLURAL',
                { number: status.fail.length }
            );
        }
    }

    private processStatus(data = []): any {
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

    private emitDone() {
        const e = new CustomEvent('selection-node-deleted', { bubbles: true });
        this.el.nativeElement.dispatchEvent(e);
    }
}
