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
  ContentChild,
  EventEmitter,
  HostListener,
  ElementRef,
  Input,
  Output,
  TemplateRef,
  ViewEncapsulation
} from '@angular/core';
import { BaseEvent } from '../../events';
import { AlfrescoApiService } from '../../services/alfresco-api.service';
import { LogService } from '../../services/log.service';
import { ViewerMoreActionsComponent } from './viewer-more-actions.component';
import { ViewerOpenWithComponent } from './viewer-open-with.component';
import { ViewerSidebarComponent } from './viewer-sidebar.component';
import { ViewerToolbarComponent } from './viewer-toolbar.component';
import { ViewUtilService } from '../services/view-util.service';
import { AppExtensionService } from '@alfresco/adf-extensions';
export class ViewerComponent {
  /**
   * @param {?} apiService
   * @param {?} viewUtils
   * @param {?} logService
   * @param {?} extensionService
   * @param {?} el
   */
  constructor(apiService, viewUtils, logService, extensionService, el) {
    this.apiService = apiService;
    this.viewUtils = viewUtils;
    this.logService = logService;
    this.extensionService = extensionService;
    this.el = el;
    /**
     * If you want to load an external file that does not come from ACS you
     * can use this URL to specify where to load the file from.
     */
    this.urlFile = '';
    /**
     * Viewer to use with the `urlFile` address (`pdf`, `image`, `media`, `text`).
     * Used when `urlFile` has no filename and extension.
     */
    this.urlFileViewer = null;
    /**
     * Node Id of the file to load.
     */
    this.nodeId = null;
    /**
     * Shared link id (to display shared file).
     */
    this.sharedLinkId = null;
    /**
     * If `true` then show the Viewer as a full page over the current content.
     * Otherwise fit inside the parent div.
     */
    this.overlayMode = false;
    /**
     * Hide or show the viewer
     */
    this.showViewer = true;
    /**
     * Hide or show the toolbar
     */
    this.showToolbar = true;
    /** @deprecated 3.2.0 */
    /**
     * Allows `back` navigation
     */
    this.allowGoBack = true;
    /**
     * Toggles downloading.
     */
    this.allowDownload = true;
    /**
     * Toggles printing.
     */
    this.allowPrint = false;
    /**
     * Toggles the 'Full Screen' feature.
     */
    this.allowFullScreen = true;
    /**
     * Toggles before/next navigation. You can use the arrow buttons to navigate
     * between documents in the collection.
     */
    this.allowNavigate = false;
    /**
     * Toggles the "before" ("<") button. Requires `allowNavigate` to be enabled.
     */
    this.canNavigateBefore = true;
    /**
     * Toggles the next (">") button. Requires `allowNavigate` to be enabled.
     */
    this.canNavigateNext = true;
    /**
     * Allow the left the sidebar.
     */
    this.allowLeftSidebar = false;
    /**
     * Allow the right sidebar.
     */
    this.allowRightSidebar = false;
    /**
     * Toggles PDF thumbnails.
     */
    this.allowThumbnails = true;
    /**
     * Toggles right sidebar visibility. Requires `allowRightSidebar` to be set to `true`.
     */
    this.showRightSidebar = false;
    /**
     * Toggles left sidebar visibility. Requires `allowLeftSidebar` to be set to `true`.
     */
    this.showLeftSidebar = false;
    /**
     * The template for the right sidebar. The template context contains the loaded node data.
     */
    this.sidebarRightTemplate = null;
    /**
     * The template for the left sidebar. The template context contains the loaded node data.
     */
    this.sidebarLeftTemplate = null;
    /**
     * The template for the pdf thumbnails.
     */
    this.thumbnailsTemplate = null;
    /**
     * Number of times the Viewer will retry fetching content Rendition.
     * There is a delay of at least one second between attempts.
     */
    this.maxRetries = 30;
    /**
     * Emitted when user clicks the 'Back' button.
     */
    this.goBack = new EventEmitter();
    /**
     * Emitted when user clicks the 'Print' button.
     */
    this.print = new EventEmitter();
    /**
     * Emitted when the viewer is shown or hidden.
     */
    this.showViewerChange = new EventEmitter();
    /**
     * Emitted when the filename extension changes.
     */
    this.extensionChange = new EventEmitter();
    /**
     * Emitted when user clicks 'Navigate Before' ("<") button.
     */
    this.navigateBefore = new EventEmitter();
    /**
     * Emitted when user clicks 'Navigate Next' (">") button.
     */
    this.navigateNext = new EventEmitter();
    /**
     * Emitted when the shared link used is not valid.
     */
    this.invalidSharedLink = new EventEmitter();
    this.TRY_TIMEOUT = 10000;
    this.viewerType = 'unknown';
    this.isLoading = false;
    this.extensionTemplates = [];
    this.externalExtensions = [];
    this.sidebarRightTemplateContext = { node: null };
    this.sidebarLeftTemplateContext = { node: null };
    this.viewerExtensions = [];
    this.subscriptions = [];
    // Extensions that are supported by the Viewer without conversion
    this.extensions = {
      image: ['png', 'jpg', 'jpeg', 'gif', 'bpm', 'svg'],
      media: ['wav', 'mp4', 'mp3', 'webm', 'ogg'],
      text: ['txt', 'xml', 'html', 'json', 'ts', 'css', 'md'],
      pdf: ['pdf']
    };
    // Mime types that are supported by the Viewer without conversion
    this.mimeTypes = {
      text: [
        'text/plain',
        'text/csv',
        'text/xml',
        'text/html',
        'application/x-javascript'
      ],
      pdf: ['application/pdf'],
      image: [
        'image/png',
        'image/jpeg',
        'image/gif',
        'image/bmp',
        'image/svg+xml'
      ],
      media: [
        'video/mp4',
        'video/webm',
        'video/ogg',
        'audio/mpeg',
        'audio/mp3',
        'audio/ogg',
        'audio/wav'
      ]
    };
  }
  /**
   * @return {?}
   */
  isSourceDefined() {
    return this.urlFile || this.blobFile || this.nodeId || this.sharedLinkId
      ? true
      : false;
  }
  /**
   * @return {?}
   */
  ngOnInit() {
    this.subscriptions.push(
      this.apiService.nodeUpdated.subscribe(
        /**
         * @param {?} node
         * @return {?}
         */
        node => this.onNodeUpdated(node)
      )
    );
    this.loadExtensions();
  }
  /**
   * @private
   * @return {?}
   */
  loadExtensions() {
    this.viewerExtensions = this.extensionService.getViewerExtensions();
    this.viewerExtensions.forEach(
      /**
       * @param {?} extension
       * @return {?}
       */
      extension => {
        this.externalExtensions.push(extension.fileExtension);
      }
    );
  }
  /**
   * @return {?}
   */
  ngOnDestroy() {
    this.subscriptions.forEach(
      /**
       * @param {?} subscription
       * @return {?}
       */
      subscription => subscription.unsubscribe()
    );
    this.subscriptions = [];
  }
  /**
   * @private
   * @param {?} node
   * @return {?}
   */
  onNodeUpdated(node) {
    if (node && node.id === this.nodeId) {
      this.generateCacheBusterNumber();
      this.isLoading = true;
      this.setUpNodeFile(node).then(
        /**
         * @return {?}
         */
        () => {
          this.isLoading = false;
        }
      );
    }
  }
  /**
   * @return {?}
   */
  ngOnChanges() {
    if (this.showViewer) {
      if (!this.isSourceDefined()) {
        throw new Error('A content source attribute value is missing.');
      }
      this.isLoading = true;
      if (this.blobFile) {
        this.setUpBlobData();
        this.isLoading = false;
      } else if (this.urlFile) {
        this.setUpUrlFile();
        this.isLoading = false;
      } else if (this.nodeId) {
        this.apiService.nodesApi
          .getNode(this.nodeId, { include: ['allowableOperations'] })
          .then(
            /**
             * @param {?} node
             * @return {?}
             */
            node => {
              this.nodeEntry = node;
              this.setUpNodeFile(node.entry).then(
                /**
                 * @return {?}
                 */
                () => {
                  this.isLoading = false;
                }
              );
            }
            /**
             * @return {?}
             */,
            () => {
              this.isLoading = false;
              this.logService.error('This node does not exist');
            }
          );
      } else if (this.sharedLinkId) {
        this.allowGoBack = false;
        this.apiService.sharedLinksApi.getSharedLink(this.sharedLinkId).then(
          /**
           * @param {?} sharedLinkEntry
           * @return {?}
           */
          sharedLinkEntry => {
            this.setUpSharedLinkFile(sharedLinkEntry);
            this.isLoading = false;
          }
          /**
           * @return {?}
           */,
          () => {
            this.isLoading = false;
            this.logService.error('This sharedLink does not exist');
            this.invalidSharedLink.next();
          }
        );
      }
    }
  }
  /**
   * @private
   * @return {?}
   */
  setUpBlobData() {
    this.fileTitle = this.getDisplayName('Unknown');
    this.mimeType = this.blobFile.type;
    this.viewerType = this.getViewerTypeByMimeType(this.mimeType);
    this.allowDownload = false;
    // TODO: wrap blob into the data url and allow downloading
    this.extensionChange.emit(this.mimeType);
    this.scrollTop();
  }
  /**
   * @private
   * @return {?}
   */
  setUpUrlFile() {
    /** @type {?} */
    const filenameFromUrl = this.getFilenameFromUrl(this.urlFile);
    this.fileTitle = this.getDisplayName(filenameFromUrl);
    this.extension = this.getFileExtension(filenameFromUrl);
    this.urlFileContent = this.urlFile;
    this.fileName = this.displayName;
    this.viewerType =
      this.urlFileViewer || this.getViewerTypeByExtension(this.extension);
    if (this.viewerType === 'unknown') {
      this.viewerType = this.getViewerTypeByMimeType(this.mimeType);
    }
    this.extensionChange.emit(this.extension);
    this.scrollTop();
  }
  /**
   * @private
   * @param {?} data
   * @return {?}
   */
  setUpNodeFile(data) {
    return tslib_1.__awaiter(this, void 0, void 0, function*() {
      /** @type {?} */
      let setupNode;
      if (data.content) {
        this.mimeType = data.content.mimeType;
      }
      this.fileTitle = this.getDisplayName(data.name);
      this.urlFileContent = this.apiService.contentApi.getContentUrl(data.id);
      this.urlFileContent = this.cacheBusterNumber
        ? this.urlFileContent + '&' + this.cacheBusterNumber
        : this.urlFileContent;
      this.extension = this.getFileExtension(data.name);
      this.fileName = data.name;
      this.viewerType = this.getViewerTypeByExtension(this.extension);
      if (this.viewerType === 'unknown') {
        this.viewerType = this.getViewerTypeByMimeType(this.mimeType);
      }
      if (this.viewerType === 'unknown') {
        setupNode = this.displayNodeRendition(data.id);
      }
      this.extensionChange.emit(this.extension);
      this.sidebarRightTemplateContext.node = data;
      this.sidebarLeftTemplateContext.node = data;
      this.scrollTop();
      return setupNode;
    });
  }
  /**
   * @private
   * @param {?} details
   * @return {?}
   */
  setUpSharedLinkFile(details) {
    this.mimeType = details.entry.content.mimeType;
    this.fileTitle = this.getDisplayName(details.entry.name);
    this.extension = this.getFileExtension(details.entry.name);
    this.fileName = details.entry.name;
    this.urlFileContent = this.apiService.contentApi.getSharedLinkContentUrl(
      this.sharedLinkId,
      false
    );
    this.viewerType = this.getViewerTypeByMimeType(this.mimeType);
    if (this.viewerType === 'unknown') {
      this.viewerType = this.getViewerTypeByExtension(this.extension);
    }
    if (this.viewerType === 'unknown') {
      this.displaySharedLinkRendition(this.sharedLinkId);
    }
    this.extensionChange.emit(this.extension);
  }
  /**
   * @return {?}
   */
  toggleSidebar() {
    this.showRightSidebar = !this.showRightSidebar;
    if (this.showRightSidebar && this.nodeId) {
      this.apiService
        .getInstance()
        .nodes.getNode(this.nodeId, { include: ['allowableOperations'] })
        .then(
          /**
           * @param {?} nodeEntry
           * @return {?}
           */
          nodeEntry => {
            this.sidebarRightTemplateContext.node = nodeEntry.entry;
          }
        );
    }
  }
  /**
   * @return {?}
   */
  toggleLeftSidebar() {
    this.showLeftSidebar = !this.showLeftSidebar;
    if (this.showRightSidebar && this.nodeId) {
      this.apiService
        .getInstance()
        .nodes.getNode(this.nodeId, { include: ['allowableOperations'] })
        .then(
          /**
           * @param {?} nodeEntry
           * @return {?}
           */
          nodeEntry => {
            this.sidebarLeftTemplateContext.node = nodeEntry.entry;
          }
        );
    }
  }
  /**
   * @private
   * @param {?} name
   * @return {?}
   */
  getDisplayName(name) {
    return this.displayName || name;
  }
  /**
   * @return {?}
   */
  scrollTop() {
    window.scrollTo(0, 1);
  }
  /**
   * @param {?} mimeType
   * @return {?}
   */
  getViewerTypeByMimeType(mimeType) {
    if (mimeType) {
      mimeType = mimeType.toLowerCase();
      /** @type {?} */
      const editorTypes = Object.keys(this.mimeTypes);
      for (const type of editorTypes) {
        if (this.mimeTypes[type].indexOf(mimeType) >= 0) {
          return type;
        }
      }
    }
    return 'unknown';
  }
  /**
   * @param {?} extension
   * @return {?}
   */
  getViewerTypeByExtension(extension) {
    if (extension) {
      extension = extension.toLowerCase();
    }
    if (this.isCustomViewerExtension(extension)) {
      return 'custom';
    }
    if (this.extensions.image.indexOf(extension) >= 0) {
      return 'image';
    }
    if (this.extensions.media.indexOf(extension) >= 0) {
      return 'media';
    }
    if (this.extensions.text.indexOf(extension) >= 0) {
      return 'text';
    }
    if (this.extensions.pdf.indexOf(extension) >= 0) {
      return 'pdf';
    }
    return 'unknown';
  }
  /**
   * @return {?}
   */
  onBackButtonClick() {
    this.close();
  }
  /**
   * @param {?} event
   * @return {?}
   */
  onNavigateBeforeClick(event) {
    this.navigateBefore.next(event);
  }
  /**
   * @param {?} event
   * @return {?}
   */
  onNavigateNextClick(event) {
    this.navigateNext.next(event);
  }
  /**
   * close the viewer
   * @return {?}
   */
  close() {
    if (this.otherMenu) {
      this.otherMenu.hidden = false;
    }
    this.showViewer = false;
    this.showViewerChange.emit(this.showViewer);
  }
  /**
   * get File name from url
   *
   * @param {?} url - url file
   * @return {?}
   */
  getFilenameFromUrl(url) {
    /** @type {?} */
    const anchor = url.indexOf('#');
    /** @type {?} */
    const query = url.indexOf('?');
    /** @type {?} */
    const end = Math.min(
      anchor > 0 ? anchor : url.length,
      query > 0 ? query : url.length
    );
    return url.substring(url.lastIndexOf('/', end) + 1, end);
  }
  /**
   * Get file extension from the string.
   * Supports the URL formats like:
   * http://localhost/test.jpg?cache=1000
   * http://localhost/test.jpg#cache=1000
   *
   * @param {?} fileName - file name
   * @return {?}
   */
  getFileExtension(fileName) {
    if (fileName) {
      /** @type {?} */
      const match = fileName.match(/\.([^\./\?\#]+)($|\?|\#)/);
      return match ? match[1] : null;
    }
    return null;
  }
  /**
   * @param {?} extension
   * @return {?}
   */
  isCustomViewerExtension(extension) {
    /** @type {?} */
    const extensions = this.externalExtensions || [];
    if (extension && extensions.length > 0) {
      extension = extension.toLowerCase();
      return extensions.flat().indexOf(extension) >= 0;
    }
    return false;
  }
  /**
   * Keyboard event listener
   * @param {?} event
   * @return {?}
   */
  handleKeyboardEvent(event) {
    /** @type {?} */
    const key = event.keyCode;
    // Esc
    if (key === 27 && this.overlayMode) {
      // esc
      this.close();
    }
    // Left arrow
    if (key === 37 && this.canNavigateBefore) {
      event.preventDefault();
      this.onNavigateBeforeClick(event);
    }
    // Right arrow
    if (key === 39 && this.canNavigateNext) {
      event.preventDefault();
      this.onNavigateNextClick(event);
    }
    // Ctrl+F
    if (key === 70 && event.ctrlKey) {
      event.preventDefault();
      this.enterFullScreen();
    }
  }
  /**
   * @return {?}
   */
  printContent() {
    if (this.allowPrint) {
      /** @type {?} */
      const args = new BaseEvent();
      this.print.next(args);
      if (!args.defaultPrevented) {
        this.viewUtils.printFileGeneric(this.nodeId, this.mimeType);
      }
    }
  }
  /**
   * Triggers full screen mode with a main content area displayed.
   * @return {?}
   */
  enterFullScreen() {
    if (this.allowFullScreen) {
      /** @type {?} */
      const container = this.el.nativeElement.querySelector(
        '.adf-viewer__fullscreen-container'
      );
      if (container) {
        if (container.requestFullscreen) {
          container.requestFullscreen();
        } else if (container.webkitRequestFullscreen) {
          container.webkitRequestFullscreen();
        } else if (container.mozRequestFullScreen) {
          container.mozRequestFullScreen();
        } else if (container.msRequestFullscreen) {
          container.msRequestFullscreen();
        }
      }
    }
  }
  /**
   * @private
   * @param {?} nodeId
   * @return {?}
   */
  displayNodeRendition(nodeId) {
    return tslib_1.__awaiter(this, void 0, void 0, function*() {
      try {
        /** @type {?} */
        const rendition = yield this.resolveRendition(nodeId, 'pdf');
        if (rendition) {
          /** @type {?} */
          const renditionId = rendition.entry.id;
          if (renditionId === 'pdf') {
            this.viewerType = 'pdf';
          } else if (renditionId === 'imgpreview') {
            this.viewerType = 'image';
          }
          this.urlFileContent = this.apiService.contentApi.getRenditionUrl(
            nodeId,
            renditionId
          );
        }
      } catch (err) {
        this.logService.error(err);
      }
    });
  }
  /**
   * @private
   * @param {?} sharedId
   * @return {?}
   */
  displaySharedLinkRendition(sharedId) {
    return tslib_1.__awaiter(this, void 0, void 0, function*() {
      try {
        /** @type {?} */
        const rendition = yield this.apiService.renditionsApi.getSharedLinkRendition(
          sharedId,
          'pdf'
        );
        if (rendition.entry.status.toString() === 'CREATED') {
          this.viewerType = 'pdf';
          this.urlFileContent = this.apiService.contentApi.getSharedLinkRenditionUrl(
            sharedId,
            'pdf'
          );
        }
      } catch (error) {
        this.logService.error(error);
        try {
          /** @type {?} */
          const rendition = yield this.apiService.renditionsApi.getSharedLinkRendition(
            sharedId,
            'imgpreview'
          );
          if (rendition.entry.status.toString() === 'CREATED') {
            this.viewerType = 'image';
            this.urlFileContent = this.apiService.contentApi.getSharedLinkRenditionUrl(
              sharedId,
              'imgpreview'
            );
          }
        } catch (error) {
          this.logService.error(error);
        }
      }
    });
  }
  /**
   * @private
   * @param {?} nodeId
   * @param {?} renditionId
   * @return {?}
   */
  resolveRendition(nodeId, renditionId) {
    return tslib_1.__awaiter(this, void 0, void 0, function*() {
      renditionId = renditionId.toLowerCase();
      /** @type {?} */
      const supportedRendition = yield this.apiService.renditionsApi.getRenditions(
        nodeId
      );
      /** @type {?} */
      let rendition = supportedRendition.list.entries.find(
        /**
         * @param {?} renditionEntry
         * @return {?}
         */
        (renditionEntry =>
          renditionEntry.entry.id.toLowerCase() === renditionId)
      );
      if (!rendition) {
        renditionId = 'imgpreview';
        rendition = supportedRendition.list.entries.find(
          /**
           * @param {?} renditionEntry
           * @return {?}
           */
          renditionEntry =>
            renditionEntry.entry.id.toLowerCase() === renditionId
        );
      }
      if (rendition) {
        /** @type {?} */
        const status = rendition.entry.status.toString();
        if (status === 'NOT_CREATED') {
          try {
            yield this.apiService.renditionsApi
              .createRendition(nodeId, { id: renditionId })
              .then(
                /**
                 * @return {?}
                 */
                () => {
                  this.viewerType = 'in_creation';
                }
              );
            rendition = yield this.waitRendition(nodeId, renditionId);
          } catch (err) {
            this.logService.error(err);
          }
        }
      }
      return rendition;
    });
  }
  /**
   * @private
   * @param {?} nodeId
   * @param {?} renditionId
   * @return {?}
   */
  waitRendition(nodeId, renditionId) {
    return tslib_1.__awaiter(this, void 0, void 0, function*() {
      /** @type {?} */
      let currentRetry = 0;
      return new Promise
      /**
       * @param {?} resolve
       * @param {?} reject
       * @return {?}
       */((resolve, reject) => {
        /** @type {?} */
        const intervalId = setInterval(
          /**
           * @return {?}
           */
          (() => {
            currentRetry++;
            if (this.maxRetries >= currentRetry) {
              this.apiService.renditionsApi
                .getRendition(nodeId, renditionId)
                .then(
                  /**
                   * @param {?} rendition
                   * @return {?}
                   */
                  rendition => {
                    /** @type {?} */
                    const status = rendition.entry.status.toString();
                    if (status === 'CREATED') {
                      if (renditionId === 'pdf') {
                        this.viewerType = 'pdf';
                      } else if (renditionId === 'imgpreview') {
                        this.viewerType = 'image';
                      }
                      this.urlFileContent = this.apiService.contentApi.getRenditionUrl(
                        nodeId,
                        renditionId
                      );
                      clearInterval(intervalId);
                      return resolve(rendition);
                    }
                  }
                  /**
                   * @return {?}
                   */,
                  () => {
                    this.viewerType = 'error_in_creation';
                    return reject();
                  }
                );
            } else {
              this.isLoading = false;
              this.viewerType = 'error_in_creation';
              clearInterval(intervalId);
            }
          }),
          this.TRY_TIMEOUT
        );
      });
    });
  }
  /**
   * @param {?} extensionAllowed
   * @return {?}
   */
  checkExtensions(extensionAllowed) {
    if (typeof extensionAllowed === 'string') {
      return this.extension.toLowerCase() === extensionAllowed.toLowerCase();
    } else if (extensionAllowed.length > 0) {
      return extensionAllowed.find(
        /**
         * @param {?} currentExtension
         * @return {?}
         */
        currentExtension => {
          return (
            this.extension.toLowerCase() === currentExtension.toLowerCase()
          );
        }
      );
    }
  }
  /**
   * @private
   * @return {?}
   */
  generateCacheBusterNumber() {
    this.cacheBusterNumber = Date.now();
  }
}
ViewerComponent.decorators = [
  {
    type: Component,
    args: [
      {
        selector: 'adf-viewer',
        template:
          '<div *ngIf="showViewer"\n     class="adf-viewer-container"\n     [class.adf-viewer-overlay-container]="overlayMode"\n     [class.adf-viewer-inline-container]="!overlayMode">\n\n    <div class="adf-viewer-content" fxLayout="column" [cdkTrapFocus]="overlayMode" cdkTrapFocusAutoCapture>\n        <ng-content select="adf-viewer-toolbar"></ng-content>\n        <ng-container *ngIf="showToolbar && !toolbar">\n            <adf-toolbar color="default" id="adf-viewer-toolbar" class="adf-viewer-toolbar">\n\n                <adf-toolbar-title>\n\n                    <ng-container *ngIf="allowLeftSidebar">\n                        <button\n                            mat-icon-button\n                            [attr.aria-expanded]="showLeftSidebar"\n                            [attr.aria-label]="\'ADF_VIEWER.ACTIONS.INFO\' | translate"\n                            title="{{ \'ADF_VIEWER.ACTIONS.INFO\' | translate }}"\n                            data-automation-id="adf-toolbar-left-sidebar"\n                            [color]="showLeftSidebar ? \'accent\' : \'default\'"\n                            (click)="toggleLeftSidebar()">\n                            <mat-icon>info_outline</mat-icon>\n                        </button>\n                    </ng-container>\n\n                    <button *ngIf="allowGoBack"\n                            class="adf-viewer-close-button"\n                            data-automation-id="adf-toolbar-back"\n                            [attr.aria-label]="\'ADF_VIEWER.ACTIONS.CLOSE\' | translate"\n                            mat-icon-button\n                            title="{{ \'ADF_VIEWER.ACTIONS.CLOSE\' | translate }}"\n                            (click)="onBackButtonClick()">\n                        <mat-icon>close</mat-icon>\n                    </button>\n                </adf-toolbar-title>\n\n                <div fxFlex="1 1 auto" class="adf-viewer__file-title">\n                    <button\n                        *ngIf="allowNavigate && canNavigateBefore"\n                        data-automation-id="adf-toolbar-pref-file"\n                        mat-icon-button\n                        [attr.aria-label]="\'ADF_VIEWER.ACTIONS.PREV_FILE\' | translate"\n                        title="{{ \'ADF_VIEWER.ACTIONS.PREV_FILE\' | translate }}"\n                        (click)="onNavigateBeforeClick($event)">\n                        <mat-icon>navigate_before</mat-icon>\n                    </button>\n                    <img class="adf-viewer__mimeicon" [alt]="mimeType" [src]="mimeType | adfMimeTypeIcon" data-automation-id="adf-file-thumbnail">\n                    <span class="adf-viewer__display-name" id="adf-viewer-display-name">{{ fileTitle }}</span>\n                    <button\n                        *ngIf="allowNavigate && canNavigateNext"\n                        data-automation-id="adf-toolbar-next-file"\n                        mat-icon-button\n                        [attr.aria-label]="\'ADF_VIEWER.ACTIONS.NEXT_FILE\' | translate"\n                        title="{{ \'ADF_VIEWER.ACTIONS.NEXT_FILE\' | translate }}"\n                        (click)="onNavigateNextClick($event)">\n                        <mat-icon>navigate_next</mat-icon>\n                    </button>\n                </div>\n\n                <ng-content select="adf-viewer-toolbar-actions"></ng-content>\n\n                <ng-container *ngIf="mnuOpenWith" data-automation-id=\'adf-toolbar-custom-btn\'>\n                    <button\n                        id="adf-viewer-openwith"\n                        mat-button\n                        [matMenuTriggerFor]="mnuOpenWith"\n                        data-automation-id="adf-toolbar-open-with">\n                        <span>{{ \'ADF_VIEWER.ACTIONS.OPEN_WITH\' | translate }}</span>\n                        <mat-icon>arrow_drop_down</mat-icon>\n                    </button>\n                    <mat-menu #mnuOpenWith="matMenu" [overlapTrigger]="false">\n                        <ng-content select="adf-viewer-open-with"></ng-content>\n                    </mat-menu>\n                </ng-container>\n\n                <adf-toolbar-divider></adf-toolbar-divider>\n\n                <button\n                    id="adf-viewer-download"\n                    *ngIf="allowDownload"\n                    mat-icon-button\n                    [attr.aria-label]="\'ADF_VIEWER.ACTIONS.DOWNLOAD\' | translate"\n                    title="{{ \'ADF_VIEWER.ACTIONS.DOWNLOAD\' | translate }}"\n                    data-automation-id="adf-toolbar-download"\n                    [adfNodeDownload]="nodeEntry">\n                    <mat-icon>file_download</mat-icon>\n                </button>\n\n                <button\n                    id="adf-viewer-print"\n                    *ngIf="allowPrint"\n                    mat-icon-button\n                    [attr.aria-label]="\'ADF_VIEWER.ACTIONS.PRINT\' | translate"\n                    title="{{ \'ADF_VIEWER.ACTIONS.PRINT\' | translate }}"\n                    data-automation-id="adf-toolbar-print"\n                    (click)="printContent()">\n                    <mat-icon>print</mat-icon>\n                </button>\n\n                <button\n                    id="adf-viewer-fullscreen"\n                    *ngIf="viewerType !== \'media\' && allowFullScreen"\n                    mat-icon-button\n                    [attr.aria-label]="\'ADF_VIEWER.ACTIONS.FULLSCREEN\' | translate"\n                    title="{{ \'ADF_VIEWER.ACTIONS.FULLSCREEN\' | translate }}"\n                    data-automation-id="adf-toolbar-fullscreen"\n                    (click)="enterFullScreen()">\n                    <mat-icon>fullscreen</mat-icon>\n                </button>\n\n                <ng-container *ngIf="allowRightSidebar">\n                    <adf-toolbar-divider></adf-toolbar-divider>\n\n                    <button\n                        mat-icon-button\n                        [attr.aria-expanded]="showRightSidebar"\n                        [attr.aria-label]="\'ADF_VIEWER.ACTIONS.INFO\' | translate"\n                        title="{{ \'ADF_VIEWER.ACTIONS.INFO\' | translate }}"\n                        data-automation-id="adf-toolbar-sidebar"\n                        [color]="showRightSidebar ? \'accent\' : \'default\'"\n                        (click)="toggleSidebar()">\n                        <mat-icon>info_outline</mat-icon>\n                    </button>\n\n                </ng-container>\n\n                <ng-container *ngIf="mnuMoreActions">\n                    <button\n                        id="adf-viewer-moreactions"\n                        mat-icon-button\n                        [matMenuTriggerFor]="mnuMoreActions"\n                        [attr.aria-label]="\'ADF_VIEWER.ACTIONS.MORE_ACTIONS\' | translate"\n                        title="{{ \'ADF_VIEWER.ACTIONS.MORE_ACTIONS\' | translate }}"\n                        data-automation-id="adf-toolbar-more-actions">\n                        <mat-icon>more_vert</mat-icon>\n                    </button>\n                    <mat-menu #mnuMoreActions="matMenu" [overlapTrigger]="false">\n                        <ng-content select="adf-viewer-more-actions"></ng-content>\n                    </mat-menu>\n                </ng-container>\n\n            </adf-toolbar>\n        </ng-container>\n\n        <div fxLayout="row" fxFlex="1 1 auto">\n            <ng-container *ngIf="allowRightSidebar && showRightSidebar">\n                <div class="adf-viewer__sidebar" [ngClass]="\'adf-viewer__sidebar__right\'" fxFlexOrder="4"  id="adf-right-sidebar" >\n                    <ng-container *ngIf="sidebarRightTemplate">\n                        <ng-container *ngTemplateOutlet="sidebarRightTemplate;context:sidebarRightTemplateContext"></ng-container>\n                    </ng-container>\n                    <ng-content *ngIf="!sidebarRightTemplate" select="adf-viewer-sidebar"></ng-content>\n                </div>\n            </ng-container>\n\n            <ng-container *ngIf="allowLeftSidebar && showLeftSidebar">\n                <div class="adf-viewer__sidebar" [ngClass]="\'adf-viewer__sidebar__left\'" fxFlexOrder="1"  id="adf-left-sidebar" >\n                    <ng-container *ngIf="sidebarLeftTemplate">\n                        <ng-container *ngTemplateOutlet="sidebarLeftTemplate;context:sidebarLeftTemplateContext"></ng-container>\n                    </ng-container>\n                    <ng-content *ngIf="!sidebarLeftTemplate" select="adf-viewer-sidebar"></ng-content>\n                </div>\n            </ng-container>\n\n            <div  *ngIf="isLoading"  class="adf-viewer-main" fxFlexOrder="1" fxFlex="1 1 auto">\n                <div class="adf-viewer-layout-content adf-viewer__fullscreen-container">\n                    <div class="adf-viewer-content-container">\n                        <ng-container *ngIf="isLoading">\n                            <div class="adf-viewer__loading-screen" fxFlex="1 1 auto">\n                                <h2>{{ \'ADF_VIEWER.LOADING\' | translate }}</h2>\n                                <div>\n                                    <mat-spinner></mat-spinner>\n                                </div>\n                            </div>\n                        </ng-container>\n\n                    </div>\n                </div>\n            </div>\n\n            <div  *ngIf="!isLoading"  class="adf-viewer-main" fxFlexOrder="1" fxFlex="1 1 auto">\n                <div class="adf-viewer-layout-content adf-viewer__fullscreen-container">\n                    <div class="adf-viewer-content-container" [ngSwitch]="viewerType">\n\n                        <ng-container *ngSwitchCase="\'pdf\'">\n                            <adf-pdf-viewer (close)="onBackButtonClick()" [thumbnailsTemplate]="thumbnailsTemplate" [allowThumbnails]="allowThumbnails" [blobFile]="blobFile" [urlFile]="urlFileContent" [nameFile]="displayName"></adf-pdf-viewer>\n                        </ng-container>\n\n                        <ng-container *ngSwitchCase="\'image\'">\n                            <adf-img-viewer [urlFile]="urlFileContent" [nameFile]="displayName" [blobFile]="blobFile"></adf-img-viewer>\n                        </ng-container>\n\n                        <ng-container *ngSwitchCase="\'media\'">\n                            <adf-media-player id="adf-mdedia-player" [urlFile]="urlFileContent" [mimeType]="mimeType" [blobFile]="blobFile" [nameFile]="displayName"></adf-media-player>\n                        </ng-container>\n\n                        <ng-container *ngSwitchCase="\'text\'">\n                            <adf-txt-viewer [urlFile]="urlFileContent" [blobFile]="blobFile"></adf-txt-viewer>\n                        </ng-container>\n\n                        <ng-container *ngSwitchCase="\'in_creation\'">\n                            <div class="adf-viewer__loading-screen" fxFlex="1 1 auto">\n                                <h2>{{ \'ADF_VIEWER.LOADING\' | translate }}</h2>\n                                <div>\n                                    <mat-spinner></mat-spinner>\n                                </div>\n                            </div>\n                        </ng-container>\n\n                        <ng-container *ngSwitchCase="\'custom\'">\n                            <ng-container *ngFor="let ext of viewerExtensions">\n                                <adf-preview-extension\n                                    *ngIf="checkExtensions(ext.fileExtension)"\n                                    [id]="ext.component"\n                                    [node]="nodeEntry.entry"\n                                    [url]="urlFileContent"\n                                    [extension]="extension"\n                                    [attr.data-automation-id]="ext.component">\n                                </adf-preview-extension>\n                            </ng-container>\n\n                            <span class="adf-viewer-custom-content" *ngFor="let extensionTemplate of extensionTemplates">\n                                <ng-template\n                                    *ngIf="extensionTemplate.isVisible"\n                                    [ngTemplateOutlet]="extensionTemplate.template"\n                                    [ngTemplateOutletContext]="{ urlFileContent: urlFileContent, extension:extension }">\n                                </ng-template>\n                            </span>\n                        </ng-container>\n\n                        <ng-container *ngSwitchDefault>\n                            <adf-viewer-unknown-format></adf-viewer-unknown-format>\n                        </ng-container>\n                    </div>\n                </div>\n            </div>\n\n        </div>\n    </div>\n</div>\n',
        host: { class: 'adf-viewer' },
        encapsulation: ViewEncapsulation.None,
        styles: ['']
      }
    ]
  }
];
/** @nocollapse */
ViewerComponent.ctorParameters = () => [
  { type: AlfrescoApiService },
  { type: ViewUtilService },
  { type: LogService },
  { type: AppExtensionService },
  { type: ElementRef }
];
ViewerComponent.propDecorators = {
  toolbar: [{ type: ContentChild, args: [ViewerToolbarComponent] }],
  sidebar: [{ type: ContentChild, args: [ViewerSidebarComponent] }],
  mnuOpenWith: [{ type: ContentChild, args: [ViewerOpenWithComponent] }],
  mnuMoreActions: [{ type: ContentChild, args: [ViewerMoreActionsComponent] }],
  urlFile: [{ type: Input }],
  urlFileViewer: [{ type: Input }],
  blobFile: [{ type: Input }],
  nodeId: [{ type: Input }],
  sharedLinkId: [{ type: Input }],
  overlayMode: [{ type: Input }],
  showViewer: [{ type: Input }],
  showToolbar: [{ type: Input }],
  displayName: [{ type: Input }],
  allowGoBack: [{ type: Input }],
  allowDownload: [{ type: Input }],
  allowPrint: [{ type: Input }],
  allowFullScreen: [{ type: Input }],
  allowNavigate: [{ type: Input }],
  canNavigateBefore: [{ type: Input }],
  canNavigateNext: [{ type: Input }],
  allowLeftSidebar: [{ type: Input }],
  allowRightSidebar: [{ type: Input }],
  allowThumbnails: [{ type: Input }],
  showRightSidebar: [{ type: Input }],
  showLeftSidebar: [{ type: Input }],
  sidebarRightTemplate: [{ type: Input }],
  sidebarLeftTemplate: [{ type: Input }],
  thumbnailsTemplate: [{ type: Input }],
  mimeType: [{ type: Input }],
  fileName: [{ type: Input }],
  maxRetries: [{ type: Input }],
  goBack: [{ type: Output }],
  print: [{ type: Output }],
  showViewerChange: [{ type: Output }],
  extensionChange: [{ type: Output }],
  navigateBefore: [{ type: Output }],
  navigateNext: [{ type: Output }],
  invalidSharedLink: [{ type: Output }],
  handleKeyboardEvent: [
    { type: HostListener, args: ['document:keyup', ['$event']] }
  ]
};
if (false) {
  /** @type {?} */
  ViewerComponent.prototype.toolbar;
  /** @type {?} */
  ViewerComponent.prototype.sidebar;
  /** @type {?} */
  ViewerComponent.prototype.mnuOpenWith;
  /** @type {?} */
  ViewerComponent.prototype.mnuMoreActions;
  /**
   * If you want to load an external file that does not come from ACS you
   * can use this URL to specify where to load the file from.
   * @type {?}
   */
  ViewerComponent.prototype.urlFile;
  /**
   * Viewer to use with the `urlFile` address (`pdf`, `image`, `media`, `text`).
   * Used when `urlFile` has no filename and extension.
   * @type {?}
   */
  ViewerComponent.prototype.urlFileViewer;
  /**
   * Loads a Blob File
   * @type {?}
   */
  ViewerComponent.prototype.blobFile;
  /**
   * Node Id of the file to load.
   * @type {?}
   */
  ViewerComponent.prototype.nodeId;
  /**
   * Shared link id (to display shared file).
   * @type {?}
   */
  ViewerComponent.prototype.sharedLinkId;
  /**
   * If `true` then show the Viewer as a full page over the current content.
   * Otherwise fit inside the parent div.
   * @type {?}
   */
  ViewerComponent.prototype.overlayMode;
  /**
   * Hide or show the viewer
   * @type {?}
   */
  ViewerComponent.prototype.showViewer;
  /**
   * Hide or show the toolbar
   * @type {?}
   */
  ViewerComponent.prototype.showToolbar;
  /**
   * Specifies the name of the file when it is not available from the URL.
   * @type {?}
   */
  ViewerComponent.prototype.displayName;
  /**
   * Allows `back` navigation
   * @type {?}
   */
  ViewerComponent.prototype.allowGoBack;
  /**
   * Toggles downloading.
   * @type {?}
   */
  ViewerComponent.prototype.allowDownload;
  /**
   * Toggles printing.
   * @type {?}
   */
  ViewerComponent.prototype.allowPrint;
  /**
   * Toggles the 'Full Screen' feature.
   * @type {?}
   */
  ViewerComponent.prototype.allowFullScreen;
  /**
   * Toggles before/next navigation. You can use the arrow buttons to navigate
   * between documents in the collection.
   * @type {?}
   */
  ViewerComponent.prototype.allowNavigate;
  /**
   * Toggles the "before" ("<") button. Requires `allowNavigate` to be enabled.
   * @type {?}
   */
  ViewerComponent.prototype.canNavigateBefore;
  /**
   * Toggles the next (">") button. Requires `allowNavigate` to be enabled.
   * @type {?}
   */
  ViewerComponent.prototype.canNavigateNext;
  /**
   * Allow the left the sidebar.
   * @type {?}
   */
  ViewerComponent.prototype.allowLeftSidebar;
  /**
   * Allow the right sidebar.
   * @type {?}
   */
  ViewerComponent.prototype.allowRightSidebar;
  /**
   * Toggles PDF thumbnails.
   * @type {?}
   */
  ViewerComponent.prototype.allowThumbnails;
  /**
   * Toggles right sidebar visibility. Requires `allowRightSidebar` to be set to `true`.
   * @type {?}
   */
  ViewerComponent.prototype.showRightSidebar;
  /**
   * Toggles left sidebar visibility. Requires `allowLeftSidebar` to be set to `true`.
   * @type {?}
   */
  ViewerComponent.prototype.showLeftSidebar;
  /**
   * The template for the right sidebar. The template context contains the loaded node data.
   * @type {?}
   */
  ViewerComponent.prototype.sidebarRightTemplate;
  /**
   * The template for the left sidebar. The template context contains the loaded node data.
   * @type {?}
   */
  ViewerComponent.prototype.sidebarLeftTemplate;
  /**
   * The template for the pdf thumbnails.
   * @type {?}
   */
  ViewerComponent.prototype.thumbnailsTemplate;
  /**
   * MIME type of the file content (when not determined by the filename extension).
   * @type {?}
   */
  ViewerComponent.prototype.mimeType;
  /**
   * Content filename.
   * @type {?}
   */
  ViewerComponent.prototype.fileName;
  /**
   * Number of times the Viewer will retry fetching content Rendition.
   * There is a delay of at least one second between attempts.
   * @type {?}
   */
  ViewerComponent.prototype.maxRetries;
  /**
   * Emitted when user clicks the 'Back' button.
   * @type {?}
   */
  ViewerComponent.prototype.goBack;
  /**
   * Emitted when user clicks the 'Print' button.
   * @type {?}
   */
  ViewerComponent.prototype.print;
  /**
   * Emitted when the viewer is shown or hidden.
   * @type {?}
   */
  ViewerComponent.prototype.showViewerChange;
  /**
   * Emitted when the filename extension changes.
   * @type {?}
   */
  ViewerComponent.prototype.extensionChange;
  /**
   * Emitted when user clicks 'Navigate Before' ("<") button.
   * @type {?}
   */
  ViewerComponent.prototype.navigateBefore;
  /**
   * Emitted when user clicks 'Navigate Next' (">") button.
   * @type {?}
   */
  ViewerComponent.prototype.navigateNext;
  /**
   * Emitted when the shared link used is not valid.
   * @type {?}
   */
  ViewerComponent.prototype.invalidSharedLink;
  /** @type {?} */
  ViewerComponent.prototype.TRY_TIMEOUT;
  /** @type {?} */
  ViewerComponent.prototype.viewerType;
  /** @type {?} */
  ViewerComponent.prototype.isLoading;
  /** @type {?} */
  ViewerComponent.prototype.nodeEntry;
  /** @type {?} */
  ViewerComponent.prototype.extensionTemplates;
  /** @type {?} */
  ViewerComponent.prototype.externalExtensions;
  /** @type {?} */
  ViewerComponent.prototype.urlFileContent;
  /** @type {?} */
  ViewerComponent.prototype.otherMenu;
  /** @type {?} */
  ViewerComponent.prototype.extension;
  /** @type {?} */
  ViewerComponent.prototype.sidebarRightTemplateContext;
  /** @type {?} */
  ViewerComponent.prototype.sidebarLeftTemplateContext;
  /** @type {?} */
  ViewerComponent.prototype.fileTitle;
  /** @type {?} */
  ViewerComponent.prototype.viewerExtensions;
  /**
   * @type {?}
   * @private
   */
  ViewerComponent.prototype.cacheBusterNumber;
  /**
   * @type {?}
   * @private
   */
  ViewerComponent.prototype.subscriptions;
  /**
   * @type {?}
   * @private
   */
  ViewerComponent.prototype.extensions;
  /**
   * @type {?}
   * @private
   */
  ViewerComponent.prototype.mimeTypes;
  /**
   * @type {?}
   * @private
   */
  ViewerComponent.prototype.apiService;
  /**
   * @type {?}
   * @private
   */
  ViewerComponent.prototype.viewUtils;
  /**
   * @type {?}
   * @private
   */
  ViewerComponent.prototype.logService;
  /**
   * @type {?}
   * @private
   */
  ViewerComponent.prototype.extensionService;
  /**
   * @type {?}
   * @private
   */
  ViewerComponent.prototype.el;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlld2VyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BhbGZyZXNjby9hZGYtY29yZS8iLCJzb3VyY2VzIjpbInZpZXdlci9jb21wb25lbnRzL3ZpZXdlci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBaUJBLE9BQU8sRUFDSCxTQUFTLEVBQUUsWUFBWSxFQUFFLFlBQVksRUFBRSxZQUFZLEVBQUUsVUFBVSxFQUMvRCxLQUFLLEVBQWEsTUFBTSxFQUFFLFdBQVcsRUFDckMsaUJBQWlCLEVBQ3BCLE1BQU0sZUFBZSxDQUFDO0FBRXZCLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFDekMsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0scUNBQXFDLENBQUM7QUFDekUsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBQ3hELE9BQU8sRUFBRSwwQkFBMEIsRUFBRSxNQUFNLGlDQUFpQyxDQUFDO0FBQzdFLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLDhCQUE4QixDQUFDO0FBQ3ZFLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBQ3BFLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBRXBFLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSwrQkFBK0IsQ0FBQztBQUNoRSxPQUFPLEVBQUUsbUJBQW1CLEVBQXNCLE1BQU0sMEJBQTBCLENBQUM7QUFTbkYsTUFBTSxPQUFPLGVBQWU7Ozs7Ozs7O0lBcU14QixZQUFvQixVQUE4QixFQUM5QixTQUEwQixFQUMxQixVQUFzQixFQUN0QixnQkFBcUMsRUFDckMsRUFBYztRQUpkLGVBQVUsR0FBVixVQUFVLENBQW9CO1FBQzlCLGNBQVMsR0FBVCxTQUFTLENBQWlCO1FBQzFCLGVBQVUsR0FBVixVQUFVLENBQVk7UUFDdEIscUJBQWdCLEdBQWhCLGdCQUFn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NkM7Ozs7O0lBQzdDLDZCQUFzQiIsInNvdXJjZXNDb250ZW50IjpbIi8qIVxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE5IEFsZnJlc2NvIFNvZnR3YXJlLCBMdGQuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbmltcG9ydCB7XG4gICAgQ29tcG9uZW50LCBDb250ZW50Q2hpbGQsIEV2ZW50RW1pdHRlciwgSG9zdExpc3RlbmVyLCBFbGVtZW50UmVmLFxuICAgIElucHV0LCBPbkNoYW5nZXMsIE91dHB1dCwgVGVtcGxhdGVSZWYsXG4gICAgVmlld0VuY2Fwc3VsYXRpb24sIE9uSW5pdCwgT25EZXN0cm95XG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgUmVuZGl0aW9uUGFnaW5nLCBTaGFyZWRMaW5rRW50cnksIE5vZGUsIFJlbmRpdGlvbkVudHJ5LCBOb2RlRW50cnkgfSBmcm9tICdAYWxmcmVzY28vanMtYXBpJztcbmltcG9ydCB7IEJhc2VFdmVudCB9IGZyb20gJy4uLy4uL2V2ZW50cyc7XG5pbXBvcnQgeyBBbGZyZXNjb0FwaVNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9hbGZyZXNjby1hcGkuc2VydmljZSc7XG5pbXBvcnQgeyBMb2dTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvbG9nLnNlcnZpY2UnO1xuaW1wb3J0IHsgVmlld2VyTW9yZUFjdGlvbnNDb21wb25lbnQgfSBmcm9tICcuL3ZpZXdlci1tb3JlLWFjdGlvbnMuY29tcG9uZW50JztcbmltcG9ydCB7IFZpZXdlck9wZW5XaXRoQ29tcG9uZW50IH0gZnJvbSAnLi92aWV3ZXItb3Blbi13aXRoLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBWaWV3ZXJTaWRlYmFyQ29tcG9uZW50IH0gZnJvbSAnLi92aWV3ZXItc2lkZWJhci5jb21wb25lbnQnO1xuaW1wb3J0IHsgVmlld2VyVG9vbGJhckNvbXBvbmVudCB9IGZyb20gJy4vdmlld2VyLXRvb2xiYXIuY29tcG9uZW50JztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgVmlld1V0aWxTZXJ2aWNlIH0gZnJvbSAnLi4vc2VydmljZXMvdmlldy11dGlsLnNlcnZpY2UnO1xuaW1wb3J0IHsgQXBwRXh0ZW5zaW9uU2VydmljZSwgVmlld2VyRXh0ZW5zaW9uUmVmIH0gZnJvbSAnQGFsZnJlc2NvL2FkZi1leHRlbnNpb25zJztcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdhZGYtdmlld2VyJyxcbiAgICB0ZW1wbGF0ZVVybDogJy4vdmlld2VyLmNvbXBvbmVudC5odG1sJyxcbiAgICBzdHlsZVVybHM6IFsnLi92aWV3ZXIuY29tcG9uZW50LnNjc3MnXSxcbiAgICBob3N0OiB7ICdjbGFzcyc6ICdhZGYtdmlld2VyJyB9LFxuICAgIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmVcbn0pXG5leHBvcnQgY2xhc3MgVmlld2VyQ29tcG9uZW50IGltcGxlbWVudHMgT25DaGFuZ2VzLCBPbkluaXQsIE9uRGVzdHJveSB7XG5cbiAgICBAQ29udGVudENoaWxkKFZpZXdlclRvb2xiYXJDb21wb25lbnQpXG4gICAgdG9vbGJhcjogVmlld2VyVG9vbGJhckNvbXBvbmVudDtcblxuICAgIEBDb250ZW50Q2hpbGQoVmlld2VyU2lkZWJhckNvbXBvbmVudClcbiAgICBzaWRlYmFyOiBWaWV3ZXJTaWRlYmFyQ29tcG9uZW50O1xuXG4gICAgQENvbnRlbnRDaGlsZChWaWV3ZXJPcGVuV2l0aENvbXBvbmVudClcbiAgICBtbnVPcGVuV2l0aDogVmlld2VyT3BlbldpdGhDb21wb25lbnQ7XG5cbiAgICBAQ29udGVudENoaWxkKFZpZXdlck1vcmVBY3Rpb25zQ29tcG9uZW50KVxuICAgIG1udU1vcmVBY3Rpb25zOiBWaWV3ZXJNb3JlQWN0aW9uc0NvbXBvbmVudDtcblxuICAgIC8qKiBJZiB5b3Ugd2FudCB0byBsb2FkIGFuIGV4dGVybmFsIGZpbGUgdGhhdCBkb2VzIG5vdCBjb21lIGZyb20gQUNTIHlvdVxuICAgICAqIGNhbiB1c2UgdGhpcyBVUkwgdG8gc3BlY2lmeSB3aGVyZSB0byBsb2FkIHRoZSBmaWxlIGZyb20uXG4gICAgICovXG4gICAgQElucHV0KClcbiAgICB1cmxGaWxlID0gJyc7XG5cbiAgICAvKiogVmlld2VyIHRvIHVzZSB3aXRoIHRoZSBgdXJsRmlsZWAgYWRkcmVzcyAoYHBkZmAsIGBpbWFnZWAsIGBtZWRpYWAsIGB0ZXh0YCkuXG4gICAgICogVXNlZCB3aGVuIGB1cmxGaWxlYCBoYXMgbm8gZmlsZW5hbWUgYW5kIGV4dGVuc2lvbi5cbiAgICAgKi9cbiAgICBASW5wdXQoKVxuICAgIHVybEZpbGVWaWV3ZXI6IHN0cmluZyA9IG51bGw7XG5cbiAgICAvKiogTG9hZHMgYSBCbG9iIEZpbGUgKi9cbiAgICBASW5wdXQoKVxuICAgIGJsb2JGaWxlOiBCbG9iO1xuXG4gICAgLyoqIE5vZGUgSWQgb2YgdGhlIGZpbGUgdG8gbG9hZC4gKi9cbiAgICBASW5wdXQoKVxuICAgIG5vZGVJZDogc3RyaW5nID0gbnVsbDtcblxuICAgIC8qKiBTaGFyZWQgbGluayBpZCAodG8gZGlzcGxheSBzaGFyZWQgZmlsZSkuICovXG4gICAgQElucHV0KClcbiAgICBzaGFyZWRMaW5rSWQ6IHN0cmluZyA9IG51bGw7XG5cbiAgICAvKiogSWYgYHRydWVgIHRoZW4gc2hvdyB0aGUgVmlld2VyIGFzIGEgZnVsbCBwYWdlIG92ZXIgdGhlIGN1cnJlbnQgY29udGVudC5cbiAgICAgKiBPdGhlcndpc2UgZml0IGluc2lkZSB0aGUgcGFyZW50IGRpdi5cbiAgICAgKi9cbiAgICBASW5wdXQoKVxuICAgIG92ZXJsYXlNb2RlID0gZmFsc2U7XG5cbiAgICAvKiogSGlkZSBvciBzaG93IHRoZSB2aWV3ZXIgKi9cbiAgICBASW5wdXQoKVxuICAgIHNob3dWaWV3ZXIgPSB0cnVlO1xuXG4gICAgLyoqIEhpZGUgb3Igc2hvdyB0aGUgdG9vbGJhciAqL1xuICAgIEBJbnB1dCgpXG4gICAgc2hvd1Rvb2xiYXIgPSB0cnVlO1xuXG4gICAgLyoqIFNwZWNpZmllcyB0aGUgbmFtZSBvZiB0aGUgZmlsZSB3aGVuIGl0IGlzIG5vdCBhdmFpbGFibGUgZnJvbSB0aGUgVVJMLiAqL1xuICAgIEBJbnB1dCgpXG4gICAgZGlzcGxheU5hbWU6IHN0cmluZztcblxuICAgIC8qKiBAZGVwcmVjYXRlZCAzLjIuMCAqL1xuICAgIC8qKiBBbGxvd3MgYGJhY2tgIG5hdmlnYXRpb24gKi9cbiAgICBASW5wdXQoKVxuICAgIGFsbG93R29CYWNrID0gdHJ1ZTtcblxuICAgIC8qKiBUb2dnbGVzIGRvd25sb2FkaW5nLiAqL1xuICAgIEBJbnB1dCgpXG4gICAgYWxsb3dEb3dubG9hZCA9IHRydWU7XG5cbiAgICAvKiogVG9nZ2xlcyBwcmludGluZy4gKi9cbiAgICBASW5wdXQoKVxuICAgIGFsbG93UHJpbnQgPSBmYWxzZTtcblxuICAgIC8qKiBUb2dnbGVzIHRoZSAnRnVsbCBTY3JlZW4nIGZlYXR1cmUuICovXG4gICAgQElucHV0KClcbiAgICBhbGxvd0Z1bGxTY3JlZW4gPSB0cnVlO1xuXG4gICAgLyoqIFRvZ2dsZXMgYmVmb3JlL25leHQgbmF2aWdhdGlvbi4gWW91IGNhbiB1c2UgdGhlIGFycm93IGJ1dHRvbnMgdG8gbmF2aWdhdGVcbiAgICAgKiBiZXR3ZWVuIGRvY3VtZW50cyBpbiB0aGUgY29sbGVjdGlvbi5cbiAgICAgKi9cbiAgICBASW5wdXQoKVxuICAgIGFsbG93TmF2aWdhdGUgPSBmYWxzZTtcblxuICAgIC8qKiBUb2dnbGVzIHRoZSBcImJlZm9yZVwiIChcIjxcIikgYnV0dG9uLiBSZXF1aXJlcyBgYWxsb3dOYXZpZ2F0ZWAgdG8gYmUgZW5hYmxlZC4gKi9cbiAgICBASW5wdXQoKVxuICAgIGNhbk5hdmlnYXRlQmVmb3JlID0gdHJ1ZTtcblxuICAgIC8qKiBUb2dnbGVzIHRoZSBuZXh0IChcIj5cIikgYnV0dG9uLiBSZXF1aXJlcyBgYWxsb3dOYXZpZ2F0ZWAgdG8gYmUgZW5hYmxlZC4gKi9cbiAgICBASW5wdXQoKVxuICAgIGNhbk5hdmlnYXRlTmV4dCA9IHRydWU7XG5cbiAgICAvKiogQWxsb3cgdGhlIGxlZnQgdGhlIHNpZGViYXIuICovXG4gICAgQElucHV0KClcbiAgICBhbGxvd0xlZnRTaWRlYmFyID0gZmFsc2U7XG5cbiAgICAvKiogQWxsb3cgdGhlIHJpZ2h0IHNpZGViYXIuICovXG4gICAgQElucHV0KClcbiAgICBhbGxvd1JpZ2h0U2lkZWJhciA9IGZhbHNlO1xuXG4gICAgLyoqIFRvZ2dsZXMgUERGIHRodW1ibmFpbHMuICovXG4gICAgQElucHV0KClcbiAgICBhbGxvd1RodW1ibmFpbHMgPSB0cnVlO1xuXG4gICAgLyoqIFRvZ2dsZXMgcmlnaHQgc2lkZWJhciB2aXNpYmlsaXR5LiBSZXF1aXJlcyBgYWxsb3dSaWdodFNpZGViYXJgIHRvIGJlIHNldCB0byBgdHJ1ZWAuICovXG4gICAgQElucHV0KClcbiAgICBzaG93UmlnaHRTaWRlYmFyID0gZmFsc2U7XG5cbiAgICAvKiogVG9nZ2xlcyBsZWZ0IHNpZGViYXIgdmlzaWJpbGl0eS4gUmVxdWlyZXMgYGFsbG93TGVmdFNpZGViYXJgIHRvIGJlIHNldCB0byBgdHJ1ZWAuICovXG4gICAgQElucHV0KClcbiAgICBzaG93TGVmdFNpZGViYXIgPSBmYWxzZTtcblxuICAgIC8qKiBUaGUgdGVtcGxhdGUgZm9yIHRoZSByaWdodCBzaWRlYmFyLiBUaGUgdGVtcGxhdGUgY29udGV4dCBjb250YWlucyB0aGUgbG9hZGVkIG5vZGUgZGF0YS4gKi9cbiAgICBASW5wdXQoKVxuICAgIHNpZGViYXJSaWdodFRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+ID0gbnVsbDtcblxuICAgIC8qKiBUaGUgdGVtcGxhdGUgZm9yIHRoZSBsZWZ0IHNpZGViYXIuIFRoZSB0ZW1wbGF0ZSBjb250ZXh0IGNvbnRhaW5zIHRoZSBsb2FkZWQgbm9kZSBkYXRhLiAqL1xuICAgIEBJbnB1dCgpXG4gICAgc2lkZWJhckxlZnRUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PiA9IG51bGw7XG5cbiAgICAvKiogVGhlIHRlbXBsYXRlIGZvciB0aGUgcGRmIHRodW1ibmFpbHMuICovXG4gICAgQElucHV0KClcbiAgICB0aHVtYm5haWxzVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT4gPSBudWxsO1xuXG4gICAgLyoqIE1JTUUgdHlwZSBvZiB0aGUgZmlsZSBjb250ZW50ICh3aGVuIG5vdCBkZXRlcm1pbmVkIGJ5IHRoZSBmaWxlbmFtZSBleHRlbnNpb24pLiAqL1xuICAgIEBJbnB1dCgpXG4gICAgbWltZVR5cGU6IHN0cmluZztcblxuICAgIC8qKiBDb250ZW50IGZpbGVuYW1lLiAqL1xuICAgIEBJbnB1dCgpXG4gICAgZmlsZU5hbWU6IHN0cmluZztcblxuICAgIC8qKiBOdW1iZXIgb2YgdGltZXMgdGhlIFZpZXdlciB3aWxsIHJldHJ5IGZldGNoaW5nIGNvbnRlbnQgUmVuZGl0aW9uLlxuICAgICAqIFRoZXJlIGlzIGEgZGVsYXkgb2YgYXQgbGVhc3Qgb25lIHNlY29uZCBiZXR3ZWVuIGF0dGVtcHRzLlxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgbWF4UmV0cmllcyA9IDMwO1xuXG4gICAgLyoqIEVtaXR0ZWQgd2hlbiB1c2VyIGNsaWNrcyB0aGUgJ0JhY2snIGJ1dHRvbi4gKi9cbiAgICBAT3V0cHV0KClcbiAgICBnb0JhY2sgPSBuZXcgRXZlbnRFbWl0dGVyPEJhc2VFdmVudDxhbnk+PigpO1xuXG4gICAgLyoqIEVtaXR0ZWQgd2hlbiB1c2VyIGNsaWNrcyB0aGUgJ1ByaW50JyBidXR0b24uICovXG4gICAgQE91dHB1dCgpXG4gICAgcHJpbnQgPSBuZXcgRXZlbnRFbWl0dGVyPEJhc2VFdmVudDxhbnk+PigpO1xuXG4gICAgLyoqIEVtaXR0ZWQgd2hlbiB0aGUgdmlld2VyIGlzIHNob3duIG9yIGhpZGRlbi4gKi9cbiAgICBAT3V0cHV0KClcbiAgICBzaG93Vmlld2VyQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxib29sZWFuPigpO1xuXG4gICAgLyoqIEVtaXR0ZWQgd2hlbiB0aGUgZmlsZW5hbWUgZXh0ZW5zaW9uIGNoYW5nZXMuICovXG4gICAgQE91dHB1dCgpXG4gICAgZXh0ZW5zaW9uQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxzdHJpbmc+KCk7XG5cbiAgICAvKiogRW1pdHRlZCB3aGVuIHVzZXIgY2xpY2tzICdOYXZpZ2F0ZSBCZWZvcmUnIChcIjxcIikgYnV0dG9uLiAqL1xuICAgIEBPdXRwdXQoKVxuICAgIG5hdmlnYXRlQmVmb3JlID0gbmV3IEV2ZW50RW1pdHRlcjxNb3VzZUV2ZW50fEtleWJvYXJkRXZlbnQ+KCk7XG5cbiAgICAvKiogRW1pdHRlZCB3aGVuIHVzZXIgY2xpY2tzICdOYXZpZ2F0ZSBOZXh0JyAoXCI+XCIpIGJ1dHRvbi4gKi9cbiAgICBAT3V0cHV0KClcbiAgICBuYXZpZ2F0ZU5leHQgPSBuZXcgRXZlbnRFbWl0dGVyPE1vdXNlRXZlbnR8S2V5Ym9hcmRFdmVudD4oKTtcblxuICAgIC8qKiBFbWl0dGVkIHdoZW4gdGhlIHNoYXJlZCBsaW5rIHVzZWQgaXMgbm90IHZhbGlkLiAqL1xuICAgIEBPdXRwdXQoKVxuICAgIGludmFsaWRTaGFyZWRMaW5rID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gICAgVFJZX1RJTUVPVVQ6IG51bWJlciA9IDEwMDAwO1xuXG4gICAgdmlld2VyVHlwZSA9ICd1bmtub3duJztcbiAgICBpc0xvYWRpbmcgPSBmYWxzZTtcbiAgICBub2RlRW50cnk6IE5vZGVFbnRyeTtcblxuICAgIGV4dGVuc2lvblRlbXBsYXRlczogeyB0ZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PiwgaXNWaXNpYmxlOiBib29sZWFuIH1bXSA9IFtdO1xuICAgIGV4dGVybmFsRXh0ZW5zaW9uczogc3RyaW5nW10gPSBbXTtcbiAgICB1cmxGaWxlQ29udGVudDogc3RyaW5nO1xuICAgIG90aGVyTWVudTogYW55O1xuICAgIGV4dGVuc2lvbjogc3RyaW5nO1xuICAgIHNpZGViYXJSaWdodFRlbXBsYXRlQ29udGV4dDogeyBub2RlOiBOb2RlIH0gPSB7IG5vZGU6IG51bGwgfTtcbiAgICBzaWRlYmFyTGVmdFRlbXBsYXRlQ29udGV4dDogeyBub2RlOiBOb2RlIH0gPSB7IG5vZGU6IG51bGwgfTtcbiAgICBmaWxlVGl0bGU6IHN0cmluZztcbiAgICB2aWV3ZXJFeHRlbnNpb25zOiBBcnJheTxWaWV3ZXJFeHRlbnNpb25SZWY+ID0gW107XG5cbiAgICBwcml2YXRlIGNhY2hlQnVzdGVyTnVtYmVyO1xuXG4gICAgcHJpdmF0ZSBzdWJzY3JpcHRpb25zOiBTdWJzY3JpcHRpb25bXSA9IFtdO1xuXG4gICAgLy8gRXh0ZW5zaW9ucyB0aGF0IGFyZSBzdXBwb3J0ZWQgYnkgdGhlIFZpZXdlciB3aXRob3V0IGNvbnZlcnNpb25cbiAgICBwcml2YXRlIGV4dGVuc2lvbnMgPSB7XG4gICAgICAgIGltYWdlOiBbJ3BuZycsICdqcGcnLCAnanBlZycsICdnaWYnLCAnYnBtJywgJ3N2ZyddLFxuICAgICAgICBtZWRpYTogWyd3YXYnLCAnbXA0JywgJ21wMycsICd3ZWJtJywgJ29nZyddLFxuICAgICAgICB0ZXh0OiBbJ3R4dCcsICd4bWwnLCAnaHRtbCcsICdqc29uJywgJ3RzJywgJ2NzcycsICdtZCddLFxuICAgICAgICBwZGY6IFsncGRmJ11cbiAgICB9O1xuXG4gICAgLy8gTWltZSB0eXBlcyB0aGF0IGFyZSBzdXBwb3J0ZWQgYnkgdGhlIFZpZXdlciB3aXRob3V0IGNvbnZlcnNpb25cbiAgICBwcml2YXRlIG1pbWVUeXBlcyA9IHtcbiAgICAgICAgdGV4dDogWyd0ZXh0L3BsYWluJywgJ3RleHQvY3N2JywgJ3RleHQveG1sJywgJ3RleHQvaHRtbCcsICdhcHBsaWNhdGlvbi94LWphdmFzY3JpcHQnXSxcbiAgICAgICAgcGRmOiBbJ2FwcGxpY2F0aW9uL3BkZiddLFxuICAgICAgICBpbWFnZTogWydpbWFnZS9wbmcnLCAnaW1hZ2UvanBlZycsICdpbWFnZS9naWYnLCAnaW1hZ2UvYm1wJywgJ2ltYWdlL3N2Zyt4bWwnXSxcbiAgICAgICAgbWVkaWE6IFsndmlkZW8vbXA0JywgJ3ZpZGVvL3dlYm0nLCAndmlkZW8vb2dnJywgJ2F1ZGlvL21wZWcnLCAnYXVkaW8vbXAzJywgJ2F1ZGlvL29nZycsICdhdWRpby93YXYnXVxuICAgIH07XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGFwaVNlcnZpY2U6IEFsZnJlc2NvQXBpU2VydmljZSxcbiAgICAgICAgICAgICAgICBwcml2YXRlIHZpZXdVdGlsczogVmlld1V0aWxTZXJ2aWNlLFxuICAgICAgICAgICAgICAgIHByaXZhdGUgbG9nU2VydmljZTogTG9nU2VydmljZSxcbiAgICAgICAgICAgICAgICBwcml2YXRlIGV4dGVuc2lvblNlcnZpY2U6IEFwcEV4dGVuc2lvblNlcnZpY2UsXG4gICAgICAgICAgICAgICAgcHJpdmF0ZSBlbDogRWxlbWVudFJlZikge1xuICAgIH1cblxuICAgIGlzU291cmNlRGVmaW5lZCgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuICh0aGlzLnVybEZpbGUgfHwgdGhpcy5ibG9iRmlsZSB8fCB0aGlzLm5vZGVJZCB8fCB0aGlzLnNoYXJlZExpbmtJZCkgPyB0cnVlIDogZmFsc2U7XG4gICAgfVxuXG4gICAgbmdPbkluaXQoKSB7XG4gICAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5wdXNoKFxuICAgICAgICAgICAgdGhpcy5hcGlTZXJ2aWNlLm5vZGVVcGRhdGVkLnN1YnNjcmliZSgobm9kZSkgPT4gdGhpcy5vbk5vZGVVcGRhdGVkKG5vZGUpKVxuICAgICAgICApO1xuXG4gICAgICAgIHRoaXMubG9hZEV4dGVuc2lvbnMoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGxvYWRFeHRlbnNpb25zKCkge1xuICAgICAgICB0aGlzLnZpZXdlckV4dGVuc2lvbnMgPSB0aGlzLmV4dGVuc2lvblNlcnZpY2UuZ2V0Vmlld2VyRXh0ZW5zaW9ucygpO1xuICAgICAgICB0aGlzLnZpZXdlckV4dGVuc2lvbnNcbiAgICAgICAgICAgIC5mb3JFYWNoKChleHRlbnNpb246IFZpZXdlckV4dGVuc2lvblJlZikgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuZXh0ZXJuYWxFeHRlbnNpb25zLnB1c2goZXh0ZW5zaW9uLmZpbGVFeHRlbnNpb24pO1xuICAgICAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgbmdPbkRlc3Ryb3koKSB7XG4gICAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5mb3JFYWNoKChzdWJzY3JpcHRpb24pID0+IHN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpKTtcbiAgICAgICAgdGhpcy5zdWJzY3JpcHRpb25zID0gW107XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBvbk5vZGVVcGRhdGVkKG5vZGU6IE5vZGUpIHtcbiAgICAgICAgaWYgKG5vZGUgJiYgbm9kZS5pZCA9PT0gdGhpcy5ub2RlSWQpIHtcbiAgICAgICAgICAgIHRoaXMuZ2VuZXJhdGVDYWNoZUJ1c3Rlck51bWJlcigpO1xuICAgICAgICAgICAgdGhpcy5pc0xvYWRpbmcgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5zZXRVcE5vZGVGaWxlKG5vZGUpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuaXNMb2FkaW5nID0gZmFsc2U7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG5nT25DaGFuZ2VzKCkge1xuICAgICAgICBpZiAodGhpcy5zaG93Vmlld2VyKSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuaXNTb3VyY2VEZWZpbmVkKCkpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0EgY29udGVudCBzb3VyY2UgYXR0cmlidXRlIHZhbHVlIGlzIG1pc3NpbmcuJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmlzTG9hZGluZyA9IHRydWU7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmJsb2JGaWxlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRVcEJsb2JEYXRhKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5pc0xvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy51cmxGaWxlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRVcFVybEZpbGUoKTtcbiAgICAgICAgICAgICAgICB0aGlzLmlzTG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLm5vZGVJZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuYXBpU2VydmljZS5ub2Rlc0FwaS5nZXROb2RlKHRoaXMubm9kZUlkLCB7IGluY2x1ZGU6IFsnYWxsb3dhYmxlT3BlcmF0aW9ucyddIH0pLnRoZW4oXG4gICAgICAgICAgICAgICAgICAgIChub2RlOiBOb2RlRW50cnkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubm9kZUVudHJ5ID0gbm9kZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0VXBOb2RlRmlsZShub2RlLmVudHJ5KS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmlzTG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaXNMb2FkaW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxvZ1NlcnZpY2UuZXJyb3IoJ1RoaXMgbm9kZSBkb2VzIG5vdCBleGlzdCcpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5zaGFyZWRMaW5rSWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmFsbG93R29CYWNrID0gZmFsc2U7XG5cbiAgICAgICAgICAgICAgICB0aGlzLmFwaVNlcnZpY2Uuc2hhcmVkTGlua3NBcGkuZ2V0U2hhcmVkTGluayh0aGlzLnNoYXJlZExpbmtJZCkudGhlbihcbiAgICAgICAgICAgICAgICAgICAgKHNoYXJlZExpbmtFbnRyeTogU2hhcmVkTGlua0VudHJ5KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNldFVwU2hhcmVkTGlua0ZpbGUoc2hhcmVkTGlua0VudHJ5KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaXNMb2FkaW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaXNMb2FkaW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxvZ1NlcnZpY2UuZXJyb3IoJ1RoaXMgc2hhcmVkTGluayBkb2VzIG5vdCBleGlzdCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pbnZhbGlkU2hhcmVkTGluay5uZXh0KCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzZXRVcEJsb2JEYXRhKCkge1xuICAgICAgICB0aGlzLmZpbGVUaXRsZSA9IHRoaXMuZ2V0RGlzcGxheU5hbWUoJ1Vua25vd24nKTtcbiAgICAgICAgdGhpcy5taW1lVHlwZSA9IHRoaXMuYmxvYkZpbGUudHlwZTtcbiAgICAgICAgdGhpcy52aWV3ZXJUeXBlID0gdGhpcy5nZXRWaWV3ZXJUeXBlQnlNaW1lVHlwZSh0aGlzLm1pbWVUeXBlKTtcblxuICAgICAgICB0aGlzLmFsbG93RG93bmxvYWQgPSBmYWxzZTtcbiAgICAgICAgLy8gVE9ETzogd3JhcCBibG9iIGludG8gdGhlIGRhdGEgdXJsIGFuZCBhbGxvdyBkb3dubG9hZGluZ1xuXG4gICAgICAgIHRoaXMuZXh0ZW5zaW9uQ2hhbmdlLmVtaXQodGhpcy5taW1lVHlwZSk7XG4gICAgICAgIHRoaXMuc2Nyb2xsVG9wKCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzZXRVcFVybEZpbGUoKSB7XG4gICAgICAgIGNvbnN0IGZpbGVuYW1lRnJvbVVybCA9IHRoaXMuZ2V0RmlsZW5hbWVGcm9tVXJsKHRoaXMudXJsRmlsZSk7XG4gICAgICAgIHRoaXMuZmlsZVRpdGxlID0gdGhpcy5nZXREaXNwbGF5TmFtZShmaWxlbmFtZUZyb21VcmwpO1xuICAgICAgICB0aGlzLmV4dGVuc2lvbiA9IHRoaXMuZ2V0RmlsZUV4dGVuc2lvbihmaWxlbmFtZUZyb21VcmwpO1xuICAgICAgICB0aGlzLnVybEZpbGVDb250ZW50ID0gdGhpcy51cmxGaWxlO1xuXG4gICAgICAgIHRoaXMuZmlsZU5hbWUgPSB0aGlzLmRpc3BsYXlOYW1lO1xuXG4gICAgICAgIHRoaXMudmlld2VyVHlwZSA9IHRoaXMudXJsRmlsZVZpZXdlciB8fCB0aGlzLmdldFZpZXdlclR5cGVCeUV4dGVuc2lvbih0aGlzLmV4dGVuc2lvbik7XG4gICAgICAgIGlmICh0aGlzLnZpZXdlclR5cGUgPT09ICd1bmtub3duJykge1xuICAgICAgICAgICAgdGhpcy52aWV3ZXJUeXBlID0gdGhpcy5nZXRWaWV3ZXJUeXBlQnlNaW1lVHlwZSh0aGlzLm1pbWVUeXBlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZXh0ZW5zaW9uQ2hhbmdlLmVtaXQodGhpcy5leHRlbnNpb24pO1xuICAgICAgICB0aGlzLnNjcm9sbFRvcCgpO1xuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgc2V0VXBOb2RlRmlsZShkYXRhOiBOb2RlKSB7XG4gICAgICAgIGxldCBzZXR1cE5vZGU7XG5cbiAgICAgICAgaWYgKGRhdGEuY29udGVudCkge1xuICAgICAgICAgICAgdGhpcy5taW1lVHlwZSA9IGRhdGEuY29udGVudC5taW1lVHlwZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZmlsZVRpdGxlID0gdGhpcy5nZXREaXNwbGF5TmFtZShkYXRhLm5hbWUpO1xuXG4gICAgICAgIHRoaXMudXJsRmlsZUNvbnRlbnQgPSB0aGlzLmFwaVNlcnZpY2UuY29udGVudEFwaS5nZXRDb250ZW50VXJsKGRhdGEuaWQpO1xuICAgICAgICB0aGlzLnVybEZpbGVDb250ZW50ID0gdGhpcy5jYWNoZUJ1c3Rlck51bWJlciA/IHRoaXMudXJsRmlsZUNvbnRlbnQgKyAnJicgKyB0aGlzLmNhY2hlQnVzdGVyTnVtYmVyIDogdGhpcy51cmxGaWxlQ29udGVudDtcblxuICAgICAgICB0aGlzLmV4dGVuc2lvbiA9IHRoaXMuZ2V0RmlsZUV4dGVuc2lvbihkYXRhLm5hbWUpO1xuXG4gICAgICAgIHRoaXMuZmlsZU5hbWUgPSBkYXRhLm5hbWU7XG5cbiAgICAgICAgdGhpcy52aWV3ZXJUeXBlID0gdGhpcy5nZXRWaWV3ZXJUeXBlQnlFeHRlbnNpb24odGhpcy5leHRlbnNpb24pO1xuICAgICAgICBpZiAodGhpcy52aWV3ZXJUeXBlID09PSAndW5rbm93bicpIHtcbiAgICAgICAgICAgIHRoaXMudmlld2VyVHlwZSA9IHRoaXMuZ2V0Vmlld2VyVHlwZUJ5TWltZVR5cGUodGhpcy5taW1lVHlwZSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy52aWV3ZXJUeXBlID09PSAndW5rbm93bicpIHtcbiAgICAgICAgICAgIHNldHVwTm9kZSA9IHRoaXMuZGlzcGxheU5vZGVSZW5kaXRpb24oZGF0YS5pZCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmV4dGVuc2lvbkNoYW5nZS5lbWl0KHRoaXMuZXh0ZW5zaW9uKTtcbiAgICAgICAgdGhpcy5zaWRlYmFyUmlnaHRUZW1wbGF0ZUNvbnRleHQubm9kZSA9IGRhdGE7XG4gICAgICAgIHRoaXMuc2lkZWJhckxlZnRUZW1wbGF0ZUNvbnRleHQubm9kZSA9IGRhdGE7XG4gICAgICAgIHRoaXMuc2Nyb2xsVG9wKCk7XG5cbiAgICAgICAgcmV0dXJuIHNldHVwTm9kZTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHNldFVwU2hhcmVkTGlua0ZpbGUoZGV0YWlsczogYW55KSB7XG4gICAgICAgIHRoaXMubWltZVR5cGUgPSBkZXRhaWxzLmVudHJ5LmNvbnRlbnQubWltZVR5cGU7XG4gICAgICAgIHRoaXMuZmlsZVRpdGxlID0gdGhpcy5nZXREaXNwbGF5TmFtZShkZXRhaWxzLmVudHJ5Lm5hbWUpO1xuICAgICAgICB0aGlzLmV4dGVuc2lvbiA9IHRoaXMuZ2V0RmlsZUV4dGVuc2lvbihkZXRhaWxzLmVudHJ5Lm5hbWUpO1xuICAgICAgICB0aGlzLmZpbGVOYW1lID0gZGV0YWlscy5lbnRyeS5uYW1lO1xuXG4gICAgICAgIHRoaXMudXJsRmlsZUNvbnRlbnQgPSB0aGlzLmFwaVNlcnZpY2UuY29udGVudEFwaS5nZXRTaGFyZWRMaW5rQ29udGVudFVybCh0aGlzLnNoYXJlZExpbmtJZCwgZmFsc2UpO1xuXG4gICAgICAgIHRoaXMudmlld2VyVHlwZSA9IHRoaXMuZ2V0Vmlld2VyVHlwZUJ5TWltZVR5cGUodGhpcy5taW1lVHlwZSk7XG4gICAgICAgIGlmICh0aGlzLnZpZXdlclR5cGUgPT09ICd1bmtub3duJykge1xuICAgICAgICAgICAgdGhpcy52aWV3ZXJUeXBlID0gdGhpcy5nZXRWaWV3ZXJUeXBlQnlFeHRlbnNpb24odGhpcy5leHRlbnNpb24pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMudmlld2VyVHlwZSA9PT0gJ3Vua25vd24nKSB7XG4gICAgICAgICAgICB0aGlzLmRpc3BsYXlTaGFyZWRMaW5rUmVuZGl0aW9uKHRoaXMuc2hhcmVkTGlua0lkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZXh0ZW5zaW9uQ2hhbmdlLmVtaXQodGhpcy5leHRlbnNpb24pO1xuICAgIH1cblxuICAgIHRvZ2dsZVNpZGViYXIoKSB7XG4gICAgICAgIHRoaXMuc2hvd1JpZ2h0U2lkZWJhciA9ICF0aGlzLnNob3dSaWdodFNpZGViYXI7XG4gICAgICAgIGlmICh0aGlzLnNob3dSaWdodFNpZGViYXIgJiYgdGhpcy5ub2RlSWQpIHtcbiAgICAgICAgICAgIHRoaXMuYXBpU2VydmljZS5nZXRJbnN0YW5jZSgpLm5vZGVzLmdldE5vZGUodGhpcy5ub2RlSWQsIHsgaW5jbHVkZTogWydhbGxvd2FibGVPcGVyYXRpb25zJ10gfSlcbiAgICAgICAgICAgICAgICAudGhlbigobm9kZUVudHJ5OiBOb2RlRW50cnkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zaWRlYmFyUmlnaHRUZW1wbGF0ZUNvbnRleHQubm9kZSA9IG5vZGVFbnRyeS5lbnRyeTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHRvZ2dsZUxlZnRTaWRlYmFyKCkge1xuICAgICAgICB0aGlzLnNob3dMZWZ0U2lkZWJhciA9ICF0aGlzLnNob3dMZWZ0U2lkZWJhcjtcbiAgICAgICAgaWYgKHRoaXMuc2hvd1JpZ2h0U2lkZWJhciAmJiB0aGlzLm5vZGVJZCkge1xuICAgICAgICAgICAgdGhpcy5hcGlTZXJ2aWNlLmdldEluc3RhbmNlKCkubm9kZXMuZ2V0Tm9kZSh0aGlzLm5vZGVJZCwgeyBpbmNsdWRlOiBbJ2FsbG93YWJsZU9wZXJhdGlvbnMnXSB9KVxuICAgICAgICAgICAgICAgIC50aGVuKChub2RlRW50cnk6IE5vZGVFbnRyeSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNpZGViYXJMZWZ0VGVtcGxhdGVDb250ZXh0Lm5vZGUgPSBub2RlRW50cnkuZW50cnk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGdldERpc3BsYXlOYW1lKG5hbWUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGlzcGxheU5hbWUgfHwgbmFtZTtcbiAgICB9XG5cbiAgICBzY3JvbGxUb3AoKSB7XG4gICAgICAgIHdpbmRvdy5zY3JvbGxUbygwLCAxKTtcbiAgICB9XG5cbiAgICBnZXRWaWV3ZXJUeXBlQnlNaW1lVHlwZShtaW1lVHlwZTogc3RyaW5nKSB7XG4gICAgICAgIGlmIChtaW1lVHlwZSkge1xuICAgICAgICAgICAgbWltZVR5cGUgPSBtaW1lVHlwZS50b0xvd2VyQ2FzZSgpO1xuXG4gICAgICAgICAgICBjb25zdCBlZGl0b3JUeXBlcyA9IE9iamVjdC5rZXlzKHRoaXMubWltZVR5cGVzKTtcbiAgICAgICAgICAgIGZvciAoY29uc3QgdHlwZSBvZiBlZGl0b3JUeXBlcykge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLm1pbWVUeXBlc1t0eXBlXS5pbmRleE9mKG1pbWVUeXBlKSA+PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0eXBlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gJ3Vua25vd24nO1xuICAgIH1cblxuICAgIGdldFZpZXdlclR5cGVCeUV4dGVuc2lvbihleHRlbnNpb246IHN0cmluZykge1xuICAgICAgICBpZiAoZXh0ZW5zaW9uKSB7XG4gICAgICAgICAgICBleHRlbnNpb24gPSBleHRlbnNpb24udG9Mb3dlckNhc2UoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmlzQ3VzdG9tVmlld2VyRXh0ZW5zaW9uKGV4dGVuc2lvbikpIHtcbiAgICAgICAgICAgIHJldHVybiAnY3VzdG9tJztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmV4dGVuc2lvbnMuaW1hZ2UuaW5kZXhPZihleHRlbnNpb24pID49IDApIHtcbiAgICAgICAgICAgIHJldHVybiAnaW1hZ2UnO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuZXh0ZW5zaW9ucy5tZWRpYS5pbmRleE9mKGV4dGVuc2lvbikgPj0gMCkge1xuICAgICAgICAgICAgcmV0dXJuICdtZWRpYSc7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5leHRlbnNpb25zLnRleHQuaW5kZXhPZihleHRlbnNpb24pID49IDApIHtcbiAgICAgICAgICAgIHJldHVybiAndGV4dCc7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5leHRlbnNpb25zLnBkZi5pbmRleE9mKGV4dGVuc2lvbikgPj0gMCkge1xuICAgICAgICAgICAgcmV0dXJuICdwZGYnO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuICd1bmtub3duJztcbiAgICB9XG5cbiAgICBvbkJhY2tCdXR0b25DbGljaygpIHtcbiAgICAgICAgdGhpcy5jbG9zZSgpO1xuICAgIH1cblxuICAgIG9uTmF2aWdhdGVCZWZvcmVDbGljayhldmVudDogTW91c2VFdmVudHxLZXlib2FyZEV2ZW50KSB7XG4gICAgICAgIHRoaXMubmF2aWdhdGVCZWZvcmUubmV4dChldmVudCk7XG4gICAgfVxuXG4gICAgb25OYXZpZ2F0ZU5leHRDbGljayhldmVudDogTW91c2VFdmVudHxLZXlib2FyZEV2ZW50KSB7XG4gICAgICAgIHRoaXMubmF2aWdhdGVOZXh0Lm5leHQoZXZlbnQpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGNsb3NlIHRoZSB2aWV3ZXJcbiAgICAgKi9cbiAgICBjbG9zZSgpIHtcbiAgICAgICAgaWYgKHRoaXMub3RoZXJNZW51KSB7XG4gICAgICAgICAgICB0aGlzLm90aGVyTWVudS5oaWRkZW4gPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNob3dWaWV3ZXIgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5zaG93Vmlld2VyQ2hhbmdlLmVtaXQodGhpcy5zaG93Vmlld2VyKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBnZXQgRmlsZSBuYW1lIGZyb20gdXJsXG4gICAgICpcbiAgICAgKiBAcGFyYW0gIHVybCAtIHVybCBmaWxlXG4gICAgICovXG4gICAgZ2V0RmlsZW5hbWVGcm9tVXJsKHVybDogc3RyaW5nKTogc3RyaW5nIHtcbiAgICAgICAgY29uc3QgYW5jaG9yID0gdXJsLmluZGV4T2YoJyMnKTtcbiAgICAgICAgY29uc3QgcXVlcnkgPSB1cmwuaW5kZXhPZignPycpO1xuICAgICAgICBjb25zdCBlbmQgPSBNYXRoLm1pbihcbiAgICAgICAgICAgIGFuY2hvciA+IDAgPyBhbmNob3IgOiB1cmwubGVuZ3RoLFxuICAgICAgICAgICAgcXVlcnkgPiAwID8gcXVlcnkgOiB1cmwubGVuZ3RoKTtcbiAgICAgICAgcmV0dXJuIHVybC5zdWJzdHJpbmcodXJsLmxhc3RJbmRleE9mKCcvJywgZW5kKSArIDEsIGVuZCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IGZpbGUgZXh0ZW5zaW9uIGZyb20gdGhlIHN0cmluZy5cbiAgICAgKiBTdXBwb3J0cyB0aGUgVVJMIGZvcm1hdHMgbGlrZTpcbiAgICAgKiBodHRwOi8vbG9jYWxob3N0L3Rlc3QuanBnP2NhY2hlPTEwMDBcbiAgICAgKiBodHRwOi8vbG9jYWxob3N0L3Rlc3QuanBnI2NhY2hlPTEwMDBcbiAgICAgKlxuICAgICAqIEBwYXJhbSBmaWxlTmFtZSAtIGZpbGUgbmFtZVxuICAgICAqL1xuICAgIGdldEZpbGVFeHRlbnNpb24oZmlsZU5hbWU6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgICAgIGlmIChmaWxlTmFtZSkge1xuICAgICAgICAgICAgY29uc3QgbWF0Y2ggPSBmaWxlTmFtZS5tYXRjaCgvXFwuKFteXFwuL1xcP1xcI10rKSgkfFxcP3xcXCMpLyk7XG4gICAgICAgICAgICByZXR1cm4gbWF0Y2ggPyBtYXRjaFsxXSA6IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgaXNDdXN0b21WaWV3ZXJFeHRlbnNpb24oZXh0ZW5zaW9uOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICAgICAgY29uc3QgZXh0ZW5zaW9uczogYW55ID0gdGhpcy5leHRlcm5hbEV4dGVuc2lvbnMgfHwgW107XG5cbiAgICAgICAgaWYgKGV4dGVuc2lvbiAmJiBleHRlbnNpb25zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGV4dGVuc2lvbiA9IGV4dGVuc2lvbi50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgcmV0dXJuIGV4dGVuc2lvbnMuZmxhdCgpLmluZGV4T2YoZXh0ZW5zaW9uKSA+PSAwO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEtleWJvYXJkIGV2ZW50IGxpc3RlbmVyXG4gICAgICogQHBhcmFtICBldmVudFxuICAgICAqL1xuICAgIEBIb3N0TGlzdGVuZXIoJ2RvY3VtZW50OmtleXVwJywgWyckZXZlbnQnXSlcbiAgICBoYW5kbGVLZXlib2FyZEV2ZW50KGV2ZW50OiBLZXlib2FyZEV2ZW50KSB7XG4gICAgICAgIGNvbnN0IGtleSA9IGV2ZW50LmtleUNvZGU7XG5cbiAgICAgICAgLy8gRXNjXG4gICAgICAgIGlmIChrZXkgPT09IDI3ICYmIHRoaXMub3ZlcmxheU1vZGUpIHsgLy8gZXNjXG4gICAgICAgICAgICB0aGlzLmNsb3NlKCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBMZWZ0IGFycm93XG4gICAgICAgIGlmIChrZXkgPT09IDM3ICYmIHRoaXMuY2FuTmF2aWdhdGVCZWZvcmUpIHtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICB0aGlzLm9uTmF2aWdhdGVCZWZvcmVDbGljayhldmVudCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBSaWdodCBhcnJvd1xuICAgICAgICBpZiAoa2V5ID09PSAzOSAmJiB0aGlzLmNhbk5hdmlnYXRlTmV4dCkge1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHRoaXMub25OYXZpZ2F0ZU5leHRDbGljayhldmVudCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBDdHJsK0ZcbiAgICAgICAgaWYgKGtleSA9PT0gNzAgJiYgZXZlbnQuY3RybEtleSkge1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHRoaXMuZW50ZXJGdWxsU2NyZWVuKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcmludENvbnRlbnQoKSB7XG4gICAgICAgIGlmICh0aGlzLmFsbG93UHJpbnQpIHtcbiAgICAgICAgICAgIGNvbnN0IGFyZ3MgPSBuZXcgQmFzZUV2ZW50KCk7XG4gICAgICAgICAgICB0aGlzLnByaW50Lm5leHQoYXJncyk7XG5cbiAgICAgICAgICAgIGlmICghYXJncy5kZWZhdWx0UHJldmVudGVkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy52aWV3VXRpbHMucHJpbnRGaWxlR2VuZXJpYyh0aGlzLm5vZGVJZCwgdGhpcy5taW1lVHlwZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUcmlnZ2VycyBmdWxsIHNjcmVlbiBtb2RlIHdpdGggYSBtYWluIGNvbnRlbnQgYXJlYSBkaXNwbGF5ZWQuXG4gICAgICovXG4gICAgZW50ZXJGdWxsU2NyZWVuKCk6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5hbGxvd0Z1bGxTY3JlZW4pIHtcbiAgICAgICAgICAgIGNvbnN0IGNvbnRhaW5lciA9IHRoaXMuZWwubmF0aXZlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuYWRmLXZpZXdlcl9fZnVsbHNjcmVlbi1jb250YWluZXInKTtcbiAgICAgICAgICAgIGlmIChjb250YWluZXIpIHtcbiAgICAgICAgICAgICAgICBpZiAoY29udGFpbmVyLnJlcXVlc3RGdWxsc2NyZWVuKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRhaW5lci5yZXF1ZXN0RnVsbHNjcmVlbigpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoY29udGFpbmVyLndlYmtpdFJlcXVlc3RGdWxsc2NyZWVuKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRhaW5lci53ZWJraXRSZXF1ZXN0RnVsbHNjcmVlbigpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoY29udGFpbmVyLm1velJlcXVlc3RGdWxsU2NyZWVuKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRhaW5lci5tb3pSZXF1ZXN0RnVsbFNjcmVlbigpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoY29udGFpbmVyLm1zUmVxdWVzdEZ1bGxzY3JlZW4pIHtcbiAgICAgICAgICAgICAgICAgICAgY29udGFpbmVyLm1zUmVxdWVzdEZ1bGxzY3JlZW4oKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIGRpc3BsYXlOb2RlUmVuZGl0aW9uKG5vZGVJZDogc3RyaW5nKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCByZW5kaXRpb24gPSBhd2FpdCB0aGlzLnJlc29sdmVSZW5kaXRpb24obm9kZUlkLCAncGRmJyk7XG4gICAgICAgICAgICBpZiAocmVuZGl0aW9uKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVuZGl0aW9uSWQgPSByZW5kaXRpb24uZW50cnkuaWQ7XG5cbiAgICAgICAgICAgICAgICBpZiAocmVuZGl0aW9uSWQgPT09ICdwZGYnKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudmlld2VyVHlwZSA9ICdwZGYnO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAocmVuZGl0aW9uSWQgPT09ICdpbWdwcmV2aWV3Jykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnZpZXdlclR5cGUgPSAnaW1hZ2UnO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHRoaXMudXJsRmlsZUNvbnRlbnQgPSB0aGlzLmFwaVNlcnZpY2UuY29udGVudEFwaS5nZXRSZW5kaXRpb25Vcmwobm9kZUlkLCByZW5kaXRpb25JZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgdGhpcy5sb2dTZXJ2aWNlLmVycm9yKGVycik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIGRpc3BsYXlTaGFyZWRMaW5rUmVuZGl0aW9uKHNoYXJlZElkOiBzdHJpbmcpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHJlbmRpdGlvbjogUmVuZGl0aW9uRW50cnkgPSBhd2FpdCB0aGlzLmFwaVNlcnZpY2UucmVuZGl0aW9uc0FwaS5nZXRTaGFyZWRMaW5rUmVuZGl0aW9uKHNoYXJlZElkLCAncGRmJyk7XG4gICAgICAgICAgICBpZiAocmVuZGl0aW9uLmVudHJ5LnN0YXR1cy50b1N0cmluZygpID09PSAnQ1JFQVRFRCcpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnZpZXdlclR5cGUgPSAncGRmJztcbiAgICAgICAgICAgICAgICB0aGlzLnVybEZpbGVDb250ZW50ID0gdGhpcy5hcGlTZXJ2aWNlLmNvbnRlbnRBcGkuZ2V0U2hhcmVkTGlua1JlbmRpdGlvblVybChzaGFyZWRJZCwgJ3BkZicpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgdGhpcy5sb2dTZXJ2aWNlLmVycm9yKGVycm9yKTtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVuZGl0aW9uOiBSZW5kaXRpb25FbnRyeSA9IGF3YWl0IHRoaXMuYXBpU2VydmljZS5yZW5kaXRpb25zQXBpLmdldFNoYXJlZExpbmtSZW5kaXRpb24oc2hhcmVkSWQsICdpbWdwcmV2aWV3Jyk7XG4gICAgICAgICAgICAgICAgaWYgKHJlbmRpdGlvbi5lbnRyeS5zdGF0dXMudG9TdHJpbmcoKSA9PT0gJ0NSRUFURUQnKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudmlld2VyVHlwZSA9ICdpbWFnZSc7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudXJsRmlsZUNvbnRlbnQgPSB0aGlzLmFwaVNlcnZpY2UuY29udGVudEFwaS5nZXRTaGFyZWRMaW5rUmVuZGl0aW9uVXJsKHNoYXJlZElkLCAnaW1ncHJldmlldycpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5sb2dTZXJ2aWNlLmVycm9yKGVycm9yKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgcmVzb2x2ZVJlbmRpdGlvbihub2RlSWQ6IHN0cmluZywgcmVuZGl0aW9uSWQ6IHN0cmluZyk6IFByb21pc2U8UmVuZGl0aW9uRW50cnk+IHtcbiAgICAgICAgcmVuZGl0aW9uSWQgPSByZW5kaXRpb25JZC50b0xvd2VyQ2FzZSgpO1xuXG4gICAgICAgIGNvbnN0IHN1cHBvcnRlZFJlbmRpdGlvbjogUmVuZGl0aW9uUGFnaW5nID0gYXdhaXQgdGhpcy5hcGlTZXJ2aWNlLnJlbmRpdGlvbnNBcGkuZ2V0UmVuZGl0aW9ucyhub2RlSWQpO1xuXG4gICAgICAgIGxldCByZW5kaXRpb246IFJlbmRpdGlvbkVudHJ5ID0gc3VwcG9ydGVkUmVuZGl0aW9uLmxpc3QuZW50cmllcy5maW5kKChyZW5kaXRpb25FbnRyeTogUmVuZGl0aW9uRW50cnkpID0+IHJlbmRpdGlvbkVudHJ5LmVudHJ5LmlkLnRvTG93ZXJDYXNlKCkgPT09IHJlbmRpdGlvbklkKTtcbiAgICAgICAgaWYgKCFyZW5kaXRpb24pIHtcbiAgICAgICAgICAgIHJlbmRpdGlvbklkID0gJ2ltZ3ByZXZpZXcnO1xuICAgICAgICAgICAgcmVuZGl0aW9uID0gc3VwcG9ydGVkUmVuZGl0aW9uLmxpc3QuZW50cmllcy5maW5kKChyZW5kaXRpb25FbnRyeTogUmVuZGl0aW9uRW50cnkpID0+IHJlbmRpdGlvbkVudHJ5LmVudHJ5LmlkLnRvTG93ZXJDYXNlKCkgPT09IHJlbmRpdGlvbklkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChyZW5kaXRpb24pIHtcbiAgICAgICAgICAgIGNvbnN0IHN0YXR1czogc3RyaW5nID0gcmVuZGl0aW9uLmVudHJ5LnN0YXR1cy50b1N0cmluZygpO1xuXG4gICAgICAgICAgICBpZiAoc3RhdHVzID09PSAnTk9UX0NSRUFURUQnKSB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5hcGlTZXJ2aWNlLnJlbmRpdGlvbnNBcGkuY3JlYXRlUmVuZGl0aW9uKG5vZGVJZCwgeyBpZDogcmVuZGl0aW9uSWQgfSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnZpZXdlclR5cGUgPSAnaW5fY3JlYXRpb24nO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgcmVuZGl0aW9uID0gYXdhaXQgdGhpcy53YWl0UmVuZGl0aW9uKG5vZGVJZCwgcmVuZGl0aW9uSWQpO1xuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmxvZ1NlcnZpY2UuZXJyb3IoZXJyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVuZGl0aW9uO1xuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgd2FpdFJlbmRpdGlvbihub2RlSWQ6IHN0cmluZywgcmVuZGl0aW9uSWQ6IHN0cmluZyk6IFByb21pc2U8UmVuZGl0aW9uRW50cnk+IHtcbiAgICAgICAgbGV0IGN1cnJlbnRSZXRyeTogbnVtYmVyID0gMDtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlPFJlbmRpdGlvbkVudHJ5PigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBjb25zdCBpbnRlcnZhbElkID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRSZXRyeSsrO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLm1heFJldHJpZXMgPj0gY3VycmVudFJldHJ5KSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYXBpU2VydmljZS5yZW5kaXRpb25zQXBpLmdldFJlbmRpdGlvbihub2RlSWQsIHJlbmRpdGlvbklkKS50aGVuKChyZW5kaXRpb246IFJlbmRpdGlvbkVudHJ5KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBzdGF0dXM6IHN0cmluZyA9IHJlbmRpdGlvbi5lbnRyeS5zdGF0dXMudG9TdHJpbmcoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzdGF0dXMgPT09ICdDUkVBVEVEJykge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlbmRpdGlvbklkID09PSAncGRmJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnZpZXdlclR5cGUgPSAncGRmJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHJlbmRpdGlvbklkID09PSAnaW1ncHJldmlldycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy52aWV3ZXJUeXBlID0gJ2ltYWdlJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnVybEZpbGVDb250ZW50ID0gdGhpcy5hcGlTZXJ2aWNlLmNvbnRlbnRBcGkuZ2V0UmVuZGl0aW9uVXJsKG5vZGVJZCwgcmVuZGl0aW9uSWQpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xlYXJJbnRlcnZhbChpbnRlcnZhbElkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzb2x2ZShyZW5kaXRpb24pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9LCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnZpZXdlclR5cGUgPSAnZXJyb3JfaW5fY3JlYXRpb24nO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlamVjdCgpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmlzTG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnZpZXdlclR5cGUgPSAnZXJyb3JfaW5fY3JlYXRpb24nO1xuICAgICAgICAgICAgICAgICAgICBjbGVhckludGVydmFsKGludGVydmFsSWQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIHRoaXMuVFJZX1RJTUVPVVQpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBjaGVja0V4dGVuc2lvbnMoZXh0ZW5zaW9uQWxsb3dlZCkge1xuICAgICAgICBpZiAodHlwZW9mIGV4dGVuc2lvbkFsbG93ZWQgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5leHRlbnNpb24udG9Mb3dlckNhc2UoKSA9PT0gZXh0ZW5zaW9uQWxsb3dlZC50b0xvd2VyQ2FzZSgpO1xuICAgICAgICB9IGVsc2UgaWYgKGV4dGVuc2lvbkFsbG93ZWQubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgcmV0dXJuIGV4dGVuc2lvbkFsbG93ZWQuZmluZCgoY3VycmVudEV4dGVuc2lvbikgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmV4dGVuc2lvbi50b0xvd2VyQ2FzZSgpID09PSBjdXJyZW50RXh0ZW5zaW9uLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZW5lcmF0ZUNhY2hlQnVzdGVyTnVtYmVyKCkge1xuICAgICAgICB0aGlzLmNhY2hlQnVzdGVyTnVtYmVyID0gRGF0ZS5ub3coKTtcbiAgICB9XG59XG4iXX0=
