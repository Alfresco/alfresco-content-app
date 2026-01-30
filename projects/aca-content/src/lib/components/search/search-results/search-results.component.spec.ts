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

import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { SearchResultsComponent } from './search-results.component';
import { AppConfigService, NotificationService, TranslationService } from '@alfresco/adf-core';
import { Store } from '@ngrx/store';
import { NavigateToFolder } from '@alfresco/aca-shared/store';
import { Pagination, SearchRequest } from '@alfresco/js-api';
import { FacetFieldBucket, SearchQueryBuilderService } from '@alfresco/adf-content-services';
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
import { SavedSearchesContextService } from '../../../services/saved-searches-context.service';
import { IsFeatureSupportedInCurrentAcsPipe } from '../../../pipes/is-feature-supported.pipe';
import { MatDividerHarness } from '@angular/material/divider/testing';

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
  let updatedSubjectMock: Subject<SearchRequest>;

  const editSavedSearchesSpy = jasmine.createSpy('editSavedSearch');
  const getSavedSearchButton = (): HTMLButtonElement => fixture.nativeElement.querySelector('.aca-content__save-search-action');
  const getResetSearchButton = (): HTMLButtonElement => fixture.nativeElement.querySelector('.aca-content__reset-action');
  const getDividerHarness = () => loader.getHarness(MatDividerHarness);

  const encodeQuery = (query: any): string => {
    return Buffer.from(JSON.stringify(query)).toString('base64');
  };

  beforeEach(() => {
    params = new BehaviorSubject({ q: 'TYPE: "cm:folder" AND %28=cm: name: email OR cm: name: budget%29' });
    queryParams = new Subject();
    routerEvents = new Subject();
    updatedSubjectMock = new Subject();

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
          provide: SavedSearchesContextService,
          useValue: {
            savedSearches$: of([{ name: 'test', encodedUrl: encodeQuery({ name: 'test' }), order: 0 }]),
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
        { provide: Router, useValue: routerMock },
        {
          provide: IsFeatureSupportedInCurrentAcsPipe,
          useValue: { transform: (): Observable<boolean> => of(true) }
        }
      ]
    });

    config = TestBed.inject(AppConfigService);
    store = TestBed.inject(Store);
    queryBuilder = TestBed.inject(SearchQueryBuilderService);
    translate = TestBed.inject(TranslationService);
    router = TestBed.inject(Router);
    route = TestBed.inject(ActivatedRoute);

    queryBuilder.updated = updatedSubjectMock;

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

  it('should get initial saved search when url matches', () => {
    route.queryParams = of({ q: encodeQuery({ name: 'test' }) });
    component.ngOnInit();
    expect(component.initialSavedSearch).toEqual({ name: 'test', encodedUrl: encodeQuery({ name: 'test' }), order: 0 });
  });

  it('should get initial saved search after creating a new one', () => {
    route.queryParams = of({ q: encodeQuery({ name: 'test' }) });
    component.onSaveSearch();
    expect(component.initialSavedSearch).toEqual({ name: 'test', encodedUrl: encodeQuery({ name: 'test' }), order: 0 });
  });

  it('should clear context save search in service on component destroy', () => {
    component.ngOnDestroy();
    expect(TestBed.inject(SavedSearchesContextService).currentContextSavedSearch).toBeUndefined();
  });

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

  it('should format userQuery when url parameters changed and userQuery is not contained by url', () => {
    routerEvents.next(new NavigationStart(1, ''));
    queryParams.next({ q: encodeQuery('') });
    expect(queryBuilder.userQuery).toBe('((cm:name:"*"))');
  });

  it('should not format userQuery when url parameters changed when userQuery is already contained by url', () => {
    routerEvents.next(new NavigationStart(1, ''));
    queryParams.next({ q: encodeQuery({ userQuery: 'test' }) });
    expect(queryBuilder.userQuery).toBe('(test)');
  });

  it('should set loading to true in updated stream for non-nullish query', fakeAsync(() => {
    spyOn(queryBuilder, 'execute').and.stub();

    expect(component.isLoading).toBeFalse();

    updatedSubjectMock.next(null);

    tick();

    expect(component.isLoading).toBeFalse();

    updatedSubjectMock.next({} as SearchRequest);

    tick();

    expect(component.isLoading).toBeTrue();

    flush();
  }));

  it('should set isSmallScreen to true for small width', async () => {
    spyOnProperty(window, 'innerWidth').and.returnValue(300);
    window.dispatchEvent(new Event('resize'));
    fixture.detectChanges();
    const divider = await getDividerHarness();

    expect(component.isSmallScreen).toBeTrue();
    expect(await (await divider.host()).getAttribute('class')).toContain('aca-content__divider-horizontal');
    expect(await divider.getOrientation()).toBe('horizontal');
  });

  it('should set isSmallScreen to false for large width', async () => {
    spyOnProperty(window, 'innerWidth').and.returnValue(800);
    window.dispatchEvent(new Event('resize'));
    fixture.detectChanges();
    const divider = await getDividerHarness();

    expect(component.isSmallScreen).toBeFalse();
    expect(await (await divider.host()).getAttribute('class')).toContain('aca-content__divider-vertical');
    expect(await divider.getOrientation()).toBe('vertical');
  });

  describe('reset button', () => {
    it('should enable the reset button when there are queryFragments', fakeAsync(() => {
      queryBuilder.queryFragmentsUpdate.next({ test: 'test-value' });

      tick();

      fixture.detectChanges();

      const resetBtn = getResetSearchButton();

      expect(resetBtn).toBeDefined();
      expect(resetBtn.getAttribute('disabled')).toBeFalsy();

      flush();
    }));

    it('should enable the reset button when there are userFacetBuckets', fakeAsync(() => {
      queryBuilder.userFacetBucketsUpdate.next({ test: [{ label: 'test-value' }] as FacetFieldBucket[] });

      tick();

      fixture.detectChanges();

      const resetBtn = getResetSearchButton();

      expect(resetBtn).toBeDefined();
      expect(resetBtn.getAttribute('disabled')).toBeFalsy();

      flush();
    }));

    it('should disable the reset button when there are no filters applied', fakeAsync(() => {
      queryBuilder.queryFragmentsUpdate.next({});
      queryBuilder.userFacetBucketsUpdate.next({});

      tick();

      fixture.detectChanges();

      const resetBtn = getResetSearchButton();

      expect(resetBtn).toBeDefined();
      expect(resetBtn.getAttribute('disabled')).toBeTruthy();

      flush();
    }));

    it('should enable the reset button when userFacetBuckets was reset but queryFragments are still present', fakeAsync(() => {
      queryBuilder.userFacetBucketsUpdate.next({ test: [{ label: 'test-value' }] as FacetFieldBucket[] });
      queryBuilder.queryFragmentsUpdate.next({ test: 'test-value' });
      queryBuilder.userFacetBucketsUpdate.next({});

      tick();

      fixture.detectChanges();

      const resetBtn = getResetSearchButton();

      expect(resetBtn).toBeDefined();
      expect(resetBtn.getAttribute('disabled')).toBeFalsy();

      flush();
    }));

    it('should enable the reset button when queryFragments was reset but userFacetBuckets are still present', fakeAsync(() => {
      queryBuilder.userFacetBucketsUpdate.next({ test: [{ label: 'test-value' }] as FacetFieldBucket[] });
      queryBuilder.queryFragmentsUpdate.next({ test: 'test-value' });
      queryBuilder.queryFragmentsUpdate.next({});

      tick();

      fixture.detectChanges();

      const resetBtn = getResetSearchButton();

      expect(resetBtn).toBeDefined();
      expect(resetBtn.getAttribute('disabled')).toBeFalsy();

      flush();
    }));
  });

  testHeader(SearchResultsComponent, false);
});
