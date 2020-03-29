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
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, ChangeDetectorRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { Pagination } from '@alfresco/js-api';
import { AppExtensionService } from '../../extensions/extension.service';
import { ContentManagementService } from '../../services/content-management.service';
import { ContentApiService } from '@alfresco/aca-shared';
import { NavigateLibraryAction } from '@alfresco/aca-shared/store';
import { PageComponent } from '../page.component';
import { UserPreferencesService } from '@alfresco/adf-core';
var FavoriteLibrariesComponent = /** @class */ (function(_super) {
  tslib_1.__extends(FavoriteLibrariesComponent, _super);
  function FavoriteLibrariesComponent(
    content,
    store,
    extensions,
    contentApiService,
    breakpointObserver,
    preferences,
    changeDetectorRef
  ) {
    var _this = _super.call(this, store, extensions, content) || this;
    _this.contentApiService = contentApiService;
    _this.breakpointObserver = breakpointObserver;
    _this.preferences = preferences;
    _this.changeDetectorRef = changeDetectorRef;
    _this.pagination = new Pagination({
      skipCount: 0,
      maxItems: 25,
      totalItems: 0
    });
    _this.isLoading = false;
    _this.isSmallScreen = false;
    _this.columns = [];
    return _this;
  }
  FavoriteLibrariesComponent.prototype.ngOnInit = function() {
    var _this = this;
    _super.prototype.ngOnInit.call(this);
    this.getList({ maxItems: this.preferences.paginationSize });
    this.subscriptions = this.subscriptions.concat([
      this.content.libraryDeleted.subscribe(function() {
        return _this.reloadList();
      }),
      this.content.libraryUpdated.subscribe(function() {
        return _this.reloadList();
      }),
      this.content.libraryJoined.subscribe(function() {
        return _this.reloadList();
      }),
      this.content.libraryLeft.subscribe(function() {
        return _this.reloadList();
      }),
      this.content.favoriteLibraryToggle.subscribe(function() {
        return _this.reloadList();
      }),
      this.breakpointObserver
        .observe([Breakpoints.HandsetPortrait, Breakpoints.HandsetLandscape])
        .subscribe(function(result) {
          _this.isSmallScreen = result.matches;
        })
    ]);
    this.columns = this.extensions.documentListPresets.favoriteLibraries || [];
  };
  FavoriteLibrariesComponent.prototype.navigateTo = function(node) {
    if (node && node.entry && node.entry.guid) {
      this.store.dispatch(new NavigateLibraryAction(node.entry.guid));
    }
  };
  FavoriteLibrariesComponent.prototype.onChangePageSize = function(pagination) {
    this.preferences.paginationSize = pagination.maxItems;
    this.getList(pagination);
  };
  FavoriteLibrariesComponent.prototype.onChange = function(pagination) {
    this.getList(pagination);
  };
  FavoriteLibrariesComponent.prototype.getList = function(pagination) {
    var _this = this;
    this.isLoading = true;
    this.contentApiService.getFavoriteLibraries('-me-', pagination).subscribe(
      function(favoriteLibraries) {
        _this.list = favoriteLibraries;
        _this.pagination = favoriteLibraries.list.pagination;
        _this.isLoading = false;
        _this.changeDetectorRef.detectChanges();
      },
      function() {
        _this.list = null;
        _this.pagination = null;
        _this.isLoading = false;
      }
    );
  };
  FavoriteLibrariesComponent.prototype.reloadList = function() {
    this.reload();
    this.getList(this.pagination);
  };
  FavoriteLibrariesComponent = tslib_1.__decorate(
    [
      Component({
        templateUrl: './favorite-libraries.component.html'
      }),
      tslib_1.__metadata('design:paramtypes', [
        ContentManagementService,
        Store,
        AppExtensionService,
        ContentApiService,
        BreakpointObserver,
        UserPreferencesService,
        ChangeDetectorRef
      ])
    ],
    FavoriteLibrariesComponent
  );
  return FavoriteLibrariesComponent;
})(PageComponent);
export { FavoriteLibrariesComponent };
//# sourceMappingURL=favorite-libraries.component.js.map
