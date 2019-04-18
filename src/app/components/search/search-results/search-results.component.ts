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

import { Component, OnInit, ViewChild } from '@angular/core';
import { NodePaging, Pagination, MinimalNodeEntity } from '@alfresco/js-api';
import { ActivatedRoute, Params } from '@angular/router';
import {
  SearchQueryBuilderService,
  SearchFilterComponent
} from '@alfresco/adf-content-services';
import { PageComponent } from '../../page.component';
import { Store } from '@ngrx/store';
import {
  AppStore,
  NavigateToFolder,
  SnackbarErrorAction,
  showFacetFilter
} from '@alfresco/aca-shared/store';
import { AppExtensionService } from '../../../extensions/extension.service';
import { ContentManagementService } from '../../../services/content-management.service';
import { AppConfigService, TranslationService } from '@alfresco/adf-core';
import { Observable } from 'rxjs';

@Component({
  selector: 'aca-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss']
})
export class SearchResultsComponent extends PageComponent implements OnInit {
  @ViewChild('searchFilter')
  searchFilter: SearchFilterComponent;

  showFacetFilter$: Observable<boolean>;

  searchedWord: string;
  queryParamName = 'q';
  data: NodePaging;
  totalResults = 0;
  hasSelectedFilters = false;
  sorting = ['name', 'asc'];
  isLoading = false;

  constructor(
    private queryBuilder: SearchQueryBuilderService,
    private route: ActivatedRoute,
    private config: AppConfigService,
    store: Store<AppStore>,
    extensions: AppExtensionService,
    content: ContentManagementService,
    private translationService: TranslationService
  ) {
    super(store, extensions, content);

    queryBuilder.paging = {
      skipCount: 0,
      maxItems: 25
    };

    this.showFacetFilter$ = store.select(showFacetFilter);
  }

  ngOnInit() {
    super.ngOnInit();

    this.sorting = this.getSorting();

    this.subscriptions.push(
      this.queryBuilder.updated.subscribe(query => {
        if (query) {
          this.sorting = this.getSorting();
          this.isLoading = true;
        }
      }),

      this.queryBuilder.executed.subscribe(data => {
        this.queryBuilder.paging.skipCount = 0;

        this.onSearchResultLoaded(data);
        this.isLoading = false;
      }),

      this.queryBuilder.error.subscribe((err: any) => {
        this.onSearchError(err);
      })
    );

    if (this.route) {
      this.route.params.forEach((params: Params) => {
        this.searchedWord = params.hasOwnProperty(this.queryParamName)
          ? params[this.queryParamName]
          : null;
        const query = this.formatSearchQuery(this.searchedWord);

        if (query) {
          this.queryBuilder.userQuery = decodeURIComponent(query);
          this.queryBuilder.update();
        } else {
          this.queryBuilder.userQuery = null;
          this.queryBuilder.executed.next({
            list: { pagination: { totalItems: 0 }, entries: [] }
          });
        }
      });
    }
  }

  onSearchError(error: { message: any }) {
    const { statusCode } = JSON.parse(error.message).error;

    const messageKey = `APP.BROWSE.SEARCH.ERRORS.${statusCode}`;
    let translated = this.translationService.instant(messageKey);

    if (translated === messageKey) {
      translated = this.translationService.instant(
        `APP.BROWSE.SEARCH.ERRORS.GENERIC`
      );
    }

    this.store.dispatch(new SnackbarErrorAction(translated));
  }

  private isOperator(input: string): boolean {
    if (input) {
      input = input.trim().toUpperCase();

      const operators = ['AND', 'OR'];
      return operators.includes(input);
    }
    return false;
  }

  private formatFields(fields: string[], term: string): string {
    let prefix = '';
    let suffix = '*';

    if (term.startsWith('=')) {
      prefix = '=';
      suffix = '';
      term = term.substring(1);
    }

    return (
      '(' +
      fields.map(field => `${prefix}${field}:"${term}${suffix}"`).join(' OR ') +
      ')'
    );
  }

  formatSearchQuery(userInput: string) {
    if (!userInput) {
      return null;
    }

    userInput = userInput.trim();

    if (userInput.includes(':') || userInput.includes('"')) {
      return userInput;
    }

    const fields = this.config.get<string[]>('search.aca:fields', ['cm:name']);
    const words = userInput.split(' ');

    if (words.length > 1) {
      const separator = words.some(this.isOperator) ? ' ' : ' AND ';

      return words
        .map(term => {
          if (this.isOperator(term)) {
            return term;
          }

          return this.formatFields(fields, term);
        })
        .join(separator);
    }

    return this.formatFields(fields, userInput);
  }

  onSearchResultLoaded(nodePaging: NodePaging) {
    this.data = nodePaging;
    this.totalResults = this.getNumberOfResults();
    this.hasSelectedFilters = this.isFiltered();
  }

  getNumberOfResults() {
    if (this.data && this.data.list && this.data.list.pagination) {
      return this.data.list.pagination.totalItems;
    }
    return 0;
  }

  isFiltered(): boolean {
    return (
      this.searchFilter.selectedBuckets.length > 0 ||
      this.hasCheckedCategories()
    );
  }

  hasCheckedCategories() {
    const checkedCategory = this.queryBuilder.categories.find(
      category => !!this.queryBuilder.queryFragments[category.id]
    );
    return !!checkedCategory;
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

  onNodeDoubleClick(node: MinimalNodeEntity) {
    if (node && node.entry) {
      if (node.entry.isFolder) {
        this.store.dispatch(new NavigateToFolder(node));
        return;
      }

      this.showPreview(node);
    }
  }

  hideSearchFilter() {
    return !this.totalResults && !this.hasSelectedFilters;
  }
}
