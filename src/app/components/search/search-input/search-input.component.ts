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

import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {
  NavigationEnd,
  PRIMARY_OUTLET,
  Router,
  RouterEvent,
  UrlSegment,
  UrlSegmentGroup,
  UrlTree
} from '@angular/router';
import { SearchInputControlComponent } from '../search-input-control/search-input-control.component';
import { Store } from '@ngrx/store';
import { AppStore } from '../../../store/states/app.state';
import { SearchByTermAction } from '../../../store/actions';
import { filter, takeUntil } from 'rxjs/operators';
import { SearchQueryBuilderService } from '@alfresco/adf-content-services';
import { ContentManagementService } from '../../../services/content-management.service';
import { Subject } from 'rxjs';
import { SearchLibrariesQueryBuilderService } from '../search-libraries-results/search-libraries-query-builder.service';

export enum SearchOptionIds {
  Files = 'content',
  Folders = 'folder',
  Libraries = 'libraries'
}

@Component({
  selector: 'aca-search-input',
  templateUrl: 'search-input.component.html',
  encapsulation: ViewEncapsulation.None,
  host: { class: 'aca-search-input' }
})
export class SearchInputComponent implements OnInit, OnDestroy {
  onDestroy$: Subject<boolean> = new Subject<boolean>();
  hasOneChange = false;
  hasNewChange = false;
  navigationTimer: any;
  has400LibraryError = false;

  searchedWord = null;
  searchOptions: Array<any> = [
    {
      id: SearchOptionIds.Files,
      key: 'SEARCH.INPUT.FILES',
      value: false,
      shouldDisable: this.isLibrariesChecked.bind(this)
    },
    {
      id: SearchOptionIds.Folders,
      key: 'SEARCH.INPUT.FOLDERS',
      value: false,
      shouldDisable: this.isLibrariesChecked.bind(this)
    },
    {
      id: SearchOptionIds.Libraries,
      key: 'SEARCH.INPUT.LIBRARIES',
      value: false,
      shouldDisable: this.isContentChecked.bind(this)
    }
  ];

  @ViewChild('searchInputControl')
  searchInputControl: SearchInputControlComponent;

  constructor(
    private queryBuilder: SearchQueryBuilderService,
    private queryLibrariesBuilder: SearchLibrariesQueryBuilderService,
    private content: ContentManagementService,
    private router: Router,
    private store: Store<AppStore>
  ) {}

  ngOnInit() {
    this.showInputValue();

    this.router.events
      .pipe(takeUntil(this.onDestroy$))
      .pipe(filter(e => e instanceof RouterEvent))
      .subscribe(event => {
        if (event instanceof NavigationEnd) {
          this.showInputValue();
        }
      });

    this.content.library400Error
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(() => {
        this.has400LibraryError = true;
      });
  }

  showInputValue() {
    this.has400LibraryError = false;
    this.searchedWord = '';

    if (this.onSearchResults || this.onLibrariesSearchResults) {
      const urlTree: UrlTree = this.router.parseUrl(this.router.url);
      const urlSegmentGroup: UrlSegmentGroup =
        urlTree.root.children[PRIMARY_OUTLET];

      if (urlSegmentGroup) {
        const urlSegments: UrlSegment[] = urlSegmentGroup.segments;
        this.searchedWord = urlSegments[0].parameters['q'] || '';
      }
    }

    if (this.searchInputControl) {
      this.searchInputControl.searchTerm = this.searchedWord;
    }
  }

  ngOnDestroy(): void {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }

  onMenuOpened() {
    this.searchInputControl.searchInput.nativeElement.focus();
  }

  /**
   * Called when the user submits the search, e.g. hits enter or clicks submit
   *
   * @param event Parameters relating to the search
   */
  onSearchSubmit(event: KeyboardEvent) {
    this.has400LibraryError = false;
    const searchTerm = (event.target as HTMLInputElement).value;
    if (searchTerm) {
      this.searchedWord = searchTerm;

      this.searchByOption();
    }
  }

  onSearchChange(searchTerm: string) {
    this.has400LibraryError = false;
    this.searchedWord = searchTerm;

    if (this.hasOneChange) {
      this.hasNewChange = true;
    } else {
      this.hasOneChange = true;
    }

    if (this.hasNewChange) {
      clearTimeout(this.navigationTimer);
      this.hasNewChange = false;
    }

    this.navigationTimer = setTimeout(() => {
      if (searchTerm) {
        this.store.dispatch(
          new SearchByTermAction(searchTerm, this.searchOptions)
        );
      }
      this.hasOneChange = false;
    }, 1000);
  }

  searchByOption() {
    this.has400LibraryError = false;
    if (this.isLibrariesChecked()) {
      if (this.searchedWord && !this.onLibrariesSearchResults) {
        this.store.dispatch(
          new SearchByTermAction(this.searchedWord, this.searchOptions)
        );
      } else {
        this.queryLibrariesBuilder.update();
      }
    } else {
      if (this.isFoldersChecked() && !this.isFilesChecked()) {
        this.filterContent(SearchOptionIds.Folders);
      } else if (this.isFilesChecked() && !this.isFoldersChecked()) {
        this.filterContent(SearchOptionIds.Files);
      } else {
        this.removeContentFilters();
      }

      if (this.onSearchResults) {
        this.queryBuilder.update();
      } else if (this.searchedWord) {
        this.store.dispatch(
          new SearchByTermAction(this.searchedWord, this.searchOptions)
        );
      }
    }
  }

  get onLibrariesSearchResults() {
    return this.router.url.indexOf('/search-libraries') === 0;
  }

  get onSearchResults() {
    return (
      !this.onLibrariesSearchResults && this.router.url.indexOf('/search') === 0
    );
  }

  isFilesChecked(): boolean {
    return this.isOptionChecked(SearchOptionIds.Files);
  }

  isFoldersChecked(): boolean {
    return this.isOptionChecked(SearchOptionIds.Folders);
  }

  isLibrariesChecked(): boolean {
    return this.isOptionChecked(SearchOptionIds.Libraries);
  }

  isOptionChecked(optionId: string): boolean {
    const libItem = this.searchOptions.find(item => item.id === optionId);
    return !!libItem && libItem.value;
  }

  isContentChecked(): boolean {
    return this.isFilesChecked() || this.isFoldersChecked();
  }

  hasLibraryConstraint(): boolean {
    if (this.isLibrariesChecked()) {
      return (
        this.has400LibraryError || this.searchInputControl.isTermTooShort()
      );
    }
    return false;
  }

  filterContent(option: SearchOptionIds.Folders | SearchOptionIds.Files) {
    const oppositeOption =
      option === SearchOptionIds.Folders
        ? SearchOptionIds.Files
        : SearchOptionIds.Folders;

    this.queryBuilder.addFilterQuery(`+TYPE:'cm:${option}'`);
    this.queryBuilder.removeFilterQuery(`+TYPE:'cm:${oppositeOption}'`);
  }

  removeContentFilters() {
    this.queryBuilder.removeFilterQuery(`+TYPE:'cm:${SearchOptionIds.Files}'`);
    this.queryBuilder.removeFilterQuery(
      `+TYPE:'cm:${SearchOptionIds.Folders}'`
    );
  }
}
