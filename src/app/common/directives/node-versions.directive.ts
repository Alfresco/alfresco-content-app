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

import { Directive, EventEmitter, HostListener, Input, Output } from '@angular/core';

import { TranslationService, NotificationService, AlfrescoApiService } from '@alfresco/adf-core';
import { MinimalNodeEntity } from 'alfresco-js-api';

import { VersionManagerDialogAdapterComponent } from '../../components/versions-dialog/version-manager-dialog-adapter.component';
import { MatDialog } from '@angular/material';

@Directive({
    selector: '[app-node-versions]'
})
export class NodeVersionsDirective {

    @Input('app-node-versions')
    selection: MinimalNodeEntity[];

    @Output()
    nodeVersionError: EventEmitter<any> = new EventEmitter();

    @HostListener('click')
    onClick() {
        this.onManageVersions();
    }

    constructor(
        private apiService: AlfrescoApiService,
        private dialog: MatDialog,
        private notification: NotificationService,
        private translation: TranslationService
    ) {}

    onManageVersions() {
        const contentEntry = this.selection[0].entry;
        const nodeId = (<any>contentEntry).nodeId;

        this.apiService.getInstance().nodes.getNodeInfo(nodeId || contentEntry.id, {
            include: ['allowableOperations']
        }).then(entry => this.openVersionManagerDialog(entry));

    }

    openVersionManagerDialog(contentEntry) {
        if (contentEntry.isFile) {
            this.dialog.open(
                VersionManagerDialogAdapterComponent,
                <any>{ data: { contentEntry }, panelClass: 'adf-version-manager-dialog', width: '630px' });
        } else {
            const translatedErrorMessage: any = this.translation.get('APP.MESSAGES.ERRORS.PERMISSION');
            this.notification.openSnackMessage(translatedErrorMessage.value, 4000);

            this.nodeVersionError.emit();
        }
    }
}
