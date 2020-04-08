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
import { FormEvent } from './form.event';
export class ValidateFormEvent extends FormEvent {
  /**
   * @param {?} form
   */
  constructor(form) {
    super(form);
    this.isValid = true;
    this.errorsField = [];
  }
}
if (false) {
  /** @type {?} */
  ValidateFormEvent.prototype.isValid;
  /** @type {?} */
  ValidateFormEvent.prototype.errorsField;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFsaWRhdGUtZm9ybS5ldmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BhbGZyZXNjby9hZGYtY29yZS8iLCJzb3VyY2VzIjpbImZvcm0vZXZlbnRzL3ZhbGlkYXRlLWZvcm0uZXZlbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFrQkEsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUd6QyxNQUFNLE9BQU8saUJBQWtCLFNBQVEsU0FBUzs7OztJQUs1QyxZQUFZLElBQWU7UUFDdkIsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBSmhCLFlBQU8sR0FBRyxJQUFJLENBQUM7UUFDZixnQkFBVyxHQUFxQixFQUFFLENBQUM7SUFJbkMsQ0FBQztDQUNKOzs7SUFORyxvQ0FBZTs7SUFDZix3Q0FBbUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiFcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxOSBBbGZyZXNjbyBTb2Z0d2FyZSwgTHRkLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgeyBGb3JtTW9kZWwgfSBmcm9tICcuLy4uL2NvbXBvbmVudHMvd2lkZ2V0cy9jb3JlL2luZGV4JztcbmltcG9ydCB7IEZvcm1FdmVudCB9IGZyb20gJy4vZm9ybS5ldmVudCc7XG5pbXBvcnQgeyBGb3JtRmllbGRNb2RlbCB9IGZyb20gJy4uL2NvbXBvbmVudHMvd2lkZ2V0cy9jb3JlL2Zvcm0tZmllbGQubW9kZWwnO1xuXG5leHBvcnQgY2xhc3MgVmFsaWRhdGVGb3JtRXZlbnQgZXh0ZW5kcyBGb3JtRXZlbnQge1xuXG4gICAgaXNWYWxpZCA9IHRydWU7XG4gICAgZXJyb3JzRmllbGQ6IEZvcm1GaWVsZE1vZGVsW10gPSBbXTtcblxuICAgIGNvbnN0cnVjdG9yKGZvcm06IEZvcm1Nb2RlbCkge1xuICAgICAgICBzdXBlcihmb3JtKTtcbiAgICB9XG59XG4iXX0=
