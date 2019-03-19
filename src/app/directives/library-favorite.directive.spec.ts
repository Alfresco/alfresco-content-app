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

import { Component, ViewChild } from '@angular/core';
import { LibraryFavoriteDirective } from './library-favorite.directive';
import {
  AlfrescoApiService,
  AlfrescoApiServiceMock,
  setupTestBed,
  CoreModule
} from '@alfresco/adf-core';
import { TestBed, async } from '@angular/core/testing';

@Component({
  selector: 'app-test-component',
  template: `
    <button
      #favoriteLibrary="favoriteLibrary"
      [acaFavoriteLibrary]="selection"
    ></button>
  `
})
class TestComponent {
  @ViewChild('favoriteLibrary')
  directive: LibraryFavoriteDirective;

  selection = null;
}

describe('LibraryFavoriteDirective', () => {
  let fixture;
  let api;
  let component;
  let selection;

  setupTestBed({
    imports: [CoreModule.forRoot()],
    declarations: [TestComponent, LibraryFavoriteDirective],
    providers: [
      {
        provide: AlfrescoApiService,
        useClass: AlfrescoApiServiceMock
      }
    ]
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    api = TestBed.get(AlfrescoApiService);
    selection = { entry: { guid: 'guid', id: 'id' } };
  });

  it('should not check for favorite if no selection exists', () => {
    spyOn(api.peopleApi, 'getFavoriteSite');
    fixture.detectChanges();

    expect(api.peopleApi.getFavoriteSite).not.toHaveBeenCalled();
  });

  it('should mark selection as favorite when getFavoriteSite returns successfully', async(() => {
    spyOn(api.peopleApi, 'getFavoriteSite').and.returnValue(Promise.resolve());
    component.selection = selection;
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      expect(api.peopleApi.getFavoriteSite).toHaveBeenCalled();
      expect(component.directive.isFavorite()).toBe(true);
    });
  }));

  it('should mark selection not favorite when getFavoriteSite errors', async(() => {
    spyOn(api.peopleApi, 'getFavoriteSite').and.returnValue(Promise.reject());
    component.selection = selection;
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      expect(api.peopleApi.getFavoriteSite).toHaveBeenCalled();
      expect(component.directive.isFavorite()).toBe(false);
    });
  }));

  it('should call addFavorite() on click event when selection is not a favorite', async(() => {
    spyOn(api.peopleApi, 'getFavoriteSite').and.returnValue(Promise.reject());
    spyOn(api.peopleApi, 'addFavorite').and.returnValue(Promise.resolve());
    component.selection = selection;
    fixture.detectChanges();

    expect(component.directive.isFavorite()).toBeFalsy();

    fixture.whenStable().then(() => {
      fixture.nativeElement
        .querySelector('button')
        .dispatchEvent(new MouseEvent('click'));

      fixture.detectChanges();

      expect(api.peopleApi.addFavorite).toHaveBeenCalled();
    });
  }));

  it('should call removeFavoriteSite() on click event when selection is not a favorite', async(() => {
    spyOn(api.peopleApi, 'getFavoriteSite').and.returnValue(Promise.resolve());
    spyOn(api.favoritesApi, 'removeFavoriteSite').and.returnValue(
      Promise.resolve()
    );
    component.selection = selection;
    fixture.detectChanges();

    expect(component.directive.isFavorite()).toBeFalsy();

    fixture.whenStable().then(() => {
      fixture.nativeElement
        .querySelector('button')
        .dispatchEvent(new MouseEvent('click'));

      fixture.detectChanges();

      expect(api.favoritesApi.removeFavoriteSite).toHaveBeenCalled();
    });
  }));
});
