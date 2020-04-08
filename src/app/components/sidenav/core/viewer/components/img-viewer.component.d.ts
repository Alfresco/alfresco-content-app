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
  OnChanges,
  SimpleChanges,
  ElementRef,
  OnInit,
  OnDestroy
} from '@angular/core';
import { ContentService } from '../../services/content.service';
import { AppConfigService } from './../../app-config/app-config.service';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
export declare class ImgViewerComponent
  implements OnInit, OnChanges, OnDestroy {
  private sanitizer;
  private appConfigService;
  private contentService;
  private el;
  showToolbar: boolean;
  urlFile: string;
  blobFile: Blob;
  nameFile: string;
  rotate: number;
  scaleX: number;
  scaleY: number;
  offsetX: number;
  offsetY: number;
  step: number;
  isDragged: boolean;
  private drag;
  private delta;
  readonly transform: SafeStyle;
  readonly currentScaleText: string;
  private element;
  constructor(
    sanitizer: DomSanitizer,
    appConfigService: AppConfigService,
    contentService: ContentService,
    el: ElementRef
  );
  initializeScaling(): void;
  ngOnInit(): void;
  ngOnDestroy(): void;
  onKeyDown(event: KeyboardEvent): void;
  onMouseDown(event: MouseEvent): void;
  onMouseMove(event: MouseEvent): void;
  onMouseUp(event: MouseEvent): void;
  onMouseLeave(event: MouseEvent): void;
  onMouseOut(event: MouseEvent): void;
  ngOnChanges(changes: SimpleChanges): void;
  zoomIn(): void;
  zoomOut(): void;
  rotateLeft(): void;
  rotateRight(): void;
  reset(): void;
}
