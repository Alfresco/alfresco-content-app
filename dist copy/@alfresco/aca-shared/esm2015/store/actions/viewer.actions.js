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
const ViewerActionTypes = {
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
export class ViewFileAction {
  /**
   * @param {?=} payload
   * @param {?=} parentId
   */
  constructor(payload, parentId) {
    this.payload = payload;
    this.parentId = parentId;
    this.type = ViewerActionTypes.ViewFile;
  }
}
if (false) {
  /** @type {?} */
  ViewFileAction.prototype.type;
  /** @type {?} */
  ViewFileAction.prototype.payload;
  /** @type {?} */
  ViewFileAction.prototype.parentId;
}
export class ViewNodeAction {
  /**
   * @param {?} nodeId
   * @param {?=} viewNodeExtras
   */
  constructor(nodeId, viewNodeExtras) {
    this.nodeId = nodeId;
    this.viewNodeExtras = viewNodeExtras;
    this.type = ViewerActionTypes.ViewNode;
  }
}
if (false) {
  /** @type {?} */
  ViewNodeAction.prototype.type;
  /** @type {?} */
  ViewNodeAction.prototype.nodeId;
  /** @type {?} */
  ViewNodeAction.prototype.viewNodeExtras;
}
export class FullscreenViewerAction {
  /**
   * @param {?} payload
   */
  constructor(payload) {
    this.payload = payload;
    this.type = ViewerActionTypes.FullScreen;
  }
}
if (false) {
  /** @type {?} */
  FullscreenViewerAction.prototype.type;
  /** @type {?} */
  FullscreenViewerAction.prototype.payload;
}
export class ClosePreviewAction {
  /**
   * @param {?=} payload
   */
  constructor(payload) {
    this.payload = payload;
    this.type = ViewerActionTypes.ClosePreview;
  }
}
if (false) {
  /** @type {?} */
  ClosePreviewAction.prototype.type;
  /** @type {?} */
  ClosePreviewAction.prototype.payload;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlld2VyLmFjdGlvbnMuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AYWxmcmVzY28vYWNhLXNoYXJlZC9zdG9yZS8iLCJzb3VyY2VzIjpbImFjdGlvbnMvdmlld2VyLmFjdGlvbnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBNkJFLFVBQVcsV0FBVztJQUN0QixVQUFXLFdBQVc7SUFDdEIsWUFBYSxtQkFBbUI7SUFDaEMsY0FBZSxlQUFlOzs7Ozs7QUFHaEMsb0NBR0M7OztJQUZDLGtDQUFrQjs7SUFDbEIsOEJBQWM7O0FBR2hCLE1BQU0sT0FBTyxjQUFjOzs7OztJQUd6QixZQUFtQixPQUEyQixFQUFTLFFBQWlCO1FBQXJELFlBQU8sR0FBUCxPQUFPLENBQW9CO1FBQVMsYUFBUSxHQUFSLFFBQVEsQ0FBUztRQUYvRCxTQUFJLEdBQUcsaUJBQWlCLENBQUMsUUFBUSxDQUFDO0lBRWdDLENBQUM7Q0FDN0U7OztJQUhDLDhCQUEyQzs7SUFFL0IsaUNBQWtDOztJQUFFLGtDQUF3Qjs7QUFHMUUsTUFBTSxPQUFPLGNBQWM7Ozs7O0lBR3pCLFlBQW1CLE1BQWMsRUFBUyxjQUErQjtRQUF0RCxXQUFNLEdBQU4sTUFBTSxDQUFRO1FBQVMsbUJBQWMsR0FBZCxjQUFjLENBQWlCO1FBRmhFLFNBQUksR0FBRyxpQkFBaUIsQ0FBQyxRQUFRLENBQUM7SUFFaUMsQ0FBQztDQUM5RTs7O0lBSEMsOEJBQTJDOztJQUUvQixnQ0FBcUI7O0lBQUUsd0NBQXNDOztBQUczRSxNQUFNLE9BQU8sc0JBQXNCOzs7O0lBR2pDLFlBQW1CLE9BQTBCO1FBQTFCLFlBQU8sR0FBUCxPQUFPLENBQW1CO1FBRnBDLFNBQUksR0FBRyxpQkFBaUIsQ0FBQyxVQUFVLENBQUM7SUFFRyxDQUFDO0NBQ2xEOzs7SUFIQyxzQ0FBNkM7O0lBRWpDLHlDQUFpQzs7QUFHL0MsTUFBTSxPQUFPLGtCQUFrQjs7OztJQUU3QixZQUFtQixPQUEyQjtRQUEzQixZQUFPLEdBQVAsT0FBTyxDQUFvQjtRQURyQyxTQUFJLEdBQUcsaUJBQWlCLENBQUMsWUFBWSxDQUFDO0lBQ0UsQ0FBQztDQUNuRDs7O0lBRkMsa0NBQStDOztJQUNuQyxxQ0FBa0MiLCJzb3VyY2VzQ29udGVudCI6WyIvKiFcbiAqIEBsaWNlbnNlXG4gKiBBbGZyZXNjbyBFeGFtcGxlIENvbnRlbnQgQXBwbGljYXRpb25cbiAqXG4gKiBDb3B5cmlnaHQgKEMpIDIwMDUgLSAyMDIwIEFsZnJlc2NvIFNvZnR3YXJlIExpbWl0ZWRcbiAqXG4gKiBUaGlzIGZpbGUgaXMgcGFydCBvZiB0aGUgQWxmcmVzY28gRXhhbXBsZSBDb250ZW50IEFwcGxpY2F0aW9uLlxuICogSWYgdGhlIHNvZnR3YXJlIHdhcyBwdXJjaGFzZWQgdW5kZXIgYSBwYWlkIEFsZnJlc2NvIGxpY2Vuc2UsIHRoZSB0ZXJtcyBvZlxuICogdGhlIHBhaWQgbGljZW5zZSBhZ3JlZW1lbnQgd2lsbCBwcmV2YWlsLiAgT3RoZXJ3aXNlLCB0aGUgc29mdHdhcmUgaXNcbiAqIHByb3ZpZGVkIHVuZGVyIHRoZSBmb2xsb3dpbmcgb3BlbiBzb3VyY2UgbGljZW5zZSB0ZXJtczpcbiAqXG4gKiBUaGUgQWxmcmVzY28gRXhhbXBsZSBDb250ZW50IEFwcGxpY2F0aW9uIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbiAqIGl0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIExlc3NlciBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxuICogdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3JcbiAqIChhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG4gKlxuICogVGhlIEFsZnJlc2NvIEV4YW1wbGUgQ29udGVudCBBcHBsaWNhdGlvbiBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuICogYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2ZcbiAqIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbiAqIEdOVSBMZXNzZXIgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuICpcbiAqIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBMZXNzZXIgR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogYWxvbmcgd2l0aCBBbGZyZXNjby4gSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuICovXG5cbmltcG9ydCB7IEFjdGlvbiB9IGZyb20gJ0BuZ3J4L3N0b3JlJztcbmltcG9ydCB7IE1pbmltYWxOb2RlRW50aXR5IH0gZnJvbSAnQGFsZnJlc2NvL2pzLWFwaSc7XG5cbmV4cG9ydCBlbnVtIFZpZXdlckFjdGlvblR5cGVzIHtcbiAgVmlld0ZpbGUgPSAnVklFV19GSUxFJyxcbiAgVmlld05vZGUgPSAnVklFV19OT0RFJyxcbiAgRnVsbFNjcmVlbiA9ICdGVUxMU0NSRUVOX1ZJRVdFUicsXG4gIENsb3NlUHJldmlldyA9ICdDTE9TRV9QUkVWSUVXJ1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFZpZXdOb2RlRXh0cmFzIHtcbiAgbG9jYXRpb24/OiBzdHJpbmc7XG4gIHBhdGg/OiBzdHJpbmc7XG59XG5cbmV4cG9ydCBjbGFzcyBWaWV3RmlsZUFjdGlvbiBpbXBsZW1lbnRzIEFjdGlvbiB7XG4gIHJlYWRvbmx5IHR5cGUgPSBWaWV3ZXJBY3Rpb25UeXBlcy5WaWV3RmlsZTtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgcGF5bG9hZD86IE1pbmltYWxOb2RlRW50aXR5LCBwdWJsaWMgcGFyZW50SWQ/OiBzdHJpbmcpIHt9XG59XG5cbmV4cG9ydCBjbGFzcyBWaWV3Tm9kZUFjdGlvbiBpbXBsZW1lbnRzIEFjdGlvbiB7XG4gIHJlYWRvbmx5IHR5cGUgPSBWaWV3ZXJBY3Rpb25UeXBlcy5WaWV3Tm9kZTtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgbm9kZUlkOiBzdHJpbmcsIHB1YmxpYyB2aWV3Tm9kZUV4dHJhcz86IFZpZXdOb2RlRXh0cmFzKSB7fVxufVxuXG5leHBvcnQgY2xhc3MgRnVsbHNjcmVlblZpZXdlckFjdGlvbiBpbXBsZW1lbnRzIEFjdGlvbiB7XG4gIHJlYWRvbmx5IHR5cGUgPSBWaWV3ZXJBY3Rpb25UeXBlcy5GdWxsU2NyZWVuO1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBwYXlsb2FkOiBNaW5pbWFsTm9kZUVudGl0eSkge31cbn1cblxuZXhwb3J0IGNsYXNzIENsb3NlUHJldmlld0FjdGlvbiBpbXBsZW1lbnRzIEFjdGlvbiB7XG4gIHJlYWRvbmx5IHR5cGUgPSBWaWV3ZXJBY3Rpb25UeXBlcy5DbG9zZVByZXZpZXc7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBwYXlsb2FkPzogTWluaW1hbE5vZGVFbnRpdHkpIHt9XG59XG4iXX0=
