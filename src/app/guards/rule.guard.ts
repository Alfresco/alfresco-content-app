/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2018 Alfresco Software Limited
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

import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { ActivatedRouteSnapshot } from '@angular/router';
import { AppExtensionService as RuleContext } from '../extensions/extension.service';
import { ExtensionService } from '@alfresco/adf-extensions';
import { LogService } from '@alfresco/adf-core';

@Injectable()
export class AppRuleGuard implements CanActivate {
  constructor(
    private extensionService: ExtensionService,
    private ruleContext: RuleContext,
    private logService: LogService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (!route.data.guardRule) {
      this.logService.warn(
        'AppRuleGuard must have defined a guardRule on route data property'
      );
      return false;
    }

    return this.extensionService.evaluateRule(
      route.data.guardRule,
      this.ruleContext
    );
  }

  canActivateChild(
    route: ActivatedRouteSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.canActivate(route);
  }
}
