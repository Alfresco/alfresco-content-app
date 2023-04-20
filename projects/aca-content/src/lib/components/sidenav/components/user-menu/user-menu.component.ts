/*
 * Copyright © 2005 - 2021 Alfresco Software, Ltd. All rights reserved.
 *
 * License rights for this program may be obtained from Alfresco Software, Ltd.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
 */

import { PeopleContentService } from '@alfresco/adf-content-services';
import { AuthenticationService, IdentityUserService } from '@alfresco/adf-core';
import { Component, OnInit } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { AppExtensionService } from '@alfresco/aca-shared'

@Component({
  selector: 'aca-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss'],
})

export class UserMenuComponent implements OnInit {
  moreActionItems: any[];
  displayName$: Observable<{ firstName: string, initials: string, email: string }>;
  private onDestroy$ = new Subject<boolean>();

  constructor(
    private peopleContentService: PeopleContentService,
    private identityUserService: IdentityUserService,
    private authService: AuthenticationService,
    private appExtensions: AppExtensionService
  ) { }

  ngOnInit() {
    this.getUserInfo();
    this.appExtensions.getHeaderActions()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((actions) => {
        const moreAction = actions.find((element) => element.id === "app.header.more");
        if (moreAction) {
          this.moreActionItems = moreAction.children;
        }
      });
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

  private parseDisplayName(model: { firstName?: string; lastName?: string; email?: string }): { firstName: string, initials: string, email: string } {
    let result = { firstName: '', initials: '', email: '' };
    if (model.firstName) {
      result.firstName = model.firstName;
      result.initials += model.firstName.charAt(0).toUpperCase();
    }
    if (model.lastName) {
      result.firstName += ' ' + model.lastName;
      result.initials += model.lastName.charAt(0).toUpperCase();
    }
    if (model.email) {
      result.email += `${model.email}`;
     
    }
    return result;
  }

  private isEcmLoggedIn() {
    return this.authService.isEcmLoggedIn() || (this.authService.isECMProvider() && this.authService.isKerberosEnabled());
  }
}
