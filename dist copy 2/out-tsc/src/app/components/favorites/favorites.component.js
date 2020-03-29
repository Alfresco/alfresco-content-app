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
import { ContentApiService } from '@alfresco/aca-shared';
import { UploadService } from '@alfresco/adf-core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { debounceTime, map } from 'rxjs/operators';
import { AppExtensionService } from '../../extensions/extension.service';
import { ContentManagementService } from '../../services/content-management.service';
import { PageComponent } from '../page.component';
var FavoritesComponent = /** @class */ (function(_super) {
  tslib_1.__extends(FavoritesComponent, _super);
  function FavoritesComponent(
    router,
    store,
    extensions,
    contentApi,
    content,
    uploadService,
    breakpointObserver
  ) {
    var _this = _super.call(this, store, extensions, content) || this;
    _this.router = router;
    _this.contentApi = contentApi;
    _this.uploadService = uploadService;
    _this.breakpointObserver = breakpointObserver;
    _this.isSmallScreen = false;
    _this.columns = [];
    return _this;
  }
  FavoritesComponent.prototype.ngOnInit = function() {
    var _this = this;
    _super.prototype.ngOnInit.call(this);
    this.subscriptions = this.subscriptions.concat([
      this.uploadService.fileUploadComplete
        .pipe(debounceTime(300))
        .subscribe(function(_) {
          return _this.reload();
        }),
      this.uploadService.fileUploadDeleted
        .pipe(debounceTime(300))
        .subscribe(function(_) {
          return _this.reload();
        }),
      this.breakpointObserver
        .observe([Breakpoints.HandsetPortrait, Breakpoints.HandsetLandscape])
        .subscribe(function(result) {
          _this.isSmallScreen = result.matches;
        })
    ]);
    this.columns = this.extensions.documentListPresets.favorites;
  };
  FavoritesComponent.prototype.navigate = function(favorite) {
    var _this = this;
    var isFolder = favorite.isFolder,
      id = favorite.id;
    // TODO: rework as it will fail on non-English setups
    var isSitePath = function(path) {
      return (
        path &&
        path.elements &&
        path.elements.some(function(_a) {
          var name = _a.name;
          return name === 'Sites';
        })
      );
    };
    if (isFolder) {
      this.contentApi
        .getNode(id)
        .pipe(
          map(function(node) {
            return node.entry;
          })
        )
        .subscribe(function(_a) {
          var path = _a.path;
          var routeUrl = isSitePath(path) ? '/libraries' : '/personal-files';
          _this.router.navigate([routeUrl, id]);
        });
    }
  };
  FavoritesComponent.prototype.onNodeDoubleClick = function(node) {
    if (node && node.entry) {
      if (node.entry.isFolder) {
        this.navigate(node.entry);
      }
      if (node.entry.isFile) {
        this.showPreview(node, { location: this.router.url });
      }
    }
  };
  FavoritesComponent = tslib_1.__decorate(
    [
      Component({
        templateUrl: './favorites.component.html'
      }),
      tslib_1.__metadata('design:paramtypes', [
        Router,
        Store,
        AppExtensionService,
        ContentApiService,
        ContentManagementService,
        UploadService,
        BreakpointObserver
      ])
    ],
    FavoritesComponent
  );
  return FavoritesComponent;
})(PageComponent);
export { FavoritesComponent };
//# sourceMappingURL=favorites.component.js.map
