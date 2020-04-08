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
import {
  Component,
  ViewEncapsulation,
  ElementRef,
  Input,
  HostBinding,
  HostListener,
  Output,
  EventEmitter
} from '@angular/core';
export class DataTableRowComponent {
  /**
   * @param {?} element
   */
  constructor(element) {
    this.element = element;
    this.disabled = false;
    this.select = new EventEmitter();
  }
  /**
   * @return {?}
   */
  get isSelected() {
    if (!this.row) {
      return false;
    }
    return this.row.isSelected;
  }
  /**
   * @return {?}
   */
  get isAriaSelected() {
    if (!this.row) {
      return false;
    }
    return this.row.isSelected;
  }
  /**
   * @return {?}
   */
  get ariaLabel() {
    if (!this.row) {
      return null;
    }
    if (this.row.isSelected) {
      return this.row.getValue('name') + ' selected' || '';
    } else {
      return this.row.getValue('name') || '';
    }
  }
  /**
   * @return {?}
   */
  get tabindex() {
    return this.disabled ? null : 0;
  }
  /**
   * @param {?} event
   * @return {?}
   */
  onKeyDown(event) {
    if (
      /** @type {?} */ (event.target).tagName ===
      this.element.nativeElement.tagName
    ) {
      event.preventDefault();
      this.select.emit(event);
    }
  }
  /**
   * @return {?}
   */
  focus() {
    this.element.nativeElement.focus();
  }
}
DataTableRowComponent.decorators = [
  {
    type: Component,
    args: [
      {
        selector: 'adf-datatable-row',
        template: `<ng-content></ng-content>`,
        encapsulation: ViewEncapsulation.None,
        host: {
          class: 'adf-datatable-row',
          tabindex: '0',
          role: 'row'
        }
      }
    ]
  }
];
/** @nocollapse */
DataTableRowComponent.ctorParameters = () => [{ type: ElementRef }];
DataTableRowComponent.propDecorators = {
  row: [{ type: Input }],
  disabled: [{ type: Input }],
  select: [{ type: Output }],
  isSelected: [{ type: HostBinding, args: ['class.adf-is-selected'] }],
  isAriaSelected: [{ type: HostBinding, args: ['attr.aria-selected'] }],
  ariaLabel: [{ type: HostBinding, args: ['attr.aria-label'] }],
  tabindex: [{ type: HostBinding, args: ['attr.tabindex'] }],
  onKeyDown: [{ type: HostListener, args: ['keydown.space', ['$event']] }]
};
if (false) {
  /** @type {?} */
  DataTableRowComponent.prototype.row;
  /** @type {?} */
  DataTableRowComponent.prototype.disabled;
  /** @type {?} */
  DataTableRowComponent.prototype.select;
  /**
   * @type {?}
   * @private
   */
  DataTableRowComponent.prototype.element;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YXRhYmxlLXJvdy5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AYWxmcmVzY28vYWRmLWNvcmUvIiwic291cmNlcyI6WyJkYXRhdGFibGUvY29tcG9uZW50cy9kYXRhdGFibGUvZGF0YXRhYmxlLXJvdy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFpQkEsT0FBTyxFQUNILFNBQVMsRUFDVCxpQkFBaUIsRUFDakIsVUFBVSxFQUNWLEtBQUssRUFDTCxXQUFXLEVBQ1gsWUFBWSxFQUNaLE1BQU0sRUFDTixZQUFZLEVBQ2YsTUFBTSxlQUFlLENBQUM7QUFjdkIsTUFBTSxPQUFPLHFCQUFxQjs7OztJQWlEOUIsWUFBb0IsT0FBbUI7UUFBbkIsWUFBTyxHQUFQLE9BQU8sQ0FBWTtRQTlDOUIsYUFBUSxHQUFHLEtBQUssQ0FBQztRQUcxQixXQUFNLEdBQXNCLElBQUksWUFBWSxFQUFPLENBQUM7SUEyQ1YsQ0FBQzs7OztJQXpDM0MsSUFDSSxVQUFVO1FBQ1YsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUU7WUFDWCxPQUFPLEtBQUssQ0FBQztTQUNoQjtRQUNELE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUM7SUFDL0IsQ0FBQzs7OztJQUVELElBQ0ksY0FBYztRQUNkLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFO1lBQ1osT0FBTyxLQUFLLENBQUM7U0FDZjtRQUNELE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUM7SUFDL0IsQ0FBQzs7OztJQUVELElBQ0ksU0FBUztRQUNULElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFO1lBQ1gsT0FBTyxJQUFJLENBQUM7U0FDZjtRQUNELElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLEVBQUU7WUFDckIsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsR0FBRyxXQUFXLElBQUksRUFBRSxDQUFDO1NBQ3hEO2FBQU07WUFDSCxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQztTQUMxQztJQUNMLENBQUM7Ozs7SUFFRCxJQUNJLFFBQVE7UUFDUixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3BDLENBQUM7Ozs7O0lBR0QsU0FBUyxDQUFDLEtBQW9CO1FBQzFCLElBQUksQ0FBQyxtQkFBQSxLQUFLLENBQUMsTUFBTSxFQUFXLENBQUMsQ0FBQyxPQUFPLEtBQUssSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFO1lBQzFFLEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQztZQUN2QixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUMzQjtJQUNMLENBQUM7Ozs7SUFJRCxLQUFLO1FBQ0QsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDdkMsQ0FBQzs7O1lBL0RKLFNBQVMsU0FBQztnQkFDUCxRQUFRLEVBQUUsbUJBQW1CO2dCQUM3QixRQUFRLEVBQUUsMkJBQTJCO2dCQUNyQyxhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTtnQkFDckMsSUFBSSxFQUFFO29CQUNGLEtBQUssRUFBRSxtQkFBbUI7b0JBQzFCLFFBQVEsRUFBRSxHQUFHO29CQUNiLElBQUksRUFBRSxLQUFLO2lCQUNkO2FBQ0o7Ozs7WUFuQkcsVUFBVTs7O2tCQXFCVCxLQUFLO3VCQUVMLEtBQUs7cUJBRUwsTUFBTTt5QkFHTixXQUFXLFNBQUMsdUJBQXVCOzZCQVFuQyxXQUFXLFNBQUMsb0JBQW9CO3dCQVFoQyxXQUFXLFNBQUMsaUJBQWlCO3VCQVk3QixXQUFXLFNBQUMsZUFBZTt3QkFLM0IsWUFBWSxTQUFDLGVBQWUsRUFBRSxDQUFDLFFBQVEsQ0FBQzs7OztJQXhDekMsb0NBQXNCOztJQUV0Qix5Q0FBMEI7O0lBRTFCLHVDQUNvRDs7Ozs7SUEyQ3hDLHdDQUEyQiIsInNvdXJjZXNDb250ZW50IjpbIi8qIVxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE5IEFsZnJlc2NvIFNvZnR3YXJlLCBMdGQuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbmltcG9ydCB7XG4gICAgQ29tcG9uZW50LFxuICAgIFZpZXdFbmNhcHN1bGF0aW9uLFxuICAgIEVsZW1lbnRSZWYsXG4gICAgSW5wdXQsXG4gICAgSG9zdEJpbmRpbmcsXG4gICAgSG9zdExpc3RlbmVyLFxuICAgIE91dHB1dCxcbiAgICBFdmVudEVtaXR0ZXJcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBGb2N1c2FibGVPcHRpb24gfSBmcm9tICdAYW5ndWxhci9jZGsvYTExeSc7XG5pbXBvcnQgeyBEYXRhUm93IH0gZnJvbSAnLi4vLi4vZGF0YS9kYXRhLXJvdy5tb2RlbCc7XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAnYWRmLWRhdGF0YWJsZS1yb3cnLFxuICAgIHRlbXBsYXRlOiBgPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PmAsXG4gICAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgICBob3N0OiB7XG4gICAgICAgIGNsYXNzOiAnYWRmLWRhdGF0YWJsZS1yb3cnLFxuICAgICAgICB0YWJpbmRleDogJzAnLFxuICAgICAgICByb2xlOiAncm93J1xuICAgIH1cbn0pXG5leHBvcnQgY2xhc3MgRGF0YVRhYmxlUm93Q29tcG9uZW50IGltcGxlbWVudHMgRm9jdXNhYmxlT3B0aW9uIHtcbiAgICBASW5wdXQoKSByb3c6IERhdGFSb3c7XG5cbiAgICBASW5wdXQoKSBkaXNhYmxlZCA9IGZhbHNlO1xuXG4gICAgQE91dHB1dCgpXG4gICAgc2VsZWN0OiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuXG4gICAgQEhvc3RCaW5kaW5nKCdjbGFzcy5hZGYtaXMtc2VsZWN0ZWQnKVxuICAgIGdldCBpc1NlbGVjdGVkKCk6IGJvb2xlYW4ge1xuICAgICAgICBpZiAoIXRoaXMucm93KSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMucm93LmlzU2VsZWN0ZWQ7XG4gICAgfVxuXG4gICAgQEhvc3RCaW5kaW5nKCdhdHRyLmFyaWEtc2VsZWN0ZWQnKVxuICAgIGdldCBpc0FyaWFTZWxlY3RlZCgpOiBib29sZWFuIHtcbiAgICAgICAgaWYgKCF0aGlzLnJvdykge1xuICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMucm93LmlzU2VsZWN0ZWQ7XG4gICAgfVxuXG4gICAgQEhvc3RCaW5kaW5nKCdhdHRyLmFyaWEtbGFiZWwnKVxuICAgIGdldCBhcmlhTGFiZWwoKTogc3RyaW5nfG51bGwge1xuICAgICAgICBpZiAoIXRoaXMucm93KSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5yb3cuaXNTZWxlY3RlZCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucm93LmdldFZhbHVlKCduYW1lJykgKyAnIHNlbGVjdGVkJyB8fCAnJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJvdy5nZXRWYWx1ZSgnbmFtZScpIHx8ICcnO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgQEhvc3RCaW5kaW5nKCdhdHRyLnRhYmluZGV4JylcbiAgICBnZXQgdGFiaW5kZXgoKTogbnVtYmVyfG51bGwge1xuICAgICAgICByZXR1cm4gdGhpcy5kaXNhYmxlZCA/IG51bGwgOiAwO1xuICAgIH1cblxuICAgIEBIb3N0TGlzdGVuZXIoJ2tleWRvd24uc3BhY2UnLCBbJyRldmVudCddKVxuICAgIG9uS2V5RG93bihldmVudDogS2V5Ym9hcmRFdmVudCkge1xuICAgICAgICBpZiAoKGV2ZW50LnRhcmdldCBhcyBFbGVtZW50KS50YWdOYW1lID09PSB0aGlzLmVsZW1lbnQubmF0aXZlRWxlbWVudC50YWdOYW1lKSB7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgdGhpcy5zZWxlY3QuZW1pdChldmVudCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGVsZW1lbnQ6IEVsZW1lbnRSZWYpIHt9XG5cbiAgICBmb2N1cygpIHtcbiAgICAgICAgdGhpcy5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcbiAgICB9XG59XG4iXX0=
