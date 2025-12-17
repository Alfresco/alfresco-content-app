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

import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { NodeEntry, Pagination, ResultSetPaging } from '@alfresco/js-api';
import { ActivatedRoute, NavigationStart } from '@angular/router';
import {
  AlfrescoViewerComponent,
  DocumentListComponent,
  ResetSearchDirective,
  SavedSearch,
  SearchConfiguration,
  SearchFilterChipsComponent,
  SearchFormComponent,
  SearchQueryBuilderService,
  TagService
} from '@alfresco/adf-content-services';
import {
  infoDrawerPreview,
  NavigateToFolder,
  SetInfoDrawerPreviewStateAction,
  SetInfoDrawerStateAction,
  SetSearchItemsTotalCountAction,
  ShowInfoDrawerPreviewAction
} from '@alfresco/aca-shared/store';
import {
  CustomEmptyContentTemplateDirective,
  DataColumnComponent,
  DataColumnListComponent,
  DateColumnHeaderComponent,
  NotificationService,
  PaginationComponent,
  TranslationService,
  ViewerToolbarComponent
} from '@alfresco/adf-core';
import {
  ContextActionsDirective,
  InfoDrawerComponent,
  PageComponent,
  PageLayoutComponent,
  PaginationDirective,
  ToolbarComponent
} from '@alfresco/aca-shared';
import { SearchSortingDefinition } from '@alfresco/adf-content-services/lib/search/models/search-sorting-definition.interface';
import { filter, first, map, startWith, switchMap, take, tap, toArray } from 'rxjs/operators';
import { AsyncPipe, CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { SearchInputComponent } from '../search-input/search-input.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { DocumentListDirective } from '../../../directives/document-list.directive';
import { ThumbnailColumnComponent } from '../../dl-custom-components/thumbnail-column/thumbnail-column.component';
import { SearchActionMenuComponent } from '../search-action-menu/search-action-menu.component';
import { MatIconModule } from '@angular/material/icon';
import { DocumentListPresetRef, DynamicColumnComponent } from '@alfresco/adf-extensions';
import { BulkActionsDropdownComponent } from '../../bulk-actions-dropdown/bulk-actions-dropdown.component';
import { SearchAiInputContainerComponent } from '../../knowledge-retrieval/search-ai/search-ai-input-container/search-ai-input-container.component';
import {
  extractFiltersFromEncodedQuery,
  extractSearchedWordFromEncodedQuery,
  extractUserQueryFromEncodedQuery,
  formatSearchTerm
} from '../../../utils/aca-search-utils';
import { SaveSearchDirective } from '../search-save/directive/save-search.directive';
import { combineLatest, merge, Observable, of } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatMenuModule } from '@angular/material/menu';
import { IsFeatureSupportedInCurrentAcsPipe } from '../../../pipes/is-feature-supported.pipe';
import { SavedSearchesContextService } from '../../../services/saved-searches-context.service';

@Component({
  imports: [
    CommonModule,
    TranslatePipe,
    SearchInputComponent,
    MatProgressBarModule,
    MatDividerModule,
    MatButtonModule,
    MatMenuModule,
    DocumentListDirective,
    ContextActionsDirective,
    ThumbnailColumnComponent,
    SearchActionMenuComponent,
    PaginationComponent,
    MatIconModule,
    InfoDrawerComponent,
    PaginationDirective,
    PageLayoutComponent,
    ToolbarComponent,
    AlfrescoViewerComponent,
    DynamicColumnComponent,
    SearchFormComponent,
    ResetSearchDirective,
    SearchFilterChipsComponent,
    DocumentListComponent,
    DataColumnListComponent,
    DataColumnComponent,
    DateColumnHeaderComponent,
    CustomEmptyContentTemplateDirective,
    ViewerToolbarComponent,
    BulkActionsDropdownComponent,
    SearchAiInputContainerComponent,
    SaveSearchDirective,
    IsFeatureSupportedInCurrentAcsPipe,
    AsyncPipe
  ],
  selector: 'aca-search-results',
  templateUrl: './search-results.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./search-results.component.scss']
})
export class SearchResultsComponent extends PageComponent implements OnInit, OnDestroy {
  private notificationService = inject(NotificationService);

