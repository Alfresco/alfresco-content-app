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
  TemplateRef,
  OnChanges,
  OnDestroy,
  EventEmitter,
  SimpleChanges
} from '@angular/core';
import { MatDialog } from '@angular/material';
import { LogService } from '../../services/log.service';
import { RenderingQueueServices } from '../services/rendering-queue.services';
import { AppConfigService } from './../../app-config/app-config.service';
import { PDFDocumentProxy, PDFSource } from 'pdfjs-dist';
export declare class PdfViewerComponent implements OnChanges, OnDestroy {
  private dialog;
  private renderingQueueServices;
  private logService;
  private appConfigService;
  urlFile: string;
  blobFile: Blob;
  nameFile: string;
  showToolbar: boolean;
  allowThumbnails: boolean;
  thumbnailsTemplate: TemplateRef<any>;
  rendered: EventEmitter<any>;
  error: EventEmitter<any>;
  close: EventEmitter<any>;
  page: number;
  displayPage: number;
  totalPages: number;
  loadingPercent: number;
  pdfViewer: any;
  currentScaleMode: string;
  currentScale: number;
  MAX_AUTO_SCALE: number;
  DEFAULT_SCALE_DELTA: number;
  MIN_SCALE: number;
  MAX_SCALE: number;
  loadingTask: any;
  isPanelDisabled: boolean;
  showThumbnails: boolean;
  pdfThumbnailsContext: {
    viewer: any;
  };
  randomPdfId: string;
  readonly currentScaleText: string;
  constructor(
    dialog: MatDialog,
    renderingQueueServices: RenderingQueueServices,
    logService: LogService,
    appConfigService: AppConfigService
  );
  getUserScaling(): number;
  checkLimits(scaleConfig: number): number;
  ngOnChanges(changes: SimpleChanges): void;
  executePdf(pdfOptions: PDFSource): void;
  initPDFViewer(pdfDocument: PDFDocumentProxy): void;
  ngOnDestroy(): void;
  toggleThumbnails(): void;
  /**
   * Method to scale the page current support implementation
   *
   * @param scaleMode - new scale mode
   */
  scalePage(scaleMode: any): void;
  private getDocumentContainer;
  private getViewer;
  /**
   * Update all the pages with the newScale scale
   *
   * @param newScale - new scale page
   */
  setScaleUpdatePages(newScale: number): void;
  /**
   * Check if the request scale of the page is the same for avoid useless re-rendering
   *
   * @param oldScale - old scale page
   * @param newScale - new scale page
   *
   */
  isSameScale(oldScale: number, newScale: number): boolean;
  /**
   * Check if is a land scape view
   *
   * @param width
   * @param height
   */
  isLandscape(width: number, height: number): boolean;
  /**
   * Method triggered when the page is resized
   */
  onResize(): void;
  /**
   * toggle the fit page pdf
   */
  pageFit(): void;
  /**
   * zoom in page pdf
   *
   * @param ticks
   */
  zoomIn(ticks?: number): void;
  /**
   * zoom out page pdf
   *
   * @param ticks
   */
  zoomOut(ticks?: number): void;
  /**
   * load the previous page
   */
  previousPage(): void;
  /**
   * load the next page
   */
  nextPage(): void;
  /**
   * load the page in input
   *
   * @param page to load
   */
  inputPage(page: string): void;
  /**
   * Page Change Event
   *
   * @param event
   */
  onPageChange(event: any): void;
  onPdfPassword(callback: any, reason: any): void;
  /**
   * Page Rendered Event
   */
  onPageRendered(): void;
  /**
   * Pages Loaded Event
   *
   * @param event
   */
  onPagesLoaded(): void;
  /**
   * Keyboard Event Listener
   * @param KeyboardEvent event
   */
  handleKeyboardEvent(event: KeyboardEvent): void;
  private generateUuid;
}
