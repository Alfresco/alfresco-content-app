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

import { AppStore, CancelCheckoutNodeAction, CheckoutNodeAction, getAppSelection } from '@alfresco/aca-shared/store';
import { NodeEntry } from '@alfresco/js-api';
import { Component, inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppExtensionService, isLocked } from '@alfresco/aca-shared';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { MatMenuItem, MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';

@Component({
  imports: [CommonModule, TranslatePipe, MatMenuModule, MatIconModule],
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

  @ViewChild(MatMenuItem)
  menuItem: MatMenuItem;

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

  onClick() {
    if (this.isCancelable(this.selection)) {
      this.store.dispatch(new CancelCheckoutNodeAction(this.selection));
    } else {
      this.store.dispatch(new CheckoutNodeAction(this.selection));
    }
    this.extensions.updateSidebarActions();
  }

  private isCancelable(node: NodeEntry): boolean {
    return isLocked(node) || (node?.entry?.aspectNames ?? []).includes('cm:workingcopy');
  }
}
