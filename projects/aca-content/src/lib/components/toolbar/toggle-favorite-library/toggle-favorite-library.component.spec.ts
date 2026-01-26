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
import { ToggleFavoriteLibraryComponent } from './toggle-favorite-library.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppTestingModule } from '../../../testing/app-testing.module';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { AppHookService, ContentApiService } from '@alfresco/aca-shared';
import { UnitTestingUtils } from '@alfresco/adf-core';

describe('ToggleFavoriteLibraryComponent', () => {
  let fixture: ComponentFixture<ToggleFavoriteLibraryComponent>;
  let component: ToggleFavoriteLibraryComponent;
  let appHookService: AppHookService;
  let contentApiService: any;
  let unitTestingUtils: UnitTestingUtils;

  const selection = { library: { entry: { id: 'libraryId' } } };
  const mockRouter = {
    url: ''
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule, ToggleFavoriteLibraryComponent],
      providers: [
        {
          provide: Router,
          useValue: mockRouter
        },
        {
          provide: Store,
          useValue: {
            dispatch: () => {},
            select: () => of(selection)
          }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ToggleFavoriteLibraryComponent);
    component = fixture.componentInstance;
    contentApiService = TestBed.inject(ContentApiService);
    unitTestingUtils = new UnitTestingUtils(fixture.debugElement);

    appHookService = TestBed.inject(AppHookService);
    spyOn(contentApiService['favoritesApi'], 'getFavoriteSite').and.returnValue(Promise.resolve(null));
  });

  it('should get library selection from Store', async () => {
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.library.entry.id).toEqual(selection.library.entry.id);
  });

  it('should mark selection as favorite when on favorite libraries route', async () => {
    mockRouter.url = '/favorite/libraries';
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.library.isFavorite).toBe(true);
  });

  it('should emit onToggleEvent() event', fakeAsync(() => {
    spyOn(appHookService.favoriteLibraryToggle, 'next');

    component.onToggleEvent();
    tick(100);

    expect(appHookService.favoriteLibraryToggle.next).toHaveBeenCalled();
  }));

  it('should focus element on toggle when focusAfterClosed is provided', () => {
    const mockElement = jasmine.createSpyObj<HTMLElement>('HTMLElement', ['focus']);
    spyOn(document, 'querySelector').and.returnValue(mockElement);

    component.data = { focusAfterClosed: '.adf-context-menu-source' };
    const button = unitTestingUtils.getByCSS('button');
    button.triggerEventHandler('toggle', new CustomEvent('toggle'));

    expect(document.querySelector).toHaveBeenCalledWith('.adf-context-menu-source');
    expect(mockElement.focus).toHaveBeenCalled();
  });
});
