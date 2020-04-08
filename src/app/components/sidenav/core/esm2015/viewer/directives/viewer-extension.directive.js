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
import { ContentChild, Directive, Input, TemplateRef } from '@angular/core';
import { ViewerComponent } from '../components/viewer.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
export class ViewerExtensionDirective {
  /**
   * @param {?} viewerComponent
   */
  constructor(viewerComponent) {
    this.viewerComponent = viewerComponent;
    this.onDestroy$ = new Subject();
  }
  /**
   * @return {?}
   */
  ngAfterContentInit() {
    this.templateModel = { template: this.template, isVisible: false };
    this.viewerComponent.extensionTemplates.push(this.templateModel);
    this.viewerComponent.extensionChange
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(
        /**
         * @param {?} fileExtension
         * @return {?}
         */
        fileExtension => {
          this.templateModel.isVisible = this.isVisible(fileExtension);
        }
      );
    if (this.supportedExtensions instanceof Array) {
      this.supportedExtensions.forEach(
        /**
         * @param {?} extension
         * @return {?}
         */
        extension => {
          this.viewerComponent.externalExtensions.push(extension);
        }
      );
    }
  }
  /**
   * @return {?}
   */
  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }
  /**
   * check if the current extension in the viewer is compatible with this extension checking against supportedExtensions
   * @param {?} fileExtension
   * @return {?}
   */
  isVisible(fileExtension) {
    /** @type {?} */
    let supportedExtension;
    if (this.supportedExtensions && this.supportedExtensions instanceof Array) {
      supportedExtension = this.supportedExtensions.find(
        /**
         * @param {?} extension
         * @return {?}
         */
        extension => {
          return extension.toLowerCase() === fileExtension;
        }
      );
    }
    return !!supportedExtension;
  }
}
ViewerExtensionDirective.decorators = [
  {
    type: Directive,
    args: [
      {
        selector: 'adf-viewer-extension'
      }
    ]
  }
];
/** @nocollapse */
ViewerExtensionDirective.ctorParameters = () => [{ type: ViewerComponent }];
ViewerExtensionDirective.propDecorators = {
  template: [{ type: ContentChild, args: [TemplateRef] }],
  urlFileContent: [{ type: Input }],
  extension: [{ type: Input }],
  supportedExtensions: [{ type: Input }]
};
if (false) {
  /** @type {?} */
  ViewerExtensionDirective.prototype.template;
  /** @type {?} */
  ViewerExtensionDirective.prototype.urlFileContent;
  /** @type {?} */
  ViewerExtensionDirective.prototype.extension;
  /** @type {?} */
  ViewerExtensionDirective.prototype.supportedExtensions;
  /** @type {?} */
  ViewerExtensionDirective.prototype.templateModel;
  /**
   * @type {?}
   * @private
   */
  ViewerExtensionDirective.prototype.onDestroy$;
  /**
   * @type {?}
   * @private
   */
  ViewerExtensionDirective.prototype.viewerComponent;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlld2VyLWV4dGVuc2lvbi5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AYWxmcmVzY28vYWRmLWNvcmUvIiwic291cmNlcyI6WyJ2aWV3ZXIvZGlyZWN0aXZlcy92aWV3ZXItZXh0ZW5zaW9uLmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWlCQSxPQUFPLEVBQW9CLFlBQVksRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLFdBQVcsRUFBYSxNQUFNLGVBQWUsQ0FBQztBQUN6RyxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sZ0NBQWdDLENBQUM7QUFDakUsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUMvQixPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFLM0MsTUFBTSxPQUFPLHdCQUF3Qjs7OztJQWtCakMsWUFBb0IsZUFBZ0M7UUFBaEMsb0JBQWUsR0FBZixlQUFlLENBQWlCO1FBRjVDLGVBQVUsR0FBRyxJQUFJLE9BQU8sRUFBVyxDQUFDO0lBRzVDLENBQUM7Ozs7SUFFRCxrQkFBa0I7UUFDZCxJQUFJLENBQUMsYUFBYSxHQUFHLEVBQUUsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxDQUFDO1FBRW5FLElBQUksQ0FBQyxlQUFlLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUVqRSxJQUFJLENBQUMsZUFBZSxDQUFDLGVBQWU7YUFDL0IsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7YUFDaEMsU0FBUzs7OztRQUFDLGFBQWEsQ0FBQyxFQUFFO1lBQ3ZCLElBQUksQ0FBQyxhQUFhLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDakUsQ0FBQyxFQUFDLENBQUM7UUFFUCxJQUFJLElBQUksQ0FBQyxtQkFBbUIsWUFBWSxLQUFLLEVBQUU7WUFDM0MsSUFBSSxDQUFDLG1CQUFtQixDQUFDLE9BQU87Ozs7WUFBQyxDQUFDLFNBQVMsRUFBRSxFQUFFO2dCQUMzQyxJQUFJLENBQUMsZUFBZSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUM1RCxDQUFDLEVBQUMsQ0FBQztTQUNOO0lBQ0wsQ0FBQzs7OztJQUVELFdBQVc7UUFDUCxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMzQixJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQy9CLENBQUM7Ozs7OztJQUtELFNBQVMsQ0FBQyxhQUFhOztZQUNmLGtCQUEwQjtRQUU5QixJQUFJLElBQUksQ0FBQyxtQkFBbUIsSUFBSSxDQUFDLElBQUksQ0FBQyxtQkFBbUIsWUFBWSxLQUFLLENBQUMsRUFBRTtZQUN6RSxrQkFBa0IsR0FBRyxJQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSTs7OztZQUFDLENBQUMsU0FBUyxFQUFFLEVBQUU7Z0JBQzdELE9BQU8sU0FBUyxDQUFDLFdBQVcsRUFBRSxLQUFLLGFBQWEsQ0FBQztZQUVyRCxDQUFDLEVBQUMsQ0FBQztTQUNOO1FBRUQsT0FBTyxDQUFDLENBQUMsa0JBQWtCLENBQUM7SUFDaEMsQ0FBQzs7O1lBN0RKLFNBQVMsU0FBQztnQkFDUCxRQUFRLEVBQUUsc0JBQXNCO2FBQ25DOzs7O1lBTlEsZUFBZTs7O3VCQVNuQixZQUFZLFNBQUMsV0FBVzs2QkFHeEIsS0FBSzt3QkFHTCxLQUFLO2tDQUdMLEtBQUs7Ozs7SUFUTiw0Q0FDYzs7SUFFZCxrREFDdUI7O0lBRXZCLDZDQUNrQjs7SUFFbEIsdURBQzhCOztJQUU5QixpREFBbUI7Ozs7O0lBRW5CLDhDQUE0Qzs7Ozs7SUFFaEMsbURBQXdDIiwic291cmNlc0NvbnRlbnQiOlsiLyohXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTkgQWxmcmVzY28gU29mdHdhcmUsIEx0ZC5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0IHsgQWZ0ZXJDb250ZW50SW5pdCwgQ29udGVudENoaWxkLCBEaXJlY3RpdmUsIElucHV0LCBUZW1wbGF0ZVJlZiwgT25EZXN0cm95IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBWaWV3ZXJDb21wb25lbnQgfSBmcm9tICcuLi9jb21wb25lbnRzL3ZpZXdlci5jb21wb25lbnQnO1xuaW1wb3J0IHsgU3ViamVjdCB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgdGFrZVVudGlsIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5ARGlyZWN0aXZlKHtcbiAgICBzZWxlY3RvcjogJ2FkZi12aWV3ZXItZXh0ZW5zaW9uJ1xufSlcbmV4cG9ydCBjbGFzcyBWaWV3ZXJFeHRlbnNpb25EaXJlY3RpdmUgaW1wbGVtZW50cyBBZnRlckNvbnRlbnRJbml0LCBPbkRlc3Ryb3kge1xuXG4gICAgQENvbnRlbnRDaGlsZChUZW1wbGF0ZVJlZilcbiAgICB0ZW1wbGF0ZTogYW55O1xuXG4gICAgQElucHV0KClcbiAgICB1cmxGaWxlQ29udGVudDogc3RyaW5nO1xuXG4gICAgQElucHV0KClcbiAgICBleHRlbnNpb246IHN0cmluZztcblxuICAgIEBJbnB1dCgpXG4gICAgc3VwcG9ydGVkRXh0ZW5zaW9uczogc3RyaW5nW107XG5cbiAgICB0ZW1wbGF0ZU1vZGVsOiBhbnk7XG5cbiAgICBwcml2YXRlIG9uRGVzdHJveSQgPSBuZXcgU3ViamVjdDxib29sZWFuPigpO1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSB2aWV3ZXJDb21wb25lbnQ6IFZpZXdlckNvbXBvbmVudCkge1xuICAgIH1cblxuICAgIG5nQWZ0ZXJDb250ZW50SW5pdCgpIHtcbiAgICAgICAgdGhpcy50ZW1wbGF0ZU1vZGVsID0geyB0ZW1wbGF0ZTogdGhpcy50ZW1wbGF0ZSwgaXNWaXNpYmxlOiBmYWxzZSB9O1xuXG4gICAgICAgIHRoaXMudmlld2VyQ29tcG9uZW50LmV4dGVuc2lvblRlbXBsYXRlcy5wdXNoKHRoaXMudGVtcGxhdGVNb2RlbCk7XG5cbiAgICAgICAgdGhpcy52aWV3ZXJDb21wb25lbnQuZXh0ZW5zaW9uQ2hhbmdlXG4gICAgICAgICAgICAucGlwZSh0YWtlVW50aWwodGhpcy5vbkRlc3Ryb3kkKSlcbiAgICAgICAgICAgIC5zdWJzY3JpYmUoZmlsZUV4dGVuc2lvbiA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy50ZW1wbGF0ZU1vZGVsLmlzVmlzaWJsZSA9IHRoaXMuaXNWaXNpYmxlKGZpbGVFeHRlbnNpb24pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKHRoaXMuc3VwcG9ydGVkRXh0ZW5zaW9ucyBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgICAgICB0aGlzLnN1cHBvcnRlZEV4dGVuc2lvbnMuZm9yRWFjaCgoZXh0ZW5zaW9uKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy52aWV3ZXJDb21wb25lbnQuZXh0ZXJuYWxFeHRlbnNpb25zLnB1c2goZXh0ZW5zaW9uKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbmdPbkRlc3Ryb3koKSB7XG4gICAgICAgIHRoaXMub25EZXN0cm95JC5uZXh0KHRydWUpO1xuICAgICAgICB0aGlzLm9uRGVzdHJveSQuY29tcGxldGUoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBjaGVjayBpZiB0aGUgY3VycmVudCBleHRlbnNpb24gaW4gdGhlIHZpZXdlciBpcyBjb21wYXRpYmxlIHdpdGggdGhpcyBleHRlbnNpb24gY2hlY2tpbmcgYWdhaW5zdCBzdXBwb3J0ZWRFeHRlbnNpb25zXG4gICAgICovXG4gICAgaXNWaXNpYmxlKGZpbGVFeHRlbnNpb24pOiBib29sZWFuIHtcbiAgICAgICAgbGV0IHN1cHBvcnRlZEV4dGVuc2lvbjogc3RyaW5nO1xuXG4gICAgICAgIGlmICh0aGlzLnN1cHBvcnRlZEV4dGVuc2lvbnMgJiYgKHRoaXMuc3VwcG9ydGVkRXh0ZW5zaW9ucyBpbnN0YW5jZW9mIEFycmF5KSkge1xuICAgICAgICAgICAgc3VwcG9ydGVkRXh0ZW5zaW9uID0gdGhpcy5zdXBwb3J0ZWRFeHRlbnNpb25zLmZpbmQoKGV4dGVuc2lvbikgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBleHRlbnNpb24udG9Mb3dlckNhc2UoKSA9PT0gZmlsZUV4dGVuc2lvbjtcblxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gISFzdXBwb3J0ZWRFeHRlbnNpb247XG4gICAgfVxuXG59XG4iXX0=
