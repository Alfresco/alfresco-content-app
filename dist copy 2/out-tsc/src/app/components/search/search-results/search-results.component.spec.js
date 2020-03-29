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
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { SearchResultsComponent } from './search-results.component';
import { AppTestingModule } from '../../../testing/app-testing.module';
import { AppSearchResultsModule } from '../search-results.module';
import {
  CoreModule,
  AppConfigService,
  AlfrescoApiService,
  AlfrescoApiServiceMock,
  TranslationService
} from '@alfresco/adf-core';
import { Store } from '@ngrx/store';
import {
  NavigateToFolder,
  SnackbarErrorAction
} from '@alfresco/aca-shared/store';
import { Pagination } from '@alfresco/js-api';
import { SearchQueryBuilderService } from '@alfresco/adf-content-services';
import { ActivatedRoute, Router } from '@angular/router';
describe('SearchComponent', function() {
  var component;
  var fixture;
  var config;
  var store;
  var queryBuilder;
  var alfrescoApi;
  var translate;
  var router;
  beforeEach(function() {
    TestBed.configureTestingModule({
      imports: [CoreModule.forRoot(), AppTestingModule, AppSearchResultsModule],
      providers: [
        {
          provide: AlfrescoApiService,
          useClass: AlfrescoApiServiceMock
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                sortingPreferenceKey: ''
              }
            },
            params: [
              {
                q:
                  'TYPE: "cm:folder" AND %28=cm: name: email OR cm: name: budget%29'
              }
            ]
          }
        }
      ]
    });
    config = TestBed.get(AppConfigService);
    store = TestBed.get(Store);
    queryBuilder = TestBed.get(SearchQueryBuilderService);
    alfrescoApi = TestBed.get(AlfrescoApiService);
    translate = TestBed.get(TranslationService);
    router = TestBed.get(Router);
    fixture = TestBed.createComponent(SearchResultsComponent);
    component = fixture.componentInstance;
    spyOn(queryBuilder, 'update').and.stub();
    fixture.detectChanges();
  });
  it('should raise an error if search fails', fakeAsync(function() {
    spyOn(alfrescoApi.searchApi, 'search').and.returnValue(
      Promise.reject({
        message: '{ "error": { "statusCode": 500 } } '
      })
    );
    spyOn(queryBuilder, 'buildQuery').and.returnValue({});
    spyOn(store, 'dispatch').and.stub();
    queryBuilder.execute();
    tick();
    expect(store.dispatch).toHaveBeenCalledWith(
      new SnackbarErrorAction('APP.BROWSE.SEARCH.ERRORS.GENERIC')
    );
  }));
  it('should raise a known error if search fails', fakeAsync(function() {
    spyOn(translate, 'instant').and.callFake(function(key) {
      if (key === 'APP.BROWSE.SEARCH.ERRORS.401') {
        return 'Known Error';
      }
      return key;
    });
    spyOn(alfrescoApi.searchApi, 'search').and.returnValue(
      Promise.reject({
        message: '{ "error": { "statusCode": 401 } } '
      })
    );
    spyOn(queryBuilder, 'buildQuery').and.returnValue({});
    spyOn(store, 'dispatch').and.stub();
    queryBuilder.execute();
    tick();
    expect(store.dispatch).toHaveBeenCalledWith(
      new SnackbarErrorAction('Known Error')
    );
  }));
  it('should raise a generic error if search fails', fakeAsync(function() {
    spyOn(translate, 'instant').and.callFake(function(key) {
      if (key === 'APP.BROWSE.SEARCH.ERRORS.GENERIC') {
        return 'Generic Error';
      }
      return key;
    });
    spyOn(alfrescoApi.searchApi, 'search').and.returnValue(
      Promise.reject({
        message: '{ "error": { "statusCode": 401 } } '
      })
    );
    spyOn(queryBuilder, 'buildQuery').and.returnValue({});
    spyOn(store, 'dispatch').and.stub();
    queryBuilder.execute();
    tick();
    expect(store.dispatch).toHaveBeenCalledWith(
      new SnackbarErrorAction('Generic Error')
    );
  }));
  it('should decode encoded URI', function() {
    expect(queryBuilder.userQuery).toEqual(
      '(TYPE: "cm:folder" AND (=cm: name: email OR cm: name: budget))'
    );
  });
  it('should return null if formatting invalid query', function() {
    expect(component.formatSearchQuery(null)).toBeNull();
    expect(component.formatSearchQuery('')).toBeNull();
  });
  it('should use original user input if text contains colons', function() {
    var query = 'TEXT:test OR TYPE:folder';
    expect(component.formatSearchQuery(query)).toBe(query);
  });
  it('should use original user input if text contains quotes', function() {
    var query = '"Hello World"';
    expect(component.formatSearchQuery(query)).toBe(query);
  });
  it('should format user input according to the configuration fields', function() {
    config.config = {
      search: {
        'aca:fields': ['cm:name', 'cm:title']
      }
    };
    var query = component.formatSearchQuery('hello');
    expect(query).toBe('(cm:name:"hello*" OR cm:title:"hello*")');
  });
  it('should format user input as cm:name if configuration not provided', function() {
    config.config = {
      search: {
        'aca:fields': undefined
      }
    };
    var query = component.formatSearchQuery('hello');
    expect(query).toBe('(cm:name:"hello*")');
  });
  it('should use AND operator when conjunction has no operators', function() {
    config.config = {
      search: {
        'aca:fields': ['cm:name']
      }
    };
    var query = component.formatSearchQuery('big yellow banana');
    expect(query).toBe(
      '(cm:name:"big*") AND (cm:name:"yellow*") AND (cm:name:"banana*")'
    );
  });
  it('should support conjunctions with AND operator', function() {
    config.config = {
      search: {
        'aca:fields': ['cm:name', 'cm:title']
      }
    };
    var query = component.formatSearchQuery('big AND yellow AND banana');
    expect(query).toBe(
      '(cm:name:"big*" OR cm:title:"big*") AND (cm:name:"yellow*" OR cm:title:"yellow*") AND (cm:name:"banana*" OR cm:title:"banana*")'
    );
  });
  it('should support conjunctions with OR operator', function() {
    config.config = {
      search: {
        'aca:fields': ['cm:name', 'cm:title']
      }
    };
    var query = component.formatSearchQuery('big OR yellow OR banana');
    expect(query).toBe(
      '(cm:name:"big*" OR cm:title:"big*") OR (cm:name:"yellow*" OR cm:title:"yellow*") OR (cm:name:"banana*" OR cm:title:"banana*")'
    );
  });
  it('should support exact term matching with default fields', function() {
    config.config = {
      search: {
        'aca:fields': ['cm:name', 'cm:title']
      }
    };
    var query = component.formatSearchQuery('=orange');
    expect(query).toBe('(=cm:name:"orange" OR =cm:title:"orange")');
  });
  it('should support exact term matching with operators', function() {
    config.config = {
      search: {
        'aca:fields': ['cm:name', 'cm:title']
      }
    };
    var query = component.formatSearchQuery('=test1.pdf or =test2.pdf');
    expect(query).toBe(
      '(=cm:name:"test1.pdf" OR =cm:title:"test1.pdf") or (=cm:name:"test2.pdf" OR =cm:title:"test2.pdf")'
    );
  });
  it('should navigate to folder on double click', function() {
    var node = {
      entry: {
        isFolder: true
      }
    };
    spyOn(store, 'dispatch').and.stub();
    component.onNodeDoubleClick(node);
    expect(store.dispatch).toHaveBeenCalledWith(new NavigateToFolder(node));
  });
  it('should preview file node on double click', function() {
    var node = {
      entry: {
        isFolder: false
      }
    };
    spyOn(component, 'showPreview').and.stub();
    component.onNodeDoubleClick(node);
    expect(component.showPreview).toHaveBeenCalledWith(node, {
      location: router.url
    });
  });
  it('should re-run search on pagination change', function() {
    var page = new Pagination({
      maxItems: 10,
      skipCount: 0
    });
    component.onPaginationChanged(page);
    expect(queryBuilder.paging).toEqual({
      maxItems: 10,
      skipCount: 0
    });
    expect(queryBuilder.update).toHaveBeenCalled();
  });
});
//# sourceMappingURL=search-results.component.spec.js.map
