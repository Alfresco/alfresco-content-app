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
import { CardViewBaseItemModel } from './card-view-baseitem.model';
export class CardViewBoolItemModel extends CardViewBaseItemModel {
  /**
   * @param {?} cardViewBoolItemProperties
   */
  constructor(cardViewBoolItemProperties) {
    super(cardViewBoolItemProperties);
    this.type = 'bool';
    this.value = false;
    if (cardViewBoolItemProperties.value !== undefined) {
      this.value = !!JSON.parse(cardViewBoolItemProperties.value);
    }
  }
  /**
   * @return {?}
   */
  get displayValue() {
    if (this.isEmpty()) {
      return this.default;
    } else {
      return this.value;
    }
  }
}
if (false) {
  /** @type {?} */
  CardViewBoolItemModel.prototype.type;
  /** @type {?} */
  CardViewBoolItemModel.prototype.value;
  /** @type {?} */
  CardViewBoolItemModel.prototype.default;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FyZC12aWV3LWJvb2xpdGVtLm1vZGVsLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQGFsZnJlc2NvL2FkZi1jb3JlLyIsInNvdXJjZXMiOlsiY2FyZC12aWV3L21vZGVscy9jYXJkLXZpZXctYm9vbGl0ZW0ubW9kZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFtQkEsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFHbkUsTUFBTSxPQUFPLHFCQUFzQixTQUFRLHFCQUFxQjs7OztJQUs1RCxZQUFZLDBCQUFzRDtRQUM5RCxLQUFLLENBQUMsMEJBQTBCLENBQUMsQ0FBQztRQUx0QyxTQUFJLEdBQVcsTUFBTSxDQUFDO1FBQ3RCLFVBQUssR0FBWSxLQUFLLENBQUM7UUFNbkIsSUFBSSwwQkFBMEIsQ0FBQyxLQUFLLEtBQUssU0FBUyxFQUFFO1lBQ2hELElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsMEJBQTBCLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDL0Q7SUFDTCxDQUFDOzs7O0lBRUQsSUFBSSxZQUFZO1FBQ1osSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFLEVBQUU7WUFDaEIsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDO1NBQ3ZCO2FBQU07WUFDSCxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUM7U0FDckI7SUFDTCxDQUFDO0NBQ0o7OztJQW5CRyxxQ0FBc0I7O0lBQ3RCLHNDQUF1Qjs7SUFDdkIsd0NBQWlCIiwic291cmNlc0NvbnRlbnQiOlsiLyohXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTkgQWxmcmVzY28gU29mdHdhcmUsIEx0ZC5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0IHsgQ2FyZFZpZXdJdGVtIH0gZnJvbSAnLi4vaW50ZXJmYWNlcy9jYXJkLXZpZXctaXRlbS5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgRHluYW1pY0NvbXBvbmVudE1vZGVsIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZHluYW1pYy1jb21wb25lbnQtbWFwcGVyLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ2FyZFZpZXdCYXNlSXRlbU1vZGVsIH0gZnJvbSAnLi9jYXJkLXZpZXctYmFzZWl0ZW0ubW9kZWwnO1xuaW1wb3J0IHsgQ2FyZFZpZXdCb29sSXRlbVByb3BlcnRpZXMgfSBmcm9tICcuLi9pbnRlcmZhY2VzL2NhcmQtdmlldy5pbnRlcmZhY2VzJztcblxuZXhwb3J0IGNsYXNzIENhcmRWaWV3Qm9vbEl0ZW1Nb2RlbCBleHRlbmRzIENhcmRWaWV3QmFzZUl0ZW1Nb2RlbCBpbXBsZW1lbnRzIENhcmRWaWV3SXRlbSwgRHluYW1pY0NvbXBvbmVudE1vZGVsIHtcbiAgICB0eXBlOiBzdHJpbmcgPSAnYm9vbCc7XG4gICAgdmFsdWU6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBkZWZhdWx0OiBib29sZWFuO1xuXG4gICAgY29uc3RydWN0b3IoY2FyZFZpZXdCb29sSXRlbVByb3BlcnRpZXM6IENhcmRWaWV3Qm9vbEl0ZW1Qcm9wZXJ0aWVzKSB7XG4gICAgICAgIHN1cGVyKGNhcmRWaWV3Qm9vbEl0ZW1Qcm9wZXJ0aWVzKTtcblxuICAgICAgICBpZiAoY2FyZFZpZXdCb29sSXRlbVByb3BlcnRpZXMudmFsdWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy52YWx1ZSA9ICEhSlNPTi5wYXJzZShjYXJkVmlld0Jvb2xJdGVtUHJvcGVydGllcy52YWx1ZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXQgZGlzcGxheVZhbHVlKCkge1xuICAgICAgICBpZiAodGhpcy5pc0VtcHR5KCkpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmRlZmF1bHQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy52YWx1ZTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiJdfQ==
