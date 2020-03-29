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
import { AlfrescoApiService } from '@alfresco/adf-core';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
var SearchLibrariesQueryBuilderService = /** @class */ (function() {
  function SearchLibrariesQueryBuilderService(alfrescoApiService) {
    this.alfrescoApiService = alfrescoApiService;
    this._userQuery = '';
    this.updated = new Subject();
    this.executed = new Subject();
    this.hadError = new Subject();
    this.paging = null;
  }
  Object.defineProperty(
    SearchLibrariesQueryBuilderService.prototype,
    'userQuery',
    {
      get: function() {
        return this._userQuery;
      },
      set: function(value) {
        this._userQuery = value ? value.trim() : '';
      },
      enumerable: true,
      configurable: true
    }
  );
  SearchLibrariesQueryBuilderService.prototype.update = function() {
    var query = this.buildQuery();
    if (query) {
      this.updated.next(query);
    }
  };
  SearchLibrariesQueryBuilderService.prototype.execute = function() {
    return tslib_1.__awaiter(this, void 0, void 0, function() {
      var query, data;
      return tslib_1.__generator(this, function(_a) {
        switch (_a.label) {
          case 0:
            query = this.buildQuery();
            if (!query) return [3 /*break*/, 2];
            return [4 /*yield*/, this.findLibraries(query)];
          case 1:
            data = _a.sent();
            this.executed.next(data);
            _a.label = 2;
          case 2:
            return [2 /*return*/];
        }
      });
    });
  };
  SearchLibrariesQueryBuilderService.prototype.buildQuery = function() {
    var query = this.userQuery;
    if (query && query.length > 1) {
      var resultQuery = {
        term: query,
        opts: {
          skipCount: this.paging && this.paging.skipCount,
          maxItems: this.paging && this.paging.maxItems
        }
      };
      return resultQuery;
    }
    return null;
  };
  SearchLibrariesQueryBuilderService.prototype.findLibraries = function(
    libraryQuery
  ) {
    var _this = this;
    return this.alfrescoApiService
      .getInstance()
      .core.queriesApi.findSites(libraryQuery.term, libraryQuery.opts)
      .catch(function(err) {
        _this.hadError.next(err);
        return { list: { pagination: { totalItems: 0 }, entries: [] } };
      });
  };
  SearchLibrariesQueryBuilderService = tslib_1.__decorate(
    [
      Injectable({
        providedIn: 'root'
      }),
      tslib_1.__metadata('design:paramtypes', [AlfrescoApiService])
    ],
    SearchLibrariesQueryBuilderService
  );
  return SearchLibrariesQueryBuilderService;
})();
export { SearchLibrariesQueryBuilderService };
//# sourceMappingURL=search-libraries-query-builder.service.js.map