  infoDrawerPreview$ = this.store.select(infoDrawerPreview);

  protected readonly areFiltersActive$: Observable<boolean>;

  searchedWord: string;
  queryParamName = 'q';
  data: ResultSetPaging;
  sorting = ['name', 'asc'];
  isLoading = false;
  totalResults: number;
  isTagsEnabled = false;
  initialSavedSearch: SavedSearch = undefined;
  columns: DocumentListPresetRef[] = [];
  encodedQuery: string;
  searchConfig: SearchConfiguration;

  private previousEncodedQuery: string;

  constructor(
    tagsService: TagService,
    private readonly queryBuilder: SearchQueryBuilderService,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly route: ActivatedRoute,
    private readonly translationService: TranslationService,
    private readonly savedSearchesService: SavedSearchesContextService
  ) {
    super();

    this.isTagsEnabled = tagsService.areTagsEnabled();

    queryBuilder.paging = {
      skipCount: 0,
      maxItems: 25
    };

    this.queryBuilder.configUpdated.pipe(takeUntilDestroyed()).subscribe((searchConfig) => {
      this.searchConfig = searchConfig;
    });

    this.areFiltersActive$ = merge(this.queryBuilder.queryFragmentsUpdate, this.queryBuilder.userFacetBucketsUpdate).pipe(
      takeUntilDestroyed(),
      map((v) => {
        return Object.values(v).some((filterValue) => (Array.isArray(filterValue) ? filterValue.length > 0 : !!filterValue));
      })
    );
  }

  ngOnInit() {
    super.ngOnInit();

    this.queryBuilder.resetToDefaults();
    this.sorting = this.getSorting();

    this.subscriptions.push(
      this.queryBuilder.updated.pipe(filter(Boolean)).subscribe(() => {
        this.isLoading = true;
        this.sorting = this.getSorting();
        this.changeDetectorRef.detectChanges();
      }),

      this.queryBuilder.executed.subscribe((data) => {
        this.queryBuilder.paging.skipCount = 0;

        this.onSearchResultLoaded(data);
        this.isLoading = false;
        this.changeDetectorRef.detectChanges();
      }),

      this.queryBuilder.error.subscribe((err: any) => {
        this.onSearchError(err);
      }),

      this.queryBuilder.filterQueryUpdate.subscribe(() => {
        this.isLoading = true;
      })
    );

    this.columns = this.extensions.documentListPresets.searchResults || [];

    if (this.route) {
      this.selectInitialSavedSearch().subscribe((savedSearches) => {
        this.initialSavedSearch = savedSearches;
      });

      combineLatest([
        this.route.queryParams,
        this.router.events.pipe(
          filter((event): event is NavigationStart => event instanceof NavigationStart),
          startWith(null)
        )
      ])
        .pipe(
          takeUntilDestroyed(this.destroyRef),
          tap(([params]) => {
            this.queryBuilder.userQuery = '';
            this.encodedQuery = params[this.queryParamName];
            this.isLoading = !!this.encodedQuery;

            this.searchedWord = extractSearchedWordFromEncodedQuery(this.encodedQuery);

            const filtersFromEncodedQuery = extractFiltersFromEncodedQuery(this.encodedQuery);
            this.queryBuilder.populateFilters.next(filtersFromEncodedQuery || {});
          }),
          switchMap(([, navigationStartEvent]) => {
            const filtersToLoad = this.queryBuilder.categories.length;

            const filtersAreLoaded = filtersToLoad ? this.queryBuilder.filterLoaded.pipe(take(filtersToLoad), toArray()) : of(null);

            return filtersAreLoaded.pipe(map(() => navigationStartEvent));
          })
        )
        .subscribe((navigationStartEvent) => {
          const shouldExecuteQuery = this.shouldExecuteQuery(navigationStartEvent, this.encodedQuery);
          this.queryBuilder.userQuery = extractUserQueryFromEncodedQuery(this.encodedQuery);
          if (!this.searchedWord && !this.queryBuilder.userQuery && this.encodedQuery) {
            this.queryBuilder.userQuery = formatSearchTerm('*', this.searchConfig['app:fields']);
          }

          if (shouldExecuteQuery) {
            this.queryBuilder.execute(false);
          }
        });
    }
  }

