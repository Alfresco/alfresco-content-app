/*!
 * Copyright © 2005-2026 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '@alfresco/adf-core';
import { PaginationStateBaseService } from './pagination-state-base.service';

@Injectable({ providedIn: 'root' })
export class PaginationStateService extends PaginationStateBaseService {
  private readonly authenticationService = inject(AuthenticationService);
  private readonly router = inject(Router);

  protected getUsername(): string {
    return this.authenticationService.getUsername();
  }

  protected getCurrentContext(): string {
    const path = (this.router.url || '').split('?')[0].split('#')[0];
    const segments = path.split('/').filter((segment) => !!segment);

    if (segments.includes('libraries')) {
      return segments[0] === 'favorite' ? 'favorite/libraries' : 'libraries';
    }

    if (segments[0] === 'favorite') {
      return segments.slice(0, 2).join('/');
    }
    return segments[0] ?? '';
  }
}
