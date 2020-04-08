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
import { Component, Input, ViewEncapsulation, ElementRef } from '@angular/core';
import { ContentService } from '../../services/content.service';
import { AppConfigService } from './../../app-config/app-config.service';
import { DomSanitizer } from '@angular/platform-browser';
export class ImgViewerComponent {
  /**
   * @param {?} sanitizer
   * @param {?} appConfigService
   * @param {?} contentService
   * @param {?} el
   */
  constructor(sanitizer, appConfigService, contentService, el) {
    this.sanitizer = sanitizer;
    this.appConfigService = appConfigService;
    this.contentService = contentService;
    this.el = el;
    this.showToolbar = true;
    this.rotate = 0;
    this.scaleX = 1.0;
    this.scaleY = 1.0;
    this.offsetX = 0;
    this.offsetY = 0;
    this.step = 4;
    this.isDragged = false;
    this.drag = { x: 0, y: 0 };
    this.delta = { x: 0, y: 0 };
    this.initializeScaling();
  }
  /**
   * @return {?}
   */
  get transform() {
    return this.sanitizer.bypassSecurityTrustStyle(
      `scale(${this.scaleX}, ${this.scaleY}) rotate(${
        this.rotate
      }deg) translate(${this.offsetX}px, ${this.offsetY}px)`
    );
  }
  /**
   * @return {?}
   */
  get currentScaleText() {
    return Math.round(this.scaleX * 100) + '%';
  }
  /**
   * @return {?}
   */
  initializeScaling() {
    /** @type {?} */
    const scaling =
      this.appConfigService.get('adf-viewer.image-viewer-scaling', undefined) /
      100;
    if (scaling) {
      this.scaleX = scaling;
      this.scaleY = scaling;
    }
  }
  /**
   * @return {?}
   */
  ngOnInit() {
    this.element = /** @type {?} */ (this.el.nativeElement.querySelector(
      '#viewer-image'
    ));
    if (this.element) {
      this.element.addEventListener('mousedown', this.onMouseDown.bind(this));
      this.element.addEventListener('mouseup', this.onMouseUp.bind(this));
      this.element.addEventListener('mouseleave', this.onMouseLeave.bind(this));
      this.element.addEventListener('mouseout', this.onMouseOut.bind(this));
      this.element.addEventListener('mousemove', this.onMouseMove.bind(this));
    }
  }
  /**
   * @return {?}
   */
  ngOnDestroy() {
    if (this.element) {
      this.element.removeEventListener('mousedown', this.onMouseDown);
      this.element.removeEventListener('mouseup', this.onMouseUp);
      this.element.removeEventListener('mouseleave', this.onMouseLeave);
      this.element.removeEventListener('mouseout', this.onMouseOut);
      this.element.removeEventListener('mousemove', this.onMouseMove);
    }
  }
  /**
   * @param {?} event
   * @return {?}
   */
  onKeyDown(event) {
    /** @type {?} */
    const scaleX = (this.scaleX !== 0 ? this.scaleX : 1.0);
    /** @type {?} */
    const scaleY = (this.scaleY !== 0 ? this.scaleY : 1.0);
    if (event.key === 'ArrowDown') {
      this.offsetY += this.step / scaleY;
    }
    if (event.key === 'ArrowUp') {
      this.offsetY -= this.step / scaleY;
    }
    if (event.key === 'ArrowRight') {
      this.offsetX += this.step / scaleX;
    }
    if (event.key === 'ArrowLeft') {
      this.offsetX -= this.step / scaleX;
    }
  }
  /**
   * @param {?} event
   * @return {?}
   */
  onMouseDown(event) {
    event.preventDefault();
    this.isDragged = true;
    this.drag = { x: event.pageX, y: event.pageY };
  }
  /**
   * @param {?} event
   * @return {?}
   */
  onMouseMove(event) {
    if (this.isDragged) {
      event.preventDefault();
      this.delta.x = event.pageX - this.drag.x;
      this.delta.y = event.pageY - this.drag.y;
      this.drag.x = event.pageX;
      this.drag.y = event.pageY;
      /** @type {?} */
      const scaleX = (this.scaleX !== 0 ? this.scaleX : 1.0);
      /** @type {?} */
      const scaleY = (this.scaleY !== 0 ? this.scaleY : 1.0);
      this.offsetX += this.delta.x / scaleX;
      this.offsetY += this.delta.y / scaleY;
    }
  }
  /**
   * @param {?} event
   * @return {?}
   */
  onMouseUp(event) {
    if (this.isDragged) {
      event.preventDefault();
      this.isDragged = false;
    }
  }
  /**
   * @param {?} event
   * @return {?}
   */
  onMouseLeave(event) {
    if (this.isDragged) {
      event.preventDefault();
      this.isDragged = false;
    }
  }
  /**
   * @param {?} event
   * @return {?}
   */
  onMouseOut(event) {
    if (this.isDragged) {
      event.preventDefault();
      this.isDragged = false;
    }
  }
  /**
   * @param {?} changes
   * @return {?}
   */
  ngOnChanges(changes) {
    /** @type {?} */
    const blobFile = changes['blobFile'];
    if (blobFile && blobFile.currentValue) {
      this.urlFile = this.contentService.createTrustedUrl(this.blobFile);
      return;
    }
    if (!this.urlFile && !this.blobFile) {
      throw new Error('Attribute urlFile or blobFile is required');
    }
  }
  /**
   * @return {?}
   */
  zoomIn() {
    /** @type {?} */
    const ratio = +((this.scaleX + 0.2).toFixed(1));
    this.scaleX = this.scaleY = ratio;
  }
  /**
   * @return {?}
   */
  zoomOut() {
    /** @type {?} */
    let ratio = +((this.scaleX - 0.2).toFixed(1));
    if (ratio < 0.2) {
      ratio = 0.2;
    }
    this.scaleX = this.scaleY = ratio;
  }
  /**
   * @return {?}
   */
  rotateLeft() {
    /** @type {?} */
    const angle = this.rotate - 90;
    this.rotate = Math.abs(angle) < 360 ? angle : 0;
  }
  /**
   * @return {?}
   */
  rotateRight() {
    /** @type {?} */
    const angle = this.rotate + 90;
    this.rotate = Math.abs(angle) < 360 ? angle : 0;
  }
  /**
   * @return {?}
   */
  reset() {
    this.rotate = 0;
    this.scaleX = 1.0;
    this.scaleY = 1.0;
    this.offsetX = 0;
    this.offsetY = 0;
  }
}
ImgViewerComponent.decorators = [
  {
    type: Component,
    args: [
      {
        selector: 'adf-img-viewer',
        template:
          '<div id="adf-image-container" (keydown)="onKeyDown($event)" class="adf-image-container" tabindex="0" role="img" [attr.aria-label]="nameFile" [style.transform]="transform" data-automation-id="adf-image-container">\n    <img id="viewer-image" [src]="urlFile" [alt]="nameFile" [ngStyle]="{ \'cursor\' : isDragged ? \'move\': \'default\' } " />\n</div>\n\n<div class="adf-image-viewer__toolbar" *ngIf="showToolbar">\n    <adf-toolbar>\n        <button\n            id="viewer-zoom-in-button"\n            mat-icon-button\n            title="{{ \'ADF_VIEWER.ARIA.ZOOM_IN\' | translate }}"\n            attr.aria-label="{{ \'ADF_VIEWER.ARIA.ZOOM_IN\' | translate }}"\n            (click)="zoomIn()">\n            <mat-icon>zoom_in</mat-icon>\n        </button>\n\n        <button\n            id="viewer-zoom-out-button"\n            title="{{ \'ADF_VIEWER.ARIA.ZOOM_OUT\' | translate }}"\n            attr.aria-label="{{ \'ADF_VIEWER.ARIA.ZOOM_OUT\' | translate }}"\n            mat-icon-button\n            (click)="zoomOut()">\n            <mat-icon>zoom_out</mat-icon>\n        </button>\n\n        <div class="adf-viewer__toolbar-page-scale" data-automation-id="adf-page-scale">\n            {{ currentScaleText }}\n        </div>\n\n        <button\n            id="viewer-rotate-left-button"\n            title="{{ \'ADF_VIEWER.ARIA.ROTATE_LEFT\' | translate }}"\n            attr.aria-label="{{ \'ADF_VIEWER.ARIA.ROTATE_LEFT\' | translate }}"\n            mat-icon-button\n            (click)="rotateLeft()">\n            <mat-icon>rotate_left</mat-icon>\n        </button>\n\n        <button\n            id="viewer-rotate-right-button"\n            title="{{ \'ADF_VIEWER.ARIA.ROTATE_RIGHT\' | translate }}"\n            attr.aria-label="{{ \'ADF_VIEWER.ARIA.ROTATE_RIGHT\' | translate }}"\n            mat-icon-button\n            (click)="rotateRight()">\n            <mat-icon>rotate_right</mat-icon>\n        </button>\n\n        <button\n            id="viewer-reset-button"\n            title="{{ \'ADF_VIEWER.ARIA.RESET\' | translate }}"\n            attr.aria-label="{{ \'ADF_VIEWER.ARIA.RESET\' | translate }}"\n            mat-icon-button\n            (click)="reset()">\n            <mat-icon>zoom_out_map</mat-icon>\n        </button>\n    </adf-toolbar>\n</div>\n',
        host: { class: 'adf-image-viewer' },
        encapsulation: ViewEncapsulation.None,
        styles: ['']
      }
    ]
  }
];
/** @nocollapse */
ImgViewerComponent.ctorParameters = () => [
  { type: DomSanitizer },
  { type: AppConfigService },
  { type: ContentService },
  { type: ElementRef }
];
ImgViewerComponent.propDecorators = {
  showToolbar: [{ type: Input }],
  urlFile: [{ type: Input }],
  blobFile: [{ type: Input }],
  nameFile: [{ type: Input }]
};
if (false) {
  /** @type {?} */
  ImgViewerComponent.prototype.showToolbar;
  /** @type {?} */
  ImgViewerComponent.prototype.urlFile;
  /** @type {?} */
  ImgViewerComponent.prototype.blobFile;
  /** @type {?} */
  ImgViewerComponent.prototype.nameFile;
  /** @type {?} */
  ImgViewerComponent.prototype.rotate;
  /** @type {?} */
  ImgViewerComponent.prototype.scaleX;
  /** @type {?} */
  ImgViewerComponent.prototype.scaleY;
  /** @type {?} */
  ImgViewerComponent.prototype.offsetX;
  /** @type {?} */
  ImgViewerComponent.prototype.offsetY;
  /** @type {?} */
  ImgViewerComponent.prototype.step;
  /** @type {?} */
  ImgViewerComponent.prototype.isDragged;
  /**
   * @type {?}
   * @private
   */
  ImgViewerComponent.prototype.drag;
  /**
   * @type {?}
   * @private
   */
  ImgViewerComponent.prototype.delta;
  /**
   * @type {?}
   * @private
   */
  ImgViewerComponent.prototype.element;
  /**
   * @type {?}
   * @private
   */
  ImgViewerComponent.prototype.sanitizer;
  /**
   * @type {?}
   * @private
   */
  ImgViewerComponent.prototype.appConfigService;
  /**
   * @type {?}
   * @private
   */
  ImgViewerComponent.prototype.contentService;
  /**
   * @type {?}
   * @private
   */
  ImgViewerComponent.prototype.el;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW1nLXZpZXdlci5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AYWxmcmVzY28vYWRmLWNvcmUvIiwic291cmNlcyI6WyJ2aWV3ZXIvY29tcG9uZW50cy9pbWctdmlld2VyLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWlCQSxPQUFPLEVBQ0gsU0FBUyxFQUNULEtBQUssRUFHTCxpQkFBaUIsRUFDakIsVUFBVSxFQUdiLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQztBQUNoRSxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSx1Q0FBdUMsQ0FBQztBQUN6RSxPQUFPLEVBQUUsWUFBWSxFQUFhLE1BQU0sMkJBQTJCLENBQUM7QUFTcEUsTUFBTSxPQUFPLGtCQUFrQjs7Ozs7OztJQW1DM0IsWUFDWSxTQUF1QixFQUN2QixnQkFBa0MsRUFDbEMsY0FBOEIsRUFDOUIsRUFBYztRQUhkLGNBQVMsR0FBVCxTQUFTLENBQWM7UUFDdkIscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFrQjtRQUNsQyxtQkFBYyxHQUFkLGNBQWMsQ0FBZ0I7UUFDOUIsT0FBRSxHQUFGLEVBQUUsQ0FBWTtRQXBDMUIsZ0JBQVcsR0FBRyxJQUFJLENBQUM7UUFXbkIsV0FBTSxHQUFXLENBQUMsQ0FBQztRQUNuQixXQUFNLEdBQVcsR0FBRyxDQUFDO1FBQ3JCLFdBQU0sR0FBVyxHQUFHLENBQUM7UUFDckIsWUFBTyxHQUFXLENBQUMsQ0FBQztRQUNwQixZQUFPLEdBQVcsQ0FBQyxDQUFDO1FBQ3BCLFNBQUksR0FBVyxDQUFDLENBQUM7UUFDakIsY0FBUyxHQUFZLEtBQUssQ0FBQztRQUVuQixTQUFJLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQztRQUN0QixVQUFLLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQztRQWlCM0IsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7SUFDN0IsQ0FBQzs7OztJQWhCRCxJQUFJLFNBQVM7UUFDVCxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsd0JBQXdCLENBQUMsU0FBUyxJQUFJLENBQUMsTUFBTSxLQUFLLElBQUksQ0FBQyxNQUFNLFlBQVksSUFBSSxDQUFDLE1BQU0sa0JBQWtCLElBQUksQ0FBQyxPQUFPLE9BQU8sSUFBSSxDQUFDLE9BQU8sS0FBSyxDQUFDLENBQUM7SUFDdEssQ0FBQzs7OztJQUVELElBQUksZ0JBQWdCO1FBQ2hCLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQztJQUMvQyxDQUFDOzs7O0lBWUQsaUJBQWlCOztjQUNQLE9BQU8sR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFTLGlDQUFpQyxFQUFFLFNBQVMsQ0FBQyxHQUFHLEdBQUc7UUFDckcsSUFBSSxPQUFPLEVBQUU7WUFDVCxJQUFJLENBQUMsTUFBTSxHQUFHLE9BQU8sQ0FBQztZQUN0QixJQUFJLENBQUMsTUFBTSxHQUFHLE9BQU8sQ0FBQztTQUN6QjtJQUNMLENBQUM7Ozs7SUFFRCxRQUFRO1FBQ0osSUFBSSxDQUFDLE9BQU8sR0FBRyxtQkFBYyxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQUMsZUFBZSxDQUFDLEVBQUEsQ0FBQztRQUVsRixJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDZCxJQUFJLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ3hFLElBQUksQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDcEUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUMxRSxJQUFJLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ3RFLElBQUksQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7U0FDM0U7SUFDTCxDQUFDOzs7O0lBRUQsV0FBVztRQUNQLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUNkLElBQUksQ0FBQyxPQUFPLENBQUMsbUJBQW1CLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUNoRSxJQUFJLENBQUMsT0FBTyxDQUFDLG1CQUFtQixDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDNUQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBQ2xFLElBQUksQ0FBQyxPQUFPLENBQUMsbUJBQW1CLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUM5RCxJQUFJLENBQUMsT0FBTyxDQUFDLG1CQUFtQixDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7U0FDbkU7SUFDTCxDQUFDOzs7OztJQUVELFNBQVMsQ0FBQyxLQUFvQjs7Y0FDcEIsTUFBTSxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQzs7Y0FDaEQsTUFBTSxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztRQUV0RCxJQUFJLEtBQUssQ0FBQyxHQUFHLEtBQUssV0FBVyxFQUFFO1lBQzNCLElBQUksQ0FBQyxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQyxDQUFDO1NBQ3hDO1FBRUQsSUFBSSxLQUFLLENBQUMsR0FBRyxLQUFLLFNBQVMsRUFBRTtZQUN6QixJQUFJLENBQUMsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxNQUFNLENBQUMsQ0FBQztTQUN4QztRQUVELElBQUksS0FBSyxDQUFDLEdBQUcsS0FBSyxZQUFZLEVBQUU7WUFDNUIsSUFBSSxDQUFDLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDLENBQUM7U0FDeEM7UUFFRCxJQUFJLEtBQUssQ0FBQyxHQUFHLEtBQUssV0FBVyxFQUFFO1lBQzNCLElBQUksQ0FBQyxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQyxDQUFDO1NBQ3hDO0lBQ0wsQ0FBQzs7Ozs7SUFFRCxXQUFXLENBQUMsS0FBaUI7UUFDekIsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFDLEVBQUUsS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDLEVBQUUsS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQ25ELENBQUM7Ozs7O0lBRUQsV0FBVyxDQUFDLEtBQWlCO1FBQ3pCLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUNoQixLQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7WUFFdkIsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUN6QyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBRXpDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUM7WUFDMUIsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQzs7a0JBRXBCLE1BQU0sR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7O2tCQUNoRCxNQUFNLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDO1lBRXRELElBQUksQ0FBQyxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQztZQUN4QyxJQUFJLENBQUMsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUM7U0FDM0M7SUFDTCxDQUFDOzs7OztJQUVELFNBQVMsQ0FBQyxLQUFpQjtRQUN2QixJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUU7WUFDaEIsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO1lBQ3ZCLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO1NBQzFCO0lBQ0wsQ0FBQzs7Ozs7SUFFRCxZQUFZLENBQUMsS0FBaUI7UUFDMUIsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO1lBQ2hCLEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQztZQUN2QixJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztTQUMxQjtJQUNMLENBQUM7Ozs7O0lBRUQsVUFBVSxDQUFDLEtBQWlCO1FBQ3hCLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUNoQixLQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7WUFDdkIsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7U0FDMUI7SUFDTCxDQUFDOzs7OztJQUVELFdBQVcsQ0FBQyxPQUFzQjs7Y0FDeEIsUUFBUSxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUM7UUFDcEMsSUFBSSxRQUFRLElBQUksUUFBUSxDQUFDLFlBQVksRUFBRTtZQUNuQyxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ25FLE9BQU87U0FDVjtRQUNELElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUNqQyxNQUFNLElBQUksS0FBSyxDQUFDLDJDQUEyQyxDQUFDLENBQUM7U0FDaEU7SUFDTCxDQUFDOzs7O0lBRUQsTUFBTTs7Y0FDSSxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDL0MsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztJQUN0QyxDQUFDOzs7O0lBRUQsT0FBTzs7WUFDQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0MsSUFBSSxLQUFLLEdBQUcsR0FBRyxFQUFFO1lBQ2IsS0FBSyxHQUFHLEdBQUcsQ0FBQztTQUNmO1FBQ0QsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztJQUN0QyxDQUFDOzs7O0lBRUQsVUFBVTs7Y0FDQSxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFO1FBQzlCLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3BELENBQUM7Ozs7SUFFRCxXQUFXOztjQUNELEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxHQUFHLEVBQUU7UUFDOUIsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDcEQsQ0FBQzs7OztJQUVELEtBQUs7UUFDRCxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztRQUNoQixJQUFJLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQztRQUNsQixJQUFJLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQztRQUNsQixJQUFJLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQztRQUNqQixJQUFJLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQztJQUNyQixDQUFDOzs7WUExTEosU0FBUyxTQUFDO2dCQUNQLFFBQVEsRUFBRSxnQkFBZ0I7Z0JBQzFCLGt5RUFBMEM7Z0JBRTFDLElBQUksRUFBRSxFQUFFLE9BQU8sRUFBRSxrQkFBa0IsRUFBRTtnQkFDckMsYUFBYSxFQUFFLGlCQUFpQixDQUFDLElBQUk7O2FBQ3hDOzs7O1lBUlEsWUFBWTtZQURaLGdCQUFnQjtZQURoQixjQUFjO1lBSm5CLFVBQVU7OzswQkFpQlQsS0FBSztzQkFHTCxLQUFLO3VCQUdMLEtBQUs7dUJBR0wsS0FBSzs7OztJQVROLHlDQUNtQjs7SUFFbkIscUNBQ2dCOztJQUVoQixzQ0FDZTs7SUFFZixzQ0FDaUI7O0lBRWpCLG9DQUFtQjs7SUFDbkIsb0NBQXFCOztJQUNyQixvQ0FBcUI7O0lBQ3JCLHFDQUFvQjs7SUFDcEIscUNBQW9COztJQUNwQixrQ0FBaUI7O0lBQ2pCLHVDQUEyQjs7Ozs7SUFFM0Isa0NBQThCOzs7OztJQUM5QixtQ0FBK0I7Ozs7O0lBVS9CLHFDQUE2Qjs7Ozs7SUFHekIsdUNBQStCOzs7OztJQUMvQiw4Q0FBMEM7Ozs7O0lBQzFDLDRDQUFzQzs7Ozs7SUFDdEMsZ0NBQXNCIiwic291cmNlc0NvbnRlbnQiOlsiLyohXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTkgQWxmcmVzY28gU29mdHdhcmUsIEx0ZC5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0IHtcbiAgICBDb21wb25lbnQsXG4gICAgSW5wdXQsXG4gICAgT25DaGFuZ2VzLFxuICAgIFNpbXBsZUNoYW5nZXMsXG4gICAgVmlld0VuY2Fwc3VsYXRpb24sXG4gICAgRWxlbWVudFJlZixcbiAgICBPbkluaXQsXG4gICAgT25EZXN0cm95XG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ29udGVudFNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9jb250ZW50LnNlcnZpY2UnO1xuaW1wb3J0IHsgQXBwQ29uZmlnU2VydmljZSB9IGZyb20gJy4vLi4vLi4vYXBwLWNvbmZpZy9hcHAtY29uZmlnLnNlcnZpY2UnO1xuaW1wb3J0IHsgRG9tU2FuaXRpemVyLCBTYWZlU3R5bGUgfSBmcm9tICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyJztcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdhZGYtaW1nLXZpZXdlcicsXG4gICAgdGVtcGxhdGVVcmw6ICcuL2ltZy12aWV3ZXIuY29tcG9uZW50Lmh0bWwnLFxuICAgIHN0eWxlVXJsczogWycuL2ltZy12aWV3ZXIuY29tcG9uZW50LnNjc3MnXSxcbiAgICBob3N0OiB7ICdjbGFzcyc6ICdhZGYtaW1hZ2Utdmlld2VyJyB9LFxuICAgIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmVcbn0pXG5leHBvcnQgY2xhc3MgSW1nVmlld2VyQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkNoYW5nZXMsIE9uRGVzdHJveSB7XG5cbiAgICBASW5wdXQoKVxuICAgIHNob3dUb29sYmFyID0gdHJ1ZTtcblxuICAgIEBJbnB1dCgpXG4gICAgdXJsRmlsZTogc3RyaW5nO1xuXG4gICAgQElucHV0KClcbiAgICBibG9iRmlsZTogQmxvYjtcblxuICAgIEBJbnB1dCgpXG4gICAgbmFtZUZpbGU6IHN0cmluZztcblxuICAgIHJvdGF0ZTogbnVtYmVyID0gMDtcbiAgICBzY2FsZVg6IG51bWJlciA9IDEuMDtcbiAgICBzY2FsZVk6IG51bWJlciA9IDEuMDtcbiAgICBvZmZzZXRYOiBudW1iZXIgPSAwO1xuICAgIG9mZnNldFk6IG51bWJlciA9IDA7XG4gICAgc3RlcDogbnVtYmVyID0gNDtcbiAgICBpc0RyYWdnZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgIHByaXZhdGUgZHJhZyA9IHsgeDogMCwgeTogMCB9O1xuICAgIHByaXZhdGUgZGVsdGEgPSB7IHg6IDAsIHk6IDAgfTtcblxuICAgIGdldCB0cmFuc2Zvcm0oKTogU2FmZVN0eWxlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2FuaXRpemVyLmJ5cGFzc1NlY3VyaXR5VHJ1c3RTdHlsZShgc2NhbGUoJHt0aGlzLnNjYWxlWH0sICR7dGhpcy5zY2FsZVl9KSByb3RhdGUoJHt0aGlzLnJvdGF0ZX1kZWcpIHRyYW5zbGF0ZSgke3RoaXMub2Zmc2V0WH1weCwgJHt0aGlzLm9mZnNldFl9cHgpYCk7XG4gICAgfVxuXG4gICAgZ2V0IGN1cnJlbnRTY2FsZVRleHQoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIE1hdGgucm91bmQodGhpcy5zY2FsZVggKiAxMDApICsgJyUnO1xuICAgIH1cblxuICAgIHByaXZhdGUgZWxlbWVudDogSFRNTEVsZW1lbnQ7XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHJpdmF0ZSBzYW5pdGl6ZXI6IERvbVNhbml0aXplcixcbiAgICAgICAgcHJpdmF0ZSBhcHBDb25maWdTZXJ2aWNlOiBBcHBDb25maWdTZXJ2aWNlLFxuICAgICAgICBwcml2YXRlIGNvbnRlbnRTZXJ2aWNlOiBDb250ZW50U2VydmljZSxcbiAgICAgICAgcHJpdmF0ZSBlbDogRWxlbWVudFJlZikge1xuICAgICAgICB0aGlzLmluaXRpYWxpemVTY2FsaW5nKCk7XG4gICAgfVxuXG4gICAgaW5pdGlhbGl6ZVNjYWxpbmcoKSB7XG4gICAgICAgIGNvbnN0IHNjYWxpbmcgPSB0aGlzLmFwcENvbmZpZ1NlcnZpY2UuZ2V0PG51bWJlcj4oJ2FkZi12aWV3ZXIuaW1hZ2Utdmlld2VyLXNjYWxpbmcnLCB1bmRlZmluZWQpIC8gMTAwO1xuICAgICAgICBpZiAoc2NhbGluZykge1xuICAgICAgICAgICAgdGhpcy5zY2FsZVggPSBzY2FsaW5nO1xuICAgICAgICAgICAgdGhpcy5zY2FsZVkgPSBzY2FsaW5nO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbmdPbkluaXQoKSB7XG4gICAgICAgIHRoaXMuZWxlbWVudCA9IDxIVE1MRWxlbWVudD4gdGhpcy5lbC5uYXRpdmVFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJyN2aWV3ZXItaW1hZ2UnKTtcblxuICAgICAgICBpZiAodGhpcy5lbGVtZW50KSB7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgdGhpcy5vbk1vdXNlRG93bi5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgdGhpcy5vbk1vdXNlVXAuYmluZCh0aGlzKSk7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VsZWF2ZScsIHRoaXMub25Nb3VzZUxlYXZlLmJpbmQodGhpcykpO1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlb3V0JywgdGhpcy5vbk1vdXNlT3V0LmJpbmQodGhpcykpO1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHRoaXMub25Nb3VzZU1vdmUuYmluZCh0aGlzKSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBuZ09uRGVzdHJveSgpIHtcbiAgICAgICAgaWYgKHRoaXMuZWxlbWVudCkge1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIHRoaXMub25Nb3VzZURvd24pO1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLm9uTW91c2VVcCk7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2VsZWF2ZScsIHRoaXMub25Nb3VzZUxlYXZlKTtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW91dCcsIHRoaXMub25Nb3VzZU91dCk7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgdGhpcy5vbk1vdXNlTW92ZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvbktleURvd24oZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcbiAgICAgICAgY29uc3Qgc2NhbGVYID0gKHRoaXMuc2NhbGVYICE9PSAwID8gdGhpcy5zY2FsZVggOiAxLjApO1xuICAgICAgICBjb25zdCBzY2FsZVkgPSAodGhpcy5zY2FsZVkgIT09IDAgPyB0aGlzLnNjYWxlWSA6IDEuMCk7XG5cbiAgICAgICAgaWYgKGV2ZW50LmtleSA9PT0gJ0Fycm93RG93bicpIHtcbiAgICAgICAgICAgIHRoaXMub2Zmc2V0WSArPSAodGhpcy5zdGVwIC8gc2NhbGVZKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChldmVudC5rZXkgPT09ICdBcnJvd1VwJykge1xuICAgICAgICAgICAgdGhpcy5vZmZzZXRZIC09ICh0aGlzLnN0ZXAgLyBzY2FsZVkpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGV2ZW50LmtleSA9PT0gJ0Fycm93UmlnaHQnKSB7XG4gICAgICAgICAgICB0aGlzLm9mZnNldFggKz0gKHRoaXMuc3RlcCAvIHNjYWxlWCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZXZlbnQua2V5ID09PSAnQXJyb3dMZWZ0Jykge1xuICAgICAgICAgICAgdGhpcy5vZmZzZXRYIC09ICh0aGlzLnN0ZXAgLyBzY2FsZVgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgb25Nb3VzZURvd24oZXZlbnQ6IE1vdXNlRXZlbnQpIHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgdGhpcy5pc0RyYWdnZWQgPSB0cnVlO1xuICAgICAgICB0aGlzLmRyYWcgPSB7IHg6IGV2ZW50LnBhZ2VYLCB5OiBldmVudC5wYWdlWSB9O1xuICAgIH1cblxuICAgIG9uTW91c2VNb3ZlKGV2ZW50OiBNb3VzZUV2ZW50KSB7XG4gICAgICAgIGlmICh0aGlzLmlzRHJhZ2dlZCkge1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgdGhpcy5kZWx0YS54ID0gZXZlbnQucGFnZVggLSB0aGlzLmRyYWcueDtcbiAgICAgICAgICAgIHRoaXMuZGVsdGEueSA9IGV2ZW50LnBhZ2VZIC0gdGhpcy5kcmFnLnk7XG5cbiAgICAgICAgICAgIHRoaXMuZHJhZy54ID0gZXZlbnQucGFnZVg7XG4gICAgICAgICAgICB0aGlzLmRyYWcueSA9IGV2ZW50LnBhZ2VZO1xuXG4gICAgICAgICAgICBjb25zdCBzY2FsZVggPSAodGhpcy5zY2FsZVggIT09IDAgPyB0aGlzLnNjYWxlWCA6IDEuMCk7XG4gICAgICAgICAgICBjb25zdCBzY2FsZVkgPSAodGhpcy5zY2FsZVkgIT09IDAgPyB0aGlzLnNjYWxlWSA6IDEuMCk7XG5cbiAgICAgICAgICAgIHRoaXMub2Zmc2V0WCArPSAodGhpcy5kZWx0YS54IC8gc2NhbGVYKTtcbiAgICAgICAgICAgIHRoaXMub2Zmc2V0WSArPSAodGhpcy5kZWx0YS55IC8gc2NhbGVZKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9uTW91c2VVcChldmVudDogTW91c2VFdmVudCkge1xuICAgICAgICBpZiAodGhpcy5pc0RyYWdnZWQpIHtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICB0aGlzLmlzRHJhZ2dlZCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgb25Nb3VzZUxlYXZlKGV2ZW50OiBNb3VzZUV2ZW50KSB7XG4gICAgICAgIGlmICh0aGlzLmlzRHJhZ2dlZCkge1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHRoaXMuaXNEcmFnZ2VkID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvbk1vdXNlT3V0KGV2ZW50OiBNb3VzZUV2ZW50KSB7XG4gICAgICAgIGlmICh0aGlzLmlzRHJhZ2dlZCkge1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHRoaXMuaXNEcmFnZ2VkID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgICAgIGNvbnN0IGJsb2JGaWxlID0gY2hhbmdlc1snYmxvYkZpbGUnXTtcbiAgICAgICAgaWYgKGJsb2JGaWxlICYmIGJsb2JGaWxlLmN1cnJlbnRWYWx1ZSkge1xuICAgICAgICAgICAgdGhpcy51cmxGaWxlID0gdGhpcy5jb250ZW50U2VydmljZS5jcmVhdGVUcnVzdGVkVXJsKHRoaXMuYmxvYkZpbGUpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmICghdGhpcy51cmxGaWxlICYmICF0aGlzLmJsb2JGaWxlKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0F0dHJpYnV0ZSB1cmxGaWxlIG9yIGJsb2JGaWxlIGlzIHJlcXVpcmVkJyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB6b29tSW4oKSB7XG4gICAgICAgIGNvbnN0IHJhdGlvID0gKygodGhpcy5zY2FsZVggKyAwLjIpLnRvRml4ZWQoMSkpO1xuICAgICAgICB0aGlzLnNjYWxlWCA9IHRoaXMuc2NhbGVZID0gcmF0aW87XG4gICAgfVxuXG4gICAgem9vbU91dCgpIHtcbiAgICAgICAgbGV0IHJhdGlvID0gKygodGhpcy5zY2FsZVggLSAwLjIpLnRvRml4ZWQoMSkpO1xuICAgICAgICBpZiAocmF0aW8gPCAwLjIpIHtcbiAgICAgICAgICAgIHJhdGlvID0gMC4yO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2NhbGVYID0gdGhpcy5zY2FsZVkgPSByYXRpbztcbiAgICB9XG5cbiAgICByb3RhdGVMZWZ0KCkge1xuICAgICAgICBjb25zdCBhbmdsZSA9IHRoaXMucm90YXRlIC0gOTA7XG4gICAgICAgIHRoaXMucm90YXRlID0gTWF0aC5hYnMoYW5nbGUpIDwgMzYwID8gYW5nbGUgOiAwO1xuICAgIH1cblxuICAgIHJvdGF0ZVJpZ2h0KCkge1xuICAgICAgICBjb25zdCBhbmdsZSA9IHRoaXMucm90YXRlICsgOTA7XG4gICAgICAgIHRoaXMucm90YXRlID0gTWF0aC5hYnMoYW5nbGUpIDwgMzYwID8gYW5nbGUgOiAwO1xuICAgIH1cblxuICAgIHJlc2V0KCkge1xuICAgICAgICB0aGlzLnJvdGF0ZSA9IDA7XG4gICAgICAgIHRoaXMuc2NhbGVYID0gMS4wO1xuICAgICAgICB0aGlzLnNjYWxlWSA9IDEuMDtcbiAgICAgICAgdGhpcy5vZmZzZXRYID0gMDtcbiAgICAgICAgdGhpcy5vZmZzZXRZID0gMDtcbiAgICB9XG59XG4iXX0=
