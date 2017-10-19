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
import { Observable } from 'rxjs/Rx';

import { TranslationService, NodesApiService, NotificationService } from 'ng2-alfresco-core';
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
        const numberOfCopiedItems = newItems ? newItems.length : '';

        let i18nMessageString = 'APP.MESSAGES.ERRORS.GENERIC';

        if (typeof info === 'string') {
            if (info.toLowerCase().indexOf('succes') !== -1) {

                const i18MessageSuffix = ( numberOfCopiedItems === 1 ) ? 'SINGULAR' : 'PLURAL';
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

        const undo = (numberOfCopiedItems > 0) ? 'Undo' : '';
        const withUndo = (numberOfCopiedItems > 0) ? '_WITH_UNDO' : '';

        this.translation.get(i18nMessageString, { number: numberOfCopiedItems }).subscribe(message => {
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
