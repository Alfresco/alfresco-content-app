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
import { OverlayContainer } from '@angular/cdk/overlay';
import { ViewportRuler } from '@angular/cdk/scrolling';
import { OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { MatMenuTrigger } from '@angular/material';
import { ContextMenuService } from './context-menu.service';
export declare class ContextMenuHolderComponent implements OnInit, OnDestroy {
  private viewport;
  private overlayContainer;
  private contextMenuService;
  private renderer;
  links: any[];
  private mouseLocation;
  private menuElement;
  private subscriptions;
  private contextMenuListenerFn;
  showIcons: boolean;
  menuTrigger: MatMenuTrigger;
  onShowContextMenu(event?: MouseEvent): void;
  onResize(): void;
  constructor(
    viewport: ViewportRuler,
    overlayContainer: OverlayContainer,
    contextMenuService: ContextMenuService,
    renderer: Renderer2
  );
  ngOnInit(): void;
  ngOnDestroy(): void;
  onMenuItemClick(event: Event, menuItem: any): void;
  showMenu(mouseEvent: any, links: any): void;
  readonly mdMenuElement: any;
  private locationCss;
  private updatePosition;
  private getContextMenuElement;
}
