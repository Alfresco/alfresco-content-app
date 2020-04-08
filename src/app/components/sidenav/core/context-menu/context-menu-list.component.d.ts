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
import { AfterViewInit, QueryList } from '@angular/core';
import { MatMenuItem } from '@angular/material';
import { ContextMenuOverlayRef } from './context-menu-overlay';
export declare class ContextMenuListComponent implements AfterViewInit {
  private contextMenuOverlayRef;
  private data;
  private keyManager;
  items: QueryList<MatMenuItem>;
  links: any[];
  handleKeydownEscape(event: KeyboardEvent): void;
  handleKeydownEvent(event: KeyboardEvent): void;
  constructor(contextMenuOverlayRef: ContextMenuOverlayRef, data: any);
  onMenuItemClick(event: Event, menuItem: any): void;
  ngAfterViewInit(): void;
}
