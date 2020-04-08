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
/* tslint:disable:no-input-rename  */
import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { HighlightTransformService } from '../services/highlight-transform.service';
export class HighlightDirective {
  /**
   * @param {?} el
   * @param {?} renderer
   * @param {?} highlightTransformService
   */
  constructor(el, renderer, highlightTransformService) {
    this.el = el;
    this.renderer = renderer;
    this.highlightTransformService = highlightTransformService;
    /**
     * Class selector for highlightable elements.
     */
    this.selector = '';
    /**
     * Text to highlight.
     */
    this.search = '';
    /**
     * CSS class used to apply highlighting.
     */
    this.classToApply = 'adf-highlight';
  }
  /**
   * @return {?}
   */
  ngAfterViewChecked() {
    this.highlight();
  }
  /**
   * @param {?=} search
   * @param {?=} selector
   * @param {?=} classToApply
   * @return {?}
   */
  highlight(
    search = this.search,
    selector = this.selector,
    classToApply = this.classToApply
  ) {
    if (search && selector) {
      /** @type {?} */
      const elements = this.el.nativeElement.querySelectorAll(selector);
      elements.forEach(
        /**
         * @param {?} element
         * @return {?}
         */
        element => {
          /** @type {?} */
          const highlightTransformResult = this.highlightTransformService.highlight(
            element.innerHTML,
            search,
            classToApply
          );
          if (highlightTransformResult.changed) {
            this.renderer.setProperty(
              element,
              'innerHTML',
              highlightTransformResult.text
            );
          }
        }
      );
    }
  }
}
HighlightDirective.decorators = [
  {
    type: Directive,
    args: [
      {
        selector: '[adf-highlight]'
      }
    ]
  }
];
/** @nocollapse */
HighlightDirective.ctorParameters = () => [
  { type: ElementRef },
  { type: Renderer2 },
  { type: HighlightTransformService }
];
HighlightDirective.propDecorators = {
  selector: [{ type: Input, args: ['adf-highlight-selector'] }],
  search: [{ type: Input, args: ['adf-highlight'] }],
  classToApply: [{ type: Input, args: ['adf-highlight-class'] }]
};
if (false) {
  /**
   * Class selector for highlightable elements.
   * @type {?}
   */
  HighlightDirective.prototype.selector;
  /**
   * Text to highlight.
   * @type {?}
   */
  HighlightDirective.prototype.search;
  /**
   * CSS class used to apply highlighting.
   * @type {?}
   */
  HighlightDirective.prototype.classToApply;
  /**
   * @type {?}
   * @private
   */
  HighlightDirective.prototype.el;
  /**
   * @type {?}
   * @private
   */
  HighlightDirective.prototype.renderer;
  /**
   * @type {?}
   * @private
   */
  HighlightDirective.prototype.highlightTransformService;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGlnaGxpZ2h0LmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BhbGZyZXNjby9hZGYtY29yZS8iLCJzb3VyY2VzIjpbImRpcmVjdGl2ZXMvaGlnaGxpZ2h0LmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFtQkEsT0FBTyxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBb0IsTUFBTSxlQUFlLENBQUM7QUFDMUYsT0FBTyxFQUFFLHlCQUF5QixFQUE0QixNQUFNLHlDQUF5QyxDQUFDO0FBSzlHLE1BQU0sT0FBTyxrQkFBa0I7Ozs7OztJQWMzQixZQUNZLEVBQWMsRUFDZCxRQUFtQixFQUNuQix5QkFBb0Q7UUFGcEQsT0FBRSxHQUFGLEVBQUUsQ0FBWTtRQUNkLGFBQVEsR0FBUixRQUFRLENBQVc7UUFDbkIsOEJBQXlCLEdBQXpCLHlCQUF5QixDQUEyQjs7OztRQWJoRSxhQUFRLEdBQVcsRUFBRSxDQUFDOzs7O1FBSXRCLFdBQU0sR0FBVyxFQUFFLENBQUM7Ozs7UUFJcEIsaUJBQVksR0FBVyxlQUFlLENBQUM7SUFNdkMsQ0FBQzs7OztJQUVELGtCQUFrQjtRQUNkLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztJQUNyQixDQUFDOzs7Ozs7O0lBRU0sU0FBUyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxFQUFFLFlBQVksR0FBRyxJQUFJLENBQUMsWUFBWTtRQUM3RixJQUFJLE1BQU0sSUFBSSxRQUFRLEVBQUU7O2tCQUNkLFFBQVEsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLENBQUM7WUFFakUsUUFBUSxDQUFDLE9BQU87Ozs7WUFBQyxDQUFDLE9BQU8sRUFBRSxFQUFFOztzQkFDbkIsd0JBQXdCLEdBQTZCLElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxNQUFNLEVBQUUsWUFBWSxDQUFDO2dCQUM1SSxJQUFJLHdCQUF3QixDQUFDLE9BQU8sRUFBRTtvQkFDbEMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsT0FBTyxFQUFFLFdBQVcsRUFBRSx3QkFBd0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztpQkFDbEY7WUFDTCxDQUFDLEVBQUMsQ0FBQztTQUNOO0lBQ0wsQ0FBQzs7O1lBdENKLFNBQVMsU0FBQztnQkFDUCxRQUFRLEVBQUUsaUJBQWlCO2FBQzlCOzs7O1lBTG1CLFVBQVU7WUFBUyxTQUFTO1lBQ3ZDLHlCQUF5Qjs7O3VCQVE3QixLQUFLLFNBQUMsd0JBQXdCO3FCQUk5QixLQUFLLFNBQUMsZUFBZTsyQkFJckIsS0FBSyxTQUFDLHFCQUFxQjs7Ozs7OztJQVI1QixzQ0FDc0I7Ozs7O0lBR3RCLG9DQUNvQjs7Ozs7SUFHcEIsMENBQ3VDOzs7OztJQUduQyxnQ0FBc0I7Ozs7O0lBQ3RCLHNDQUEyQjs7Ozs7SUFDM0IsdURBQTREIiwic291cmNlc0NvbnRlbnQiOlsiLyohXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTkgQWxmcmVzY28gU29mdHdhcmUsIEx0ZC5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuLyogdHNsaW50OmRpc2FibGU6bm8taW5wdXQtcmVuYW1lICAqL1xuXG5pbXBvcnQgeyBEaXJlY3RpdmUsIEVsZW1lbnRSZWYsIElucHV0LCBSZW5kZXJlcjIsIEFmdGVyVmlld0NoZWNrZWQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEhpZ2hsaWdodFRyYW5zZm9ybVNlcnZpY2UsIEhpZ2hsaWdodFRyYW5zZm9ybVJlc3VsdCB9IGZyb20gJy4uL3NlcnZpY2VzL2hpZ2hsaWdodC10cmFuc2Zvcm0uc2VydmljZSc7XG5cbkBEaXJlY3RpdmUoe1xuICAgIHNlbGVjdG9yOiAnW2FkZi1oaWdobGlnaHRdJ1xufSlcbmV4cG9ydCBjbGFzcyBIaWdobGlnaHREaXJlY3RpdmUgaW1wbGVtZW50cyBBZnRlclZpZXdDaGVja2VkIHtcblxuICAgIC8qKiBDbGFzcyBzZWxlY3RvciBmb3IgaGlnaGxpZ2h0YWJsZSBlbGVtZW50cy4gKi9cbiAgICBASW5wdXQoJ2FkZi1oaWdobGlnaHQtc2VsZWN0b3InKVxuICAgIHNlbGVjdG9yOiBzdHJpbmcgPSAnJztcblxuICAgIC8qKiBUZXh0IHRvIGhpZ2hsaWdodC4gKi9cbiAgICBASW5wdXQoJ2FkZi1oaWdobGlnaHQnKVxuICAgIHNlYXJjaDogc3RyaW5nID0gJyc7XG5cbiAgICAvKiogQ1NTIGNsYXNzIHVzZWQgdG8gYXBwbHkgaGlnaGxpZ2h0aW5nLiAqL1xuICAgIEBJbnB1dCgnYWRmLWhpZ2hsaWdodC1jbGFzcycpXG4gICAgY2xhc3NUb0FwcGx5OiBzdHJpbmcgPSAnYWRmLWhpZ2hsaWdodCc7XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHJpdmF0ZSBlbDogRWxlbWVudFJlZixcbiAgICAgICAgcHJpdmF0ZSByZW5kZXJlcjogUmVuZGVyZXIyLFxuICAgICAgICBwcml2YXRlIGhpZ2hsaWdodFRyYW5zZm9ybVNlcnZpY2U6IEhpZ2hsaWdodFRyYW5zZm9ybVNlcnZpY2UpIHtcbiAgICB9XG5cbiAgICBuZ0FmdGVyVmlld0NoZWNrZWQoKSB7XG4gICAgICAgIHRoaXMuaGlnaGxpZ2h0KCk7XG4gICAgfVxuXG4gICAgcHVibGljIGhpZ2hsaWdodChzZWFyY2ggPSB0aGlzLnNlYXJjaCwgc2VsZWN0b3IgPSB0aGlzLnNlbGVjdG9yLCBjbGFzc1RvQXBwbHkgPSB0aGlzLmNsYXNzVG9BcHBseSkge1xuICAgICAgICBpZiAoc2VhcmNoICYmIHNlbGVjdG9yKSB7XG4gICAgICAgICAgICBjb25zdCBlbGVtZW50cyA9IHRoaXMuZWwubmF0aXZlRWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKTtcblxuICAgICAgICAgICAgZWxlbWVudHMuZm9yRWFjaCgoZWxlbWVudCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGhpZ2hsaWdodFRyYW5zZm9ybVJlc3VsdDogSGlnaGxpZ2h0VHJhbnNmb3JtUmVzdWx0ID0gdGhpcy5oaWdobGlnaHRUcmFuc2Zvcm1TZXJ2aWNlLmhpZ2hsaWdodChlbGVtZW50LmlubmVySFRNTCwgc2VhcmNoLCBjbGFzc1RvQXBwbHkpO1xuICAgICAgICAgICAgICAgIGlmIChoaWdobGlnaHRUcmFuc2Zvcm1SZXN1bHQuY2hhbmdlZCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbmRlcmVyLnNldFByb3BlcnR5KGVsZW1lbnQsICdpbm5lckhUTUwnLCBoaWdobGlnaHRUcmFuc2Zvcm1SZXN1bHQudGV4dCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iXX0=
