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
import { AppConfigPipe, DataTableComponent } from '@alfresco/adf-core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { SearchLibrariesResultsComponent } from './search-libraries-results.component';
import { SearchLibrariesQueryBuilderService } from './search-libraries-query-builder.service';
import { DocumentListComponent } from '@alfresco/adf-content-services';
describe('SearchLibrariesResultsComponent', function() {
  var component;
  var fixture;
  var emptyPage = { list: { pagination: { totalItems: 0 }, entries: [] } };
  beforeEach(function() {
    TestBed.configureTestingModule({
      imports: [AppTestingModule],
      declarations: [
        DataTableComponent,
        DocumentListComponent,
        SearchLibrariesResultsComponent,
        AppConfigPipe
      ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [SearchLibrariesQueryBuilderService]
    });
    fixture = TestBed.createComponent(SearchLibrariesResultsComponent);
    component = fixture.componentInstance;
  });
  it('should show empty page by default', function() {
    return tslib_1.__awaiter(_this, void 0, void 0, function() {
      return tslib_1.__generator(this, function(_a) {
        spyOn(component, 'onSearchResultLoaded').and.callThrough();
        fixture.detectChanges();
        expect(component.onSearchResultLoaded).toHaveBeenCalledWith(emptyPage);
        return [2 /*return*/];
      });
    });
  });
});
//# sourceMappingURL=search-libraries-results.component.spec.js.map
