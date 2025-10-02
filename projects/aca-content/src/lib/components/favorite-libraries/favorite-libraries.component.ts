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
import { FavoritePaging, Pagination, SiteEntry } from '@alfresco/js-api';
import {
  AppHookService,
  ContentApiService,
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
import { DocumentListComponent } from '@alfresco/adf-content-services';

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
  templateUrl: './favorite-libraries.component.html',
  encapsulation: ViewEncapsulation.None
})
export class FavoriteLibrariesComponent extends PageComponent implements OnInit {
  pagination: Pagination = new Pagination({
    skipCount: 0,
    maxItems: 25,
    totalItems: 0
  });
  isLoading = false;
  list: FavoritePaging;
  columns: DocumentListPresetRef[] = [];

  constructor(
    private appHookService: AppHookService,
    private contentApiService: ContentApiService,
    private preferences: UserPreferencesService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();

    this.getList({ maxItems: this.preferences.paginationSize });

    this.subscriptions = this.subscriptions.concat([
      this.appHookService.libraryDeleted.subscribe(() => this.reloadList()),
      this.appHookService.libraryUpdated.subscribe(() => this.reloadList()),
      this.appHookService.libraryJoined.subscribe(() => this.reloadList()),
      this.appHookService.libraryLeft.subscribe(() => this.reloadList()),
      this.appHookService.favoriteLibraryToggle.subscribe(() => this.reloadList())
    ]);
    this.columns = this.extensions.documentListPresets.favoriteLibraries || [];
  }

  navigateTo(node: SiteEntry) {
    if (node?.entry?.guid) {
      this.store.dispatch(new NavigateLibraryAction(node.entry, 'favorite/libraries'));
    }
  }

  handleNodeClick(event: Event) {
    this.navigateTo((event as CustomEvent).detail?.node);
  }

  onChangePageSize(pagination: Pagination) {
    this.preferences.paginationSize = pagination.maxItems;
    this.getList(pagination);
  }

  onChange(pagination: Pagination) {
    this.getList(pagination);
  }

  private getList(pagination: Pagination) {
    this.isLoading = true;
    this.contentApiService.getFavoriteLibraries('-me-', pagination).subscribe(
      (favoriteLibraries: FavoritePaging) => {
        this.list = favoriteLibraries;
        this.pagination = favoriteLibraries.list.pagination;
        this.isLoading = false;
        this.changeDetectorRef.detectChanges();
      },
      () => {
        this.list = null;
        this.pagination = null;
        this.isLoading = false;
      }
    );
  }

  private reloadList() {
    this.reload();
    this.getList(this.pagination);
  }
}
