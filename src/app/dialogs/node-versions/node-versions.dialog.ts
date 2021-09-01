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

import { AppStore, SnackbarErrorAction, UnlockWriteAction, ViewNodeVersionAction } from '@alfresco/aca-shared/store';
import { MinimalNodeEntryEntity, Node, Version } from '@alfresco/js-api';
import { Component, EventEmitter, Inject, Output, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { NodeEntityEvent } from '@alfresco/adf-content-services';
import { Router } from '@angular/router';

export interface NodeVersionDialogData {
  title: string;
  node: MinimalNodeEntryEntity;
  file?: File;
  currentVersion?: Version;
  showVersionsOnly?: boolean;
}

@Component({
  templateUrl: './node-versions.dialog.html',
  styleUrls: ['./node-versions.dialog.scss'],
  encapsulation: ViewEncapsulation.None,
  host: { class: 'aca-node-versions-dialog' }
})
export class NodeVersionsDialogComponent {
  /** Emitted when a version is restored or deleted. */
  @Output()
  refreshEvent = new EventEmitter<Node>();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: NodeVersionDialogData,
    private store: Store<AppStore>,
    private dialogRef: MatDialogRef<NodeVersionsDialogComponent>,
    private router: Router
  ) {}

  onUploadError(errorMessage: any) {
    this.store.dispatch(new SnackbarErrorAction(errorMessage));
  }

  handleUpload(nodeEvent: NodeEntityEvent) {
    if (nodeEvent.value.entry.properties['cm:lockType'] === 'WRITE_LOCK') {
      this.store.dispatch(new UnlockWriteAction(nodeEvent.value));
    }
    this.dialogRef.close();
  }

  handleCancel() {
    this.dialogRef.close();
  }

  refresh(node: Node) {
    this.refreshEvent.emit(node);
  }

  onViewingVersion(versionId: string) {
    this.store.dispatch(
      new ViewNodeVersionAction(this.data.node.id, versionId, {
        location: this.router.url
      })
    );
  }
}
