/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2018 Alfresco Software Limited
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

import { Component, Input, ViewEncapsulation } from '@angular/core';
import { ContentActionRef } from '@alfresco/adf-extensions';
import { AppExtensionService } from '../../../extensions/extension.service';

export enum ToolbarButtonType {
  ICON_BUTTON = 'icon-button',
  MENU_ITEM = 'menu-item'
}

@Component({
  selector: 'app-toolbar-button',
  templateUrl: 'toolbar-button.component.html',
  encapsulation: ViewEncapsulation.None,
  host: { class: 'app-toolbar-button' }
})
export class ToolbarButtonComponent {
  @Input()
  type: ToolbarButtonType = ToolbarButtonType.ICON_BUTTON;

  @Input()
  color = 'primary';

  @Input()
  actionRef: ContentActionRef;

  constructor(private extensions: AppExtensionService) {}

  runAction() {
    if (this.hasClickAction(this.actionRef)) {
      this.extensions.runActionById(this.actionRef.actions.click);
    }
  }

  private hasClickAction(actionRef: ContentActionRef): boolean {
    if (actionRef && actionRef.actions && actionRef.actions.click) {
      return true;
    }
    return false;
  }
}
