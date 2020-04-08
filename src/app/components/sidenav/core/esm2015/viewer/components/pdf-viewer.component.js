/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from 'tslib';
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
  TemplateRef,
  HostListener,
  Output,
  Input,
  ViewEncapsulation,
  EventEmitter
} from '@angular/core';
import { MatDialog } from '@angular/material';
import { LogService } from '../../services/log.service';
import { RenderingQueueServices } from '../services/rendering-queue.services';
import { PdfPasswordDialogComponent } from './pdf-viewer-password-dialog';
import { AppConfigService } from './../../app-config/app-config.service';
export class PdfViewerComponent {
  /**
   * @param {?} dialog
   * @param {?} renderingQueueServices
   * @param {?} logService
   * @param {?} appConfigService
   */
  constructor(dialog, renderingQueueServices, logService, appConfigService) {
    this.dialog = dialog;
    this.renderingQueueServices = renderingQueueServices;
    this.logService = logService;
    this.appConfigService = appConfigService;
    this.showToolbar = true;
    this.allowThumbnails = false;
    this.thumbnailsTemplate = null;
    this.rendered = new EventEmitter();
    this.error = new EventEmitter();
    this.close = new EventEmitter();
    this.currentScaleMode = 'auto';
    this.currentScale = 1;
    this.MAX_AUTO_SCALE = 1.25;
    this.DEFAULT_SCALE_DELTA = 1.1;
    this.MIN_SCALE = 0.25;
    this.MAX_SCALE = 10.0;
    this.isPanelDisabled = true;
    this.showThumbnails = false;
    this.pdfThumbnailsContext = { viewer: null };
    // needed to preserve "this" context
    this.onPageChange = this.onPageChange.bind(this);
    this.onPagesLoaded = this.onPagesLoaded.bind(this);
    this.onPageRendered = this.onPageRendered.bind(this);
    this.randomPdfId = this.generateUuid();
    this.currentScale = this.getUserScaling();
  }
  /**
   * @return {?}
   */
  get currentScaleText() {
    return Math.round(this.currentScale * 100) + '%';
  }
  /**
   * @return {?}
   */
  getUserScaling() {
    /** @type {?} */
    const scaleConfig =
      this.appConfigService.get('adf-viewer.pdf-viewer-scaling', undefined) /
      100;
    if (scaleConfig) {
      return this.checkLimits(scaleConfig);
    } else {
      return 1;
    }
  }
  /**
   * @param {?} scaleConfig
   * @return {?}
   */
  checkLimits(scaleConfig) {
    if (scaleConfig > this.MAX_SCALE) {
      return this.MAX_SCALE;
    } else if (scaleConfig < this.MIN_SCALE) {
      return this.MIN_SCALE;
    } else {
      return scaleConfig;
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
      /** @type {?} */
      const reader = new FileReader();
      reader.onload
      /**
       * @return {?}
       */ = () =>
        tslib_1.__awaiter(this, void 0, void 0, function*() {
          /** @type {?} */
          const pdfSource = {
            data: reader.result,
            withCredentials: this.appConfigService.get(
              'auth.withCredentials',
              undefined
            )
          };
          this.executePdf(pdfSource);
        });
      reader.readAsArrayBuffer(blobFile.currentValue);
    }
    /** @type {?} */
    const urlFile = changes['urlFile'];
    if (urlFile && urlFile.currentValue) {
      /** @type {?} */
      const pdfSource = {
        url: urlFile.currentValue,
        withCredentials: this.appConfigService.get(
          'auth.withCredentials',
          undefined
        )
      };
      this.executePdf(pdfSource);
    }
    if (!this.urlFile && !this.blobFile) {
      throw new Error('Attribute urlFile or blobFile is required');
    }
  }
  /**
   * @param {?} pdfOptions
   * @return {?}
   */
  executePdf(pdfOptions) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'pdf.worker.min.js';
    this.loadingTask = pdfjsLib.getDocument(pdfOptions);
    this.loadingTask.onPassword
    /**
     * @param {?} callback
     * @param {?} reason
     * @return {?}
     */ = (callback, reason) => {
      this.onPdfPassword(callback, reason);
    };
    this.loadingTask.onProgress
    /**
     * @param {?} progressData
     * @return {?}
     */ = progressData => {
      /** @type {?} */
      const level = progressData.loaded / progressData.total;
      this.loadingPercent = Math.round(level * 100);
    };
    this.loadingTask.promise.then(
      /**
       * @param {?} pdfDocument
       * @return {?}
       */
      pdfDocument => {
        this.totalPages = pdfDocument.numPages;
        this.page = 1;
        this.displayPage = 1;
        this.initPDFViewer(pdfDocument);
        pdfDocument.getPage(1).then(
          /**
           * @return {?}
           */
          () => {
            this.scalePage('auto');
          }
          /**
           * @return {?}
           */,
          () => {
            this.error.emit();
          }
        );
      }
      /**
       * @return {?}
       */,
      () => {
        this.error.emit();
      }
    );
  }
  /**
   * @param {?} pdfDocument
   * @return {?}
   */
  initPDFViewer(pdfDocument) {
    /** @type {?} */
    const viewer = this.getViewer();
    /** @type {?} */
    const container = this.getDocumentContainer();
    if (viewer && container) {
      this.pdfViewer = new pdfjsViewer.PDFViewer({
        container: container,
        viewer: viewer,
        renderingQueue: this.renderingQueueServices
      });
      // cspell: disable-next
      this.pdfViewer.eventBus.on('pagechanging', this.onPageChange);
      // cspell: disable-next
      this.pdfViewer.eventBus.on('pagesloaded', this.onPagesLoaded);
      // cspell: disable-next
      this.pdfViewer.eventBus.on('textlayerrendered', this.onPageRendered);
      this.renderingQueueServices.setViewer(this.pdfViewer);
      this.pdfViewer.setDocument(pdfDocument);
      this.pdfThumbnailsContext.viewer = this.pdfViewer;
    }
  }
  /**
   * @return {?}
   */
  ngOnDestroy() {
    if (this.pdfViewer) {
      // cspell: disable-next
      this.pdfViewer.eventBus.off('pagechanging');
      // cspell: disable-next
      this.pdfViewer.eventBus.off('pagesloaded');
      // cspell: disable-next
      this.pdfViewer.eventBus.off('textlayerrendered');
    }
    if (this.loadingTask) {
      try {
        this.loadingTask.destroy();
      } catch (_a) {}
      this.loadingTask = null;
    }
  }
  /**
   * @return {?}
   */
  toggleThumbnails() {
    this.showThumbnails = !this.showThumbnails;
  }
  /**
   * Method to scale the page current support implementation
   *
   * @param {?} scaleMode - new scale mode
   * @return {?}
   */
  scalePage(scaleMode) {
    this.currentScaleMode = scaleMode;
    /** @type {?} */
    const viewerContainer = document.getElementById(
      `${this.randomPdfId}-viewer-main-container`
    );
    /** @type {?} */
    const documentContainer = this.getDocumentContainer();
    if (this.pdfViewer && documentContainer) {
      /** @type {?} */
      let widthContainer;
      /** @type {?} */
      let heightContainer;
      if (
        viewerContainer &&
        viewerContainer.clientWidth <= documentContainer.clientWidth
      ) {
        widthContainer = viewerContainer.clientWidth;
        heightContainer = viewerContainer.clientHeight;
      } else {
        widthContainer = documentContainer.clientWidth;
        heightContainer = documentContainer.clientHeight;
      }
      /** @type {?} */
      const currentPage = this.pdfViewer._pages[
        this.pdfViewer._currentPageNumber - 1
      ];
      /** @type {?} */
      const padding = 20;
      /** @type {?} */
      const pageWidthScale =
        ((widthContainer - padding) / currentPage.width) * currentPage.scale;
      /** @type {?} */
      const pageHeightScale =
        ((heightContainer - padding) / currentPage.width) * currentPage.scale;
      /** @type {?} */
      let scale = this.getUserScaling();
      if (!scale) {
        switch (this.currentScaleMode) {
          case 'page-actual':
            scale = 1;
            break;
          case 'page-width':
            scale = pageWidthScale;
            break;
          case 'page-height':
            scale = pageHeightScale;
            break;
          case 'page-fit':
            scale = Math.min(pageWidthScale, pageHeightScale);
            break;
          case 'auto':
            /** @type {?} */
            let horizontalScale;
            if (this.isLandscape) {
              horizontalScale = Math.min(pageHeightScale, pageWidthScale);
            } else {
              horizontalScale = pageWidthScale;
            }
            horizontalScale = Math.round(horizontalScale);
            scale = Math.min(this.MAX_AUTO_SCALE, horizontalScale);
            break;
          default:
            this.logService.error(
              "pdfViewSetScale: '" + scaleMode + "' is an unknown zoom value."
            );
            return;
        }
        this.setScaleUpdatePages(scale);
      } else {
        this.currentScale = 0;
        this.setScaleUpdatePages(scale);
      }
    }
  }
  /**
   * @private
   * @return {?}
   */
  getDocumentContainer() {
    return document.getElementById(`${this.randomPdfId}-viewer-pdf-viewer`);
  }
  /**
   * @private
   * @return {?}
   */
  getViewer() {
    return document.getElementById(`${this.randomPdfId}-viewer-viewerPdf`);
  }
  /**
   * Update all the pages with the newScale scale
   *
   * @param {?} newScale - new scale page
   * @return {?}
   */
  setScaleUpdatePages(newScale) {
    if (this.pdfViewer) {
      if (!this.isSameScale(this.currentScale, newScale)) {
        this.currentScale = newScale;
        this.pdfViewer._pages.forEach(
          /**
           * @param {?} currentPage
           * @return {?}
           */
          function(currentPage) {
            currentPage.update(newScale);
          }
        );
      }
      this.pdfViewer.update();
    }
  }
  /**
   * Check if the request scale of the page is the same for avoid useless re-rendering
   *
   * @param {?} oldScale - old scale page
   * @param {?} newScale - new scale page
   *
   * @return {?}
   */
  isSameScale(oldScale, newScale) {
    return newScale === oldScale;
  }
  /**
   * Check if is a land scape view
   *
   * @param {?} width
   * @param {?} height
   * @return {?}
   */
  isLandscape(width, height) {
    return width > height;
  }
  /**
   * Method triggered when the page is resized
   * @return {?}
   */
  onResize() {
    this.scalePage(this.currentScaleMode);
  }
  /**
   * toggle the fit page pdf
   * @return {?}
   */
  pageFit() {
    if (this.currentScaleMode !== 'page-fit') {
      this.scalePage('page-fit');
    } else {
      this.scalePage('auto');
    }
  }
  /**
   * zoom in page pdf
   *
   * @param {?=} ticks
   * @return {?}
   */
  zoomIn(ticks) {
    /** @type {?} */
    let newScale = this.currentScale;
    do {
      newScale = (newScale * this.DEFAULT_SCALE_DELTA).toFixed(2);
      newScale = Math.ceil(newScale * 10) / 10;
      newScale = Math.min(this.MAX_SCALE, newScale);
    } while (--ticks > 0 && newScale < this.MAX_SCALE);
    this.currentScaleMode = 'auto';
    this.setScaleUpdatePages(newScale);
  }
  /**
   * zoom out page pdf
   *
   * @param {?=} ticks
   * @return {?}
   */
  zoomOut(ticks) {
    /** @type {?} */
    let newScale = this.currentScale;
    do {
      newScale = (newScale / this.DEFAULT_SCALE_DELTA).toFixed(2);
      newScale = Math.floor(newScale * 10) / 10;
      newScale = Math.max(this.MIN_SCALE, newScale);
    } while (--ticks > 0 && newScale > this.MIN_SCALE);
    this.currentScaleMode = 'auto';
    this.setScaleUpdatePages(newScale);
  }
  /**
   * load the previous page
   * @return {?}
   */
  previousPage() {
    if (this.pdfViewer && this.page > 1) {
      this.page--;
      this.displayPage = this.page;
      this.pdfViewer.currentPageNumber = this.page;
    }
  }
  /**
   * load the next page
   * @return {?}
   */
  nextPage() {
    if (this.pdfViewer && this.page < this.totalPages) {
      this.page++;
      this.displayPage = this.page;
      this.pdfViewer.currentPageNumber = this.page;
    }
  }
  /**
   * load the page in input
   *
   * @param {?} page to load
   * @return {?}
   */
  inputPage(page) {
    /** @type {?} */
    const pageInput = parseInt(page, 10);
    if (!isNaN(pageInput) && pageInput > 0 && pageInput <= this.totalPages) {
      this.page = pageInput;
      this.displayPage = this.page;
      this.pdfViewer.currentPageNumber = this.page;
    } else {
      this.displayPage = this.page;
    }
  }
  /**
   * Page Change Event
   *
   * @param {?} event
   * @return {?}
   */
  onPageChange(event) {
    if (
      event.source &&
      event.source.container.id === `${this.randomPdfId}-viewer-pdf-viewer`
    ) {
      this.page = event.pageNumber;
      this.displayPage = event.pageNumber;
    }
  }
  /**
   * @param {?} callback
   * @param {?} reason
   * @return {?}
   */
  onPdfPassword(callback, reason) {
    this.dialog
      .open(PdfPasswordDialogComponent, {
        width: '400px',
        data: { reason }
      })
      .afterClosed()
      .subscribe(
        /**
         * @param {?} password
         * @return {?}
         */
        password => {
          if (password) {
            callback(password);
          } else {
            this.close.emit();
          }
        }
      );
  }
  /**
   * Page Rendered Event
   * @return {?}
   */
  onPageRendered() {
    this.rendered.emit();
  }
  /**
   * Pages Loaded Event
   *
   * @return {?}
   */
  onPagesLoaded() {
    this.isPanelDisabled = false;
  }
  /**
   * Keyboard Event Listener
   * @param {?} event
   * @return {?}
   */
  handleKeyboardEvent(event) {
    /** @type {?} */
    const key = event.keyCode;
    if (key === 39) {
      // right arrow
      this.nextPage();
    } else if (key === 37) {
      // left arrow
      this.previousPage();
    }
  }
  /**
   * @private
   * @return {?}
   */
  generateUuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
      /[xy]/g
      /**
       * @param {?} c
       * @return {?}
       */,
      function(c) {
        /** @type {?} */
        const r = (Math.random() * 16) | 0;
        /** @type {?} */
        const v = c === 'x' ? r : ((r & 0x3) | 0x8);
        return v.toString(16);
      }
    );
  }
}
PdfViewerComponent.decorators = [
  {
    type: Component,
    args: [
      {
        selector: 'adf-pdf-viewer',
        template:
          '<div class="adf-pdf-viewer__container">\n    <ng-container *ngIf="showThumbnails">\n        <div class="adf-pdf-viewer__thumbnails">\n            <div class="adf-thumbnails-template__container">\n                <div class="adf-thumbnails-template__buttons">\n                    <button mat-icon-button data-automation-id=\'adf-thumbnails-close\' (click)="toggleThumbnails()">\n                        <mat-icon>close</mat-icon>\n                    </button>\n                </div>\n\n                <ng-container *ngIf="thumbnailsTemplate">\n                    <ng-container *ngTemplateOutlet="thumbnailsTemplate;context:pdfThumbnailsContext"></ng-container>\n                </ng-container>\n\n                <ng-container *ngIf="!thumbnailsTemplate">\n                    <adf-pdf-thumbnails [pdfViewer]="pdfViewer"></adf-pdf-thumbnails>\n                </ng-container>\n            </div>\n        </div>\n    </ng-container>\n\n    <div class="adf-pdf-viewer__content">\n        <div [id]="randomPdfId+\'-viewer-pdf-viewer\'" class="adf-viewer-pdf-viewer" (window:resize)="onResize()">\n            <div [id]="randomPdfId+\'-viewer-viewerPdf\'" class="adf-pdfViewer" role="document" tabindex="0" aria-expanded="true">\n                <div id="loader-container" class="adf-loader-container">\n                    <div class="adf-loader-item">\n                        <mat-progress-bar mode="indeterminate"></mat-progress-bar>\n                    </div>\n                </div>\n            </div>\n        </div>\n    </div>\n</div>\n\n<div class="adf-pdf-viewer__toolbar" *ngIf="showToolbar">\n    <adf-toolbar>\n\n        <ng-container *ngIf="allowThumbnails">\n            <button mat-icon-button\n                    [attr.aria-label]="\'ADF_VIEWER.ARIA.THUMBNAILS\' | translate"\n                    [attr.aria-expanded]="showThumbnails"\n                    data-automation-id="adf-thumbnails-button"\n                    [disabled]="isPanelDisabled"\n                    (click)="toggleThumbnails()">\n                <mat-icon>dashboard</mat-icon>\n            </button>\n            <adf-toolbar-divider></adf-toolbar-divider>\n        </ng-container>\n\n        <button\n            id="viewer-previous-page-button"\n            title="{{ \'ADF_VIEWER.ARIA.PREVIOUS_PAGE\' | translate }}"\n            attr.aria-label="{{ \'ADF_VIEWER.ARIA.PREVIOUS_PAGE\' | translate }}"\n            mat-icon-button\n            (click)="previousPage()">\n            <mat-icon>keyboard_arrow_up</mat-icon>\n        </button>\n\n        <button\n            id="viewer-next-page-button"\n            title="{{ \'ADF_VIEWER.ARIA.NEXT_PAGE\' | translate }}"\n            attr.aria-label="{{ \'ADF_VIEWER.ARIA.NEXT_PAGE\' | translate }}"\n            mat-icon-button\n            (click)="nextPage()">\n            <mat-icon>keyboard_arrow_down</mat-icon>\n        </button>\n\n        <div class="adf-pdf-viewer__toolbar-page-selector">\n            <span>{{ \'ADF_VIEWER.PAGE_LABEL.SHOWING\' | translate }}</span>\n            <input #page\n                   type="text"\n                   data-automation-id="adf-page-selector"\n                   pattern="-?[0-9]*(\\.[0-9]+)?"\n                   value="{{ displayPage }}"\n                   (keyup.enter)="inputPage(page.value)">\n            <span>{{ \'ADF_VIEWER.PAGE_LABEL.OF\' | translate }} {{ totalPages }}</span>\n        </div>\n\n        <div class="adf-viewer__toolbar-page-scale" data-automation-id="adf-page-scale">\n            {{ currentScaleText }}\n        </div>\n\n        <button\n            id="viewer-zoom-in-button"\n            title="{{ \'ADF_VIEWER.ARIA.ZOOM_IN\' | translate }}"\n            attr.aria-label="{{ \'ADF_VIEWER.ARIA.ZOOM_IN\' | translate }}"\n            mat-icon-button\n            (click)="zoomIn()">\n            <mat-icon>zoom_in</mat-icon>\n        </button>\n\n        <button\n            id="viewer-zoom-out-button"\n            title="{{ \'ADF_VIEWER.ARIA.ZOOM_OUT\' | translate }}"\n            attr.aria-label="{{ \'ADF_VIEWER.ARIA.ZOOM_OUT\' | translate }}"\n            mat-icon-button\n            (click)="zoomOut()">\n            <mat-icon>zoom_out</mat-icon>\n        </button>\n\n        <button\n            id="viewer-scale-page-button"\n            title="{{ \'ADF_VIEWER.ARIA.FIT_PAGE\' | translate }}"\n            attr.aria-label="{{ \'ADF_VIEWER.ARIA.FIT_PAGE\' | translate }}"\n            mat-icon-button\n            (click)="pageFit()">\n            <mat-icon>zoom_out_map</mat-icon>\n        </button>\n\n    </adf-toolbar>\n</div>\n',
        providers: [RenderingQueueServices],
        host: { class: 'adf-pdf-viewer' },
        encapsulation: ViewEncapsulation.None,
        styles: [
          '',
          ".adf-pdf-viewer .textLayer>span{color:transparent;position:absolute;white-space:pre;cursor:text;transform-origin:0 0}.adf-pdf-viewer .textLayer .highlight{margin:-1px;padding:1px;background-color:#b400aa;border-radius:4px}.adf-pdf-viewer .textLayer .highlight.begin{border-radius:4px 0 0 4px}.adf-pdf-viewer .textLayer .highlight.end{border-radius:0 4px 4px 0}.adf-pdf-viewer .textLayer .highlight.middle{border-radius:0}.adf-pdf-viewer .textLayer .highlight.selected{background-color:#006400}.adf-pdf-viewer .textLayer ::-moz-selection{background:#00f}.adf-pdf-viewer .textLayer ::selection{background:#00f}.adf-pdf-viewer .textLayer .endOfContent{display:block;position:absolute;left:0;top:100%;right:0;bottom:0;z-index:-1;cursor:default;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.adf-pdf-viewer .textLayer .endOfContent.active{top:0}.adf-pdf-viewer .annotationLayer section{position:absolute}.adf-pdf-viewer .annotationLayer .buttonWidgetAnnotation.pushButton>a,.adf-pdf-viewer .annotationLayer .linkAnnotation>a{position:absolute;font-size:1em;top:0;left:0;width:100%;height:100%}.adf-pdf-viewer .annotationLayer .buttonWidgetAnnotation.pushButton>a:hover,.adf-pdf-viewer .annotationLayer .linkAnnotation>a:hover{opacity:.2;background:#ff0;box-shadow:0 2px 10px #ff0}.adf-pdf-viewer .annotationLayer .textAnnotation img{position:absolute;cursor:pointer}.adf-pdf-viewer .annotationLayer .buttonWidgetAnnotation.checkBox input,.adf-pdf-viewer .annotationLayer .buttonWidgetAnnotation.radioButton input,.adf-pdf-viewer .annotationLayer .choiceWidgetAnnotation select,.adf-pdf-viewer .annotationLayer .textWidgetAnnotation input,.adf-pdf-viewer .annotationLayer .textWidgetAnnotation textarea{background-color:rgba(0,54,255,.13);border:1px solid transparent;box-sizing:border-box;font-size:9px;height:100%;margin:0;padding:0 3px;vertical-align:top;width:100%}.adf-pdf-viewer .annotationLayer .choiceWidgetAnnotation select option{padding:0}.adf-pdf-viewer .annotationLayer .buttonWidgetAnnotation.radioButton input{border-radius:50%}.adf-pdf-viewer .annotationLayer .textWidgetAnnotation textarea{font:message-box;font-size:9px;resize:none}.adf-pdf-viewer .annotationLayer .buttonWidgetAnnotation.checkBox input[disabled],.adf-pdf-viewer .annotationLayer .buttonWidgetAnnotation.radioButton input[disabled],.adf-pdf-viewer .annotationLayer .choiceWidgetAnnotation select[disabled],.adf-pdf-viewer .annotationLayer .textWidgetAnnotation input[disabled],.adf-pdf-viewer .annotationLayer .textWidgetAnnotation textarea[disabled]{background:0 0;border:1px solid transparent;cursor:not-allowed}.adf-pdf-viewer .annotationLayer .buttonWidgetAnnotation.checkBox input:hover,.adf-pdf-viewer .annotationLayer .buttonWidgetAnnotation.radioButton input:hover,.adf-pdf-viewer .annotationLayer .choiceWidgetAnnotation select:hover,.adf-pdf-viewer .annotationLayer .textWidgetAnnotation input:hover,.adf-pdf-viewer .annotationLayer .textWidgetAnnotation textarea:hover{border:1px solid #000}.adf-pdf-viewer .annotationLayer .choiceWidgetAnnotation select:focus,.adf-pdf-viewer .annotationLayer .textWidgetAnnotation input:focus,.adf-pdf-viewer .annotationLayer .textWidgetAnnotation textarea:focus{background:0 0;border:1px solid transparent}.adf-pdf-viewer .annotationLayer .buttonWidgetAnnotation.checkBox input:checked::after,.adf-pdf-viewer .annotationLayer .buttonWidgetAnnotation.checkBox input:checked::before,.adf-pdf-viewer .annotationLayer .buttonWidgetAnnotation.radioButton input:checked::before{background-color:#000;content:'';display:block;position:absolute}.adf-pdf-viewer .annotationLayer .buttonWidgetAnnotation.checkBox input:checked::after,.adf-pdf-viewer .annotationLayer .buttonWidgetAnnotation.checkBox input:checked::before{height:80%;left:45%;width:1px}.adf-pdf-viewer .annotationLayer .buttonWidgetAnnotation.checkBox input:checked::before{transform:rotate(45deg)}.adf-pdf-viewer .annotationLayer .buttonWidgetAnnotation.checkBox input:checked::after{transform:rotate(-45deg)}.adf-pdf-viewer .annotationLayer .buttonWidgetAnnotation.radioButton input:checked::before{border-radius:50%;height:50%;left:30%;top:20%;width:50%}.adf-pdf-viewer .annotationLayer .textWidgetAnnotation input.comb{font-family:monospace;padding-left:2px;padding-right:0}.adf-pdf-viewer .annotationLayer .textWidgetAnnotation input.comb:focus{width:115%}.adf-pdf-viewer .annotationLayer .buttonWidgetAnnotation.checkBox input,.adf-pdf-viewer .annotationLayer .buttonWidgetAnnotation.radioButton input{-webkit-appearance:none;-moz-appearance:none;appearance:none;padding:0}.adf-pdf-viewer .annotationLayer .popupWrapper{position:absolute;width:20em}.adf-pdf-viewer .annotationLayer .popup{position:absolute;z-index:200;max-width:20em;background-color:#ff9;box-shadow:0 2px 5px #888;border-radius:2px;padding:6px;margin-left:5px;cursor:pointer;font:message-box;font-size:9px;word-wrap:break-word}.adf-pdf-viewer .annotationLayer .popup>*{font-size:9px}.adf-pdf-viewer .annotationLayer .popup h1{display:inline-block}.adf-pdf-viewer .annotationLayer .popup span{display:inline-block;margin-left:5px}.adf-pdf-viewer .annotationLayer .popup p{border-top:1px solid #333;margin-top:2px;padding-top:2px}.adf-pdf-viewer .annotationLayer .caretAnnotation,.adf-pdf-viewer .annotationLayer .circleAnnotation svg ellipse,.adf-pdf-viewer .annotationLayer .fileAttachmentAnnotation,.adf-pdf-viewer .annotationLayer .freeTextAnnotation,.adf-pdf-viewer .annotationLayer .highlightAnnotation,.adf-pdf-viewer .annotationLayer .inkAnnotation svg polyline,.adf-pdf-viewer .annotationLayer .lineAnnotation svg line,.adf-pdf-viewer .annotationLayer .polygonAnnotation svg polygon,.adf-pdf-viewer .annotationLayer .polylineAnnotation svg polyline,.adf-pdf-viewer .annotationLayer .squareAnnotation svg rect,.adf-pdf-viewer .annotationLayer .squigglyAnnotation,.adf-pdf-viewer .annotationLayer .stampAnnotation,.adf-pdf-viewer .annotationLayer .strikeoutAnnotation,.adf-pdf-viewer .annotationLayer .underlineAnnotation{cursor:pointer}.adf-pdf-viewer .pdfViewer .canvasWrapper{overflow:hidden}.adf-pdf-viewer .pdfViewer .page{direction:ltr;width:816px;height:1056px;margin:1px auto -8px;position:relative;overflow:visible;border:9px solid transparent;background-clip:content-box;background-color:#fff}.adf-pdf-viewer .pdfViewer.removePageBorders .page{margin:0 auto 10px;border:none}.adf-pdf-viewer .pdfViewer.singlePageView{display:inline-block}.adf-pdf-viewer .pdfViewer.singlePageView .page{margin:0;border:none}.adf-pdf-viewer .pdfViewer.scrollHorizontal,.adf-pdf-viewer .pdfViewer.scrollWrapped,.adf-pdf-viewer .spread{margin-left:3.5px;margin-right:3.5px;text-align:center}.adf-pdf-viewer .pdfViewer.scrollHorizontal,.adf-pdf-viewer .spread{white-space:nowrap}.adf-pdf-viewer .pdfViewer.removePageBorders,.adf-pdf-viewer .pdfViewer.scrollHorizontal .spread,.adf-pdf-viewer .pdfViewer.scrollWrapped .spread{margin-left:0;margin-right:0}.adf-pdf-viewer .pdfViewer.scrollHorizontal .page,.adf-pdf-viewer .pdfViewer.scrollHorizontal .spread,.adf-pdf-viewer .pdfViewer.scrollWrapped .page,.adf-pdf-viewer .pdfViewer.scrollWrapped .spread,.adf-pdf-viewer .spread .page{display:inline-block;vertical-align:middle}.adf-pdf-viewer .pdfViewer.scrollHorizontal .page,.adf-pdf-viewer .pdfViewer.scrollWrapped .page,.adf-pdf-viewer .spread .page{margin-left:-3.5px;margin-right:-3.5px}.adf-pdf-viewer .pdfViewer.removePageBorders .spread .page,.adf-pdf-viewer .pdfViewer.removePageBorders.scrollHorizontal .page,.adf-pdf-viewer .pdfViewer.removePageBorders.scrollWrapped .page{margin-left:5px;margin-right:5px}.adf-pdf-viewer .pdfViewer .page canvas{margin:0;display:block}.adf-pdf-viewer .pdfViewer .page canvas[hidden]{display:none}.adf-pdf-viewer .pdfViewer .page .loadingIcon{position:absolute;display:block;left:0;top:0;right:0;bottom:0}.adf-pdf-viewer .pdfPresentationMode .pdfViewer{margin-left:0;margin-right:0}.adf-pdf-viewer .pdfPresentationMode .pdfViewer .page,.adf-pdf-viewer .pdfPresentationMode .pdfViewer .spread{display:block}.adf-pdf-viewer .pdfPresentationMode .pdfViewer .page,.adf-pdf-viewer .pdfPresentationMode .pdfViewer.removePageBorders .page{margin-left:auto;margin-right:auto}.adf-pdf-viewer .pdfPresentationMode:-ms-fullscreen .pdfViewer .page{margin-bottom:100%!important}.adf-pdf-viewer .pdfPresentationMode:-webkit-full-screen .pdfViewer .page{margin-bottom:100%;border:0}.adf-pdf-viewer .pdfPresentationMode:-moz-full-screen .pdfViewer .page{margin-bottom:100%;border:0}.adf-pdf-viewer .pdfPresentationMode:fullscreen .pdfViewer .page{margin-bottom:100%;border:0}.adf-pdf-viewer .textLayer{opacity:.2;position:absolute;left:0;top:0;right:0;bottom:0;overflow:hidden;opacity:.2;line-height:1;border:1px solid gray}.adf-pdf-viewer .textLayer>div{color:transparent;position:absolute;white-space:pre;cursor:text;transform-origin:0 0}.adf-pdf-viewer .textLayer .adf-highlight{margin:-1px;padding:1px;background-color:#b400aa;border-radius:4px}.adf-pdf-viewer .textLayer .adf-highlight.adf-begin{border-radius:4px 0 0 4px}.adf-pdf-viewer .textLayer .adf-highlight.adf-end{border-radius:0 4px 4px 0}.adf-pdf-viewer .textLayer .adf-highlight.adf-middle{border-radius:0}.adf-pdf-viewer .textLayer .adf-highlight.adf-selected{background-color:#006400}.adf-pdf-viewer .textLayer::selection{background:#00f}.adf-pdf-viewer .textLayer::-moz-selection{background:#00f}.adf-pdf-viewer .textLayer .adf-endOfContent{display:block;position:absolute;left:0;top:100%;right:0;bottom:0;z-index:-1;cursor:default;user-select:none;-webkit-user-select:none;-ms-user-select:none;-moz-user-select:none}.adf-pdf-viewer .textLayer .adf-endOfContent.adf-active{top:0}.adf-pdf-viewer .adf-annotationLayer section{position:absolute}.adf-pdf-viewer .adf-annotationLayer .adf-linkAnnotation>a{position:absolute;font-size:1em;top:0;left:0;width:100%;height:100%;background:url(data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7)}.adf-pdf-viewer .adf-annotationLayer .adf-linkAnnotation>a:hover{opacity:.2;background:#ff0;box-shadow:0 2px 10px #ff0}.adf-pdf-viewer .adf-annotationLayer .adf-textAnnotation img{position:absolute;cursor:pointer}.adf-pdf-viewer .adf-annotationLayer .adf-popupWrapper{position:absolute;width:20em}.adf-pdf-viewer .adf-annotationLayer .adf-popup{position:absolute;z-index:200;max-width:20em;background-color:#ff9;box-shadow:0 2px 5px #333;border-radius:2px;padding:.6em;margin-left:5px;cursor:pointer;word-wrap:break-word}.adf-pdf-viewer .adf-annotationLayer .adf-popup h1{font-size:1em;border-bottom:1px solid #000;padding-bottom:.2em}.adf-pdf-viewer .adf-annotationLayer .adf-popup p{padding-top:.2em}.adf-pdf-viewer .adf-annotationLayer .adf-fileAttachmentAnnotation,.adf-pdf-viewer .adf-annotationLayer .adf-highlightAnnotation,.adf-pdf-viewer .adf-annotationLayer .adf-squigglyAnnotation,.adf-pdf-viewer .adf-annotationLayer .adf-strikeoutAnnotation,.adf-pdf-viewer .adf-annotationLayer .adf-underlineAnnotation{cursor:pointer}.adf-pdf-viewer .adf-pdfViewer .canvasWrapper{overflow:hidden}.adf-pdf-viewer .adf-pdfViewer .page{direction:ltr;width:816px;height:1056px;margin:1px auto -8px;position:relative;overflow:visible;border:9px solid transparent;background-clip:content-box;background-color:#fff}.adf-pdf-viewer .adf-pdfViewer .page canvas{margin:0;display:block}.adf-pdf-viewer .adf-pdfViewer .page .adf-loadingIcon{position:absolute;display:block;left:0;top:0;right:0;bottom:0}.adf-pdf-viewer .adf-pdfViewer .page *{padding:0;margin:0}.adf-pdf-viewer .adf-pdfViewer.adf-removePageBorders .adf-page{margin:0 auto 10px;border:none}.adf-pdf-viewer .adf-pdfViewer .adf-loadingIcon{width:100px;height:100px;left:50%!important;top:50%!important;margin-top:-50px;margin-left:-50px;font-size:5px;text-indent:-9999em;border-top:1.1em solid rgba(3,0,2,.2);border-right:1.1em solid rgba(3,0,2,.2);border-bottom:1.1em solid rgba(3,0,2,.2);border-left:1.1em solid #030002;transform:translateZ(0);-webkit-animation:1.1s linear infinite load8;animation:1.1s linear infinite load8;border-radius:50%}.adf-pdf-viewer .adf-pdfViewer .adf-loadingIcon::after{border-radius:50%}.adf-pdf-viewer .adf-hidden,.adf-pdf-viewer [hidden]{display:none!important}@-webkit-keyframes load8{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}@keyframes load8{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}.adf-viewer-pdf-viewer{overflow:auto;-webkit-overflow-scrolling:touch;position:absolute;top:0;right:0;bottom:0;left:0;outline:0}html[dir=ltr] .adf-viewer-pdf-viewer{box-shadow:inset 1px 0 0 rgba(255,255,255,.05)}html[dir=rtl] .adf-viewer-pdf-viewer{box-shadow:inset -1px 0 0 rgba(255,255,255,.05)}"
        ]
      }
    ]
  }
];
/** @nocollapse */
PdfViewerComponent.ctorParameters = () => [
  { type: MatDialog },
  { type: RenderingQueueServices },
  { type: LogService },
  { type: AppConfigService }
];
PdfViewerComponent.propDecorators = {
  urlFile: [{ type: Input }],
  blobFile: [{ type: Input }],
  nameFile: [{ type: Input }],
  showToolbar: [{ type: Input }],
  allowThumbnails: [{ type: Input }],
  thumbnailsTemplate: [{ type: Input }],
  rendered: [{ type: Output }],
  error: [{ type: Output }],
  close: [{ type: Output }],
  handleKeyboardEvent: [
    { type: HostListener, args: ['document:keydown', ['$event']] }
  ]
};
if (false) {
  /** @type {?} */
  PdfViewerComponent.prototype.urlFile;
  /** @type {?} */
  PdfViewerComponent.prototype.blobFile;
  /** @type {?} */
  PdfViewerComponent.prototype.nameFile;
  /** @type {?} */
  PdfViewerComponent.prototype.showToolbar;
  /** @type {?} */
  PdfViewerComponent.prototype.allowThumbnails;
  /** @type {?} */
  PdfViewerComponent.prototype.thumbnailsTemplate;
  /** @type {?} */
  PdfViewerComponent.prototype.rendered;
  /** @type {?} */
  PdfViewerComponent.prototype.error;
  /** @type {?} */
  PdfViewerComponent.prototype.close;
  /** @type {?} */
  PdfViewerComponent.prototype.page;
  /** @type {?} */
  PdfViewerComponent.prototype.displayPage;
  /** @type {?} */
  PdfViewerComponent.prototype.totalPages;
  /** @type {?} */
  PdfViewerComponent.prototype.loadingPercent;
  /** @type {?} */
  PdfViewerComponent.prototype.pdfViewer;
  /** @type {?} */
  PdfViewerComponent.prototype.currentScaleMode;
  /** @type {?} */
  PdfViewerComponent.prototype.currentScale;
  /** @type {?} */
  PdfViewerComponent.prototype.MAX_AUTO_SCALE;
  /** @type {?} */
  PdfViewerComponent.prototype.DEFAULT_SCALE_DELTA;
  /** @type {?} */
  PdfViewerComponent.prototype.MIN_SCALE;
  /** @type {?} */
  PdfViewerComponent.prototype.MAX_SCALE;
  /** @type {?} */
  PdfViewerComponent.prototype.loadingTask;
  /** @type {?} */
  PdfViewerComponent.prototype.isPanelDisabled;
  /** @type {?} */
  PdfViewerComponent.prototype.showThumbnails;
  /** @type {?} */
  PdfViewerComponent.prototype.pdfThumbnailsContext;
  /** @type {?} */
  PdfViewerComponent.prototype.randomPdfId;
  /**
   * @type {?}
   * @private
   */
  PdfViewerComponent.prototype.dialog;
  /**
   * @type {?}
   * @private
   */
  PdfViewerComponent.prototype.renderingQueueServices;
  /**
   * @type {?}
   * @private
   */
  PdfViewerComponent.prototype.logService;
  /**
   * @type {?}
   * @private
   */
  PdfViewerComponent.prototype.appConfigService;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGRmLXZpZXdlci5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AYWxmcmVzY28vYWRmLWNvcmUvIiwic291cmNlcyI6WyJ2aWV3ZXIvY29tcG9uZW50cy9wZGYtdmlld2VyLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFpQkEsT0FBTyxFQUNILFNBQVMsRUFDVCxXQUFXLEVBQ1gsWUFBWSxFQUNaLE1BQU0sRUFDTixLQUFLLEVBR0wsaUJBQWlCLEVBQ2pCLFlBQVksRUFFZixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFDOUMsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBQ3hELE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLHNDQUFzQyxDQUFDO0FBQzlFLE9BQU8sRUFBRSwwQkFBMEIsRUFBRSxNQUFNLDhCQUE4QixDQUFDO0FBQzFFLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLHVDQUF1QyxDQUFDO0FBaUJ6RSxNQUFNLE9BQU8sa0JBQWtCOzs7Ozs7O0lBb0QzQixZQUNZLE1BQWlCLEVBQ2pCLHNCQUE4QyxFQUM5QyxVQUFzQixFQUN0QixnQkFBa0M7UUFIbEMsV0FBTSxHQUFOLE1BQU0sQ0FBVztRQUNqQiwyQkFBc0IsR0FBdEIsc0JBQXNCLENBQXdCO1FBQzlDLGVBQVUsR0FBVixVQUFVLENBQVk7UUFDdEIscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFrQjtRQTVDOUMsZ0JBQVcsR0FBWSxJQUFJLENBQUM7UUFHNUIsb0JBQWUsR0FBRyxLQUFLLENBQUM7UUFHeEIsdUJBQWtCLEdBQXFCLElBQUksQ0FBQztRQUc1QyxhQUFRLEdBQUcsSUFBSSxZQUFZLEVBQU8sQ0FBQztRQUduQyxVQUFLLEdBQUcsSUFBSSxZQUFZLEVBQU8sQ0FBQztRQUdoQyxVQUFLLEdBQUcsSUFBSSxZQUFZLEVBQU8s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QWdCLEVBQUU7Z0JBQ25DLGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJOzthQUN4Qzs7OztZQXBCUSxTQUFTO1lBRVQsc0JBQXNCO1lBRHRCLFVBQVU7WUFHVixnQkFBZ0I7OztzQkFtQnBCLEtBQUs7dUJBR0wsS0FBSzt1QkFHTCxLQUFLOzBCQUdMLEtBQUs7OEJBR0wsS0FBSztpQ0FHTCxLQUFLO3VCQUdMLE1BQU07b0JBR04sTUFBTTtvQkFHTixNQUFNO2tDQXFhTixZQUFZLFNBQUMsa0JBQWtCLEVBQUUsQ0FBQyxRQUFRLENBQUM7Ozs7SUE3YjVDLHFDQUNnQjs7SUFFaEIsc0NBQ2U7O0lBRWYsc0NBQ2lCOztJQUVqQix5Q0FDNEI7O0lBRTVCLDZDQUN3Qjs7SUFFeEIsZ0RBQzRDOztJQUU1QyxzQ0FDbUM7O0lBRW5DLG1DQUNnQzs7SUFFaEMsbUNBQ2dDOztJQUVoQyxrQ0FBYTs7SUFDYix5Q0FBb0I7O0lBQ3BCLHdDQUFtQjs7SUFDbkIsNENBQXVCOztJQUN2Qix1Q0FBZTs7SUFDZiw4Q0FBa0M7O0lBQ2xDLDBDQUF5Qjs7SUFFekIsNENBQThCOztJQUM5QixpREFBa0M7O0lBQ2xDLHVDQUF5Qjs7SUFDekIsdUNBQXlCOztJQUV6Qix5Q0FBaUI7O0lBQ2pCLDZDQUF1Qjs7SUFDdkIsNENBQWdDOztJQUNoQyxrREFBeUQ7O0lBQ3pELHlDQUFvQjs7Ozs7SUFPaEIsb0NBQXlCOzs7OztJQUN6QixvREFBc0Q7Ozs7O0lBQ3RELHdDQUE4Qjs7Ozs7SUFDOUIsOENBQTBDIiwic291cmNlc0NvbnRlbnQiOlsiLyohXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTkgQWxmcmVzY28gU29mdHdhcmUsIEx0ZC5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0IHtcbiAgICBDb21wb25lbnQsXG4gICAgVGVtcGxhdGVSZWYsXG4gICAgSG9zdExpc3RlbmVyLFxuICAgIE91dHB1dCxcbiAgICBJbnB1dCxcbiAgICBPbkNoYW5nZXMsXG4gICAgT25EZXN0cm95LFxuICAgIFZpZXdFbmNhcHN1bGF0aW9uLFxuICAgIEV2ZW50RW1pdHRlcixcbiAgICBTaW1wbGVDaGFuZ2VzXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTWF0RGlhbG9nIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwnO1xuaW1wb3J0IHsgTG9nU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2xvZy5zZXJ2aWNlJztcbmltcG9ydCB7IFJlbmRlcmluZ1F1ZXVlU2VydmljZXMgfSBmcm9tICcuLi9zZXJ2aWNlcy9yZW5kZXJpbmctcXVldWUuc2VydmljZXMnO1xuaW1wb3J0IHsgUGRmUGFzc3dvcmREaWFsb2dDb21wb25lbnQgfSBmcm9tICcuL3BkZi12aWV3ZXItcGFzc3dvcmQtZGlhbG9nJztcbmltcG9ydCB7IEFwcENvbmZpZ1NlcnZpY2UgfSBmcm9tICcuLy4uLy4uL2FwcC1jb25maWcvYXBwLWNvbmZpZy5zZXJ2aWNlJztcbmltcG9ydCB7IFBERkRvY3VtZW50UHJveHksIFBERlNvdXJjZSB9IGZyb20gJ3BkZmpzLWRpc3QnO1xuXG5kZWNsYXJlIGNvbnN0IHBkZmpzTGliOiBhbnk7XG5kZWNsYXJlIGNvbnN0IHBkZmpzVmlld2VyOiBhbnk7XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAnYWRmLXBkZi12aWV3ZXInLFxuICAgIHRlbXBsYXRlVXJsOiAnLi9wZGYtdmlld2VyLmNvbXBvbmVudC5odG1sJyxcbiAgICBzdHlsZVVybHM6IFtcbiAgICAgICAgJy4vcGRmLXZpZXdlci5jb21wb25lbnQuc2NzcycsXG4gICAgICAgICcuL3BkZi12aWV3ZXItaG9zdC5jb21wb25lbnQuc2NzcydcbiAgICBdLFxuICAgIHByb3ZpZGVyczogW1JlbmRlcmluZ1F1ZXVlU2VydmljZXNdLFxuICAgIGhvc3Q6IHsgJ2NsYXNzJzogJ2FkZi1wZGYtdmlld2VyJyB9LFxuICAgIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmVcbn0pXG5leHBvcnQgY2xhc3MgUGRmVmlld2VyQ29tcG9uZW50IGltcGxlbWVudHMgT25DaGFuZ2VzLCBPbkRlc3Ryb3kge1xuXG4gICAgQElucHV0KClcbiAgICB1cmxGaWxlOiBzdHJpbmc7XG5cbiAgICBASW5wdXQoKVxuICAgIGJsb2JGaWxlOiBCbG9iO1xuXG4gICAgQElucHV0KClcbiAgICBuYW1lRmlsZTogc3RyaW5nO1xuXG4gICAgQElucHV0KClcbiAgICBzaG93VG9vbGJhcjogYm9vbGVhbiA9IHRydWU7XG5cbiAgICBASW5wdXQoKVxuICAgIGFsbG93VGh1bWJuYWlscyA9IGZhbHNlO1xuXG4gICAgQElucHV0KClcbiAgICB0aHVtYm5haWxzVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT4gPSBudWxsO1xuXG4gICAgQE91dHB1dCgpXG4gICAgcmVuZGVyZWQgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcblxuICAgIEBPdXRwdXQoKVxuICAgIGVycm9yID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG5cbiAgICBAT3V0cHV0KClcbiAgICBjbG9zZSA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuXG4gICAgcGFnZTogbnVtYmVyO1xuICAgIGRpc3BsYXlQYWdlOiBudW1iZXI7XG4gICAgdG90YWxQYWdlczogbnVtYmVyO1xuICAgIGxvYWRpbmdQZXJjZW50OiBudW1iZXI7XG4gICAgcGRmVmlld2VyOiBhbnk7XG4gICAgY3VycmVudFNjYWxlTW9kZTogc3RyaW5nID0gJ2F1dG8nO1xuICAgIGN1cnJlbnRTY2FsZTogbnVtYmVyID0gMTtcblxuICAgIE1BWF9BVVRPX1NDQUxFOiBudW1iZXIgPSAxLjI1O1xuICAgIERFRkFVTFRfU0NBTEVfREVMVEE6IG51bWJlciA9IDEuMTtcbiAgICBNSU5fU0NBTEU6IG51bWJlciA9IDAuMjU7XG4gICAgTUFYX1NDQUxFOiBudW1iZXIgPSAxMC4wO1xuXG4gICAgbG9hZGluZ1Rhc2s6IGFueTtcbiAgICBpc1BhbmVsRGlzYWJsZWQgPSB0cnVlO1xuICAgIHNob3dUaHVtYm5haWxzOiBib29sZWFuID0gZmFsc2U7XG4gICAgcGRmVGh1bWJuYWlsc0NvbnRleHQ6IHsgdmlld2VyOiBhbnkgfSA9IHsgdmlld2VyOiBudWxsIH07XG4gICAgcmFuZG9tUGRmSWQ6IHN0cmluZztcblxuICAgIGdldCBjdXJyZW50U2NhbGVUZXh0KCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiBNYXRoLnJvdW5kKHRoaXMuY3VycmVudFNjYWxlICogMTAwKSArICclJztcbiAgICB9XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHJpdmF0ZSBkaWFsb2c6IE1hdERpYWxvZyxcbiAgICAgICAgcHJpdmF0ZSByZW5kZXJpbmdRdWV1ZVNlcnZpY2VzOiBSZW5kZXJpbmdRdWV1ZVNlcnZpY2VzLFxuICAgICAgICBwcml2YXRlIGxvZ1NlcnZpY2U6IExvZ1NlcnZpY2UsXG4gICAgICAgIHByaXZhdGUgYXBwQ29uZmlnU2VydmljZTogQXBwQ29uZmlnU2VydmljZSkge1xuICAgICAgICAvLyBuZWVkZWQgdG8gcHJlc2VydmUgXCJ0aGlzXCIgY29udGV4dFxuICAgICAgICB0aGlzLm9uUGFnZUNoYW5nZSA9IHRoaXMub25QYWdlQ2hhbmdlLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMub25QYWdlc0xvYWRlZCA9IHRoaXMub25QYWdlc0xvYWRlZC5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLm9uUGFnZVJlbmRlcmVkID0gdGhpcy5vblBhZ2VSZW5kZXJlZC5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLnJhbmRvbVBkZklkID0gdGhpcy5nZW5lcmF0ZVV1aWQoKTtcbiAgICAgICAgdGhpcy5jdXJyZW50U2NhbGUgPSB0aGlzLmdldFVzZXJTY2FsaW5nKCk7XG4gICAgfVxuXG4gICAgZ2V0VXNlclNjYWxpbmcoKTogbnVtYmVyIHtcbiAgICAgICAgY29uc3Qgc2NhbGVDb25maWcgPSB0aGlzLmFwcENvbmZpZ1NlcnZpY2UuZ2V0PG51bWJlcj4oJ2FkZi12aWV3ZXIucGRmLXZpZXdlci1zY2FsaW5nJywgdW5kZWZpbmVkKSAvIDEwMDtcbiAgICAgICAgaWYgKHNjYWxlQ29uZmlnKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jaGVja0xpbWl0cyhzY2FsZUNvbmZpZyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNoZWNrTGltaXRzKHNjYWxlQ29uZmlnOiBudW1iZXIpOiBudW1iZXIge1xuICAgICAgICBpZiAoc2NhbGVDb25maWcgPiB0aGlzLk1BWF9TQ0FMRSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuTUFYX1NDQUxFO1xuICAgICAgICB9IGVsc2UgaWYgKHNjYWxlQ29uZmlnIDwgdGhpcy5NSU5fU0NBTEUpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLk1JTl9TQ0FMRTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBzY2FsZUNvbmZpZztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcbiAgICAgICAgY29uc3QgYmxvYkZpbGUgPSBjaGFuZ2VzWydibG9iRmlsZSddO1xuXG4gICAgICAgIGlmIChibG9iRmlsZSAmJiBibG9iRmlsZS5jdXJyZW50VmFsdWUpIHtcbiAgICAgICAgICAgIGNvbnN0IHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XG4gICAgICAgICAgICByZWFkZXIub25sb2FkID0gYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHBkZlNvdXJjZTogUERGU291cmNlID0ge1xuICAgICAgICAgICAgICAgICAgICBkYXRhOiByZWFkZXIucmVzdWx0LFxuICAgICAgICAgICAgICAgICAgICB3aXRoQ3JlZGVudGlhbHM6IHRoaXMuYXBwQ29uZmlnU2VydmljZS5nZXQ8Ym9vbGVhbj4oJ2F1dGgud2l0aENyZWRlbnRpYWxzJywgdW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgdGhpcy5leGVjdXRlUGRmKHBkZlNvdXJjZSk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgcmVhZGVyLnJlYWRBc0FycmF5QnVmZmVyKGJsb2JGaWxlLmN1cnJlbnRWYWx1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB1cmxGaWxlID0gY2hhbmdlc1sndXJsRmlsZSddO1xuICAgICAgICBpZiAodXJsRmlsZSAmJiB1cmxGaWxlLmN1cnJlbnRWYWx1ZSkge1xuICAgICAgICAgICAgY29uc3QgcGRmU291cmNlOiBQREZTb3VyY2UgPSB7XG4gICAgICAgICAgICAgICAgdXJsOiB1cmxGaWxlLmN1cnJlbnRWYWx1ZSxcbiAgICAgICAgICAgICAgICB3aXRoQ3JlZGVudGlhbHM6IHRoaXMuYXBwQ29uZmlnU2VydmljZS5nZXQ8Ym9vbGVhbj4oJ2F1dGgud2l0aENyZWRlbnRpYWxzJywgdW5kZWZpbmVkKVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHRoaXMuZXhlY3V0ZVBkZihwZGZTb3VyY2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF0aGlzLnVybEZpbGUgJiYgIXRoaXMuYmxvYkZpbGUpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQXR0cmlidXRlIHVybEZpbGUgb3IgYmxvYkZpbGUgaXMgcmVxdWlyZWQnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGV4ZWN1dGVQZGYocGRmT3B0aW9uczogUERGU291cmNlKSB7XG4gICAgICAgIHBkZmpzTGliLkdsb2JhbFdvcmtlck9wdGlvbnMud29ya2VyU3JjID0gJ3BkZi53b3JrZXIubWluLmpzJztcblxuICAgICAgICB0aGlzLmxvYWRpbmdUYXNrID0gcGRmanNMaWIuZ2V0RG9jdW1lbnQocGRmT3B0aW9ucyk7XG5cbiAgICAgICAgdGhpcy5sb2FkaW5nVGFzay5vblBhc3N3b3JkID0gKGNhbGxiYWNrLCByZWFzb24pID0+IHtcbiAgICAgICAgICAgIHRoaXMub25QZGZQYXNzd29yZChjYWxsYmFjaywgcmVhc29uKTtcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLmxvYWRpbmdUYXNrLm9uUHJvZ3Jlc3MgPSAocHJvZ3Jlc3NEYXRhKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBsZXZlbCA9IHByb2dyZXNzRGF0YS5sb2FkZWQgLyBwcm9ncmVzc0RhdGEudG90YWw7XG4gICAgICAgICAgICB0aGlzLmxvYWRpbmdQZXJjZW50ID0gTWF0aC5yb3VuZChsZXZlbCAqIDEwMCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5sb2FkaW5nVGFzay5wcm9taXNlLnRoZW4oKHBkZkRvY3VtZW50OiBQREZEb2N1bWVudFByb3h5KSA9PiB7XG4gICAgICAgICAgICB0aGlzLnRvdGFsUGFnZXMgPSBwZGZEb2N1bWVudC5udW1QYWdlcztcbiAgICAgICAgICAgIHRoaXMucGFnZSA9IDE7XG4gICAgICAgICAgICB0aGlzLmRpc3BsYXlQYWdlID0gMTtcbiAgICAgICAgICAgIHRoaXMuaW5pdFBERlZpZXdlcihwZGZEb2N1bWVudCk7XG5cbiAgICAgICAgICAgIHBkZkRvY3VtZW50LmdldFBhZ2UoMSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5zY2FsZVBhZ2UoJ2F1dG8nKTtcbiAgICAgICAgICAgIH0sICgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmVycm9yLmVtaXQoKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH0sICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZXJyb3IuZW1pdCgpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBpbml0UERGVmlld2VyKHBkZkRvY3VtZW50OiBQREZEb2N1bWVudFByb3h5KSB7XG4gICAgICAgIGNvbnN0IHZpZXdlcjogYW55ID0gdGhpcy5nZXRWaWV3ZXIoKTtcbiAgICAgICAgY29uc3QgY29udGFpbmVyID0gdGhpcy5nZXREb2N1bWVudENvbnRhaW5lcigpO1xuXG4gICAgICAgIGlmICh2aWV3ZXIgJiYgY29udGFpbmVyKSB7XG4gICAgICAgICAgICB0aGlzLnBkZlZpZXdlciA9IG5ldyBwZGZqc1ZpZXdlci5QREZWaWV3ZXIoe1xuICAgICAgICAgICAgICAgIGNvbnRhaW5lcjogY29udGFpbmVyLFxuICAgICAgICAgICAgICAgIHZpZXdlcjogdmlld2VyLFxuICAgICAgICAgICAgICAgIHJlbmRlcmluZ1F1ZXVlOiB0aGlzLnJlbmRlcmluZ1F1ZXVlU2VydmljZXNcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyBjc3BlbGw6IGRpc2FibGUtbmV4dFxuICAgICAgICAgICAgdGhpcy5wZGZWaWV3ZXIuZXZlbnRCdXMub24oJ3BhZ2VjaGFuZ2luZycsIHRoaXMub25QYWdlQ2hhbmdlKTtcbiAgICAgICAgICAgIC8vIGNzcGVsbDogZGlzYWJsZS1uZXh0XG4gICAgICAgICAgICB0aGlzLnBkZlZpZXdlci5ldmVudEJ1cy5vbigncGFnZXNsb2FkZWQnLCB0aGlzLm9uUGFnZXNMb2FkZWQpO1xuICAgICAgICAgICAgLy8gY3NwZWxsOiBkaXNhYmxlLW5leHRcbiAgICAgICAgICAgIHRoaXMucGRmVmlld2VyLmV2ZW50QnVzLm9uKCd0ZXh0bGF5ZXJyZW5kZXJlZCcsIHRoaXMub25QYWdlUmVuZGVyZWQpO1xuXG4gICAgICAgICAgICB0aGlzLnJlbmRlcmluZ1F1ZXVlU2VydmljZXMuc2V0Vmlld2VyKHRoaXMucGRmVmlld2VyKTtcbiAgICAgICAgICAgIHRoaXMucGRmVmlld2VyLnNldERvY3VtZW50KHBkZkRvY3VtZW50KTtcbiAgICAgICAgICAgIHRoaXMucGRmVGh1bWJuYWlsc0NvbnRleHQudmlld2VyID0gdGhpcy5wZGZWaWV3ZXI7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBuZ09uRGVzdHJveSgpIHtcbiAgICAgICAgaWYgKHRoaXMucGRmVmlld2VyKSB7XG4gICAgICAgICAgICAvLyBjc3BlbGw6IGRpc2FibGUtbmV4dFxuICAgICAgICAgICAgdGhpcy5wZGZWaWV3ZXIuZXZlbnRCdXMub2ZmKCdwYWdlY2hhbmdpbmcnKTtcbiAgICAgICAgICAgIC8vIGNzcGVsbDogZGlzYWJsZS1uZXh0XG4gICAgICAgICAgICB0aGlzLnBkZlZpZXdlci5ldmVudEJ1cy5vZmYoJ3BhZ2VzbG9hZGVkJyk7XG4gICAgICAgICAgICAvLyBjc3BlbGw6IGRpc2FibGUtbmV4dFxuICAgICAgICAgICAgdGhpcy5wZGZWaWV3ZXIuZXZlbnRCdXMub2ZmKCd0ZXh0bGF5ZXJyZW5kZXJlZCcpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMubG9hZGluZ1Rhc2spIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgdGhpcy5sb2FkaW5nVGFzay5kZXN0cm95KCk7XG4gICAgICAgICAgICB9IGNhdGNoIHtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5sb2FkaW5nVGFzayA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB0b2dnbGVUaHVtYm5haWxzKCkge1xuICAgICAgICB0aGlzLnNob3dUaHVtYm5haWxzID0gIXRoaXMuc2hvd1RodW1ibmFpbHM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogTWV0aG9kIHRvIHNjYWxlIHRoZSBwYWdlIGN1cnJlbnQgc3VwcG9ydCBpbXBsZW1lbnRhdGlvblxuICAgICAqXG4gICAgICogQHBhcmFtIHNjYWxlTW9kZSAtIG5ldyBzY2FsZSBtb2RlXG4gICAgICovXG4gICAgc2NhbGVQYWdlKHNjYWxlTW9kZSkge1xuICAgICAgICB0aGlzLmN1cnJlbnRTY2FsZU1vZGUgPSBzY2FsZU1vZGU7XG5cbiAgICAgICAgY29uc3Qgdmlld2VyQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoYCR7dGhpcy5yYW5kb21QZGZJZH0tdmlld2VyLW1haW4tY29udGFpbmVyYCk7XG4gICAgICAgIGNvbnN0IGRvY3VtZW50Q29udGFpbmVyID0gdGhpcy5nZXREb2N1bWVudENvbnRhaW5lcigpO1xuXG4gICAgICAgIGlmICh0aGlzLnBkZlZpZXdlciAmJiBkb2N1bWVudENvbnRhaW5lcikge1xuXG4gICAgICAgICAgICBsZXQgd2lkdGhDb250YWluZXI7XG4gICAgICAgICAgICBsZXQgaGVpZ2h0Q29udGFpbmVyO1xuXG4gICAgICAgICAgICBpZiAodmlld2VyQ29udGFpbmVyICYmIHZpZXdlckNvbnRhaW5lci5jbGllbnRXaWR0aCA8PSBkb2N1bWVudENvbnRhaW5lci5jbGllbnRXaWR0aCkge1xuICAgICAgICAgICAgICAgIHdpZHRoQ29udGFpbmVyID0gdmlld2VyQ29udGFpbmVyLmNsaWVudFdpZHRoO1xuICAgICAgICAgICAgICAgIGhlaWdodENvbnRhaW5lciA9IHZpZXdlckNvbnRhaW5lci5jbGllbnRIZWlnaHQ7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHdpZHRoQ29udGFpbmVyID0gZG9jdW1lbnRDb250YWluZXIuY2xpZW50V2lkdGg7XG4gICAgICAgICAgICAgICAgaGVpZ2h0Q29udGFpbmVyID0gZG9jdW1lbnRDb250YWluZXIuY2xpZW50SGVpZ2h0O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBjdXJyZW50UGFnZSA9IHRoaXMucGRmVmlld2VyLl9wYWdlc1t0aGlzLnBkZlZpZXdlci5fY3VycmVudFBhZ2VOdW1iZXIgLSAxXTtcblxuICAgICAgICAgICAgY29uc3QgcGFkZGluZyA9IDIwO1xuICAgICAgICAgICAgY29uc3QgcGFnZVdpZHRoU2NhbGUgPSAod2lkdGhDb250YWluZXIgLSBwYWRkaW5nKSAvIGN1cnJlbnRQYWdlLndpZHRoICogY3VycmVudFBhZ2Uuc2NhbGU7XG4gICAgICAgICAgICBjb25zdCBwYWdlSGVpZ2h0U2NhbGUgPSAoaGVpZ2h0Q29udGFpbmVyIC0gcGFkZGluZykgLyBjdXJyZW50UGFnZS53aWR0aCAqIGN1cnJlbnRQYWdlLnNjYWxlO1xuXG4gICAgICAgICAgICBsZXQgc2NhbGUgPSB0aGlzLmdldFVzZXJTY2FsaW5nKCk7XG4gICAgICAgICAgICBpZiAoIXNjYWxlKSB7XG4gICAgICAgICAgICAgICAgc3dpdGNoICh0aGlzLmN1cnJlbnRTY2FsZU1vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAncGFnZS1hY3R1YWwnOlxuICAgICAgICAgICAgICAgICAgICAgICAgc2NhbGUgPSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ3BhZ2Utd2lkdGgnOlxuICAgICAgICAgICAgICAgICAgICAgICAgc2NhbGUgPSBwYWdlV2lkdGhTY2FsZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdwYWdlLWhlaWdodCc6XG4gICAgICAgICAgICAgICAgICAgICAgICBzY2FsZSA9IHBhZ2VIZWlnaHRTY2FsZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdwYWdlLWZpdCc6XG4gICAgICAgICAgICAgICAgICAgICAgICBzY2FsZSA9IE1hdGgubWluKHBhZ2VXaWR0aFNjYWxlLCBwYWdlSGVpZ2h0U2NhbGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2F1dG8nOlxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGhvcml6b250YWxTY2FsZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzTGFuZHNjYXBlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaG9yaXpvbnRhbFNjYWxlID0gTWF0aC5taW4ocGFnZUhlaWdodFNjYWxlLCBwYWdlV2lkdGhTY2FsZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhvcml6b250YWxTY2FsZSA9IHBhZ2VXaWR0aFNjYWxlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaG9yaXpvbnRhbFNjYWxlID0gTWF0aC5yb3VuZChob3Jpem9udGFsU2NhbGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2NhbGUgPSBNYXRoLm1pbih0aGlzLk1BWF9BVVRPX1NDQUxFLCBob3Jpem9udGFsU2NhbGUpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9nU2VydmljZS5lcnJvcigncGRmVmlld1NldFNjYWxlOiBcXCcnICsgc2NhbGVNb2RlICsgJ1xcJyBpcyBhbiB1bmtub3duIHpvb20gdmFsdWUuJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTY2FsZVVwZGF0ZVBhZ2VzKHNjYWxlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50U2NhbGUgPSAwO1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0U2NhbGVVcGRhdGVQYWdlcyhzY2FsZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGdldERvY3VtZW50Q29udGFpbmVyKCkge1xuICAgICAgICByZXR1cm4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoYCR7dGhpcy5yYW5kb21QZGZJZH0tdmlld2VyLXBkZi12aWV3ZXJgKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldFZpZXdlcigpIHtcbiAgICAgICAgcmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGAke3RoaXMucmFuZG9tUGRmSWR9LXZpZXdlci12aWV3ZXJQZGZgKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBVcGRhdGUgYWxsIHRoZSBwYWdlcyB3aXRoIHRoZSBuZXdTY2FsZSBzY2FsZVxuICAgICAqXG4gICAgICogQHBhcmFtIG5ld1NjYWxlIC0gbmV3IHNjYWxlIHBhZ2VcbiAgICAgKi9cbiAgICBzZXRTY2FsZVVwZGF0ZVBhZ2VzKG5ld1NjYWxlOiBudW1iZXIpIHtcbiAgICAgICAgaWYgKHRoaXMucGRmVmlld2VyKSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuaXNTYW1lU2NhbGUodGhpcy5jdXJyZW50U2NhbGUsIG5ld1NjYWxlKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudFNjYWxlID0gbmV3U2NhbGU7XG5cbiAgICAgICAgICAgICAgICB0aGlzLnBkZlZpZXdlci5fcGFnZXMuZm9yRWFjaChmdW5jdGlvbiAoY3VycmVudFBhZ2UpIHtcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudFBhZ2UudXBkYXRlKG5ld1NjYWxlKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5wZGZWaWV3ZXIudXBkYXRlKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDaGVjayBpZiB0aGUgcmVxdWVzdCBzY2FsZSBvZiB0aGUgcGFnZSBpcyB0aGUgc2FtZSBmb3IgYXZvaWQgdXNlbGVzcyByZS1yZW5kZXJpbmdcbiAgICAgKlxuICAgICAqIEBwYXJhbSBvbGRTY2FsZSAtIG9sZCBzY2FsZSBwYWdlXG4gICAgICogQHBhcmFtIG5ld1NjYWxlIC0gbmV3IHNjYWxlIHBhZ2VcbiAgICAgKlxuICAgICAqL1xuICAgIGlzU2FtZVNjYWxlKG9sZFNjYWxlOiBudW1iZXIsIG5ld1NjYWxlOiBudW1iZXIpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIChuZXdTY2FsZSA9PT0gb2xkU2NhbGUpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENoZWNrIGlmIGlzIGEgbGFuZCBzY2FwZSB2aWV3XG4gICAgICpcbiAgICAgKiBAcGFyYW0gd2lkdGhcbiAgICAgKiBAcGFyYW0gaGVpZ2h0XG4gICAgICovXG4gICAgaXNMYW5kc2NhcGUod2lkdGg6IG51bWJlciwgaGVpZ2h0OiBudW1iZXIpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuICh3aWR0aCA+IGhlaWdodCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogTWV0aG9kIHRyaWdnZXJlZCB3aGVuIHRoZSBwYWdlIGlzIHJlc2l6ZWRcbiAgICAgKi9cbiAgICBvblJlc2l6ZSgpIHtcbiAgICAgICAgdGhpcy5zY2FsZVBhZ2UodGhpcy5jdXJyZW50U2NhbGVNb2RlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiB0b2dnbGUgdGhlIGZpdCBwYWdlIHBkZlxuICAgICAqL1xuICAgIHBhZ2VGaXQoKSB7XG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRTY2FsZU1vZGUgIT09ICdwYWdlLWZpdCcpIHtcbiAgICAgICAgICAgIHRoaXMuc2NhbGVQYWdlKCdwYWdlLWZpdCcpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5zY2FsZVBhZ2UoJ2F1dG8nKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHpvb20gaW4gcGFnZSBwZGZcbiAgICAgKlxuICAgICAqIEBwYXJhbSB0aWNrc1xuICAgICAqL1xuICAgIHpvb21Jbih0aWNrcz86IG51bWJlcikge1xuICAgICAgICBsZXQgbmV3U2NhbGU6IGFueSA9IHRoaXMuY3VycmVudFNjYWxlO1xuICAgICAgICBkbyB7XG4gICAgICAgICAgICBuZXdTY2FsZSA9IChuZXdTY2FsZSAqIHRoaXMuREVGQVVMVF9TQ0FMRV9ERUxUQSkudG9GaXhlZCgyKTtcbiAgICAgICAgICAgIG5ld1NjYWxlID0gTWF0aC5jZWlsKG5ld1NjYWxlICogMTApIC8gMTA7XG4gICAgICAgICAgICBuZXdTY2FsZSA9IE1hdGgubWluKHRoaXMuTUFYX1NDQUxFLCBuZXdTY2FsZSk7XG4gICAgICAgIH0gd2hpbGUgKC0tdGlja3MgPiAwICYmIG5ld1NjYWxlIDwgdGhpcy5NQVhfU0NBTEUpO1xuICAgICAgICB0aGlzLmN1cnJlbnRTY2FsZU1vZGUgPSAnYXV0byc7XG4gICAgICAgIHRoaXMuc2V0U2NhbGVVcGRhdGVQYWdlcyhuZXdTY2FsZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogem9vbSBvdXQgcGFnZSBwZGZcbiAgICAgKlxuICAgICAqIEBwYXJhbSB0aWNrc1xuICAgICAqL1xuICAgIHpvb21PdXQodGlja3M/OiBudW1iZXIpIHtcbiAgICAgICAgbGV0IG5ld1NjYWxlOiBhbnkgPSB0aGlzLmN1cnJlbnRTY2FsZTtcbiAgICAgICAgZG8ge1xuICAgICAgICAgICAgbmV3U2NhbGUgPSAobmV3U2NhbGUgLyB0aGlzLkRFRkFVTFRfU0NBTEVfREVMVEEpLnRvRml4ZWQoMik7XG4gICAgICAgICAgICBuZXdTY2FsZSA9IE1hdGguZmxvb3IobmV3U2NhbGUgKiAxMCkgLyAxMDtcbiAgICAgICAgICAgIG5ld1NjYWxlID0gTWF0aC5tYXgodGhpcy5NSU5fU0NBTEUsIG5ld1NjYWxlKTtcbiAgICAgICAgfSB3aGlsZSAoLS10aWNrcyA+IDAgJiYgbmV3U2NhbGUgPiB0aGlzLk1JTl9TQ0FMRSk7XG4gICAgICAgIHRoaXMuY3VycmVudFNjYWxlTW9kZSA9ICdhdXRvJztcbiAgICAgICAgdGhpcy5zZXRTY2FsZVVwZGF0ZVBhZ2VzKG5ld1NjYWxlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBsb2FkIHRoZSBwcmV2aW91cyBwYWdlXG4gICAgICovXG4gICAgcHJldmlvdXNQYWdlKCkge1xuICAgICAgICBpZiAodGhpcy5wZGZWaWV3ZXIgJiYgdGhpcy5wYWdlID4gMSkge1xuICAgICAgICAgICAgdGhpcy5wYWdlLS07XG4gICAgICAgICAgICB0aGlzLmRpc3BsYXlQYWdlID0gdGhpcy5wYWdlO1xuXG4gICAgICAgICAgICB0aGlzLnBkZlZpZXdlci5jdXJyZW50UGFnZU51bWJlciA9IHRoaXMucGFnZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGxvYWQgdGhlIG5leHQgcGFnZVxuICAgICAqL1xuICAgIG5leHRQYWdlKCkge1xuICAgICAgICBpZiAodGhpcy5wZGZWaWV3ZXIgJiYgdGhpcy5wYWdlIDwgdGhpcy50b3RhbFBhZ2VzKSB7XG4gICAgICAgICAgICB0aGlzLnBhZ2UrKztcbiAgICAgICAgICAgIHRoaXMuZGlzcGxheVBhZ2UgPSB0aGlzLnBhZ2U7XG5cbiAgICAgICAgICAgIHRoaXMucGRmVmlld2VyLmN1cnJlbnRQYWdlTnVtYmVyID0gdGhpcy5wYWdlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogbG9hZCB0aGUgcGFnZSBpbiBpbnB1dFxuICAgICAqXG4gICAgICogQHBhcmFtIHBhZ2UgdG8gbG9hZFxuICAgICAqL1xuICAgIGlucHV0UGFnZShwYWdlOiBzdHJpbmcpIHtcbiAgICAgICAgY29uc3QgcGFnZUlucHV0ID0gcGFyc2VJbnQocGFnZSwgMTApO1xuXG4gICAgICAgIGlmICghaXNOYU4ocGFnZUlucHV0KSAmJiBwYWdlSW5wdXQgPiAwICYmIHBhZ2VJbnB1dCA8PSB0aGlzLnRvdGFsUGFnZXMpIHtcbiAgICAgICAgICAgIHRoaXMucGFnZSA9IHBhZ2VJbnB1dDtcbiAgICAgICAgICAgIHRoaXMuZGlzcGxheVBhZ2UgPSB0aGlzLnBhZ2U7XG4gICAgICAgICAgICB0aGlzLnBkZlZpZXdlci5jdXJyZW50UGFnZU51bWJlciA9IHRoaXMucGFnZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZGlzcGxheVBhZ2UgPSB0aGlzLnBhZ2U7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBQYWdlIENoYW5nZSBFdmVudFxuICAgICAqXG4gICAgICogQHBhcmFtIGV2ZW50XG4gICAgICovXG4gICAgb25QYWdlQ2hhbmdlKGV2ZW50OiBhbnkpIHtcbiAgICAgICAgaWYgKGV2ZW50LnNvdXJjZSAmJiBldmVudC5zb3VyY2UuY29udGFpbmVyLmlkID09PSBgJHt0aGlzLnJhbmRvbVBkZklkfS12aWV3ZXItcGRmLXZpZXdlcmApIHtcbiAgICAgICAgICAgIHRoaXMucGFnZSA9IGV2ZW50LnBhZ2VOdW1iZXI7XG4gICAgICAgICAgICB0aGlzLmRpc3BsYXlQYWdlID0gZXZlbnQucGFnZU51bWJlcjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9uUGRmUGFzc3dvcmQoY2FsbGJhY2ssIHJlYXNvbikge1xuICAgICAgICB0aGlzLmRpYWxvZ1xuICAgICAgICAgICAgLm9wZW4oUGRmUGFzc3dvcmREaWFsb2dDb21wb25lbnQsIHtcbiAgICAgICAgICAgICAgICB3aWR0aDogJzQwMHB4JyxcbiAgICAgICAgICAgICAgICBkYXRhOiB7IHJlYXNvbiB9XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmFmdGVyQ2xvc2VkKCkuc3Vic2NyaWJlKChwYXNzd29yZCkgPT4ge1xuICAgICAgICAgICAgaWYgKHBhc3N3b3JkKSB7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2socGFzc3dvcmQpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNsb3NlLmVtaXQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUGFnZSBSZW5kZXJlZCBFdmVudFxuICAgICAqL1xuICAgIG9uUGFnZVJlbmRlcmVkKCkge1xuICAgICAgICB0aGlzLnJlbmRlcmVkLmVtaXQoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBQYWdlcyBMb2FkZWQgRXZlbnRcbiAgICAgKlxuICAgICAqIEBwYXJhbSBldmVudFxuICAgICAqL1xuICAgIG9uUGFnZXNMb2FkZWQoKSB7XG4gICAgICAgIHRoaXMuaXNQYW5lbERpc2FibGVkID0gZmFsc2U7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogS2V5Ym9hcmQgRXZlbnQgTGlzdGVuZXJcbiAgICAgKiBAcGFyYW0gS2V5Ym9hcmRFdmVudCBldmVudFxuICAgICAqL1xuICAgIEBIb3N0TGlzdGVuZXIoJ2RvY3VtZW50OmtleWRvd24nLCBbJyRldmVudCddKVxuICAgIGhhbmRsZUtleWJvYXJkRXZlbnQoZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcbiAgICAgICAgY29uc3Qga2V5ID0gZXZlbnQua2V5Q29kZTtcbiAgICAgICAgaWYgKGtleSA9PT0gMzkpIHsgLy8gcmlnaHQgYXJyb3dcbiAgICAgICAgICAgIHRoaXMubmV4dFBhZ2UoKTtcbiAgICAgICAgfSBlbHNlIGlmIChrZXkgPT09IDM3KSB7Ly8gbGVmdCBhcnJvd1xuICAgICAgICAgICAgdGhpcy5wcmV2aW91c1BhZ2UoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgZ2VuZXJhdGVVdWlkKCkge1xuICAgICAgICByZXR1cm4gJ3h4eHh4eHh4LXh4eHgtNHh4eC15eHh4LXh4eHh4eHh4eHh4eCcucmVwbGFjZSgvW3h5XS9nLCBmdW5jdGlvbiAoYykge1xuICAgICAgICAgICAgY29uc3QgciA9IE1hdGgucmFuZG9tKCkgKiAxNiB8IDAsIHYgPSBjID09PSAneCcgPyByIDogKHIgJiAweDMgfCAweDgpO1xuICAgICAgICAgICAgcmV0dXJuIHYudG9TdHJpbmcoMTYpO1xuICAgICAgICB9KTtcbiAgICB9XG59XG4iXX0=
