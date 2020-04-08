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
  ViewContainerRef,
  ComponentFactoryResolver,
  OnInit
} from '@angular/core';
import { ClipboardService } from './clipboard.service';
export declare class ClipboardDirective {
  private clipboardService;
  viewContainerRef: ViewContainerRef;
  private resolver;
  /** Translation key or message for the tooltip. */
  placeholder: string;
  /** Reference to the HTML element containing the text to copy. */
  target: HTMLInputElement | HTMLTextAreaElement;
  /** Translation key or message for snackbar notification. */
  message: string;
  constructor(
    clipboardService: ClipboardService,
    viewContainerRef: ViewContainerRef,
    resolver: ComponentFactoryResolver
  );
  handleClickEvent(event: MouseEvent): void;
  showTooltip(): void;
  closeTooltip(): void;
  private copyToClipboard;
  private copyContentToClipboard;
}
export declare class ClipboardComponent implements OnInit {
  placeholder: string;
  ngOnInit(): void;
}
