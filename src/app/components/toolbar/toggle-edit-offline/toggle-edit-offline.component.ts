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

import { AppStore, DownloadNodesAction, EditOfflineAction, SnackbarErrorAction, getAppSelection } from '@alfresco/aca-shared/store';
import { MinimalNodeEntity, NodeEntry, SharedLinkEntry, Node, NodesApi } from '@alfresco/js-api';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Store } from '@ngrx/store';
import { isLocked } from '@alfresco/aca-shared';
import { AlfrescoApiService } from '@alfresco/adf-core';

@Component({
  selector: 'app-toggle-edit-offline',
  template: `
    <button
      mat-menu-item
      [attr.title]="(isNodeLocked ? 'APP.ACTIONS.EDIT_OFFLINE_CANCEL' : 'APP.ACTIONS.EDIT_OFFLINE') | translate"
      (click)="onClick()"
    >
      <ng-container *ngIf="isNodeLocked">
        <mat-icon>cancel</mat-icon>
        <span>{{ 'APP.ACTIONS.EDIT_OFFLINE_CANCEL' | translate }}</span>
      </ng-container>

      <ng-container *ngIf="!isNodeLocked">
        <mat-icon>edit</mat-icon>
        <span>{{ 'APP.ACTIONS.EDIT_OFFLINE' | translate }}</span>
      </ng-container>
    </button>
  `,
  encapsulation: ViewEncapsulation.None,
  host: { class: 'app-toggle-edit-offline' }
})
export class ToggleEditOfflineComponent implements OnInit {
  private nodesApi: NodesApi;
  selection: MinimalNodeEntity;

  constructor(private store: Store<AppStore>, private alfrescoApiService: AlfrescoApiService) {
    this.nodesApi = new NodesApi(this.alfrescoApiService.getInstance());
  }

  ngOnInit() {
    this.store.select(getAppSelection).subscribe(({ file }) => {
      this.selection = file;
    });
  }

  get isNodeLocked(): boolean {
    return !!(this.selection && isLocked(this.selection));
  }

  async onClick() {
    await this.toggleLock(this.selection);
  }

  private async toggleLock(node: NodeEntry | SharedLinkEntry) {
    const id = (node as SharedLinkEntry).entry.nodeId || node.entry.id;

    if (isLocked(this.selection)) {
      try {
        const response = await this.unlockNode(id);

        this.update(response?.entry);
        this.store.dispatch(new EditOfflineAction(this.selection));
      } catch {
        this.onUnlockError();
      }
    } else {
      try {
        const response = await this.lockNode(id);

        this.update(response?.entry);
        this.store.dispatch(new DownloadNodesAction([this.selection]));
        this.store.dispatch(new EditOfflineAction(this.selection));
      } catch {
        this.onLockError();
      }
    }
  }

  onLockError() {
    this.store.dispatch(
      new SnackbarErrorAction('APP.MESSAGES.ERRORS.LOCK_NODE', {
        fileName: this.selection.entry.name
      })
    );
  }

  onUnlockError() {
    this.store.dispatch(
      new SnackbarErrorAction('APP.MESSAGES.ERRORS.UNLOCK_NODE', {
        fileName: this.selection.entry.name
      })
    );
  }

  lockNode(nodeId: string) {
    return this.nodesApi.lockNode(nodeId, {
      type: 'ALLOW_OWNER_CHANGES',
      lifetime: 'PERSISTENT'
    });
  }

  unlockNode(nodeId: string) {
    return this.nodesApi.unlockNode(nodeId);
  }

  private update(data: Node) {
    if (data && data.properties) {
      const properties = this.selection.entry.properties || {};

      properties['cm:lockLifetime'] = data.properties['cm:lockLifetime'];
      properties['cm:lockOwner'] = data.properties['cm:lockOwner'];
      properties['cm:lockType'] = data.properties['cm:lockType'];

      this.selection.entry.properties = properties;
    }
  }
}
