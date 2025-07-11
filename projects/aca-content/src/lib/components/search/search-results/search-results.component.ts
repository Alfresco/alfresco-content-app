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

import { ChangeDetectorRef, Component, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { NodeEntry, Pagination, ResultSetPaging } from '@alfresco/js-api';
import { ActivatedRoute, NavigationStart } from '@angular/router';
import {
  AlfrescoViewerComponent,
  DocumentListComponent,
  ResetSearchDirective,
  SavedSearch,
  SavedSearchesService,
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
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
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
import { combineLatest, of } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  imports: [
    CommonModule,
    TranslateModule,
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
    SaveSearchDirective
  ],
  selector: 'aca-search-results',
  templateUrl: './search-results.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./search-results.component.scss']
})
export class SearchResultsComponent extends PageComponent implements OnInit {
  private notificationService = inject(NotificationService);

  infoDrawerPreview$ = this.store.select(infoDrawerPreview);

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

  constructor(
    tagsService: TagService,
    private readonly queryBuilder: SearchQueryBuilderService,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly route: ActivatedRoute,
    private readonly translationService: TranslationService,
    private readonly savedSearchesService: SavedSearchesService
  ) {
    super();

    this.isTagsEnabled = tagsService.areTagsEnabled();

    queryBuilder.paging = {
      skipCount: 0,
      maxItems: 25
    };

    this.queryBuilder.configUpdated.pipe(takeUntilDestroyed()).subscribe((searchConfig) => {
      this.searchConfig = searchConfig;
      this.updateUserQuery();
    });
  }

  ngOnInit() {
    super.ngOnInit();

    this.queryBuilder.resetToDefaults();
    this.sorting = this.getSorting();

    this.subscriptions.push(
      this.queryBuilder.updated.subscribe((query) => {
        this.isLoading = true;
        if (query) {
          this.sorting = this.getSorting();
          this.changeDetectorRef.detectChanges();
        }
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
      this.route.queryParams
        .pipe(
          takeUntilDestroyed(this.destroyRef),
          switchMap((params) =>
            this.savedSearchesService.getSavedSearches().pipe(
              first(),
              map((savedSearches) => savedSearches.find((savedSearch) => savedSearch.encodedUrl === encodeURIComponent(params[this.queryParamName])))
            )
          )
        )
        .subscribe((savedSearches) => {
          this.initialSavedSearch = savedSearches;
        });

      combineLatest([
        this.route.queryParams,
        this.router.events.pipe(
          filter((e): e is NavigationStart => e instanceof NavigationStart),
          startWith(null)
        )
      ])
        .pipe(
          takeUntilDestroyed(this.destroyRef),
          tap(([params]) => {
            this.encodedQuery = params[this.queryParamName];
            this.isLoading = !!this.encodedQuery;

            this.searchedWord = extractSearchedWordFromEncodedQuery(this.encodedQuery);
            this.updateUserQuery();

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

          if (shouldExecuteQuery) {
            this.queryBuilder.execute(false);
          }
        });
    }
  }

  onSearchError(error: { message: any }) {
    const { statusCode } = JSON.parse(error.message).error;

    const messageKey = `APP.BROWSE.SEARCH.ERRORS.${statusCode}`;
    let message = this.translationService.instant(messageKey);

    if (message === messageKey) {
      message = this.translationService.instant(`APP.BROWSE.SEARCH.ERRORS.GENERIC`);
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

  private updateUserQuery(): void {
    const updatedUserQuery = formatSearchTerm(this.searchedWord, this.searchConfig['app:fields']);
    this.queryBuilder.userQuery = updatedUserQuery;
  }

  private shouldExecuteQuery(navigationStartEvent: NavigationStart | null, query: string | undefined): boolean {
    if (!navigationStartEvent || navigationStartEvent.navigationTrigger === 'popstate' || navigationStartEvent.navigationTrigger === 'hashchange') {
      return true;
    } else if (navigationStartEvent.navigationTrigger === 'imperative') {
      return false;
    } else {
      return !!query;
    }
  }
}
