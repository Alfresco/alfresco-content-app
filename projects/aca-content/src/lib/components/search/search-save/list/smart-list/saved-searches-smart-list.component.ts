/*!
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { Component, inject, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { SavedSearchesListUiComponent } from '../ui-list/saved-searches-list.ui-component';
import { PageComponent, PageLayoutComponent } from '@alfresco/aca-shared';
import { EmptyContentComponent } from '@alfresco/adf-core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SavedSearchesContextService } from '../../../../../services/saved-searches-context.service';

@Component({
  selector: 'aca-saved-searches-smart-list',
  imports: [CommonModule, TranslatePipe, SavedSearchesListUiComponent, PageLayoutComponent, EmptyContentComponent, MatProgressSpinnerModule],
  templateUrl: './saved-searches-smart-list.component.html',
  styleUrls: ['./saved-searches-smart-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SavedSearchesSmartListComponent extends PageComponent {
  savedSearchesService = inject(SavedSearchesContextService);

  savedSearches$ = this.savedSearchesService.savedSearches$;

  onOrderChanged(event: { previousIndex: number; currentIndex: number }): void {
    this.savedSearchesService.changeOrder(event.previousIndex, event.currentIndex);
  }
}
