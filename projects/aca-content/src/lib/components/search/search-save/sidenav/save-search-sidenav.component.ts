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

import { Component, DestroyRef, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { SavedSearch, SavedSearchesService } from '@alfresco/adf-content-services';
import { TranslationService, UserPreferencesService, UserPreferenceValues } from '@alfresco/adf-core';
import { NavBarLinkRef } from '@alfresco/adf-extensions';
import { ExpandMenuComponent } from '../../../sidenav/components/expand-menu.component';
import { AppService } from '@alfresco/aca-shared';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'aca-save-search-sidenav',
  imports: [ExpandMenuComponent],
  templateUrl: './save-search-sidenav.component.html',
  encapsulation: ViewEncapsulation.None
})
export class SaveSearchSidenavComponent implements OnInit {
  savedSearchesService = inject(SavedSearchesService);
  appService = inject(AppService);
  translationService = inject(TranslationService);
  item: NavBarLinkRef;

  private readonly manageSearchesId = 'manage-saved-searches';
  private readonly destroyRef = inject(DestroyRef);
  private readonly userPreferenceService = inject(UserPreferencesService);

  private savedSearchCount = 0;

  ngOnInit() {
    this.savedSearchesService.init();
    this.savedSearchesService.savedSearches$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((savedSearches) => {
      this.item = this.createNavBarLinkRef(savedSearches);
      this.savedSearchCount = savedSearches.length;
    });
    this.userPreferenceService
      .select(UserPreferenceValues.Locale)
      .pipe(takeUntilDestroyed(this.destroyRef), delay(10))
      .subscribe(() => {
        if (this.item) {
          this.item.title = this.translationService.instant('APP.BROWSE.SEARCH.SAVE_SEARCH.NAVBAR.TITLE', { number: this.savedSearchCount });
        }
      });
  }

  onActionClick(el: NavBarLinkRef): void {
    if (el.id !== this.manageSearchesId) {
      this.appService.appNavNarMode$.next('collapsed');
    }
  }

  private createNavBarLinkRef(children: SavedSearch[]): NavBarLinkRef {
    const mappedChildren = children
      .map((child) => ({
        id: 'search' + child.name,
        icon: '',
        title: child.name,
        description: child.name,
        route: `search?q=${child.encodedUrl}`,
        url: `search?q=${child.encodedUrl}`
      }))
      .slice(0, 5);
    const title = this.translationService.instant('APP.BROWSE.SEARCH.SAVE_SEARCH.NAVBAR.TITLE', { number: children.length });
    mappedChildren.push({
      id: this.manageSearchesId,
      icon: '',
      title: 'APP.BROWSE.SEARCH.SAVE_SEARCH.NAVBAR.MANAGE_BUTTON',
      description: 'APP.BROWSE.SEARCH.SAVE_SEARCH.NAVBAR.MANAGE_BUTTON',
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
