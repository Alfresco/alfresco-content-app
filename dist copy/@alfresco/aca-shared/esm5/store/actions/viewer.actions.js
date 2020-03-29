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
var ViewerActionTypes = {
  ViewFile: 'VIEW_FILE',
  ViewNode: 'VIEW_NODE',
  FullScreen: 'FULLSCREEN_VIEWER',
  ClosePreview: 'CLOSE_PREVIEW'
};
export { ViewerActionTypes };
/**
 * @record
 */
export function ViewNodeExtras() {}
if (false) {
  /** @type {?|undefined} */
  ViewNodeExtras.prototype.location;
  /** @type {?|undefined} */
  ViewNodeExtras.prototype.path;
}
var ViewFileAction = /** @class */ (function() {
  function ViewFileAction(payload, parentId) {
    this.payload = payload;
    this.parentId = parentId;
    this.type = ViewerActionTypes.ViewFile;
  }
  return ViewFileAction;
})();
export { ViewFileAction };
if (false) {
  /** @type {?} */
  ViewFileAction.prototype.type;
  /** @type {?} */
  ViewFileAction.prototype.payload;
  /** @type {?} */
  ViewFileAction.prototype.parentId;
}
var ViewNodeAction = /** @class */ (function() {
  function ViewNodeAction(nodeId, viewNodeExtras) {
    this.nodeId = nodeId;
    this.viewNodeExtras = viewNodeExtras;
    this.type = ViewerActionTypes.ViewNode;
  }
  return ViewNodeAction;
})();
export { ViewNodeAction };
if (false) {
  /** @type {?} */
  ViewNodeAction.prototype.type;
  /** @type {?} */
  ViewNodeAction.prototype.nodeId;
  /** @type {?} */
  ViewNodeAction.prototype.viewNodeExtras;
}
var FullscreenViewerAction = /** @class */ (function() {
  function FullscreenViewerAction(payload) {
    this.payload = payload;
    this.type = ViewerActionTypes.FullScreen;
  }
  return FullscreenViewerAction;
})();
export { FullscreenViewerAction };
if (false) {
  /** @type {?} */
  FullscreenViewerAction.prototype.type;
  /** @type {?} */
  FullscreenViewerAction.prototype.payload;
}
var ClosePreviewAction = /** @class */ (function() {
  function ClosePreviewAction(payload) {
    this.payload = payload;
    this.type = ViewerActionTypes.ClosePreview;
  }
  return ClosePreviewAction;
})();
export { ClosePreviewAction };
if (false) {
  /** @type {?} */
  ClosePreviewAction.prototype.type;
  /** @type {?} */
  ClosePreviewAction.prototype.payload;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlld2VyLmFjdGlvbnMuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AYWxmcmVzY28vYWNhLXNoYXJlZC9zdG9yZS8iLCJzb3VyY2VzIjpbImFjdGlvbnMvdmlld2VyLmFjdGlvbnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBNkJFLFVBQVcsV0FBVztJQUN0QixVQUFXLFdBQVc7SUFDdEIsWUFBYSxtQkFBbUI7SUFDaEMsY0FBZSxlQUFlOzs7Ozs7QUFHaEMsb0NBR0M7OztJQUZDLGtDQUFrQjs7SUFDbEIsOEJBQWM7O0FBR2hCO0lBR0Usd0JBQW1CLE9BQTJCLEVBQVMsUUFBaUI7UUFBckQsWUFBTyxHQUFQLE9BQU8sQ0FBb0I7UUFBUyxhQUFRLEdBQVIsUUFBUSxDQUFTO1FBRi9ELFNBQUksR0FBRyxpQkFBaUIsQ0FBQyxRQUFRLENBQUM7SUFFZ0MsQ0FBQztJQUM5RSxxQkFBQztBQUFELENBQUMsQUFKRCxJQUlDOzs7O0lBSEMsOEJBQTJDOztJQUUvQixpQ0FBa0M7O0lBQUUsa0NBQXdCOztBQUcxRTtJQUdFLHdCQUFtQixNQUFjLEVBQVMsY0FBK0I7UUFBdEQsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUFTLG1CQUFjLEdBQWQsY0FBYyxDQUFpQjtRQUZoRSxTQUFJLEdBQUcsaUJBQWlCLENBQUMsUUFBUSxDQUFDO0lBRWlDLENBQUM7SUFDL0UscUJBQUM7QUFBRCxDQUFDLEFBSkQsSUFJQzs7OztJQUhDLDhCQUEyQzs7SUFFL0IsZ0NBQXFCOztJQUFFLHdDQUFzQzs7QUFHM0U7SUFHRSxnQ0FBbUIsT0FBMEI7UUFBMUIsWUFBTyxHQUFQLE9BQU8sQ0FBbUI7UUFGcEMsU0FBSSxHQUFHLGlCQUFpQixDQUFDLFVBQVUsQ0FBQztJQUVHLENBQUM7SUFDbkQsNkJBQUM7QUFBRCxDQUFDLEFBSkQsSUFJQzs7OztJQUhDLHNDQUE2Qzs7SUFFakMseUNBQWlDOztBQUcvQztJQUVFLDRCQUFtQixPQUEyQjtRQUEzQixZQUFPLEdBQVAsT0FBTyxDQUFvQjtRQURyQyxTQUFJLEdBQUcsaUJBQWlCLENBQUMsWUFBWSxDQUFDO0lBQ0UsQ0FBQztJQUNwRCx5QkFBQztBQUFELENBQUMsQUFIRCxJQUdDOzs7O0lBRkMsa0NBQStDOztJQUNuQyxxQ0FBa0MiLCJzb3VyY2VzQ29udGVudCI6WyIvKiFcbiAqIEBsaWNlbnNlXG4gKiBBbGZyZXNjbyBFeGFtcGxlIENvbnRlbnQgQXBwbGljYXRpb25cbiAqXG4gKiBDb3B5cmlnaHQgKEMpIDIwMDUgLSAyMDIwIEFsZnJlc2NvIFNvZnR3YXJlIExpbWl0ZWRcbiAqXG4gKiBUaGlzIGZpbGUgaXMgcGFydCBvZiB0aGUgQWxmcmVzY28gRXhhbXBsZSBDb250ZW50IEFwcGxpY2F0aW9uLlxuICogSWYgdGhlIHNvZnR3YXJlIHdhcyBwdXJjaGFzZWQgdW5kZXIgYSBwYWlkIEFsZnJlc2NvIGxpY2Vuc2UsIHRoZSB0ZXJtcyBvZlxuICogdGhlIHBhaWQgbGljZW5zZSBhZ3JlZW1lbnQgd2lsbCBwcmV2YWlsLiAgT3RoZXJ3aXNlLCB0aGUgc29mdHdhcmUgaXNcbiAqIHByb3ZpZGVkIHVuZGVyIHRoZSBmb2xsb3dpbmcgb3BlbiBzb3VyY2UgbGljZW5zZSB0ZXJtczpcbiAqXG4gKiBUaGUgQWxmcmVzY28gRXhhbXBsZSBDb250ZW50IEFwcGxpY2F0aW9uIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbiAqIGl0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIExlc3NlciBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxuICogdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3JcbiAqIChhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG4gKlxuICogVGhlIEFsZnJlc2NvIEV4YW1wbGUgQ29udGVudCBBcHBsaWNhdGlvbiBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuICogYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2ZcbiAqIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbiAqIEdOVSBMZXNzZXIgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuICpcbiAqIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBMZXNzZXIgR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogYWxvbmcgd2l0aCBBbGZyZXNjby4gSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuICovXG5cbmltcG9ydCB7IEFjdGlvbiB9IGZyb20gJ0BuZ3J4L3N0b3JlJztcbmltcG9ydCB7IE1pbmltYWxOb2RlRW50aXR5IH0gZnJvbSAnQGFsZnJlc2NvL2pzLWFwaSc7XG5cbmV4cG9ydCBlbnVtIFZpZXdlckFjdGlvblR5cGVzIHtcbiAgVmlld0ZpbGUgPSAnVklFV19GSUxFJyxcbiAgVmlld05vZGUgPSAnVklFV19OT0RFJyxcbiAgRnVsbFNjcmVlbiA9ICdGVUxMU0NSRUVOX1ZJRVdFUicsXG4gIENsb3NlUHJldmlldyA9ICdDTE9TRV9QUkVWSUVXJ1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFZpZXdOb2RlRXh0cmFzIHtcbiAgbG9jYXRpb24/OiBzdHJpbmc7XG4gIHBhdGg/OiBzdHJpbmc7XG59XG5cbmV4cG9ydCBjbGFzcyBWaWV3RmlsZUFjdGlvbiBpbXBsZW1lbnRzIEFjdGlvbiB7XG4gIHJlYWRvbmx5IHR5cGUgPSBWaWV3ZXJBY3Rpb25UeXBlcy5WaWV3RmlsZTtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgcGF5bG9hZD86IE1pbmltYWxOb2RlRW50aXR5LCBwdWJsaWMgcGFyZW50SWQ/OiBzdHJpbmcpIHt9XG59XG5cbmV4cG9ydCBjbGFzcyBWaWV3Tm9kZUFjdGlvbiBpbXBsZW1lbnRzIEFjdGlvbiB7XG4gIHJlYWRvbmx5IHR5cGUgPSBWaWV3ZXJBY3Rpb25UeXBlcy5WaWV3Tm9kZTtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgbm9kZUlkOiBzdHJpbmcsIHB1YmxpYyB2aWV3Tm9kZUV4dHJhcz86IFZpZXdOb2RlRXh0cmFzKSB7fVxufVxuXG5leHBvcnQgY2xhc3MgRnVsbHNjcmVlblZpZXdlckFjdGlvbiBpbXBsZW1lbnRzIEFjdGlvbiB7XG4gIHJlYWRvbmx5IHR5cGUgPSBWaWV3ZXJBY3Rpb25UeXBlcy5GdWxsU2NyZWVuO1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBwYXlsb2FkOiBNaW5pbWFsTm9kZUVudGl0eSkge31cbn1cblxuZXhwb3J0IGNsYXNzIENsb3NlUHJldmlld0FjdGlvbiBpbXBsZW1lbnRzIEFjdGlvbiB7XG4gIHJlYWRvbmx5IHR5cGUgPSBWaWV3ZXJBY3Rpb25UeXBlcy5DbG9zZVByZXZpZXc7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBwYXlsb2FkPzogTWluaW1hbE5vZGVFbnRpdHkpIHt9XG59XG4iXX0=
