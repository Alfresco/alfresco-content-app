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
var RouterActionTypes = {
  NavigateUrl: 'NAVIGATE_URL',
  NavigateRoute: 'NAVIGATE_ROUTE',
  NavigateFolder: 'NAVIGATE_FOLDER',
  NavigateParentFolder: 'NAVIGATE_PARENT_FOLDER'
};
export { RouterActionTypes };
var NavigateUrlAction = /** @class */ (function() {
  function NavigateUrlAction(payload) {
    this.payload = payload;
    this.type = RouterActionTypes.NavigateUrl;
  }
  return NavigateUrlAction;
})();
export { NavigateUrlAction };
if (false) {
  /** @type {?} */
  NavigateUrlAction.prototype.type;
  /** @type {?} */
  NavigateUrlAction.prototype.payload;
}
var NavigateRouteAction = /** @class */ (function() {
  function NavigateRouteAction(payload) {
    this.payload = payload;
    this.type = RouterActionTypes.NavigateRoute;
  }
  return NavigateRouteAction;
})();
export { NavigateRouteAction };
if (false) {
  /** @type {?} */
  NavigateRouteAction.prototype.type;
  /** @type {?} */
  NavigateRouteAction.prototype.payload;
}
var NavigateToFolder = /** @class */ (function() {
  function NavigateToFolder(payload) {
    this.payload = payload;
    this.type = RouterActionTypes.NavigateFolder;
  }
  return NavigateToFolder;
})();
export { NavigateToFolder };
if (false) {
  /** @type {?} */
  NavigateToFolder.prototype.type;
  /** @type {?} */
  NavigateToFolder.prototype.payload;
}
var NavigateToParentFolder = /** @class */ (function() {
  function NavigateToParentFolder(payload) {
    this.payload = payload;
    this.type = RouterActionTypes.NavigateParentFolder;
  }
  return NavigateToParentFolder;
})();
export { NavigateToParentFolder };
if (false) {
  /** @type {?} */
  NavigateToParentFolder.prototype.type;
  /** @type {?} */
  NavigateToParentFolder.prototype.payload;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVyLmFjdGlvbnMuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AYWxmcmVzY28vYWNhLXNoYXJlZC9zdG9yZS8iLCJzb3VyY2VzIjpbImFjdGlvbnMvcm91dGVyLmFjdGlvbnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBNkJFLGFBQWMsY0FBYztJQUM1QixlQUFnQixnQkFBZ0I7SUFDaEMsZ0JBQWlCLGlCQUFpQjtJQUNsQyxzQkFBdUIsd0JBQXdCOzs7QUFHakQ7SUFHRSwyQkFBbUIsT0FBZTtRQUFmLFlBQU8sR0FBUCxPQUFPLENBQVE7UUFGekIsU0FBSSxHQUFHLGlCQUFpQixDQUFDLFdBQVcsQ0FBQztJQUVULENBQUM7SUFDeEMsd0JBQUM7QUFBRCxDQUFDLEFBSkQsSUFJQzs7OztJQUhDLGlDQUE4Qzs7SUFFbEMsb0NBQXNCOztBQUdwQztJQUdFLDZCQUFtQixPQUFjO1FBQWQsWUFBTyxHQUFQLE9BQU8sQ0FBTztRQUZ4QixTQUFJLEdBQUcsaUJBQWlCLENBQUMsYUFBYSxDQUFDO0lBRVosQ0FBQztJQUN2QywwQkFBQztBQUFELENBQUMsQUFKRCxJQUlDOzs7O0lBSEMsbUNBQWdEOztJQUVwQyxzQ0FBcUI7O0FBR25DO0lBR0UsMEJBQW1CLE9BQTBCO1FBQTFCLFlBQU8sR0FBUCxPQUFPLENBQW1CO1FBRnBDLFNBQUksR0FBRyxpQkFBaUIsQ0FBQyxjQUFjLENBQUM7SUFFRCxDQUFDO0lBQ25ELHVCQUFDO0FBQUQsQ0FBQyxBQUpELElBSUM7Ozs7SUFIQyxnQ0FBaUQ7O0lBRXJDLG1DQUFpQzs7QUFHL0M7SUFHRSxnQ0FBbUIsT0FBMEI7UUFBMUIsWUFBTyxHQUFQLE9BQU8sQ0FBbUI7UUFGcEMsU0FBSSxHQUFHLGlCQUFpQixDQUFDLG9CQUFvQixDQUFDO0lBRVAsQ0FBQztJQUNuRCw2QkFBQztBQUFELENBQUMsQUFKRCxJQUlDOzs7O0lBSEMsc0NBQXVEOztJQUUzQyx5Q0FBaUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiFcbiAqIEBsaWNlbnNlXG4gKiBBbGZyZXNjbyBFeGFtcGxlIENvbnRlbnQgQXBwbGljYXRpb25cbiAqXG4gKiBDb3B5cmlnaHQgKEMpIDIwMDUgLSAyMDIwIEFsZnJlc2NvIFNvZnR3YXJlIExpbWl0ZWRcbiAqXG4gKiBUaGlzIGZpbGUgaXMgcGFydCBvZiB0aGUgQWxmcmVzY28gRXhhbXBsZSBDb250ZW50IEFwcGxpY2F0aW9uLlxuICogSWYgdGhlIHNvZnR3YXJlIHdhcyBwdXJjaGFzZWQgdW5kZXIgYSBwYWlkIEFsZnJlc2NvIGxpY2Vuc2UsIHRoZSB0ZXJtcyBvZlxuICogdGhlIHBhaWQgbGljZW5zZSBhZ3JlZW1lbnQgd2lsbCBwcmV2YWlsLiAgT3RoZXJ3aXNlLCB0aGUgc29mdHdhcmUgaXNcbiAqIHByb3ZpZGVkIHVuZGVyIHRoZSBmb2xsb3dpbmcgb3BlbiBzb3VyY2UgbGljZW5zZSB0ZXJtczpcbiAqXG4gKiBUaGUgQWxmcmVzY28gRXhhbXBsZSBDb250ZW50IEFwcGxpY2F0aW9uIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbiAqIGl0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIExlc3NlciBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxuICogdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3JcbiAqIChhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG4gKlxuICogVGhlIEFsZnJlc2NvIEV4YW1wbGUgQ29udGVudCBBcHBsaWNhdGlvbiBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuICogYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2ZcbiAqIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbiAqIEdOVSBMZXNzZXIgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuICpcbiAqIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBMZXNzZXIgR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogYWxvbmcgd2l0aCBBbGZyZXNjby4gSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuICovXG5cbmltcG9ydCB7IEFjdGlvbiB9IGZyb20gJ0BuZ3J4L3N0b3JlJztcbmltcG9ydCB7IE1pbmltYWxOb2RlRW50aXR5IH0gZnJvbSAnQGFsZnJlc2NvL2pzLWFwaSc7XG5cbmV4cG9ydCBlbnVtIFJvdXRlckFjdGlvblR5cGVzIHtcbiAgTmF2aWdhdGVVcmwgPSAnTkFWSUdBVEVfVVJMJyxcbiAgTmF2aWdhdGVSb3V0ZSA9ICdOQVZJR0FURV9ST1VURScsXG4gIE5hdmlnYXRlRm9sZGVyID0gJ05BVklHQVRFX0ZPTERFUicsXG4gIE5hdmlnYXRlUGFyZW50Rm9sZGVyID0gJ05BVklHQVRFX1BBUkVOVF9GT0xERVInXG59XG5cbmV4cG9ydCBjbGFzcyBOYXZpZ2F0ZVVybEFjdGlvbiBpbXBsZW1lbnRzIEFjdGlvbiB7XG4gIHJlYWRvbmx5IHR5cGUgPSBSb3V0ZXJBY3Rpb25UeXBlcy5OYXZpZ2F0ZVVybDtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgcGF5bG9hZDogc3RyaW5nKSB7fVxufVxuXG5leHBvcnQgY2xhc3MgTmF2aWdhdGVSb3V0ZUFjdGlvbiBpbXBsZW1lbnRzIEFjdGlvbiB7XG4gIHJlYWRvbmx5IHR5cGUgPSBSb3V0ZXJBY3Rpb25UeXBlcy5OYXZpZ2F0ZVJvdXRlO1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBwYXlsb2FkOiBhbnlbXSkge31cbn1cblxuZXhwb3J0IGNsYXNzIE5hdmlnYXRlVG9Gb2xkZXIgaW1wbGVtZW50cyBBY3Rpb24ge1xuICByZWFkb25seSB0eXBlID0gUm91dGVyQWN0aW9uVHlwZXMuTmF2aWdhdGVGb2xkZXI7XG5cbiAgY29uc3RydWN0b3IocHVibGljIHBheWxvYWQ6IE1pbmltYWxOb2RlRW50aXR5KSB7fVxufVxuXG5leHBvcnQgY2xhc3MgTmF2aWdhdGVUb1BhcmVudEZvbGRlciBpbXBsZW1lbnRzIEFjdGlvbiB7XG4gIHJlYWRvbmx5IHR5cGUgPSBSb3V0ZXJBY3Rpb25UeXBlcy5OYXZpZ2F0ZVBhcmVudEZvbGRlcjtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgcGF5bG9hZDogTWluaW1hbE5vZGVFbnRpdHkpIHt9XG59XG4iXX0=
