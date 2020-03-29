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
import { NavigateLibraryAction } from '@alfresco/aca-shared/store';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppExtensionService } from '../../../extensions/extension.service';
import { ContentManagementService } from '../../../services/content-management.service';
import { PageComponent } from '../../page.component';
import { SearchLibrariesQueryBuilderService } from './search-libraries-query-builder.service';
var SearchLibrariesResultsComponent = /** @class */ (function(_super) {
  tslib_1.__extends(SearchLibrariesResultsComponent, _super);
  function SearchLibrariesResultsComponent(
    breakpointObserver,
    librariesQueryBuilder,
    route,
    store,
    extensions,
    content
  ) {
    var _this = _super.call(this, store, extensions, content) || this;
    _this.breakpointObserver = breakpointObserver;
    _this.librariesQueryBuilder = librariesQueryBuilder;
    _this.route = route;
    _this.isSmallScreen = false;
    _this.queryParamName = 'q';
    _this.totalResults = 0;
    _this.isLoading = false;
    _this.columns = [];
    librariesQueryBuilder.paging = {
      skipCount: 0,
      maxItems: 25
    };
    return _this;
  }
  SearchLibrariesResultsComponent.prototype.ngOnInit = function() {
    var _this = this;
    _super.prototype.ngOnInit.call(this);
    this.columns = this.extensions.documentListPresets.searchLibraries || [];
    this.subscriptions.push(
      this.content.libraryJoined.subscribe(function() {
        return _this.librariesQueryBuilder.update();
      }),
      this.content.libraryDeleted.subscribe(function() {
        return _this.librariesQueryBuilder.update();
      }),
      this.content.libraryLeft.subscribe(function() {
        return _this.librariesQueryBuilder.update();
      }),
      this.librariesQueryBuilder.updated.subscribe(function() {
        _this.isLoading = true;
        _this.librariesQueryBuilder.execute();
      }),
      this.librariesQueryBuilder.executed.subscribe(function(data) {
        _this.onSearchResultLoaded(data);
        _this.isLoading = false;
      }),
      this.librariesQueryBuilder.hadError.subscribe(function(err) {
        try {
          var statusCode = JSON.parse(err.message).error.statusCode;
          if (statusCode === 400) {
            _this.content.library400Error.next();
          }
        } catch (e) {}
      }),
      this.breakpointObserver
        .observe([Breakpoints.HandsetPortrait, Breakpoints.HandsetLandscape])
        .subscribe(function(result) {
          _this.isSmallScreen = result.matches;
        })
    );
    if (this.route) {
      this.route.params.forEach(function(params) {
        _this.searchedWord = params.hasOwnProperty(_this.queryParamName)
          ? params[_this.queryParamName]
          : null;
        var query = _this.formatSearchQuery(_this.searchedWord);
        if (query && query.length > 1) {
          _this.librariesQueryBuilder.paging.skipCount = 0;
          _this.librariesQueryBuilder.userQuery = query;
          _this.librariesQueryBuilder.update();
        } else {
          _this.librariesQueryBuilder.userQuery = null;
          _this.librariesQueryBuilder.executed.next({
            list: { pagination: { totalItems: 0 }, entries: [] }
          });
        }
      });
    }
  };
  SearchLibrariesResultsComponent.prototype.formatSearchQuery = function(
    userInput
  ) {
    if (!userInput) {
      return null;
    }
    return userInput.trim();
  };
  SearchLibrariesResultsComponent.prototype.onSearchResultLoaded = function(
    nodePaging
  ) {
    this.data = nodePaging;
    this.totalResults = this.getNumberOfResults();
  };
  SearchLibrariesResultsComponent.prototype.getNumberOfResults = function() {
    if (this.data && this.data.list && this.data.list.pagination) {
      return this.data.list.pagination.totalItems;
    }
    return 0;
  };
  SearchLibrariesResultsComponent.prototype.onPaginationChanged = function(
    pagination
  ) {
    this.librariesQueryBuilder.paging = {
      maxItems: pagination.maxItems,
      skipCount: pagination.skipCount
    };
    this.librariesQueryBuilder.update();
  };
  SearchLibrariesResultsComponent.prototype.navigateTo = function(node) {
    if (node && node.entry && node.entry.guid) {
      this.store.dispatch(new NavigateLibraryAction(node.entry.guid));
    }
  };
  SearchLibrariesResultsComponent = tslib_1.__decorate(
    [
      Component({
        selector: 'aca-search-results',
        templateUrl: './search-libraries-results.component.html',
        styleUrls: ['./search-libraries-results.component.scss']
      }),
      tslib_1.__metadata('design:paramtypes', [
        BreakpointObserver,
        SearchLibrariesQueryBuilderService,
        ActivatedRoute,
        Store,
        AppExtensionService,
        ContentManagementService
      ])
    ],
    SearchLibrariesResultsComponent
  );
  return SearchLibrariesResultsComponent;
})(PageComponent);
export { SearchLibrariesResultsComponent };
//# sourceMappingURL=search-libraries-results.component.js.map
