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

import { Component, inject, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { ContentActionRef } from '@alfresco/adf-extensions';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { MatMenuModule } from '@angular/material/menu';
import { ToolbarMenuItemComponent, UserProfileService } from '@alfresco/aca-shared';

@Component({
  standalone: true,
  imports: [CommonModule, TranslateModule, MatButtonModule, MatMenuModule, ToolbarMenuItemComponent],
  selector: 'aca-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: { class: 'aca-user-menu' }
})
export class UserMenuComponent implements OnInit {
  private userProfileService = inject(UserProfileService);

  user$ = this.userProfileService.userProfile$;

  @Input()
  actionRef: ContentActionRef;

  @Input()
  data: { items: any[] };

  ngOnInit() {
    if (this.data?.items) {
      this.data.items.sort((a, b) => a.order - b.order);
    }
  }
}
