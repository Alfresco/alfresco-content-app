/*
 * Copyright © 2005 - 2021 Alfresco Software, Ltd. All rights reserved.
 *
 * License rights for this program may be obtained from Alfresco Software, Ltd.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
 */

import { PeopleContentService, IdentityUserService, AuthenticationService } from '@alfresco/adf-core';
import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
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
