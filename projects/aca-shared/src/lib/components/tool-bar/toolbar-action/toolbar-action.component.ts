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

import { Component, ViewEncapsulation, ChangeDetectionStrategy, Input, DoCheck, ChangeDetectorRef } from '@angular/core';
import { ContentActionRef } from '@alfresco/adf-extensions';
import { ToolbarButtonType } from '../toolbar-button/toolbar-button.component';
import { ThemePalette } from '@angular/material/core';

@Component({
  selector: 'aca-toolbar-action',
  templateUrl: './toolbar-action.component.html',
  styleUrls: ['./toolbar-action.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'aca-toolbar-action' }
})
export class ToolbarActionComponent implements DoCheck {
  @Input()
  type: ToolbarButtonType = ToolbarButtonType.ICON_BUTTON;

  @Input()
  color: ThemePalette;

  @Input()
  actionRef: ContentActionRef;

  constructor(private cd: ChangeDetectorRef) {}

  // todo: review after ADF 2.6
  // preview component : change detection workaround for children without input
  ngDoCheck() {
    if (this.actionRef.id.includes('app.viewer')) {
      this.cd.markForCheck();
    }
  }
}
