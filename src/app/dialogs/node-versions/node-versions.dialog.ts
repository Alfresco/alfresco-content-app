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

import { SnackbarErrorAction } from '@alfresco/aca-shared/store';
import { MinimalNodeEntryEntity, Node } from '@alfresco/js-api';
import {
  Component,
  EventEmitter,
  Inject,
  Output,
  ViewEncapsulation
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';

@Component({
  templateUrl: './node-versions.dialog.html',
  encapsulation: ViewEncapsulation.None,
  host: { class: 'aca-node-versions-dialog' }
})
export class NodeVersionsDialogComponent {
  node: MinimalNodeEntryEntity;
  file: File;
  typeList = true;

  /** Emitted when a version is restored or deleted. */
  @Output()
  refreshEvent: EventEmitter<Node> = new EventEmitter<Node>();

  constructor(
    @Inject(MAT_DIALOG_DATA) data: any,
    private store: Store<any>,
    private dialogRef: MatDialogRef<NodeVersionsDialogComponent>
  ) {
    this.node = data.node ? data.node : undefined;
    this.file = data.file ? data.file : undefined;
    this.typeList = data.typeList != undefined ? data.typelist : true;
  }

  onUploadError(errorMessage: string) {
    this.store.dispatch(new SnackbarErrorAction(errorMessage));
  }

  handleUpload() {
    this.dialogRef.close();
  }

  refresh(node: Node) {
    this.refreshEvent.emit(node);
  }
}
