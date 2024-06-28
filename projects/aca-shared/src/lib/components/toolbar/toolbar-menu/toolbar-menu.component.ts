/*!
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { Component, Input, ViewEncapsulation, HostListener, ViewChild, ViewChildren, QueryList, AfterViewInit, OnInit } from '@angular/core';
import { ContentActionRef, DynamicExtensionComponent } from '@alfresco/adf-extensions';
import { MatMenu, MatMenuItem, MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { ThemePalette } from '@angular/material/core';
import { ToolbarMenuItemComponent } from '../toolbar-menu-item/toolbar-menu-item.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { IconComponent } from '@alfresco/adf-core';

@Component({
  standalone: true,
  imports: [CommonModule, TranslateModule, MatButtonModule, MatMenuModule, ToolbarMenuItemComponent, IconComponent, DynamicExtensionComponent],
  selector: 'app-toolbar-menu',
  templateUrl: './toolbar-menu.component.html',
  encapsulation: ViewEncapsulation.None,
  host: { class: 'app-toolbar-menu' }
})
export class ToolbarMenuComponent implements OnInit, AfterViewInit {
  @Input()
  actionRef: ContentActionRef;

  @Input()
  color: ThemePalette;

  @ViewChild('matTrigger')
  matTrigger: MatMenuTrigger;

  @ViewChild(MatMenu)
  menu: MatMenu;

  @ViewChildren(ToolbarMenuItemComponent)
  toolbarMenuItems: QueryList<ToolbarMenuItemComponent>;

  @Input()
  data: {
    menuType?: string;
    color?: string;
  };

  type = 'default';

  @HostListener('document:keydown.Escape')
  handleKeydownEscape() {
    this.matTrigger.closeMenu();
  }

  ngOnInit(): void {
    this.type = this.data?.menuType || 'default';
  }

  ngAfterViewInit(): void {
    const menuItems: MatMenuItem[] = [];
    this.toolbarMenuItems.forEach((toolbarMenuItem: ToolbarMenuItemComponent) => {
      if (toolbarMenuItem.menuItem !== undefined) {
        menuItems.push(toolbarMenuItem.menuItem);
      }
    });
    const menuItemsQueryList: QueryList<MatMenuItem> = new QueryList<MatMenuItem>();
    menuItemsQueryList.reset(menuItems);
    this.menu._allItems = menuItemsQueryList;
    this.menu.ngAfterContentInit();
  }

  trackByActionId(_: number, obj: ContentActionRef): string {
    return obj.id;
  }
}
