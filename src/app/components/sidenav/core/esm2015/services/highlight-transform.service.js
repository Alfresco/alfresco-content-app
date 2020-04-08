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
import { Injectable } from '@angular/core';
import * as i0 from '@angular/core';
/**
 * @record
 */
export function HighlightTransformResult() {}
if (false) {
  /** @type {?} */
  HighlightTransformResult.prototype.text;
  /** @type {?} */
  HighlightTransformResult.prototype.changed;
}
export class HighlightTransformService {
  /**
   * Searches for `search` string(s) within `text` and highlights all occurrences.
   * @param {?} text Text to search within
   * @param {?} search Text pattern to search for
   * @param {?=} wrapperClass CSS class used to provide highlighting style
   * @return {?} New text along with boolean value to indicate whether anything was highlighted
   */
  highlight(text, search, wrapperClass = 'adf-highlight') {
    /** @type {?} */
    let isMatching = false;
    /** @type {?} */
    let result = text;
    if (search && text) {
      /** @type {?} */
      let pattern = search.replace(
        /[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g,
        '\\$&'
      );
      pattern = pattern
        .split(' ')
        .filter(
          /**
           * @param {?} t
           * @return {?}
           */
          t => {
            return t.length > 0;
          }
        )
        .join('|');
      /** @type {?} */
      const regex = new RegExp(pattern, 'gi');
      result = text.replace(/<[^>]+>/g, '').replace(
        regex
        /**
         * @param {?} match
         * @return {?}
         */,
        match => {
          isMatching = true;
          return `<span class="${wrapperClass}">${match}</span>`;
        }
      );
      return { text: result, changed: isMatching };
    } else {
      return { text: result, changed: isMatching };
    }
  }
}
HighlightTransformService.decorators = [
  {
    type: Injectable,
    args: [
      {
        providedIn: 'root'
      }
    ]
  }
];
/** @nocollapse */ HighlightTransformService.ngInjectableDef = i0.defineInjectable(
  {
    factory: function HighlightTransformService_Factory() {
      return new HighlightTransformService();
    },
    token: HighlightTransformService,
    providedIn: 'root'
  }
);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGlnaGxpZ2h0LXRyYW5zZm9ybS5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQGFsZnJlc2NvL2FkZi1jb3JlLyIsInNvdXJjZXMiOlsic2VydmljZXMvaGlnaGxpZ2h0LXRyYW5zZm9ybS5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBaUJBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7Ozs7O0FBRTNDLDhDQUdDOzs7SUFGRyx3Q0FBYTs7SUFDYiwyQ0FBaUI7O0FBTXJCLE1BQU0sT0FBTyx5QkFBeUI7Ozs7Ozs7O0lBUzNCLFNBQVMsQ0FBQyxJQUFZLEVBQUUsTUFBYyxFQUFFLGVBQXVCLGVBQWU7O1lBQzdFLFVBQVUsR0FBRyxLQUFLOztZQUNsQixNQUFNLEdBQUcsSUFBSTtRQUVqQixJQUFJLE1BQU0sSUFBSSxJQUFJLEVBQUU7O2dCQUNaLE9BQU8sR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLHFDQUFxQyxFQUFFLE1BQU0sQ0FBQztZQUMzRSxPQUFPLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNOzs7O1lBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRTtnQkFDdEMsT0FBTyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztZQUN4QixDQUFDLEVBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7O2tCQUVQLEtBQUssR0FBRyxJQUFJLE1BQU0sQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDO1lBQ3ZDLE1BQU0sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSzs7OztZQUFFLENBQUMsS0FBSyxFQUFFLEVBQUU7Z0JBQzNELFVBQVUsR0FBRyxJQUFJLENBQUM7Z0JBQ2xCLE9BQU8sZ0JBQWdCLFlBQVksS0FBSyxLQUFLLFNBQVMsQ0FBQztZQUMzRCxDQUFDLEVBQUMsQ0FBQztZQUVILE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsQ0FBQztTQUNoRDthQUFNO1lBQ0gsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRSxDQUFDO1NBQ2hEO0lBQ0wsQ0FBQzs7O1lBaENKLFVBQVUsU0FBQztnQkFDUixVQUFVLEVBQUUsTUFBTTthQUNyQiIsInNvdXJjZXNDb250ZW50IjpbIi8qIVxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE5IEFsZnJlc2NvIFNvZnR3YXJlLCBMdGQuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbmltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuZXhwb3J0IGludGVyZmFjZSBIaWdobGlnaHRUcmFuc2Zvcm1SZXN1bHQge1xuICAgIHRleHQ6IHN0cmluZztcbiAgICBjaGFuZ2VkOiBib29sZWFuO1xufVxuXG5ASW5qZWN0YWJsZSh7XG4gICAgcHJvdmlkZWRJbjogJ3Jvb3QnXG59KVxuZXhwb3J0IGNsYXNzIEhpZ2hsaWdodFRyYW5zZm9ybVNlcnZpY2Uge1xuXG4gICAgLyoqXG4gICAgICogU2VhcmNoZXMgZm9yIGBzZWFyY2hgIHN0cmluZyhzKSB3aXRoaW4gYHRleHRgIGFuZCBoaWdobGlnaHRzIGFsbCBvY2N1cnJlbmNlcy5cbiAgICAgKiBAcGFyYW0gdGV4dCBUZXh0IHRvIHNlYXJjaCB3aXRoaW5cbiAgICAgKiBAcGFyYW0gc2VhcmNoIFRleHQgcGF0dGVybiB0byBzZWFyY2ggZm9yXG4gICAgICogQHBhcmFtIHdyYXBwZXJDbGFzcyBDU1MgY2xhc3MgdXNlZCB0byBwcm92aWRlIGhpZ2hsaWdodGluZyBzdHlsZVxuICAgICAqIEByZXR1cm5zIE5ldyB0ZXh0IGFsb25nIHdpdGggYm9vbGVhbiB2YWx1ZSB0byBpbmRpY2F0ZSB3aGV0aGVyIGFueXRoaW5nIHdhcyBoaWdobGlnaHRlZFxuICAgICAqL1xuICAgIHB1YmxpYyBoaWdobGlnaHQodGV4dDogc3RyaW5nLCBzZWFyY2g6IHN0cmluZywgd3JhcHBlckNsYXNzOiBzdHJpbmcgPSAnYWRmLWhpZ2hsaWdodCcpOiBIaWdobGlnaHRUcmFuc2Zvcm1SZXN1bHQge1xuICAgICAgICBsZXQgaXNNYXRjaGluZyA9IGZhbHNlLFxuICAgICAgICAgICAgcmVzdWx0ID0gdGV4dDtcblxuICAgICAgICBpZiAoc2VhcmNoICYmIHRleHQpIHtcbiAgICAgICAgICAgIGxldCBwYXR0ZXJuID0gc2VhcmNoLnJlcGxhY2UoL1tcXC1cXFtcXF1cXC9cXHtcXH1cXChcXClcXCpcXCtcXD9cXC5cXFxcXFxeXFwkXFx8XS9nLCAnXFxcXCQmJyk7XG4gICAgICAgICAgICBwYXR0ZXJuID0gcGF0dGVybi5zcGxpdCgnICcpLmZpbHRlcigodCkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB0Lmxlbmd0aCA+IDA7XG4gICAgICAgICAgICB9KS5qb2luKCd8Jyk7XG5cbiAgICAgICAgICAgIGNvbnN0IHJlZ2V4ID0gbmV3IFJlZ0V4cChwYXR0ZXJuLCAnZ2knKTtcbiAgICAgICAgICAgIHJlc3VsdCA9IHRleHQucmVwbGFjZSgvPFtePl0rPi9nLCAnJykucmVwbGFjZShyZWdleCwgKG1hdGNoKSA9PiB7XG4gICAgICAgICAgICAgICAgaXNNYXRjaGluZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGA8c3BhbiBjbGFzcz1cIiR7d3JhcHBlckNsYXNzfVwiPiR7bWF0Y2h9PC9zcGFuPmA7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIHsgdGV4dDogcmVzdWx0LCBjaGFuZ2VkOiBpc01hdGNoaW5nIH07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4geyB0ZXh0OiByZXN1bHQsIGNoYW5nZWQ6IGlzTWF0Y2hpbmcgfTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiJdfQ==
