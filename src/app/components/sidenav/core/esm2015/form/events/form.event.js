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
export class FormEvent {
  /**
   * @param {?} form
   */
  constructor(form) {
    this.isDefaultPrevented = false;
    this.form = form;
  }
  /**
   * @return {?}
   */
  get defaultPrevented() {
    return this.isDefaultPrevented;
  }
  /**
   * @return {?}
   */
  preventDefault() {
    this.isDefaultPrevented = true;
  }
}
if (false) {
  /**
   * @type {?}
   * @private
   */
  FormEvent.prototype.isDefaultPrevented;
  /** @type {?} */
  FormEvent.prototype.form;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybS5ldmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BhbGZyZXNjby9hZGYtY29yZS8iLCJzb3VyY2VzIjpbImZvcm0vZXZlbnRzL2Zvcm0uZXZlbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFtQkEsTUFBTSxPQUFPLFNBQVM7Ozs7SUFNbEIsWUFBWSxJQUFlO1FBSm5CLHVCQUFrQixHQUFZLEtBQUssQ0FBQztRQUt4QyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztJQUNyQixDQUFDOzs7O0lBRUQsSUFBSSxnQkFBZ0I7UUFDaEIsT0FBTyxJQUFJLENBQUMsa0JBQWtCLENBQUM7SUFDbkMsQ0FBQzs7OztJQUVELGNBQWM7UUFDVixJQUFJLENBQUMsa0JBQWtCLEdBQUcsSUFBSSxDQUFDO0lBQ25DLENBQUM7Q0FDSjs7Ozs7O0lBZkcsdUNBQTRDOztJQUU1Qyx5QkFBeUIiLCJzb3VyY2VzQ29udGVudCI6WyIvKiFcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxOSBBbGZyZXNjbyBTb2Z0d2FyZSwgTHRkLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgeyBGb3JtTW9kZWwgfSBmcm9tICcuLy4uL2NvbXBvbmVudHMvd2lkZ2V0cy9jb3JlL2luZGV4JztcblxuZXhwb3J0IGNsYXNzIEZvcm1FdmVudCB7XG5cbiAgICBwcml2YXRlIGlzRGVmYXVsdFByZXZlbnRlZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgcmVhZG9ubHkgZm9ybTogRm9ybU1vZGVsO1xuXG4gICAgY29uc3RydWN0b3IoZm9ybTogRm9ybU1vZGVsKSB7XG4gICAgICAgIHRoaXMuZm9ybSA9IGZvcm07XG4gICAgfVxuXG4gICAgZ2V0IGRlZmF1bHRQcmV2ZW50ZWQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmlzRGVmYXVsdFByZXZlbnRlZDtcbiAgICB9XG5cbiAgICBwcmV2ZW50RGVmYXVsdCgpIHtcbiAgICAgICAgdGhpcy5pc0RlZmF1bHRQcmV2ZW50ZWQgPSB0cnVlO1xuICAgIH1cbn1cbiJdfQ==
