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
/* tslint:disable:component-selector  */
/**
 * @abstract
 */
export class FormWidgetModel {
  /**
   * @protected
   * @param {?} form
   * @param {?} json
   */
  constructor(form, json) {
    this.form = form;
    this.json = json;
    if (json) {
      this.fieldType = json.fieldType;
      this.id = json.id;
      this.name = json.name;
      this.type = json.type;
      this.tab = json.tab;
    }
  }
}
if (false) {
  /** @type {?} */
  FormWidgetModel.prototype.fieldType;
  /** @type {?} */
  FormWidgetModel.prototype.id;
  /** @type {?} */
  FormWidgetModel.prototype.name;
  /** @type {?} */
  FormWidgetModel.prototype.type;
  /** @type {?} */
  FormWidgetModel.prototype.tab;
  /** @type {?} */
  FormWidgetModel.prototype.form;
  /** @type {?} */
  FormWidgetModel.prototype.json;
}
/**
 * @record
 * @template T
 */
export function FormWidgetModelCache() {}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybS13aWRnZXQubW9kZWwuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AYWxmcmVzY28vYWRmLWNvcmUvIiwic291cmNlcyI6WyJmb3JtL2NvbXBvbmVudHMvd2lkZ2V0cy9jb3JlL2Zvcm0td2lkZ2V0Lm1vZGVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXFCQSxNQUFNLE9BQWdCLGVBQWU7Ozs7OztJQVdqQyxZQUFzQixJQUFlLEVBQUUsSUFBUztRQUM1QyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztRQUNqQixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztRQUVqQixJQUFJLElBQUksRUFBRTtZQUNOLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQztZQUNoQyxJQUFJLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUM7WUFDbEIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO1lBQ3RCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztZQUN0QixJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUM7U0FDdkI7SUFDTCxDQUFDO0NBQ0o7OztJQXJCRyxvQ0FBMkI7O0lBQzNCLDZCQUFvQjs7SUFDcEIsK0JBQXNCOztJQUN0QiwrQkFBc0I7O0lBQ3RCLDhCQUFxQjs7SUFFckIsK0JBQW1COztJQUNuQiwrQkFBbUI7Ozs7OztBQWdCdkIsMENBRUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiFcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxOSBBbGZyZXNjbyBTb2Z0d2FyZSwgTHRkLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG4gLyogdHNsaW50OmRpc2FibGU6Y29tcG9uZW50LXNlbGVjdG9yICAqL1xuXG5pbXBvcnQgeyBGb3JtTW9kZWwgfSBmcm9tICcuL2Zvcm0ubW9kZWwnO1xuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgRm9ybVdpZGdldE1vZGVsIHtcblxuICAgIHJlYWRvbmx5IGZpZWxkVHlwZTogc3RyaW5nO1xuICAgIHJlYWRvbmx5IGlkOiBzdHJpbmc7XG4gICAgcmVhZG9ubHkgbmFtZTogc3RyaW5nO1xuICAgIHJlYWRvbmx5IHR5cGU6IHN0cmluZztcbiAgICByZWFkb25seSB0YWI6IHN0cmluZztcblxuICAgIHJlYWRvbmx5IGZvcm06IGFueTtcbiAgICByZWFkb25seSBqc29uOiBhbnk7XG5cbiAgICBwcm90ZWN0ZWQgY29uc3RydWN0b3IoZm9ybTogRm9ybU1vZGVsLCBqc29uOiBhbnkpIHtcbiAgICAgICAgdGhpcy5mb3JtID0gZm9ybTtcbiAgICAgICAgdGhpcy5qc29uID0ganNvbjtcblxuICAgICAgICBpZiAoanNvbikge1xuICAgICAgICAgICAgdGhpcy5maWVsZFR5cGUgPSBqc29uLmZpZWxkVHlwZTtcbiAgICAgICAgICAgIHRoaXMuaWQgPSBqc29uLmlkO1xuICAgICAgICAgICAgdGhpcy5uYW1lID0ganNvbi5uYW1lO1xuICAgICAgICAgICAgdGhpcy50eXBlID0ganNvbi50eXBlO1xuICAgICAgICAgICAgdGhpcy50YWIgPSBqc29uLnRhYjtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGludGVyZmFjZSBGb3JtV2lkZ2V0TW9kZWxDYWNoZTxUIGV4dGVuZHMgRm9ybVdpZGdldE1vZGVsPiB7XG4gICAgW2tleTogc3RyaW5nXTogVDtcbn1cbiJdfQ==
