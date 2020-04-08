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
import { ElementRef, Renderer2, AfterViewChecked } from '@angular/core';
import { HighlightTransformService } from '../services/highlight-transform.service';
export declare class HighlightDirective implements AfterViewChecked {
  private el;
  private renderer;
  private highlightTransformService;
  /** Class selector for highlightable elements. */
  selector: string;
  /** Text to highlight. */
  search: string;
  /** CSS class used to apply highlighting. */
  classToApply: string;
  constructor(
    el: ElementRef,
    renderer: Renderer2,
    highlightTransformService: HighlightTransformService
  );
  ngAfterViewChecked(): void;
  highlight(search?: string, selector?: string, classToApply?: string): void;
}
