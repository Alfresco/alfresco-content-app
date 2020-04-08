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
import { FormWidgetModel } from './form-widget.model';
export class ContainerModel extends FormWidgetModel {
  /**
   * @return {?}
   */
  get isVisible() {
    return this.field.isVisible;
  }
  /**
   * @param {?} field
   */
  constructor(field) {
    super(field.form, field.json);
    if (field) {
      this.field = field;
    }
  }
}
if (false) {
  /** @type {?} */
  ContainerModel.prototype.field;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGFpbmVyLm1vZGVsLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQGFsZnJlc2NvL2FkZi1jb3JlLyIsInNvdXJjZXMiOlsiZm9ybS9jb21wb25lbnRzL3dpZGdldHMvY29yZS9jb250YWluZXIubW9kZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBb0JBLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUV0RCxNQUFNLE9BQU8sY0FBZSxTQUFRLGVBQWU7Ozs7SUFJL0MsSUFBSSxTQUFTO1FBQ1QsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQztJQUNoQyxDQUFDOzs7O0lBRUQsWUFBWSxLQUFxQjtRQUM3QixLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFOUIsSUFBSSxLQUFLLEVBQUU7WUFDUCxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztTQUN0QjtJQUNMLENBQUM7Q0FFSjs7O0lBZEcsK0JBQXNCIiwic291cmNlc0NvbnRlbnQiOlsiLyohXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTkgQWxmcmVzY28gU29mdHdhcmUsIEx0ZC5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuIC8qIHRzbGludDpkaXNhYmxlOmNvbXBvbmVudC1zZWxlY3RvciAgKi9cblxuaW1wb3J0IHsgRm9ybUZpZWxkTW9kZWwgfSBmcm9tICcuL2Zvcm0tZmllbGQubW9kZWwnO1xuaW1wb3J0IHsgRm9ybVdpZGdldE1vZGVsIH0gZnJvbSAnLi9mb3JtLXdpZGdldC5tb2RlbCc7XG5cbmV4cG9ydCBjbGFzcyBDb250YWluZXJNb2RlbCBleHRlbmRzIEZvcm1XaWRnZXRNb2RlbCB7XG5cbiAgICBmaWVsZDogRm9ybUZpZWxkTW9kZWw7XG5cbiAgICBnZXQgaXNWaXNpYmxlKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5maWVsZC5pc1Zpc2libGU7XG4gICAgfVxuXG4gICAgY29uc3RydWN0b3IoZmllbGQ6IEZvcm1GaWVsZE1vZGVsKSB7XG4gICAgICAgIHN1cGVyKGZpZWxkLmZvcm0sIGZpZWxkLmpzb24pO1xuXG4gICAgICAgIGlmIChmaWVsZCkge1xuICAgICAgICAgICAgdGhpcy5maWVsZCA9IGZpZWxkO1xuICAgICAgICB9XG4gICAgfVxuXG59XG4iXX0=
