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

import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { SearchResultsComponent } from './search-results.component';
import { AppTestingModule } from '../../../testing/app-testing.module';
import { AppSearchResultsModule } from '../search-results.module';
import { AppConfigService, CoreModule, TranslationService } from '@alfresco/adf-core';
import { Store } from '@ngrx/store';
import { NavigateToFolder, SnackbarErrorAction } from '@alfresco/aca-shared/store';
import { Pagination, SearchRequest } from '@alfresco/js-api';
import { SearchQueryBuilderService } from '@alfresco/adf-content-services';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';

describe('SearchComponent', () => {
  let component: SearchResultsComponent;
  let fixture: ComponentFixture<SearchResultsComponent>;
  let config: AppConfigService;
  let store: Store<any>;
  let queryBuilder: SearchQueryBuilderService;
  let translate: TranslationService;
  let router: Router;
  const searchRequest = {} as SearchRequest;
  let params: BehaviorSubject<any>;

  beforeEach(() => {
    params = new BehaviorSubject({ q: 'TYPE: "cm:folder" AND %28=cm: name: email OR cm: name: budget%29' });
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), CoreModule.forRoot(), AppTestingModule, AppSearchResultsModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                sortingPreferenceKey: ''
              }
            },
            params: params.asObservable()
          }
        }
      ]
    });

    config = TestBed.inject(AppConfigService);
    store = TestBed.inject(Store);
    queryBuilder = TestBed.inject(SearchQueryBuilderService);
    translate = TestBed.inject(TranslationService);
    router = TestBed.inject(Router);

    config.config = {
      search: {}
    };

    fixture = TestBed.createComponent(SearchResultsComponent);
    component = fixture.componentInstance;

    spyOn(queryBuilder, 'update').and.stub();

    fixture.detectChanges();
  });

  afterEach(() => {
    params.complete();
  });

  it('should raise an error if search fails', fakeAsync(() => {
    spyOn(queryBuilder['searchApi'], 'search').and.returnValue(
      Promise.reject({
        message: `{ "error": { "statusCode": 500 } } `
      })
    );

    spyOn(queryBuilder, 'buildQuery').and.returnValue(searchRequest);
    spyOn(store, 'dispatch').and.stub();

    queryBuilder.execute();
    tick();

    expect(store.dispatch).toHaveBeenCalledWith(new SnackbarErrorAction('APP.BROWSE.SEARCH.ERRORS.GENERIC'));
  }));

  it('should raise a known error if search fails', fakeAsync(() => {
    spyOn(translate, 'instant').and.callFake((key: string) => {
      if (key === 'APP.BROWSE.SEARCH.ERRORS.401') {
        return 'Known Error';
      }
      return key;
    });

    spyOn(queryBuilder['searchApi'], 'search').and.returnValue(
      Promise.reject({
        message: `{ "error": { "statusCode": 401 } } `
      })
    );

    spyOn(queryBuilder, 'buildQuery').and.returnValue(searchRequest);
    spyOn(store, 'dispatch').and.stub();

    queryBuilder.execute();
    tick();

    expect(store.dispatch).toHaveBeenCalledWith(new SnackbarErrorAction('Known Error'));
  }));

  it('should raise a generic error if search fails', fakeAsync(() => {
    spyOn(translate, 'instant').and.callFake((key: string) => {
      if (key === 'APP.BROWSE.SEARCH.ERRORS.GENERIC') {
        return 'Generic Error';
      }
      return key;
    });

    spyOn(queryBuilder['searchApi'], 'search').and.returnValue(
      Promise.reject({
        message: `{ "error": { "statusCode": 401 } } `
      })
    );

    spyOn(queryBuilder, 'buildQuery').and.returnValue(searchRequest);
    spyOn(store, 'dispatch').and.stub();

    queryBuilder.execute();
    tick();

    expect(store.dispatch).toHaveBeenCalledWith(new SnackbarErrorAction('Generic Error'));
  }));

  it('should decode encoded URI', () => {
    expect(queryBuilder.userQuery).toEqual('(TYPE: "cm:folder" AND (=cm: name: email OR cm: name: budget))');
  });

  it('should return null if formatting invalid query', () => {
    expect(component.formatSearchQuery(null)).toBeNull();
    expect(component.formatSearchQuery('')).toBeNull();
  });

  it('should use original user input if text contains colons', () => {
    const query = 'TEXT:test OR TYPE:folder';
    expect(component.formatSearchQuery(query)).toBe(query);
  });

  it('should be able to search if search input contains https url', () => {
    const query = component.formatSearchQuery('https://alfresco.com');
    expect(query).toBe(`(cm:name:"https://alfresco.com*")`);
  });

  it('should be able to search if search input contains http url', () => {
    const query = component.formatSearchQuery('http://alfresco.com');
    expect(query).toBe(`(cm:name:"http://alfresco.com*")`);
  });

  it('should use original user input if text contains quotes', () => {
    const query = `"Hello World"`;
    expect(component.formatSearchQuery(query)).toBe(query);
  });

  it('should format user input according to the configuration fields', () => {
    const query = component.formatSearchQuery('hello', ['cm:name', 'cm:title']);
    expect(query).toBe(`(cm:name:"hello*" OR cm:title:"hello*")`);
  });

  it('should format user input as cm:name if configuration not provided', () => {
    const query = component.formatSearchQuery('hello', undefined);
    expect(query).toBe(`(cm:name:"hello*")`);
  });

  it('should use AND operator when conjunction has no operators', () => {
    const query = component.formatSearchQuery('big yellow banana', ['cm:name']);

    expect(query).toBe(`(cm:name:"big*") AND (cm:name:"yellow*") AND (cm:name:"banana*")`);
  });

  it('should support conjunctions with AND operator', () => {
    const query = component.formatSearchQuery('big AND yellow AND banana', ['cm:name', 'cm:title']);

    expect(query).toBe(
      `(cm:name:"big*" OR cm:title:"big*") AND (cm:name:"yellow*" OR cm:title:"yellow*") AND (cm:name:"banana*" OR cm:title:"banana*")`
    );
  });

  it('should support conjunctions with OR operator', () => {
    const query = component.formatSearchQuery('big OR yellow OR banana', ['cm:name', 'cm:title']);

    expect(query).toBe(
      `(cm:name:"big*" OR cm:title:"big*") OR (cm:name:"yellow*" OR cm:title:"yellow*") OR (cm:name:"banana*" OR cm:title:"banana*")`
    );
  });

  it('should support exact term matching with default fields', () => {
    const query = component.formatSearchQuery('=orange', ['cm:name', 'cm:title']);

    expect(query).toBe(`(=cm:name:"orange" OR =cm:title:"orange")`);
  });

  it('should support exact term matching with operators', () => {
    const query = component.formatSearchQuery('=test1.pdf or =test2.pdf', ['cm:name', 'cm:title']);

    expect(query).toBe(`(=cm:name:"test1.pdf" OR =cm:title:"test1.pdf") or (=cm:name:"test2.pdf" OR =cm:title:"test2.pdf")`);
  });

  it('should navigate to folder on double click', () => {
    const node: any = {
      entry: {
        isFolder: true
      }
    };

    spyOn(store, 'dispatch').and.stub();

    component.onNodeDoubleClick(node);

    expect(store.dispatch).toHaveBeenCalledWith(new NavigateToFolder(node));
  });

  it('should preview file node on double click', () => {
    const node: any = {
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

  it('should re-run search on pagination change', () => {
    const page = new Pagination({
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

  it('should update the user query whenever param changed', () => {
    params.next({ q: '=orange' });
    expect(queryBuilder.userQuery).toBe(`((=cm:name:"orange"))`);
    expect(queryBuilder.update).toHaveBeenCalled();
  });

  it('should update the user query whenever configuration changed', () => {
    params.next({ q: '=orange' });
    queryBuilder.configUpdated.next({ 'aca:fields': ['cm:tag'] } as any);
    expect(queryBuilder.userQuery).toBe(`((=cm:tag:"orange"))`);
    expect(queryBuilder.update).toHaveBeenCalled();
  });
});
