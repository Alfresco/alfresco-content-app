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
import { SaveSearchSidenavComponent } from './save-search-sidenav.component';
import { AppTestingModule } from '../../../../testing/app-testing.module';
import { EventEmitter } from '@angular/core';
import { Observable, of } from 'rxjs';
import { SavedSearchesContextService } from '../../../../services/saved-searches-context.service';
import { SavedSearch } from '@alfresco/adf-content-services';
import { NavBarLinkRef } from '@alfresco/adf-extensions';
import { TranslationService } from '@alfresco/adf-core';
import { LangChangeEvent } from '@ngx-translate/core';

interface TranslationServiceMock {
  instant: jasmine.Spy<(key: string) => string>;
  translate: {
    onLangChange: EventEmitter<LangChangeEvent>;
  };
}

describe('SaveSearchSidenavComponent', () => {
  let fixture: ComponentFixture<SaveSearchSidenavComponent>;
  let component: SaveSearchSidenavComponent;
  let savedSearchesService: SavedSearchesContextService;
  let translationServiceMock: TranslationServiceMock;
  const langChangeEmitter = new EventEmitter<LangChangeEvent>();

  beforeEach(() => {
    const mockService: Partial<SavedSearchesContextService> = {
      currentContextSavedSearch: undefined,
      init: (): void => {},
      get savedSearches$(): Observable<SavedSearch[]> {
        return of([]);
      }
    };

    translationServiceMock = {
      instant: jasmine.createSpy('instant').and.callFake((key: string) => key),
      translate: {
        onLangChange: langChangeEmitter
      }
    };

    TestBed.configureTestingModule({
      imports: [AppTestingModule, SaveSearchSidenavComponent],
      providers: [
        {
          provide: SavedSearchesContextService,
          useValue: mockService
        },
        {
          provide: TranslationService,
          useValue: translationServiceMock
        }
      ]
    });

    fixture = TestBed.createComponent(SaveSearchSidenavComponent);
    component = fixture.componentInstance;
    savedSearchesService = TestBed.inject(SavedSearchesContextService);
  });

  it('should set navbar object if no search is saved', async () => {
    spyOnProperty(savedSearchesService, 'savedSearches$', 'get').and.returnValue(of([]));
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

  it('should set navbar object with children if searches are saved', () => {
    spyOnProperty(savedSearchesService, 'savedSearches$', 'get').and.returnValue(of([{ name: '1', order: 0, encodedUrl: 'abc' }]));
    component.ngOnInit();
    fixture.detectChanges();

    expect(component.item.children[0]).toEqual({
      icon: '',
      title: '1',
      description: '1',
      route: 'search?q=abc',
      url: 'search?q=abc',
      id: 'search1'
    });
  });

  it('should update title when language changes', () => {
    spyOnProperty(savedSearchesService, 'savedSearches$', 'get').and.returnValue(of([{ name: '1', order: 0, encodedUrl: 'abc' }]));
    translationServiceMock.instant.and.returnValue('Translated Title (1)');

    component.ngOnInit();
    fixture.detectChanges();

    langChangeEmitter.emit({ lang: 'de', translations: {} });

    expect(component.item.title).toBe('Translated Title (1)');
  });

  describe('onActionClicked', () => {
    beforeEach(() => {
      spyOnProperty(savedSearchesService, 'savedSearches$', 'get').and.returnValue(of([{ name: 'abc', order: 0, encodedUrl: 'abc' }]));
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should set currentContextSavedSearch when matching saved search is found', () => {
      const selectedLinkRef: NavBarLinkRef = {
        id: 'search-test',
        icon: '',
        title: 'abc',
        description: 'test',
        route: 'search?q=encoded',
        url: 'search?q=encoded'
      };

      component.onActionClicked(selectedLinkRef);

      expect(component.savedSearchesService.currentContextSavedSearch).toEqual({
        name: 'abc',
        encodedUrl: 'abc',
        order: 0
      });
    });

    it('should set currentContextSavedSearch to undefined when no matching saved search is found', () => {
      const selectedLinkRef: NavBarLinkRef = {
        id: 'search-unknown',
        icon: '',
        title: 'Unknown Search',
        description: 'Unknown Search',
        route: 'search?q=unknown',
        url: 'search?q=unknown'
      };

      component.onActionClicked(selectedLinkRef);

      expect(component.savedSearchesService.currentContextSavedSearch).toBeUndefined();
    });
  });
});
