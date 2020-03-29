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
var UploadActionTypes = {
  UploadFiles: 'UPLOAD_FILES',
  UploadFolder: 'UPLOAD_FOLDER',
  UploadFileVersion: 'UPLOAD_FILE_VERSION'
};
export { UploadActionTypes };
var UploadFilesAction = /** @class */ (function() {
  function UploadFilesAction(payload) {
    this.payload = payload;
    this.type = UploadActionTypes.UploadFiles;
  }
  return UploadFilesAction;
})();
export { UploadFilesAction };
if (false) {
  /** @type {?} */
  UploadFilesAction.prototype.type;
  /** @type {?} */
  UploadFilesAction.prototype.payload;
}
var UploadFolderAction = /** @class */ (function() {
  function UploadFolderAction(payload) {
    this.payload = payload;
    this.type = UploadActionTypes.UploadFolder;
  }
  return UploadFolderAction;
})();
export { UploadFolderAction };
if (false) {
  /** @type {?} */
  UploadFolderAction.prototype.type;
  /** @type {?} */
  UploadFolderAction.prototype.payload;
}
var UploadFileVersionAction = /** @class */ (function() {
  function UploadFileVersionAction() {
    this.type = UploadActionTypes.UploadFileVersion;
  }
  return UploadFileVersionAction;
})();
export { UploadFileVersionAction };
if (false) {
  /** @type {?} */
  UploadFileVersionAction.prototype.type;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBsb2FkLmFjdGlvbnMuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AYWxmcmVzY28vYWNhLXNoYXJlZC9zdG9yZS8iLCJzb3VyY2VzIjpbImFjdGlvbnMvdXBsb2FkLmFjdGlvbnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBNEJFLGFBQWMsY0FBYztJQUM1QixjQUFlLGVBQWU7SUFDOUIsbUJBQW9CLHFCQUFxQjs7O0FBRzNDO0lBR0UsMkJBQW1CLE9BQVk7UUFBWixZQUFPLEdBQVAsT0FBTyxDQUFLO1FBRnRCLFNBQUksR0FBRyxpQkFBaUIsQ0FBQyxXQUFXLENBQUM7SUFFWixDQUFDO0lBQ3JDLHdCQUFDO0FBQUQsQ0FBQyxBQUpELElBSUM7Ozs7SUFIQyxpQ0FBOEM7O0lBRWxDLG9DQUFtQjs7QUFHakM7SUFHRSw0QkFBbUIsT0FBWTtRQUFaLFlBQU8sR0FBUCxPQUFPLENBQUs7UUFGdEIsU0FBSSxHQUFHLGlCQUFpQixDQUFDLFlBQVksQ0FBQztJQUViLENBQUM7SUFDckMseUJBQUM7QUFBRCxDQUFDLEFBSkQsSUFJQzs7OztJQUhDLGtDQUErQzs7SUFFbkMscUNBQW1COztBQUdqQztJQUFBO1FBQ1csU0FBSSxHQUFHLGlCQUFpQixDQUFDLGlCQUFpQixDQUFDO0lBQ3RELENBQUM7SUFBRCw4QkFBQztBQUFELENBQUMsQUFGRCxJQUVDOzs7O0lBREMsdUNBQW9EIiwic291cmNlc0NvbnRlbnQiOlsiLyohXG4gKiBAbGljZW5zZVxuICogQWxmcmVzY28gRXhhbXBsZSBDb250ZW50IEFwcGxpY2F0aW9uXG4gKlxuICogQ29weXJpZ2h0IChDKSAyMDA1IC0gMjAyMCBBbGZyZXNjbyBTb2Z0d2FyZSBMaW1pdGVkXG4gKlxuICogVGhpcyBmaWxlIGlzIHBhcnQgb2YgdGhlIEFsZnJlc2NvIEV4YW1wbGUgQ29udGVudCBBcHBsaWNhdGlvbi5cbiAqIElmIHRoZSBzb2Z0d2FyZSB3YXMgcHVyY2hhc2VkIHVuZGVyIGEgcGFpZCBBbGZyZXNjbyBsaWNlbnNlLCB0aGUgdGVybXMgb2ZcbiAqIHRoZSBwYWlkIGxpY2Vuc2UgYWdyZWVtZW50IHdpbGwgcHJldmFpbC4gIE90aGVyd2lzZSwgdGhlIHNvZnR3YXJlIGlzXG4gKiBwcm92aWRlZCB1bmRlciB0aGUgZm9sbG93aW5nIG9wZW4gc291cmNlIGxpY2Vuc2UgdGVybXM6XG4gKlxuICogVGhlIEFsZnJlc2NvIEV4YW1wbGUgQ29udGVudCBBcHBsaWNhdGlvbiBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG4gKiBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBMZXNzZXIgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbiAqIHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4gKiAoYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuICpcbiAqIFRoZSBBbGZyZXNjbyBFeGFtcGxlIENvbnRlbnQgQXBwbGljYXRpb24gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbiAqIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG4gKiBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG4gKiBHTlUgTGVzc2VyIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cbiAqXG4gKiBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgTGVzc2VyIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIGFsb25nIHdpdGggQWxmcmVzY28uIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbiAqL1xuXG5pbXBvcnQgeyBBY3Rpb24gfSBmcm9tICdAbmdyeC9zdG9yZSc7XG5cbmV4cG9ydCBlbnVtIFVwbG9hZEFjdGlvblR5cGVzIHtcbiAgVXBsb2FkRmlsZXMgPSAnVVBMT0FEX0ZJTEVTJyxcbiAgVXBsb2FkRm9sZGVyID0gJ1VQTE9BRF9GT0xERVInLFxuICBVcGxvYWRGaWxlVmVyc2lvbiA9ICdVUExPQURfRklMRV9WRVJTSU9OJ1xufVxuXG5leHBvcnQgY2xhc3MgVXBsb2FkRmlsZXNBY3Rpb24gaW1wbGVtZW50cyBBY3Rpb24ge1xuICByZWFkb25seSB0eXBlID0gVXBsb2FkQWN0aW9uVHlwZXMuVXBsb2FkRmlsZXM7XG5cbiAgY29uc3RydWN0b3IocHVibGljIHBheWxvYWQ6IGFueSkge31cbn1cblxuZXhwb3J0IGNsYXNzIFVwbG9hZEZvbGRlckFjdGlvbiBpbXBsZW1lbnRzIEFjdGlvbiB7XG4gIHJlYWRvbmx5IHR5cGUgPSBVcGxvYWRBY3Rpb25UeXBlcy5VcGxvYWRGb2xkZXI7XG5cbiAgY29uc3RydWN0b3IocHVibGljIHBheWxvYWQ6IGFueSkge31cbn1cblxuZXhwb3J0IGNsYXNzIFVwbG9hZEZpbGVWZXJzaW9uQWN0aW9uIGltcGxlbWVudHMgQWN0aW9uIHtcbiAgcmVhZG9ubHkgdHlwZSA9IFVwbG9hZEFjdGlvblR5cGVzLlVwbG9hZEZpbGVWZXJzaW9uO1xufVxuIl19
