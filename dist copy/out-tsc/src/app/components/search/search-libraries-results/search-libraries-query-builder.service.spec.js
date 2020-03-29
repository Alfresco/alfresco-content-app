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
var _this = this;
import * as tslib_1 from 'tslib';
import { TestBed } from '@angular/core/testing';
import { AppTestingModule } from '../../../testing/app-testing.module';
import { AlfrescoApiService } from '@alfresco/adf-core';
import { SearchLibrariesQueryBuilderService } from './search-libraries-query-builder.service';
describe('SearchLibrariesQueryBuilderService', function() {
  var apiService;
  var builder;
  var queriesApi;
  beforeEach(function() {
    TestBed.configureTestingModule({
      imports: [AppTestingModule]
    });
    apiService = TestBed.get(AlfrescoApiService);
    apiService.reset();
    queriesApi = apiService.getInstance().core.queriesApi;
    builder = new SearchLibrariesQueryBuilderService(apiService);
  });
  it('should have empty user query by default', function() {
    expect(builder.userQuery).toBe('');
  });
  it('should trim user query value', function() {
    builder.userQuery = ' something   ';
    expect(builder.userQuery).toEqual('something');
  });
  it('should build query and raise an event on update', function() {
    return tslib_1.__awaiter(_this, void 0, void 0, function() {
      var query, eventArgs;
      return tslib_1.__generator(this, function(_a) {
        switch (_a.label) {
          case 0:
            query = {};
            spyOn(builder, 'buildQuery').and.returnValue(query);
            eventArgs = null;
            builder.updated.subscribe(function(args) {
              return (eventArgs = args);
            });
            return [4 /*yield*/, builder.update()];
          case 1:
            _a.sent();
            expect(eventArgs).toBe(query);
            return [2 /*return*/];
        }
      });
    });
  });
  it('should build query and raise an event on execute', function() {
    return tslib_1.__awaiter(_this, void 0, void 0, function() {
      var data, query, eventArgs;
      return tslib_1.__generator(this, function(_a) {
        switch (_a.label) {
          case 0:
            data = {};
            spyOn(queriesApi, 'findSites').and.returnValue(
              Promise.resolve(data)
            );
            query = {};
            spyOn(builder, 'buildQuery').and.returnValue(query);
            eventArgs = null;
            builder.executed.subscribe(function(args) {
              return (eventArgs = args);
            });
            return [4 /*yield*/, builder.execute()];
          case 1:
            _a.sent();
            expect(eventArgs).toBe(data);
            return [2 /*return*/];
        }
      });
    });
  });
  it('should require a query fragment to build query', function() {
    var compiled = builder.buildQuery();
    expect(compiled).toBeNull();
  });
  it('should build query when there is a useQuery value', function() {
    var searchedTerm = 'test';
    builder.userQuery = searchedTerm;
    var compiled = builder.buildQuery();
    expect(compiled.term).toBe(searchedTerm);
  });
  it('should use pagination settings', function() {
    var searchedTerm = 'test';
    builder.paging = { maxItems: 5, skipCount: 5 };
    builder.userQuery = searchedTerm;
    var compiled = builder.buildQuery();
    expect(compiled.opts).toEqual({ maxItems: 5, skipCount: 5 });
  });
  it('should raise an event on error', function() {
    return tslib_1.__awaiter(_this, void 0, void 0, function() {
      var err, query, eventArgs;
      return tslib_1.__generator(this, function(_a) {
        switch (_a.label) {
          case 0:
            err = '{"error": {"statusCode": 400}}';
            spyOn(queriesApi, 'findSites').and.returnValue(Promise.reject(err));
            query = {};
            spyOn(builder, 'buildQuery').and.returnValue(query);
            eventArgs = null;
            builder.hadError.subscribe(function(args) {
              return (eventArgs = args);
            });
            return [4 /*yield*/, builder.execute()];
          case 1:
            _a.sent();
            expect(eventArgs).toBe(err);
            return [2 /*return*/];
        }
      });
    });
  });
});
//# sourceMappingURL=search-libraries-query-builder.service.spec.js.map
