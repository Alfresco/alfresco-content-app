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
import { LibrariesComponent } from './libraries.component';
import { AppTestingModule } from '../../testing/app-testing.module';
import { provideEffects } from '@ngrx/effects';
import { LibraryEffects } from '../../store/effects';
import { AppExtensionService, AppHookService, ContentApiService } from '@alfresco/aca-shared';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { libraryColumnsPresetMock, librariesMock } from '../../mock/libraries-mock';

describe('LibrariesComponent', () => {
  let fixture: ComponentFixture<LibrariesComponent>;
  let component: LibrariesComponent;
  let contentApiService: ContentApiService;
  let appHookService: AppHookService;
  let appExtensionService: AppExtensionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule, LibrariesComponent, MatSnackBarModule],
      providers: [provideEffects([LibraryEffects])]
    });

    fixture = TestBed.createComponent(LibrariesComponent);
    component = fixture.componentInstance;

    contentApiService = TestBed.inject(ContentApiService);
    appHookService = TestBed.inject(AppHookService);
    appExtensionService = TestBed.inject(AppExtensionService);

    const sitesApi = contentApiService.sitesApi;

    spyOn(sitesApi, 'listSites').and.returnValue(Promise.resolve(librariesMock));
    spyOn(sitesApi, 'listSiteMembershipsForPerson').and.returnValue(Promise.resolve({}));
  });

  it('should set columns from extensions on init', () => {
    appExtensionService.documentListPresets.libraries = libraryColumnsPresetMock;
    fixture.detectChanges();
    expect(component.columns).toEqual(appExtensionService.documentListPresets.libraries);
  });

  it('should handle no columns preset in extensions', () => {
    appExtensionService.documentListPresets.libraries = undefined;
    component.ngOnInit();
    expect(component.columns.length).toBe(0);
  });

  describe('Library hooks', () => {
    let reloadSpy: jasmine.Spy<() => void>;

    beforeEach(() => {
      reloadSpy = spyOn(component, 'reload');
      fixture.detectChanges();
    });

    it('should reload on libraryDeleted hook', () => {
      appHookService.libraryDeleted.next('');
      expect(reloadSpy).toHaveBeenCalled();
    });

    it('should reload on libraryUpdated hook', () => {
      appHookService.libraryUpdated.next(librariesMock.list.entries[0]);
      expect(reloadSpy).toHaveBeenCalled();
    });

    it('should reload on libraryLeft hook', () => {
      appHookService.libraryLeft.next('');
      expect(reloadSpy).toHaveBeenCalled();
    });
  });
});
