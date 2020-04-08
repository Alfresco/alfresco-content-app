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
// Simple implementation of the DataColumn interface.
export class ObjectDataColumn {
  /**
   * @param {?} input
   */
  constructor(input) {
    this.key = input.key;
    this.type = input.type || 'text';
    this.format = input.format;
    this.sortable = input.sortable;
    this.title = input.title;
    this.srTitle = input.srTitle;
    this.cssClass = input.cssClass;
    this.template = input.template;
    this.copyContent = input.copyContent;
    this.focus = input.focus;
  }
}
if (false) {
  /** @type {?} */
  ObjectDataColumn.prototype.key;
  /** @type {?} */
  ObjectDataColumn.prototype.type;
  /** @type {?} */
  ObjectDataColumn.prototype.format;
  /** @type {?} */
  ObjectDataColumn.prototype.sortable;
  /** @type {?} */
  ObjectDataColumn.prototype.title;
  /** @type {?} */
  ObjectDataColumn.prototype.srTitle;
  /** @type {?} */
  ObjectDataColumn.prototype.cssClass;
  /** @type {?} */
  ObjectDataColumn.prototype.template;
  /** @type {?} */
  ObjectDataColumn.prototype.copyContent;
  /** @type {?} */
  ObjectDataColumn.prototype.focus;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2JqZWN0LWRhdGFjb2x1bW4ubW9kZWwuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AYWxmcmVzY28vYWRmLWNvcmUvIiwic291cmNlcyI6WyJkYXRhdGFibGUvZGF0YS9vYmplY3QtZGF0YWNvbHVtbi5tb2RlbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFxQkEsTUFBTSxPQUFPLGdCQUFnQjs7OztJQWF6QixZQUFZLEtBQVU7UUFDbEIsSUFBSSxDQUFDLEdBQUcsR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDO1FBQ3JCLElBQUksQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDLElBQUksSUFBSSxNQUFNLENBQUM7UUFDakMsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDO1FBQzNCLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDLFFBQVEsQ0FBQztRQUMvQixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUM7UUFDekIsSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDO1FBQzdCLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDLFFBQVEsQ0FBQztRQUMvQixJQUFJLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUM7UUFDL0IsSUFBSSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUMsV0FBVyxDQUFDO1FBQ3JDLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQztJQUM3QixDQUFDO0NBQ0o7OztJQXZCRywrQkFBWTs7SUFDWixnQ0FBcUI7O0lBQ3JCLGtDQUFlOztJQUNmLG9DQUFrQjs7SUFDbEIsaUNBQWM7O0lBQ2QsbUNBQWdCOztJQUNoQixvQ0FBaUI7O0lBQ2pCLG9DQUE0Qjs7SUFDNUIsdUNBQXNCOztJQUN0QixpQ0FBZ0IiLCJzb3VyY2VzQ29udGVudCI6WyIvKiFcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxOSBBbGZyZXNjbyBTb2Z0d2FyZSwgTHRkLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgeyBUZW1wbGF0ZVJlZiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRGF0YUNvbHVtbiwgRGF0YUNvbHVtblR5cGUgfSBmcm9tICcuL2RhdGEtY29sdW1uLm1vZGVsJztcblxuLy8gU2ltcGxlIGltcGxlbWVudGF0aW9uIG9mIHRoZSBEYXRhQ29sdW1uIGludGVyZmFjZS5cbmV4cG9ydCBjbGFzcyBPYmplY3REYXRhQ29sdW1uIGltcGxlbWVudHMgRGF0YUNvbHVtbiB7XG5cbiAgICBrZXk6IHN0cmluZztcbiAgICB0eXBlOiBEYXRhQ29sdW1uVHlwZTtcbiAgICBmb3JtYXQ6IHN0cmluZztcbiAgICBzb3J0YWJsZTogYm9vbGVhbjtcbiAgICB0aXRsZTogc3RyaW5nO1xuICAgIHNyVGl0bGU6IHN0cmluZztcbiAgICBjc3NDbGFzczogc3RyaW5nO1xuICAgIHRlbXBsYXRlPzogVGVtcGxhdGVSZWY8YW55PjtcbiAgICBjb3B5Q29udGVudD86IGJvb2xlYW47XG4gICAgZm9jdXM/OiBib29sZWFuO1xuXG4gICAgY29uc3RydWN0b3IoaW5wdXQ6IGFueSkge1xuICAgICAgICB0aGlzLmtleSA9IGlucHV0LmtleTtcbiAgICAgICAgdGhpcy50eXBlID0gaW5wdXQudHlwZSB8fCAndGV4dCc7XG4gICAgICAgIHRoaXMuZm9ybWF0ID0gaW5wdXQuZm9ybWF0O1xuICAgICAgICB0aGlzLnNvcnRhYmxlID0gaW5wdXQuc29ydGFibGU7XG4gICAgICAgIHRoaXMudGl0bGUgPSBpbnB1dC50aXRsZTtcbiAgICAgICAgdGhpcy5zclRpdGxlID0gaW5wdXQuc3JUaXRsZTtcbiAgICAgICAgdGhpcy5jc3NDbGFzcyA9IGlucHV0LmNzc0NsYXNzO1xuICAgICAgICB0aGlzLnRlbXBsYXRlID0gaW5wdXQudGVtcGxhdGU7XG4gICAgICAgIHRoaXMuY29weUNvbnRlbnQgPSBpbnB1dC5jb3B5Q29udGVudDtcbiAgICAgICAgdGhpcy5mb2N1cyA9IGlucHV0LmZvY3VzO1xuICAgIH1cbn1cbiJdfQ==
