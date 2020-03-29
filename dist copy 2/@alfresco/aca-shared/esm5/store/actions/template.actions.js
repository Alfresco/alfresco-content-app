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
var TemplateActionTypes = {
  FileFromTemplate: 'FILE_FROM_TEMPLATE',
  FolderFromTemplate: 'FOLDER_FROM_TEMPLATE',
  CreateFromTemplate: 'CREATE_FROM_TEMPLATE',
  CreateFromTemplateSuccess: 'CREATE_FROM_TEMPLATE_SUCCESS'
};
export { TemplateActionTypes };
var FileFromTemplate = /** @class */ (function() {
  function FileFromTemplate() {
    this.type = TemplateActionTypes.FileFromTemplate;
  }
  return FileFromTemplate;
})();
export { FileFromTemplate };
if (false) {
  /** @type {?} */
  FileFromTemplate.prototype.type;
}
var FolderFromTemplate = /** @class */ (function() {
  function FolderFromTemplate() {
    this.type = TemplateActionTypes.FolderFromTemplate;
  }
  return FolderFromTemplate;
})();
export { FolderFromTemplate };
if (false) {
  /** @type {?} */
  FolderFromTemplate.prototype.type;
}
var CreateFromTemplate = /** @class */ (function() {
  function CreateFromTemplate(payload) {
    this.payload = payload;
    this.type = TemplateActionTypes.CreateFromTemplate;
  }
  return CreateFromTemplate;
})();
export { CreateFromTemplate };
if (false) {
  /** @type {?} */
  CreateFromTemplate.prototype.type;
  /** @type {?} */
  CreateFromTemplate.prototype.payload;
}
var CreateFromTemplateSuccess = /** @class */ (function() {
  function CreateFromTemplateSuccess(node) {
    this.node = node;
    this.type = TemplateActionTypes.CreateFromTemplateSuccess;
  }
  return CreateFromTemplateSuccess;
})();
export { CreateFromTemplateSuccess };
if (false) {
  /** @type {?} */
  CreateFromTemplateSuccess.prototype.type;
  /** @type {?} */
  CreateFromTemplateSuccess.prototype.node;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVtcGxhdGUuYWN0aW9ucy5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BhbGZyZXNjby9hY2Etc2hhcmVkL3N0b3JlLyIsInNvdXJjZXMiOlsiYWN0aW9ucy90ZW1wbGF0ZS5hY3Rpb25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQTZCRSxrQkFBbUIsb0JBQW9CO0lBQ3ZDLG9CQUFxQixzQkFBc0I7SUFDM0Msb0JBQXFCLHNCQUFzQjtJQUMzQywyQkFBNEIsOEJBQThCOzs7QUFHNUQ7SUFHRTtRQUZTLFNBQUksR0FBRyxtQkFBbUIsQ0FBQyxnQkFBZ0IsQ0FBQztJQUV0QyxDQUFDO0lBQ2xCLHVCQUFDO0FBQUQsQ0FBQyxBQUpELElBSUM7Ozs7SUFIQyxnQ0FBcUQ7O0FBS3ZEO0lBR0U7UUFGUyxTQUFJLEdBQUcsbUJBQW1CLENBQUMsa0JBQWtCLENBQUM7SUFFeEMsQ0FBQztJQUNsQix5QkFBQztBQUFELENBQUMsQUFKRCxJQUlDOzs7O0lBSEMsa0NBQXVEOztBQUt6RDtJQUdFLDRCQUFtQixPQUFhO1FBQWIsWUFBTyxHQUFQLE9BQU8sQ0FBTTtRQUZ2QixTQUFJLEdBQUcsbUJBQW1CLENBQUMsa0JBQWtCLENBQUM7SUFFcEIsQ0FBQztJQUN0Qyx5QkFBQztBQUFELENBQUMsQUFKRCxJQUlDOzs7O0lBSEMsa0NBQXVEOztJQUUzQyxxQ0FBb0I7O0FBR2xDO0lBR0UsbUNBQW1CLElBQVU7UUFBVixTQUFJLEdBQUosSUFBSSxDQUFNO1FBRnBCLFNBQUksR0FBRyxtQkFBbUIsQ0FBQyx5QkFBeUIsQ0FBQztJQUU5QixDQUFDO0lBQ25DLGdDQUFDO0FBQUQsQ0FBQyxBQUpELElBSUM7Ozs7SUFIQyx5Q0FBOEQ7O0lBRWxELHlDQUFpQiIsInNvdXJjZXNDb250ZW50IjpbIi8qIVxuICogQGxpY2Vuc2VcbiAqIEFsZnJlc2NvIEV4YW1wbGUgQ29udGVudCBBcHBsaWNhdGlvblxuICpcbiAqIENvcHlyaWdodCAoQykgMjAwNSAtIDIwMjAgQWxmcmVzY28gU29mdHdhcmUgTGltaXRlZFxuICpcbiAqIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIHRoZSBBbGZyZXNjbyBFeGFtcGxlIENvbnRlbnQgQXBwbGljYXRpb24uXG4gKiBJZiB0aGUgc29mdHdhcmUgd2FzIHB1cmNoYXNlZCB1bmRlciBhIHBhaWQgQWxmcmVzY28gbGljZW5zZSwgdGhlIHRlcm1zIG9mXG4gKiB0aGUgcGFpZCBsaWNlbnNlIGFncmVlbWVudCB3aWxsIHByZXZhaWwuICBPdGhlcndpc2UsIHRoZSBzb2Z0d2FyZSBpc1xuICogcHJvdmlkZWQgdW5kZXIgdGhlIGZvbGxvd2luZyBvcGVuIHNvdXJjZSBsaWNlbnNlIHRlcm1zOlxuICpcbiAqIFRoZSBBbGZyZXNjbyBFeGFtcGxlIENvbnRlbnQgQXBwbGljYXRpb24gaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuICogaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgTGVzc2VyIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG4gKiB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuICogKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cbiAqXG4gKiBUaGUgQWxmcmVzY28gRXhhbXBsZSBDb250ZW50IEFwcGxpY2F0aW9uIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG4gKiBidXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuICogTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuICogR05VIExlc3NlciBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG4gKlxuICogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIExlc3NlciBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiBhbG9uZyB3aXRoIEFsZnJlc2NvLiBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG4gKi9cblxuaW1wb3J0IHsgQWN0aW9uIH0gZnJvbSAnQG5ncngvc3RvcmUnO1xuaW1wb3J0IHsgTm9kZSB9IGZyb20gJ0BhbGZyZXNjby9qcy1hcGknO1xuXG5leHBvcnQgZW51bSBUZW1wbGF0ZUFjdGlvblR5cGVzIHtcbiAgRmlsZUZyb21UZW1wbGF0ZSA9ICdGSUxFX0ZST01fVEVNUExBVEUnLFxuICBGb2xkZXJGcm9tVGVtcGxhdGUgPSAnRk9MREVSX0ZST01fVEVNUExBVEUnLFxuICBDcmVhdGVGcm9tVGVtcGxhdGUgPSAnQ1JFQVRFX0ZST01fVEVNUExBVEUnLFxuICBDcmVhdGVGcm9tVGVtcGxhdGVTdWNjZXNzID0gJ0NSRUFURV9GUk9NX1RFTVBMQVRFX1NVQ0NFU1MnXG59XG5cbmV4cG9ydCBjbGFzcyBGaWxlRnJvbVRlbXBsYXRlIGltcGxlbWVudHMgQWN0aW9uIHtcbiAgcmVhZG9ubHkgdHlwZSA9IFRlbXBsYXRlQWN0aW9uVHlwZXMuRmlsZUZyb21UZW1wbGF0ZTtcblxuICBjb25zdHJ1Y3RvcigpIHt9XG59XG5cbmV4cG9ydCBjbGFzcyBGb2xkZXJGcm9tVGVtcGxhdGUgaW1wbGVtZW50cyBBY3Rpb24ge1xuICByZWFkb25seSB0eXBlID0gVGVtcGxhdGVBY3Rpb25UeXBlcy5Gb2xkZXJGcm9tVGVtcGxhdGU7XG5cbiAgY29uc3RydWN0b3IoKSB7fVxufVxuXG5leHBvcnQgY2xhc3MgQ3JlYXRlRnJvbVRlbXBsYXRlIGltcGxlbWVudHMgQWN0aW9uIHtcbiAgcmVhZG9ubHkgdHlwZSA9IFRlbXBsYXRlQWN0aW9uVHlwZXMuQ3JlYXRlRnJvbVRlbXBsYXRlO1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBwYXlsb2FkOiBOb2RlKSB7fVxufVxuXG5leHBvcnQgY2xhc3MgQ3JlYXRlRnJvbVRlbXBsYXRlU3VjY2VzcyBpbXBsZW1lbnRzIEFjdGlvbiB7XG4gIHJlYWRvbmx5IHR5cGUgPSBUZW1wbGF0ZUFjdGlvblR5cGVzLkNyZWF0ZUZyb21UZW1wbGF0ZVN1Y2Nlc3M7XG5cbiAgY29uc3RydWN0b3IocHVibGljIG5vZGU6IE5vZGUpIHt9XG59XG4iXX0=
