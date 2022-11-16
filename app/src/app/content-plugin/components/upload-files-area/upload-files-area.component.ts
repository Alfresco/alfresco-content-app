import { Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { delay, map, takeUntil } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppStore, getCurrentFolder, getFileUploadingDialog } from '@alfresco/aca-shared/store';
import { NodePermissionService } from '@alfresco/aca-shared';

@Component({
  selector: 'aca-upload-files-area',
  templateUrl: './upload-files-area.component.html',
  styleUrls: ['./upload-files-area.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: { class: 'aca-upload-area' }
})
export class UploadFilesAreaComponent implements OnDestroy {
  canUpload$: Observable<boolean>;
  currentFolderId$: Observable<string>;
  showFileUploadingDialog$: Observable<boolean>;

  private onDestroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private store: Store<AppStore>, private permission: NodePermissionService) {
    const currentFolder$ = this.store.select(getCurrentFolder).pipe(takeUntil(this.onDestroy$));

    this.canUpload$ = currentFolder$.pipe(map((node) => node && this.permission.check(node, ['create'])));
    this.currentFolderId$ = currentFolder$.pipe(map((node) => node?.id));

    this.showFileUploadingDialog$ = this.store.select(getFileUploadingDialog).pipe(delay(0), takeUntil(this.onDestroy$));
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }
}
