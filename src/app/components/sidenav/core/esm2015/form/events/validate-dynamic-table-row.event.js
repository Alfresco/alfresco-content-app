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
import { FormFieldEvent } from './form-field.event';
export class ValidateDynamicTableRowEvent extends FormFieldEvent {
  /**
   * @param {?} form
   * @param {?} field
   * @param {?} row
   * @param {?} summary
   */
  constructor(form, field, row, summary) {
    super(form, field);
    this.row = row;
    this.summary = summary;
    this.isValid = true;
  }
}
if (false) {
  /** @type {?} */
  ValidateDynamicTableRowEvent.prototype.isValid;
  /** @type {?} */
  ValidateDynamicTableRowEvent.prototype.row;
  /** @type {?} */
  ValidateDynamicTableRowEvent.prototype.summary;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFsaWRhdGUtZHluYW1pYy10YWJsZS1yb3cuZXZlbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AYWxmcmVzY28vYWRmLWNvcmUvIiwic291cmNlcyI6WyJmb3JtL2V2ZW50cy92YWxpZGF0ZS1keW5hbWljLXRhYmxlLXJvdy5ldmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXFCQSxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFFcEQsTUFBTSxPQUFPLDRCQUE2QixTQUFRLGNBQWM7Ozs7Ozs7SUFJNUQsWUFBWSxJQUFlLEVBQ2YsS0FBcUIsRUFDZCxHQUFvQixFQUNwQixPQUFvQztRQUNuRCxLQUFLLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRkosUUFBRyxHQUFILEdBQUcsQ0FBaUI7UUFDcEIsWUFBTyxHQUFQLE9BQU8sQ0FBNkI7UUFMdkQsWUFBTyxHQUFHLElBQUksQ0FBQztJQU9mLENBQUM7Q0FFSjs7O0lBVEcsK0NBQWU7O0lBSUgsMkNBQTJCOztJQUMzQiwrQ0FBMkMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiFcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxOSBBbGZyZXNjbyBTb2Z0d2FyZSwgTHRkLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgeyBEeW5hbWljUm93VmFsaWRhdGlvblN1bW1hcnkgfSBmcm9tICcuLi9jb21wb25lbnRzL3dpZGdldHMvZHluYW1pYy10YWJsZS9keW5hbWljLXJvdy12YWxpZGF0aW9uLXN1bW1hcnkubW9kZWwnO1xuaW1wb3J0IHsgRHluYW1pY1RhYmxlUm93IH0gZnJvbSAnLi4vY29tcG9uZW50cy93aWRnZXRzL2R5bmFtaWMtdGFibGUvZHluYW1pYy10YWJsZS1yb3cubW9kZWwnO1xuXG5pbXBvcnQgeyBGb3JtRmllbGRNb2RlbCwgRm9ybU1vZGVsIH0gZnJvbSAnLi8uLi9jb21wb25lbnRzL3dpZGdldHMvY29yZS9pbmRleCc7XG5pbXBvcnQgeyBGb3JtRmllbGRFdmVudCB9IGZyb20gJy4vZm9ybS1maWVsZC5ldmVudCc7XG5cbmV4cG9ydCBjbGFzcyBWYWxpZGF0ZUR5bmFtaWNUYWJsZVJvd0V2ZW50IGV4dGVuZHMgRm9ybUZpZWxkRXZlbnQge1xuXG4gICAgaXNWYWxpZCA9IHRydWU7XG5cbiAgICBjb25zdHJ1Y3Rvcihmb3JtOiBGb3JtTW9kZWwsXG4gICAgICAgICAgICAgICAgZmllbGQ6IEZvcm1GaWVsZE1vZGVsLFxuICAgICAgICAgICAgICAgIHB1YmxpYyByb3c6IER5bmFtaWNUYWJsZVJvdyxcbiAgICAgICAgICAgICAgICBwdWJsaWMgc3VtbWFyeTogRHluYW1pY1Jvd1ZhbGlkYXRpb25TdW1tYXJ5KSB7XG4gICAgICAgIHN1cGVyKGZvcm0sIGZpZWxkKTtcbiAgICB9XG5cbn1cbiJdfQ==
