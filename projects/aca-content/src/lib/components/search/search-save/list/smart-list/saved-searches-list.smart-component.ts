/*!
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { Component, inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { EmptyContentComponent, MaterialModule, PaginationComponent } from '@alfresco/adf-core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { SavedSearchesListUiComponent } from '../ui-list/saved-searches-list.ui-component';
import { AppService, GenericErrorComponent, InfoDrawerComponent, PageComponent, PageLayoutComponent, ToolbarComponent } from '@alfresco/aca-shared';
import { BreadcrumbComponent, SavedSearchesService } from '@alfresco/adf-content-services';
import { SearchAiInputContainerComponent } from '../../../../knowledge-retrieval/search-ai/search-ai-input-container/search-ai-input-container.component';

@Component({
  selector: 'aca-saved-searches-smart-list',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    MatButtonModule,
    SavedSearchesListUiComponent,
    ToolbarComponent,
    PaginationComponent,
    PageLayoutComponent,
    BreadcrumbComponent,
    SearchAiInputContainerComponent,
    ToolbarComponent,
    GenericErrorComponent,
    MaterialModule,
    InfoDrawerComponent,
    EmptyContentComponent
  ],
  templateUrl: './saved-searches-list.smart-component.html',
  styleUrls: ['./saved-searches-list.smart-component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SavedSearchesListSmartComponent extends PageComponent implements OnInit, OnDestroy {
  savedSearchesService = inject(SavedSearchesService);

  savedSearches$ = this.savedSearchesService.savedSearches$;

  constructor(private readonly appService: AppService) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
    this.appService.toggleAppNavBar$.next();
  }

  onOrderChanged(event: { previousIndex: number; currentIndex: number }): void {
    this.savedSearchesService.changeOrder(event.previousIndex, event.currentIndex);
  }
}
