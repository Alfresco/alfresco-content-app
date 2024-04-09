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

import { Component, OnInit, Input, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { NavBarLinkRef } from '@alfresco/adf-extensions';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { IconModule } from '@alfresco/adf-core';
import { MatButtonModule } from '@angular/material/button';
import { ActiveLinkDirective } from '../directives/active-link.directive';
import { ActionDirective } from '../directives/action.directive';
import { MatExpansionModule } from '@angular/material/expansion';
import { ExpansionPanelDirective } from '../directives/expansion-panel.directive';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    IconModule,
    MatButtonModule,
    ActiveLinkDirective,
    ActionDirective,
    MatExpansionModule,
    ExpansionPanelDirective
  ],
  selector: 'app-expand-menu',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './expand-menu.component.html',
  host: { class: 'app-expand-menu' }
})
export class ExpandMenuComponent implements OnInit {
  @Input()
  item: NavBarLinkRef;

  constructor(private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.cd.detectChanges();
  }

  trackById(_index: number, obj: NavBarLinkRef) {
    return obj.id;
  }
}
