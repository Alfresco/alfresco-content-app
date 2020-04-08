/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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
import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { LogService } from '../../services/log.service';
import { DownloadZipService } from '../../services/download-zip.service';
export class DownloadZipDialogComponent {
  /**
   * @param {?} dialogRef
   * @param {?} data
   * @param {?} logService
   * @param {?} downloadZipService
   */
  constructor(dialogRef, data, logService, downloadZipService) {
    this.dialogRef = dialogRef;
    this.data = data;
    this.logService = logService;
    this.downloadZipService = downloadZipService;
    // flag for async threads
    this.cancelled = false;
  }
  /**
   * @return {?}
   */
  ngOnInit() {
    if (this.data && this.data.nodeIds && this.data.nodeIds.length > 0) {
      if (!this.cancelled) {
        this.downloadZip(this.data.nodeIds);
      } else {
        this.logService.log('Cancelled');
      }
    }
  }
  /**
   * @return {?}
   */
  cancelDownload() {
    this.cancelled = true;
    this.downloadZipService.cancelDownload(this.downloadId);
    this.dialogRef.close(false);
  }
  /**
   * @param {?} nodeIds
   * @return {?}
   */
  downloadZip(nodeIds) {
    if (nodeIds && nodeIds.length > 0) {
      this.downloadZipService.createDownload({ nodeIds }).subscribe(
        /**
         * @param {?} data
         * @return {?}
         */
        data => {
          if (data && data.entry && data.entry.id) {
            /** @type {?} */
            const url = this.downloadZipService.getContentUrl(
              data.entry.id,
              true
            );
            this.downloadZipService.getNode(data.entry.id).subscribe(
              /**
               * @param {?} downloadNode
               * @return {?}
               */
              downloadNode => {
                this.logService.log(downloadNode);
                /** @type {?} */
                const fileName = downloadNode.entry.name;
                this.downloadId = data.entry.id;
                this.waitAndDownload(data.entry.id, url, fileName);
              }
            );
          }
        }
      );
    }
  }
  /**
   * @param {?} downloadId
   * @param {?} url
   * @param {?} fileName
   * @return {?}
   */
  waitAndDownload(downloadId, url, fileName) {
    if (this.cancelled) {
      return;
    }
    this.downloadZipService.getDownload(downloadId).subscribe(
      /**
       * @param {?} downloadEntry
       * @return {?}
       */
      downloadEntry => {
        if (downloadEntry.entry) {
          if (downloadEntry.entry.status === 'DONE') {
            this.download(url, fileName);
          } else {
            setTimeout(
              /**
               * @return {?}
               */
              () => {
                this.waitAndDownload(downloadId, url, fileName);
              },
              1000
            );
          }
        }
      }
    );
  }
  /**
   * @param {?} url
   * @param {?} fileName
   * @return {?}
   */
  download(url, fileName) {
    if (url && fileName) {
      /** @type {?} */
      const link = document.createElement('a');
      link.style.display = 'none';
      link.download = fileName;
      link.href = url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    this.dialogRef.close(true);
  }
}
DownloadZipDialogComponent.decorators = [
  {
    type: Component,
    args: [
      {
        selector: 'adf-download-zip-dialog',
        template:
          '<h1 matDialogTitle>{{ \'CORE.DIALOG.DOWNLOAD_ZIP.TITLE\' | translate }}</h1>\n<div mat-dialog-content>\n    <mat-progress-bar color="primary" mode="indeterminate"></mat-progress-bar>\n</div>\n<mat-dialog-actions align="end">\n    <button mat-button color="primary" id="cancel-button" (click)="cancelDownload()">\n        {{ \'CORE.DIALOG.DOWNLOAD_ZIP.ACTIONS.CANCEL\' | translate }}\n    </button>\n</mat-dialog-actions>\n',
        host: { class: 'adf-download-zip-dialog' },
        encapsulation: ViewEncapsulation.None,
        styles: [
          '.adf-download-zip-dialog .mat-dialog-actions .mat-button-wrapper{text-transform:uppercase}'
        ]
      }
    ]
  }
];
/** @nocollapse */
DownloadZipDialogComponent.ctorParameters = () => [
  { type: MatDialogRef },
  { type: undefined, decorators: [{ type: Inject, args: [MAT_DIALOG_DATA] }] },
  { type: LogService },
  { type: DownloadZipService }
];
if (false) {
  /** @type {?} */
  DownloadZipDialogComponent.prototype.cancelled;
  /** @type {?} */
  DownloadZipDialogComponent.prototype.downloadId;
  /**
   * @type {?}
   * @private
   */
  DownloadZipDialogComponent.prototype.dialogRef;
  /** @type {?} */
  DownloadZipDialogComponent.prototype.data;
  /**
   * @type {?}
   * @private
   */
  DownloadZipDialogComponent.prototype.logService;
  /**
   * @type {?}
   * @private
   */
  DownloadZipDialogComponent.prototype.downloadZipService;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG93bmxvYWQtemlwLmRpYWxvZy5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BhbGZyZXNjby9hZGYtY29yZS8iLCJzb3VyY2VzIjpbImRpYWxvZ3MvZG93bmxvYWQtemlwL2Rvd25sb2FkLXppcC5kaWFsb2cudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFpQkEsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQVUsaUJBQWlCLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDN0UsT0FBTyxFQUFFLGVBQWUsRUFBRSxZQUFZLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUVsRSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFDeEQsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0scUNBQXFDLENBQUM7QUFTekUsTUFBTSxPQUFPLDBCQUEwQjs7Ozs7OztJQU1uQyxZQUFvQixTQUFtRCxFQUVwRCxJQUFTLEVBQ1IsVUFBc0IsRUFDdEIsa0JBQXNDO1FBSnRDLGNBQVMsR0FBVCxTQUFTLENBQTBDO1FBRXBELFNBQUksR0FBSixJQUFJLENBQUs7UUFDUixlQUFVLEdBQVYsVUFBVSxDQUFZO1FBQ3RCLHVCQUFrQixHQUFsQixrQkFBa0IsQ0FBb0I7O1FBUDFELGNBQVMsR0FBRyxLQUFLLENBQUM7SUFRbEIsQ0FBQzs7OztJQUVELFFBQVE7UUFDSixJQUFJLElBQUksQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtZQUNoRSxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRTtnQkFDakIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2FBQ3ZDO2lCQUFNO2dCQUNILElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDO2FBQ3BDO1NBQ0o7SUFDTCxDQUFDOzs7O0lBRUQsY0FBYztRQUNWLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ3hELElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ2hDLENBQUM7Ozs7O0lBRUQsV0FBVyxDQUFDLE9BQWlCO1FBQ3pCLElBQUksT0FBTyxJQUFJLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1lBRS9CLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxjQUFjLENBQUMsRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDLFNBQVM7Ozs7WUFBQyxDQUFDLElBQW1CLEVBQUUsRUFBRTtnQkFDbEYsSUFBSSxJQUFJLElBQUksSUFBSSxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFBRTs7MEJBQy9CLEdBQUcsR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQztvQkFFdEUsSUFBSSxDQUFDLGtCQUFrQixDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLFNBQVM7Ozs7b0JBQUMsQ0FBQyxZQUF1QixFQUFFLEVBQUU7d0JBQ2pGLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDOzs4QkFDNUIsUUFBUSxHQUFHLFlBQVksQ0FBQyxLQUFLLENBQUMsSUFBSTt3QkFDeEMsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQzt3QkFDaEMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFBRSxHQUFHLEVBQUUsUUFBUSxDQUFDLENBQUM7b0JBQ3ZELENBQUMsRUFBQyxDQUFDO2lCQUNOO1lBQ0wsQ0FBQyxFQUFDLENBQUM7U0FDTjtJQUNMLENBQUM7Ozs7Ozs7SUFFRCxlQUFlLENBQUMsVUFBa0IsRUFBRSxHQUFXLEVBQUUsUUFBZ0I7UUFDN0QsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO1lBQ2hCLE9BQU87U0FDVjtRQUVELElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLENBQUMsU0FBUzs7OztRQUFDLENBQUMsYUFBNEIsRUFBRSxFQUFFO1lBQ3ZGLElBQUksYUFBYSxDQUFDLEtBQUssRUFBRTtnQkFDckIsSUFBSSxhQUFhLENBQUMsS0FBSyxDQUFDLE1BQU0sS0FBSyxNQUFNLEVBQUU7b0JBQ3ZDLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLFFBQVEsQ0FBQyxDQUFDO2lCQUNoQztxQkFBTTtvQkFDSCxVQUFVOzs7b0JBQUMsR0FBRyxFQUFFO3dCQUNaLElBQUksQ0FBQyxlQUFlLENBQUMsVUFBVSxFQUFFLEdBQUcsRUFBRSxRQUFRLENBQUMsQ0FBQztvQkFDcEQsQ0FBQyxHQUFFLElBQUksQ0FBQyxDQUFDO2lCQUNaO2FBQ0o7UUFDTCxDQUFDLEVBQUMsQ0FBQztJQUNQLENBQUM7Ozs7OztJQUVELFFBQVEsQ0FBQyxHQUFXLEVBQUUsUUFBZ0I7UUFDbEMsSUFBSSxHQUFHLElBQUksUUFBUSxFQUFFOztrQkFDWCxJQUFJLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUM7WUFFeEMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO1lBQzVCLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO1lBQ3pCLElBQUksQ0FBQyxJQUFJLEdBQUcsR0FBRyxDQUFDO1lBRWhCLFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ2hDLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUNiLFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ25DO1FBQ0QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDL0IsQ0FBQzs7O1lBckZKLFNBQVMsU0FBQztnQkFDUCxRQUFRLEVBQUUseUJBQXlCO2dCQUNuQywwYkFBeUM7Z0JBRXpDLElBQUksRUFBRSxFQUFFLE9BQU8sRUFBRSx5QkFBeUIsRUFBRTtnQkFDNUMsYUFBYSxFQUFFLGlCQUFpQixDQUFDLElBQUk7O2FBQ3hDOzs7O1lBWHlCLFlBQVk7NENBbUJyQixNQUFNLFNBQUMsZUFBZTtZQWpCOUIsVUFBVTtZQUNWLGtCQUFrQjs7OztJQVl2QiwrQ0FBa0I7O0lBQ2xCLGdEQUFtQjs7Ozs7SUFFUCwrQ0FBMkQ7O0lBQzNELDBDQUNnQjs7Ozs7SUFDaEIsZ0RBQThCOzs7OztJQUM5Qix3REFBOEMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiFcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxOSBBbGZyZXNjbyBTb2Z0d2FyZSwgTHRkLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgeyBDb21wb25lbnQsIEluamVjdCwgT25Jbml0LCBWaWV3RW5jYXBzdWxhdGlvbiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTUFUX0RJQUxPR19EQVRBLCBNYXREaWFsb2dSZWYgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbCc7XG5pbXBvcnQgeyBEb3dubG9hZEVudHJ5LCBOb2RlRW50cnkgfSBmcm9tICdAYWxmcmVzY28vanMtYXBpJztcbmltcG9ydCB7IExvZ1NlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9sb2cuc2VydmljZSc7XG5pbXBvcnQgeyBEb3dubG9hZFppcFNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9kb3dubG9hZC16aXAuc2VydmljZSc7XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAnYWRmLWRvd25sb2FkLXppcC1kaWFsb2cnLFxuICAgIHRlbXBsYXRlVXJsOiAnLi9kb3dubG9hZC16aXAuZGlhbG9nLmh0bWwnLFxuICAgIHN0eWxlVXJsczogWycuL2Rvd25sb2FkLXppcC5kaWFsb2cuc2NzcyddLFxuICAgIGhvc3Q6IHsgJ2NsYXNzJzogJ2FkZi1kb3dubG9hZC16aXAtZGlhbG9nJyB9LFxuICAgIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmVcbn0pXG5leHBvcnQgY2xhc3MgRG93bmxvYWRaaXBEaWFsb2dDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuXG4gICAgLy8gZmxhZyBmb3IgYXN5bmMgdGhyZWFkc1xuICAgIGNhbmNlbGxlZCA9IGZhbHNlO1xuICAgIGRvd25sb2FkSWQ6IHN0cmluZztcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgZGlhbG9nUmVmOiBNYXREaWFsb2dSZWY8RG93bmxvYWRaaXBEaWFsb2dDb21wb25lbnQ+LFxuICAgICAgICAgICAgICAgIEBJbmplY3QoTUFUX0RJQUxPR19EQVRBKVxuICAgICAgICAgICAgICAgIHB1YmxpYyBkYXRhOiBhbnksXG4gICAgICAgICAgICAgICAgcHJpdmF0ZSBsb2dTZXJ2aWNlOiBMb2dTZXJ2aWNlLFxuICAgICAgICAgICAgICAgIHByaXZhdGUgZG93bmxvYWRaaXBTZXJ2aWNlOiBEb3dubG9hZFppcFNlcnZpY2UpIHtcbiAgICB9XG5cbiAgICBuZ09uSW5pdCgpIHtcbiAgICAgICAgaWYgKHRoaXMuZGF0YSAmJiB0aGlzLmRhdGEubm9kZUlkcyAmJiB0aGlzLmRhdGEubm9kZUlkcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuY2FuY2VsbGVkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5kb3dubG9hZFppcCh0aGlzLmRhdGEubm9kZUlkcyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMubG9nU2VydmljZS5sb2coJ0NhbmNlbGxlZCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgY2FuY2VsRG93bmxvYWQoKSB7XG4gICAgICAgIHRoaXMuY2FuY2VsbGVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5kb3dubG9hZFppcFNlcnZpY2UuY2FuY2VsRG93bmxvYWQodGhpcy5kb3dubG9hZElkKTtcbiAgICAgICAgdGhpcy5kaWFsb2dSZWYuY2xvc2UoZmFsc2UpO1xuICAgIH1cblxuICAgIGRvd25sb2FkWmlwKG5vZGVJZHM6IHN0cmluZ1tdKSB7XG4gICAgICAgIGlmIChub2RlSWRzICYmIG5vZGVJZHMubGVuZ3RoID4gMCkge1xuXG4gICAgICAgICAgICB0aGlzLmRvd25sb2FkWmlwU2VydmljZS5jcmVhdGVEb3dubG9hZCh7IG5vZGVJZHMgfSkuc3Vic2NyaWJlKChkYXRhOiBEb3dubG9hZEVudHJ5KSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGRhdGEgJiYgZGF0YS5lbnRyeSAmJiBkYXRhLmVudHJ5LmlkKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHVybCA9IHRoaXMuZG93bmxvYWRaaXBTZXJ2aWNlLmdldENvbnRlbnRVcmwoZGF0YS5lbnRyeS5pZCwgdHJ1ZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kb3dubG9hZFppcFNlcnZpY2UuZ2V0Tm9kZShkYXRhLmVudHJ5LmlkKS5zdWJzY3JpYmUoKGRvd25sb2FkTm9kZTogTm9kZUVudHJ5KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxvZ1NlcnZpY2UubG9nKGRvd25sb2FkTm9kZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBmaWxlTmFtZSA9IGRvd25sb2FkTm9kZS5lbnRyeS5uYW1lO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kb3dubG9hZElkID0gZGF0YS5lbnRyeS5pZDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMud2FpdEFuZERvd25sb2FkKGRhdGEuZW50cnkuaWQsIHVybCwgZmlsZU5hbWUpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHdhaXRBbmREb3dubG9hZChkb3dubG9hZElkOiBzdHJpbmcsIHVybDogc3RyaW5nLCBmaWxlTmFtZTogc3RyaW5nKSB7XG4gICAgICAgIGlmICh0aGlzLmNhbmNlbGxlZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5kb3dubG9hZFppcFNlcnZpY2UuZ2V0RG93bmxvYWQoZG93bmxvYWRJZCkuc3Vic2NyaWJlKChkb3dubG9hZEVudHJ5OiBEb3dubG9hZEVudHJ5KSA9PiB7XG4gICAgICAgICAgICBpZiAoZG93bmxvYWRFbnRyeS5lbnRyeSkge1xuICAgICAgICAgICAgICAgIGlmIChkb3dubG9hZEVudHJ5LmVudHJ5LnN0YXR1cyA9PT0gJ0RPTkUnKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZG93bmxvYWQodXJsLCBmaWxlTmFtZSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLndhaXRBbmREb3dubG9hZChkb3dubG9hZElkLCB1cmwsIGZpbGVOYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgfSwgMTAwMCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBkb3dubG9hZCh1cmw6IHN0cmluZywgZmlsZU5hbWU6IHN0cmluZykge1xuICAgICAgICBpZiAodXJsICYmIGZpbGVOYW1lKSB7XG4gICAgICAgICAgICBjb25zdCBsaW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuXG4gICAgICAgICAgICBsaW5rLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgICAgICBsaW5rLmRvd25sb2FkID0gZmlsZU5hbWU7XG4gICAgICAgICAgICBsaW5rLmhyZWYgPSB1cmw7XG5cbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQobGluayk7XG4gICAgICAgICAgICBsaW5rLmNsaWNrKCk7XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGxpbmspO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZGlhbG9nUmVmLmNsb3NlKHRydWUpO1xuICAgIH1cbn1cbiJdfQ==
