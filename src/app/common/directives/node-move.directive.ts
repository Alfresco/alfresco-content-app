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

import { ContentManagementService } from '../services/content-management.service';
import { NodeActionsService } from '../services/node-actions.service';
import { Observable } from 'rxjs/Rx';

@Directive({
    selector: '[app-move-node]'
})

export class NodeMoveDirective {
    @Input('app-move-node')
    selection: MinimalNodeEntity[];

    @HostListener('click')
    onClick() {
        this.moveSelected();
    }

    constructor(
        private content: ContentManagementService,
        private notification: NotificationService,
        private nodeActionsService: NodeActionsService,
        private nodesApi: NodesApiService,
        private translation: TranslationService
    ) {}

    moveSelected() {
        const permissionForMove: string = 'delete';

        Observable.zip(
            this.nodeActionsService.moveNodes(this.selection, permissionForMove),
            this.nodeActionsService.contentMoved
        ).subscribe(
            (result) => {
                const [ operationResult, moveResponse ] = result;
                this.toastMessage(operationResult, moveResponse);

                this.content.moveNode.next(null);
            },
            (error) => {
                this.toastMessage(error);
            }
        );
    }

    private toastMessage(info: any, moveResponse?: any) {
        const succeeded = (moveResponse && moveResponse['succeeded']) ? moveResponse['succeeded'].length : 0;
        const partiallySucceeded = (moveResponse && moveResponse['partiallySucceeded']) ? moveResponse['partiallySucceeded'].length : 0;
        const failures = (moveResponse && moveResponse['failed']) ? moveResponse['failed'].length : 0;

        let successMessage = '';
        let partialSuccessMessage = '';
        let failedMessage = '';
        let errorMessage = '';

        if (typeof info === 'string') {

            // in case of success
            if (info.toLowerCase().indexOf('succes') !== -1) {
                let i18nMessageString = 'APP.MESSAGES.INFO.NODE_MOVE.';
                let i18MessageSuffix = '';

                if (succeeded) {
                    i18MessageSuffix = ( succeeded === 1 ) ? 'SINGULAR' : 'PLURAL';
                    successMessage = `${i18nMessageString}${i18MessageSuffix}`;
                }

                if (partiallySucceeded) {
                    i18MessageSuffix = ( partiallySucceeded === 1 ) ? 'PARTIAL.SINGULAR' : 'PARTIAL.PLURAL';
                    partialSuccessMessage = `${i18nMessageString}${i18MessageSuffix}`;
                }

                if (failures) {
                    // if moving failed for ALL nodes, emit error
                    if (failures === this.selection.length) {
                        const errors = this.nodeActionsService.flatten(moveResponse['failed']);
                        errorMessage = this.getErrorMessage(errors[0]);

                    } else {
                        i18MessageSuffix = 'PARTIAL.FAIL';
                        failedMessage = `${i18nMessageString}${i18MessageSuffix}`;
                    }
                }
            } else {
                errorMessage = 'APP.MESSAGES.ERRORS.GENERIC';
            }

        } else {
            errorMessage = this.getErrorMessage(info);
        }

        const undo = (succeeded + partiallySucceeded > 0) ? 'Undo' : '';
        const withUndo = errorMessage ? '' : '_WITH_UNDO';
        failedMessage = errorMessage ?  errorMessage : failedMessage;

        const beforePartialSuccessMessage = (successMessage && partialSuccessMessage) ? ' ' : '';
        const beforeFailedMessage = ((successMessage || partialSuccessMessage) && failedMessage) ? ' ' : '';

        const initialParentId = this.nodeActionsService.getFirstParentId(this.selection);

        this.translation.get(
            [successMessage, partialSuccessMessage, failedMessage],
            { success: succeeded, failed: failures, partially: partiallySucceeded}).subscribe(messages => {

            this.notification.openSnackMessageAction(
                messages[successMessage]
                + beforePartialSuccessMessage + messages[partialSuccessMessage]
                + beforeFailedMessage + messages[failedMessage],
                undo,
                NodeActionsService[`SNACK_MESSAGE_DURATION${withUndo}`]
            )
                .onAction()
                .subscribe(() => this.revertMoving(moveResponse, initialParentId));
        });
    }

    getErrorMessage(errorObject): string {
        let i18nMessageString = 'APP.MESSAGES.ERRORS.GENERIC';

        try {
            const { error: { statusCode } } = JSON.parse(errorObject.message);

            if (statusCode === 409) {
                i18nMessageString =  'APP.MESSAGES.ERRORS.NODE_MOVE';

            } else if (statusCode === 403) {
                i18nMessageString = 'APP.MESSAGES.ERRORS.PERMISSION';
            }

        } catch (err) { /* Do nothing, keep the original message */ }

        return i18nMessageString;
    }

    private revertMoving(moveResponse, selectionParentId) {
        const movedNodes = (moveResponse && moveResponse['succeeded']) ? moveResponse['succeeded'] : [];
        const partiallyMovedNodes = (moveResponse && moveResponse['partiallySucceeded']) ? moveResponse['partiallySucceeded'] : [];

        const restoreDeletedNodesBatch = this.nodeActionsService.moveDeletedEntries
            .map((folderEntry) => {
                return this.nodesApi.restoreNode(folderEntry.nodeId || folderEntry.id);
            });

        Observable.zip(...restoreDeletedNodesBatch, Observable.of(null))
            .flatMap(() => {

                const nodesToBeMovedBack = [...partiallyMovedNodes, ...movedNodes];

                const revertMoveBatch = this.nodeActionsService
                    .flatten(nodesToBeMovedBack)
                    .filter(node => node.entry || (node.itemMoved && node.itemMoved.entry))
                    .map((node) => {
                        if (node.itemMoved) {
                            return this.nodeActionsService.moveNodeAction(node.itemMoved.entry, node.initialParentId);
                        } else {
                            return this.nodeActionsService.moveNodeAction(node.entry, selectionParentId);
                        }
                    });

                return Observable.zip(...revertMoveBatch, Observable.of(null));
            })
            .subscribe(
                () => {
                    this.content.moveNode.next(null);
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
                        this.notification.openSnackMessage(
                            message, NodeActionsService.SNACK_MESSAGE_DURATION);
                    });
                }
            );
    }

}
