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
import { Component, Input, ViewEncapsulation } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
export class PdfThumbComponent {
  /**
   * @param {?} sanitizer
   */
  constructor(sanitizer) {
    this.sanitizer = sanitizer;
    this.page = null;
  }
  /**
   * @return {?}
   */
  ngOnInit() {
    this.image$ = this.page.getPage().then(
      /**
       * @param {?} page
       * @return {?}
       */
      page => this.getThumb(page)
    );
  }
  /**
   * @private
   * @param {?} page
   * @return {?}
   */
  getThumb(page) {
    /** @type {?} */
    const viewport = page.getViewport(1);
    /** @type {?} */
    const canvas = this.getCanvas();
    /** @type {?} */
    const scale = Math.min(
      (canvas.height / viewport.height),
      (canvas.width / viewport.width)
    );
    return page
      .render({
        canvasContext: canvas.getContext('2d'),
        viewport: page.getViewport(scale)
      })
      .then(
        /**
         * @return {?}
         */
        () => {
          /** @type {?} */
          const imageSource = canvas.toDataURL();
          return this.sanitizer.bypassSecurityTrustUrl(imageSource);
        }
      );
  }
  /**
   * @private
   * @return {?}
   */
  getCanvas() {
    /** @type {?} */
    const canvas = document.createElement('canvas');
    canvas.width = this.page.getWidth();
    canvas.height = this.page.getHeight();
    return canvas;
  }
}
PdfThumbComponent.decorators = [
  {
    type: Component,
    args: [
      {
        selector: 'adf-pdf-thumb',
        template:
          '<ng-container *ngIf="image$ | async as image">\n    <img [src]="image" [alt]="\'ADF_VIEWER.SIDEBAR.THUMBNAILS.PAGE\' | translate: { pageNum: page.id }"\n        title="{{ \'ADF_VIEWER.SIDEBAR.THUMBNAILS.PAGE\' | translate: { pageNum: page.id } }}">\n</ng-container>\n',
        encapsulation: ViewEncapsulation.None
      }
    ]
  }
];
/** @nocollapse */
PdfThumbComponent.ctorParameters = () => [{ type: DomSanitizer }];
PdfThumbComponent.propDecorators = {
  page: [{ type: Input }]
};
if (false) {
  /** @type {?} */
  PdfThumbComponent.prototype.page;
  /** @type {?} */
  PdfThumbComponent.prototype.image$;
  /**
   * @type {?}
   * @private
   */
  PdfThumbComponent.prototype.sanitizer;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGRmLXZpZXdlci10aHVtYi5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AYWxmcmVzY28vYWRmLWNvcmUvIiwic291cmNlcyI6WyJ2aWV3ZXIvY29tcG9uZW50cy9wZGYtdmlld2VyLXRodW1iLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWlCQSxPQUFPLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBVSxpQkFBaUIsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUM1RSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFPekQsTUFBTSxPQUFPLGlCQUFpQjs7OztJQU8xQixZQUFvQixTQUF1QjtRQUF2QixjQUFTLEdBQVQsU0FBUyxDQUFjO1FBSjNDLFNBQUksR0FBUSxJQUFJLENBQUM7SUFJNkIsQ0FBQzs7OztJQUUvQyxRQUFRO1FBQ0osSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLElBQUk7Ozs7UUFBQyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBQyxDQUFDO0lBQzFFLENBQUM7Ozs7OztJQUVPLFFBQVEsQ0FBQyxJQUFJOztjQUNYLFFBQVEsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQzs7Y0FFOUIsTUFBTSxHQUFHLElBQUksQ0FBQyxTQUFTLEVBQUU7O2NBQ3pCLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsS0FBSyxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUUxRixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUM7WUFDZixhQUFhLEVBQUUsTUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUM7WUFDdEMsUUFBUSxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDO1NBQ3BDLENBQUM7YUFDRCxJQUFJOzs7UUFBQyxHQUFHLEVBQUU7O2tCQUNELFdBQVcsR0FBRyxNQUFNLENBQUMsU0FBUyxFQUFFO1lBQ3RDLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxzQkFBc0IsQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUM5RCxDQUFDLEVBQUMsQ0FBQztJQUNQLENBQUM7Ozs7O0lBRU8sU0FBUzs7Y0FDUCxNQUFNLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUM7UUFDL0MsTUFBTSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ3BDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUN0QyxPQUFPLE1BQU0sQ0FBQztJQUNsQixDQUFDOzs7WUF2Q0osU0FBUyxTQUFDO2dCQUNQLFFBQVEsRUFBRSxlQUFlO2dCQUN6QiwyUkFBZ0Q7Z0JBQ2hELGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJO2FBQ3hDOzs7O1lBTlEsWUFBWTs7O21CQVNoQixLQUFLOzs7O0lBQU4saUNBQ2lCOztJQUVqQixtQ0FBd0I7Ozs7O0lBRVosc0NBQStCIiwic291cmNlc0NvbnRlbnQiOlsiLyohXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTkgQWxmcmVzY28gU29mdHdhcmUsIEx0ZC5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0IHsgQ29tcG9uZW50LCBJbnB1dCwgT25Jbml0LCBWaWV3RW5jYXBzdWxhdGlvbiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRG9tU2FuaXRpemVyIH0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlcic7XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAnYWRmLXBkZi10aHVtYicsXG4gICAgdGVtcGxhdGVVcmw6ICcuL3BkZi12aWV3ZXItdGh1bWIuY29tcG9uZW50Lmh0bWwnLFxuICAgIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmVcbn0pXG5leHBvcnQgY2xhc3MgUGRmVGh1bWJDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuXG4gICAgQElucHV0KClcbiAgICBwYWdlOiBhbnkgPSBudWxsO1xuXG4gICAgaW1hZ2UkOiBQcm9taXNlPHN0cmluZz47XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHNhbml0aXplcjogRG9tU2FuaXRpemVyKSB7fVxuXG4gICAgbmdPbkluaXQoKSB7XG4gICAgICAgIHRoaXMuaW1hZ2UkID0gdGhpcy5wYWdlLmdldFBhZ2UoKS50aGVuKChwYWdlKSA9PiB0aGlzLmdldFRodW1iKHBhZ2UpKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldFRodW1iKHBhZ2UpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgICAgICBjb25zdCB2aWV3cG9ydCA9IHBhZ2UuZ2V0Vmlld3BvcnQoMSk7XG5cbiAgICAgICAgY29uc3QgY2FudmFzID0gdGhpcy5nZXRDYW52YXMoKTtcbiAgICAgICAgY29uc3Qgc2NhbGUgPSBNYXRoLm1pbigoY2FudmFzLmhlaWdodCAvIHZpZXdwb3J0LmhlaWdodCksIChjYW52YXMud2lkdGggLyB2aWV3cG9ydC53aWR0aCkpO1xuXG4gICAgICAgIHJldHVybiBwYWdlLnJlbmRlcih7XG4gICAgICAgICAgICBjYW52YXNDb250ZXh0OiBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKSxcbiAgICAgICAgICAgIHZpZXdwb3J0OiBwYWdlLmdldFZpZXdwb3J0KHNjYWxlKVxuICAgICAgICB9KVxuICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBpbWFnZVNvdXJjZSA9IGNhbnZhcy50b0RhdGFVUkwoKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNhbml0aXplci5ieXBhc3NTZWN1cml0eVRydXN0VXJsKGltYWdlU291cmNlKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRDYW52YXMoKTogSFRNTENhbnZhc0VsZW1lbnQge1xuICAgICAgICBjb25zdCBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcbiAgICAgICAgY2FudmFzLndpZHRoID0gdGhpcy5wYWdlLmdldFdpZHRoKCk7XG4gICAgICAgIGNhbnZhcy5oZWlnaHQgPSB0aGlzLnBhZ2UuZ2V0SGVpZ2h0KCk7XG4gICAgICAgIHJldHVybiBjYW52YXM7XG4gICAgfVxufVxuIl19
