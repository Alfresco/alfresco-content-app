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

import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NodePermissionDialogService, PermissionListComponent } from '@alfresco/adf-content-services';
import { MinimalNodeEntryEntity } from 'alfresco-js-api';
import { Store } from '@ngrx/store';
import { AppStore } from '../../store/states/app.state';
import { SnackbarErrorAction } from '../../store/actions/snackbar.actions';
import { NodePermissionsDialogComponent } from '../../dialogs/node-permissions/node-permissions.dialog';
import { MatDialog } from '@angular/material';
import { ContentApiService } from '../../services/content-api.service';

@Component({
    selector: 'aca-permissions-manager',
    templateUrl: './permissions-manager.component.html'
})
export class PermissionsManagerComponent implements OnInit {
    @ViewChild('permissionList')
    permissionList: PermissionListComponent;

    @Input()
    nodeId: string;

    toggleStatus = false;

    constructor(
        private store: Store<AppStore>,
        private dialog: MatDialog,
        private contentApi: ContentApiService,
        private nodePermissionDialogService: NodePermissionDialogService
    ) {
    }

    ngOnInit() {
        this.contentApi.getNodeInfo(this.nodeId, {include: ['permissions'] }).subscribe( (currentNode: MinimalNodeEntryEntity) => {
            this.toggleStatus = currentNode.permissions.isInheritanceEnabled;
        });
    }

    onError(errorMessage: string) {
        console.log('adf-permission-list error:');
        console.log(errorMessage);
        this.store.dispatch(new SnackbarErrorAction(errorMessage));
    }

    onUpdate(event) {
        console.log('adf-permission-list update:');
        console.log(event);
        this.permissionList.reload();
    }

    onUpdatedPermissions(node: MinimalNodeEntryEntity) {
        console.log('adf-inherit-permission updated:');
        console.log(node);
        this.toggleStatus = node.permissions.isInheritanceEnabled;
        this.permissionList.reload();
    }

    openAddPermissionDialog(event: Event) {
        this.nodePermissionDialogService.updateNodePermissionByDialog(this.nodeId)
            .subscribe(() => {
                // this.permissionList.reload();
            },
            (error) => {
                console.log('ERROR ' + error);
                this.store.dispatch(new SnackbarErrorAction(error));
            },
            () => {
                this.dialog.open(NodePermissionsDialogComponent, {
                        data: { nodeId: this.nodeId },
                        panelClass: 'aca-permissions-dialog-panel',
                        width: '800px'
                    }
                );
            }
        );
    }
}
