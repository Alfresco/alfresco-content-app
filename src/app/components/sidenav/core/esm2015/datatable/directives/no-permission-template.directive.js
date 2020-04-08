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
import { ContentChild, Directive, TemplateRef } from '@angular/core';
import { DataTableComponent } from '../components/datatable/datatable.component';
/**
 * Directive selectors without adf- prefix will be deprecated on 3.0.0
 */
export class NoPermissionTemplateDirective {
  /**
   * @param {?} dataTable
   */
  constructor(dataTable) {
    this.dataTable = dataTable;
  }
  /**
   * @return {?}
   */
  ngAfterContentInit() {
    if (this.dataTable) {
      this.dataTable.noPermissionTemplate = this.template;
    }
  }
}
NoPermissionTemplateDirective.decorators = [
  {
    type: Directive,
    args: [
      {
        selector: 'adf-no-permission-template, no-permission-template'
      }
    ]
  }
];
/** @nocollapse */
NoPermissionTemplateDirective.ctorParameters = () => [
  { type: DataTableComponent }
];
NoPermissionTemplateDirective.propDecorators = {
  template: [{ type: ContentChild, args: [TemplateRef] }]
};
if (false) {
  /** @type {?} */
  NoPermissionTemplateDirective.prototype.template;
  /**
   * @type {?}
   * @private
   */
  NoPermissionTemplateDirective.prototype.dataTable;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm8tcGVybWlzc2lvbi10ZW1wbGF0ZS5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AYWxmcmVzY28vYWRmLWNvcmUvIiwic291cmNlcyI6WyJkYXRhdGFibGUvZGlyZWN0aXZlcy9uby1wZXJtaXNzaW9uLXRlbXBsYXRlLmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWlCQSxPQUFPLEVBQW9CLFlBQVksRUFBRSxTQUFTLEVBQUUsV0FBVyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3ZGLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLDZDQUE2QyxDQUFDOzs7O0FBUWpGLE1BQU0sT0FBTyw2QkFBNkI7Ozs7SUFLdEMsWUFBb0IsU0FBNkI7UUFBN0IsY0FBUyxHQUFULFNBQVMsQ0FBb0I7SUFDakQsQ0FBQzs7OztJQUVELGtCQUFrQjtRQUNkLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUNoQixJQUFJLENBQUMsU0FBUyxDQUFDLG9CQUFvQixHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7U0FDdkQ7SUFDTCxDQUFDOzs7WUFmSixTQUFTLFNBQUM7Z0JBQ1AsUUFBUSxFQUFFLG9EQUFvRDthQUNqRTs7OztZQVBRLGtCQUFrQjs7O3VCQVV0QixZQUFZLFNBQUMsV0FBVzs7OztJQUF6QixpREFDYzs7Ozs7SUFFRixrREFBcUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiFcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxOSBBbGZyZXNjbyBTb2Z0d2FyZSwgTHRkLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgeyBBZnRlckNvbnRlbnRJbml0LCBDb250ZW50Q2hpbGQsIERpcmVjdGl2ZSwgVGVtcGxhdGVSZWYgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IERhdGFUYWJsZUNvbXBvbmVudCB9IGZyb20gJy4uL2NvbXBvbmVudHMvZGF0YXRhYmxlL2RhdGF0YWJsZS5jb21wb25lbnQnO1xuXG4vKipcbiAqIERpcmVjdGl2ZSBzZWxlY3RvcnMgd2l0aG91dCBhZGYtIHByZWZpeCB3aWxsIGJlIGRlcHJlY2F0ZWQgb24gMy4wLjBcbiAqL1xuQERpcmVjdGl2ZSh7XG4gICAgc2VsZWN0b3I6ICdhZGYtbm8tcGVybWlzc2lvbi10ZW1wbGF0ZSwgbm8tcGVybWlzc2lvbi10ZW1wbGF0ZSdcbn0pXG5leHBvcnQgY2xhc3MgTm9QZXJtaXNzaW9uVGVtcGxhdGVEaXJlY3RpdmUgaW1wbGVtZW50cyBBZnRlckNvbnRlbnRJbml0IHtcblxuICAgIEBDb250ZW50Q2hpbGQoVGVtcGxhdGVSZWYpXG4gICAgdGVtcGxhdGU6IGFueTtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgZGF0YVRhYmxlOiBEYXRhVGFibGVDb21wb25lbnQpIHtcbiAgICB9XG5cbiAgICBuZ0FmdGVyQ29udGVudEluaXQoKSB7XG4gICAgICAgIGlmICh0aGlzLmRhdGFUYWJsZSkge1xuICAgICAgICAgICAgdGhpcy5kYXRhVGFibGUubm9QZXJtaXNzaW9uVGVtcGxhdGUgPSB0aGlzLnRlbXBsYXRlO1xuICAgICAgICB9XG4gICAgfVxufVxuIl19
