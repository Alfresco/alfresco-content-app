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
import { SavedSearch, SavedSearchesService } from '@alfresco/adf-content-services';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CoreModule, TranslationService } from '@alfresco/adf-core';
import { DynamicExtensionComponent, NavBarLinkRef } from '@alfresco/adf-extensions';
import { ExpandMenuComponent } from '../../../sidenav/components/expand-menu.component';
import { SidenavHeaderComponent } from '../../../sidenav/components/sidenav-header.component';
import { AppService } from '@alfresco/aca-shared';

@Component({
  selector: 'aca-save-search-sidenav',
  standalone: true,
  imports: [CoreModule, DynamicExtensionComponent, ExpandMenuComponent, SidenavHeaderComponent],
  templateUrl: './save-search-sidenav.component.html',
  encapsulation: ViewEncapsulation.None
})
export class SaveSearchSidenavComponent implements OnInit, OnDestroy {
  savedSearchesService = inject(SavedSearchesService);
  appService = inject(AppService);
  translationService = inject(TranslationService);
  destroy$ = new Subject<void>();
  item: NavBarLinkRef;

  private readonly manageSearchesId = 'manage-saved-searches';

  ngOnInit() {
    this.savedSearchesService.innit();
    this.savedSearchesService.savedSearches$
      .asObservable()
      .pipe(takeUntil(this.destroy$))
      .subscribe((savedSearches) => {
        this.item = this.createNavBarLinkRef(savedSearches);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private createNavBarLinkRef(children: SavedSearch[]): NavBarLinkRef {
    const mappedChildren = children
      .map((child) => ({
        id: 'search' + child.name,
        icon: '',
        title: child.name,
        route: `search?q=${child.encodedUrl}`,
        url: `search?q=${child.encodedUrl}`
      }))
      .slice(0, 5);
    const title = this.translationService.instant('APP.BROWSE.SEARCH.SAVE_SEARCH.NAVBAR.TITLE', { number: children.length });
    mappedChildren.push({
      id: this.manageSearchesId,
      icon: '',
      title: 'APP.BROWSE.SEARCH.SAVE_SEARCH.NAVBAR.MANAGE_BUTTON',
      route: 'saved-searches',
      url: 'saved-searches'
    });
    return {
      icon: '',
      title,
      children: mappedChildren,
      route: '/',
      id: 'search-navbar'
    };
  }
}
