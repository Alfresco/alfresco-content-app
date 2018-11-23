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

import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { SiteEntry, FavoritePaging } from 'alfresco-js-api';
import { AppExtensionService } from '../../extensions/extension.service';
import { ContentManagementService } from '../../services/content-management.service';
import { ContentApiService } from '../../services/content-api.service';
import { NavigateLibraryAction } from '../../store/actions';
import { AppStore } from '../../store/states/app.state';
import { PageComponent } from '../page.component';

@Component({
  templateUrl: './favorite-libraries.component.html'
})
export class FavoriteLibrariesComponent extends PageComponent
  implements OnInit {
  list: FavoritePaging;
  dataIsLoading = true;
  isSmallScreen = false;
  columns: any[] = [];

  constructor(
    content: ContentManagementService,
    store: Store<AppStore>,
    extensions: AppExtensionService,
    private contentApiService: ContentApiService,
    private breakpointObserver: BreakpointObserver
  ) {
    super(store, extensions, content);
  }

  ngOnInit() {
    super.ngOnInit();

    this.getList();

    this.subscriptions = this.subscriptions.concat([
      this.content.libraryDeleted.subscribe(() => this.reloadList()),
      this.content.libraryUpdated.subscribe(() => this.reloadList()),
      this.content.libraryJoined.subscribe(() => this.reloadList()),
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

  private getList() {
    this.contentApiService.getFavoriteLibraries().subscribe(
      (favoriteLibraries: FavoritePaging) => {
        this.list = favoriteLibraries;
        this.dataIsLoading = false;
      },
      () => {
        this.list = null;
        this.dataIsLoading = false;
      }
    );
  }

  private reloadList() {
    this.reload();
    this.getList();
  }
}
