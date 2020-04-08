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
import { HighlightTransformService } from '../services/highlight-transform.service';
export class HighlightPipe {
  /**
   * @param {?} highlightTransformService
   */
  constructor(highlightTransformService) {
    this.highlightTransformService = highlightTransformService;
  }
  /**
   * @param {?} text
   * @param {?} search
   * @return {?}
   */
  transform(text, search) {
    /** @type {?} */
    const highlightTransformResult = this.highlightTransformService.highlight(
      text,
      search
    );
    return highlightTransformResult.text;
  }
}
HighlightPipe.decorators = [
  {
    type: Pipe,
    args: [
      {
        name: 'highlight'
      }
    ]
  }
];
/** @nocollapse */
HighlightPipe.ctorParameters = () => [{ type: HighlightTransformService }];
if (false) {
  /**
   * @type {?}
   * @private
   */
  HighlightPipe.prototype.highlightTransformService;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGV4dC1oaWdobGlnaHQucGlwZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BhbGZyZXNjby9hZGYtY29yZS8iLCJzb3VyY2VzIjpbInBpcGVzL3RleHQtaGlnaGxpZ2h0LnBpcGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFpQkEsT0FBTyxFQUFFLElBQUksRUFBaUIsTUFBTSxlQUFlLENBQUM7QUFDcEQsT0FBTyxFQUFFLHlCQUF5QixFQUE0QixNQUFNLHlDQUF5QyxDQUFDO0FBSzlHLE1BQU0sT0FBTyxhQUFhOzs7O0lBRXRCLFlBQW9CLHlCQUFvRDtRQUFwRCw4QkFBeUIsR0FBekIseUJBQXlCLENBQTJCO0lBQUksQ0FBQzs7Ozs7O0lBRTdFLFNBQVMsQ0FBQyxJQUFZLEVBQUUsTUFBYzs7Y0FDNUIsd0JBQXdCLEdBQTZCLElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQztRQUNqSCxPQUFPLHdCQUF3QixDQUFDLElBQUksQ0FBQztJQUN6QyxDQUFDOzs7WUFWSixJQUFJLFNBQUM7Z0JBQ0YsSUFBSSxFQUFFLFdBQVc7YUFDcEI7Ozs7WUFKUSx5QkFBeUI7Ozs7Ozs7SUFPbEIsa0RBQTREIiwic291cmNlc0NvbnRlbnQiOlsiLyohXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTkgQWxmcmVzY28gU29mdHdhcmUsIEx0ZC5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0IHsgUGlwZSwgUGlwZVRyYW5zZm9ybSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgSGlnaGxpZ2h0VHJhbnNmb3JtU2VydmljZSwgSGlnaGxpZ2h0VHJhbnNmb3JtUmVzdWx0IH0gZnJvbSAnLi4vc2VydmljZXMvaGlnaGxpZ2h0LXRyYW5zZm9ybS5zZXJ2aWNlJztcblxuQFBpcGUoe1xuICAgIG5hbWU6ICdoaWdobGlnaHQnXG59KVxuZXhwb3J0IGNsYXNzIEhpZ2hsaWdodFBpcGUgaW1wbGVtZW50cyBQaXBlVHJhbnNmb3JtIHtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgaGlnaGxpZ2h0VHJhbnNmb3JtU2VydmljZTogSGlnaGxpZ2h0VHJhbnNmb3JtU2VydmljZSkgeyB9XG5cbiAgICB0cmFuc2Zvcm0odGV4dDogc3RyaW5nLCBzZWFyY2g6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgICAgIGNvbnN0IGhpZ2hsaWdodFRyYW5zZm9ybVJlc3VsdDogSGlnaGxpZ2h0VHJhbnNmb3JtUmVzdWx0ID0gdGhpcy5oaWdobGlnaHRUcmFuc2Zvcm1TZXJ2aWNlLmhpZ2hsaWdodCh0ZXh0LCBzZWFyY2gpO1xuICAgICAgICByZXR1cm4gaGlnaGxpZ2h0VHJhbnNmb3JtUmVzdWx0LnRleHQ7XG4gICAgfVxufVxuIl19
