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

import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { SiteEntry, FavoritePaging, Pagination } from '@alfresco/js-api';
import { ContentManagementService } from '../../services/content-management.service';
import { AppExtensionService, AppHookService, ContentApiService } from '@alfresco/aca-shared';
import { NavigateLibraryAction } from '@alfresco/aca-shared/store';
import { PageComponent } from '../page.component';
import { UserPreferencesService } from '@alfresco/adf-core';
import { DocumentListPresetRef } from '@alfresco/adf-extensions';

@Component({
  templateUrl: './favorite-libraries.component.html'
})
export class FavoriteLibrariesComponent extends PageComponent implements OnInit {
  pagination: Pagination = new Pagination({
    skipCount: 0,
    maxItems: 25,
    totalItems: 0
  });
  isLoading = false;
  list: FavoritePaging;
  isSmallScreen = false;
  columns: DocumentListPresetRef[] = [];

  constructor(
    content: ContentManagementService,
    store: Store<any>,
    extensions: AppExtensionService,
    private appHookService: AppHookService,
    private contentApiService: ContentApiService,
    private breakpointObserver: BreakpointObserver,
    private preferences: UserPreferencesService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    super(store, extensions, content);
  }

  ngOnInit() {
    super.ngOnInit();

    this.getList({ maxItems: this.preferences.paginationSize });

    this.subscriptions = this.subscriptions.concat([
      this.appHookService.libraryDeleted.subscribe(() => this.reloadList()),
      this.appHookService.libraryUpdated.subscribe(() => this.reloadList()),
      this.appHookService.libraryJoined.subscribe(() => this.reloadList()),
      this.appHookService.libraryLeft.subscribe(() => this.reloadList()),
      this.appHookService.favoriteLibraryToggle.subscribe(() => this.reloadList()),

      this.breakpointObserver.observe([Breakpoints.HandsetPortrait, Breakpoints.HandsetLandscape]).subscribe((result) => {
        this.isSmallScreen = result.matches;
      })
    ]);
    this.columns = this.extensions.documentListPresets.favoriteLibraries || [];
  }

  navigateTo(node: SiteEntry) {
    if (node && node.entry && node.entry.guid) {
      this.store.dispatch(new NavigateLibraryAction(node.entry.guid, 'favorite/libraries'));
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
