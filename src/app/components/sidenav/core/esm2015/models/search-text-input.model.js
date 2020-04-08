/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/** @enum {string} */
const SearchTextStateEnum = {
  expanded: 'expanded',
  collapsed: 'collapsed'
};
export { SearchTextStateEnum };
/**
 * @record
 */
export function SearchAnimationState() {}
if (false) {
  /** @type {?} */
  SearchAnimationState.prototype.value;
  /** @type {?|undefined} */
  SearchAnimationState.prototype.params;
}
/**
 * @record
 */
export function SearchAnimationControl() {}
if (false) {
  /** @type {?} */
  SearchAnimationControl.prototype.active;
  /** @type {?} */
  SearchAnimationControl.prototype.inactive;
}
/**
 * @record
 */
export function SearchAnimationDirection() {}
if (false) {
  /** @type {?} */
  SearchAnimationDirection.prototype.ltr;
  /** @type {?} */
  SearchAnimationDirection.prototype.rtl;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VhcmNoLXRleHQtaW5wdXQubW9kZWwuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AYWxmcmVzY28vYWRmLWNvcmUvIiwic291cmNlcyI6WyJtb2RlbHMvc2VhcmNoLXRleHQtaW5wdXQubW9kZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQWtCSSxVQUFXLFVBQVU7SUFDckIsV0FBWSxXQUFXOzs7Ozs7QUFHM0IsMENBR0M7OztJQUZHLHFDQUFjOztJQUNkLHNDQUFhOzs7OztBQUdqQiw0Q0FHQzs7O0lBRkcsd0NBQTZCOztJQUM3QiwwQ0FBK0I7Ozs7O0FBR25DLDhDQUdDOzs7SUFGRyx1Q0FBNEI7O0lBQzVCLHVDQUE0QiIsInNvdXJjZXNDb250ZW50IjpbIi8qIVxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE5IEFsZnJlc2NvIFNvZnR3YXJlLCBMdGQuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbmV4cG9ydCBlbnVtIFNlYXJjaFRleHRTdGF0ZUVudW0ge1xuICAgIGV4cGFuZGVkID0gJ2V4cGFuZGVkJyxcbiAgICBjb2xsYXBzZWQgPSAnY29sbGFwc2VkJ1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFNlYXJjaEFuaW1hdGlvblN0YXRlIHtcbiAgICB2YWx1ZTogc3RyaW5nO1xuICAgIHBhcmFtcz86IGFueTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBTZWFyY2hBbmltYXRpb25Db250cm9sIHtcbiAgICBhY3RpdmU6IFNlYXJjaEFuaW1hdGlvblN0YXRlO1xuICAgIGluYWN0aXZlOiBTZWFyY2hBbmltYXRpb25TdGF0ZTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBTZWFyY2hBbmltYXRpb25EaXJlY3Rpb24ge1xuICAgIGx0cjogU2VhcmNoQW5pbWF0aW9uQ29udHJvbDtcbiAgICBydGw6IFNlYXJjaEFuaW1hdGlvbkNvbnRyb2w7XG59XG4iXX0=
