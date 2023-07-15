/*!
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { PeopleContentService } from '@alfresco/adf-content-services';
import { AuthenticationService, IdentityUserService } from '@alfresco/adf-core';
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ContentActionRef } from '@alfresco/adf-extensions';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { MatMenuModule } from '@angular/material/menu';
import { ToolbarMenuItemComponent } from '@alfresco/aca-shared';

@Component({
  standalone: true,
  imports: [CommonModule, TranslateModule, MatButtonModule, MatMenuModule, ToolbarMenuItemComponent],
  selector: 'aca-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UserMenuComponent implements OnInit {
  displayName$: Observable<{ firstName: string; initials: string }>;
  @Input()
  actionRef: ContentActionRef;
  @Input()
  data: { items: any[] };

  constructor(
    private peopleContentService: PeopleContentService,
    private identityUserService: IdentityUserService,
    private authService: AuthenticationService
  ) {}

  ngOnInit() {
    this.getUserInfo();
    if (this.data && this.data.items) {
      this.data.items.sort((a, b) => a.order - b.order);
    }
  }

  getUserInfo() {
    if (this.authService.isOauth()) {
      this.loadIdentityUserInfo();

      if (this.authService.isECMProvider() && this.authService.isEcmLoggedIn()) {
        this.loadEcmUserInfo();
      }
    } else if (this.isEcmLoggedIn()) {
      this.loadEcmUserInfo();
    }
  }

  get isLoggedIn(): boolean {
    if (this.authService.isKerberosEnabled()) {
      return true;
    }
    return this.authService.isLoggedIn();
  }

  private loadEcmUserInfo(): void {
    this.displayName$ = this.peopleContentService.getCurrentUserInfo().pipe(map((model) => this.parseDisplayName(model)));
  }

  private loadIdentityUserInfo() {
    this.displayName$ = of(this.identityUserService.getCurrentUserInfo()).pipe(map((model) => this.parseDisplayName(model)));
  }

  parseDisplayName(model: { firstName?: string; lastName?: string }): { firstName: string; initials: string } {
    const result = { firstName: '', initials: '' };
    if (model.firstName) {
      result.initials = model.firstName.charAt(0).toUpperCase();
    }
    if (model.lastName) {
      result.initials += model.lastName.charAt(0).toUpperCase();
    }
    return result;
  }

  private isEcmLoggedIn() {
    return this.authService.isEcmLoggedIn() || (this.authService.isECMProvider() && this.authService.isKerberosEnabled());
  }
}
