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

import { Component, Input, ViewEncapsulation } from '@angular/core';
import { ContentActionRef } from '@alfresco/adf-extensions';
import { AppExtensionService } from '../../../services/app.extension.service';
import { ThemePalette } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { IconModule } from '@alfresco/adf-core';
import { TranslateModule } from '@ngx-translate/core';
import { ToolbarMenuItemComponent } from '../toolbar-menu-item/toolbar-menu-item.component';

export enum ToolbarButtonType {
  ICON_BUTTON = 'icon-button',
  FLAT_BUTTON = 'flat-button',
  STROKED_BUTTON = 'stroked-button',
  MENU_ITEM = 'menu-item'
}

@Component({
  standalone: true,
  imports: [CommonModule, TranslateModule, MatButtonModule, IconModule, ToolbarMenuItemComponent],
  selector: 'app-toolbar-button',
  templateUrl: './toolbar-button.component.html',
  encapsulation: ViewEncapsulation.None,
  host: { class: 'app-toolbar-button' }
})
export class ToolbarButtonComponent {
  @Input()
  data: {
    buttonType?: ToolbarButtonType;
    color?: string;
  };

  @Input()
  type: ToolbarButtonType = ToolbarButtonType.ICON_BUTTON;

  @Input()
  color: ThemePalette;

  @Input()
  actionRef: ContentActionRef;

  constructor(private extensions: AppExtensionService) {}

  runAction() {
    if (this.hasClickAction(this.actionRef)) {
      this.extensions.runActionById(this.actionRef.actions.click, {
        focusedElementOnCloseSelector: `#${this.actionRef.id.replace(/\\/g, '\\\\').replace(/\./g, '\\.')}`
      });
    }
  }

  private hasClickAction(actionRef: ContentActionRef): boolean {
    return !!actionRef?.actions?.click;
  }
}
