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
import { Pipe } from '@angular/core';
export class MultiValuePipe {
  /**
   * @param {?} values
   * @param {?=} valueSeparator
   * @return {?}
   */
  transform(values, valueSeparator = MultiValuePipe.DEFAULT_SEPARATOR) {
    if (values && values instanceof Array) {
      /** @type {?} */
      const valueList = values.map(
        /**
         * @param {?} value
         * @return {?}
         */
        (value => value.trim())
      );
      return valueList.join(valueSeparator);
    }
    return /** @type {?} */ (values);
  }
}
MultiValuePipe.DEFAULT_SEPARATOR = ', ';
MultiValuePipe.decorators = [{ type: Pipe, args: [{ name: 'multiValue' }] }];
if (false) {
  /** @type {?} */
  MultiValuePipe.DEFAULT_SEPARATOR;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXVsdGktdmFsdWUucGlwZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BhbGZyZXNjby9hZGYtY29yZS8iLCJzb3VyY2VzIjpbInBpcGVzL211bHRpLXZhbHVlLnBpcGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFpQkEsT0FBTyxFQUFFLElBQUksRUFBaUIsTUFBTSxlQUFlLENBQUM7QUFHcEQsTUFBTSxPQUFPLGNBQWM7Ozs7OztJQUl2QixTQUFTLENBQUMsTUFBMEIsRUFBRSxpQkFBeUIsY0FBYyxDQUFDLGlCQUFpQjtRQUUzRixJQUFJLE1BQU0sSUFBSSxNQUFNLFlBQVksS0FBSyxFQUFFOztrQkFDN0IsU0FBUyxHQUFHLE1BQU0sQ0FBQyxHQUFHOzs7O1lBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsRUFBQztZQUNyRCxPQUFPLFNBQVMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7U0FDekM7UUFFRCxPQUFPLG1CQUFTLE1BQU0sRUFBQSxDQUFDO0lBQzNCLENBQUM7O0FBVk0sZ0NBQWlCLEdBQUcsSUFBSSxDQUFDOztZQUhuQyxJQUFJLFNBQUMsRUFBRSxJQUFJLEVBQUUsWUFBWSxFQUFFOzs7O0lBR3hCLGlDQUFnQyIsInNvdXJjZXNDb250ZW50IjpbIi8qIVxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE5IEFsZnJlc2NvIFNvZnR3YXJlLCBMdGQuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbmltcG9ydCB7IFBpcGUsIFBpcGVUcmFuc2Zvcm0gfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuQFBpcGUoeyBuYW1lOiAnbXVsdGlWYWx1ZScgfSlcbmV4cG9ydCBjbGFzcyBNdWx0aVZhbHVlUGlwZSBpbXBsZW1lbnRzIFBpcGVUcmFuc2Zvcm0ge1xuXG4gICAgc3RhdGljIERFRkFVTFRfU0VQQVJBVE9SID0gJywgJztcblxuICAgIHRyYW5zZm9ybSh2YWx1ZXM6IHN0cmluZyB8IHN0cmluZyBbXSwgdmFsdWVTZXBhcmF0b3I6IHN0cmluZyA9IE11bHRpVmFsdWVQaXBlLkRFRkFVTFRfU0VQQVJBVE9SKTogc3RyaW5nIHtcblxuICAgICAgICBpZiAodmFsdWVzICYmIHZhbHVlcyBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgICAgICBjb25zdCB2YWx1ZUxpc3QgPSB2YWx1ZXMubWFwKCh2YWx1ZSkgPT4gdmFsdWUudHJpbSgpKTtcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZUxpc3Quam9pbih2YWx1ZVNlcGFyYXRvcik7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gPHN0cmluZz4gdmFsdWVzO1xuICAgIH1cbn1cbiJdfQ==
