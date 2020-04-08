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
export class CardViewItemIntValidator {
  constructor() {
    this.message = 'CORE.CARDVIEW.VALIDATORS.INT_VALIDATION_ERROR';
  }
  /**
   * @param {?} value
   * @return {?}
   */
  isValid(value) {
    return value === '' || (!isNaN(value) && this.isIntegerNumber(value));
  }
  /**
   * @param {?} value
   * @return {?}
   */
  isIntegerNumber(value) {
    /** @type {?} */
    const parsedNumber = parseFloat(value);
    return (parsedNumber | 0) === parsedNumber;
  }
}
if (false) {
  /** @type {?} */
  CardViewItemIntValidator.prototype.message;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FyZC12aWV3LWl0ZW0taW50LnZhbGlkYXRvci5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BhbGZyZXNjby9hZGYtY29yZS8iLCJzb3VyY2VzIjpbImNhcmQtdmlldy92YWxpZGF0b3JzL2NhcmQtdmlldy1pdGVtLWludC52YWxpZGF0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFtQkEsTUFBTSxPQUFPLHdCQUF3QjtJQUFyQztRQUVJLFlBQU8sR0FBRywrQ0FBK0MsQ0FBQztJQVk5RCxDQUFDOzs7OztJQVZHLE9BQU8sQ0FBQyxLQUFVO1FBQ2QsT0FBTyxLQUFLLEtBQUssRUFBRTtlQUNaLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQzttQkFDYixJQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3ZDLENBQUM7Ozs7O0lBRUQsZUFBZSxDQUFDLEtBQVU7O2NBQ2hCLFlBQVksR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFDO1FBQ3RDLE9BQU8sQ0FBQyxZQUFZLEdBQUcsQ0FBQyxDQUFDLEtBQUssWUFBWSxDQUFDO0lBQy9DLENBQUM7Q0FDSjs7O0lBWkcsMkNBQTBEIiwic291cmNlc0NvbnRlbnQiOlsiLyohXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTkgQWxmcmVzY28gU29mdHdhcmUsIEx0ZC5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0IHsgQ2FyZFZpZXdJdGVtVmFsaWRhdG9yIH0gZnJvbSAnLi4vaW50ZXJmYWNlcy9jYXJkLXZpZXcuaW50ZXJmYWNlcyc7XG5cbmV4cG9ydCBjbGFzcyBDYXJkVmlld0l0ZW1JbnRWYWxpZGF0b3IgaW1wbGVtZW50cyBDYXJkVmlld0l0ZW1WYWxpZGF0b3Ige1xuXG4gICAgbWVzc2FnZSA9ICdDT1JFLkNBUkRWSUVXLlZBTElEQVRPUlMuSU5UX1ZBTElEQVRJT05fRVJST1InO1xuXG4gICAgaXNWYWxpZCh2YWx1ZTogYW55KTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB2YWx1ZSA9PT0gJydcbiAgICAgICAgICAgIHx8ICFpc05hTih2YWx1ZSlcbiAgICAgICAgICAgICYmIHRoaXMuaXNJbnRlZ2VyTnVtYmVyKHZhbHVlKTtcbiAgICB9XG5cbiAgICBpc0ludGVnZXJOdW1iZXIodmFsdWU6IGFueSk6IGJvb2xlYW4ge1xuICAgICAgICBjb25zdCBwYXJzZWROdW1iZXIgPSBwYXJzZUZsb2F0KHZhbHVlKTtcbiAgICAgICAgcmV0dXJuIChwYXJzZWROdW1iZXIgfCAwKSA9PT0gcGFyc2VkTnVtYmVyO1xuICAgIH1cbn1cbiJdfQ==
