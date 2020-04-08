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
export class CardViewTextItemModel extends CardViewBaseItemModel {
  /**
   * @param {?} cardViewTextItemProperties
   */
  constructor(cardViewTextItemProperties) {
    super(cardViewTextItemProperties);
    this.type = 'text';
    this.multiline = !!cardViewTextItemProperties.multiline;
    this.multivalued = !!cardViewTextItemProperties.multivalued;
    this.pipes = cardViewTextItemProperties.pipes || [];
    this.clickCallBack = cardViewTextItemProperties.clickCallBack
      ? cardViewTextItemProperties.clickCallBack
      : null;
    if (this.default && this.isEmpty()) {
      this.value = this.default;
    }
  }
  /**
   * @return {?}
   */
  get displayValue() {
    return this.applyPipes(this.value);
  }
  /**
   * @private
   * @param {?} displayValue
   * @return {?}
   */
  applyPipes(displayValue) {
    if (this.pipes.length) {
      displayValue = this.pipes.reduce(
        /**
         * @param {?} accumulator
         * @param {?} __1
         * @return {?}
         */
        (accumulator, { pipe, params = [] }) => {
          return pipe.transform(accumulator, ...params);
        },
        displayValue
      );
    }
    return displayValue;
  }
}
if (false) {
  /** @type {?} */
  CardViewTextItemModel.prototype.type;
  /** @type {?} */
  CardViewTextItemModel.prototype.multiline;
  /** @type {?} */
  CardViewTextItemModel.prototype.multivalued;
  /** @type {?} */
  CardViewTextItemModel.prototype.pipes;
  /** @type {?} */
  CardViewTextItemModel.prototype.clickCallBack;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FyZC12aWV3LXRleHRpdGVtLm1vZGVsLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQGFsZnJlc2NvL2FkZi1jb3JlLyIsInNvdXJjZXMiOlsiY2FyZC12aWV3L21vZGVscy9jYXJkLXZpZXctdGV4dGl0ZW0ubW9kZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFtQkEsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFHbkUsTUFBTSxPQUFPLHFCQUFzQixTQUFRLHFCQUFxQjs7OztJQU81RCxZQUFZLDBCQUFzRDtRQUM5RCxLQUFLLENBQUMsMEJBQTBCLENBQUMsQ0FBQztRQVB0QyxTQUFJLEdBQVcsTUFBTSxDQUFDO1FBUWxCLElBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDLDBCQUEwQixDQUFDLFNBQVMsQ0FBQztRQUN4RCxJQUFJLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQywwQkFBMEIsQ0FBQyxXQUFXLENBQUM7UUFDNUQsSUFBSSxDQUFDLEtBQUssR0FBRywwQkFBMEIsQ0FBQyxLQUFLLElBQUksRUFBRSxDQUFDO1FBQ3BELElBQUksQ0FBQyxhQUFhLEdBQUcsMEJBQTBCLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQywwQkFBMEIsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztRQUVoSCxJQUFJLElBQUksQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRSxFQUFFO1lBQ2hDLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztTQUM3QjtJQUNMLENBQUM7Ozs7SUFFRCxJQUFJLFlBQVk7UUFDWixPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3ZDLENBQUM7Ozs7OztJQUVPLFVBQVUsQ0FBQyxZQUFZO1FBQzNCLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUU7WUFDbkIsWUFBWSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTTs7Ozs7WUFBQyxDQUFDLFdBQVcsRUFBRSxFQUFFLElBQUksRUFBRSxNQUFNLEdBQUcsRUFBRSxFQUFFLEVBQUUsRUFBRTtnQkFDcEUsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsRUFBRSxHQUFHLE1BQU0sQ0FBQyxDQUFDO1lBQ2xELENBQUMsR0FBRSxZQUFZLENBQUMsQ0FBQztTQUNwQjtRQUVELE9BQU8sWUFBWSxDQUFDO0lBQ3hCLENBQUM7Q0FDSjs7O0lBL0JHLHFDQUFzQjs7SUFDdEIsMENBQW9COztJQUNwQiw0Q0FBc0I7O0lBQ3RCLHNDQUF1Qzs7SUFDdkMsOENBQW9CIiwic291cmNlc0NvbnRlbnQiOlsiLyohXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTkgQWxmcmVzY28gU29mdHdhcmUsIEx0ZC5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0IHsgQ2FyZFZpZXdJdGVtIH0gZnJvbSAnLi4vaW50ZXJmYWNlcy9jYXJkLXZpZXctaXRlbS5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgRHluYW1pY0NvbXBvbmVudE1vZGVsIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZHluYW1pYy1jb21wb25lbnQtbWFwcGVyLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ2FyZFZpZXdCYXNlSXRlbU1vZGVsIH0gZnJvbSAnLi9jYXJkLXZpZXctYmFzZWl0ZW0ubW9kZWwnO1xuaW1wb3J0IHsgQ2FyZFZpZXdUZXh0SXRlbVBpcGVQcm9wZXJ0eSwgQ2FyZFZpZXdUZXh0SXRlbVByb3BlcnRpZXMgfSBmcm9tICcuLi9pbnRlcmZhY2VzL2NhcmQtdmlldy5pbnRlcmZhY2VzJztcblxuZXhwb3J0IGNsYXNzIENhcmRWaWV3VGV4dEl0ZW1Nb2RlbCBleHRlbmRzIENhcmRWaWV3QmFzZUl0ZW1Nb2RlbCBpbXBsZW1lbnRzIENhcmRWaWV3SXRlbSwgRHluYW1pY0NvbXBvbmVudE1vZGVsIHtcbiAgICB0eXBlOiBzdHJpbmcgPSAndGV4dCc7XG4gICAgbXVsdGlsaW5lPzogYm9vbGVhbjtcbiAgICBtdWx0aXZhbHVlZD86IGJvb2xlYW47XG4gICAgcGlwZXM/OiBDYXJkVmlld1RleHRJdGVtUGlwZVByb3BlcnR5W107XG4gICAgY2xpY2tDYWxsQmFjaz86IGFueTtcblxuICAgIGNvbnN0cnVjdG9yKGNhcmRWaWV3VGV4dEl0ZW1Qcm9wZXJ0aWVzOiBDYXJkVmlld1RleHRJdGVtUHJvcGVydGllcykge1xuICAgICAgICBzdXBlcihjYXJkVmlld1RleHRJdGVtUHJvcGVydGllcyk7XG4gICAgICAgIHRoaXMubXVsdGlsaW5lID0gISFjYXJkVmlld1RleHRJdGVtUHJvcGVydGllcy5tdWx0aWxpbmU7XG4gICAgICAgIHRoaXMubXVsdGl2YWx1ZWQgPSAhIWNhcmRWaWV3VGV4dEl0ZW1Qcm9wZXJ0aWVzLm11bHRpdmFsdWVkO1xuICAgICAgICB0aGlzLnBpcGVzID0gY2FyZFZpZXdUZXh0SXRlbVByb3BlcnRpZXMucGlwZXMgfHwgW107XG4gICAgICAgIHRoaXMuY2xpY2tDYWxsQmFjayA9IGNhcmRWaWV3VGV4dEl0ZW1Qcm9wZXJ0aWVzLmNsaWNrQ2FsbEJhY2sgPyBjYXJkVmlld1RleHRJdGVtUHJvcGVydGllcy5jbGlja0NhbGxCYWNrIDogbnVsbDtcblxuICAgICAgICBpZiAodGhpcy5kZWZhdWx0ICYmIHRoaXMuaXNFbXB0eSgpKSB7XG4gICAgICAgICAgICB0aGlzLnZhbHVlID0gdGhpcy5kZWZhdWx0O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0IGRpc3BsYXlWYWx1ZSgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5hcHBseVBpcGVzKHRoaXMudmFsdWUpO1xuICAgIH1cblxuICAgIHByaXZhdGUgYXBwbHlQaXBlcyhkaXNwbGF5VmFsdWUpIHtcbiAgICAgICAgaWYgKHRoaXMucGlwZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICBkaXNwbGF5VmFsdWUgPSB0aGlzLnBpcGVzLnJlZHVjZSgoYWNjdW11bGF0b3IsIHsgcGlwZSwgcGFyYW1zID0gW10gfSkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBwaXBlLnRyYW5zZm9ybShhY2N1bXVsYXRvciwgLi4ucGFyYW1zKTtcbiAgICAgICAgICAgIH0sIGRpc3BsYXlWYWx1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZGlzcGxheVZhbHVlO1xuICAgIH1cbn1cbiJdfQ==
