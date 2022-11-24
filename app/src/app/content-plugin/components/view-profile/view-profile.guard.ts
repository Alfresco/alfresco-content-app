/*
 * Copyright © 2005 - 2021 Alfresco Software, Ltd. All rights reserved.
 *
 * License rights for this program may be obtained from Alfresco Software, Ltd.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
 */

import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '@alfresco/adf-core';

@Injectable({
  providedIn: 'root'
})
export class ViewProfileRuleGuard implements CanActivate {
  constructor(private authService: AuthenticationService) {}

  canActivate(_: ActivatedRouteSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.isEcmLoggedIn() || this.authService.isOauth();
  }

  private isEcmLoggedIn() {
    return this.authService.isEcmLoggedIn() || (this.authService.isECMProvider() && this.authService.isKerberosEnabled());
  }
}
