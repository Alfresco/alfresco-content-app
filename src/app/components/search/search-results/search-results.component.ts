/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2020 Alfresco Software Limited
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

import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MinimalNodeEntity, Pagination, ResultSetPaging } from '@alfresco/js-api';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { SearchQueryBuilderService } from '@alfresco/adf-content-services';
import { PageComponent } from '../../page.component';
import { Store } from '@ngrx/store';
import {
  AppStore,
  infoDrawerPreview,
  NavigateToFolder,
  SetInfoDrawerPreviewStateAction,
  SetInfoDrawerStateAction,
  showFacetFilter,
  ShowInfoDrawerPreviewAction,
  SnackbarErrorAction
} from '@alfresco/aca-shared/store';
import { ContentManagementService } from '../../../services/content-management.service';
import { TranslationService } from '@alfresco/adf-core';
import { combineLatest, Observable } from 'rxjs';
import { AppExtensionService } from '@alfresco/aca-shared';
import { SearchSortingDefinition } from '@alfresco/adf-content-services/lib/search/models/search-sorting-definition.interface';
import { takeUntil } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'aca-search-results',
  templateUrl: './search-results.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./search-results.component.scss']
})
export class SearchResultsComponent extends PageComponent implements OnInit {
  showFacetFilter$: Observable<boolean>;
  infoDrawerPreview$: Observable<boolean>;

  searchedWord: string;
  queryParamName = 'q';
  data: ResultSetPaging;
  sorting = ['name', 'asc'];
  isLoading = false;
  isSmallScreen = false;

  constructor(
    private queryBuilder: SearchQueryBuilderService,
    private route: ActivatedRoute,
    store: Store<AppStore>,
    extensions: AppExtensionService,
    content: ContentManagementService,
    private translationService: TranslationService,
    private router: Router,
    private breakpointObserver: BreakpointObserver
  ) {
    super(store, extensions, content);

    queryBuilder.paging = {
      skipCount: 0,
      maxItems: 25
    };

    this.showFacetFilter$ = store.select(showFacetFilter);
    this.infoDrawerPreview$ = store.select(infoDrawerPreview);
    combineLatest([this.route.params, this.queryBuilder.configUpdated])
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(([params, searchConfig]) => {
        this.searchedWord = params.hasOwnProperty(this.queryParamName) ? params[this.queryParamName] : null;
        const query = this.formatSearchQuery(this.searchedWord, searchConfig['aca:fields']);
        if (query) {
          this.queryBuilder.userQuery = decodeURIComponent(query);
        }
      });

    this.breakpointObserver
      .observe([Breakpoints.HandsetPortrait, Breakpoints.HandsetLandscape])
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((result) => {
        this.isSmallScreen = result.matches;
      });
  }

  ngOnInit() {
    super.ngOnInit();

    this.queryBuilder.resetToDefaults();
    this.sorting = this.getSorting();

    this.subscriptions.push(
      this.queryBuilder.updated.subscribe((query) => {
        if (query) {
          this.sorting = this.getSorting();
          this.isLoading = true;
        }
      }),

      this.queryBuilder.executed.subscribe((data) => {
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
        this.searchedWord = params.hasOwnProperty(this.queryParamName) ? params[this.queryParamName] : null;
        if (this.searchedWord) {
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
      translated = this.translationService.instant(`APP.BROWSE.SEARCH.ERRORS.GENERIC`);
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

    return '(' + fields.map((field) => `${prefix}${field}:"${term}${suffix}"`).join(' OR ') + ')';
  }

  formatSearchQuery(userInput: string, fields = ['cm:name']) {
    if (!userInput) {
      return null;
    }

    if (/^http[s]?:\/\//.test(userInput)) {
      return this.formatFields(fields, userInput);
    }

    userInput = userInput.trim();

    if (userInput.includes(':') || userInput.includes('"')) {
      return userInput;
    }

    const words = userInput.split(' ');

    if (words.length > 1) {
      const separator = words.some(this.isOperator) ? ' ' : ' AND ';

      return words
        .map((term) => {
          if (this.isOperator(term)) {
            return term;
          }

          return this.formatFields(fields, term);
        })
        .join(separator);
    }

    return this.formatFields(fields, userInput);
  }

  onSearchResultLoaded(nodePaging: ResultSetPaging) {
    this.data = nodePaging;
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
}
