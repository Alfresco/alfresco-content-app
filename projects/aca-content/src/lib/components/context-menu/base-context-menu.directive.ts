/*!
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * Alfresco Example Content Application
 *
 * This file is part of the Alfresco Example Content Application.
 * If the software was purchased under a paid Alfresco license, the terms of
 * the paid license agreement will prevail. Otherwise, the software is
 * provided under the following open source license terms:
 *
 * The Alfresco Example Content Application is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * The Alfresco Example Content Application is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * from Hyland Software. If not, see <http://www.gnu.org/licenses/>.
 */

import { HostListener, ViewChild, Inject, Directive } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { ContentActionRef } from '@alfresco/adf-extensions';
import { ContextMenuOverlayRef } from './context-menu-overlay';
import { CONTEXT_MENU_DIRECTION } from './direction.token';
import { Direction } from '@angular/cdk/bidi';
import { AppExtensionService } from '@alfresco/aca-shared';

@Directive()
export class BaseContextMenuDirective {
  actions: Array<ContentActionRef> = [];

  @ViewChild(MatMenuTrigger)
  trigger: MatMenuTrigger;

  @HostListener('keydown.escape', ['$event'])
  handleKeydownEscape(event: KeyboardEvent) {
    if (event && this.contextMenuOverlayRef) {
      this.contextMenuOverlayRef.close();
    }
  }

  constructor(
    private readonly contextMenuOverlayRef: ContextMenuOverlayRef,
    protected extensions: AppExtensionService,
    @Inject(CONTEXT_MENU_DIRECTION) public direction: Direction
  ) {}

  onClickOutsideEvent() {
    if (this.contextMenuOverlayRef) {
      this.contextMenuOverlayRef.close();
    }
  }

  runAction(contentActionRef: ContentActionRef) {
    this.extensions.runActionById(contentActionRef.actions.click, {
      focusedElementOnCloseSelector: '.adf-context-menu-source'
    });
  }

  trackByActionId(_: number, obj: ContentActionRef): string {
    return obj.id;
  }
}
