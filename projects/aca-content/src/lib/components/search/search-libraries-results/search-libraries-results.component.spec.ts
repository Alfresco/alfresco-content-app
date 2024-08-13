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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppTestingModule } from '../../../testing/app-testing.module';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { SearchLibrariesResultsComponent } from './search-libraries-results.component';
import { SearchLibrariesQueryBuilderService } from './search-libraries-query-builder.service';
import { BehaviorSubject, Subject } from 'rxjs';
import { AppService } from '@alfresco/aca-shared';

describe('SearchLibrariesResultsComponent', () => {
  let component: SearchLibrariesResultsComponent;
  let fixture: ComponentFixture<SearchLibrariesResultsComponent>;

  const emptyPage = { list: { pagination: { totalItems: 0 }, entries: [] } };
  const appServiceMock = {
    appNavNarMode$: new BehaviorSubject('collapsed'),
    toggleAppNavBar$: new Subject(),
    setAppNavbarMode: jasmine.createSpy('setAppNavbarMode')
  };

  beforeEach(() => {
    appServiceMock.setAppNavbarMode.calls.reset();
    TestBed.configureTestingModule({
      imports: [AppTestingModule, SearchLibrariesResultsComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        {
          provide: AppService,
          useValue: appServiceMock
        },
        SearchLibrariesQueryBuilderService
      ]
    });

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
});
