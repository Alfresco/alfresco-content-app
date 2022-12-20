/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2020 Alfresco Software Limited
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
import { LibraryMetadataFormComponent } from './library-metadata-form.component';
import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { UpdateLibraryAction } from '@alfresco/aca-shared/store';
import { AppTestingModule } from '../../../testing/app-testing.module';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Site, SitePaging } from '@alfresco/js-api';

describe('LibraryMetadataFormComponent', () => {
  let fixture: ComponentFixture<LibraryMetadataFormComponent>;
  let component: LibraryMetadataFormComponent;
  let store: Store<any>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule],
      declarations: [LibraryMetadataFormComponent],
      providers: [
        {
          provide: Store,
          useValue: {
            dispatch: jasmine.createSpy('dispatch')
          }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });

    store = TestBed.inject(Store);

    fixture = TestBed.createComponent(LibraryMetadataFormComponent);
    component = fixture.componentInstance;
  });

  it('should initialize form with node data', () => {
    const siteEntryModel = {
      title: 'libraryTitle',
      description: 'description',
      visibility: 'PRIVATE'
    };
    component.node = {
      entry: {
        id: 'libraryId',
        ...siteEntryModel
      } as Site
    };
    fixture.detectChanges();

    expect(component.form.value).toEqual(siteEntryModel);
  });

  it('should update form data when node data changes', () => {
    const siteEntryModel = {
      title: 'libraryTitle',
      description: 'description',
      visibility: 'PRIVATE'
    };

    const newSiteEntryModel = {
      title: 'libraryTitle2',
      description: 'description2',
      visibility: 'PUBLIC'
    };

    component.node = {
      entry: {
        id: 'libraryId',
        ...siteEntryModel
      } as Site
    };

    fixture.detectChanges();

    expect(component.form.value).toEqual(siteEntryModel);

    component.node = {
      entry: {
        id: 'libraryId',
        ...newSiteEntryModel
      } as Site
    };

    component.ngOnChanges();

    expect(component.form.value).toEqual(newSiteEntryModel);
  });

  it('should update library node if form is valid', () => {
    const siteEntryModel = {
      title: 'libraryTitle',
      description: 'description',
      visibility: 'PRIVATE'
    };
    component.node = {
      entry: {
        id: 'libraryId',
        role: 'SiteManager',
        ...siteEntryModel
      } as Site
    };

    fixture.detectChanges();

    component.update();

    expect(store.dispatch).toHaveBeenCalledWith(new UpdateLibraryAction(siteEntryModel));
  });

  it('should not update library node if it has no permission', () => {
    const siteEntryModel = {
      title: 'libraryTitle',
      description: 'description',
      visibility: 'PRIVATE'
    };
    component.node = {
      entry: {
        id: 'libraryId',
        role: 'Consumer',
        ...siteEntryModel
      } as Site
    };

    fixture.detectChanges();

    component.update();

    expect(store.dispatch).not.toHaveBeenCalledWith(new UpdateLibraryAction(siteEntryModel));
  });

  it('should not update library node if form is invalid', () => {
    const siteEntryModel = {
      title: 'libraryTitle',
      description: 'description',
      visibility: 'PRIVATE'
    };
    component.node = {
      entry: {
        id: 'libraryId',
        role: 'SiteManager',
        ...siteEntryModel
      } as Site
    };

    fixture.detectChanges();

    component.form.controls['title'].setErrors({ maxlength: true });

    component.update();

    expect(store.dispatch).not.toHaveBeenCalledWith(new UpdateLibraryAction(siteEntryModel));
  });

  it('should toggle edit mode', () => {
    component.edit = false;

    component.toggleEdit();
    expect(component.edit).toBe(true);

    component.toggleEdit();
    expect(component.edit).toBe(false);
  });

  it('should cancel from changes', () => {
    const siteEntryModel = {
      title: 'libraryTitle',
      description: 'description',
      visibility: 'PRIVATE'
    };
    component.node = {
      entry: {
        id: 'libraryId',
        ...siteEntryModel
      } as Site
    };
    fixture.detectChanges();

    expect(component.form.value).toEqual(siteEntryModel);

    component.form.controls.title.setValue('libraryTitle-edit');

    expect(component.form.value.title).toBe('libraryTitle-edit');

    component.cancel();

    expect(component.form.value).toEqual(siteEntryModel);
  });

  it('should warn if library name input is used by another library', fakeAsync(() => {
    const title = 'some-title';
    spyOn(component['queriesApi'], 'findSites').and.returnValue(
      Promise.resolve({
        list: { entries: [{ entry: { title } }] }
      } as SitePaging)
    );

    const siteEntryModel = {
      title: 'libraryTitle',
      description: 'description',
      visibility: 'PRIVATE'
    };

    component.node = {
      entry: {
        id: 'libraryId',
        ...siteEntryModel
      } as Site
    };

    fixture.detectChanges();
    component.form.controls.title.setValue(title);
    fixture.detectChanges();

    tick(500);
    expect(component.libraryTitleExists).toBe(true);
  }));

  it('should not warn if library name input is the same with library node data', fakeAsync(() => {
    spyOn(component['queriesApi'], 'findSites').and.returnValue(
      Promise.resolve({
        list: { entries: [{ entry: { title: 'libraryTitle' } }] }
      } as SitePaging)
    );

    const siteEntryModel = {
      title: 'libraryTitle',
      description: 'description',
      visibility: 'PRIVATE'
    };

    component.node = {
      entry: {
        id: 'libraryId',
        ...siteEntryModel
      } as Site
    };

    fixture.detectChanges();
    component.form.controls.title.setValue('libraryTitle');
    fixture.detectChanges();

    tick(500);
    expect(component.libraryTitleExists).toBe(false);
  }));

  it('should not warn if library name is unique', fakeAsync(() => {
    spyOn(component['queriesApi'], 'findSites').and.returnValue(
      Promise.resolve({
        list: { entries: [] }
      } as SitePaging)
    );

    const siteEntryModel = {
      title: 'libraryTitle',
      description: 'description',
      visibility: 'PRIVATE'
    };

    component.node = {
      entry: {
        id: 'libraryId',
        ...siteEntryModel
      } as Site
    };

    fixture.detectChanges();
    component.form.controls.title.setValue('some-name');
    fixture.detectChanges();

    tick(500);
    expect(component.libraryTitleExists).toBe(false);
  }));
});
