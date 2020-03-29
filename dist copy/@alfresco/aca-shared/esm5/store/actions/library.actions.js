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
var LibraryActionTypes = {
  Delete: 'DELETE_LIBRARY',
  Create: 'CREATE_LIBRARY',
  Navigate: 'NAVIGATE_LIBRARY',
  Update: 'UPDATE_LIBRARY',
  Leave: 'LEAVE_LIBRARY'
};
export { LibraryActionTypes };
var DeleteLibraryAction = /** @class */ (function() {
  function DeleteLibraryAction(payload) {
    this.payload = payload;
    this.type = LibraryActionTypes.Delete;
  }
  return DeleteLibraryAction;
})();
export { DeleteLibraryAction };
if (false) {
  /** @type {?} */
  DeleteLibraryAction.prototype.type;
  /** @type {?} */
  DeleteLibraryAction.prototype.payload;
}
var CreateLibraryAction = /** @class */ (function() {
  function CreateLibraryAction() {
    this.type = LibraryActionTypes.Create;
  }
  return CreateLibraryAction;
})();
export { CreateLibraryAction };
if (false) {
  /** @type {?} */
  CreateLibraryAction.prototype.type;
}
var NavigateLibraryAction = /** @class */ (function() {
  function NavigateLibraryAction(payload) {
    this.payload = payload;
    this.type = LibraryActionTypes.Navigate;
  }
  return NavigateLibraryAction;
})();
export { NavigateLibraryAction };
if (false) {
  /** @type {?} */
  NavigateLibraryAction.prototype.type;
  /** @type {?} */
  NavigateLibraryAction.prototype.payload;
}
var UpdateLibraryAction = /** @class */ (function() {
  function UpdateLibraryAction(payload) {
    this.payload = payload;
    this.type = LibraryActionTypes.Update;
  }
  return UpdateLibraryAction;
})();
export { UpdateLibraryAction };
if (false) {
  /** @type {?} */
  UpdateLibraryAction.prototype.type;
  /** @type {?} */
  UpdateLibraryAction.prototype.payload;
}
var LeaveLibraryAction = /** @class */ (function() {
  function LeaveLibraryAction(payload) {
    this.payload = payload;
    this.type = LibraryActionTypes.Leave;
  }
  return LeaveLibraryAction;
})();
export { LeaveLibraryAction };
if (false) {
  /** @type {?} */
  LeaveLibraryAction.prototype.type;
  /** @type {?} */
  LeaveLibraryAction.prototype.payload;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlicmFyeS5hY3Rpb25zLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQGFsZnJlc2NvL2FjYS1zaGFyZWQvc3RvcmUvIiwic291cmNlcyI6WyJhY3Rpb25zL2xpYnJhcnkuYWN0aW9ucy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUE2QkUsUUFBUyxnQkFBZ0I7SUFDekIsUUFBUyxnQkFBZ0I7SUFDekIsVUFBVyxrQkFBa0I7SUFDN0IsUUFBUyxnQkFBZ0I7SUFDekIsT0FBUSxlQUFlOzs7QUFHekI7SUFHRSw2QkFBbUIsT0FBZ0I7UUFBaEIsWUFBTyxHQUFQLE9BQU8sQ0FBUztRQUYxQixTQUFJLEdBQUcsa0JBQWtCLENBQUMsTUFBTSxDQUFDO0lBRUosQ0FBQztJQUN6QywwQkFBQztBQUFELENBQUMsQUFKRCxJQUlDOzs7O0lBSEMsbUNBQTBDOztJQUU5QixzQ0FBdUI7O0FBR3JDO0lBQUE7UUFDVyxTQUFJLEdBQUcsa0JBQWtCLENBQUMsTUFBTSxDQUFDO0lBQzVDLENBQUM7SUFBRCwwQkFBQztBQUFELENBQUMsQUFGRCxJQUVDOzs7O0lBREMsbUNBQTBDOztBQUc1QztJQUdFLCtCQUFtQixPQUFnQjtRQUFoQixZQUFPLEdBQVAsT0FBTyxDQUFTO1FBRjFCLFNBQUksR0FBRyxrQkFBa0IsQ0FBQyxRQUFRLENBQUM7SUFFTixDQUFDO0lBQ3pDLDRCQUFDO0FBQUQsQ0FBQyxBQUpELElBSUM7Ozs7SUFIQyxxQ0FBNEM7O0lBRWhDLHdDQUF1Qjs7QUFHckM7SUFHRSw2QkFBbUIsT0FBa0I7UUFBbEIsWUFBTyxHQUFQLE9BQU8sQ0FBVztRQUY1QixTQUFJLEdBQUcsa0JBQWtCLENBQUMsTUFBTSxDQUFDO0lBRUYsQ0FBQztJQUMzQywwQkFBQztBQUFELENBQUMsQUFKRCxJQUlDOzs7O0lBSEMsbUNBQTBDOztJQUU5QixzQ0FBeUI7O0FBR3ZDO0lBR0UsNEJBQW1CLE9BQWdCO1FBQWhCLFlBQU8sR0FBUCxPQUFPLENBQVM7UUFGMUIsU0FBSSxHQUFHLGtCQUFrQixDQUFDLEtBQUssQ0FBQztJQUVILENBQUM7SUFDekMseUJBQUM7QUFBRCxDQUFDLEFBSkQsSUFJQzs7OztJQUhDLGtDQUF5Qzs7SUFFN0IscUNBQXVCIiwic291cmNlc0NvbnRlbnQiOlsiLyohXG4gKiBAbGljZW5zZVxuICogQWxmcmVzY28gRXhhbXBsZSBDb250ZW50IEFwcGxpY2F0aW9uXG4gKlxuICogQ29weXJpZ2h0IChDKSAyMDA1IC0gMjAyMCBBbGZyZXNjbyBTb2Z0d2FyZSBMaW1pdGVkXG4gKlxuICogVGhpcyBmaWxlIGlzIHBhcnQgb2YgdGhlIEFsZnJlc2NvIEV4YW1wbGUgQ29udGVudCBBcHBsaWNhdGlvbi5cbiAqIElmIHRoZSBzb2Z0d2FyZSB3YXMgcHVyY2hhc2VkIHVuZGVyIGEgcGFpZCBBbGZyZXNjbyBsaWNlbnNlLCB0aGUgdGVybXMgb2ZcbiAqIHRoZSBwYWlkIGxpY2Vuc2UgYWdyZWVtZW50IHdpbGwgcHJldmFpbC4gIE90aGVyd2lzZSwgdGhlIHNvZnR3YXJlIGlzXG4gKiBwcm92aWRlZCB1bmRlciB0aGUgZm9sbG93aW5nIG9wZW4gc291cmNlIGxpY2Vuc2UgdGVybXM6XG4gKlxuICogVGhlIEFsZnJlc2NvIEV4YW1wbGUgQ29udGVudCBBcHBsaWNhdGlvbiBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG4gKiBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBMZXNzZXIgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbiAqIHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4gKiAoYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuICpcbiAqIFRoZSBBbGZyZXNjbyBFeGFtcGxlIENvbnRlbnQgQXBwbGljYXRpb24gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbiAqIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG4gKiBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG4gKiBHTlUgTGVzc2VyIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cbiAqXG4gKiBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgTGVzc2VyIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIGFsb25nIHdpdGggQWxmcmVzY28uIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbiAqL1xuXG5pbXBvcnQgeyBBY3Rpb24gfSBmcm9tICdAbmdyeC9zdG9yZSc7XG5pbXBvcnQgeyBTaXRlQm9keSB9IGZyb20gJ0BhbGZyZXNjby9qcy1hcGknO1xuXG5leHBvcnQgZW51bSBMaWJyYXJ5QWN0aW9uVHlwZXMge1xuICBEZWxldGUgPSAnREVMRVRFX0xJQlJBUlknLFxuICBDcmVhdGUgPSAnQ1JFQVRFX0xJQlJBUlknLFxuICBOYXZpZ2F0ZSA9ICdOQVZJR0FURV9MSUJSQVJZJyxcbiAgVXBkYXRlID0gJ1VQREFURV9MSUJSQVJZJyxcbiAgTGVhdmUgPSAnTEVBVkVfTElCUkFSWSdcbn1cblxuZXhwb3J0IGNsYXNzIERlbGV0ZUxpYnJhcnlBY3Rpb24gaW1wbGVtZW50cyBBY3Rpb24ge1xuICByZWFkb25seSB0eXBlID0gTGlicmFyeUFjdGlvblR5cGVzLkRlbGV0ZTtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgcGF5bG9hZD86IHN0cmluZykge31cbn1cblxuZXhwb3J0IGNsYXNzIENyZWF0ZUxpYnJhcnlBY3Rpb24gaW1wbGVtZW50cyBBY3Rpb24ge1xuICByZWFkb25seSB0eXBlID0gTGlicmFyeUFjdGlvblR5cGVzLkNyZWF0ZTtcbn1cblxuZXhwb3J0IGNsYXNzIE5hdmlnYXRlTGlicmFyeUFjdGlvbiBpbXBsZW1lbnRzIEFjdGlvbiB7XG4gIHJlYWRvbmx5IHR5cGUgPSBMaWJyYXJ5QWN0aW9uVHlwZXMuTmF2aWdhdGU7XG5cbiAgY29uc3RydWN0b3IocHVibGljIHBheWxvYWQ/OiBzdHJpbmcpIHt9XG59XG5cbmV4cG9ydCBjbGFzcyBVcGRhdGVMaWJyYXJ5QWN0aW9uIGltcGxlbWVudHMgQWN0aW9uIHtcbiAgcmVhZG9ubHkgdHlwZSA9IExpYnJhcnlBY3Rpb25UeXBlcy5VcGRhdGU7XG5cbiAgY29uc3RydWN0b3IocHVibGljIHBheWxvYWQ/OiBTaXRlQm9keSkge31cbn1cblxuZXhwb3J0IGNsYXNzIExlYXZlTGlicmFyeUFjdGlvbiBpbXBsZW1lbnRzIEFjdGlvbiB7XG4gIHJlYWRvbmx5IHR5cGUgPSBMaWJyYXJ5QWN0aW9uVHlwZXMuTGVhdmU7XG5cbiAgY29uc3RydWN0b3IocHVibGljIHBheWxvYWQ/OiBzdHJpbmcpIHt9XG59XG4iXX0=
