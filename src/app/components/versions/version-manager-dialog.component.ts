import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { MinimalNodeEntryEntity } from 'alfresco-js-api';

@Component({
  templateUrl: './version-manager-dialog.component.html',
  encapsulation: ViewEncapsulation.None
})
export class VersionManagerDialogComponent {
  public nodeName: string;
  public nodeEntry: MinimalNodeEntryEntity;

  constructor(@Inject(MAT_DIALOG_DATA) data: any,
              private containingDialog?: MatDialogRef<VersionManagerDialogComponent>) {
    this.nodeEntry = data.entry;
    this.nodeName = this.nodeEntry.name;
  }

  close() {
    this.containingDialog.close();
  }
}
