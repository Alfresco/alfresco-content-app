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
export class CardViewMapItemModel extends CardViewBaseItemModel {
  constructor() {
    super(...arguments);
    this.type = 'map';
  }
  /**
   * @return {?}
   */
  get displayValue() {
    if (this.value && this.value.size > 0) {
      return this.value.values().next().value;
    } else {
      return this.default;
    }
  }
}
if (false) {
  /** @type {?} */
  CardViewMapItemModel.prototype.type;
  /** @type {?} */
  CardViewMapItemModel.prototype.value;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FyZC12aWV3LW1hcGl0ZW0ubW9kZWwuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AYWxmcmVzY28vYWRmLWNvcmUvIiwic291cmNlcyI6WyJjYXJkLXZpZXcvbW9kZWxzL2NhcmQtdmlldy1tYXBpdGVtLm1vZGVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBbUJBLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBRW5FLE1BQU0sT0FBTyxvQkFBcUIsU0FBUSxxQkFBcUI7SUFBL0Q7O1FBQ0ksU0FBSSxHQUFXLEtBQUssQ0FBQztJQVV6QixDQUFDOzs7O0lBUEcsSUFBSSxZQUFZO1FBQ1osSUFBSSxJQUFJLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxHQUFHLENBQUMsRUFBRTtZQUNuQyxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUMsS0FBSyxDQUFDO1NBQzNDO2FBQU07WUFDSCxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUM7U0FDdkI7SUFDTCxDQUFDO0NBQ0o7OztJQVZHLG9DQUFxQjs7SUFDckIscUNBQTJCIiwic291cmNlc0NvbnRlbnQiOlsiLyohXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTkgQWxmcmVzY28gU29mdHdhcmUsIEx0ZC5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0IHsgQ2FyZFZpZXdJdGVtIH0gZnJvbSAnLi4vaW50ZXJmYWNlcy9jYXJkLXZpZXctaXRlbS5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgRHluYW1pY0NvbXBvbmVudE1vZGVsIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZHluYW1pYy1jb21wb25lbnQtbWFwcGVyLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ2FyZFZpZXdCYXNlSXRlbU1vZGVsIH0gZnJvbSAnLi9jYXJkLXZpZXctYmFzZWl0ZW0ubW9kZWwnO1xuXG5leHBvcnQgY2xhc3MgQ2FyZFZpZXdNYXBJdGVtTW9kZWwgZXh0ZW5kcyBDYXJkVmlld0Jhc2VJdGVtTW9kZWwgaW1wbGVtZW50cyBDYXJkVmlld0l0ZW0sIER5bmFtaWNDb21wb25lbnRNb2RlbCB7XG4gICAgdHlwZTogc3RyaW5nID0gJ21hcCc7XG4gICAgdmFsdWU6IE1hcDxzdHJpbmcsIHN0cmluZz47XG5cbiAgICBnZXQgZGlzcGxheVZhbHVlKCkge1xuICAgICAgICBpZiAodGhpcy52YWx1ZSAmJiB0aGlzLnZhbHVlLnNpemUgPiAwKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy52YWx1ZS52YWx1ZXMoKS5uZXh0KCkudmFsdWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5kZWZhdWx0O1xuICAgICAgICB9XG4gICAgfVxufVxuIl19
