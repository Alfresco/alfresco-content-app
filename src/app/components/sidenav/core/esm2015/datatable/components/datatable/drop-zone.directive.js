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
import { Directive, Input, ElementRef, NgZone } from '@angular/core';
export class DropZoneDirective {
  /**
   * @param {?} elementRef
   * @param {?} ngZone
   */
  constructor(elementRef, ngZone) {
    this.ngZone = ngZone;
    this.dropTarget = 'cell';
    this.element = elementRef.nativeElement;
  }
  /**
   * @return {?}
   */
  ngOnInit() {
    this.ngZone.runOutsideAngular(
      /**
       * @return {?}
       */
      () => {
        this.element.addEventListener('dragover', this.onDragOver.bind(this));
        this.element.addEventListener('drop', this.onDrop.bind(this));
      }
    );
  }
  /**
   * @return {?}
   */
  ngOnDestroy() {
    this.element.removeEventListener('dragover', this.onDragOver);
    this.element.removeEventListener('drop', this.onDrop);
  }
  /**
   * @param {?} event
   * @return {?}
   */
  onDragOver(event) {
    /** @type {?} */
    const domEvent = new CustomEvent(`${this.dropTarget}-dragover`, {
      detail: {
        target: this.dropTarget,
        event,
        column: this.dropColumn,
        row: this.dropRow
      },
      bubbles: true
    });
    this.element.dispatchEvent(domEvent);
    if (domEvent.defaultPrevented) {
      event.preventDefault();
      event.stopPropagation();
    }
  }
  /**
   * @param {?} event
   * @return {?}
   */
  onDrop(event) {
    /** @type {?} */
    const domEvent = new CustomEvent(`${this.dropTarget}-drop`, {
      detail: {
        target: this.dropTarget,
        event,
        column: this.dropColumn,
        row: this.dropRow
      },
      bubbles: true
    });
    this.element.dispatchEvent(domEvent);
    if (domEvent.defaultPrevented) {
      event.preventDefault();
      event.stopPropagation();
    }
  }
}
DropZoneDirective.decorators = [
  {
    type: Directive,
    args: [
      {
        selector: '[adf-drop-zone]'
      }
    ]
  }
];
/** @nocollapse */
DropZoneDirective.ctorParameters = () => [
  { type: ElementRef },
  { type: NgZone }
];
DropZoneDirective.propDecorators = {
  dropTarget: [{ type: Input }],
  dropRow: [{ type: Input }],
  dropColumn: [{ type: Input }]
};
if (false) {
  /**
   * @type {?}
   * @private
   */
  DropZoneDirective.prototype.element;
  /** @type {?} */
  DropZoneDirective.prototype.dropTarget;
  /** @type {?} */
  DropZoneDirective.prototype.dropRow;
  /** @type {?} */
  DropZoneDirective.prototype.dropColumn;
  /**
   * @type {?}
   * @private
   */
  DropZoneDirective.prototype.ngZone;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJvcC16b25lLmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BhbGZyZXNjby9hZGYtY29yZS8iLCJzb3VyY2VzIjpbImRhdGF0YWJsZS9jb21wb25lbnRzL2RhdGF0YWJsZS9kcm9wLXpvbmUuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBaUJBLE9BQU8sRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQXFCLE1BQU0sZUFBZSxDQUFDO0FBT3hGLE1BQU0sT0FBTyxpQkFBaUI7Ozs7O0lBWTFCLFlBQVksVUFBc0IsRUFBVSxNQUFjO1FBQWQsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQVIxRCxlQUFVLEdBQXNCLE1BQU0sQ0FBQztRQVNuQyxJQUFJLENBQUMsT0FBTyxHQUFHLFVBQVUsQ0FBQyxhQUFhLENBQUM7SUFDNUMsQ0FBQzs7OztJQUVELFFBQVE7UUFDSixJQUFJLENBQUMsTUFBTSxDQUFDLGlCQUFpQjs7O1FBQUMsR0FBRyxFQUFFO1lBQy9CLElBQUksQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDdEUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUNsRSxDQUFDLEVBQUMsQ0FBQztJQUNQLENBQUM7Ozs7SUFFRCxXQUFXO1FBQ1AsSUFBSSxDQUFDLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQzlELElBQUksQ0FBQyxPQUFPLENBQUMsbUJBQW1CLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUMxRCxDQUFDOzs7OztJQUVELFVBQVUsQ0FBQyxLQUFZOztjQUNiLFFBQVEsR0FBRyxJQUFJLFdBQVcsQ0FBQyxHQUFHLElBQUksQ0FBQyxVQUFVLFdBQVcsRUFBRTtZQUM1RCxNQUFNLEVBQUU7Z0JBQ0osTUFBTSxFQUFFLElBQUksQ0FBQyxVQUFVO2dCQUN2QixLQUFLO2dCQUNMLE1BQU0sRUFBRSxJQUFJLENBQUMsVUFBVTtnQkFDdkIsR0FBRyxFQUFFLElBQUksQ0FBQyxPQUFPO2FBQ3BCO1lBQ0QsT0FBTyxFQUFFLElBQUk7U0FDaEIsQ0FBQztRQUVGLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBRXJDLElBQUksUUFBUSxDQUFDLGdCQUFnQixFQUFFO1lBQzNCLEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQztZQUN2QixLQUFLLENBQUMsZUFBZSxFQUFFLENBQUM7U0FDM0I7SUFDTCxDQUFDOzs7OztJQUVELE1BQU0sQ0FBQyxLQUFZOztjQUNULFFBQVEsR0FBRyxJQUFJLFdBQVcsQ0FBQyxHQUFHLElBQUksQ0FBQyxVQUFVLE9BQU8sRUFBRTtZQUN4RCxNQUFNLEVBQUU7Z0JBQ0osTUFBTSxFQUFFLElBQUksQ0FBQyxVQUFVO2dCQUN2QixLQUFLO2dCQUNMLE1BQU0sRUFBRSxJQUFJLENBQUMsVUFBVTtnQkFDdkIsR0FBRyxFQUFFLElBQUksQ0FBQyxPQUFPO2FBQ3BCO1lBQ0QsT0FBTyxFQUFFLElBQUk7U0FDaEIsQ0FBQztRQUVGLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBRXJDLElBQUksUUFBUSxDQUFDLGdCQUFnQixFQUFFO1lBQzNCLEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQztZQUN2QixLQUFLLENBQUMsZUFBZSxFQUFFLENBQUM7U0FDM0I7SUFDTCxDQUFDOzs7WUFuRUosU0FBUyxTQUFDO2dCQUNQLFFBQVEsRUFBRSxpQkFBaUI7YUFDOUI7Ozs7WUFOMEIsVUFBVTtZQUFFLE1BQU07Ozt5QkFVeEMsS0FBSztzQkFHTCxLQUFLO3lCQUdMLEtBQUs7Ozs7Ozs7SUFSTixvQ0FBNkI7O0lBRTdCLHVDQUN1Qzs7SUFFdkMsb0NBQ2lCOztJQUVqQix1Q0FDdUI7Ozs7O0lBRWEsbUNBQXNCIiwic291cmNlc0NvbnRlbnQiOlsiLyohXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTkgQWxmcmVzY28gU29mdHdhcmUsIEx0ZC5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0IHsgRGlyZWN0aXZlLCBJbnB1dCwgRWxlbWVudFJlZiwgTmdab25lLCBPbkluaXQsIE9uRGVzdHJveSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRGF0YVJvdyB9IGZyb20gJy4uLy4uL2RhdGEvZGF0YS1yb3cubW9kZWwnO1xuaW1wb3J0IHsgRGF0YUNvbHVtbiB9IGZyb20gJy4uLy4uL2RhdGEvZGF0YS1jb2x1bW4ubW9kZWwnO1xuXG5ARGlyZWN0aXZlKHtcbiAgICBzZWxlY3RvcjogJ1thZGYtZHJvcC16b25lXSdcbn0pXG5leHBvcnQgY2xhc3MgRHJvcFpvbmVEaXJlY3RpdmUgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSB7XG4gICAgcHJpdmF0ZSBlbGVtZW50OiBIVE1MRWxlbWVudDtcblxuICAgIEBJbnB1dCgpXG4gICAgZHJvcFRhcmdldDogJ2hlYWRlcicgfCAnY2VsbCcgPSAnY2VsbCc7XG5cbiAgICBASW5wdXQoKVxuICAgIGRyb3BSb3c6IERhdGFSb3c7XG5cbiAgICBASW5wdXQoKVxuICAgIGRyb3BDb2x1bW46IERhdGFDb2x1bW47XG5cbiAgICBjb25zdHJ1Y3RvcihlbGVtZW50UmVmOiBFbGVtZW50UmVmLCBwcml2YXRlIG5nWm9uZTogTmdab25lKSB7XG4gICAgICAgIHRoaXMuZWxlbWVudCA9IGVsZW1lbnRSZWYubmF0aXZlRWxlbWVudDtcbiAgICB9XG5cbiAgICBuZ09uSW5pdCgpIHtcbiAgICAgICAgdGhpcy5uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdvdmVyJywgdGhpcy5vbkRyYWdPdmVyLmJpbmQodGhpcykpO1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2Ryb3AnLCB0aGlzLm9uRHJvcC5iaW5kKHRoaXMpKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgbmdPbkRlc3Ryb3koKSB7XG4gICAgICAgIHRoaXMuZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdkcmFnb3ZlcicsIHRoaXMub25EcmFnT3Zlcik7XG4gICAgICAgIHRoaXMuZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdkcm9wJywgdGhpcy5vbkRyb3ApO1xuICAgIH1cblxuICAgIG9uRHJhZ092ZXIoZXZlbnQ6IEV2ZW50KSB7XG4gICAgICAgIGNvbnN0IGRvbUV2ZW50ID0gbmV3IEN1c3RvbUV2ZW50KGAke3RoaXMuZHJvcFRhcmdldH0tZHJhZ292ZXJgLCB7XG4gICAgICAgICAgICBkZXRhaWw6IHtcbiAgICAgICAgICAgICAgICB0YXJnZXQ6IHRoaXMuZHJvcFRhcmdldCxcbiAgICAgICAgICAgICAgICBldmVudCxcbiAgICAgICAgICAgICAgICBjb2x1bW46IHRoaXMuZHJvcENvbHVtbixcbiAgICAgICAgICAgICAgICByb3c6IHRoaXMuZHJvcFJvd1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGJ1YmJsZXM6IHRydWVcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5lbGVtZW50LmRpc3BhdGNoRXZlbnQoZG9tRXZlbnQpO1xuXG4gICAgICAgIGlmIChkb21FdmVudC5kZWZhdWx0UHJldmVudGVkKSB7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvbkRyb3AoZXZlbnQ6IEV2ZW50KSB7XG4gICAgICAgIGNvbnN0IGRvbUV2ZW50ID0gbmV3IEN1c3RvbUV2ZW50KGAke3RoaXMuZHJvcFRhcmdldH0tZHJvcGAsIHtcbiAgICAgICAgICAgIGRldGFpbDoge1xuICAgICAgICAgICAgICAgIHRhcmdldDogdGhpcy5kcm9wVGFyZ2V0LFxuICAgICAgICAgICAgICAgIGV2ZW50LFxuICAgICAgICAgICAgICAgIGNvbHVtbjogdGhpcy5kcm9wQ29sdW1uLFxuICAgICAgICAgICAgICAgIHJvdzogdGhpcy5kcm9wUm93XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYnViYmxlczogdHJ1ZVxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLmVsZW1lbnQuZGlzcGF0Y2hFdmVudChkb21FdmVudCk7XG5cbiAgICAgICAgaWYgKGRvbUV2ZW50LmRlZmF1bHRQcmV2ZW50ZWQpIHtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiJdfQ==
