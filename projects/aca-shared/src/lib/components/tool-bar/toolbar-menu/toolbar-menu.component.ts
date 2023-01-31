/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2020 Alfresco Software Limited
 *
 * This file is part of the Alfresco Example Content Application.
 * If the software was purchased under a paid Alfresco license, the terms of
 * the paid license agreement will prevail.  Otherwise, the software is
 * provided under the following open source license terms:
 *
 * The Alfresco Example Content Application is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * The Alfresco Example Content Application is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with Alfresco. If not, see <http://www.gnu.org/licenses/>.
 */

import { Component, Input, ViewEncapsulation, HostListener, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { ContentActionRef } from '@alfresco/adf-extensions';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { ThemePalette } from '@angular/material/core';
import { ToolbarMenuItemComponent } from '../toolbar-menu-item/toolbar-menu-item.component';

@Component({
  selector: 'app-toolbar-menu',
  templateUrl: './toolbar-menu.component.html',
  encapsulation: ViewEncapsulation.None,
  host: { class: 'app-toolbar-menu' }
})
export class ToolbarMenuComponent {
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

  @HostListener('document:keydown.Escape')
  handleKeydownEscape() {
    this.matTrigger.closeMenu();
  }

  trackByActionId(_: number, obj: ContentActionRef): string {
    return obj.id;
  }

  onCustomItemContainerClick(event) {
    console.log(event);
    const el: HTMLElement = event.target;
    const x = window.scrollX + el.getBoundingClientRect().left + 5;
    const y = window.scrollY + el.getBoundingClientRect().top + 5;

    const opts = {
      bubbles: false,
      screenX: x,
      screenY: y
    };

    const ev = new MouseEvent('click', opts);
    document.elementFromPoint(x, y).dispatchEvent(ev);
    event.stopPropagation();
  }
}
