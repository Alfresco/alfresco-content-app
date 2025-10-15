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

import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Pagination, SiteEntry, SitePaging } from '@alfresco/js-api';
import {
  AppHookService,
  ContextActionsDirective,
  InfoDrawerComponent,
  PageComponent,
  PageLayoutComponent,
  ToolbarComponent
} from '@alfresco/aca-shared';
import { NavigateLibraryAction } from '@alfresco/aca-shared/store';
import {
  CustomEmptyContentTemplateDirective,
  DataColumnComponent,
  DataColumnListComponent,
  EmptyContentComponent,
  PaginationComponent,
  UserPreferencesService
} from '@alfresco/adf-core';
import { DocumentListPresetRef, DynamicColumnComponent } from '@alfresco/adf-extensions';
import { CommonModule } from '@angular/common';
import { DocumentListDirective } from '../../directives/document-list.directive';
import { TranslatePipe } from '@ngx-translate/core';
import { DocumentListComponent, SitesService } from '@alfresco/adf-content-services';
import { merge } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  imports: [
    CommonModule,
    DocumentListDirective,
    ContextActionsDirective,
    PaginationComponent,
    InfoDrawerComponent,
    PageLayoutComponent,
    TranslatePipe,
    ToolbarComponent,
    EmptyContentComponent,
    DynamicColumnComponent,
    DataColumnListComponent,
    DataColumnComponent,
    DocumentListComponent,
    CustomEmptyContentTemplateDirective
  ],
  templateUrl: './library-list.component.html',
  encapsulation: ViewEncapsulation.None
})
export class LibraryListComponent extends PageComponent implements OnInit {
  pagination = new Pagination({
    skipCount: 0,
    maxItems: 25,
    totalItems: 0
  });
  isLoading = false;
  list: SitePaging;
  columns: DocumentListPresetRef[] = [];

  constructor(
    private readonly appHookService: AppHookService,
    private readonly preferences: UserPreferencesService,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly sitesService: SitesService
  ) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();

    this.getList({ maxItems: this.preferences.paginationSize });

    merge(this.appHookService.libraryDeleted, this.appHookService.libraryUpdated, this.appHookService.libraryJoined, this.appHookService.libraryLeft)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.reloadList());
    this.columns = this.extensions.documentListPresets.libraries || [];
  }

  navigateTo(node: SiteEntry) {
    if (node?.entry?.guid) {
      this.store.dispatch(new NavigateLibraryAction(node.entry));
    }
  }

  handleNodeClick(event: Event) {
    this.navigateTo((event as CustomEvent).detail?.node);
  }

  onChangePageSize(pagination: Pagination) {
    this.preferences.paginationSize = pagination.maxItems;
    this.getList(pagination);
  }

  getList(pagination: Pagination) {
    this.isLoading = true;
    this.sitesService.getSites(pagination).subscribe({
      next: (libraryList: SitePaging) => {
        this.list = libraryList;
        this.pagination = libraryList.list.pagination;
        this.isLoading = false;
        this.changeDetectorRef.detectChanges();
      },
      error: () => {
        this.list = null;
        this.pagination = null;
        this.isLoading = false;
      }
    });
  }

  private reloadList() {
    this.reload();
    this.getList(this.pagination);
  }
}
