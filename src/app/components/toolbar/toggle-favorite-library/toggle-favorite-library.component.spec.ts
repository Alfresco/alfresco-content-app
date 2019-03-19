/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2019 Alfresco Software Limited
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

import { TestBed } from '@angular/core/testing';
import {
  CoreModule,
  AlfrescoApiService,
  AlfrescoApiServiceMock
} from '@alfresco/adf-core';
import { ToggleFavoriteLibraryComponent } from './toggle-favorite-library.component';
import { LibraryFavoriteDirective } from '../../../directives/library-favorite.directive';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppTestingModule } from '../../../testing/app-testing.module';
import { ContentManagementService } from '../../../services/content-management.service';
import { of } from 'rxjs';
import { Router } from '@angular/router';

describe('ToggleFavoriteLibraryComponent', () => {
  let fixture;
  let component;
  let contentManagementService;
  const selection = { library: { entry: { id: 'libraryId' } } };
  const mockRouter = {
    url: ''
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CoreModule.forRoot(), AppTestingModule],
      declarations: [ToggleFavoriteLibraryComponent, LibraryFavoriteDirective],
      providers: [
        {
          provide: Router,
          useValue: mockRouter
        },
        {
          provide: AlfrescoApiService,
          useClass: AlfrescoApiServiceMock
        },
        {
          provide: Store,
          useValue: {
            dispatch: () => {},
            select: () => of(selection)
          }
        },
        ContentManagementService
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ToggleFavoriteLibraryComponent);
    component = fixture.componentInstance;

    contentManagementService = TestBed.get(ContentManagementService);
    const api = TestBed.get(AlfrescoApiService);
    spyOn(api.peopleApi, 'getFavoriteSite').and.returnValue(Promise.resolve());
  });

  it('should get library selection from Store', done => {
    fixture.detectChanges();
    component.selection$.subscribe(selected => {
      expect(selected.library.entry.id).toEqual(selection.library.entry.id);
      done();
    });
  });

  it('should mark selection as favorite when on favorite libraries route', done => {
    mockRouter.url = '/favorite/libraries';
    fixture.detectChanges();

    component.selection$.subscribe(selected => {
      expect(selected.library.isFavorite).toBe(true);
      done();
    });
  });

  it('should emit onToggleEvent() event', () => {
    fixture.detectChanges();
    spyOn(contentManagementService.favoriteLibraryToggle, 'next');

    component.onToggleEvent();

    expect(
      contentManagementService.favoriteLibraryToggle.next
    ).toHaveBeenCalled();
  });
});
