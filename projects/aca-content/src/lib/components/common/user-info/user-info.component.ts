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
 * along with Alfresco. If not, see <http://www.gnu.org/licenses/>.
 */

import { IdentityUserModel, IdentityUserService, AuthenticationService, UserInfoMode } from '@alfresco/adf-core';
import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { EcmUserModel, PeopleContentService } from '@alfresco/adf-content-services';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html'
})
export class UserInfoComponent implements OnInit {
  mode: UserInfoMode;
  ecmUser$: Observable<EcmUserModel>;
  identityUser$: Observable<IdentityUserModel>;
  selectedIndex: number;
  userInfoMode = UserInfoMode;

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
      this.mode = UserInfoMode.SSO;

      if (this.authService.isECMProvider() && this.authService.isEcmLoggedIn()) {
        this.mode = UserInfoMode.CONTENT_SSO;
        this.loadEcmUserInfo();
      }
    } else if (this.isEcmLoggedIn()) {
      this.loadEcmUserInfo();
      this.mode = UserInfoMode.CONTENT;
    }
  }

  get isLoggedIn(): boolean {
    if (this.authService.isKerberosEnabled()) {
      return true;
    }
    return this.authService.isLoggedIn();
  }

  private loadEcmUserInfo(): void {
    this.ecmUser$ = this.peopleContentService.getCurrentUserInfo();
  }

  private loadIdentityUserInfo() {
    this.identityUser$ = of(this.identityUserService.getCurrentUserInfo());
  }

  private isEcmLoggedIn() {
    return this.authService.isEcmLoggedIn() || (this.authService.isECMProvider() && this.authService.isKerberosEnabled());
  }
}
