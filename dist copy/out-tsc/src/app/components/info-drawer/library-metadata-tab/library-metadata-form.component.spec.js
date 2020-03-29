import * as tslib_1 from 'tslib';
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
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { UpdateLibraryAction } from '@alfresco/aca-shared/store';
import { AppTestingModule } from '../../../testing/app-testing.module';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AlfrescoApiService, AlfrescoApiServiceMock } from '@alfresco/adf-core';
describe('LibraryMetadataFormComponent', function() {
  var fixture;
  var component;
  var alfrescoApiService;
  var storeMock = {
    dispatch: jasmine.createSpy('dispatch')
  };
  beforeEach(function() {
    TestBed.configureTestingModule({
      imports: [AppTestingModule],
      declarations: [LibraryMetadataFormComponent],
      providers: [
        { provide: Store, useValue: storeMock },
        { provide: AlfrescoApiService, useClass: AlfrescoApiServiceMock }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(LibraryMetadataFormComponent);
    component = fixture.componentInstance;
    alfrescoApiService = TestBed.get(AlfrescoApiService);
  });
  afterEach(function() {
    storeMock.dispatch.calls.reset();
  });
  it('should initialize form with node data', function() {
    var siteEntryModel = {
      title: 'libraryTitle',
      description: 'description',
      visibility: 'PRIVATE'
    };
    component.node = {
      entry: tslib_1.__assign({ id: 'libraryId' }, siteEntryModel)
    };
    fixture.detectChanges();
    expect(component.form.value).toEqual(siteEntryModel);
  });
  it('should update form data when node data changes', function() {
    var siteEntryModel = {
      title: 'libraryTitle',
      description: 'description',
      visibility: 'PRIVATE'
    };
    var newSiteEntryModel = {
      title: 'libraryTitle2',
      description: 'description2',
      visibility: 'PUBLIC'
    };
    component.node = {
      entry: tslib_1.__assign({ id: 'libraryId' }, siteEntryModel)
    };
    fixture.detectChanges();
    expect(component.form.value).toEqual(siteEntryModel);
    component.node = {
      entry: tslib_1.__assign({ id: 'libraryId' }, newSiteEntryModel)
    };
    component.ngOnChanges();
    expect(component.form.value).toEqual(newSiteEntryModel);
  });
  it('should update library node if form is valid', function() {
    var siteEntryModel = {
      title: 'libraryTitle',
      description: 'description',
      visibility: 'PRIVATE'
    };
    component.node = {
      entry: tslib_1.__assign(
        { id: 'libraryId', role: 'SiteManager' },
        siteEntryModel
      )
    };
    fixture.detectChanges();
    component.update();
    expect(storeMock.dispatch).toHaveBeenCalledWith(
      new UpdateLibraryAction(siteEntryModel)
    );
  });
  it('should not update library node if it has no permission', function() {
    var siteEntryModel = {
      title: 'libraryTitle',
      description: 'description',
      visibility: 'PRIVATE'
    };
    component.node = {
      entry: tslib_1.__assign(
        { id: 'libraryId', role: 'Consumer' },
        siteEntryModel
      )
    };
    fixture.detectChanges();
    component.update();
    expect(storeMock.dispatch).not.toHaveBeenCalledWith(
      new UpdateLibraryAction(siteEntryModel)
    );
  });
  it('should not update library node if form is invalid', function() {
    var siteEntryModel = {
      title: 'libraryTitle',
      description: 'description',
      visibility: 'PRIVATE'
    };
    component.node = {
      entry: tslib_1.__assign(
        { id: 'libraryId', role: 'SiteManager' },
        siteEntryModel
      )
    };
    fixture.detectChanges();
    component.form.controls['title'].setErrors({ maxlength: true });
    component.update();
    expect(storeMock.dispatch).not.toHaveBeenCalledWith(
      new UpdateLibraryAction(siteEntryModel)
    );
  });
  it('should toggle edit mode', function() {
    component.edit = false;
    component.toggleEdit();
    expect(component.edit).toBe(true);
    component.toggleEdit();
    expect(component.edit).toBe(false);
  });
  it('should cancel from changes', function() {
    var siteEntryModel = {
      title: 'libraryTitle',
      description: 'description',
      visibility: 'PRIVATE'
    };
    component.node = {
      entry: tslib_1.__assign({ id: 'libraryId' }, siteEntryModel)
    };
    fixture.detectChanges();
    expect(component.form.value).toEqual(siteEntryModel);
    component.form.controls.title.setValue('libraryTitle-edit');
    expect(component.form.value.title).toBe('libraryTitle-edit');
    component.cancel();
    expect(component.form.value).toEqual(siteEntryModel);
  });
  it('should warn if library name input is used by another library', fakeAsync(function() {
    var title = 'some-title';
    spyOn(
      alfrescoApiService.getInstance().core.queriesApi,
      'findSites'
    ).and.returnValue(
      Promise.resolve({
        list: { entries: [{ entry: { title: title } }] }
      })
    );
    var siteEntryModel = {
      title: 'libraryTitle',
      description: 'description',
      visibility: 'PRIVATE'
    };
    component.node = {
      entry: tslib_1.__assign({ id: 'libraryId' }, siteEntryModel)
    };
    fixture.detectChanges();
    component.form.controls.title.setValue(title);
    fixture.detectChanges();
    tick(500);
    expect(component.libraryTitleExists).toBe(true);
  }));
  it('should not warn if library name input is the same with library node data', fakeAsync(function() {
    spyOn(
      alfrescoApiService.getInstance().core.queriesApi,
      'findSites'
    ).and.returnValue(
      Promise.resolve({
        list: { entries: [{ entry: { title: 'libraryTitle' } }] }
      })
    );
    var siteEntryModel = {
      title: 'libraryTitle',
      description: 'description',
      visibility: 'PRIVATE'
    };
    component.node = {
      entry: tslib_1.__assign({ id: 'libraryId' }, siteEntryModel)
    };
    fixture.detectChanges();
    component.form.controls.title.setValue('libraryTitle');
    fixture.detectChanges();
    tick(500);
    expect(component.libraryTitleExists).toBe(false);
  }));
  it('should not warn if library name is unique', fakeAsync(function() {
    spyOn(
      alfrescoApiService.getInstance().core.queriesApi,
      'findSites'
    ).and.returnValue(
      Promise.resolve({
        list: { entries: [] }
      })
    );
    var siteEntryModel = {
      title: 'libraryTitle',
      description: 'description',
      visibility: 'PRIVATE'
    };
    component.node = {
      entry: tslib_1.__assign({ id: 'libraryId' }, siteEntryModel)
    };
    fixture.detectChanges();
    component.form.controls.title.setValue('some-name');
    fixture.detectChanges();
    tick(500);
    expect(component.libraryTitleExists).toBe(false);
  }));
});
//# sourceMappingURL=library-metadata-form.component.spec.js.map
