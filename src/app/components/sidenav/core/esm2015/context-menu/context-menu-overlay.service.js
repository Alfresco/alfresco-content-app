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
import { Injectable, Injector, ElementRef } from '@angular/core';
import { Overlay, OverlayConfig } from '@angular/cdk/overlay';
import { PortalInjector, ComponentPortal } from '@angular/cdk/portal';
import { ContextMenuOverlayRef } from './context-menu-overlay';
import { CONTEXT_MENU_DATA } from './context-menu.tokens';
import { ContextMenuListComponent } from './context-menu-list.component';
import * as i0 from '@angular/core';
import * as i1 from '@angular/cdk/overlay';
/** @type {?} */
const DEFAULT_CONFIG = {
  panelClass: 'cdk-overlay-pane',
  backdropClass: 'cdk-overlay-transparent-backdrop',
  hasBackdrop: true
};
export class ContextMenuOverlayService {
  /**
   * @param {?} injector
   * @param {?} overlay
   */
  constructor(injector, overlay) {
    this.injector = injector;
    this.overlay = overlay;
  }
  /**
   * @param {?} config
   * @return {?}
   */
  open(config) {
    /** @type {?} */
    const overlayConfig = Object.assign({}, DEFAULT_CONFIG, config);
    /** @type {?} */
    const overlay = this.createOverlay(overlayConfig);
    /** @type {?} */
    const overlayRef = new ContextMenuOverlayRef(overlay);
    this.attachDialogContainer(overlay, config, overlayRef);
    overlay.backdropClick().subscribe(
      /**
       * @return {?}
       */
      () => overlayRef.close()
    );
    // prevent native contextmenu on overlay element if config.hasBackdrop is true
    if (overlayConfig.hasBackdrop) {
      /** @type {?} */ (overlay)._backdropElement.addEventListener(
        'contextmenu'
        /**
         * @param {?} event
         * @return {?}
         */,
        event => {
          event.preventDefault();
          /** @type {?} */ (overlay)._backdropClick.next(null);
        },
        true
      );
    }
    return overlayRef;
  }
  /**
   * @private
   * @param {?} config
   * @return {?}
   */
  createOverlay(config) {
    /** @type {?} */
    const overlayConfig = this.getOverlayConfig(config);
    return this.overlay.create(overlayConfig);
  }
  /**
   * @private
   * @param {?} overlay
   * @param {?} config
   * @param {?} contextMenuOverlayRef
   * @return {?}
   */
  attachDialogContainer(overlay, config, contextMenuOverlayRef) {
    /** @type {?} */
    const injector = this.createInjector(config, contextMenuOverlayRef);
    /** @type {?} */
    const containerPortal = new ComponentPortal(
      ContextMenuListComponent,
      null,
      injector
    );
    /** @type {?} */
    const containerRef = overlay.attach(containerPortal);
    return containerRef.instance;
  }
  /**
   * @private
   * @param {?} config
   * @param {?} contextMenuOverlayRef
   * @return {?}
   */
  createInjector(config, contextMenuOverlayRef) {
    /** @type {?} */
    const injectionTokens = new WeakMap();
    injectionTokens.set(ContextMenuOverlayRef, contextMenuOverlayRef);
    injectionTokens.set(CONTEXT_MENU_DATA, config.data);
    return new PortalInjector(this.injector, injectionTokens);
  }
  /**
   * @private
   * @param {?} config
   * @return {?}
   */
  getOverlayConfig(config) {
    const { clientY, clientX } = config.source;
    /** @type {?} */
    const fakeElement = {
      /**
       * @return {?}
       */
      getBoundingClientRect: (() => ({
        bottom: clientY,
        height: 0,
        left: clientX,
        right: clientX,
        top: clientY,
        width: 0
      }))
    };
    /** @type {?} */
    const positionStrategy = this.overlay
      .position()
      .connectedTo(
        new ElementRef(fakeElement),
        { originX: 'start', originY: 'bottom' },
        { overlayX: 'start', overlayY: 'top' }
      )
      .withFallbackPosition(
        { originX: 'start', originY: 'top' },
        { overlayX: 'start', overlayY: 'bottom' }
      )
      .withFallbackPosition(
        { originX: 'end', originY: 'top' },
        { overlayX: 'start', overlayY: 'top' }
      )
      .withFallbackPosition(
        { originX: 'start', originY: 'top' },
        { overlayX: 'end', overlayY: 'top' }
      )
      .withFallbackPosition(
        { originX: 'end', originY: 'center' },
        { overlayX: 'start', overlayY: 'center' }
      )
      .withFallbackPosition(
        { originX: 'start', originY: 'center' },
        { overlayX: 'end', overlayY: 'center' }
      );
    /** @type {?} */
    const overlayConfig = new OverlayConfig({
      hasBackdrop: config.hasBackdrop,
      backdropClass: config.backdropClass,
      panelClass: config.panelClass,
      scrollStrategy: this.overlay.scrollStrategies.close(),
      positionStrategy
    });
    return overlayConfig;
  }
}
ContextMenuOverlayService.decorators = [
  {
    type: Injectable,
    args: [
      {
        providedIn: 'root'
      }
    ]
  }
];
/** @nocollapse */
ContextMenuOverlayService.ctorParameters = () => [
  { type: Injector },
  { type: Overlay }
];
/** @nocollapse */ ContextMenuOverlayService.ngInjectableDef = i0.defineInjectable(
  {
    factory: function ContextMenuOverlayService_Factory() {
      return new ContextMenuOverlayService(
        i0.inject(i0.INJECTOR),
        i0.inject(i1.Overlay)
      );
    },
    token: ContextMenuOverlayService,
    providedIn: 'root'
  }
);
if (false) {
  /**
   * @type {?}
   * @private
   */
  ContextMenuOverlayService.prototype.injector;
  /**
   * @type {?}
   * @private
   */
  ContextMenuOverlayService.prototype.overlay;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGV4dC1tZW51LW92ZXJsYXkuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BhbGZyZXNjby9hZGYtY29yZS8iLCJzb3VyY2VzIjpbImNvbnRleHQtbWVudS9jb250ZXh0LW1lbnUtb3ZlcmxheS5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBaUJBLE9BQU8sRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLFVBQVUsRUFBZ0IsTUFBTSxlQUFlLENBQUM7QUFDL0UsT0FBTyxFQUFFLE9BQU8sRUFBRSxhQUFhLEVBQWMsTUFBTSxzQkFBc0IsQ0FBQztBQUMxRSxPQUFPLEVBQUUsY0FBYyxFQUFFLGVBQWUsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQ3RFLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBRS9ELE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBQzFELE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxNQUFNLCtCQUErQixDQUFDOzs7O01BRW5FLGNBQWMsR0FBNkI7SUFDN0MsVUFBVSxFQUFFLGtCQUFrQjtJQUM5QixhQUFhLEVBQUUsa0NBQWtDO0lBQ2pELFdBQVcsRUFBRSxJQUFJO0NBQ3BCO0FBS0QsTUFBTSxPQUFPLHlCQUF5Qjs7Ozs7SUFFbEMsWUFDWSxRQUFrQixFQUNsQixPQUFnQjtRQURoQixhQUFRLEdBQVIsUUFBUSxDQUFVO1FBQ2xCLFlBQU8sR0FBUCxPQUFPLENBQVM7SUFDekIsQ0FBQzs7Ozs7SUFFSixJQUFJLENBQUMsTUFBZ0M7O2NBQzNCLGFBQWEscUJBQVEsY0FBYyxFQUFLLE1BQU0sQ0FBRTs7Y0FFaEQsT0FBTyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDOztjQUUzQyxVQUFVLEdBQUcsSUFBSSxxQkFBcUIsQ0FBQyxPQUFPLENBQUM7UUFFckQsSUFBSSxDQUFDLHFCQUFxQixDQUFDLE9BQU8sRUFB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LEtBQUssRUFBRSxDQUFDO2FBQzFDLG9CQUFvQixDQUNqQixFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxFQUNwQyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxDQUFDO2FBQ3hDLG9CQUFvQixDQUNqQixFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxFQUNyQyxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxDQUFDO2FBQzdDLG9CQUFvQixDQUNqQixFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxFQUN2QyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxDQUMxQzs7Y0FFQyxhQUFhLEdBQUcsSUFBSSxhQUFhLENBQUM7WUFDcEMsV0FBVyxFQUFFLE1BQU0sQ0FBQyxXQUFXO1lBQy9CLGFBQWEsRUFBRSxNQUFNLENBQUMsYUFBYTtZQUNuQyxVQUFVLEVBQUUsTUFBTSxDQUFDLFVBQVU7WUFDN0IsY0FBYyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxFQUFFO1lBQ3JELGdCQUFnQjtTQUNuQixDQUFDO1FBRUYsT0FBTyxhQUFhLENBQUM7SUFDekIsQ0FBQzs7O1lBckdKLFVBQVUsU0FBQztnQkFDUixVQUFVLEVBQUUsTUFBTTthQUNyQjs7OztZQWhCb0IsUUFBUTtZQUNwQixPQUFPOzs7Ozs7OztJQW1CUiw2Q0FBMEI7Ozs7O0lBQzFCLDRDQUF3QiIsInNvdXJjZXNDb250ZW50IjpbIi8qIVxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE5IEFsZnJlc2NvIFNvZnR3YXJlLCBMdGQuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbmltcG9ydCB7IEluamVjdGFibGUsIEluamVjdG9yLCBFbGVtZW50UmVmLCBDb21wb25lbnRSZWYgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE92ZXJsYXksIE92ZXJsYXlDb25maWcsIE92ZXJsYXlSZWYgfSBmcm9tICdAYW5ndWxhci9jZGsvb3ZlcmxheSc7XG5pbXBvcnQgeyBQb3J0YWxJbmplY3RvciwgQ29tcG9uZW50UG9ydGFsIH0gZnJvbSAnQGFuZ3VsYXIvY2RrL3BvcnRhbCc7XG5pbXBvcnQgeyBDb250ZXh0TWVudU92ZXJsYXlSZWYgfSBmcm9tICcuL2NvbnRleHQtbWVudS1vdmVybGF5JztcbmltcG9ydCB7IENvbnRleHRNZW51T3ZlcmxheUNvbmZpZyB9IGZyb20gJy4vaW50ZXJmYWNlcyc7XG5pbXBvcnQgeyBDT05URVhUX01FTlVfREFUQSB9IGZyb20gJy4vY29udGV4dC1tZW51LnRva2Vucyc7XG5pbXBvcnQgeyBDb250ZXh0TWVudUxpc3RDb21wb25lbnQgfSBmcm9tICcuL2NvbnRleHQtbWVudS1saXN0LmNvbXBvbmVudCc7XG5cbmNvbnN0IERFRkFVTFRfQ09ORklHOiBDb250ZXh0TWVudU92ZXJsYXlDb25maWcgPSB7XG4gICAgcGFuZWxDbGFzczogJ2Nkay1vdmVybGF5LXBhbmUnLFxuICAgIGJhY2tkcm9wQ2xhc3M6ICdjZGstb3ZlcmxheS10cmFuc3BhcmVudC1iYWNrZHJvcCcsXG4gICAgaGFzQmFja2Ryb3A6IHRydWVcbn07XG5cbkBJbmplY3RhYmxlKHtcbiAgICBwcm92aWRlZEluOiAncm9vdCdcbn0pXG5leHBvcnQgY2xhc3MgQ29udGV4dE1lbnVPdmVybGF5U2VydmljZSB7XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHJpdmF0ZSBpbmplY3RvcjogSW5qZWN0b3IsXG4gICAgICAgIHByaXZhdGUgb3ZlcmxheTogT3ZlcmxheVxuICAgICkge31cblxuICAgIG9wZW4oY29uZmlnOiBDb250ZXh0TWVudU92ZXJsYXlDb25maWcpOiBDb250ZXh0TWVudU92ZXJsYXlSZWYge1xuICAgICAgICBjb25zdCBvdmVybGF5Q29uZmlnID0geyAuLi5ERUZBVUxUX0NPTkZJRywgLi4uY29uZmlnIH07XG5cbiAgICAgICAgY29uc3Qgb3ZlcmxheSA9IHRoaXMuY3JlYXRlT3ZlcmxheShvdmVybGF5Q29uZmlnKTtcblxuICAgICAgICBjb25zdCBvdmVybGF5UmVmID0gbmV3IENvbnRleHRNZW51T3ZlcmxheVJlZihvdmVybGF5KTtcblxuICAgICAgICB0aGlzLmF0dGFjaERpYWxvZ0NvbnRhaW5lcihvdmVybGF5LCBjb25maWcsIG92ZXJsYXlSZWYpO1xuXG4gICAgICAgIG92ZXJsYXkuYmFja2Ryb3BDbGljaygpLnN1YnNjcmliZSgoKSA9PiBvdmVybGF5UmVmLmNsb3NlKCkpO1xuXG4gICAgICAgIC8vIHByZXZlbnQgbmF0aXZlIGNvbnRleHRtZW51IG9uIG92ZXJsYXkgZWxlbWVudCBpZiBjb25maWcuaGFzQmFja2Ryb3AgaXMgdHJ1ZVxuICAgICAgICBpZiAob3ZlcmxheUNvbmZpZy5oYXNCYWNrZHJvcCkge1xuICAgICAgICAgICAgKDxhbnk+IG92ZXJsYXkpLl9iYWNrZHJvcEVsZW1lbnRcbiAgICAgICAgICAgICAgICAuYWRkRXZlbnRMaXN0ZW5lcignY29udGV4dG1lbnUnLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgKDxhbnk+IG92ZXJsYXkpLl9iYWNrZHJvcENsaWNrLm5leHQobnVsbCk7XG4gICAgICAgICAgICAgICAgfSwgdHJ1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gb3ZlcmxheVJlZjtcbiAgICB9XG5cbiAgICBwcml2YXRlIGNyZWF0ZU92ZXJsYXkoY29uZmlnOiBDb250ZXh0TWVudU92ZXJsYXlDb25maWcpOiBPdmVybGF5UmVmIHtcbiAgICAgICAgY29uc3Qgb3ZlcmxheUNvbmZpZyA9IHRoaXMuZ2V0T3ZlcmxheUNvbmZpZyhjb25maWcpO1xuICAgICAgICByZXR1cm4gdGhpcy5vdmVybGF5LmNyZWF0ZShvdmVybGF5Q29uZmlnKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGF0dGFjaERpYWxvZ0NvbnRhaW5lcihvdmVybGF5OiBPdmVybGF5UmVmLCBjb25maWc6IENvbnRleHRNZW51T3ZlcmxheUNvbmZpZywgY29udGV4dE1lbnVPdmVybGF5UmVmOiBDb250ZXh0TWVudU92ZXJsYXlSZWYpIHtcbiAgICAgICAgY29uc3QgaW5qZWN0b3IgPSB0aGlzLmNyZWF0ZUluamVjdG9yKGNvbmZpZywgY29udGV4dE1lbnVPdmVybGF5UmVmKTtcblxuICAgICAgICBjb25zdCBjb250YWluZXJQb3J0YWwgPSBuZXcgQ29tcG9uZW50UG9ydGFsKENvbnRleHRNZW51TGlzdENvbXBvbmVudCwgbnVsbCwgaW5qZWN0b3IpO1xuICAgICAgICBjb25zdCBjb250YWluZXJSZWY6IENvbXBvbmVudFJlZjxDb250ZXh0TWVudUxpc3RDb21wb25lbnQ+ID0gb3ZlcmxheS5hdHRhY2goY29udGFpbmVyUG9ydGFsKTtcblxuICAgICAgICByZXR1cm4gY29udGFpbmVyUmVmLmluc3RhbmNlO1xuICAgIH1cblxuICAgIHByaXZhdGUgY3JlYXRlSW5qZWN0b3IoY29uZmlnOiBDb250ZXh0TWVudU92ZXJsYXlDb25maWcsIGNvbnRleHRNZW51T3ZlcmxheVJlZjogQ29udGV4dE1lbnVPdmVybGF5UmVmKTogUG9ydGFsSW5qZWN0b3Ige1xuICAgICAgICBjb25zdCBpbmplY3Rpb25Ub2tlbnMgPSBuZXcgV2Vha01hcCgpO1xuXG4gICAgICAgIGluamVjdGlvblRva2Vucy5zZXQoQ29udGV4dE1lbnVPdmVybGF5UmVmLCBjb250ZXh0TWVudU92ZXJsYXlSZWYpO1xuICAgICAgICBpbmplY3Rpb25Ub2tlbnMuc2V0KENPTlRFWFRfTUVOVV9EQVRBLCBjb25maWcuZGF0YSk7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBQb3J0YWxJbmplY3Rvcih0aGlzLmluamVjdG9yLCBpbmplY3Rpb25Ub2tlbnMpO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0T3ZlcmxheUNvbmZpZyhjb25maWc6IENvbnRleHRNZW51T3ZlcmxheUNvbmZpZyk6IE92ZXJsYXlDb25maWcge1xuICAgICAgICBjb25zdCB7IGNsaWVudFksIGNsaWVudFggIH0gPSBjb25maWcuc291cmNlO1xuXG4gICAgICAgIGNvbnN0IGZha2VFbGVtZW50OiBhbnkgPSB7XG4gICAgICAgICAgICBnZXRCb3VuZGluZ0NsaWVudFJlY3Q6ICgpOiBDbGllbnRSZWN0ID0+ICh7XG4gICAgICAgICAgICAgICAgYm90dG9tOiBjbGllbnRZLFxuICAgICAgICAgICAgICAgIGhlaWdodDogMCxcbiAgICAgICAgICAgICAgICBsZWZ0OiBjbGllbnRYLFxuICAgICAgICAgICAgICAgIHJpZ2h0OiBjbGllbnRYLFxuICAgICAgICAgICAgICAgIHRvcDogY2xpZW50WSxcbiAgICAgICAgICAgICAgICB3aWR0aDogMFxuICAgICAgICAgICAgfSlcbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCBwb3NpdGlvblN0cmF0ZWd5ID0gdGhpcy5vdmVybGF5LnBvc2l0aW9uKClcbiAgICAgICAgICAgIC5jb25uZWN0ZWRUbyhcbiAgICAgICAgICAgICAgICBuZXcgRWxlbWVudFJlZihmYWtlRWxlbWVudCksXG4gICAgICAgICAgICAgICAgeyBvcmlnaW5YOiAnc3RhcnQnLCBvcmlnaW5ZOiAnYm90dG9tJyB9LFxuICAgICAgICAgICAgICAgIHsgb3ZlcmxheVg6ICdzdGFydCcsIG92ZXJsYXlZOiAndG9wJyB9KVxuICAgICAgICAgICAgLndpdGhGYWxsYmFja1Bvc2l0aW9uKFxuICAgICAgICAgICAgICAgIHsgb3JpZ2luWDogJ3N0YXJ0Jywgb3JpZ2luWTogJ3RvcCcgfSxcbiAgICAgICAgICAgICAgICB7IG92ZXJsYXlYOiAnc3RhcnQnLCBvdmVybGF5WTogJ2JvdHRvbScgfSlcbiAgICAgICAgICAgIC53aXRoRmFsbGJhY2tQb3NpdGlvbihcbiAgICAgICAgICAgICAgICB7IG9yaWdpblg6ICdlbmQnLCBvcmlnaW5ZOiAndG9wJyB9LFxuICAgICAgICAgICAgICAgIHsgb3ZlcmxheVg6ICdzdGFydCcsIG92ZXJsYXlZOiAndG9wJyB9KVxuICAgICAgICAgICAgLndpdGhGYWxsYmFja1Bvc2l0aW9uKFxuICAgICAgICAgICAgICAgIHsgb3JpZ2luWDogJ3N0YXJ0Jywgb3JpZ2luWTogJ3RvcCcgfSxcbiAgICAgICAgICAgICAgICB7IG92ZXJsYXlYOiAnZW5kJywgb3ZlcmxheVk6ICd0b3AnIH0pXG4gICAgICAgICAgICAud2l0aEZhbGxiYWNrUG9zaXRpb24oXG4gICAgICAgICAgICAgICAgeyBvcmlnaW5YOiAnZW5kJywgb3JpZ2luWTogJ2NlbnRlcicgfSxcbiAgICAgICAgICAgICAgICB7IG92ZXJsYXlYOiAnc3RhcnQnLCBvdmVybGF5WTogJ2NlbnRlcicgfSlcbiAgICAgICAgICAgIC53aXRoRmFsbGJhY2tQb3NpdGlvbihcbiAgICAgICAgICAgICAgICB7IG9yaWdpblg6ICdzdGFydCcsIG9yaWdpblk6ICdjZW50ZXInIH0sXG4gICAgICAgICAgICAgICAgeyBvdmVybGF5WDogJ2VuZCcsIG92ZXJsYXlZOiAnY2VudGVyJyB9XG4gICAgICAgICAgICApO1xuXG4gICAgICAgIGNvbnN0IG92ZXJsYXlDb25maWcgPSBuZXcgT3ZlcmxheUNvbmZpZyh7XG4gICAgICAgICAgICBoYXNCYWNrZHJvcDogY29uZmlnLmhhc0JhY2tkcm9wLFxuICAgICAgICAgICAgYmFja2Ryb3BDbGFzczogY29uZmlnLmJhY2tkcm9wQ2xhc3MsXG4gICAgICAgICAgICBwYW5lbENsYXNzOiBjb25maWcucGFuZWxDbGFzcyxcbiAgICAgICAgICAgIHNjcm9sbFN0cmF0ZWd5OiB0aGlzLm92ZXJsYXkuc2Nyb2xsU3RyYXRlZ2llcy5jbG9zZSgpLFxuICAgICAgICAgICAgcG9zaXRpb25TdHJhdGVneVxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gb3ZlcmxheUNvbmZpZztcbiAgICB9XG59XG4iXX0=
