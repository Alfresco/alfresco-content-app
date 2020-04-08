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
export class DecimalNumberModel {
  /**
   * @param {?=} obj
   */
  constructor(obj) {
    if (obj) {
      this.minIntegerDigits = obj.minIntegerDigits;
      this.minFractionDigits = obj.minFractionDigits;
      this.maxFractionDigits = obj.maxFractionDigits;
    }
  }
}
if (false) {
  /** @type {?} */
  DecimalNumberModel.prototype.minIntegerDigits;
  /** @type {?} */
  DecimalNumberModel.prototype.minFractionDigits;
  /** @type {?} */
  DecimalNumberModel.prototype.maxFractionDigits;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVjaW1hbC1udW1iZXIubW9kZWwuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AYWxmcmVzY28vYWRmLWNvcmUvIiwic291cmNlcyI6WyJtb2RlbHMvZGVjaW1hbC1udW1iZXIubW9kZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFpQkEsTUFBTSxPQUFPLGtCQUFrQjs7OztJQUszQixZQUFZLEdBQVM7UUFDakIsSUFBSSxHQUFHLEVBQUU7WUFDTCxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsR0FBRyxDQUFDLGdCQUFnQixDQUFDO1lBQzdDLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxHQUFHLENBQUMsaUJBQWlCLENBQUM7WUFDL0MsSUFBSSxDQUFDLGlCQUFpQixHQUFHLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQztTQUNsRDtJQUNMLENBQUM7Q0FDSjs7O0lBWEcsOENBQXlCOztJQUN6QiwrQ0FBMEI7O0lBQzFCLCtDQUEwQiIsInNvdXJjZXNDb250ZW50IjpbIi8qIVxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE5IEFsZnJlc2NvIFNvZnR3YXJlLCBMdGQuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbmV4cG9ydCBjbGFzcyBEZWNpbWFsTnVtYmVyTW9kZWwge1xuICAgIG1pbkludGVnZXJEaWdpdHM6IG51bWJlcjtcbiAgICBtaW5GcmFjdGlvbkRpZ2l0czogbnVtYmVyO1xuICAgIG1heEZyYWN0aW9uRGlnaXRzOiBudW1iZXI7XG5cbiAgICBjb25zdHJ1Y3RvcihvYmo/OiBhbnkpIHtcbiAgICAgICAgaWYgKG9iaikge1xuICAgICAgICAgICAgdGhpcy5taW5JbnRlZ2VyRGlnaXRzID0gb2JqLm1pbkludGVnZXJEaWdpdHM7XG4gICAgICAgICAgICB0aGlzLm1pbkZyYWN0aW9uRGlnaXRzID0gb2JqLm1pbkZyYWN0aW9uRGlnaXRzO1xuICAgICAgICAgICAgdGhpcy5tYXhGcmFjdGlvbkRpZ2l0cyA9IG9iai5tYXhGcmFjdGlvbkRpZ2l0cztcbiAgICAgICAgfVxuICAgIH1cbn1cbiJdfQ==
