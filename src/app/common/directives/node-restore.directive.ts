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
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';

import { TranslationService, AlfrescoApiService, NotificationService } from '@alfresco/adf-core';
import { MinimalNodeEntity, PathInfoEntity, DeletedNodesPaging } from 'alfresco-js-api';
import { DeletedNodeInfo } from './deleted-node-info.interface';
import { DeleteStatus } from './delete-status.interface';
import { ContentManagementService } from '../services/content-management.service';

@Directive({
    selector: '[acaRestoreNode]'
})
export class NodeRestoreDirective {
    status: DeleteStatus;

    // tslint:disable-next-line:no-input-rename
    @Input('acaRestoreNode')
    selection: MinimalNodeEntity[];

    @HostListener('click')
    onClick() {
        this.restore(this.selection);
    }

    constructor(
        private alfrescoApiService: AlfrescoApiService,
        private translation: TranslationService,
        private router: Router,
        private notification: NotificationService,
        private contentManagementService: ContentManagementService
    ) {
        this.status = this.processStatus();
    }

    private restore(selection: MinimalNodeEntity[])  {
        if (!selection.length) {
            return;
        }

        const nodesWithPath = selection.filter(node => node.entry.path);

        if (selection.length && !nodesWithPath.length) {
            this.status.fail.push(...selection);
            this.restoreNotification();
            this.refresh();
            return;
        }

        Observable.forkJoin(nodesWithPath.map((node) => this.restoreNode(node)))
            .do((restoredNodes) => {
                const status = this.processStatus(restoredNodes);

                this.status.fail.push(...status.fail);
                this.status.success.push(...status.success);
            })
            .flatMap(() => this.getDeletedNodes())
            .subscribe(
                (deletedNodesList: DeletedNodesPaging) => {
                    const { entries: nodeList } = deletedNodesList.list;
                    const { fail: restoreErrorNodes } = this.status;
                    const selectedNodes = this.diff(restoreErrorNodes, selection, false);
                    const remainingNodes = this.diff(selectedNodes, nodeList);

                    if (!remainingNodes.length) {
                        this.restoreNotification();
                        this.refresh();
                    } else {
                        this.restore(remainingNodes);
                    }
                }
            );
    }

    private getDeletedNodes(): Observable<DeletedNodesPaging> {
        return Observable.from(
            this.alfrescoApiService.nodesApi.getDeletedNodes({ include: [ 'path' ] })
        );
    }

    private restoreNode(node: MinimalNodeEntity): Observable<any> {
        const { entry } = node;

        return Observable.from(
                this.alfrescoApiService.nodesApi.restoreNode(entry.id)
            )
            .map(() => ({
                status: 1,
                entry
            }))
            .catch((error) => {
                const { statusCode } = (JSON.parse(error.message)).error;

                return Observable.of({
                    status: 0,
                    statusCode,
                    entry
                });
            });
    }

    private navigateLocation(path: PathInfoEntity): void {
        const parent = path.elements[path.elements.length - 1];

        this.router.navigate([ '/personal-files',  parent.id ]);
    }

    private diff(selection , list, fromList = true): any {
        const ids = selection.map(item => item.entry.id);

        return list.filter(item => {
            if (fromList) {
                return ids.includes(item.entry.id) ? item : null;
            } else {
                return !ids.includes(item.entry.id) ? item : null;
            }
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

    private getRestoreMessage(status: DeleteStatus): string {
        if (status.someFailed && !status.oneFailed) {
            return this.translation.instant(
                'APP.MESSAGES.ERRORS.TRASH.NODES_RESTORE.PARTIAL_PLURAL',
                {
                    number: status.fail.length
                }
            );
        }

        if (status.oneFailed && status.fail[0].statusCode) {
            if (status.fail[0].statusCode === 409) {
                return this.translation.instant(
                    'APP.MESSAGES.ERRORS.TRASH.NODES_RESTORE.NODE_EXISTS',
                    {
                        name: status.fail[0].entry.name
                    }
                );
            } else {
                return this.translation.instant(
                    'APP.MESSAGES.ERRORS.TRASH.NODES_RESTORE.GENERIC',
                    {
                        name: status.fail[0].entry.name
                    }
                );
            }
        }

        if (status.oneFailed && !status.fail[0].statusCode) {
            return this.translation.instant(
                'APP.MESSAGES.ERRORS.TRASH.NODES_RESTORE.LOCATION_MISSING',
                {
                    name: status.fail[0].entry.name
                }
            );
        }

        if (status.allSucceeded && !status.oneSucceeded) {
            return this.translation.instant('APP.MESSAGES.INFO.TRASH.NODES_RESTORE.PLURAL');
        }

        if (status.allSucceeded && status.oneSucceeded) {
            return this.translation.instant(
                'APP.MESSAGES.INFO.TRASH.NODES_RESTORE.SINGULAR',
                {
                    name: status.success[0].entry.name
                }
            );
        }
    }

    restoreNotification(): void {
        const status = Object.assign({}, this.status);
        const action = (status.oneSucceeded && !status.someFailed) ? this.translation.translate.instant('APP.ACTIONS.VIEW') : '';
        const message = this.getRestoreMessage(this.status);

        this.notification.openSnackMessageAction(message, action, 3000)
            .onAction()
            .subscribe(() => this.navigateLocation(status.success[0].entry.path));
    }

    private refresh(): void {
        this.contentManagementService.nodesRestored.next();
    }
}
