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

import { IdentityUserService, AuthenticationService } from '@alfresco/adf-core';
import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { PeopleContentService } from '@alfresco/adf-content-services';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html'
})
export class UserInfoComponent implements OnInit {
  displayName$: Observable<string>;

  constructor(
    private peopleContentService: PeopleContentService,
    private identityUserService: IdentityUserService,
    private authService: AuthenticationService
  ) {}

  ngOnInit() {
    this.getUserInfo();
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

  private parseDisplayName(model: { firstName?: string; email?: string }): string {
    let result = model.firstName;

    if (model.email) {
      result = `${model.firstName} (${model.email})`;
    }

    return result;
  }

  private isEcmLoggedIn() {
    return this.authService.isEcmLoggedIn() || (this.authService.isECMProvider() && this.authService.isKerberosEnabled());
  }
}
