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
import { SaveSearchSidenavComponent } from './save-search-sidenav.component';
import { SavedSearchesService } from '@alfresco/adf-content-services';
import { AppTestingModule } from '../../../../testing/app-testing.module';
import { of, ReplaySubject } from 'rxjs';

describe('SaveSearchSidenavComponent', () => {
  let fixture: ComponentFixture<SaveSearchSidenavComponent>;
  let component: SaveSearchSidenavComponent;
  let savedSearchesService: SavedSearchesService;

  beforeEach(() => {
    const mockService = {
      init: () => {},
      getSavedSearches: () => of(),
      savedSearches$: new ReplaySubject(1)
    };
    TestBed.configureTestingModule({
      imports: [AppTestingModule, SaveSearchSidenavComponent],
      providers: [
        {
          provide: SavedSearchesService,
          useValue: mockService
        }
      ]
    });

    fixture = TestBed.createComponent(SaveSearchSidenavComponent);
    component = fixture.componentInstance;
    savedSearchesService = TestBed.inject(SavedSearchesService);
  });

  it('should set navbar object if no search is saved', async () => {
    Object.defineProperty(savedSearchesService, 'savedSearches$', {
      value: of([]),
      writable: true,
      configurable: true
    });
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.item).toEqual({
      icon: '',
      title: 'APP.BROWSE.SEARCH.SAVE_SEARCH.NAVBAR.TITLE',
      children: [
        {
          id: 'manage-saved-searches',
          icon: '',
          title: 'APP.BROWSE.SEARCH.SAVE_SEARCH.NAVBAR.MANAGE_BUTTON',
          description: 'APP.BROWSE.SEARCH.SAVE_SEARCH.NAVBAR.MANAGE_BUTTON',
          route: 'saved-searches',
          url: 'saved-searches'
        }
      ],
      route: '/',
      id: 'search-navbar'
    });
  });

  it('should set navbar object with children is searches are saved', fakeAsync(() => {
    Object.defineProperty(savedSearchesService, 'savedSearches$', {
      value: of([{ name: '1', order: 0, encodedUrl: 'abc' }]),
      writable: true,
      configurable: true
    });
    component.ngOnInit();
    fixture.detectChanges();
    tick(100);
    expect(component.item.children[0]).toEqual({
      icon: '',
      title: '1',
      description: '1',
      route: 'search?q=abc',
      url: 'search?q=abc',
      id: 'search1'
    });
  }));
});
