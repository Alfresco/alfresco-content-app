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
import * as tslib_1 from 'tslib';
import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  SearchQueryBuilderService,
  SearchFilterComponent
} from '@alfresco/adf-content-services';
import { PageComponent } from '../../page.component';
import { Store } from '@ngrx/store';
import {
  NavigateToFolder,
  SnackbarErrorAction,
  showFacetFilter
} from '@alfresco/aca-shared/store';
import { AppExtensionService } from '../../../extensions/extension.service';
import { ContentManagementService } from '../../../services/content-management.service';
import { AppConfigService, TranslationService } from '@alfresco/adf-core';
var SearchResultsComponent = /** @class */ (function(_super) {
  tslib_1.__extends(SearchResultsComponent, _super);
  function SearchResultsComponent(
    queryBuilder,
    route,
    config,
    store,
    extensions,
    content,
    translationService,
    router
  ) {
    var _this = _super.call(this, store, extensions, content) || this;
    _this.queryBuilder = queryBuilder;
    _this.route = route;
    _this.config = config;
    _this.translationService = translationService;
    _this.router = router;
    _this.queryParamName = 'q';
    _this.totalResults = 0;
    _this.hasSelectedFilters = false;
    _this.sorting = ['name', 'asc'];
    _this.isLoading = false;
    queryBuilder.paging = {
      skipCount: 0,
      maxItems: 25
    };
    _this.showFacetFilter$ = store.select(showFacetFilter);
    return _this;
  }
  SearchResultsComponent.prototype.ngOnInit = function() {
    var _this = this;
    _super.prototype.ngOnInit.call(this);
    this.sorting = this.getSorting();
    this.subscriptions.push(
      this.queryBuilder.updated.subscribe(function(query) {
        if (query) {
          _this.sorting = _this.getSorting();
          _this.isLoading = true;
        }
      }),
      this.queryBuilder.executed.subscribe(function(data) {
        _this.queryBuilder.paging.skipCount = 0;
        _this.onSearchResultLoaded(data);
        _this.isLoading = false;
      }),
      this.queryBuilder.error.subscribe(function(err) {
        _this.onSearchError(err);
      })
    );
    if (this.route) {
      this.route.params.forEach(function(params) {
        _this.searchedWord = params.hasOwnProperty(_this.queryParamName)
          ? params[_this.queryParamName]
          : null;
        var query = _this.formatSearchQuery(_this.searchedWord);
        if (query) {
          _this.queryBuilder.userQuery = decodeURIComponent(query);
          _this.queryBuilder.update();
        } else {
          _this.queryBuilder.userQuery = null;
          _this.queryBuilder.executed.next({
            list: { pagination: { totalItems: 0 }, entries: [] }
          });
        }
      });
    }
  };
  SearchResultsComponent.prototype.onSearchError = function(error) {
    var statusCode = JSON.parse(error.message).error.statusCode;
    var messageKey = 'APP.BROWSE.SEARCH.ERRORS.' + statusCode;
    var translated = this.translationService.instant(messageKey);
    if (translated === messageKey) {
      translated = this.translationService.instant(
        'APP.BROWSE.SEARCH.ERRORS.GENERIC'
      );
    }
    this.store.dispatch(new SnackbarErrorAction(translated));
  };
  SearchResultsComponent.prototype.isOperator = function(input) {
    if (input) {
      input = input.trim().toUpperCase();
      var operators = ['AND', 'OR'];
      return operators.includes(input);
    }
    return false;
  };
  SearchResultsComponent.prototype.formatFields = function(fields, term) {
    var prefix = '';
    var suffix = '*';
    if (term.startsWith('=')) {
      prefix = '=';
      suffix = '';
      term = term.substring(1);
    }
    return (
      '(' +
      fields
        .map(function(field) {
          return '' + prefix + field + ':"' + term + suffix + '"';
        })
        .join(' OR ') +
      ')'
    );
  };
  SearchResultsComponent.prototype.formatSearchQuery = function(userInput) {
    var _this = this;
    if (!userInput) {
      return null;
    }
    userInput = userInput.trim();
    if (userInput.includes(':') || userInput.includes('"')) {
      return userInput;
    }
    var fields = this.config.get('search.aca:fields', ['cm:name']);
    var words = userInput.split(' ');
    if (words.length > 1) {
      var separator = words.some(this.isOperator) ? ' ' : ' AND ';
      return words
        .map(function(term) {
          if (_this.isOperator(term)) {
            return term;
          }
          return _this.formatFields(fields, term);
        })
        .join(separator);
    }
    return this.formatFields(fields, userInput);
  };
  SearchResultsComponent.prototype.onSearchResultLoaded = function(nodePaging) {
    this.data = nodePaging;
    this.totalResults = this.getNumberOfResults();
    this.hasSelectedFilters = this.isFiltered();
  };
  SearchResultsComponent.prototype.getNumberOfResults = function() {
    if (this.data && this.data.list && this.data.list.pagination) {
      return this.data.list.pagination.totalItems;
    }
    return 0;
  };
  SearchResultsComponent.prototype.isFiltered = function() {
    return (
      this.searchFilter.selectedBuckets.length > 0 ||
      this.hasCheckedCategories()
    );
  };
  SearchResultsComponent.prototype.hasCheckedCategories = function() {
    var _this = this;
    var checkedCategory = this.queryBuilder.categories.find(function(category) {
      return !!_this.queryBuilder.queryFragments[category.id];
    });
    return !!checkedCategory;
  };
  SearchResultsComponent.prototype.onPaginationChanged = function(pagination) {
    this.queryBuilder.paging = {
      maxItems: pagination.maxItems,
      skipCount: pagination.skipCount
    };
    this.queryBuilder.update();
  };
  SearchResultsComponent.prototype.getSorting = function() {
    var primary = this.queryBuilder.getPrimarySorting();
    if (primary) {
      return [primary.key, primary.ascending ? 'asc' : 'desc'];
    }
    return ['name', 'asc'];
  };
  SearchResultsComponent.prototype.onNodeDoubleClick = function(node) {
    if (node && node.entry) {
      if (node.entry.isFolder) {
        this.store.dispatch(new NavigateToFolder(node));
        return;
      }
      this.showPreview(node, { location: this.router.url });
    }
  };
  SearchResultsComponent.prototype.hideSearchFilter = function() {
    return !this.totalResults && !this.hasSelectedFilters;
  };
  tslib_1.__decorate(
    [
      ViewChild('searchFilter'),
      tslib_1.__metadata('design:type', SearchFilterComponent)
    ],
    SearchResultsComponent.prototype,
    'searchFilter',
    void 0
  );
  SearchResultsComponent = tslib_1.__decorate(
    [
      Component({
        selector: 'aca-search-results',
        templateUrl: './search-results.component.html',
        encapsulation: ViewEncapsulation.None,
        styleUrls: ['./search-results.component.scss']
      }),
      tslib_1.__metadata('design:paramtypes', [
        SearchQueryBuilderService,
        ActivatedRoute,
        AppConfigService,
        Store,
        AppExtensionService,
        ContentManagementService,
        TranslationService,
        Router
      ])
    ],
    SearchResultsComponent
  );
  return SearchResultsComponent;
})(PageComponent);
export { SearchResultsComponent };
//# sourceMappingURL=search-results.component.js.map
