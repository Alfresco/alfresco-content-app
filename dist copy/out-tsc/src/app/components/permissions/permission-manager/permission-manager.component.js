/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2020 Alfresco Software Limited
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
import * as tslib_1 from 'tslib';
import { SnackbarErrorAction } from '@alfresco/aca-shared/store';
import {
  NodePermissionDialogService,
  PermissionListComponent
} from '@alfresco/adf-content-services';
import { Component, Input, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { ContentApiService } from '@alfresco/aca-shared';
import { NodePermissionsDialogComponent } from '../permission-dialog/node-permissions.dialog';
var PermissionsManagerComponent = /** @class */ (function() {
  function PermissionsManagerComponent(
    store,
    dialog,
    contentApi,
    nodePermissionDialogService
  ) {
    this.store = store;
    this.dialog = dialog;
    this.contentApi = contentApi;
    this.nodePermissionDialogService = nodePermissionDialogService;
    this.toggleStatus = false;
  }
  PermissionsManagerComponent.prototype.ngOnInit = function() {
    var _this = this;
    this.contentApi
      .getNodeInfo(this.nodeId, { include: ['permissions'] })
      .subscribe(function(currentNode) {
        _this.toggleStatus = currentNode.permissions.isInheritanceEnabled;
      });
  };
  PermissionsManagerComponent.prototype.onError = function(errorMessage) {
    this.store.dispatch(new SnackbarErrorAction(errorMessage));
  };
  PermissionsManagerComponent.prototype.onUpdate = function() {
    this.permissionList.reload();
  };
  PermissionsManagerComponent.prototype.onUpdatedPermissions = function(node) {
    this.toggleStatus = node.permissions.isInheritanceEnabled;
    this.permissionList.reload();
  };
  PermissionsManagerComponent.prototype.openAddPermissionDialog = function() {
    var _this = this;
    this.nodePermissionDialogService
      .updateNodePermissionByDialog(this.nodeId)
      .subscribe(
        function() {
          _this.dialog.open(NodePermissionsDialogComponent, {
            data: { nodeId: _this.nodeId },
            panelClass: 'aca-permissions-dialog-panel',
            width: '800px'
          });
        },
        function(error) {
          _this.store.dispatch(new SnackbarErrorAction(error));
        }
      );
  };
  tslib_1.__decorate(
    [
      ViewChild('permissionList'),
      tslib_1.__metadata('design:type', PermissionListComponent)
    ],
    PermissionsManagerComponent.prototype,
    'permissionList',
    void 0
  );
  tslib_1.__decorate(
    [Input(), tslib_1.__metadata('design:type', String)],
    PermissionsManagerComponent.prototype,
    'nodeId',
    void 0
  );
  PermissionsManagerComponent = tslib_1.__decorate(
    [
      Component({
        selector: 'app-permission-manager',
        templateUrl: './permission-manager.component.html'
      }),
      tslib_1.__metadata('design:paramtypes', [
        Store,
        MatDialog,
        ContentApiService,
        NodePermissionDialogService
      ])
    ],
    PermissionsManagerComponent
  );
  return PermissionsManagerComponent;
})();
export { PermissionsManagerComponent };
//# sourceMappingURL=permission-manager.component.js.map
