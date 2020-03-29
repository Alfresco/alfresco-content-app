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
import {
  SearchByTermAction,
  SearchOptionIds
} from '@alfresco/aca-shared/store';
import { SearchQueryBuilderService } from '@alfresco/adf-content-services';
import { AppConfigService } from '@alfresco/adf-core';
import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import {
  NavigationEnd,
  PRIMARY_OUTLET,
  Router,
  RouterEvent
} from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { ContentManagementService } from '../../../services/content-management.service';
import { SearchInputControlComponent } from '../search-input-control/search-input-control.component';
import { SearchLibrariesQueryBuilderService } from '../search-libraries-results/search-libraries-query-builder.service';
var SearchInputComponent = /** @class */ (function() {
  function SearchInputComponent(
    queryBuilder,
    queryLibrariesBuilder,
    config,
    content,
    router,
    store
  ) {
    this.queryBuilder = queryBuilder;
    this.queryLibrariesBuilder = queryLibrariesBuilder;
    this.config = config;
    this.content = content;
    this.router = router;
    this.store = store;
    this.onDestroy$ = new Subject();
    this.hasOneChange = false;
    this.hasNewChange = false;
    this.has400LibraryError = false;
    this.searchedWord = null;
    this.searchOptions = [
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
    this.searchOnChange = this.config.get('search.aca:triggeredOnChange', true);
  }
  SearchInputComponent.prototype.ngOnInit = function() {
    var _this = this;
    this.showInputValue();
    this.router.events
      .pipe(takeUntil(this.onDestroy$))
      .pipe(
        filter(function(e) {
          return e instanceof RouterEvent;
        })
      )
      .subscribe(function(event) {
        if (event instanceof NavigationEnd) {
          _this.showInputValue();
        }
      });
    this.content.library400Error
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(function() {
        _this.has400LibraryError = true;
      });
  };
  SearchInputComponent.prototype.showInputValue = function() {
    this.has400LibraryError = false;
    this.searchedWord = this.getUrlSearchTerm();
    if (this.searchInputControl) {
      this.searchInputControl.searchTerm = this.searchedWord;
    }
  };
  SearchInputComponent.prototype.ngOnDestroy = function() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
    this.removeContentFilters();
  };
  SearchInputComponent.prototype.onMenuOpened = function() {
    this.searchInputControl.searchInput.nativeElement.focus();
  };
  /**
   * Called when the user submits the search, e.g. hits enter or clicks submit
   *
   * @param event Parameters relating to the search
   */
  SearchInputComponent.prototype.onSearchSubmit = function(event) {
    var searchTerm = event.target ? event.target.value : event;
    if (searchTerm) {
      this.searchedWord = searchTerm;
      this.searchByOption();
    }
    this.trigger.closeMenu();
  };
  SearchInputComponent.prototype.onSearchChange = function(searchTerm) {
    var _this = this;
    if (!this.searchOnChange) {
      return;
    }
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
    this.navigationTimer = setTimeout(function() {
      if (searchTerm) {
        _this.store.dispatch(
          new SearchByTermAction(searchTerm, _this.searchOptions)
        );
      }
      _this.hasOneChange = false;
    }, 1000);
  };
  SearchInputComponent.prototype.searchByOption = function() {
    this.syncInputValues();
    this.has400LibraryError = false;
    if (this.isLibrariesChecked()) {
      if (this.onLibrariesSearchResults && this.isSameSearchTerm()) {
        this.queryLibrariesBuilder.update();
      } else if (this.searchedWord) {
        this.store.dispatch(
          new SearchByTermAction(this.searchedWord, this.searchOptions)
        );
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
        this.store.dispatch(
          new SearchByTermAction(this.searchedWord, this.searchOptions)
        );
      }
    }
  };
  Object.defineProperty(
    SearchInputComponent.prototype,
    'onLibrariesSearchResults',
    {
      get: function() {
        return this.router.url.indexOf('/search-libraries') === 0;
      },
      enumerable: true,
      configurable: true
    }
  );
  Object.defineProperty(SearchInputComponent.prototype, 'onSearchResults', {
    get: function() {
      return (
        !this.onLibrariesSearchResults &&
        this.router.url.indexOf('/search') === 0
      );
    },
    enumerable: true,
    configurable: true
  });
  SearchInputComponent.prototype.isFilesChecked = function() {
    return this.isOptionChecked(SearchOptionIds.Files);
  };
  SearchInputComponent.prototype.isFoldersChecked = function() {
    return this.isOptionChecked(SearchOptionIds.Folders);
  };
  SearchInputComponent.prototype.isLibrariesChecked = function() {
    return this.isOptionChecked(SearchOptionIds.Libraries);
  };
  SearchInputComponent.prototype.isOptionChecked = function(optionId) {
    var libItem = this.searchOptions.find(function(item) {
      return item.id === optionId;
    });
    return !!libItem && libItem.value;
  };
  SearchInputComponent.prototype.isContentChecked = function() {
    return this.isFilesChecked() || this.isFoldersChecked();
  };
  SearchInputComponent.prototype.hasLibraryConstraint = function() {
    if (this.isLibrariesChecked()) {
      return (
        this.has400LibraryError || this.searchInputControl.isTermTooShort()
      );
    }
    return false;
  };
  SearchInputComponent.prototype.filterContent = function(option) {
    var oppositeOption =
      option === SearchOptionIds.Folders
        ? SearchOptionIds.Files
        : SearchOptionIds.Folders;
    this.queryBuilder.addFilterQuery("+TYPE:'cm:" + option + "'");
    this.queryBuilder.removeFilterQuery("+TYPE:'cm:" + oppositeOption + "'");
  };
  SearchInputComponent.prototype.removeContentFilters = function() {
    this.queryBuilder.removeFilterQuery(
      "+TYPE:'cm:" + SearchOptionIds.Files + "'"
    );
    this.queryBuilder.removeFilterQuery(
      "+TYPE:'cm:" + SearchOptionIds.Folders + "'"
    );
  };
  SearchInputComponent.prototype.syncInputValues = function() {
    if (this.searchInputControl.searchTerm !== this.searchedWord) {
      if (this.searchInputControl.searchTerm) {
        this.searchedWord = this.searchInputControl.searchTerm;
      } else {
        this.searchInputControl.searchTerm = this.searchedWord;
      }
    }
  };
  SearchInputComponent.prototype.getUrlSearchTerm = function() {
    var searchTerm = '';
    if (this.onSearchResults || this.onLibrariesSearchResults) {
      var urlTree = this.router.parseUrl(this.router.url);
      var urlSegmentGroup = urlTree.root.children[PRIMARY_OUTLET];
      if (urlSegmentGroup) {
        var urlSegments = urlSegmentGroup.segments;
        searchTerm = urlSegments[0].parameters['q']
          ? decodeURIComponent(urlSegments[0].parameters['q'])
          : '';
      }
    }
    return searchTerm;
  };
  SearchInputComponent.prototype.isSameSearchTerm = function() {
    var urlSearchTerm = this.getUrlSearchTerm();
    return this.searchedWord === urlSearchTerm;
  };
  tslib_1.__decorate(
    [
      ViewChild('searchInputControl'),
      tslib_1.__metadata('design:type', SearchInputControlComponent)
    ],
    SearchInputComponent.prototype,
    'searchInputControl',
    void 0
  );
  tslib_1.__decorate(
    [
      ViewChild(MatMenuTrigger),
      tslib_1.__metadata('design:type', MatMenuTrigger)
    ],
    SearchInputComponent.prototype,
    'trigger',
    void 0
  );
  SearchInputComponent = tslib_1.__decorate(
    [
      Component({
        selector: 'aca-search-input',
        templateUrl: 'search-input.component.html',
        encapsulation: ViewEncapsulation.None,
        host: { class: 'aca-search-input' }
      }),
      tslib_1.__metadata('design:paramtypes', [
        SearchQueryBuilderService,
        SearchLibrariesQueryBuilderService,
        AppConfigService,
        ContentManagementService,
        Router,
        Store
      ])
    ],
    SearchInputComponent
  );
  return SearchInputComponent;
})();
export { SearchInputComponent };
//# sourceMappingURL=search-input.component.js.map
