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

import { AfterViewInit, Component, DestroyRef, inject, Inject, OnInit, QueryList, ViewChild, ViewChildren, ViewEncapsulation } from '@angular/core';
import { MatMenu, MatMenuItem, MatMenuModule } from '@angular/material/menu';
import { ContentActionType, DynamicExtensionComponent } from '@alfresco/adf-extensions';
import { ContextMenuOverlayRef } from './context-menu-overlay';
import { CONTEXT_MENU_DIRECTION } from './direction.token';
import { Direction } from '@angular/cdk/bidi';
import { AppExtensionService } from '@alfresco/aca-shared';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { MatDividerModule } from '@angular/material/divider';
import { IconComponent } from '@alfresco/adf-core';
import { ContextMenuItemComponent } from './context-menu-item.component';
import { OutsideEventDirective } from './context-menu-outside-event.directive';
import { BaseContextMenuDirective } from './base-context-menu.directive';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
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
  selector: 'aca-context-menu',
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.scss'],
  host: {
    class: 'aca-context-menu-holder'
  },
  encapsulation: ViewEncapsulation.None
})
export class ContextMenuComponent extends BaseContextMenuDirective implements OnInit, AfterViewInit {
  @ViewChildren(DynamicExtensionComponent)
  dynamicExtensionComponents: QueryList<DynamicExtensionComponent>;

  @ViewChild(MatMenu)
  menu: MatMenu;

  @ViewChildren(MatMenuItem)
  matMenuItems: QueryList<MatMenuItem>;

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

    const itemsById = this.createMenuItemsLookup();
    const orderedItems = this.createOrderedItemsList(itemsById);

    const menuItemsQueryList = new QueryList<MatMenuItem>();
    menuItemsQueryList.reset(orderedItems);
    this.menu._allItems = menuItemsQueryList;
    this.menu.ngAfterContentInit();
  }

  private createMenuItemsLookup(): Map<string, MatMenuItem> {
    const itemsById = new Map<string, MatMenuItem>();
    this.matMenuItems.forEach((item) => {
      itemsById.set(item._getHostElement()?.getAttribute('id'), item);
    });

    this.dynamicExtensionComponents.forEach((component) => {
      if (component.menuItem && component.id) {
        itemsById.set(component.id, component.menuItem);
      }
    });
    return itemsById;
  }

  private createOrderedItemsList(itemsById: Map<string, MatMenuItem>): MatMenuItem[] {
    const orderedItems: MatMenuItem[] = [];

    this.actions.forEach((action) => {
      const lookupId = action.type === ContentActionType.custom ? action.component : action.id;
      const item = lookupId ? itemsById.get(lookupId) : undefined;

      if (item) {
        orderedItems.push(item);
      }
    });
    return orderedItems;
  }
}
