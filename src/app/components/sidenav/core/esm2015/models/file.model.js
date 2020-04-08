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
/**
 * @record
 */
export function FileUploadProgress() {}
if (false) {
  /** @type {?} */
  FileUploadProgress.prototype.loaded;
  /** @type {?} */
  FileUploadProgress.prototype.total;
  /** @type {?} */
  FileUploadProgress.prototype.percent;
}
export class FileUploadOptions {}
if (false) {
  /** @type {?} */
  FileUploadOptions.prototype.comment;
  /** @type {?} */
  FileUploadOptions.prototype.newVersion;
  /** @type {?} */
  FileUploadOptions.prototype.majorVersion;
  /** @type {?} */
  FileUploadOptions.prototype.parentId;
  /** @type {?} */
  FileUploadOptions.prototype.path;
  /** @type {?} */
  FileUploadOptions.prototype.nodeType;
  /** @type {?} */
  FileUploadOptions.prototype.properties;
  /** @type {?} */
  FileUploadOptions.prototype.association;
  /** @type {?} */
  FileUploadOptions.prototype.secondaryChildren;
  /** @type {?} */
  FileUploadOptions.prototype.targets;
}
/** @enum {number} */
const FileUploadStatus = {
  Pending: 0,
  Complete: 1,
  Starting: 2,
  Progress: 3,
  Cancelled: 4,
  Aborted: 5,
  Error: 6,
  Deleted: 7
};
export { FileUploadStatus };
FileUploadStatus[FileUploadStatus.Pending] = 'Pending';
FileUploadStatus[FileUploadStatus.Complete] = 'Complete';
FileUploadStatus[FileUploadStatus.Starting] = 'Starting';
FileUploadStatus[FileUploadStatus.Progress] = 'Progress';
FileUploadStatus[FileUploadStatus.Cancelled] = 'Cancelled';
FileUploadStatus[FileUploadStatus.Aborted] = 'Aborted';
FileUploadStatus[FileUploadStatus.Error] = 'Error';
FileUploadStatus[FileUploadStatus.Deleted] = 'Deleted';
export class FileModel {
  /**
   * @param {?} file
   * @param {?=} options
   * @param {?=} id
   */
  constructor(file, options, id) {
    this.status = FileUploadStatus.Pending;
    this.file = file;
    this.id = id;
    this.name = file.name;
    this.size = file.size;
    this.data = null;
    this.errorCode = null;
    this.progress = {
      loaded: 0,
      total: 0,
      percent: 0
    };
    this.options = Object.assign(
      {},
      {
        newVersion: false
      },
      options
    );
  }
  /**
   * @return {?}
   */
  get extension() {
    return this.name.slice(
      (Math.max(0, this.name.lastIndexOf('.')) || Infinity) + 1
    );
  }
}
if (false) {
  /** @type {?} */
  FileModel.prototype.name;
  /** @type {?} */
  FileModel.prototype.size;
  /** @type {?} */
  FileModel.prototype.file;
  /** @type {?} */
  FileModel.prototype.id;
  /** @type {?} */
  FileModel.prototype.status;
  /** @type {?} */
  FileModel.prototype.errorCode;
  /** @type {?} */
  FileModel.prototype.progress;
  /** @type {?} */
  FileModel.prototype.options;
  /** @type {?} */
  FileModel.prototype.data;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZS5tb2RlbC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BhbGZyZXNjby9hZGYtY29yZS8iLCJzb3VyY2VzIjpbIm1vZGVscy9maWxlLm1vZGVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBbUJBLHdDQUlDOzs7SUFIRyxvQ0FBZTs7SUFDZixtQ0FBYzs7SUFDZCxxQ0FBZ0I7O0FBR3BCLE1BQU0sT0FBTyxpQkFBaUI7Q0FXN0I7OztJQVZHLG9DQUFpQjs7SUFDakIsdUNBQXFCOztJQUNyQix5Q0FBdUI7O0lBQ3ZCLHFDQUFrQjs7SUFDbEIsaUNBQWM7O0lBQ2QscUNBQWtCOztJQUNsQix1Q0FBaUI7O0lBQ2pCLHdDQUFrQjs7SUFDbEIsOENBQXFDOztJQUNyQyxvQ0FBNEI7Ozs7SUFJNUIsVUFBVztJQUNYLFdBQVk7SUFDWixXQUFZO0lBQ1osV0FBWTtJQUNaLFlBQWE7SUFDYixVQUFXO0lBQ1gsUUFBUztJQUNULFVBQVc7Ozs7Ozs7Ozs7O0FBR2YsTUFBTSxPQUFPLFNBQVM7Ozs7OztJQVlsQixZQUFZLElBQVUsRUFBRSxPQUEyQixFQUFFLEVBQVc7UUFOaEUsV0FBTSxHQUFxQixnQkFBZ0IsQ0FBQyxPQUFPLENBQUM7UUFPaEQsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFDakIsSUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUM7UUFDYixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7UUFDdEIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2pCLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO1FBRXRCLElBQUksQ0FBQyxRQUFRLEdBQUc7WUFDWixNQUFNLEVBQUUsQ0FBQztZQUNULEtBQUssRUFBRSxDQUFDO1lBQ1IsT0FBTyxFQUFFLENBQUM7U0FDYixDQUFDO1FBRUYsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRTtZQUM3QixVQUFVLEVBQUUsS0FBSztTQUNwQixFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ2hCLENBQUM7Ozs7SUFFRCxJQUFJLFNBQVM7UUFDVCxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUN0RixDQUFDO0NBQ0o7OztJQWpDRyx5QkFBc0I7O0lBQ3RCLHlCQUFzQjs7SUFDdEIseUJBQW9COztJQUVwQix1QkFBVzs7SUFDWCwyQkFBb0Q7O0lBQ3BELDhCQUFrQjs7SUFDbEIsNkJBQTZCOztJQUM3Qiw0QkFBMkI7O0lBQzNCLHlCQUFVIiwic291cmNlc0NvbnRlbnQiOlsiLyohXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTkgQWxmcmVzY28gU29mdHdhcmUsIEx0ZC5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0IHsgQXNzb2NDaGlsZEJvZHksIEFzc29jaWF0aW9uQm9keSB9IGZyb20gJ0BhbGZyZXNjby9qcy1hcGknO1xuXG5leHBvcnQgaW50ZXJmYWNlIEZpbGVVcGxvYWRQcm9ncmVzcyB7XG4gICAgbG9hZGVkOiBudW1iZXI7XG4gICAgdG90YWw6IG51bWJlcjtcbiAgICBwZXJjZW50OiBudW1iZXI7XG59XG5cbmV4cG9ydCBjbGFzcyBGaWxlVXBsb2FkT3B0aW9ucyB7XG4gICAgY29tbWVudD86IHN0cmluZztcbiAgICBuZXdWZXJzaW9uPzogYm9vbGVhbjtcbiAgICBtYWpvclZlcnNpb24/OiBib29sZWFuO1xuICAgIHBhcmVudElkPzogc3RyaW5nO1xuICAgIHBhdGg/OiBzdHJpbmc7XG4gICAgbm9kZVR5cGU/OiBzdHJpbmc7XG4gICAgcHJvcGVydGllcz86IGFueTtcbiAgICBhc3NvY2lhdGlvbj86IGFueTtcbiAgICBzZWNvbmRhcnlDaGlsZHJlbj86IEFzc29jQ2hpbGRCb2R5W107XG4gICAgdGFyZ2V0cz86IEFzc29jaWF0aW9uQm9keVtdO1xufVxuXG5leHBvcnQgZW51bSBGaWxlVXBsb2FkU3RhdHVzIHtcbiAgICBQZW5kaW5nID0gMCxcbiAgICBDb21wbGV0ZSA9IDEsXG4gICAgU3RhcnRpbmcgPSAyLFxuICAgIFByb2dyZXNzID0gMyxcbiAgICBDYW5jZWxsZWQgPSA0LFxuICAgIEFib3J0ZWQgPSA1LFxuICAgIEVycm9yID0gNixcbiAgICBEZWxldGVkID0gN1xufVxuXG5leHBvcnQgY2xhc3MgRmlsZU1vZGVsIHtcbiAgICByZWFkb25seSBuYW1lOiBzdHJpbmc7XG4gICAgcmVhZG9ubHkgc2l6ZTogbnVtYmVyO1xuICAgIHJlYWRvbmx5IGZpbGU6IEZpbGU7XG5cbiAgICBpZDogc3RyaW5nO1xuICAgIHN0YXR1czogRmlsZVVwbG9hZFN0YXR1cyA9IEZpbGVVcGxvYWRTdGF0dXMuUGVuZGluZztcbiAgICBlcnJvckNvZGU6IG51bWJlcjtcbiAgICBwcm9ncmVzczogRmlsZVVwbG9hZFByb2dyZXNzO1xuICAgIG9wdGlvbnM6IEZpbGVVcGxvYWRPcHRpb25zO1xuICAgIGRhdGE6IGFueTtcblxuICAgIGNvbnN0cnVjdG9yKGZpbGU6IEZpbGUsIG9wdGlvbnM/OiBGaWxlVXBsb2FkT3B0aW9ucywgaWQ/OiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5maWxlID0gZmlsZTtcbiAgICAgICAgdGhpcy5pZCA9IGlkO1xuICAgICAgICB0aGlzLm5hbWUgPSBmaWxlLm5hbWU7XG4gICAgICAgIHRoaXMuc2l6ZSA9IGZpbGUuc2l6ZTtcbiAgICAgICAgdGhpcy5kYXRhID0gbnVsbDtcbiAgICAgICAgdGhpcy5lcnJvckNvZGUgPSBudWxsO1xuXG4gICAgICAgIHRoaXMucHJvZ3Jlc3MgPSB7XG4gICAgICAgICAgICBsb2FkZWQ6IDAsXG4gICAgICAgICAgICB0b3RhbDogMCxcbiAgICAgICAgICAgIHBlcmNlbnQ6IDBcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLm9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHt9LCB7XG4gICAgICAgICAgICBuZXdWZXJzaW9uOiBmYWxzZVxuICAgICAgICB9LCBvcHRpb25zKTtcbiAgICB9XG5cbiAgICBnZXQgZXh0ZW5zaW9uKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLm5hbWUuc2xpY2UoKE1hdGgubWF4KDAsIHRoaXMubmFtZS5sYXN0SW5kZXhPZignLicpKSB8fCBJbmZpbml0eSkgKyAxKTtcbiAgICB9XG59XG4iXX0=
