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

import { AlfrescoApiService } from '@alfresco/adf-core';
import { MinimalNodeEntity, MinimalNodeEntryEntity } from 'alfresco-js-api';

import { VersionManagerDialogAdapterComponent } from '../../components/versions-dialog/version-manager-dialog-adapter.component';
import { MatDialog } from '@angular/material';
import { Store } from '@ngrx/store';
import { AppStore } from '../../store/states/app.state';
import { SnackbarErrorAction } from '../../store/actions';

@Directive({
    selector: '[acaNodeVersions]'
})
export class NodeVersionsDirective {

    // tslint:disable-next-line:no-input-rename
    @Input('acaNodeVersions')
    node: MinimalNodeEntity;

    @HostListener('click')
    onClick() {
        this.onManageVersions();
    }

    constructor(
        private store: Store<AppStore>,
        private apiService: AlfrescoApiService,
        private dialog: MatDialog
    ) {}

    async onManageVersions() {
        if (this.node && this.node.entry) {
            let entry  = this.node.entry;

            if (entry.nodeId || (<any>entry).guid) {
                entry = await this.apiService.nodesApi.getNodeInfo(
                    entry.nodeId || (<any>entry).id,
                    { include: ['allowableOperations'] }
                );
                this.openVersionManagerDialog(entry);
            } else {
                this.openVersionManagerDialog(entry);
            }
        } else if (this.node) {
            this.openVersionManagerDialog(<MinimalNodeEntryEntity>this.node);
        }
    }

    openVersionManagerDialog(contentEntry: MinimalNodeEntryEntity) {
        if (contentEntry.isFile) {
            this.dialog.open(
                VersionManagerDialogAdapterComponent,
                <any>{ data: { contentEntry }, panelClass: 'adf-version-manager-dialog', width: '630px' });
        } else {
            this.store.dispatch(new SnackbarErrorAction('APP.MESSAGES.ERRORS.PERMISSION'));
        }
    }
}
