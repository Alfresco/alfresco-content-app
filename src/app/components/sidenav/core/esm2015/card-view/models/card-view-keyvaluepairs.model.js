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
export class CardViewKeyValuePairsItemModel extends CardViewBaseItemModel {
  /**
   * @param {?} cardViewKeyValuePairsItemProperties
   */
  constructor(cardViewKeyValuePairsItemProperties) {
    super(cardViewKeyValuePairsItemProperties);
    this.type = 'keyvaluepairs';
  }
  /**
   * @return {?}
   */
  get displayValue() {
    return this.value;
  }
}
if (false) {
  /** @type {?} */
  CardViewKeyValuePairsItemModel.prototype.type;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FyZC12aWV3LWtleXZhbHVlcGFpcnMubW9kZWwuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AYWxmcmVzY28vYWRmLWNvcmUvIiwic291cmNlcyI6WyJjYXJkLXZpZXcvbW9kZWxzL2NhcmQtdmlldy1rZXl2YWx1ZXBhaXJzLm1vZGVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBbUJBLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBR25FLE1BQU0sT0FBTyw4QkFBK0IsU0FBUSxxQkFBcUI7Ozs7SUFHckUsWUFBWSxtQ0FBd0U7UUFDaEYsS0FBSyxDQUFDLG1DQUFtQyxDQUFDLENBQUM7UUFIL0MsU0FBSSxHQUFXLGVBQWUsQ0FBQztJQUkvQixDQUFDOzs7O0lBRUQsSUFBSSxZQUFZO1FBQ1osT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDO0lBQ3RCLENBQUM7Q0FDSjs7O0lBVEcsOENBQStCIiwic291cmNlc0NvbnRlbnQiOlsiLyohXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTkgQWxmcmVzY28gU29mdHdhcmUsIEx0ZC5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0IHsgQ2FyZFZpZXdJdGVtIH0gZnJvbSAnLi4vaW50ZXJmYWNlcy9jYXJkLXZpZXctaXRlbS5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgRHluYW1pY0NvbXBvbmVudE1vZGVsIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZHluYW1pYy1jb21wb25lbnQtbWFwcGVyLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ2FyZFZpZXdCYXNlSXRlbU1vZGVsIH0gZnJvbSAnLi9jYXJkLXZpZXctYmFzZWl0ZW0ubW9kZWwnO1xuaW1wb3J0IHsgQ2FyZFZpZXdLZXlWYWx1ZVBhaXJzSXRlbVByb3BlcnRpZXMgfSBmcm9tICcuLi9pbnRlcmZhY2VzL2NhcmQtdmlldy5pbnRlcmZhY2VzJztcblxuZXhwb3J0IGNsYXNzIENhcmRWaWV3S2V5VmFsdWVQYWlyc0l0ZW1Nb2RlbCBleHRlbmRzIENhcmRWaWV3QmFzZUl0ZW1Nb2RlbCBpbXBsZW1lbnRzIENhcmRWaWV3SXRlbSwgRHluYW1pY0NvbXBvbmVudE1vZGVsIHtcbiAgICB0eXBlOiBzdHJpbmcgPSAna2V5dmFsdWVwYWlycyc7XG5cbiAgICBjb25zdHJ1Y3RvcihjYXJkVmlld0tleVZhbHVlUGFpcnNJdGVtUHJvcGVydGllczogQ2FyZFZpZXdLZXlWYWx1ZVBhaXJzSXRlbVByb3BlcnRpZXMpIHtcbiAgICAgICAgc3VwZXIoY2FyZFZpZXdLZXlWYWx1ZVBhaXJzSXRlbVByb3BlcnRpZXMpO1xuICAgIH1cblxuICAgIGdldCBkaXNwbGF5VmFsdWUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnZhbHVlO1xuICAgIH1cbn1cbiJdfQ==
