/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2017 Alfresco Software Limited
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
import { Observable } from 'rxjs/Rx';

import { TranslationService, NodesApiService, NotificationService } from '@alfresco/adf-core';
import { MinimalNodeEntity } from 'alfresco-js-api';
import { NodeActionsService } from '../services/node-actions.service';
import { ContentManagementService } from '../services/content-management.service';

@Directive({
    selector: '[app-copy-node]'
})
export class NodeCopyDirective {

    @Input('app-copy-node')
    selection: MinimalNodeEntity[];

    @HostListener('click')
    onClick() {
        this.copySelected();
    }

    constructor(
        private content: ContentManagementService,
        private notification: NotificationService,
        private nodeActionsService: NodeActionsService,
        private nodesApi: NodesApiService,
        private translation: TranslationService
    ) {}

    copySelected() {
        Observable.zip(
            this.nodeActionsService.copyNodes(this.selection),
            this.nodeActionsService.contentCopied
        ).subscribe(
            (result) => {
                const [ operationResult, newItems ] = result;
                this.toastMessage(operationResult, newItems);
            },
            (error) => {
                this.toastMessage(error);
            }
        );
    }

    private toastMessage(info: any, newItems?: MinimalNodeEntity[]) {
        const numberOfCopiedItems = newItems ? newItems.length : 0;
        const failedItems = this.selection.length - numberOfCopiedItems;

        let i18nMessageString = 'APP.MESSAGES.ERRORS.GENERIC';

        if (typeof info === 'string') {
            if (info.toLowerCase().indexOf('succes') !== -1) {
                let i18MessageSuffix;

                if (failedItems) {
                    if (numberOfCopiedItems) {
                        i18MessageSuffix = ( numberOfCopiedItems === 1 ) ? 'PARTIAL_SINGULAR' : 'PARTIAL_PLURAL';

                    } else {
                        i18MessageSuffix = ( failedItems === 1 ) ? 'FAIL_SINGULAR' : 'FAIL_PLURAL';
                    }

                } else {
                    i18MessageSuffix = ( numberOfCopiedItems === 1 ) ? 'SINGULAR' : 'PLURAL';
                }

                i18nMessageString = `APP.MESSAGES.INFO.NODE_COPY.${i18MessageSuffix}`;
            }

        } else {
            try {

                const { error: { statusCode } } = JSON.parse(info.message);

                if (statusCode === 403) {
                    i18nMessageString = 'APP.MESSAGES.ERRORS.PERMISSION';
                }

            } catch (err) { /* Do nothing, keep the original message */ }
        }

        const undo = (numberOfCopiedItems > 0) ? this.translation.translate.instant('APP.ACTIONS.UNDO') : '';
        const withUndo = (numberOfCopiedItems > 0) ? '_WITH_UNDO' : '';

        this.translation.get(i18nMessageString, { success: numberOfCopiedItems, failed: failedItems }).subscribe(message => {
            this.notification.openSnackMessageAction(message, undo, NodeActionsService[`SNACK_MESSAGE_DURATION${withUndo}`])
                .onAction()
                .subscribe(() => this.deleteCopy(newItems));
        });
    }

    private deleteCopy(nodes: MinimalNodeEntity[]) {
        const batch = this.nodeActionsService.flatten(nodes)
            .filter(item => item.entry)
            .map(item => this.nodesApi.deleteNode(item.entry.id, { permanent: true }));

        Observable.forkJoin(...batch)
            .subscribe(
                () => {
                    this.content.deleteNode.next(null);
                },
                (error) => {
                    let i18nMessageString = 'APP.MESSAGES.ERRORS.GENERIC';

                    let errorJson = null;
                    try {
                        errorJson = JSON.parse(error.message);
                    } catch (e) { //
                    }

                    if (errorJson && errorJson.error && errorJson.error.statusCode === 403) {
                        i18nMessageString = 'APP.MESSAGES.ERRORS.PERMISSION';
                    }

                    this.translation.get(i18nMessageString).subscribe(message => {
                        this.notification.openSnackMessageAction(message, '', NodeActionsService.SNACK_MESSAGE_DURATION);
                    });
                }
            );
    }
}
