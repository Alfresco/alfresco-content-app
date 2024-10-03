/*!
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * Alfresco Example Content Application
 *
 * This file is part of the Alfresco Example Content Application.
 * If the software was purchased under a paid Alfresco license, the terms of
 * the paid license agreement will prevail. Otherwise, the software is
 * provided under the following open source license terms:
 *
 * The Alfresco Example Content Application is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * The Alfresco Example Content Application is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * from Hyland Software. If not, see <http://www.gnu.org/licenses/>.
 */

import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { SearchResultsComponent } from './search-results.component';
import { AppConfigService, NotificationService, TranslationService } from '@alfresco/adf-core';
import { Store } from '@ngrx/store';
import { NavigateToFolder } from '@alfresco/aca-shared/store';
import { Pagination, SearchRequest } from '@alfresco/js-api';
import { SearchQueryBuilderService } from '@alfresco/adf-content-services';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, of, Subject } from 'rxjs';
import { AppTestingModule } from '../../../testing/app-testing.module';
import { AppService } from '@alfresco/aca-shared';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { Buffer } from 'buffer';

describe('SearchComponent', () => {
  let component: SearchResultsComponent;
  let fixture: ComponentFixture<SearchResultsComponent>;
  let config: AppConfigService;
  let store: Store<any>;
  let queryBuilder: SearchQueryBuilderService;
  let translate: TranslationService;
  let router: Router;
  let route: ActivatedRoute;
  const searchRequest = {} as SearchRequest;
  let params: BehaviorSubject<any>;
  let showErrorSpy: jasmine.Spy;

  const encodeQuery = (query: any): string => {
    return Buffer.from(JSON.stringify(query)).toString('base64');
  };

  beforeEach(() => {
    params = new BehaviorSubject({ q: 'TYPE: "cm:folder" AND %28=cm: name: email OR cm: name: budget%29' });
    TestBed.configureTestingModule({
      imports: [AppTestingModule, SearchResultsComponent, MatSnackBarModule],
      providers: [
        {
          provide: AppService,
          useValue: {
            appNavNarMode$: new BehaviorSubject('expanded'),
            toggleAppNavBar$: new Subject(),
            setAppNavbarMode: jasmine.createSpy('setAppNavbarMode')
          }
        },
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
    route = TestBed.inject(ActivatedRoute);
    route.queryParams = of({});

    const notificationService = TestBed.inject(NotificationService);
    showErrorSpy = spyOn(notificationService, 'showError');

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
    spyOn(queryBuilder['searchApi'], 'search').and.returnValue(Promise.reject(new Error('{ "error": { "statusCode": 500 } }')));

    spyOn(queryBuilder, 'buildQuery').and.returnValue(searchRequest);
    spyOn(store, 'dispatch').and.stub();

    queryBuilder.execute();
    tick();

    expect(showErrorSpy).toHaveBeenCalledWith('APP.BROWSE.SEARCH.ERRORS.GENERIC');
  }));

  it('should raise a known error if search fails', fakeAsync(() => {
    spyOn(translate, 'instant').and.callFake((key: string) => {
      if (key === 'APP.BROWSE.SEARCH.ERRORS.401') {
        return 'Known Error';
      }
      return key;
    });

    spyOn(queryBuilder['searchApi'], 'search').and.returnValue(Promise.reject(new Error('{ "error": { "statusCode": 401 } }')));

    spyOn(queryBuilder, 'buildQuery').and.returnValue(searchRequest);
    spyOn(store, 'dispatch').and.stub();

    queryBuilder.execute();
    tick();

    expect(showErrorSpy).toHaveBeenCalledWith('Known Error');
  }));

  it('should raise a generic error if search fails', fakeAsync(() => {
    spyOn(translate, 'instant').and.callFake((key: string) => {
      if (key === 'APP.BROWSE.SEARCH.ERRORS.GENERIC') {
        return 'Generic Error';
      }
      return key;
    });

    spyOn(queryBuilder['searchApi'], 'search').and.returnValue(Promise.reject(new Error('{ "error": { "statusCode": 401 } }')));

    spyOn(queryBuilder, 'buildQuery').and.returnValue(searchRequest);
    spyOn(store, 'dispatch').and.stub();

    queryBuilder.execute();
    tick();

    expect(showErrorSpy).toHaveBeenCalledWith('Generic Error');
  }));

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

  it('should update the user query, populate filters state and execute query whenever param changed', (done) => {
    spyOn(queryBuilder.populateFilters, 'next');
    spyOn(queryBuilder, 'execute');
    const query = { userQuery: 'cm:tag:"orange*"', filterProp: { prop: 'test' } };
    route.queryParams = of({ q: encodeQuery(query) });
    component.ngOnInit();
    route.queryParams.subscribe(() => {
      expect(component.searchedWord).toBe(`orange`);
      expect(queryBuilder.userQuery).toBe(`(cm:tag:"orange*")`);
      expect(queryBuilder.populateFilters.next).toHaveBeenCalledWith({ userQuery: 'cm:tag:"orange*"', filterProp: { prop: 'test' } });
      queryBuilder.filterLoaded.next();
      fixture.detectChanges();
      expect(queryBuilder.execute).toHaveBeenCalledWith(false);
      done();
    });
  });

  it('should update the user query whenever configuration changed', () => {
    component.searchedWord = 'orange';
    queryBuilder.configUpdated.next({ 'app:fields': ['cm:tag'] } as any);
    expect(queryBuilder.userQuery).toBe(`((cm:tag:"orange*"))`);
  });
});
