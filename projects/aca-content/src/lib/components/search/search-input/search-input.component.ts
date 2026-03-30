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

import { AppHookService } from '@alfresco/aca-shared';
import { AppConfigService } from '@alfresco/adf-core';
import { AfterViewInit, Component, DestroyRef, ElementRef, inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, NavigationSkipped, NavigationStart, Params, Router } from '@angular/router';
import { SearchNavigationService } from '../search-navigation.service';
import { SearchFilterService } from '../search-filter.service';
import { SearchExecutionService } from '../search-execution.service';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { SearchInMenuComponent } from '../search-in-menu/search-in-menu.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { merge } from 'rxjs/internal/observable/merge';
import { filter, map, startWith, withLatestFrom } from 'rxjs';
import { SearchQueryBuilderService } from '@alfresco/adf-content-services';
import { extractSearchedWordFromEncodedQuery } from '../../../utils/aca-search-utils';

@Component({
  imports: [CommonModule, TranslatePipe, MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, FormsModule, SearchInMenuComponent],
  selector: 'aca-search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: { class: 'aca-search-input' }
})
export class SearchInputComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly queryBuilder = inject(SearchQueryBuilderService);
  private readonly config = inject(AppConfigService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly appHookService = inject(AppHookService);
  private readonly filterService = inject(SearchFilterService);
  private readonly searchExecutionService = inject(SearchExecutionService);
  readonly searchNavigationService = inject(SearchNavigationService);

  has400LibraryError = false;
  searchOnChange: boolean;
  searchedWord: string = null;
  error = '';

  @ViewChild('searchInputField')
  searchInputField: ElementRef<HTMLInputElement>;

  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    this.searchOnChange = this.config.get<boolean>('search.aca:triggeredOnChange', true);
  }

  ngOnInit(): void {
    this.initSearchState();
    this.subscribeToRouteParams();

    this.appHookService.library400Error.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.has400LibraryError = true;
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.searchInputField.nativeElement.focus();
    });
  }

  ngOnDestroy(): void {
    this.filterService.removeContentFilters();
  }

  exitSearch() {
    this.searchNavigationService.navigateBack();
  }

  onSearchSubmit(searchTerm: string) {
    const trimmedTerm = searchTerm?.trim();
    const validationError = this.filterService.validateSearchTerm(trimmedTerm);

    if (validationError) {
      this.error = validationError;
      return;
    }

    this.searchedWord = trimmedTerm;
    this.error = '';
    this.executeSearch();
  }

  onFiltersApplied() {
    if (!this.searchedWord?.trim()) {
      return;
    }

    const validationError = this.filterService.validateSearchTerm(this.searchedWord.trim());
    if (!validationError) {
      this.executeSearch();
    } else {
      this.error = validationError;
    }
  }

  executeSearch() {
    this.has400LibraryError = false;
    this.searchExecutionService.execute(this.searchedWord);
  }

  private subscribeToRouteParams() {
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
        if (encodedQuery) {
          this.searchedWord = extractSearchedWordFromEncodedQuery(encodedQuery);
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
          this.searchExecutionService.execute(this.searchedWord);
        }
      });
  }

  private initSearchState() {
    this.has400LibraryError = false;
    this.searchedWord = this.searchNavigationService.getUrlSearchTerm();

    if (this.searchNavigationService.onLibrariesSearchResults) {
      this.filterService.initForLibrariesRoute();
    }
  }
}
