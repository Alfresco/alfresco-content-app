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
const SnackbarActionTypes = {
  Info: 'SNACKBAR_INFO',
  Warning: 'SNACKBAR_WARNING',
  Error: 'SNACKBAR_ERROR'
};
export { SnackbarActionTypes };
/**
 * @record
 */
export function SnackbarAction() {}
if (false) {
  /** @type {?} */
  SnackbarAction.prototype.payload;
  /** @type {?|undefined} */
  SnackbarAction.prototype.params;
  /** @type {?|undefined} */
  SnackbarAction.prototype.userAction;
  /** @type {?} */
  SnackbarAction.prototype.duration;
}
export class SnackbarUserAction {
  /**
   * @param {?} title
   * @param {?} action
   */
  constructor(title, action) {
    this.title = title;
    this.action = action;
  }
}
if (false) {
  /** @type {?} */
  SnackbarUserAction.prototype.title;
  /** @type {?} */
  SnackbarUserAction.prototype.action;
}
export class SnackbarInfoAction {
  /**
   * @param {?} payload
   * @param {?=} params
   */
  constructor(payload, params) {
    this.payload = payload;
    this.params = params;
    this.type = SnackbarActionTypes.Info;
    this.duration = 4000;
  }
}
if (false) {
  /** @type {?} */
  SnackbarInfoAction.prototype.type;
  /** @type {?} */
  SnackbarInfoAction.prototype.userAction;
  /** @type {?} */
  SnackbarInfoAction.prototype.duration;
  /** @type {?} */
  SnackbarInfoAction.prototype.payload;
  /** @type {?} */
  SnackbarInfoAction.prototype.params;
}
export class SnackbarWarningAction {
  /**
   * @param {?} payload
   * @param {?=} params
   */
  constructor(payload, params) {
    this.payload = payload;
    this.params = params;
    this.type = SnackbarActionTypes.Warning;
    this.duration = 4000;
  }
}
if (false) {
  /** @type {?} */
  SnackbarWarningAction.prototype.type;
  /** @type {?} */
  SnackbarWarningAction.prototype.userAction;
  /** @type {?} */
  SnackbarWarningAction.prototype.duration;
  /** @type {?} */
  SnackbarWarningAction.prototype.payload;
  /** @type {?} */
  SnackbarWarningAction.prototype.params;
}
export class SnackbarErrorAction {
  /**
   * @param {?} payload
   * @param {?=} params
   */
  constructor(payload, params) {
    this.payload = payload;
    this.params = params;
    this.type = SnackbarActionTypes.Error;
    this.duration = 4000;
  }
}
if (false) {
  /** @type {?} */
  SnackbarErrorAction.prototype.type;
  /** @type {?} */
  SnackbarErrorAction.prototype.userAction;
  /** @type {?} */
  SnackbarErrorAction.prototype.duration;
  /** @type {?} */
  SnackbarErrorAction.prototype.payload;
  /** @type {?} */
  SnackbarErrorAction.prototype.params;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic25hY2tiYXIuYWN0aW9ucy5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BhbGZyZXNjby9hY2Etc2hhcmVkL3N0b3JlLyIsInNvdXJjZXMiOlsiYWN0aW9ucy9zbmFja2Jhci5hY3Rpb25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQTRCRSxNQUFPLGVBQWU7SUFDdEIsU0FBVSxrQkFBa0I7SUFDNUIsT0FBUSxnQkFBZ0I7Ozs7OztBQUcxQixvQ0FLQzs7O0lBSkMsaUNBQWdCOztJQUNoQixnQ0FBZ0I7O0lBQ2hCLG9DQUFnQzs7SUFDaEMsa0NBQWlCOztBQUduQixNQUFNLE9BQU8sa0JBQWtCOzs7OztJQUM3QixZQUFtQixLQUFhLEVBQVMsTUFBYztRQUFwQyxVQUFLLEdBQUwsS0FBSyxDQUFRO1FBQVMsV0FBTSxHQUFOLE1BQU0sQ0FBUTtJQUFHLENBQUM7Q0FDNUQ7OztJQURhLG1DQUFvQjs7SUFBRSxvQ0FBcUI7O0FBR3pELE1BQU0sT0FBTyxrQkFBa0I7Ozs7O0lBTTdCLFlBQW1CLE9BQWUsRUFBUyxNQUFlO1FBQXZDLFlBQU8sR0FBUCxPQUFPLENBQVE7UUFBUyxXQUFNLEdBQU4sTUFBTSxDQUFTO1FBTGpELFNBQUksR0FBRyxtQkFBbUIsQ0FBQyxJQUFJLENBQUM7UUFHekMsYUFBUSxHQUFHLElBQUksQ0FBQztJQUU2QyxDQUFDO0NBQy9EOzs7SUFOQyxrQ0FBeUM7O0lBRXpDLHdDQUFnQzs7SUFDaEMsc0NBQWdCOztJQUVKLHFDQUFzQjs7SUFBRSxvQ0FBc0I7O0FBRzVELE1BQU0sT0FBTyxxQkFBcUI7Ozs7O0lBTWhDLFlBQW1CLE9BQWUsRUFBUyxNQUFlO1FBQXZDLFlBQU8sR0FBUCxPQUFPLENBQVE7UUFBUyxXQUFNLEdBQU4sTUFBTSxDQUFTO1FBTGpELFNBQUksR0FBRyxtQkFBbUIsQ0FBQyxPQUFPLENBQUM7UUFHNUMsYUFBUSxHQUFHLElBQUksQ0FBQztJQUU2QyxDQUFDO0NBQy9EOzs7SUFOQyxxQ0FBNEM7O0lBRTVDLDJDQUFnQzs7SUFDaEMseUNBQWdCOztJQUVKLHdDQUFzQjs7SUFBRSx1Q0FBc0I7O0FBRzVELE1BQU0sT0FBTyxtQkFBbUI7Ozs7O0lBTTlCLFlBQW1CLE9BQWUsRUFBUyxNQUFlO1FBQXZDLFlBQU8sR0FBUCxPQUFPLENBQVE7UUFBUyxXQUFNLEdBQU4sTUFBTSxDQUFTO1FBTGpELFNBQUksR0FBRyxtQkFBbUIsQ0FBQyxLQUFLLENBQUM7UUFHMUMsYUFBUSxHQUFHLElBQUksQ0FBQztJQUU2QyxDQUFDO0NBQy9EOzs7SUFOQyxtQ0FBMEM7O0lBRTFDLHlDQUFnQzs7SUFDaEMsdUNBQWdCOztJQUVKLHNDQUFzQjs7SUFBRSxxQ0FBc0IiLCJzb3VyY2VzQ29udGVudCI6WyIvKiFcbiAqIEBsaWNlbnNlXG4gKiBBbGZyZXNjbyBFeGFtcGxlIENvbnRlbnQgQXBwbGljYXRpb25cbiAqXG4gKiBDb3B5cmlnaHQgKEMpIDIwMDUgLSAyMDIwIEFsZnJlc2NvIFNvZnR3YXJlIExpbWl0ZWRcbiAqXG4gKiBUaGlzIGZpbGUgaXMgcGFydCBvZiB0aGUgQWxmcmVzY28gRXhhbXBsZSBDb250ZW50IEFwcGxpY2F0aW9uLlxuICogSWYgdGhlIHNvZnR3YXJlIHdhcyBwdXJjaGFzZWQgdW5kZXIgYSBwYWlkIEFsZnJlc2NvIGxpY2Vuc2UsIHRoZSB0ZXJtcyBvZlxuICogdGhlIHBhaWQgbGljZW5zZSBhZ3JlZW1lbnQgd2lsbCBwcmV2YWlsLiAgT3RoZXJ3aXNlLCB0aGUgc29mdHdhcmUgaXNcbiAqIHByb3ZpZGVkIHVuZGVyIHRoZSBmb2xsb3dpbmcgb3BlbiBzb3VyY2UgbGljZW5zZSB0ZXJtczpcbiAqXG4gKiBUaGUgQWxmcmVzY28gRXhhbXBsZSBDb250ZW50IEFwcGxpY2F0aW9uIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbiAqIGl0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIExlc3NlciBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxuICogdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3JcbiAqIChhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG4gKlxuICogVGhlIEFsZnJlc2NvIEV4YW1wbGUgQ29udGVudCBBcHBsaWNhdGlvbiBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuICogYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2ZcbiAqIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbiAqIEdOVSBMZXNzZXIgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuICpcbiAqIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBMZXNzZXIgR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogYWxvbmcgd2l0aCBBbGZyZXNjby4gSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuICovXG5cbmltcG9ydCB7IEFjdGlvbiB9IGZyb20gJ0BuZ3J4L3N0b3JlJztcblxuZXhwb3J0IGVudW0gU25hY2tiYXJBY3Rpb25UeXBlcyB7XG4gIEluZm8gPSAnU05BQ0tCQVJfSU5GTycsXG4gIFdhcm5pbmcgPSAnU05BQ0tCQVJfV0FSTklORycsXG4gIEVycm9yID0gJ1NOQUNLQkFSX0VSUk9SJ1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFNuYWNrYmFyQWN0aW9uIGV4dGVuZHMgQWN0aW9uIHtcbiAgcGF5bG9hZDogc3RyaW5nO1xuICBwYXJhbXM/OiBPYmplY3Q7XG4gIHVzZXJBY3Rpb24/OiBTbmFja2JhclVzZXJBY3Rpb247XG4gIGR1cmF0aW9uOiBudW1iZXI7XG59XG5cbmV4cG9ydCBjbGFzcyBTbmFja2JhclVzZXJBY3Rpb24ge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgdGl0bGU6IHN0cmluZywgcHVibGljIGFjdGlvbjogQWN0aW9uKSB7fVxufVxuXG5leHBvcnQgY2xhc3MgU25hY2tiYXJJbmZvQWN0aW9uIGltcGxlbWVudHMgU25hY2tiYXJBY3Rpb24ge1xuICByZWFkb25seSB0eXBlID0gU25hY2tiYXJBY3Rpb25UeXBlcy5JbmZvO1xuXG4gIHVzZXJBY3Rpb24/OiBTbmFja2JhclVzZXJBY3Rpb247XG4gIGR1cmF0aW9uID0gNDAwMDtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgcGF5bG9hZDogc3RyaW5nLCBwdWJsaWMgcGFyYW1zPzogT2JqZWN0KSB7fVxufVxuXG5leHBvcnQgY2xhc3MgU25hY2tiYXJXYXJuaW5nQWN0aW9uIGltcGxlbWVudHMgU25hY2tiYXJBY3Rpb24ge1xuICByZWFkb25seSB0eXBlID0gU25hY2tiYXJBY3Rpb25UeXBlcy5XYXJuaW5nO1xuXG4gIHVzZXJBY3Rpb24/OiBTbmFja2JhclVzZXJBY3Rpb247XG4gIGR1cmF0aW9uID0gNDAwMDtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgcGF5bG9hZDogc3RyaW5nLCBwdWJsaWMgcGFyYW1zPzogT2JqZWN0KSB7fVxufVxuXG5leHBvcnQgY2xhc3MgU25hY2tiYXJFcnJvckFjdGlvbiBpbXBsZW1lbnRzIFNuYWNrYmFyQWN0aW9uIHtcbiAgcmVhZG9ubHkgdHlwZSA9IFNuYWNrYmFyQWN0aW9uVHlwZXMuRXJyb3I7XG5cbiAgdXNlckFjdGlvbj86IFNuYWNrYmFyVXNlckFjdGlvbjtcbiAgZHVyYXRpb24gPSA0MDAwO1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBwYXlsb2FkOiBzdHJpbmcsIHB1YmxpYyBwYXJhbXM/OiBPYmplY3QpIHt9XG59XG4iXX0=
