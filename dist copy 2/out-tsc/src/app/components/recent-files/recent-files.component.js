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
import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ContentManagementService } from '../../services/content-management.service';
import { PageComponent } from '../page.component';
import { Store } from '@ngrx/store';
import { AppExtensionService } from '../../extensions/extension.service';
import { UploadService } from '@alfresco/adf-core';
import { debounceTime } from 'rxjs/operators';
import { Router } from '@angular/router';
var RecentFilesComponent = /** @class */ (function(_super) {
  tslib_1.__extends(RecentFilesComponent, _super);
  function RecentFilesComponent(
    store,
    extensions,
    content,
    uploadService,
    breakpointObserver,
    router
  ) {
    var _this = _super.call(this, store, extensions, content) || this;
    _this.uploadService = uploadService;
    _this.breakpointObserver = breakpointObserver;
    _this.router = router;
    _this.isSmallScreen = false;
    _this.columns = [];
    return _this;
  }
  RecentFilesComponent.prototype.ngOnInit = function() {
    var _this = this;
    _super.prototype.ngOnInit.call(this);
    this.subscriptions = this.subscriptions.concat([
      this.uploadService.fileUploadComplete
        .pipe(debounceTime(300))
        .subscribe(function() {
          return _this.onFileUploadedEvent();
        }),
      this.uploadService.fileUploadDeleted
        .pipe(debounceTime(300))
        .subscribe(function() {
          return _this.onFileUploadedEvent();
        }),
      this.breakpointObserver
        .observe([Breakpoints.HandsetPortrait, Breakpoints.HandsetLandscape])
        .subscribe(function(result) {
          _this.isSmallScreen = result.matches;
        })
    ]);
    this.columns = this.extensions.documentListPresets.recent || [];
  };
  RecentFilesComponent.prototype.onNodeDoubleClick = function(node) {
    if (node && node.entry) {
      this.showPreview(node, { location: this.router.url });
    }
  };
  RecentFilesComponent.prototype.onFileUploadedEvent = function() {
    this.reload();
  };
  RecentFilesComponent = tslib_1.__decorate(
    [
      Component({
        templateUrl: './recent-files.component.html'
      }),
      tslib_1.__metadata('design:paramtypes', [
        Store,
        AppExtensionService,
        ContentManagementService,
        UploadService,
        BreakpointObserver,
        Router
      ])
    ],
    RecentFilesComponent
  );
  return RecentFilesComponent;
})(PageComponent);
export { RecentFilesComponent };
//# sourceMappingURL=recent-files.component.js.map
