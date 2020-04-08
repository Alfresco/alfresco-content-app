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
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
/**
 * @template T
 */
export class CardViewSelectItemModel extends CardViewBaseItemModel {
  /**
   * @param {?} cardViewSelectItemProperties
   */
  constructor(cardViewSelectItemProperties) {
    super(cardViewSelectItemProperties);
    this.type = 'select';
    this.options$ = cardViewSelectItemProperties.options$;
  }
  /**
   * @return {?}
   */
  get displayValue() {
    return this.options$.pipe(
      switchMap(
        /**
         * @param {?} options
         * @return {?}
         */
        options => {
          /** @type {?} */
          const option = options.find(
            /**
             * @param {?} o
             * @return {?}
             */
            (o => o.key === this.value)
          );
          return of(option ? option.label : '');
        }
      )
    );
  }
}
if (false) {
  /** @type {?} */
  CardViewSelectItemModel.prototype.type;
  /** @type {?} */
  CardViewSelectItemModel.prototype.options$;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FyZC12aWV3LXNlbGVjdGl0ZW0ubW9kZWwuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AYWxmcmVzY28vYWRmLWNvcmUvIiwic291cmNlcyI6WyJjYXJkLXZpZXcvbW9kZWxzL2NhcmQtdmlldy1zZWxlY3RpdGVtLm1vZGVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBbUJBLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBRW5FLE9BQU8sRUFBYyxFQUFFLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDdEMsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGdCQUFnQixDQUFDOzs7O0FBRTNDLE1BQU0sT0FBTyx1QkFBMkIsU0FBUSxxQkFBcUI7Ozs7SUFJakUsWUFBWSw0QkFBNkQ7UUFDckUsS0FBSyxDQUFDLDRCQUE0QixDQUFDLENBQUM7UUFKeEMsU0FBSSxHQUFXLFFBQVEsQ0FBQztRQU1wQixJQUFJLENBQUMsUUFBUSxHQUFHLDRCQUE0QixDQUFDLFFBQVEsQ0FBQztJQUMxRCxDQUFDOzs7O0lBRUQsSUFBSSxZQUFZO1FBQ1osT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FDckIsU0FBUzs7OztRQUFDLENBQUMsT0FBTyxFQUFFLEVBQUU7O2tCQUNaLE1BQU0sR0FBRyxPQUFPLENBQUMsSUFBSTs7OztZQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLElBQUksQ0FBQyxLQUFLLEVBQUM7WUFDeEQsT0FBTyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUMxQyxDQUFDLEVBQUMsQ0FDTCxDQUFDO0lBQ04sQ0FBQztDQUNKOzs7SUFqQkcsdUNBQXdCOztJQUN4QiwyQ0FBb0QiLCJzb3VyY2VzQ29udGVudCI6WyIvKiFcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxOSBBbGZyZXNjbyBTb2Z0d2FyZSwgTHRkLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgeyBDYXJkVmlld0l0ZW0gfSBmcm9tICcuLi9pbnRlcmZhY2VzL2NhcmQtdmlldy1pdGVtLmludGVyZmFjZSc7XG5pbXBvcnQgeyBEeW5hbWljQ29tcG9uZW50TW9kZWwgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9keW5hbWljLWNvbXBvbmVudC1tYXBwZXIuc2VydmljZSc7XG5pbXBvcnQgeyBDYXJkVmlld0Jhc2VJdGVtTW9kZWwgfSBmcm9tICcuL2NhcmQtdmlldy1iYXNlaXRlbS5tb2RlbCc7XG5pbXBvcnQgeyBDYXJkVmlld1NlbGVjdEl0ZW1Qcm9wZXJ0aWVzLCBDYXJkVmlld1NlbGVjdEl0ZW1PcHRpb24gfSBmcm9tICcuLi9pbnRlcmZhY2VzL2NhcmQtdmlldy5pbnRlcmZhY2VzJztcbmltcG9ydCB7IE9ic2VydmFibGUsIG9mIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBzd2l0Y2hNYXAgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmV4cG9ydCBjbGFzcyBDYXJkVmlld1NlbGVjdEl0ZW1Nb2RlbDxUPiBleHRlbmRzIENhcmRWaWV3QmFzZUl0ZW1Nb2RlbCBpbXBsZW1lbnRzIENhcmRWaWV3SXRlbSwgRHluYW1pY0NvbXBvbmVudE1vZGVsIHtcbiAgICB0eXBlOiBzdHJpbmcgPSAnc2VsZWN0JztcbiAgICBvcHRpb25zJDogT2JzZXJ2YWJsZTxDYXJkVmlld1NlbGVjdEl0ZW1PcHRpb248VD5bXT47XG5cbiAgICBjb25zdHJ1Y3RvcihjYXJkVmlld1NlbGVjdEl0ZW1Qcm9wZXJ0aWVzOiBDYXJkVmlld1NlbGVjdEl0ZW1Qcm9wZXJ0aWVzPFQ+KSB7XG4gICAgICAgIHN1cGVyKGNhcmRWaWV3U2VsZWN0SXRlbVByb3BlcnRpZXMpO1xuXG4gICAgICAgIHRoaXMub3B0aW9ucyQgPSBjYXJkVmlld1NlbGVjdEl0ZW1Qcm9wZXJ0aWVzLm9wdGlvbnMkO1xuICAgIH1cblxuICAgIGdldCBkaXNwbGF5VmFsdWUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMkLnBpcGUoXG4gICAgICAgICAgICBzd2l0Y2hNYXAoKG9wdGlvbnMpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBvcHRpb24gPSBvcHRpb25zLmZpbmQoKG8pID0+IG8ua2V5ID09PSB0aGlzLnZhbHVlKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gb2Yob3B0aW9uID8gb3B0aW9uLmxhYmVsIDogJycpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgKTtcbiAgICB9XG59XG4iXX0=
