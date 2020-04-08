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
/**
 * @record
 */
export function CardViewArrayItem() {}
if (false) {
  /** @type {?} */
  CardViewArrayItem.prototype.icon;
  /** @type {?} */
  CardViewArrayItem.prototype.value;
}
export class CardViewArrayItemModel extends CardViewBaseItemModel {
  /**
   * @param {?} cardViewArrayItemProperties
   */
  constructor(cardViewArrayItemProperties) {
    super(cardViewArrayItemProperties);
    this.type = 'array';
    this.noOfItemsToDisplay = cardViewArrayItemProperties.noOfItemsToDisplay;
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
  CardViewArrayItemModel.prototype.type;
  /** @type {?} */
  CardViewArrayItemModel.prototype.value;
  /** @type {?} */
  CardViewArrayItemModel.prototype.noOfItemsToDisplay;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FyZC12aWV3LWFycmF5aXRlbS5tb2RlbC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BhbGZyZXNjby9hZGYtY29yZS8iLCJzb3VyY2VzIjpbImNhcmQtdmlldy9tb2RlbHMvY2FyZC12aWV3LWFycmF5aXRlbS5tb2RlbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW1CQSxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQzs7OztBQUluRSx1Q0FHQzs7O0lBRkcsaUNBQWE7O0lBQ2Isa0NBQWM7O0FBR2xCLE1BQU0sT0FBTyxzQkFBdUIsU0FBUSxxQkFBcUI7Ozs7SUFNN0QsWUFBWSwyQkFBd0Q7UUFDaEUsS0FBSyxDQUFDLDJCQUEyQixDQUFDLENBQUM7UUFMdkMsU0FBSSxHQUFXLE9BQU8sQ0FBQztRQU1uQixJQUFJLENBQUMsa0JBQWtCLEdBQUcsMkJBQTJCLENBQUMsa0JBQWtCLENBQUM7SUFDN0UsQ0FBQzs7OztJQUVELElBQUksWUFBWTtRQUNaLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQztJQUN0QixDQUFDO0NBQ0o7OztJQVpHLHNDQUF1Qjs7SUFDdkIsdUNBQXVDOztJQUN2QyxvREFBMkIiLCJzb3VyY2VzQ29udGVudCI6WyIvKiFcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxOSBBbGZyZXNjbyBTb2Z0d2FyZSwgTHRkLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgeyBDYXJkVmlld0l0ZW0gfSBmcm9tICcuLi9pbnRlcmZhY2VzL2NhcmQtdmlldy1pdGVtLmludGVyZmFjZSc7XG5pbXBvcnQgeyBEeW5hbWljQ29tcG9uZW50TW9kZWwgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9keW5hbWljLWNvbXBvbmVudC1tYXBwZXIuc2VydmljZSc7XG5pbXBvcnQgeyBDYXJkVmlld0Jhc2VJdGVtTW9kZWwgfSBmcm9tICcuL2NhcmQtdmlldy1iYXNlaXRlbS5tb2RlbCc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBDYXJkVmlld0FycmF5SXRlbVByb3BlcnRpZXMgfSBmcm9tICcuLi9pbnRlcmZhY2VzL2NhcmQtdmlldy1hcnJheWl0ZW0tcHJvcGVydGllcy5pbnRlcmZhY2UnO1xuXG5leHBvcnQgaW50ZXJmYWNlIENhcmRWaWV3QXJyYXlJdGVtIHtcbiAgICBpY29uOiBzdHJpbmc7XG4gICAgdmFsdWU6IHN0cmluZztcbn1cblxuZXhwb3J0IGNsYXNzIENhcmRWaWV3QXJyYXlJdGVtTW9kZWwgZXh0ZW5kcyBDYXJkVmlld0Jhc2VJdGVtTW9kZWwgaW1wbGVtZW50cyBDYXJkVmlld0l0ZW0sIER5bmFtaWNDb21wb25lbnRNb2RlbCB7XG5cbiAgICB0eXBlOiBzdHJpbmcgPSAnYXJyYXknO1xuICAgIHZhbHVlOiBPYnNlcnZhYmxlPENhcmRWaWV3QXJyYXlJdGVtW10+O1xuICAgIG5vT2ZJdGVtc1RvRGlzcGxheTogbnVtYmVyO1xuXG4gICAgY29uc3RydWN0b3IoY2FyZFZpZXdBcnJheUl0ZW1Qcm9wZXJ0aWVzOiBDYXJkVmlld0FycmF5SXRlbVByb3BlcnRpZXMpIHtcbiAgICAgICAgc3VwZXIoY2FyZFZpZXdBcnJheUl0ZW1Qcm9wZXJ0aWVzKTtcbiAgICAgICAgdGhpcy5ub09mSXRlbXNUb0Rpc3BsYXkgPSBjYXJkVmlld0FycmF5SXRlbVByb3BlcnRpZXMubm9PZkl0ZW1zVG9EaXNwbGF5O1xuICAgIH1cblxuICAgIGdldCBkaXNwbGF5VmFsdWUoKTogT2JzZXJ2YWJsZTxDYXJkVmlld0FycmF5SXRlbVtdPiB7XG4gICAgICAgIHJldHVybiB0aGlzLnZhbHVlO1xuICAgIH1cbn1cbiJdfQ==
