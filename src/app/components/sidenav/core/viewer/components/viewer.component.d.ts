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
  EventEmitter,
  ElementRef,
  OnChanges,
  TemplateRef,
  OnInit,
  OnDestroy
} from '@angular/core';
import { Node, NodeEntry } from '@alfresco/js-api';
import { BaseEvent } from '../../events';
import { AlfrescoApiService } from '../../services/alfresco-api.service';
import { LogService } from '../../services/log.service';
import { ViewerMoreActionsComponent } from './viewer-more-actions.component';
import { ViewerOpenWithComponent } from './viewer-open-with.component';
import { ViewerSidebarComponent } from './viewer-sidebar.component';
import { ViewerToolbarComponent } from './viewer-toolbar.component';
import { ViewUtilService } from '../services/view-util.service';
import {
  AppExtensionService,
  ViewerExtensionRef
} from '@alfresco/adf-extensions';
export declare class ViewerComponent implements OnChanges, OnInit, OnDestroy {
  private apiService;
  private viewUtils;
  private logService;
  private extensionService;
  private el;
  toolbar: ViewerToolbarComponent;
  sidebar: ViewerSidebarComponent;
  mnuOpenWith: ViewerOpenWithComponent;
  mnuMoreActions: ViewerMoreActionsComponent;
  /** If you want to load an external file that does not come from ACS you
   * can use this URL to specify where to load the file from.
   */
  urlFile: string;
  /** Viewer to use with the `urlFile` address (`pdf`, `image`, `media`, `text`).
   * Used when `urlFile` has no filename and extension.
   */
  urlFileViewer: string;
  /** Loads a Blob File */
  blobFile: Blob;
  /** Node Id of the file to load. */
  nodeId: string;
  /** Shared link id (to display shared file). */
  sharedLinkId: string;
  /** If `true` then show the Viewer as a full page over the current content.
   * Otherwise fit inside the parent div.
   */
  overlayMode: boolean;
  /** Hide or show the viewer */
  showViewer: boolean;
  /** Hide or show the toolbar */
  showToolbar: boolean;
  /** Specifies the name of the file when it is not available from the URL. */
  displayName: string;
  /** @deprecated 3.2.0 */
  /** Allows `back` navigation */
  allowGoBack: boolean;
  /** Toggles downloading. */
  allowDownload: boolean;
  /** Toggles printing. */
  allowPrint: boolean;
  /** Toggles the 'Full Screen' feature. */
  allowFullScreen: boolean;
  /** Toggles before/next navigation. You can use the arrow buttons to navigate
   * between documents in the collection.
   */
  allowNavigate: boolean;
  /** Toggles the "before" ("<") button. Requires `allowNavigate` to be enabled. */
  canNavigateBefore: boolean;
  /** Toggles the next (">") button. Requires `allowNavigate` to be enabled. */
  canNavigateNext: boolean;
  /** Allow the left the sidebar. */
  allowLeftSidebar: boolean;
  /** Allow the right sidebar. */
  allowRightSidebar: boolean;
  /** Toggles PDF thumbnails. */
  allowThumbnails: boolean;
  /** Toggles right sidebar visibility. Requires `allowRightSidebar` to be set to `true`. */
  showRightSidebar: boolean;
  /** Toggles left sidebar visibility. Requires `allowLeftSidebar` to be set to `true`. */
  showLeftSidebar: boolean;
  /** The template for the right sidebar. The template context contains the loaded node data. */
  sidebarRightTemplate: TemplateRef<any>;
  /** The template for the left sidebar. The template context contains the loaded node data. */
  sidebarLeftTemplate: TemplateRef<any>;
  /** The template for the pdf thumbnails. */
  thumbnailsTemplate: TemplateRef<any>;
  /** MIME type of the file content (when not determined by the filename extension). */
  mimeType: string;
  /** Content filename. */
  fileName: string;
  /** Number of times the Viewer will retry fetching content Rendition.
   * There is a delay of at least one second between attempts.
   */
  maxRetries: number;
  /** Emitted when user clicks the 'Back' button. */
  goBack: EventEmitter<BaseEvent<any>>;
  /** Emitted when user clicks the 'Print' button. */
  print: EventEmitter<BaseEvent<any>>;
  /** Emitted when the viewer is shown or hidden. */
  showViewerChange: EventEmitter<boolean>;
  /** Emitted when the filename extension changes. */
  extensionChange: EventEmitter<string>;
  /** Emitted when user clicks 'Navigate Before' ("<") button. */
  navigateBefore: EventEmitter<KeyboardEvent | MouseEvent>;
  /** Emitted when user clicks 'Navigate Next' (">") button. */
  navigateNext: EventEmitter<KeyboardEvent | MouseEvent>;
  /** Emitted when the shared link used is not valid. */
  invalidSharedLink: EventEmitter<{}>;
  TRY_TIMEOUT: number;
  viewerType: string;
  isLoading: boolean;
  nodeEntry: NodeEntry;
  extensionTemplates: {
    template: TemplateRef<any>;
    isVisible: boolean;
  }[];
  externalExtensions: string[];
  urlFileContent: string;
  otherMenu: any;
  extension: string;
  sidebarRightTemplateContext: {
    node: Node;
  };
  sidebarLeftTemplateContext: {
    node: Node;
  };
  fileTitle: string;
  viewerExtensions: Array<ViewerExtensionRef>;
  private cacheBusterNumber;
  private subscriptions;
  private extensions;
  private mimeTypes;
  constructor(
    apiService: AlfrescoApiService,
    viewUtils: ViewUtilService,
    logService: LogService,
    extensionService: AppExtensionService,
    el: ElementRef
  );
  isSourceDefined(): boolean;
  ngOnInit(): void;
  private loadExtensions;
  ngOnDestroy(): void;
  private onNodeUpdated;
  ngOnChanges(): void;
  private setUpBlobData;
  private setUpUrlFile;
  private setUpNodeFile;
  private setUpSharedLinkFile;
  toggleSidebar(): void;
  toggleLeftSidebar(): void;
  private getDisplayName;
  scrollTop(): void;
  getViewerTypeByMimeType(mimeType: string): string;
  getViewerTypeByExtension(
    extension: string
  ): 'text' | 'image' | 'media' | 'pdf' | 'unknown' | 'custom';
  onBackButtonClick(): void;
  onNavigateBeforeClick(event: MouseEvent | KeyboardEvent): void;
  onNavigateNextClick(event: MouseEvent | KeyboardEvent): void;
  /**
   * close the viewer
   */
  close(): void;
  /**
   * get File name from url
   *
   * @param  url - url file
   */
  getFilenameFromUrl(url: string): string;
  /**
   * Get file extension from the string.
   * Supports the URL formats like:
   * http://localhost/test.jpg?cache=1000
   * http://localhost/test.jpg#cache=1000
   *
   * @param fileName - file name
   */
  getFileExtension(fileName: string): string;
  isCustomViewerExtension(extension: string): boolean;
  /**
   * Keyboard event listener
   * @param  event
   */
  handleKeyboardEvent(event: KeyboardEvent): void;
  printContent(): void;
  /**
   * Triggers full screen mode with a main content area displayed.
   */
  enterFullScreen(): void;
  private displayNodeRendition;
  private displaySharedLinkRendition;
  private resolveRendition;
  private waitRendition;
  checkExtensions(extensionAllowed: any): any;
  private generateCacheBusterNumber;
}
