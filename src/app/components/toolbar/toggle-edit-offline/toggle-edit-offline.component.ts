/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2019 Alfresco Software Limited
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

import {
  AppStore,
  DownloadNodesAction,
  EditOfflineAction,
  SnackbarErrorAction
} from '@alfresco/aca-shared/store';
import { MinimalNodeEntity } from '@alfresco/js-api';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Store } from '@ngrx/store';
import { appSelection } from '../../../store/selectors/app.selectors';

@Component({
  selector: 'app-toggle-edit-offline',
  template: `
    <button
      #lock="lockNode"
      mat-menu-item
      (toggle)="onToggleEvent($event)"
      (lockError)="onLockError()"
      (unlockError)="onUnlockLockError()"
      [acaLockNode]="selection"
      [attr.title]="
        lock.isNodeLocked()
          ? ('APP.ACTIONS.EDIT_OFFLINE_CANCEL' | translate)
          : ('APP.ACTIONS.EDIT_OFFLINE' | translate)
      "
    >
      <ng-container *ngIf="lock.isNodeLocked()">
        <mat-icon>cancel</mat-icon>
        <span>{{ 'APP.ACTIONS.EDIT_OFFLINE_CANCEL' | translate }}</span>
      </ng-container>

      <ng-container *ngIf="!lock.isNodeLocked()">
        <mat-icon>edit</mat-icon>
        <span>{{ 'APP.ACTIONS.EDIT_OFFLINE' | translate }}</span>
      </ng-container>
    </button>
  `,
  encapsulation: ViewEncapsulation.None,
  host: { class: 'app-toggle-edit-offline' }
})
export class ToggleEditOfflineComponent implements OnInit {
  selection: MinimalNodeEntity;

  constructor(private store: Store<AppStore>) {}

  ngOnInit() {
    this.store.select(appSelection).subscribe(({ file }) => {
      this.selection = file;
    });
  }

  onToggleEvent(isNodeLocked: boolean) {
    if (isNodeLocked) {
      this.store.dispatch(new DownloadNodesAction([this.selection]));
    }
    this.store.dispatch(new EditOfflineAction(this.selection));
  }

  onLockError() {
    this.store.dispatch(
      new SnackbarErrorAction('APP.MESSAGES.ERRORS.LOCK_NODE', {
        fileName: this.selection.entry.name
      })
    );
  }

  onUnlockLockError() {
    this.store.dispatch(
      new SnackbarErrorAction('APP.MESSAGES.ERRORS.UNLOCK_NODE', {
        fileName: this.selection.entry.name
      })
    );
  }
}
