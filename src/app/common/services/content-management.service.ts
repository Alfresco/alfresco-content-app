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
import { AlfrescoApiService, NotificationService, TranslationService } from '@alfresco/adf-core';
import { Node } from 'alfresco-js-api';


@Injectable()
export class ContentManagementService {

    nodeDeleted = new Subject<string>();
    nodeMoved = new Subject<string>();
    nodeRestored = new Subject<string>();

    nodesPurged = new Subject<any>();
    nodesRestored = new Subject<any>();

    constructor(private api: AlfrescoApiService,
                private notification: NotificationService,
                private translation: TranslationService) {
    }

    nodeHasPermission(node: Node, permission: string): boolean {
        if (node && permission) {
            const allowableOperations = node.allowableOperations || [];

            if (allowableOperations.indexOf(permission) > -1) {
                return true;
            }
        }

        return false;
    }

    canDeleteNode(node: Node): boolean {
        return this.nodeHasPermission(node, 'delete');
    }

    canMoveNode(node: Node): boolean {
        return this.nodeHasPermission(node, 'delete');
    }

    canCopyNode(node: Node): boolean {
        return true;
    }

    async deleteNode(node: Node) {
        if (this.canDeleteNode(node)) {
            try {
                await this.api.nodesApi.deleteNode(node.id);

                this.notification
                    .openSnackMessageAction(
                        this.translation.instant('APP.MESSAGES.INFO.NODE_DELETION.SINGULAR', { name: node.name }),
                        this.translation.translate.instant('APP.ACTIONS.UNDO'),
                        10000
                    )
                    .onAction()
                    .subscribe(() => {
                        this.restoreNode(node);
                    });

                this.nodeDeleted.next(node.id);
            } catch {
                this.notification.openSnackMessage(
                    this.translation.instant('APP.MESSAGES.ERRORS.NODE_DELETION', { name: node.name }),
                    10000
                );
            }
        }
    }

    async restoreNode(node: Node) {
        if (node) {
            try {
                await this.api.nodesApi.restoreNode(node.id);
                this.nodeRestored.next(node.id);
            } catch {
                this.notification.openSnackMessage(
                    this.translation.instant('APP.MESSAGES.ERRORS.NODE_RESTORE', { name: node.name }),
                    3000
                );
            }
        }
    }
}
