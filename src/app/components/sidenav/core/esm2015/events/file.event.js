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
import { FileUploadStatus } from '../models/file.model';
export class FileUploadEvent {
  /**
   * @param {?} file
   * @param {?=} status
   * @param {?=} error
   */
  constructor(file, status = FileUploadStatus.Pending, error = null) {
    this.file = file;
    this.status = status;
    this.error = error;
  }
}
if (false) {
  /** @type {?} */
  FileUploadEvent.prototype.file;
  /** @type {?} */
  FileUploadEvent.prototype.status;
  /** @type {?} */
  FileUploadEvent.prototype.error;
}
export class FileUploadCompleteEvent extends FileUploadEvent {
  /**
   * @param {?} file
   * @param {?=} totalComplete
   * @param {?=} data
   * @param {?=} totalAborted
   */
  constructor(file, totalComplete = 0, data, totalAborted = 0) {
    super(file, FileUploadStatus.Complete);
    this.totalComplete = totalComplete;
    this.data = data;
    this.totalAborted = totalAborted;
  }
}
if (false) {
  /** @type {?} */
  FileUploadCompleteEvent.prototype.totalComplete;
  /** @type {?} */
  FileUploadCompleteEvent.prototype.data;
  /** @type {?} */
  FileUploadCompleteEvent.prototype.totalAborted;
}
export class FileUploadDeleteEvent extends FileUploadEvent {
  /**
   * @param {?} file
   * @param {?=} totalComplete
   */
  constructor(file, totalComplete = 0) {
    super(file, FileUploadStatus.Deleted);
    this.totalComplete = totalComplete;
  }
}
if (false) {
  /** @type {?} */
  FileUploadDeleteEvent.prototype.totalComplete;
}
export class FileUploadErrorEvent extends FileUploadEvent {
  /**
   * @param {?} file
   * @param {?} error
   * @param {?=} totalError
   */
  constructor(file, error, totalError = 0) {
    super(file, FileUploadStatus.Error);
    this.error = error;
    this.totalError = totalError;
  }
}
if (false) {
  /** @type {?} */
  FileUploadErrorEvent.prototype.error;
  /** @type {?} */
  FileUploadErrorEvent.prototype.totalError;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZS5ldmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BhbGZyZXNjby9hZGYtY29yZS8iLCJzb3VyY2VzIjpbImV2ZW50cy9maWxlLmV2ZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBaUJBLE9BQU8sRUFBYSxnQkFBZ0IsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBRW5FLE1BQU0sT0FBTyxlQUFlOzs7Ozs7SUFFeEIsWUFDb0IsSUFBZSxFQUNmLFNBQTJCLGdCQUFnQixDQUFDLE9BQU8sRUFDbkQsUUFBYSxJQUFJO1FBRmpCLFNBQUksR0FBSixJQUFJLENBQVc7UUFDZixXQUFNLEdBQU4sTUFBTSxDQUE2QztRQUNuRCxVQUFLLEdBQUwsS0FBSyxDQUFZO0lBQ3JDLENBQUM7Q0FFSjs7O0lBTE8sK0JBQStCOztJQUMvQixpQ0FBbUU7O0lBQ25FLGdDQUFpQzs7QUFLekMsTUFBTSxPQUFPLHVCQUF3QixTQUFRLGVBQWU7Ozs7Ozs7SUFFeEQsWUFBWSxJQUFlLEVBQVMsZ0JBQXdCLENBQUMsRUFBUyxJQUFVLEVBQVMsZUFBdUIsQ0FBQztRQUM3RyxLQUFLLENBQUMsSUFBSSxFQUFFLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBRFAsa0JBQWEsR0FBYixhQUFhLENBQVk7UUFBUyxTQUFJLEdBQUosSUFBSSxDQUFNO1FBQVMsaUJBQVksR0FBWixZQUFZLENBQVk7SUFFakgsQ0FBQztDQUVKOzs7SUFKZ0MsZ0RBQWdDOztJQUFFLHVDQUFpQjs7SUFBRSwrQ0FBK0I7O0FBTXJILE1BQU0sT0FBTyxxQkFBc0IsU0FBUSxlQUFlOzs7OztJQUV0RCxZQUFZLElBQWUsRUFBUyxnQkFBd0IsQ0FBQztRQUN6RCxLQUFLLENBQUMsSUFBSSxFQUFFLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRE4sa0JBQWEsR0FBYixhQUFhLENBQVk7SUFFN0QsQ0FBQztDQUVKOzs7SUFKZ0MsOENBQWdDOztBQU1qRSxNQUFNLE9BQU8sb0JBQXFCLFNBQVEsZUFBZTs7Ozs7O0lBRXJELFlBQVksSUFBZSxFQUFTLEtBQVUsRUFBUyxhQUFxQixDQUFDO1FBQ3pFLEtBQUssQ0FBQyxJQUFJLEVBQUUsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLENBQUM7UUFESixVQUFLLEdBQUwsS0FBSyxDQUFLO1FBQVMsZUFBVSxHQUFWLFVBQVUsQ0FBWTtJQUU3RSxDQUFDO0NBRUo7OztJQUpnQyxxQ0FBaUI7O0lBQUUsMENBQTZCIiwic291cmNlc0NvbnRlbnQiOlsiLyohXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTkgQWxmcmVzY28gU29mdHdhcmUsIEx0ZC5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0IHsgRmlsZU1vZGVsLCBGaWxlVXBsb2FkU3RhdHVzIH0gZnJvbSAnLi4vbW9kZWxzL2ZpbGUubW9kZWwnO1xuXG5leHBvcnQgY2xhc3MgRmlsZVVwbG9hZEV2ZW50IHtcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBwdWJsaWMgcmVhZG9ubHkgZmlsZTogRmlsZU1vZGVsLFxuICAgICAgICBwdWJsaWMgcmVhZG9ubHkgc3RhdHVzOiBGaWxlVXBsb2FkU3RhdHVzID0gRmlsZVVwbG9hZFN0YXR1cy5QZW5kaW5nLFxuICAgICAgICBwdWJsaWMgcmVhZG9ubHkgZXJyb3I6IGFueSA9IG51bGwpIHtcbiAgICB9XG5cbn1cblxuZXhwb3J0IGNsYXNzIEZpbGVVcGxvYWRDb21wbGV0ZUV2ZW50IGV4dGVuZHMgRmlsZVVwbG9hZEV2ZW50IHtcblxuICAgIGNvbnN0cnVjdG9yKGZpbGU6IEZpbGVNb2RlbCwgcHVibGljIHRvdGFsQ29tcGxldGU6IG51bWJlciA9IDAsIHB1YmxpYyBkYXRhPzogYW55LCBwdWJsaWMgdG90YWxBYm9ydGVkOiBudW1iZXIgPSAwKSB7XG4gICAgICAgIHN1cGVyKGZpbGUsIEZpbGVVcGxvYWRTdGF0dXMuQ29tcGxldGUpO1xuICAgIH1cblxufVxuXG5leHBvcnQgY2xhc3MgRmlsZVVwbG9hZERlbGV0ZUV2ZW50IGV4dGVuZHMgRmlsZVVwbG9hZEV2ZW50IHtcblxuICAgIGNvbnN0cnVjdG9yKGZpbGU6IEZpbGVNb2RlbCwgcHVibGljIHRvdGFsQ29tcGxldGU6IG51bWJlciA9IDApIHtcbiAgICAgICAgc3VwZXIoZmlsZSwgRmlsZVVwbG9hZFN0YXR1cy5EZWxldGVkKTtcbiAgICB9XG5cbn1cblxuZXhwb3J0IGNsYXNzIEZpbGVVcGxvYWRFcnJvckV2ZW50IGV4dGVuZHMgRmlsZVVwbG9hZEV2ZW50IHtcblxuICAgIGNvbnN0cnVjdG9yKGZpbGU6IEZpbGVNb2RlbCwgcHVibGljIGVycm9yOiBhbnksIHB1YmxpYyB0b3RhbEVycm9yOiBudW1iZXIgPSAwKSB7XG4gICAgICAgIHN1cGVyKGZpbGUsIEZpbGVVcGxvYWRTdGF0dXMuRXJyb3IpO1xuICAgIH1cblxufVxuIl19
