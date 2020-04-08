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
/** @type {?} */
export const MOMENT_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY'
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM Y',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM Y'
  }
};
/** @type {?} */
const dateNames = [];
for (let date = 1; date <= 31; date++) {
  dateNames.push(String(date));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9tZW50LWRhdGUtZm9ybWF0cy5tb2RlbC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BhbGZyZXNjby9hZGYtY29yZS8iLCJzb3VyY2VzIjpbInV0aWxzL21vbWVudC1kYXRlLWZvcm1hdHMubW9kZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBbUJBLE1BQU0sT0FBTyxtQkFBbUIsR0FBbUI7SUFDL0MsS0FBSyxFQUFFO1FBQ0gsU0FBUyxFQUFFLFlBQVk7S0FDMUI7SUFDRCxPQUFPLEVBQUU7UUFDTCxTQUFTLEVBQUUsWUFBWTtRQUN2QixjQUFjLEVBQUUsUUFBUTtRQUN4QixhQUFhLEVBQUUsSUFBSTtRQUNuQixrQkFBa0IsRUFBRSxRQUFRO0tBQy9CO0NBQ0o7O01BRUssU0FBUyxHQUFhLEVBQUU7QUFDOUIsS0FBSyxJQUFJLElBQUksR0FBRyxDQUFDLEVBQUUsSUFBSSxJQUFJLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRTtJQUNuQyxTQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0NBQ2hDIiwic291cmNlc0NvbnRlbnQiOlsiLyohXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTkgQWxmcmVzY28gU29mdHdhcmUsIEx0ZC5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0IHsgTWF0RGF0ZUZvcm1hdHMgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbCc7XG5cbmV4cG9ydCBjb25zdCBNT01FTlRfREFURV9GT1JNQVRTOiBNYXREYXRlRm9ybWF0cyA9IHtcbiAgICBwYXJzZToge1xuICAgICAgICBkYXRlSW5wdXQ6ICdERC9NTS9ZWVlZJ1xuICAgIH0sXG4gICAgZGlzcGxheToge1xuICAgICAgICBkYXRlSW5wdXQ6ICdERC9NTS9ZWVlZJyxcbiAgICAgICAgbW9udGhZZWFyTGFiZWw6ICdNTU1NIFknLFxuICAgICAgICBkYXRlQTExeUxhYmVsOiAnTEwnLFxuICAgICAgICBtb250aFllYXJBMTF5TGFiZWw6ICdNTU1NIFknXG4gICAgfVxufTtcblxuY29uc3QgZGF0ZU5hbWVzOiBzdHJpbmdbXSA9IFtdO1xuZm9yIChsZXQgZGF0ZSA9IDE7IGRhdGUgPD0gMzE7IGRhdGUrKykge1xuICAgIGRhdGVOYW1lcy5wdXNoKFN0cmluZyhkYXRlKSk7XG59XG4iXX0=
