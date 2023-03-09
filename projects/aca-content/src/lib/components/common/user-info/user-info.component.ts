/*
 * Copyright © 2005 - 2021 Alfresco Software, Ltd. All rights reserved.
 *
 * License rights for this program may be obtained from Alfresco Software, Ltd.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
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
