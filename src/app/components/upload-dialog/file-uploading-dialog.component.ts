/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  FileModel,
  FileUploadCompleteEvent,
  FileUploadDeleteEvent,
  FileUploadErrorEvent,
  FileUploadStatus,
  UploadService
} from '@alfresco/adf-core';
import {
  ChangeDetectorRef,
  Component,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { Subscription, merge } from 'rxjs';
import { FileUploadingListComponent } from './file-uploading-list.component';

// @deprecated file-uploading-dialog TODO remove in 3.0.0
@Component({
  selector: 'app-file-uploading-dialog',
  templateUrl: './file-uploading-dialog.component.html'
})
export class FileUploadingDialogComponent implements OnInit, OnDestroy {
  @ViewChild('uploadList')
  uploadList: FileUploadingListComponent;

  /** Dialog position. Can be 'left' or 'right'. */
  @Input()
  position = 'right';

  /** Emitted when a file in the list has an error. */
  @Output()
  error: EventEmitter<any> = new EventEmitter();

  filesUploadingList: FileModel[] = [];
  isDialogActive = false;
  totalCompleted = 0;
  totalErrors = 0;
  isDialogMinimized = false;
  isConfirmation = false;

  private listSubscription: Subscription;
  private counterSubscription: Subscription;
  private fileUploadSubscription: Subscription;
  private errorSubscription: Subscription;
  private errors = [];

  constructor(
    private uploadService: UploadService,
    private changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.listSubscription = this.uploadService.queueChanged.subscribe(
      (fileList: FileModel[]) => {
        this.filesUploadingList = fileList;

        if (this.filesUploadingList.length) {
          this.isDialogActive = true;
        }
      }
    );

    this.counterSubscription = merge(
      this.uploadService.fileUploadComplete,
      this.uploadService.fileUploadDeleted
    ).subscribe((event: FileUploadDeleteEvent | FileUploadCompleteEvent) => {
      this.totalCompleted = event.totalComplete;
      this.changeDetector.detectChanges();
    });

    // todo: move to ADF ACA-2051
    this.errorSubscription = this.uploadService.fileUploadError.subscribe(
      (event: FileUploadErrorEvent) => {
        const statusCode = (event.error || {}).response
          ? event.error.response.statusCode
          : null;
        this.errors.push({
          fileName: event.file.name,
          status: statusCode,
          message: this.getUploadErrorMessage(statusCode)
        });
        this.totalErrors = event.totalError;
        this.changeDetector.detectChanges();
      }
    );

    this.fileUploadSubscription = this.uploadService.fileUpload.subscribe(
      event => {
        this.changeDetector.detectChanges();
      }
    );

    this.uploadService.fileDeleted.subscribe(objId => {
      if (this.filesUploadingList) {
        const file = this.filesUploadingList.find(item => {
          return item.data.entry.id === objId;
        });
        if (file) {
          file.status = FileUploadStatus.Cancelled;
          this.changeDetector.detectChanges();
        }
      }
    });
  }

  getFileUploadError(file) {
    return this.errors.find(error => (error.fileName = file.name));
  }

  /**
   * Toggle confirmation message.
   */
  toggleConfirmation() {
    this.isConfirmation = !this.isConfirmation;

    if (this.isDialogMinimized) {
      this.isDialogMinimized = false;
    }
  }

  /**
   * Cancel uploads and hide confirmation
   */
  cancelAllUploads() {
    this.toggleConfirmation();

    this.uploadList.cancelAllFiles();
  }

  /**
   * Toggle dialog minimized state.
   */
  toggleMinimized(): void {
    this.isDialogMinimized = !this.isDialogMinimized;
    this.changeDetector.detectChanges();
  }

  /**
   * Dismiss dialog
   */
  close(): void {
    this.isConfirmation = false;
    this.totalCompleted = 0;
    this.totalErrors = 0;
    this.filesUploadingList = [];
    this.isDialogActive = false;
    this.isDialogMinimized = false;
    this.uploadService.clearQueue();
    this.changeDetector.detectChanges();
    this.errors = [];
  }

  ngOnDestroy() {
    this.uploadService.clearQueue();
    this.listSubscription.unsubscribe();
    this.counterSubscription.unsubscribe();
    this.fileUploadSubscription.unsubscribe();
    this.errorSubscription.unsubscribe();
  }

  // todo: move to ADF ACA-2051
  private getUploadErrorMessage(status) {
    const messages = {
      500: 'APP.MESSAGES.UPLOAD.ERROR.500',
      504: 'APP.MESSAGES.UPLOAD.ERROR.504',
      403: 'APP.MESSAGES.UPLOAD.ERROR.403',
      404: 'APP.MESSAGES.UPLOAD.ERROR.404',
      generic: 'APP.MESSAGES.UPLOAD.ERROR.GENERIC'
    };

    return messages[status] || messages['generic'];
  }
}
