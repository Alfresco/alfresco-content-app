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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppTestingModule } from '../../../testing/app-testing.module';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { SearchLibrariesResultsComponent } from './search-libraries-results.component';
import { SearchLibrariesQueryBuilderService } from './search-libraries-query-builder.service';
import { BehaviorSubject, of, Subject } from 'rxjs';
import { AppService } from '@alfresco/aca-shared';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { Buffer } from 'buffer';

describe('SearchLibrariesResultsComponent', () => {
  let component: SearchLibrariesResultsComponent;
  let fixture: ComponentFixture<SearchLibrariesResultsComponent>;
  let route: ActivatedRoute;

  const emptyPage = { list: { pagination: { totalItems: 0 }, entries: [] } };
  const appServiceMock = {
    appNavNarMode$: new BehaviorSubject('collapsed'),
    toggleAppNavBar$: new Subject(),
    setAppNavbarMode: jasmine.createSpy('setAppNavbarMode')
  };

  const encodeQuery = (query: any): string => {
    return Buffer.from(JSON.stringify(query)).toString('base64');
  };

  beforeEach(() => {
    appServiceMock.setAppNavbarMode.calls.reset();
    TestBed.configureTestingModule({
      imports: [AppTestingModule, SearchLibrariesResultsComponent, MatSnackBarModule],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        {
          provide: AppService,
          useValue: appServiceMock
        },
        SearchLibrariesQueryBuilderService
      ]
    });

    route = TestBed.inject(ActivatedRoute);
    fixture = TestBed.createComponent(SearchLibrariesResultsComponent);
    component = fixture.componentInstance;
  });

  it('should show empty page by default', async () => {
    spyOn(component, 'onSearchResultLoaded').and.callThrough();
    fixture.detectChanges();

    expect(component.onSearchResultLoaded).toHaveBeenCalledWith(emptyPage);
  });

  it('should collapsed sidenav by default', () => {
    component.ngOnInit();

    expect(appServiceMock.setAppNavbarMode).toHaveBeenCalledWith('collapsed');
  });

  it('should extract searched word from query params', (done) => {
    route.queryParams = of({ q: encodeQuery({ userQuery: 'cm:name:"test*"' }) });
    route.queryParams.subscribe(() => {
      fixture.detectChanges();
      expect(component.searchedWord).toBe('test');
      done();
    });
    fixture.detectChanges();
  });
});
