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
import { ObjectUtils } from '../../utils';
// Simple implementation of the DataRow interface.
export class ObjectDataRow {
  /**
   * @param {?} obj
   * @param {?=} isSelected
   */
  constructor(obj, isSelected = false) {
    this.obj = obj;
    this.isSelected = isSelected;
    if (!obj) {
      throw new Error('Object source not found');
    }
  }
  /**
   * @param {?} key
   * @return {?}
   */
  getValue(key) {
    return ObjectUtils.getValue(this.obj, key);
  }
  /**
   * @param {?} key
   * @return {?}
   */
  hasValue(key) {
    return this.getValue(key) !== undefined;
  }
  /**
   * @return {?}
   */
  imageErrorResolver() {
    return '';
  }
}
if (false) {
  /**
   * @type {?}
   * @private
   */
  ObjectDataRow.prototype.obj;
  /** @type {?} */
  ObjectDataRow.prototype.isSelected;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2JqZWN0LWRhdGFyb3cubW9kZWwuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AYWxmcmVzY28vYWRmLWNvcmUvIiwic291cmNlcyI6WyJkYXRhdGFibGUvZGF0YS9vYmplY3QtZGF0YXJvdy5tb2RlbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWlCQSxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sYUFBYSxDQUFDOztBQUkxQyxNQUFNLE9BQU8sYUFBYTs7Ozs7SUFFdEIsWUFBb0IsR0FBUSxFQUFTLGFBQXNCLEtBQUs7UUFBNUMsUUFBRyxHQUFILEdBQUcsQ0FBSztRQUFTLGVBQVUsR0FBVixVQUFVLENBQWlCO1FBQzVELElBQUksQ0FBQyxHQUFHLEVBQUU7WUFDTixNQUFNLElBQUksS0FBSyxDQUFDLHlCQUF5QixDQUFDLENBQUM7U0FDOUM7SUFFTCxDQUFDOzs7OztJQUVELFFBQVEsQ0FBQyxHQUFXO1FBQ2hCLE9BQU8sV0FBVyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQy9DLENBQUM7Ozs7O0lBRUQsUUFBUSxDQUFDLEdBQVc7UUFDaEIsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxLQUFLLFNBQVMsQ0FBQztJQUM1QyxDQUFDOzs7O0lBRUQsa0JBQWtCO1FBQ2QsT0FBTyxFQUFFLENBQUM7SUFDZCxDQUFDO0NBQ0o7Ozs7OztJQWxCZSw0QkFBZ0I7O0lBQUUsbUNBQWtDIiwic291cmNlc0NvbnRlbnQiOlsiLyohXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTkgQWxmcmVzY28gU29mdHdhcmUsIEx0ZC5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0IHsgT2JqZWN0VXRpbHMgfSBmcm9tICcuLi8uLi91dGlscyc7XG5pbXBvcnQgeyBEYXRhUm93IH0gZnJvbSAnLi9kYXRhLXJvdy5tb2RlbCc7XG5cbi8vIFNpbXBsZSBpbXBsZW1lbnRhdGlvbiBvZiB0aGUgRGF0YVJvdyBpbnRlcmZhY2UuXG5leHBvcnQgY2xhc3MgT2JqZWN0RGF0YVJvdyBpbXBsZW1lbnRzIERhdGFSb3cge1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBvYmo6IGFueSwgcHVibGljIGlzU2VsZWN0ZWQ6IGJvb2xlYW4gPSBmYWxzZSkge1xuICAgICAgICBpZiAoIW9iaikge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdPYmplY3Qgc291cmNlIG5vdCBmb3VuZCcpO1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBnZXRWYWx1ZShrZXk6IHN0cmluZyk6IGFueSB7XG4gICAgICAgIHJldHVybiBPYmplY3RVdGlscy5nZXRWYWx1ZSh0aGlzLm9iaiwga2V5KTtcbiAgICB9XG5cbiAgICBoYXNWYWx1ZShrZXk6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRWYWx1ZShrZXkpICE9PSB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgaW1hZ2VFcnJvclJlc29sdmVyKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiAnJztcbiAgICB9XG59XG4iXX0=
