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
import { ActivatedRoute, Params } from '@angular/router';
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
  ShowInfoDrawerPreviewAction,
  SnackbarErrorAction,
  SnackbarInfoAction
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
import { take, takeUntil } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { SearchInputComponent } from '../search-input/search-input.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { DocumentListDirective } from '../../../directives/document-list.directive';
import { ThumbnailColumnComponent } from '../../dl-custom-components/thumbnail-column/thumbnail-column.component';
import { SearchActionMenuComponent } from '../search-action-menu/search-action-menu.component';
import { TagsColumnComponent } from '../../dl-custom-components/tags-column/tags-column.component';
import { MatIconModule } from '@angular/material/icon';
import { SearchResultsRowComponent } from '../search-results-row/search-results-row.component';
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
import { Subject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  standalone: true,
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
    TagsColumnComponent,
    PaginationComponent,
    MatIconModule,
    InfoDrawerComponent,
    SearchResultsRowComponent,
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

  private readonly loadedFilters$ = new Subject<void>();
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

    this.queryBuilder.configUpdated
      .asObservable()
      .pipe(takeUntilDestroyed())
      .subscribe((searchConfig) => {
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
      this.route.queryParams.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params: Params) => {
        this.savedSearchesService
          .getSavedSearches()
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe((savedSearches) => {
            const savedSearchFound = savedSearches.find((savedSearch) => savedSearch.encodedUrl === encodeURIComponent(params[this.queryParamName]));
            this.initialSavedSearch = savedSearchFound !== undefined ? savedSearchFound : this.initialSavedSearch;
          });
        if (params[this.queryParamName]) {
          this.isLoading = true;
        }
        this.loadedFilters$.next();
        this.encodedQuery = params[this.queryParamName] || null;
        this.searchedWord = extractSearchedWordFromEncodedQuery(this.encodedQuery);
        this.updateUserQuery();
        const filtersFromEncodedQuery = extractFiltersFromEncodedQuery(this.encodedQuery);
        if (filtersFromEncodedQuery !== null) {
          const filtersToLoad = this.queryBuilder.categories.length;
          let loadedFilters = this.searchedWord === '' ? 0 : 1;
          this.queryBuilder.filterLoaded
            .asObservable()
            .pipe(takeUntilDestroyed(this.destroyRef), takeUntil(this.loadedFilters$))
            .subscribe(() => {
              loadedFilters++;
              if (filtersToLoad === loadedFilters) {
                this.loadedFilters$.next();
                this.queryBuilder.execute(false);
              }
            });
          this.queryBuilder.populateFilters.next(filtersFromEncodedQuery);
        } else {
          this.queryBuilder.populateFilters.next({});
          this.queryBuilder.execute(false);
        }
        this.queryBuilder.userQuery = extractUserQueryFromEncodedQuery(this.encodedQuery);
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
          this.store.dispatch(new SnackbarInfoAction('APP.BROWSE.SEARCH.SAVE_SEARCH.EDIT_DIALOG.SUCCESS_MESSAGE'));
        },
        error: () => {
          this.store.dispatch(new SnackbarErrorAction('APP.BROWSE.SEARCH.SAVE_SEARCH.EDIT_DIALOG.ERROR_MESSAGE'));
        }
      });
  }

  private updateUserQuery(): void {
    const updatedUserQuery = formatSearchTerm(this.searchedWord, this.searchConfig['app:fields']);
    this.queryBuilder.userQuery = updatedUserQuery;
  }
}
