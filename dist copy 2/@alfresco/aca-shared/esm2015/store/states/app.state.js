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
/**
 * @record
 */
export function AppState() {}
if (false) {
  /** @type {?} */
  AppState.prototype.appName;
  /** @type {?} */
  AppState.prototype.headerColor;
  /** @type {?} */
  AppState.prototype.logoPath;
  /** @type {?} */
  AppState.prototype.languagePicker;
  /** @type {?} */
  AppState.prototype.sharedUrl;
  /** @type {?} */
  AppState.prototype.selection;
  /** @type {?} */
  AppState.prototype.user;
  /** @type {?} */
  AppState.prototype.navigation;
  /** @type {?} */
  AppState.prototype.infoDrawerOpened;
  /** @type {?} */
  AppState.prototype.infoDrawerMetadataAspect;
  /** @type {?} */
  AppState.prototype.showFacetFilter;
  /** @type {?} */
  AppState.prototype.documentDisplayMode;
  /** @type {?} */
  AppState.prototype.repository;
  /** @type {?} */
  AppState.prototype.processServices;
}
/**
 * @record
 */
export function AppStore() {}
if (false) {
  /** @type {?} */
  AppStore.prototype.app;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLnN0YXRlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQGFsZnJlc2NvL2FjYS1zaGFyZWQvc3RvcmUvIiwic291cmNlcyI6WyJzdGF0ZXMvYXBwLnN0YXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFnQ0EsOEJBZUM7OztJQWRDLDJCQUFnQjs7SUFDaEIsK0JBQW9COztJQUNwQiw0QkFBaUI7O0lBQ2pCLGtDQUF3Qjs7SUFDeEIsNkJBQWtCOztJQUNsQiw2QkFBMEI7O0lBQzFCLHdCQUFtQjs7SUFDbkIsOEJBQTRCOztJQUM1QixvQ0FBMEI7O0lBQzFCLDRDQUFpQzs7SUFDakMsbUNBQXlCOztJQUN6Qix1Q0FBNEI7O0lBQzVCLDhCQUEyQjs7SUFDM0IsbUNBQXlCOzs7OztBQUczQiw4QkFFQzs7O0lBREMsdUJBQWMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiFcbiAqIEBsaWNlbnNlXG4gKiBBbGZyZXNjbyBFeGFtcGxlIENvbnRlbnQgQXBwbGljYXRpb25cbiAqXG4gKiBDb3B5cmlnaHQgKEMpIDIwMDUgLSAyMDIwIEFsZnJlc2NvIFNvZnR3YXJlIExpbWl0ZWRcbiAqXG4gKiBUaGlzIGZpbGUgaXMgcGFydCBvZiB0aGUgQWxmcmVzY28gRXhhbXBsZSBDb250ZW50IEFwcGxpY2F0aW9uLlxuICogSWYgdGhlIHNvZnR3YXJlIHdhcyBwdXJjaGFzZWQgdW5kZXIgYSBwYWlkIEFsZnJlc2NvIGxpY2Vuc2UsIHRoZSB0ZXJtcyBvZlxuICogdGhlIHBhaWQgbGljZW5zZSBhZ3JlZW1lbnQgd2lsbCBwcmV2YWlsLiAgT3RoZXJ3aXNlLCB0aGUgc29mdHdhcmUgaXNcbiAqIHByb3ZpZGVkIHVuZGVyIHRoZSBmb2xsb3dpbmcgb3BlbiBzb3VyY2UgbGljZW5zZSB0ZXJtczpcbiAqXG4gKiBUaGUgQWxmcmVzY28gRXhhbXBsZSBDb250ZW50IEFwcGxpY2F0aW9uIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbiAqIGl0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIExlc3NlciBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxuICogdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3JcbiAqIChhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG4gKlxuICogVGhlIEFsZnJlc2NvIEV4YW1wbGUgQ29udGVudCBBcHBsaWNhdGlvbiBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuICogYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2ZcbiAqIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbiAqIEdOVSBMZXNzZXIgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuICpcbiAqIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBMZXNzZXIgR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogYWxvbmcgd2l0aCBBbGZyZXNjby4gSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuICovXG5cbmltcG9ydCB7XG4gIFNlbGVjdGlvblN0YXRlLFxuICBQcm9maWxlU3RhdGUsXG4gIE5hdmlnYXRpb25TdGF0ZVxufSBmcm9tICdAYWxmcmVzY28vYWRmLWV4dGVuc2lvbnMnO1xuaW1wb3J0IHsgUmVwb3NpdG9yeUluZm8gfSBmcm9tICdAYWxmcmVzY28vanMtYXBpJztcblxuZXhwb3J0IGludGVyZmFjZSBBcHBTdGF0ZSB7XG4gIGFwcE5hbWU6IHN0cmluZztcbiAgaGVhZGVyQ29sb3I6IHN0cmluZztcbiAgbG9nb1BhdGg6IHN0cmluZztcbiAgbGFuZ3VhZ2VQaWNrZXI6IGJvb2xlYW47XG4gIHNoYXJlZFVybDogc3RyaW5nO1xuICBzZWxlY3Rpb246IFNlbGVjdGlvblN0YXRlO1xuICB1c2VyOiBQcm9maWxlU3RhdGU7XG4gIG5hdmlnYXRpb246IE5hdmlnYXRpb25TdGF0ZTtcbiAgaW5mb0RyYXdlck9wZW5lZDogYm9vbGVhbjtcbiAgaW5mb0RyYXdlck1ldGFkYXRhQXNwZWN0OiBzdHJpbmc7XG4gIHNob3dGYWNldEZpbHRlcjogYm9vbGVhbjtcbiAgZG9jdW1lbnREaXNwbGF5TW9kZTogc3RyaW5nO1xuICByZXBvc2l0b3J5OiBSZXBvc2l0b3J5SW5mbztcbiAgcHJvY2Vzc1NlcnZpY2VzOiBib29sZWFuO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEFwcFN0b3JlIHtcbiAgYXBwOiBBcHBTdGF0ZTtcbn1cbiJdfQ==
