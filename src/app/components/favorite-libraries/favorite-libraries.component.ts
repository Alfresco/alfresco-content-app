/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2019 Alfresco Software Limited
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
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { SiteEntry, FavoritePaging, Pagination } from '@alfresco/js-api';
import { AppExtensionService } from '../../extensions/extension.service';
import { ContentManagementService } from '../../services/content-management.service';
import { ContentApiService } from '@alfresco/aca-shared';
import { NavigateLibraryAction } from '@alfresco/aca-shared/store';
import { PageComponent } from '../page.component';
import { UserPreferencesService } from '@alfresco/adf-core';
@Component({
  templateUrl: './favorite-libraries.component.html'
})
export class FavoriteLibrariesComponent extends PageComponent
  implements OnInit {
  pagination: Pagination;
  isLoading = false;
  list: FavoritePaging;
  isSmallScreen = false;
  columns: any[] = [];

  constructor(
    content: ContentManagementService,
    store: Store<any>,
    extensions: AppExtensionService,
    private contentApiService: ContentApiService,
    private breakpointObserver: BreakpointObserver,
    private preferences: UserPreferencesService
  ) {
    super(store, extensions, content);
  }

  ngOnInit() {
    super.ngOnInit();

    this.getList({ maxItems: this.preferences.paginationSize });

    this.subscriptions = this.subscriptions.concat([
      this.content.libraryDeleted.subscribe(() => this.reloadList()),
      this.content.libraryUpdated.subscribe(() => this.reloadList()),
      this.content.libraryJoined.subscribe(() => this.reloadList()),
      this.content.libraryLeft.subscribe(() => this.reloadList()),
      this.content.favoriteLibraryToggle.subscribe(() => this.reloadList()),

      this.breakpointObserver
        .observe([Breakpoints.HandsetPortrait, Breakpoints.HandsetLandscape])
        .subscribe(result => {
          this.isSmallScreen = result.matches;
        })
    ]);
    this.columns = this.extensions.documentListPresets.favoriteLibraries || [];
  }

  navigateTo(node: SiteEntry) {
    if (node && node.entry && node.entry.guid) {
      this.store.dispatch(new NavigateLibraryAction(node.entry.guid));
    }
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
