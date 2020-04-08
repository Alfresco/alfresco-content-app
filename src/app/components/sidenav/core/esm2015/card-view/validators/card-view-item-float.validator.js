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
export class CardViewItemFloatValidator {
  constructor() {
    this.message = 'CORE.CARDVIEW.VALIDATORS.FLOAT_VALIDATION_ERROR';
  }
  /**
   * @param {?} value
   * @return {?}
   */
  isValid(value) {
    return value === '' || (!isNaN(parseFloat(value)) && isFinite(value));
  }
}
if (false) {
  /** @type {?} */
  CardViewItemFloatValidator.prototype.message;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FyZC12aWV3LWl0ZW0tZmxvYXQudmFsaWRhdG9yLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQGFsZnJlc2NvL2FkZi1jb3JlLyIsInNvdXJjZXMiOlsiY2FyZC12aWV3L3ZhbGlkYXRvcnMvY2FyZC12aWV3LWl0ZW0tZmxvYXQudmFsaWRhdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBbUJBLE1BQU0sT0FBTywwQkFBMEI7SUFBdkM7UUFFSSxZQUFPLEdBQUcsaURBQWlELENBQUM7SUFPaEUsQ0FBQzs7Ozs7SUFMRyxPQUFPLENBQUMsS0FBVTtRQUNkLE9BQU8sS0FBSyxLQUFLLEVBQUU7ZUFDWixDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7bUJBQ3pCLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUMzQixDQUFDO0NBQ0o7OztJQVBHLDZDQUE0RCIsInNvdXJjZXNDb250ZW50IjpbIi8qIVxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE5IEFsZnJlc2NvIFNvZnR3YXJlLCBMdGQuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbmltcG9ydCB7IENhcmRWaWV3SXRlbVZhbGlkYXRvciB9IGZyb20gJy4uL2ludGVyZmFjZXMvY2FyZC12aWV3LmludGVyZmFjZXMnO1xuXG5leHBvcnQgY2xhc3MgQ2FyZFZpZXdJdGVtRmxvYXRWYWxpZGF0b3IgaW1wbGVtZW50cyBDYXJkVmlld0l0ZW1WYWxpZGF0b3Ige1xuXG4gICAgbWVzc2FnZSA9ICdDT1JFLkNBUkRWSUVXLlZBTElEQVRPUlMuRkxPQVRfVkFMSURBVElPTl9FUlJPUic7XG5cbiAgICBpc1ZhbGlkKHZhbHVlOiBhbnkpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlID09PSAnJ1xuICAgICAgICAgICAgfHwgIWlzTmFOKHBhcnNlRmxvYXQodmFsdWUpKVxuICAgICAgICAgICAgJiYgaXNGaW5pdGUodmFsdWUpO1xuICAgIH1cbn1cbiJdfQ==
