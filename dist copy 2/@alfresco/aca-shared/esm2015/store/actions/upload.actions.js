/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
/** @enum {string} */
const UploadActionTypes = {
  UploadFiles: 'UPLOAD_FILES',
  UploadFolder: 'UPLOAD_FOLDER',
  UploadFileVersion: 'UPLOAD_FILE_VERSION'
};
export { UploadActionTypes };
export class UploadFilesAction {
  /**
   * @param {?} payload
   */
  constructor(payload) {
    this.payload = payload;
    this.type = UploadActionTypes.UploadFiles;
  }
}
if (false) {
  /** @type {?} */
  UploadFilesAction.prototype.type;
  /** @type {?} */
  UploadFilesAction.prototype.payload;
}
export class UploadFolderAction {
  /**
   * @param {?} payload
   */
  constructor(payload) {
    this.payload = payload;
    this.type = UploadActionTypes.UploadFolder;
  }
}
if (false) {
  /** @type {?} */
  UploadFolderAction.prototype.type;
  /** @type {?} */
  UploadFolderAction.prototype.payload;
}
export class UploadFileVersionAction {
  constructor() {
    this.type = UploadActionTypes.UploadFileVersion;
  }
}
if (false) {
  /** @type {?} */
  UploadFileVersionAction.prototype.type;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBsb2FkLmFjdGlvbnMuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AYWxmcmVzY28vYWNhLXNoYXJlZC9zdG9yZS8iLCJzb3VyY2VzIjpbImFjdGlvbnMvdXBsb2FkLmFjdGlvbnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBNEJFLGFBQWMsY0FBYztJQUM1QixjQUFlLGVBQWU7SUFDOUIsbUJBQW9CLHFCQUFxQjs7O0FBRzNDLE1BQU0sT0FBTyxpQkFBaUI7Ozs7SUFHNUIsWUFBbUIsT0FBWTtRQUFaLFlBQU8sR0FBUCxPQUFPLENBQUs7UUFGdEIsU0FBSSxHQUFHLGlCQUFpQixDQUFDLFdBQVcsQ0FBQztJQUVaLENBQUM7Q0FDcEM7OztJQUhDLGlDQUE4Qzs7SUFFbEMsb0NBQW1COztBQUdqQyxNQUFNLE9BQU8sa0JBQWtCOzs7O0lBRzdCLFlBQW1CLE9BQVk7UUFBWixZQUFPLEdBQVAsT0FBTyxDQUFLO1FBRnRCLFNBQUksR0FBRyxpQkFBaUIsQ0FBQyxZQUFZLENBQUM7SUFFYixDQUFDO0NBQ3BDOzs7SUFIQyxrQ0FBK0M7O0lBRW5DLHFDQUFtQjs7QUFHakMsTUFBTSxPQUFPLHVCQUF1QjtJQUFwQztRQUNXLFNBQUksR0FBRyxpQkFBaUIsQ0FBQyxpQkFBaUIsQ0FBQztJQUN0RCxDQUFDO0NBQUE7OztJQURDLHVDQUFvRCIsInNvdXJjZXNDb250ZW50IjpbIi8qIVxuICogQGxpY2Vuc2VcbiAqIEFsZnJlc2NvIEV4YW1wbGUgQ29udGVudCBBcHBsaWNhdGlvblxuICpcbiAqIENvcHlyaWdodCAoQykgMjAwNSAtIDIwMjAgQWxmcmVzY28gU29mdHdhcmUgTGltaXRlZFxuICpcbiAqIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIHRoZSBBbGZyZXNjbyBFeGFtcGxlIENvbnRlbnQgQXBwbGljYXRpb24uXG4gKiBJZiB0aGUgc29mdHdhcmUgd2FzIHB1cmNoYXNlZCB1bmRlciBhIHBhaWQgQWxmcmVzY28gbGljZW5zZSwgdGhlIHRlcm1zIG9mXG4gKiB0aGUgcGFpZCBsaWNlbnNlIGFncmVlbWVudCB3aWxsIHByZXZhaWwuICBPdGhlcndpc2UsIHRoZSBzb2Z0d2FyZSBpc1xuICogcHJvdmlkZWQgdW5kZXIgdGhlIGZvbGxvd2luZyBvcGVuIHNvdXJjZSBsaWNlbnNlIHRlcm1zOlxuICpcbiAqIFRoZSBBbGZyZXNjbyBFeGFtcGxlIENvbnRlbnQgQXBwbGljYXRpb24gaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuICogaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgTGVzc2VyIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG4gKiB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuICogKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cbiAqXG4gKiBUaGUgQWxmcmVzY28gRXhhbXBsZSBDb250ZW50IEFwcGxpY2F0aW9uIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG4gKiBidXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuICogTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuICogR05VIExlc3NlciBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG4gKlxuICogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIExlc3NlciBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiBhbG9uZyB3aXRoIEFsZnJlc2NvLiBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG4gKi9cblxuaW1wb3J0IHsgQWN0aW9uIH0gZnJvbSAnQG5ncngvc3RvcmUnO1xuXG5leHBvcnQgZW51bSBVcGxvYWRBY3Rpb25UeXBlcyB7XG4gIFVwbG9hZEZpbGVzID0gJ1VQTE9BRF9GSUxFUycsXG4gIFVwbG9hZEZvbGRlciA9ICdVUExPQURfRk9MREVSJyxcbiAgVXBsb2FkRmlsZVZlcnNpb24gPSAnVVBMT0FEX0ZJTEVfVkVSU0lPTidcbn1cblxuZXhwb3J0IGNsYXNzIFVwbG9hZEZpbGVzQWN0aW9uIGltcGxlbWVudHMgQWN0aW9uIHtcbiAgcmVhZG9ubHkgdHlwZSA9IFVwbG9hZEFjdGlvblR5cGVzLlVwbG9hZEZpbGVzO1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBwYXlsb2FkOiBhbnkpIHt9XG59XG5cbmV4cG9ydCBjbGFzcyBVcGxvYWRGb2xkZXJBY3Rpb24gaW1wbGVtZW50cyBBY3Rpb24ge1xuICByZWFkb25seSB0eXBlID0gVXBsb2FkQWN0aW9uVHlwZXMuVXBsb2FkRm9sZGVyO1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBwYXlsb2FkOiBhbnkpIHt9XG59XG5cbmV4cG9ydCBjbGFzcyBVcGxvYWRGaWxlVmVyc2lvbkFjdGlvbiBpbXBsZW1lbnRzIEFjdGlvbiB7XG4gIHJlYWRvbmx5IHR5cGUgPSBVcGxvYWRBY3Rpb25UeXBlcy5VcGxvYWRGaWxlVmVyc2lvbjtcbn1cbiJdfQ==
