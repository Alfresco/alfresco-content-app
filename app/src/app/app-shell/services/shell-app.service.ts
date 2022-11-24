/*
 * Copyright © 2005 - 2021 Alfresco Software, Ltd. All rights reserved.
 *
 * License rights for this program may be obtained from Alfresco Software, Ltd.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
 */

import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

export interface ShellPreferencesService {
  set(preferenceKey: string, value: any): void;
  get(preferenceKey: string, defaultValue: string): string;
}

export interface ShellAppService {
  pageHeading$: Observable<string>;
  hideSidenavConditions: string[];
  minimizeSidenavConditions: string[];
  preferencesService: ShellPreferencesService;
}

export const SHELL_APP_SERVICE = new InjectionToken<ShellAppService>('SHELL_APP_SERVICE');
