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

import { AfterViewInit, Component, inject, Input, OnInit, QueryList, ViewChild, ViewChildren, ViewEncapsulation } from '@angular/core';
import { ContentActionRef } from '@alfresco/adf-extensions';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';
import { MatMenu, MatMenuItem, MatMenuModule } from '@angular/material/menu';
import { ToolbarMenuItemComponent, UserProfileService } from '@alfresco/aca-shared';

@Component({
  imports: [CommonModule, TranslatePipe, MatButtonModule, MatMenuModule, ToolbarMenuItemComponent],
  selector: 'aca-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: { class: 'aca-user-menu' }
})
export class UserMenuComponent implements OnInit, AfterViewInit {
  private userProfileService = inject(UserProfileService);

  user$ = this.userProfileService.userProfile$;

  @Input()
  actionRef: ContentActionRef;

  @Input()
  data: { items: any[] };

  @ViewChild(MatMenu)
  menu: MatMenu;

  @ViewChildren(ToolbarMenuItemComponent)
  toolbarMenuItems: QueryList<ToolbarMenuItemComponent>;

  ngOnInit() {
    if (this.data?.items) {
      this.data.items.sort((a, b) => a.order - b.order);
    }
  }

  ngAfterViewInit() {
    const menuItems = this.toolbarMenuItems.map((toolbarMenuItem) => toolbarMenuItem.menuItem).filter((menuItem) => menuItem !== undefined);

    const menuItemsQueryList = new QueryList<MatMenuItem>();
    menuItemsQueryList.reset(menuItems);
    this.menu._allItems = menuItemsQueryList;
    this.menu.ngAfterContentInit();
  }
}
