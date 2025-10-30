/*!
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { Pipe, PipeTransform } from '@angular/core';
import { AppConfigService, NotificationService, TranslationService } from '@alfresco/adf-core';
import { Store } from '@ngrx/store';
import { NavigateToFolder } from '@alfresco/aca-shared/store';
import { Pagination, SearchRequest } from '@alfresco/js-api';
import { SavedSearchesService, SearchQueryBuilderService } from '@alfresco/adf-content-services';
import { ActivatedRoute, Event, NavigationStart, Params, Router } from '@angular/router';
import { BehaviorSubject, Observable, of, Subject, throwError } from 'rxjs';
import { AppTestingModule } from '../../../testing/app-testing.module';
import { AppService } from '@alfresco/aca-shared';
import { MatSnackBarModule, MatSnackBarRef } from '@angular/material/snack-bar';
import { Buffer } from 'buffer';
import { testHeader } from '../../../testing/document-base-page-utils';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatMenuModule } from '@angular/material/menu';
import { MatMenuHarness } from '@angular/material/menu/testing';

@Pipe({ name: 'isFeatureSupportedInCurrentAcs' })
class MockIsFeatureSupportedInCurrentAcsPipe implements PipeTransform {
  transform(): Observable<boolean> {
    return of(true);
  }
}

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
  let params: BehaviorSubject<Params>;
  let queryParams: Subject<Params>;
  let routerEvents: Subject<Event>;
  let showErrorSpy: jasmine.Spy<(message: string, action?: string, interpolateArgs?: any, showAction?: boolean) => MatSnackBarRef<any>>;
  let showInfoSpy: jasmine.Spy<(message: string, action?: string, interpolateArgs?: any, showAction?: boolean) => MatSnackBarRef<any>>;
  let loader: HarnessLoader;

  const editSavedSearchesSpy = jasmine.createSpy('editSavedSearch');
  const getSavedSearchButton = (): HTMLButtonElement => fixture.nativeElement.querySelector('.aca-content__save-search-action');

  const encodeQuery = (query: any): string => {
    return Buffer.from(JSON.stringify(query)).toString('base64');
  };

  beforeEach(() => {
    params = new BehaviorSubject({ q: 'TYPE: "cm:folder" AND %28=cm: name: email OR cm: name: budget%29' });
    queryParams = new Subject();
    routerEvents = new Subject();

    const routerMock = jasmine.createSpyObj<Router>('Router', ['navigate'], {
      url: '/mock-search-url',
      events: routerEvents
    });

    TestBed.configureTestingModule({
      imports: [AppTestingModule, SearchResultsComponent, MatSnackBarModule, MatMenuModule, NoopAnimationsModule],
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
          provide: SavedSearchesService,
          useValue: {
            getSavedSearches: jasmine
              .createSpy('getSavedSearches')
              .and.returnValue(of([{ name: 'test', encodedUrl: encodeQuery({ name: 'test' }), order: 0 }])),
            editSavedSearch: editSavedSearchesSpy
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
            params: params.asObservable(),
            queryParams: queryParams.asObservable()
          }
        },
        { provide: Router, useValue: routerMock }
      ]
    });

    TestBed.overrideComponent(SearchResultsComponent, {
      add: {
        imports: [MockIsFeatureSupportedInCurrentAcsPipe]
      }
    });

    config = TestBed.inject(AppConfigService);
    store = TestBed.inject(Store);
    queryBuilder = TestBed.inject(SearchQueryBuilderService);
    translate = TestBed.inject(TranslationService);
    router = TestBed.inject(Router);
    route = TestBed.inject(ActivatedRoute);

    const notificationService = TestBed.inject(NotificationService);
    showErrorSpy = spyOn(notificationService, 'showError');
    showInfoSpy = spyOn(notificationService, 'showInfo');

    config.config = {
      search: {}
    };

    fixture = TestBed.createComponent(SearchResultsComponent);
    component = fixture.componentInstance;

    spyOn(queryBuilder, 'update').and.stub();

    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.loader(fixture);
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

    expect(store.dispatch).toHaveBeenCalledWith(jasmine.objectContaining({ ...new NavigateToFolder(node) }));
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
      done();
    });
  });

  it('should update the user query whenever configuration changed', () => {
    component.searchedWord = 'orange';
    queryBuilder.configUpdated.next({ 'app:fields': ['cm:tag'] } as any);
    expect(queryBuilder.userQuery).toBe(`((cm:tag:"orange*"))`);
  });

  it('should get initial saved search when url matches', fakeAsync(() => {
    route.queryParams = of({ q: encodeQuery({ name: 'test' }) });
    component.ngOnInit();
    tick();
    expect(component.initialSavedSearch).toEqual({ name: 'test', encodedUrl: encodeQuery({ name: 'test' }), order: 0 });
  }));

  it('should render a menu with 2 options when initial saved search is found', async () => {
    route.queryParams = of({ q: encodeQuery({ name: 'test' }) });
    component.ngOnInit();
    fixture.detectChanges();
    const saveSearchButton = getSavedSearchButton();
    expect(saveSearchButton).toBeDefined();
    expect(saveSearchButton.textContent.trim()).toBe('APP.BROWSE.SEARCH.SAVE_SEARCH.ACTION_BUTTON keyboard_arrow_down');

    const menu = await loader.getHarness(MatMenuHarness.with({ selector: '.aca-content__save-search-action' }));
    expect(await menu.isDisabled()).toBeFalse();
    await menu.open();
    expect(await menu.isOpen()).toBeTrue();
    const menuItems = await menu.getItems();
    expect(menuItems.length).toBe(2);
    expect(await menuItems[0].getText()).toBe('APP.BROWSE.SEARCH.SAVE_SEARCH.SAVE_CHANGES');
    expect(await menuItems[1].getText()).toBe('APP.BROWSE.SEARCH.SAVE_SEARCH.SAVE_AS_NEW');
  });

  it('should not get initial saved search when url does not match', fakeAsync(() => {
    route.snapshot.queryParams = { q: 'test2' };
    tick();
    component.ngOnInit();
    tick();
    expect(component.initialSavedSearch).toBeUndefined();
  }));

  it('should render regular save search button when there is no initial saved search', fakeAsync(() => {
    route.snapshot.queryParams = { q: 'test2' };
    tick();
    component.ngOnInit();
    tick();
    fixture.detectChanges();
    const saveSearchButton = getSavedSearchButton();
    expect(saveSearchButton).toBeDefined();
    expect(saveSearchButton.textContent.trim()).toBe('APP.BROWSE.SEARCH.SAVE_SEARCH.ACTION_BUTTON');
    expect(saveSearchButton.getAttribute('aria-label')).toBe('APP.BROWSE.SEARCH.SAVE_SEARCH.ACTION_BUTTON');
  }));

  it('should dispatch success snackbar action when editing saved search is successful', fakeAsync(() => {
    editSavedSearchesSpy.and.returnValue(of({}));
    component.editSavedSearch({ name: 'test', encodedUrl: 'test', order: 0 });
    tick();
    expect(showInfoSpy).toHaveBeenCalledWith('APP.BROWSE.SEARCH.SAVE_SEARCH.EDIT_DIALOG.SUCCESS_MESSAGE');
  }));

  it('should dispatch error snackbar action when editing saved search failed', fakeAsync(() => {
    editSavedSearchesSpy.and.returnValue(throwError(() => new Error('')));
    component.editSavedSearch({ name: 'test', encodedUrl: 'test', order: 0 });
    tick();
    expect(showErrorSpy).toHaveBeenCalledWith('APP.BROWSE.SEARCH.SAVE_SEARCH.EDIT_DIALOG.ERROR_MESSAGE');
  }));

  it('should call execute once on page reload', fakeAsync(() => {
    spyOn(queryBuilder, 'execute');
    queryParams.next({ q: encodeQuery({ userQuery: 'cm:name:"test*"' }) });

    tick();

    expect(queryBuilder.execute).toHaveBeenCalledTimes(1);
  }));

  it('should NOT call execute on navigation to search page with unchanged query', fakeAsync(() => {
    const executeSpy = spyOn(queryBuilder, 'execute');
    queryParams.next({ q: encodeQuery({ userQuery: 'cm:name:"test*"' }) });
    tick();

    executeSpy.calls.reset();

    routerEvents.next(new NavigationStart(1, '/mock-search-url', 'imperative'));
    queryParams.next({ q: encodeQuery({ userQuery: 'cm:name:"test*"' }) });

    tick();

    expect(queryBuilder.execute).not.toHaveBeenCalled();
  }));

  it('should call execute on navigation to search page with changed query', fakeAsync(() => {
    const executeSpy = spyOn(queryBuilder, 'execute');
    queryParams.next({ q: encodeQuery({ userQuery: 'cm:name:"different*"' }) });
    tick();

    executeSpy.calls.reset();

    routerEvents.next(new NavigationStart(1, '/mock-search-url', 'imperative'));
    queryParams.next({ q: encodeQuery({ userQuery: 'cm:name:"test*"' }) });

    tick();

    expect(executeSpy).toHaveBeenCalledTimes(1);
  }));

  testHeader(SearchResultsComponent, false);
});
