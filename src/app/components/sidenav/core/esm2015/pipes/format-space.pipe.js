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
import { Pipe } from '@angular/core';
export class FormatSpacePipe {
  /**
   * @param {?} inputValue
   * @param {?=} replaceChar
   * @param {?=} lowerCase
   * @return {?}
   */
  transform(inputValue, replaceChar = '_', lowerCase = true) {
    /** @type {?} */
    let transformedString = '';
    if (inputValue) {
      transformedString = lowerCase
        ? inputValue
            .trim()
            .split(' ')
            .join(replaceChar)
            .toLocaleLowerCase()
        : inputValue
            .trim()
            .split(' ')
            .join(replaceChar);
    }
    return transformedString;
  }
}
FormatSpacePipe.decorators = [
  {
    type: Pipe,
    args: [
      {
        name: 'formatSpace'
      }
    ]
  }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybWF0LXNwYWNlLnBpcGUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AYWxmcmVzY28vYWRmLWNvcmUvIiwic291cmNlcyI6WyJwaXBlcy9mb3JtYXQtc3BhY2UucGlwZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWlCQSxPQUFPLEVBQUUsSUFBSSxFQUFpQixNQUFNLGVBQWUsQ0FBQztBQUtwRCxNQUFNLE9BQU8sZUFBZTs7Ozs7OztJQUV4QixTQUFTLENBQUMsVUFBa0IsRUFBRSxjQUFzQixHQUFHLEVBQUUsWUFBcUIsSUFBSTs7WUFDMUUsaUJBQWlCLEdBQUcsRUFBRTtRQUMxQixJQUFJLFVBQVUsRUFBRTtZQUNaLGlCQUFpQixHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQyxDQUFDO2dCQUNoRyxVQUFVLENBQUMsSUFBSSxFQUFFLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztTQUN0RDtRQUNELE9BQU8saUJBQWlCLENBQUM7SUFDN0IsQ0FBQzs7O1lBWkosSUFBSSxTQUFDO2dCQUNGLElBQUksRUFBRSxhQUFhO2FBQ3RCIiwic291cmNlc0NvbnRlbnQiOlsiLyohXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTkgQWxmcmVzY28gU29mdHdhcmUsIEx0ZC5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0IHsgUGlwZSwgUGlwZVRyYW5zZm9ybSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5AUGlwZSh7XG4gICAgbmFtZTogJ2Zvcm1hdFNwYWNlJ1xufSlcbmV4cG9ydCBjbGFzcyBGb3JtYXRTcGFjZVBpcGUgaW1wbGVtZW50cyBQaXBlVHJhbnNmb3JtIHtcblxuICAgIHRyYW5zZm9ybShpbnB1dFZhbHVlOiBzdHJpbmcsIHJlcGxhY2VDaGFyOiBzdHJpbmcgPSAnXycsIGxvd2VyQ2FzZTogYm9vbGVhbiA9IHRydWUpOiBzdHJpbmcge1xuICAgICAgICBsZXQgdHJhbnNmb3JtZWRTdHJpbmcgPSAnJztcbiAgICAgICAgaWYgKGlucHV0VmFsdWUpIHtcbiAgICAgICAgICAgIHRyYW5zZm9ybWVkU3RyaW5nID0gbG93ZXJDYXNlID8gaW5wdXRWYWx1ZS50cmltKCkuc3BsaXQoJyAnKS5qb2luKHJlcGxhY2VDaGFyKS50b0xvY2FsZUxvd2VyQ2FzZSgpIDpcbiAgICAgICAgICAgICAgICBpbnB1dFZhbHVlLnRyaW0oKS5zcGxpdCgnICcpLmpvaW4ocmVwbGFjZUNoYXIpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cmFuc2Zvcm1lZFN0cmluZztcbiAgICB9XG5cbn1cbiJdfQ==