  ngOnDestroy(): void {
    this.savedSearchesService.currentContextSavedSearch = undefined;
  }

  onSearchError(error: { message: any }) {
    let message: string;
    try {
      const { statusCode } = JSON.parse(error.message).error;

      const messageKey = `APP.BROWSE.SEARCH.ERRORS.${statusCode}`;
      message = this.translationService.instant(messageKey);

      if (message === messageKey) {
        message = this.translationService.instant(`APP.BROWSE.SEARCH.ERRORS.GENERIC`);
      }
    } catch {
      message = error.message;
    }

    this.notificationService.showError(message);
  }

  onSearchResultLoaded(nodePaging: ResultSetPaging) {
    this.data = nodePaging;
    this.totalResults = this.getNumberOfResults();
    this.store.dispatch(new SetSearchItemsTotalCountAction(this.totalResults));
  }

  getNumberOfResults() {
    if (this.data?.list?.pagination) {
      return this.data.list.pagination.totalItems;
    }
    return 0;
  }

  onPaginationChanged(pagination: Pagination) {
    this.queryBuilder.paging = {
      maxItems: pagination.maxItems,
      skipCount: pagination.skipCount
    };
    this.queryBuilder.update();
  }

  private getSorting(): string[] {
    const primary = this.queryBuilder.getPrimarySorting();

    if (primary) {
      return [primary.key, primary.ascending ? 'asc' : 'desc'];
    }

    return ['name', 'asc'];
  }

  onNodeDoubleClick(node: NodeEntry) {
    if (node?.entry) {
      if (node.entry.isFolder) {
        this.store.dispatch(new NavigateToFolder(node));
        return;
      }

      this.showPreview(node, { location: this.router.url });
    }
  }

  handleNodeClick(event: Event) {
    this.onNodeDoubleClick((event as CustomEvent).detail?.node);
  }

  onPreviewClosed() {
    this.store.dispatch(new ShowInfoDrawerPreviewAction());
  }

  onDrawerClosed() {
    this.store.dispatch(new SetInfoDrawerPreviewStateAction(false));
    this.store.dispatch(new SetInfoDrawerStateAction(false));
  }

  onSearchSortingUpdate(option: SearchSortingDefinition) {
    this.queryBuilder.sorting = [{ ...option, ascending: option.ascending }];
    this.queryBuilder.update();
  }

  editSavedSearch(searchToSave: SavedSearch) {
    searchToSave.encodedUrl = this.encodedQuery;
    this.savedSearchesService
      .editSavedSearch(searchToSave)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.notificationService.showInfo('APP.BROWSE.SEARCH.SAVE_SEARCH.EDIT_DIALOG.SUCCESS_MESSAGE');
        },
        error: () => {
          this.notificationService.showError('APP.BROWSE.SEARCH.SAVE_SEARCH.EDIT_DIALOG.ERROR_MESSAGE');
        }
      });
  }

  onSaveSearch(): void {
    this.selectInitialSavedSearch()
      .pipe(take(1))
      .subscribe((savedSearch) => {
        this.initialSavedSearch = savedSearch;
        this.savedSearchesService.currentContextSavedSearch = savedSearch;
      });
  }

  private shouldExecuteQuery(navigationStartEvent: NavigationStart | null, query: string | undefined): boolean {
    const hasQueryChanged = query !== this.previousEncodedQuery;
    this.previousEncodedQuery = query;

    if (!navigationStartEvent || navigationStartEvent.navigationTrigger === 'popstate' || navigationStartEvent.navigationTrigger === 'hashchange') {
      return true;
    } else if (navigationStartEvent.navigationTrigger === 'imperative') {
      return hasQueryChanged;
    } else {
      return !!query;
    }
  }

  private selectInitialSavedSearch(): Observable<SavedSearch> {
    return this.route.queryParams.pipe(
      takeUntilDestroyed(this.destroyRef),
      switchMap((params) =>
        this.savedSearchesService.savedSearches$.pipe(
          first(),
          map(
            (savedSearches) =>
              savedSearches.find((savedSearch) => savedSearch.encodedUrl === encodeURIComponent(params[this.queryParamName])) ||
              this.savedSearchesService.currentContextSavedSearch
          )
        )
      )
    );
  }
}
