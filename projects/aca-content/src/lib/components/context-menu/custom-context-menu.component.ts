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

import { AfterViewInit, Component, Inject, ViewEncapsulation } from '@angular/core';
import { Direction } from '@angular/cdk/bidi';
import { ContextMenuOverlayRef } from './context-menu-overlay';
import { AppExtensionService } from '@alfresco/aca-shared';
import { CONTEXT_MENU_DIRECTION } from './direction.token';
import { ContentActionRef, DynamicExtensionComponent } from '@alfresco/adf-extensions';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { MatMenuModule } from '@angular/material/menu';
import { ContextMenuItemComponent } from './context-menu-item.component';
import { OutsideEventDirective } from './context-menu-outside-event.directive';
import { MatDividerModule } from '@angular/material/divider';
import { IconComponent } from '@alfresco/adf-core';
import { CONTEXT_MENU_CUSTOM_ACTIONS } from './custom-context-menu-actions.token';
import { BaseContextMenuDirective } from './base-context-menu.directive';

@Component({
  selector: 'aca-custom-context-menu',
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.scss'],
  imports: [
    CommonModule,
    TranslatePipe,
    MatMenuModule,
    MatDividerModule,
    ContextMenuItemComponent,
    OutsideEventDirective,
    IconComponent,
    DynamicExtensionComponent
  ],
  host: {
    class: 'aca-context-menu-holder'
  },
  encapsulation: ViewEncapsulation.None
})
export class CustomContextMenuComponent extends BaseContextMenuDirective implements AfterViewInit {
  constructor(
    contextMenuOverlayRef: ContextMenuOverlayRef,
    extensions: AppExtensionService,
    @Inject(CONTEXT_MENU_DIRECTION) direction: Direction,
    @Inject(CONTEXT_MENU_CUSTOM_ACTIONS) customActions: ContentActionRef[]
  ) {
    super(contextMenuOverlayRef, extensions, direction);
    this.actions = customActions;
  }

  ngAfterViewInit() {
    setTimeout(() => this.trigger.openMenu(), 0);
  }
}
