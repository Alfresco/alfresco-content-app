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
  ElementRef,
  NgZone,
  OnDestroy,
  OnInit,
  Renderer2
} from '@angular/core';
import { FileInfo } from '../utils/file-utils';
export declare class UploadDirective implements OnInit, OnDestroy {
  private el;
  private renderer;
  private ngZone;
  /** Enables/disables uploading. */
  enabled: boolean;
  /** Data to upload. */
  data: any;
  /** Upload mode. Can be "drop" (receives dropped files) or "click"
   * (clicking opens a file dialog). Both modes can be active at once.
   */
  mode: string[];
  /** Toggles multiple file uploads. */
  multiple: boolean;
  /** (Click mode only) MIME type filter for files to accept. */
  accept: string;
  /** (Click mode only) Toggles uploading of directories. */
  directory: boolean;
  isDragging: boolean;
  private cssClassName;
  private upload;
  private element;
  constructor(el: ElementRef, renderer: Renderer2, ngZone: NgZone);
  ngOnInit(): void;
  ngOnDestroy(): void;
  onClick(event: Event): void;
  onDragEnter(): void;
  onDragOver(event: Event): boolean;
  onDragLeave(): void;
  onDrop(event: Event): boolean;
  onUploadFiles(files: FileInfo[]): void;
  protected hasMode(mode: string): boolean;
  protected isDropMode(): boolean;
  protected isClickMode(): boolean;
  getDataTransfer(event: Event | any): DataTransfer;
  /**
   * Extract files from the DataTransfer object used to hold the data that is being dragged during a drag and drop operation.
   * @param dataTransfer DataTransfer object
   */
  getFilesDropped(dataTransfer: DataTransfer): Promise<FileInfo[]>;
  /**
   * Invoked when user selects files or folders by means of File Dialog
   * @param event DOM event
   */
  onSelectFiles(event: any): void;
}
