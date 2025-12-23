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

import { AppHookService, AppService } from '@alfresco/aca-shared';
import { AppStore, SearchByTermAction, SearchOptionIds, SearchOptionModel } from '@alfresco/aca-shared/store';
import { SearchQueryBuilderService } from '@alfresco/adf-content-services';
import { AppConfigService, NotificationService } from '@alfresco/adf-core';
import { Component, DestroyRef, inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import {
  ActivatedRoute,
  NavigationSkipped,
  NavigationStart,
  Params,
  PRIMARY_OUTLET,
  Router,
  UrlSegment,
  UrlSegmentGroup,
  UrlTree
} from '@angular/router';
import { Store } from '@ngrx/store';
import { SearchInputControlComponent } from '../search-input-control/search-input-control.component';
import { SearchNavigationService } from '../search-navigation.service';
import { SearchLibrariesQueryBuilderService } from '../search-libraries-results/search-libraries-query-builder.service';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { A11yModule } from '@angular/cdk/a11y';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { extractSearchedWordFromEncodedQuery } from '../../../utils/aca-search-utils';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { merge } from 'rxjs/internal/observable/merge';
import { filter, map, startWith, withLatestFrom } from 'rxjs';

@Component({
  imports: [
    CommonModule,
    TranslatePipe,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    A11yModule,
    MatCheckboxModule,
    FormsModule,
    SearchInputControlComponent
  ],
  selector: 'aca-search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: { class: 'aca-search-input' }
})
export class SearchInputComponent implements OnInit, OnDestroy {
  private readonly notificationService = inject(NotificationService);

  has400LibraryError = false;
  hasLibrariesConstraint = false;
  searchOnChange: boolean;
  isTrimmedWordEmpty = false;
  error = '';

  searchedWord: string = null;
  searchOptions: Array<SearchOptionModel> = [
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
      value: this.onLibrariesSearchResults,
      shouldDisable: this.isContentChecked.bind(this)
    }
  ];

  @ViewChild('searchInputControl', { static: true })
  searchInputControl: SearchInputControlComponent;

  @ViewChild(MatMenuTrigger, { static: true })
  trigger: MatMenuTrigger;

  private readonly destroyRef = inject(DestroyRef);

  constructor(
    private readonly queryBuilder: SearchQueryBuilderService,
    private readonly queryLibrariesBuilder: SearchLibrariesQueryBuilderService,
    private readonly config: AppConfigService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly store: Store<AppStore>,
    private readonly appHookService: AppHookService,
    private readonly appService: AppService,
    public readonly searchInputService: SearchNavigationService
  ) {
    this.searchOnChange = this.config.get<boolean>('search.aca:triggeredOnChange', true);
  }

  ngOnInit() {
    this.showInputValue();

    merge(
      this.route.queryParams,
      this.router.events.pipe(
        filter((e) => e instanceof NavigationSkipped),
        withLatestFrom(this.route.queryParams),
        map(([, params]) => params)
      )
    )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params: Params) => {
        const encodedQuery = params['q'];
        if (encodedQuery && this.searchInputControl) {
          this.searchedWord = extractSearchedWordFromEncodedQuery(encodedQuery);
          this.searchInputControl.searchTerm = this.searchedWord;
        }
      });

    this.queryBuilder.configUpdated
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        withLatestFrom(
          this.router.events.pipe(
            filter((event): event is NavigationStart => event instanceof NavigationStart),
            startWith(null)
          )
        )
      )
      .subscribe(([, navigationStartEvent]) => {
        const hasQueryParams = navigationStartEvent?.url.includes('?');
        if (this.searchedWord && hasQueryParams) {
          this.searchByOption();
        }
      });

    this.appHookService.library400Error.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.has400LibraryError = true;
      this.hasLibrariesConstraint = this.evaluateLibrariesConstraint();
    });
  }

  exitSearch() {
    this.searchInputService.navigateBack();
  }

  showInputValue() {
    this.appService.setAppNavbarMode('collapsed');
    this.has400LibraryError = false;
    this.searchedWord = this.getUrlSearchTerm();
    this.hasLibrariesConstraint = this.evaluateLibrariesConstraint();

    if (this.searchInputControl) {
      this.searchInputControl.searchTerm = this.searchedWord;
    }
  }

  ngOnDestroy(): void {
    this.appService.setAppNavbarMode('expanded');
    this.removeContentFilters();
  }

  onMenuOpened() {
    if (this.searchInputControl) {
      this.searchInputControl.searchInput?.nativeElement?.focus();
    }
  }

  /**
   * Called when the user submits the search, e.g. hits enter or clicks submit
   *
   * @param event Parameters relating to the search
   */
  onSearchSubmit(event: any) {
    const searchTerm = event.target ? (event.target as HTMLInputElement).value : event;
    const trimmedTerm = searchTerm.trim();

    if (trimmedTerm) {
      this.searchedWord = trimmedTerm;
      if (this.isLibrariesChecked() && this.searchInputControl.isTermTooShort()) {
        return;
      } else {
        this.searchByOption();
      }
    } else {
      this.notificationService.showError('APP.BROWSE.SEARCH.EMPTY_SEARCH');
    }

    setTimeout(() => {
      this.trigger?.closeMenu();
    });
  }

  onSearchChange(searchTerm: string) {
    if (!this.searchOnChange) {
      return;
    }

    this.has400LibraryError = false;
    this.searchedWord = searchTerm;
    this.hasLibrariesConstraint = this.evaluateLibrariesConstraint();
  }

  searchByOption() {
    this.syncInputValues();
    this.has400LibraryError = false;

    this.searchInputControl.emitValidationError();

    if (!this.searchedWord.trim()) {
      return;
    }

    if (this.isLibrariesChecked()) {
      this.hasLibrariesConstraint = this.evaluateLibrariesConstraint();

      if (this.hasLibrariesConstraint) {
        return;
      }
      if (this.onLibrariesSearchResults && this.isSameSearchTerm()) {
        this.queryLibrariesBuilder.update();
      } else if (this.searchedWord) {
        this.store.dispatch(new SearchByTermAction(this.searchedWord, this.searchOptions));
      }
    } else {
      if (this.isFoldersChecked() && !this.isFilesChecked()) {
        this.filterContent(SearchOptionIds.Folders);
      } else if (this.isFilesChecked() && !this.isFoldersChecked()) {
        this.filterContent(SearchOptionIds.Files);
      } else {
        this.removeContentFilters();
      }

      if (this.onSearchResults && this.isSameSearchTerm()) {
        this.queryBuilder.update();
      } else if (this.searchedWord) {
        this.store.dispatch(new SearchByTermAction(this.searchedWord, this.searchOptions));
      }
    }
  }

  get onLibrariesSearchResults() {
    return this.router?.url.indexOf('/search-libraries') === 0;
  }

  get onSearchResults() {
    return !this.onLibrariesSearchResults && this.router?.url.indexOf('/search') === 0;
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
    const libItem = this.searchOptions.find((item) => item.id === optionId);
    return !!libItem && libItem.value;
  }

  isContentChecked(): boolean {
    return this.isFilesChecked() || this.isFoldersChecked();
  }

  evaluateLibrariesConstraint(): boolean {
    if (this.isLibrariesChecked()) {
      return this.has400LibraryError || this.searchInputControl.isTermTooShort();
    }
    return false;
  }

  filterContent(option: SearchOptionIds.Folders | SearchOptionIds.Files) {
    const oppositeOption = option === SearchOptionIds.Folders ? SearchOptionIds.Files : SearchOptionIds.Folders;

    this.queryBuilder.addFilterQuery(`+TYPE:'cm:${option}'`);
    this.queryBuilder.removeFilterQuery(`+TYPE:'cm:${oppositeOption}'`);
  }

  removeContentFilters() {
    this.queryBuilder.removeFilterQuery(`+TYPE:'cm:${SearchOptionIds.Files}'`);
    this.queryBuilder.removeFilterQuery(`+TYPE:'cm:${SearchOptionIds.Folders}'`);
  }

  syncInputValues() {
    if (this.searchInputControl.searchTerm !== this.searchedWord) {
      if (this.searchInputControl.searchTerm) {
        this.searchedWord = this.searchInputControl.searchTerm;
      } else {
        this.searchInputControl.searchTerm = this.searchedWord;
      }
    }
  }

  getUrlSearchTerm(): string {
    let searchTerm = '';
    if (this.onSearchResults || this.onLibrariesSearchResults) {
      const urlTree: UrlTree = this.router.parseUrl(this.router.url);
      const urlSegmentGroup: UrlSegmentGroup = urlTree.root.children[PRIMARY_OUTLET];

      if (urlSegmentGroup) {
        const urlSegments: UrlSegment[] = urlSegmentGroup.segments;
        searchTerm = extractSearchedWordFromEncodedQuery(urlSegments[0].parameters['q']);
      }
    }

    return searchTerm;
  }

  isSameSearchTerm(): boolean {
    const urlSearchTerm = this.getUrlSearchTerm();
    return this.searchedWord === urlSearchTerm;
  }
}
