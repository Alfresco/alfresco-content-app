/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2020 Alfresco Software Limited
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

import { Directive, OnInit, OnDestroy } from '@angular/core';
import { PaginationComponent, UserPreferencesService, PaginationModel, AppConfigService } from '@alfresco/adf-core';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[acaPagination]'
})
export class PaginationDirective implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];

  constructor(private pagination: PaginationComponent, private preferences: UserPreferencesService, private config: AppConfigService) {}

  ngOnInit() {
    this.pagination.supportedPageSizes = this.config.get('pagination.supportedPageSizes');

    this.subscriptions.push(
      this.pagination.changePageSize.subscribe((event: PaginationModel) => {
        this.preferences.paginationSize = event.maxItems;
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
    this.subscriptions = [];
  }
}
