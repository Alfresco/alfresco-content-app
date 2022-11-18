/*
 * Copyright © 2005 - 2021 Alfresco Software, Ltd. All rights reserved.
 *
 * License rights for this program may be obtained from Alfresco Software, Ltd.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
 */

import { Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { delay, takeUntil } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppStore, getFileUploadingDialog } from '@alfresco/aca-shared/store';

@Component({
  selector: 'aca-upload-files-dialog',
  templateUrl: './upload-files-dialog.component.html',
  encapsulation: ViewEncapsulation.None
})
export class UploadFilesDialogComponent implements OnDestroy {
  showFileUploadingDialog$: Observable<boolean>;

  private onDestroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private store: Store<AppStore>) {
    this.showFileUploadingDialog$ = this.store.select(getFileUploadingDialog).pipe(delay(0), takeUntil(this.onDestroy$));
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }
}
