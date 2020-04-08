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
  Directive,
  Input,
  HostListener,
  Component,
  ViewContainerRef,
  ComponentFactoryResolver,
  ViewEncapsulation
} from '@angular/core';
import { ClipboardService } from './clipboard.service';
export class ClipboardDirective {
  /**
   * @param {?} clipboardService
   * @param {?} viewContainerRef
   * @param {?} resolver
   */
  constructor(clipboardService, viewContainerRef, resolver) {
    this.clipboardService = clipboardService;
    this.viewContainerRef = viewContainerRef;
    this.resolver = resolver;
  }
  /**
   * @param {?} event
   * @return {?}
   */
  handleClickEvent(event) {
    event.preventDefault();
    event.stopPropagation();
    this.copyToClipboard();
  }
  /**
   * @return {?}
   */
  showTooltip() {
    if (this.placeholder) {
      /** @type {?} */
      const componentFactory = this.resolver.resolveComponentFactory(
        ClipboardComponent
      );
      /** @type {?} */
      const componentRef = this.viewContainerRef.createComponent(
        componentFactory
      ).instance;
      componentRef.placeholder = this.placeholder;
    }
  }
  /**
   * @return {?}
   */
  closeTooltip() {
    this.viewContainerRef.remove();
  }
  /**
   * @private
   * @return {?}
   */
  copyToClipboard() {
    /** @type {?} */
    const isValidTarget = this.clipboardService.isTargetValid(this.target);
    if (isValidTarget) {
      this.clipboardService.copyToClipboard(this.target, this.message);
    } else {
      this.copyContentToClipboard(
        this.viewContainerRef.element.nativeElement.innerHTML
      );
    }
  }
  /**
   * @private
   * @param {?} content
   * @return {?}
   */
  copyContentToClipboard(content) {
    this.clipboardService.copyContentToClipboard(content, this.message);
  }
}
ClipboardDirective.decorators = [
  {
    type: Directive,
    args: [
      {
        selector: '[adf-clipboard]',
        exportAs: 'adfClipboard'
      }
    ]
  }
];
/** @nocollapse */
ClipboardDirective.ctorParameters = () => [
  { type: ClipboardService },
  { type: ViewContainerRef },
  { type: ComponentFactoryResolver }
];
ClipboardDirective.propDecorators = {
  placeholder: [{ type: Input, args: ['adf-clipboard'] }],
  target: [{ type: Input }],
  message: [{ type: Input, args: ['clipboard-notification'] }],
  handleClickEvent: [{ type: HostListener, args: ['click', ['$event']] }],
  showTooltip: [{ type: HostListener, args: ['mouseenter'] }],
  closeTooltip: [{ type: HostListener, args: ['mouseleave'] }]
};
if (false) {
  /**
   * Translation key or message for the tooltip.
   * @type {?}
   */
  ClipboardDirective.prototype.placeholder;
  /**
   * Reference to the HTML element containing the text to copy.
   * @type {?}
   */
  ClipboardDirective.prototype.target;
  /**
   * Translation key or message for snackbar notification.
   * @type {?}
   */
  ClipboardDirective.prototype.message;
  /**
   * @type {?}
   * @private
   */
  ClipboardDirective.prototype.clipboardService;
  /** @type {?} */
  ClipboardDirective.prototype.viewContainerRef;
  /**
   * @type {?}
   * @private
   */
  ClipboardDirective.prototype.resolver;
}
export class ClipboardComponent {
  /**
   * @return {?}
   */
  ngOnInit() {
    this.placeholder = this.placeholder || 'CLIPBOARD.CLICK_TO_COPY';
  }
}
ClipboardComponent.decorators = [
  {
    type: Component,
    args: [
      {
        selector: 'adf-copy-content-tooltip',
        template: `
        <span class='adf-copy-tooltip'>{{ placeholder | translate }} </span>
        `,
        encapsulation: ViewEncapsulation.None,
        styles: ['']
      }
    ]
  }
];
if (false) {
  /** @type {?} */
  ClipboardComponent.prototype.placeholder;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpcGJvYXJkLmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BhbGZyZXNjby9hZGYtY29yZS8iLCJzb3VyY2VzIjpbImNsaXBib2FyZC9jbGlwYm9hcmQuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBaUJBLE9BQU8sRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLFlBQVksRUFBRSxTQUFTLEVBQUUsZ0JBQWdCLEVBQUUsd0JBQXdCLEVBQUUsaUJBQWlCLEVBQVUsTUFBTSxlQUFlLENBQUM7QUFDakosT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFNdkQsTUFBTSxPQUFPLGtCQUFrQjs7Ozs7O0lBYzNCLFlBQW9CLGdCQUFrQyxFQUNuQyxnQkFBa0MsRUFDakMsUUFBa0M7UUFGbEMscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFrQjtRQUNuQyxxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQWtCO1FBQ2pDLGFBQVEsR0FBUixRQUFRLENBQTBCO0lBQUcsQ0FBQzs7Ozs7SUFHMUQsZ0JBQWdCLENBQUMsS0FBaUI7UUFDOUIsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQ3ZCLEtBQUssQ0FBQyxlQUFlLEVBQUUsQ0FBQztRQUN4QixJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7SUFDM0IsQ0FBQzs7OztJQUdELFdBQVc7UUFDUCxJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUU7O2tCQUNaLGdCQUFnQixHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsdUJBQXVCLENBQUMsa0JBQWtCLENBQUM7O2tCQUM1RSxZQUFZLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLGVBQWUsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLFFBQVE7WUFDckYsWUFBWSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDO1NBQy9DO0lBQ0wsQ0FBQzs7OztJQUdELFlBQVk7UUFDUixJQUFJLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxFQUFFLENBQUM7SUFDbkMsQ0FBQzs7Ozs7SUFFTyxlQUFlOztjQUNiLGFBQWEsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7UUFFdEUsSUFBSSxhQUFhLEVBQUU7WUFDZixJQUFJLENBQUMsZ0JBQWdCLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQ3BFO2FBQU07WUFDSCxJQUFJLENBQUMsc0JBQXNCLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLENBQUM7U0FDdEY7SUFDTCxDQUFDOzs7Ozs7SUFFTyxzQkFBc0IsQ0FBQyxPQUFPO1FBQ2xDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxzQkFBc0IsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ3hFLENBQUM7OztZQXZESixTQUFTLFNBQUM7Z0JBQ1AsUUFBUSxFQUFFLGlCQUFpQjtnQkFDM0IsUUFBUSxFQUFFLGNBQWM7YUFDM0I7Ozs7WUFMUSxnQkFBZ0I7WUFEMkIsZ0JBQWdCO1lBQUUsd0JBQXdCOzs7MEJBVXpGLEtBQUssU0FBQyxlQUFlO3FCQUlyQixLQUFLO3NCQUtMLEtBQUssU0FBQyx3QkFBd0I7K0JBTTlCLFlBQVksU0FBQyxPQUFPLEVBQUUsQ0FBQyxRQUFRLENBQUM7MEJBT2hDLFlBQVksU0FBQyxZQUFZOzJCQVN6QixZQUFZLFNBQUMsWUFBWTs7Ozs7OztJQS9CMUIseUNBQ29COzs7OztJQUdwQixvQ0FDK0M7Ozs7O0lBSS9DLHFDQUFpRDs7Ozs7SUFFckMsOENBQTBDOztJQUMxQyw4Q0FBeUM7Ozs7O0lBQ3pDLHNDQUEwQzs7QUE4QzFELE1BQU0sT0FBTyxrQkFBa0I7Ozs7SUFHM0IsUUFBUTtRQUNKLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLFdBQVcsSUFBSSx5QkFBeUIsQ0FBQztJQUNyRSxDQUFDOzs7WUFiSixTQUFTLFNBQUM7Z0JBQ1AsUUFBUSxFQUFFLDBCQUEwQjtnQkFDcEMsUUFBUSxFQUFFOztTQUVMO2dCQUVMLGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJOzthQUN4Qzs7OztJQUVHLHlDQUFvQiIsInNvdXJjZXNDb250ZW50IjpbIi8qIVxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE5IEFsZnJlc2NvIFNvZnR3YXJlLCBMdGQuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbmltcG9ydCB7IERpcmVjdGl2ZSwgSW5wdXQsIEhvc3RMaXN0ZW5lciwgQ29tcG9uZW50LCBWaWV3Q29udGFpbmVyUmVmLCBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIsIFZpZXdFbmNhcHN1bGF0aW9uLCBPbkluaXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENsaXBib2FyZFNlcnZpY2UgfSBmcm9tICcuL2NsaXBib2FyZC5zZXJ2aWNlJztcblxuQERpcmVjdGl2ZSh7XG4gICAgc2VsZWN0b3I6ICdbYWRmLWNsaXBib2FyZF0nLFxuICAgIGV4cG9ydEFzOiAnYWRmQ2xpcGJvYXJkJ1xufSlcbmV4cG9ydCBjbGFzcyBDbGlwYm9hcmREaXJlY3RpdmUge1xuICAgIC8qKiBUcmFuc2xhdGlvbiBrZXkgb3IgbWVzc2FnZSBmb3IgdGhlIHRvb2x0aXAuICovXG4gICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLWlucHV0LXJlbmFtZVxuICAgIEBJbnB1dCgnYWRmLWNsaXBib2FyZCcpXG4gICAgcGxhY2Vob2xkZXI6IHN0cmluZztcblxuICAgIC8qKiBSZWZlcmVuY2UgdG8gdGhlIEhUTUwgZWxlbWVudCBjb250YWluaW5nIHRoZSB0ZXh0IHRvIGNvcHkuICovXG4gICAgQElucHV0KClcbiAgICB0YXJnZXQ6IEhUTUxJbnB1dEVsZW1lbnQgfCBIVE1MVGV4dEFyZWFFbGVtZW50O1xuXG4gICAgLyoqIFRyYW5zbGF0aW9uIGtleSBvciBtZXNzYWdlIGZvciBzbmFja2JhciBub3RpZmljYXRpb24uICovXG4gICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLWlucHV0LXJlbmFtZVxuICAgIEBJbnB1dCgnY2xpcGJvYXJkLW5vdGlmaWNhdGlvbicpIG1lc3NhZ2U6IHN0cmluZztcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgY2xpcGJvYXJkU2VydmljZTogQ2xpcGJvYXJkU2VydmljZSxcbiAgICAgICAgICAgICAgICBwdWJsaWMgdmlld0NvbnRhaW5lclJlZjogVmlld0NvbnRhaW5lclJlZixcbiAgICAgICAgICAgICAgICBwcml2YXRlIHJlc29sdmVyOiBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIpIHt9XG5cbiAgICBASG9zdExpc3RlbmVyKCdjbGljaycsIFsnJGV2ZW50J10pXG4gICAgaGFuZGxlQ2xpY2tFdmVudChldmVudDogTW91c2VFdmVudCkge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgdGhpcy5jb3B5VG9DbGlwYm9hcmQoKTtcbiAgICB9XG5cbiAgICBASG9zdExpc3RlbmVyKCdtb3VzZWVudGVyJylcbiAgICBzaG93VG9vbHRpcCgpIHtcbiAgICAgICAgaWYgKHRoaXMucGxhY2Vob2xkZXIpIHtcbiAgICAgICAgICAgIGNvbnN0IGNvbXBvbmVudEZhY3RvcnkgPSB0aGlzLnJlc29sdmVyLnJlc29sdmVDb21wb25lbnRGYWN0b3J5KENsaXBib2FyZENvbXBvbmVudCk7XG4gICAgICAgICAgICBjb25zdCBjb21wb25lbnRSZWYgPSB0aGlzLnZpZXdDb250YWluZXJSZWYuY3JlYXRlQ29tcG9uZW50KGNvbXBvbmVudEZhY3RvcnkpLmluc3RhbmNlO1xuICAgICAgICAgICAgY29tcG9uZW50UmVmLnBsYWNlaG9sZGVyID0gdGhpcy5wbGFjZWhvbGRlcjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIEBIb3N0TGlzdGVuZXIoJ21vdXNlbGVhdmUnKVxuICAgIGNsb3NlVG9vbHRpcCgpIHtcbiAgICAgICAgdGhpcy52aWV3Q29udGFpbmVyUmVmLnJlbW92ZSgpO1xuICAgIH1cblxuICAgIHByaXZhdGUgY29weVRvQ2xpcGJvYXJkKCkge1xuICAgICAgICBjb25zdCBpc1ZhbGlkVGFyZ2V0ID0gdGhpcy5jbGlwYm9hcmRTZXJ2aWNlLmlzVGFyZ2V0VmFsaWQodGhpcy50YXJnZXQpO1xuXG4gICAgICAgIGlmIChpc1ZhbGlkVGFyZ2V0KSB7XG4gICAgICAgICAgICB0aGlzLmNsaXBib2FyZFNlcnZpY2UuY29weVRvQ2xpcGJvYXJkKHRoaXMudGFyZ2V0LCB0aGlzLm1lc3NhZ2UpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5jb3B5Q29udGVudFRvQ2xpcGJvYXJkKHRoaXMudmlld0NvbnRhaW5lclJlZi5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQuaW5uZXJIVE1MKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgY29weUNvbnRlbnRUb0NsaXBib2FyZChjb250ZW50KSB7XG4gICAgICAgIHRoaXMuY2xpcGJvYXJkU2VydmljZS5jb3B5Q29udGVudFRvQ2xpcGJvYXJkKGNvbnRlbnQsIHRoaXMubWVzc2FnZSk7XG4gICAgfVxufVxuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ2FkZi1jb3B5LWNvbnRlbnQtdG9vbHRpcCcsXG4gICAgdGVtcGxhdGU6IGBcbiAgICAgICAgPHNwYW4gY2xhc3M9J2FkZi1jb3B5LXRvb2x0aXAnPnt7IHBsYWNlaG9sZGVyIHwgdHJhbnNsYXRlIH19IDwvc3Bhbj5cbiAgICAgICAgYCxcbiAgICBzdHlsZVVybHM6IFsnLi9jbGlwYm9hcmQuY29tcG9uZW50LnNjc3MnXSxcbiAgICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lXG59KVxuZXhwb3J0IGNsYXNzIENsaXBib2FyZENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG4gICAgcGxhY2Vob2xkZXI6IHN0cmluZztcblxuICAgIG5nT25Jbml0KCkge1xuICAgICAgICB0aGlzLnBsYWNlaG9sZGVyID0gdGhpcy5wbGFjZWhvbGRlciB8fCAnQ0xJUEJPQVJELkNMSUNLX1RPX0NPUFknO1xuICAgIH1cbn1cbiJdfQ==
