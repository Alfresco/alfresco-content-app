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
export class LoadingContentTemplateDirective {
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
      this.dataTable.loadingTemplate = this.template;
    }
  }
}
LoadingContentTemplateDirective.decorators = [
  {
    type: Directive,
    args: [
      {
        selector: 'adf-loading-content-template, loading-content-template'
      }
    ]
  }
];
/** @nocollapse */
LoadingContentTemplateDirective.ctorParameters = () => [
  { type: DataTableComponent }
];
LoadingContentTemplateDirective.propDecorators = {
  template: [{ type: ContentChild, args: [TemplateRef] }]
};
if (false) {
  /** @type {?} */
  LoadingContentTemplateDirective.prototype.template;
  /**
   * @type {?}
   * @private
   */
  LoadingContentTemplateDirective.prototype.dataTable;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9hZGluZy10ZW1wbGF0ZS5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AYWxmcmVzY28vYWRmLWNvcmUvIiwic291cmNlcyI6WyJkYXRhdGFibGUvZGlyZWN0aXZlcy9sb2FkaW5nLXRlbXBsYXRlLmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWlCQSxPQUFPLEVBQW9CLFlBQVksRUFBRSxTQUFTLEVBQUUsV0FBVyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3ZGLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLDZDQUE2QyxDQUFDOzs7O0FBUWpGLE1BQU0sT0FBTywrQkFBK0I7Ozs7SUFLeEMsWUFBb0IsU0FBNkI7UUFBN0IsY0FBUyxHQUFULFNBQVMsQ0FBb0I7SUFDakQsQ0FBQzs7OztJQUVELGtCQUFrQjtRQUNkLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUNoQixJQUFJLENBQUMsU0FBUyxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO1NBQ2xEO0lBQ0wsQ0FBQzs7O1lBZkosU0FBUyxTQUFDO2dCQUNQLFFBQVEsRUFBRSx3REFBd0Q7YUFDckU7Ozs7WUFQUSxrQkFBa0I7Ozt1QkFVdEIsWUFBWSxTQUFDLFdBQVc7Ozs7SUFBekIsbURBQ2M7Ozs7O0lBRUYsb0RBQXFDIiwic291cmNlc0NvbnRlbnQiOlsiLyohXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTkgQWxmcmVzY28gU29mdHdhcmUsIEx0ZC5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0IHsgQWZ0ZXJDb250ZW50SW5pdCwgQ29udGVudENoaWxkLCBEaXJlY3RpdmUsIFRlbXBsYXRlUmVmIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBEYXRhVGFibGVDb21wb25lbnQgfSBmcm9tICcuLi9jb21wb25lbnRzL2RhdGF0YWJsZS9kYXRhdGFibGUuY29tcG9uZW50JztcblxuLyoqXG4gKiBEaXJlY3RpdmUgc2VsZWN0b3JzIHdpdGhvdXQgYWRmLSBwcmVmaXggd2lsbCBiZSBkZXByZWNhdGVkIG9uIDMuMC4wXG4gKi9cbkBEaXJlY3RpdmUoe1xuICAgIHNlbGVjdG9yOiAnYWRmLWxvYWRpbmctY29udGVudC10ZW1wbGF0ZSwgbG9hZGluZy1jb250ZW50LXRlbXBsYXRlJ1xufSlcbmV4cG9ydCBjbGFzcyBMb2FkaW5nQ29udGVudFRlbXBsYXRlRGlyZWN0aXZlIGltcGxlbWVudHMgQWZ0ZXJDb250ZW50SW5pdCB7XG5cbiAgICBAQ29udGVudENoaWxkKFRlbXBsYXRlUmVmKVxuICAgIHRlbXBsYXRlOiBhbnk7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGRhdGFUYWJsZTogRGF0YVRhYmxlQ29tcG9uZW50KSB7XG4gICAgfVxuXG4gICAgbmdBZnRlckNvbnRlbnRJbml0KCkge1xuICAgICAgICBpZiAodGhpcy5kYXRhVGFibGUpIHtcbiAgICAgICAgICAgIHRoaXMuZGF0YVRhYmxlLmxvYWRpbmdUZW1wbGF0ZSA9IHRoaXMudGVtcGxhdGU7XG4gICAgICAgIH1cbiAgICB9XG5cbn1cbiJdfQ==
