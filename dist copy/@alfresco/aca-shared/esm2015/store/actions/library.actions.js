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
const LibraryActionTypes = {
  Delete: 'DELETE_LIBRARY',
  Create: 'CREATE_LIBRARY',
  Navigate: 'NAVIGATE_LIBRARY',
  Update: 'UPDATE_LIBRARY',
  Leave: 'LEAVE_LIBRARY'
};
export { LibraryActionTypes };
export class DeleteLibraryAction {
  /**
   * @param {?=} payload
   */
  constructor(payload) {
    this.payload = payload;
    this.type = LibraryActionTypes.Delete;
  }
}
if (false) {
  /** @type {?} */
  DeleteLibraryAction.prototype.type;
  /** @type {?} */
  DeleteLibraryAction.prototype.payload;
}
export class CreateLibraryAction {
  constructor() {
    this.type = LibraryActionTypes.Create;
  }
}
if (false) {
  /** @type {?} */
  CreateLibraryAction.prototype.type;
}
export class NavigateLibraryAction {
  /**
   * @param {?=} payload
   */
  constructor(payload) {
    this.payload = payload;
    this.type = LibraryActionTypes.Navigate;
  }
}
if (false) {
  /** @type {?} */
  NavigateLibraryAction.prototype.type;
  /** @type {?} */
  NavigateLibraryAction.prototype.payload;
}
export class UpdateLibraryAction {
  /**
   * @param {?=} payload
   */
  constructor(payload) {
    this.payload = payload;
    this.type = LibraryActionTypes.Update;
  }
}
if (false) {
  /** @type {?} */
  UpdateLibraryAction.prototype.type;
  /** @type {?} */
  UpdateLibraryAction.prototype.payload;
}
export class LeaveLibraryAction {
  /**
   * @param {?=} payload
   */
  constructor(payload) {
    this.payload = payload;
    this.type = LibraryActionTypes.Leave;
  }
}
if (false) {
  /** @type {?} */
  LeaveLibraryAction.prototype.type;
  /** @type {?} */
  LeaveLibraryAction.prototype.payload;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlicmFyeS5hY3Rpb25zLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQGFsZnJlc2NvL2FjYS1zaGFyZWQvc3RvcmUvIiwic291cmNlcyI6WyJhY3Rpb25zL2xpYnJhcnkuYWN0aW9ucy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUE2QkUsUUFBUyxnQkFBZ0I7SUFDekIsUUFBUyxnQkFBZ0I7SUFDekIsVUFBVyxrQkFBa0I7SUFDN0IsUUFBUyxnQkFBZ0I7SUFDekIsT0FBUSxlQUFlOzs7QUFHekIsTUFBTSxPQUFPLG1CQUFtQjs7OztJQUc5QixZQUFtQixPQUFnQjtRQUFoQixZQUFPLEdBQVAsT0FBTyxDQUFTO1FBRjFCLFNBQUksR0FBRyxrQkFBa0IsQ0FBQyxNQUFNLENBQUM7SUFFSixDQUFDO0NBQ3hDOzs7SUFIQyxtQ0FBMEM7O0lBRTlCLHNDQUF1Qjs7QUFHckMsTUFBTSxPQUFPLG1CQUFtQjtJQUFoQztRQUNXLFNBQUksR0FBRyxrQkFBa0IsQ0FBQyxNQUFNLENBQUM7SUFDNUMsQ0FBQztDQUFBOzs7SUFEQyxtQ0FBMEM7O0FBRzVDLE1BQU0sT0FBTyxxQkFBcUI7Ozs7SUFHaEMsWUFBbUIsT0FBZ0I7UUFBaEIsWUFBTyxHQUFQLE9BQU8sQ0FBUztRQUYxQixTQUFJLEdBQUcsa0JBQWtCLENBQUMsUUFBUSxDQUFDO0lBRU4sQ0FBQztDQUN4Qzs7O0lBSEMscUNBQTRDOztJQUVoQyx3Q0FBdUI7O0FBR3JDLE1BQU0sT0FBTyxtQkFBbUI7Ozs7SUFHOUIsWUFBbUIsT0FBa0I7UUFBbEIsWUFBTyxHQUFQLE9BQU8sQ0FBVztRQUY1QixTQUFJLEdBQUcsa0JBQWtCLENBQUMsTUFBTSxDQUFDO0lBRUYsQ0FBQztDQUMxQzs7O0lBSEMsbUNBQTBDOztJQUU5QixzQ0FBeUI7O0FBR3ZDLE1BQU0sT0FBTyxrQkFBa0I7Ozs7SUFHN0IsWUFBbUIsT0FBZ0I7UUFBaEIsWUFBTyxHQUFQLE9BQU8sQ0FBUztRQUYxQixTQUFJLEdBQUcsa0JBQWtCLENBQUMsS0FBSyxDQUFDO0lBRUgsQ0FBQztDQUN4Qzs7O0lBSEMsa0NBQXlDOztJQUU3QixxQ0FBdUIiLCJzb3VyY2VzQ29udGVudCI6WyIvKiFcbiAqIEBsaWNlbnNlXG4gKiBBbGZyZXNjbyBFeGFtcGxlIENvbnRlbnQgQXBwbGljYXRpb25cbiAqXG4gKiBDb3B5cmlnaHQgKEMpIDIwMDUgLSAyMDIwIEFsZnJlc2NvIFNvZnR3YXJlIExpbWl0ZWRcbiAqXG4gKiBUaGlzIGZpbGUgaXMgcGFydCBvZiB0aGUgQWxmcmVzY28gRXhhbXBsZSBDb250ZW50IEFwcGxpY2F0aW9uLlxuICogSWYgdGhlIHNvZnR3YXJlIHdhcyBwdXJjaGFzZWQgdW5kZXIgYSBwYWlkIEFsZnJlc2NvIGxpY2Vuc2UsIHRoZSB0ZXJtcyBvZlxuICogdGhlIHBhaWQgbGljZW5zZSBhZ3JlZW1lbnQgd2lsbCBwcmV2YWlsLiAgT3RoZXJ3aXNlLCB0aGUgc29mdHdhcmUgaXNcbiAqIHByb3ZpZGVkIHVuZGVyIHRoZSBmb2xsb3dpbmcgb3BlbiBzb3VyY2UgbGljZW5zZSB0ZXJtczpcbiAqXG4gKiBUaGUgQWxmcmVzY28gRXhhbXBsZSBDb250ZW50IEFwcGxpY2F0aW9uIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbiAqIGl0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIExlc3NlciBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxuICogdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3JcbiAqIChhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG4gKlxuICogVGhlIEFsZnJlc2NvIEV4YW1wbGUgQ29udGVudCBBcHBsaWNhdGlvbiBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuICogYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2ZcbiAqIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbiAqIEdOVSBMZXNzZXIgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuICpcbiAqIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBMZXNzZXIgR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogYWxvbmcgd2l0aCBBbGZyZXNjby4gSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuICovXG5cbmltcG9ydCB7IEFjdGlvbiB9IGZyb20gJ0BuZ3J4L3N0b3JlJztcbmltcG9ydCB7IFNpdGVCb2R5IH0gZnJvbSAnQGFsZnJlc2NvL2pzLWFwaSc7XG5cbmV4cG9ydCBlbnVtIExpYnJhcnlBY3Rpb25UeXBlcyB7XG4gIERlbGV0ZSA9ICdERUxFVEVfTElCUkFSWScsXG4gIENyZWF0ZSA9ICdDUkVBVEVfTElCUkFSWScsXG4gIE5hdmlnYXRlID0gJ05BVklHQVRFX0xJQlJBUlknLFxuICBVcGRhdGUgPSAnVVBEQVRFX0xJQlJBUlknLFxuICBMZWF2ZSA9ICdMRUFWRV9MSUJSQVJZJ1xufVxuXG5leHBvcnQgY2xhc3MgRGVsZXRlTGlicmFyeUFjdGlvbiBpbXBsZW1lbnRzIEFjdGlvbiB7XG4gIHJlYWRvbmx5IHR5cGUgPSBMaWJyYXJ5QWN0aW9uVHlwZXMuRGVsZXRlO1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBwYXlsb2FkPzogc3RyaW5nKSB7fVxufVxuXG5leHBvcnQgY2xhc3MgQ3JlYXRlTGlicmFyeUFjdGlvbiBpbXBsZW1lbnRzIEFjdGlvbiB7XG4gIHJlYWRvbmx5IHR5cGUgPSBMaWJyYXJ5QWN0aW9uVHlwZXMuQ3JlYXRlO1xufVxuXG5leHBvcnQgY2xhc3MgTmF2aWdhdGVMaWJyYXJ5QWN0aW9uIGltcGxlbWVudHMgQWN0aW9uIHtcbiAgcmVhZG9ubHkgdHlwZSA9IExpYnJhcnlBY3Rpb25UeXBlcy5OYXZpZ2F0ZTtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgcGF5bG9hZD86IHN0cmluZykge31cbn1cblxuZXhwb3J0IGNsYXNzIFVwZGF0ZUxpYnJhcnlBY3Rpb24gaW1wbGVtZW50cyBBY3Rpb24ge1xuICByZWFkb25seSB0eXBlID0gTGlicmFyeUFjdGlvblR5cGVzLlVwZGF0ZTtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgcGF5bG9hZD86IFNpdGVCb2R5KSB7fVxufVxuXG5leHBvcnQgY2xhc3MgTGVhdmVMaWJyYXJ5QWN0aW9uIGltcGxlbWVudHMgQWN0aW9uIHtcbiAgcmVhZG9ubHkgdHlwZSA9IExpYnJhcnlBY3Rpb25UeXBlcy5MZWF2ZTtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgcGF5bG9hZD86IHN0cmluZykge31cbn1cbiJdfQ==
