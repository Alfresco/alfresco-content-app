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
const RouterActionTypes = {
  NavigateUrl: 'NAVIGATE_URL',
  NavigateRoute: 'NAVIGATE_ROUTE',
  NavigateFolder: 'NAVIGATE_FOLDER',
  NavigateParentFolder: 'NAVIGATE_PARENT_FOLDER'
};
export { RouterActionTypes };
export class NavigateUrlAction {
  /**
   * @param {?} payload
   */
  constructor(payload) {
    this.payload = payload;
    this.type = RouterActionTypes.NavigateUrl;
  }
}
if (false) {
  /** @type {?} */
  NavigateUrlAction.prototype.type;
  /** @type {?} */
  NavigateUrlAction.prototype.payload;
}
export class NavigateRouteAction {
  /**
   * @param {?} payload
   */
  constructor(payload) {
    this.payload = payload;
    this.type = RouterActionTypes.NavigateRoute;
  }
}
if (false) {
  /** @type {?} */
  NavigateRouteAction.prototype.type;
  /** @type {?} */
  NavigateRouteAction.prototype.payload;
}
export class NavigateToFolder {
  /**
   * @param {?} payload
   */
  constructor(payload) {
    this.payload = payload;
    this.type = RouterActionTypes.NavigateFolder;
  }
}
if (false) {
  /** @type {?} */
  NavigateToFolder.prototype.type;
  /** @type {?} */
  NavigateToFolder.prototype.payload;
}
export class NavigateToParentFolder {
  /**
   * @param {?} payload
   */
  constructor(payload) {
    this.payload = payload;
    this.type = RouterActionTypes.NavigateParentFolder;
  }
}
if (false) {
  /** @type {?} */
  NavigateToParentFolder.prototype.type;
  /** @type {?} */
  NavigateToParentFolder.prototype.payload;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVyLmFjdGlvbnMuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AYWxmcmVzY28vYWNhLXNoYXJlZC9zdG9yZS8iLCJzb3VyY2VzIjpbImFjdGlvbnMvcm91dGVyLmFjdGlvbnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBNkJFLGFBQWMsY0FBYztJQUM1QixlQUFnQixnQkFBZ0I7SUFDaEMsZ0JBQWlCLGlCQUFpQjtJQUNsQyxzQkFBdUIsd0JBQXdCOzs7QUFHakQsTUFBTSxPQUFPLGlCQUFpQjs7OztJQUc1QixZQUFtQixPQUFlO1FBQWYsWUFBTyxHQUFQLE9BQU8sQ0FBUTtRQUZ6QixTQUFJLEdBQUcsaUJBQWlCLENBQUMsV0FBVyxDQUFDO0lBRVQsQ0FBQztDQUN2Qzs7O0lBSEMsaUNBQThDOztJQUVsQyxvQ0FBc0I7O0FBR3BDLE1BQU0sT0FBTyxtQkFBbUI7Ozs7SUFHOUIsWUFBbUIsT0FBYztRQUFkLFlBQU8sR0FBUCxPQUFPLENBQU87UUFGeEIsU0FBSSxHQUFHLGlCQUFpQixDQUFDLGFBQWEsQ0FBQztJQUVaLENBQUM7Q0FDdEM7OztJQUhDLG1DQUFnRDs7SUFFcEMsc0NBQXFCOztBQUduQyxNQUFNLE9BQU8sZ0JBQWdCOzs7O0lBRzNCLFlBQW1CLE9BQTBCO1FBQTFCLFlBQU8sR0FBUCxPQUFPLENBQW1CO1FBRnBDLFNBQUksR0FBRyxpQkFBaUIsQ0FBQyxjQUFjLENBQUM7SUFFRCxDQUFDO0NBQ2xEOzs7SUFIQyxnQ0FBaUQ7O0lBRXJDLG1DQUFpQzs7QUFHL0MsTUFBTSxPQUFPLHNCQUFzQjs7OztJQUdqQyxZQUFtQixPQUEwQjtRQUExQixZQUFPLEdBQVAsT0FBTyxDQUFtQjtRQUZwQyxTQUFJLEdBQUcsaUJBQWlCLENBQUMsb0JBQW9CLENBQUM7SUFFUCxDQUFDO0NBQ2xEOzs7SUFIQyxzQ0FBdUQ7O0lBRTNDLHlDQUFpQyIsInNvdXJjZXNDb250ZW50IjpbIi8qIVxuICogQGxpY2Vuc2VcbiAqIEFsZnJlc2NvIEV4YW1wbGUgQ29udGVudCBBcHBsaWNhdGlvblxuICpcbiAqIENvcHlyaWdodCAoQykgMjAwNSAtIDIwMjAgQWxmcmVzY28gU29mdHdhcmUgTGltaXRlZFxuICpcbiAqIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIHRoZSBBbGZyZXNjbyBFeGFtcGxlIENvbnRlbnQgQXBwbGljYXRpb24uXG4gKiBJZiB0aGUgc29mdHdhcmUgd2FzIHB1cmNoYXNlZCB1bmRlciBhIHBhaWQgQWxmcmVzY28gbGljZW5zZSwgdGhlIHRlcm1zIG9mXG4gKiB0aGUgcGFpZCBsaWNlbnNlIGFncmVlbWVudCB3aWxsIHByZXZhaWwuICBPdGhlcndpc2UsIHRoZSBzb2Z0d2FyZSBpc1xuICogcHJvdmlkZWQgdW5kZXIgdGhlIGZvbGxvd2luZyBvcGVuIHNvdXJjZSBsaWNlbnNlIHRlcm1zOlxuICpcbiAqIFRoZSBBbGZyZXNjbyBFeGFtcGxlIENvbnRlbnQgQXBwbGljYXRpb24gaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuICogaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgTGVzc2VyIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG4gKiB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuICogKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cbiAqXG4gKiBUaGUgQWxmcmVzY28gRXhhbXBsZSBDb250ZW50IEFwcGxpY2F0aW9uIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG4gKiBidXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuICogTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuICogR05VIExlc3NlciBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG4gKlxuICogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIExlc3NlciBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiBhbG9uZyB3aXRoIEFsZnJlc2NvLiBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG4gKi9cblxuaW1wb3J0IHsgQWN0aW9uIH0gZnJvbSAnQG5ncngvc3RvcmUnO1xuaW1wb3J0IHsgTWluaW1hbE5vZGVFbnRpdHkgfSBmcm9tICdAYWxmcmVzY28vanMtYXBpJztcblxuZXhwb3J0IGVudW0gUm91dGVyQWN0aW9uVHlwZXMge1xuICBOYXZpZ2F0ZVVybCA9ICdOQVZJR0FURV9VUkwnLFxuICBOYXZpZ2F0ZVJvdXRlID0gJ05BVklHQVRFX1JPVVRFJyxcbiAgTmF2aWdhdGVGb2xkZXIgPSAnTkFWSUdBVEVfRk9MREVSJyxcbiAgTmF2aWdhdGVQYXJlbnRGb2xkZXIgPSAnTkFWSUdBVEVfUEFSRU5UX0ZPTERFUidcbn1cblxuZXhwb3J0IGNsYXNzIE5hdmlnYXRlVXJsQWN0aW9uIGltcGxlbWVudHMgQWN0aW9uIHtcbiAgcmVhZG9ubHkgdHlwZSA9IFJvdXRlckFjdGlvblR5cGVzLk5hdmlnYXRlVXJsO1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBwYXlsb2FkOiBzdHJpbmcpIHt9XG59XG5cbmV4cG9ydCBjbGFzcyBOYXZpZ2F0ZVJvdXRlQWN0aW9uIGltcGxlbWVudHMgQWN0aW9uIHtcbiAgcmVhZG9ubHkgdHlwZSA9IFJvdXRlckFjdGlvblR5cGVzLk5hdmlnYXRlUm91dGU7XG5cbiAgY29uc3RydWN0b3IocHVibGljIHBheWxvYWQ6IGFueVtdKSB7fVxufVxuXG5leHBvcnQgY2xhc3MgTmF2aWdhdGVUb0ZvbGRlciBpbXBsZW1lbnRzIEFjdGlvbiB7XG4gIHJlYWRvbmx5IHR5cGUgPSBSb3V0ZXJBY3Rpb25UeXBlcy5OYXZpZ2F0ZUZvbGRlcjtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgcGF5bG9hZDogTWluaW1hbE5vZGVFbnRpdHkpIHt9XG59XG5cbmV4cG9ydCBjbGFzcyBOYXZpZ2F0ZVRvUGFyZW50Rm9sZGVyIGltcGxlbWVudHMgQWN0aW9uIHtcbiAgcmVhZG9ubHkgdHlwZSA9IFJvdXRlckFjdGlvblR5cGVzLk5hdmlnYXRlUGFyZW50Rm9sZGVyO1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBwYXlsb2FkOiBNaW5pbWFsTm9kZUVudGl0eSkge31cbn1cbiJdfQ==
