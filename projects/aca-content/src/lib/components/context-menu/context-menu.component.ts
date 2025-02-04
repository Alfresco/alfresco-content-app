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

import { AfterViewInit, Component, DestroyRef, inject, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { DynamicExtensionComponent } from '@alfresco/adf-extensions';
import { ContextMenuOverlayRef } from './context-menu-overlay';
import { CONTEXT_MENU_DIRECTION } from './direction.token';
import { Direction } from '@angular/cdk/bidi';
import { AppExtensionService } from '@alfresco/aca-shared';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatDividerModule } from '@angular/material/divider';
import { IconComponent } from '@alfresco/adf-core';
import { ContextMenuItemComponent } from './context-menu-item.component';
import { OutsideEventDirective } from './context-menu-outside-event.directive';
import { BaseContextMenuDirective } from './base-context-menu.directive';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    MatMenuModule,
    MatDividerModule,
    ContextMenuItemComponent,
    OutsideEventDirective,
    IconComponent,
    DynamicExtensionComponent
  ],
  selector: 'aca-context-menu',
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.scss'],
  host: {
    class: 'aca-context-menu-holder'
  },
  encapsulation: ViewEncapsulation.None
})
export class ContextMenuComponent extends BaseContextMenuDirective implements OnInit, AfterViewInit {
  private readonly destroyRef = inject(DestroyRef);

  constructor(contextMenuOverlayRef: ContextMenuOverlayRef, extensions: AppExtensionService, @Inject(CONTEXT_MENU_DIRECTION) direction: Direction) {
    super(contextMenuOverlayRef, extensions, direction);
  }

  ngOnInit() {
    this.extensions
      .getAllowedContextMenuActions()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((actions) => {
        this.actions = actions;
      });
  }

  ngAfterViewInit() {
    if (this.actions.length) {
      setTimeout(() => this.trigger.openMenu(), 0);
    }
  }
}
