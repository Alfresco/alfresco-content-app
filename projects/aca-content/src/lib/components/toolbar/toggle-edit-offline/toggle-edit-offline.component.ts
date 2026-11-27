/*!
 * Copyright © 2005-2026 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * Alfresco Example Content Application
 *
 * This file is part of the Alfresco Example Content Application.
 * If the software was purchased under a paid Alfresco license, the terms of
 * the paid license agreement will prevail. Otherwise, the software is
 * provided under the following open source license terms:
 *
 * The Alfresco Example Content Application is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * The Alfresco Example Content Application is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * from Hyland Software. If not, see <http://www.gnu.org/licenses/>.
 */

import {
  AppStore,
  CancelCheckoutNodeAction,
  CheckoutNodeAction,
  DownloadNodesAction,
  EditOfflineAction,
  SetSelectedNodesAction,
  getAppSelection
} from '@alfresco/aca-shared/store';
import { NodeEntry, SharedLinkEntry, Node, NodesApi, LazyApi } from '@alfresco/js-api';
import { Component, inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppExtensionService, isLocked } from '@alfresco/aca-shared';
import { NotificationService } from '@alfresco/adf-core';
import { AlfrescoApiService, DocumentListService } from '@alfresco/adf-content-services';
import { TranslatePipe } from '@ngx-translate/core';
import { MatMenuItem, MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';

@Component({
  imports: [TranslatePipe, MatMenuModule, MatIconModule],
  selector: 'app-toggle-edit-offline',
  template: `
    <button mat-menu-item [attr.title]="nodeTitle | translate" (click)="onClick()">
      <mat-icon>{{ isNodeLocked ? 'cancel' : 'edit' }}</mat-icon>
      <span>{{ (isNodeLocked ? 'APP.ACTIONS.EDIT_OFFLINE_CANCEL' : 'APP.ACTIONS.EDIT_OFFLINE') | translate }}</span>
    </button>
  `,
  encapsulation: ViewEncapsulation.None,
  host: { class: 'app-toggle-edit-offline' }
})
export class ToggleEditOfflineComponent implements OnInit {
  private readonly store = inject<Store<AppStore>>(Store);
  private readonly extensions = inject(AppExtensionService);
  private readonly alfrescoApiService = inject(AlfrescoApiService);
  private readonly notificationService = inject(NotificationService);
  private readonly documentListService = inject(DocumentListService);

  @ViewChild(MatMenuItem)
  menuItem: MatMenuItem;

  @LazyApi((self: ToggleEditOfflineComponent) => new NodesApi(self.alfrescoApiService.getInstance()))
  declare nodesApi: NodesApi;

  selection: NodeEntry;
  nodeTitle = '';
  isNodeLocked = false;

  ngOnInit() {
    this.store.select(getAppSelection).subscribe(({ file }) => {
      this.selection = file;
      this.isNodeLocked = this.selection && this.isCancelable(this.selection);
      this.nodeTitle = this.isNodeLocked ? 'APP.ACTIONS.EDIT_OFFLINE_CANCEL' : 'APP.ACTIONS.EDIT_OFFLINE';
    });
  }

  async onClick() {
    if (this.isCheckoutAvailable()) {
      if (this.isCancelable(this.selection)) {
        this.store.dispatch(new CancelCheckoutNodeAction(this.selection));
      } else {
        this.store.dispatch(new CheckoutNodeAction(this.selection));
      }
    } else {
      await this.toggleLock(this.selection);
    }
    this.extensions.updateSidebarActions();
  }

  private isCheckoutAvailable(): boolean {
    return this.extensions.isFeatureSupported('isCheckoutAvailable');
  }

  private isCancelable(node: NodeEntry): boolean {
    if (!this.isCheckoutAvailable()) {
      return isLocked(node);
    }
    return isLocked(node) || (node?.entry?.aspectNames ?? []).includes('cm:workingcopy');
  }

  /* Legacy lock / unlock flow for ACS versions without check-in / check-out support. */
  private async toggleLock(node: NodeEntry | SharedLinkEntry): Promise<void> {
    const id = (node as SharedLinkEntry).entry.nodeId || node.entry.id;

    if (isLocked(this.selection)) {
      try {
        const response = await this.unlockNode(id);

        this.update(response?.entry);
        this.store.dispatch(new EditOfflineAction(this.selection));
        this.store.dispatch(new SetSelectedNodesAction([this.selection]));
        this.documentListService.reloadSilently();
      } catch {
        this.onUnlockError();
      }
    } else {
      try {
        const response = await this.lockNode(id);

        this.update(response?.entry);
        this.store.dispatch(new DownloadNodesAction([this.selection]));
        this.store.dispatch(new EditOfflineAction(this.selection));
        this.store.dispatch(new SetSelectedNodesAction([this.selection]));
        this.documentListService.reloadSilently();
      } catch {
        this.onLockError();
      }
    }
  }

  private onLockError(): void {
    this.notificationService.showError('APP.MESSAGES.ERRORS.LOCK_NODE', null, { fileName: this.selection.entry.name });
  }

  private onUnlockError(): void {
    this.notificationService.showError('APP.MESSAGES.ERRORS.UNLOCK_NODE', null, { fileName: this.selection.entry.name });
  }

  private lockNode(nodeId: string): Promise<NodeEntry> {
    return this.nodesApi.lockNode(nodeId, {
      type: 'ALLOW_OWNER_CHANGES',
      lifetime: 'PERSISTENT'
    });
  }

  private unlockNode(nodeId: string): Promise<NodeEntry> {
    return this.nodesApi.unlockNode(nodeId);
  }

  private update(data: Node): void {
    if (data?.properties) {
      const properties = this.selection.entry.properties || {};

      properties['cm:lockLifetime'] = data.properties['cm:lockLifetime'];
      properties['cm:lockOwner'] = data.properties['cm:lockOwner'];
      properties['cm:lockType'] = data.properties['cm:lockType'];
      this.selection.entry.isLocked = data.isLocked ?? !!properties['cm:lockType'];

      this.selection.entry.properties = properties;
    }
  }
}
