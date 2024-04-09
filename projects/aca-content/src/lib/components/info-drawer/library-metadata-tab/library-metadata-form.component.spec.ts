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

import { LibraryMetadataFormComponent } from './library-metadata-form.component';
import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { SnackbarAction, SnackbarErrorAction, SnackbarInfoAction, UpdateLibraryAction } from '@alfresco/aca-shared/store';
import { AppTestingModule } from '../../../testing/app-testing.module';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Site, SiteBodyCreate, SitePaging } from '@alfresco/js-api';
import { Actions } from '@ngrx/effects';
import { of, Subject } from 'rxjs';

describe('LibraryMetadataFormComponent', () => {
  let fixture: ComponentFixture<LibraryMetadataFormComponent>;
  let component: LibraryMetadataFormComponent;
  let store: Store<any>;
  let actions$: Subject<SnackbarAction>;
  let siteEntryModel: SiteBodyCreate;

  beforeEach(() => {
    actions$ = new Subject<SnackbarAction>();
    TestBed.configureTestingModule({
      imports: [AppTestingModule, LibraryMetadataFormComponent],
      providers: [
        {
          provide: Actions,
          useValue: actions$
        },
        {
          provide: Store,
          useValue: {
            dispatch: jasmine.createSpy('dispatch'),
            select: () => of()
          }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });

    store = TestBed.inject(Store);

    fixture = TestBed.createComponent(LibraryMetadataFormComponent);
    component = fixture.componentInstance;
    siteEntryModel = {
      title: 'libraryTitle',
      description: 'description',
      visibility: Site.VisibilityEnum.PRIVATE
    };
    component.node = {
      entry: {
        id: 'libraryId',
        ...siteEntryModel
      } as Site
    };
  });

  it('should initialize form with node data', () => {
    fixture.detectChanges();
    component.toggleEdit();

    expect(component.form.value).toEqual(siteEntryModel);
  });

  it('should update form data and properties when node data changes', () => {
    const newSiteEntryModel = {
      title: 'libraryTitle2',
      description: 'description2',
      visibility: 'PUBLIC'
    };

    fixture.detectChanges();
    component.toggleEdit();

    expect(component.form.value).toEqual(siteEntryModel);
    expect(component.canUpdateLibrary).toBeFalse();

    component.node = {
      entry: {
        id: 'libraryId',
        role: 'SiteManager',
        ...newSiteEntryModel
      } as Site
    };

    component.ngOnChanges();

    expect(component.form.value).toEqual(newSiteEntryModel);
    expect(component.canUpdateLibrary).toBeTrue();
  });

  it('should assign form value to node entry if updating of form is finished with success', () => {
    const entry = {
      id: 'libraryId',
      title: 'some different title',
      description: 'some different description',
      visibility: Site.VisibilityEnum.PUBLIC
    } as Site;
    component.ngOnInit();
    component.form.setValue(entry);

    actions$.next(new SnackbarInfoAction('LIBRARY.SUCCESS.LIBRARY_UPDATED'));
    expect(component.node.entry).toEqual(jasmine.objectContaining(entry));
  });

  it('should not assign form value to node entry if info snackbar was displayed for different action than updating library', () => {
    const entry = {
      id: 'libraryId',
      title: 'some different title',
      description: 'some different description',
      visibility: Site.VisibilityEnum.PUBLIC
    } as Site;
    component.ngOnInit();
    component.form.setValue(entry);

    actions$.next(new SnackbarInfoAction('Some different action'));
    expect(component.node.entry).not.toEqual(jasmine.objectContaining(entry));
  });

  it('should call markAsDirty on form if updating of form is finished with error', () => {
    component.node = {
      entry: {
        id: 'libraryId',
        role: 'SiteManager',
        title: 'libraryTitle',
        description: 'description',
        visibility: Site.VisibilityEnum.PRIVATE
      } as Site
    };
    component.ngOnInit();
    spyOn(component.form, 'markAsDirty');

    actions$.next(new SnackbarErrorAction('LIBRARY.ERRORS.LIBRARY_UPDATE_ERROR'));
    expect(component.form.markAsDirty).toHaveBeenCalled();
  });

  it('should not call markAsDirty on form if error snackbar was displayed for different action than updating library', () => {
    component.ngOnInit();
    spyOn(component.form, 'markAsDirty');

    actions$.next(new SnackbarErrorAction('Some different action'));
    expect(component.form.markAsDirty).not.toHaveBeenCalled();
  });

  it('should update library node if form is valid', () => {
    component.node.entry.role = Site.RoleEnum.SiteManager;

    fixture.detectChanges();
    component.toggleEdit();

    component.update();

    expect(store.dispatch).toHaveBeenCalledWith(new UpdateLibraryAction(siteEntryModel));
  });

  it('should update library node with trimmed title', () => {
    component.node.entry.role = Site.RoleEnum.SiteManager;
    siteEntryModel.title = '   some title    ';
    component.node.entry.title = siteEntryModel.title;
    component.ngOnInit();
    component.toggleEdit();

    component.update();
    expect(store.dispatch).toHaveBeenCalledWith(
      new UpdateLibraryAction({
        ...siteEntryModel,
        title: siteEntryModel.title.trim()
      })
    );
  });

  it('should call markAsPristine on form when updating valid form and has permission to update', () => {
    component.node.entry.role = Site.RoleEnum.SiteManager;
    spyOn(component.form, 'markAsPristine');
    component.ngOnInit();
    component.toggleEdit();

    component.update();
    expect(component.form.markAsPristine).toHaveBeenCalled();
  });

  it('should not update library node if it has no permission', () => {
    component.node.entry.role = Site.RoleEnum.SiteConsumer;

    fixture.detectChanges();
    component.toggleEdit();

    component.update();

    expect(store.dispatch).not.toHaveBeenCalledWith(new UpdateLibraryAction(siteEntryModel));
  });

  it('should update library node when the user is an admin but has consumer rights', () => {
    component.node.entry.role = Site.RoleEnum.SiteConsumer;
    component.isAdmin = true;

    fixture.detectChanges();
    component.toggleEdit();

    component.update();

    expect(store.dispatch).toHaveBeenCalledWith(new UpdateLibraryAction(siteEntryModel));
  });

  it('should not call markAsPristine on form when updating valid form but has not permission to update', () => {
    component.node.entry.role = Site.RoleEnum.SiteConsumer;
    spyOn(component.form, 'markAsPristine');
    component.ngOnInit();
    component.toggleEdit();

    component.update();
    expect(component.form.markAsPristine).not.toHaveBeenCalled();
  });

  it('should not update library node if form is invalid', () => {
    component.node.entry.role = Site.RoleEnum.SiteManager;

    fixture.detectChanges();
    component.toggleEdit();

    component.form.controls['title'].setErrors({ maxlength: true });

    component.update();

    expect(store.dispatch).not.toHaveBeenCalledWith(new UpdateLibraryAction(siteEntryModel));
  });

  it('should not call markAsPristine on form when updating invalid form and has permission to update', () => {
    component.node.entry.role = Site.RoleEnum.SiteManager;
    spyOn(component.form, 'markAsPristine');
    spyOnProperty(component.form, 'valid').and.returnValue(false);
    component.ngOnInit();
    component.toggleEdit();

    component.update();
    expect(component.form.markAsPristine).not.toHaveBeenCalled();
  });

  it('should disable form after calling toggleEdit if form was enabled', () => {
    spyOn(component.form, 'disable');

    component.toggleEdit();
    expect(component.form.disable).toHaveBeenCalledWith({
      emitEvent: false
    });
  });

  it('should enable form without id field after calling toggleEdit if form was disabled', () => {
    component.toggleEdit();
    spyOn(component.form, 'enable');
    spyOn(component.form.controls.id, 'disable');

    component.toggleEdit();
    expect(component.form.enable).toHaveBeenCalledWith({
      emitEvent: false
    });
    expect(component.form.controls.id.disable).toHaveBeenCalled();
  });

  it('should cancel from changes', () => {
    fixture.detectChanges();
    component.toggleEdit();

    expect(component.form.value).toEqual(siteEntryModel);

    component.form.controls.title.setValue('libraryTitle-edit');

    expect(component.form.value.title).toBe('libraryTitle-edit');

    component.cancel();
    component.toggleEdit();

    expect(component.form.value).toEqual(siteEntryModel);
  });

  it('should call markAsPristine on form when cancelled', () => {
    spyOn(component.form, 'markAsPristine');

    component.cancel();
    expect(component.form.markAsPristine).toHaveBeenCalled();
  });

  it('should warn if library name input is used by another library', fakeAsync(() => {
    const title = 'some-title';
    spyOn(component['queriesApi'], 'findSites').and.returnValue(
      Promise.resolve({
        list: { entries: [{ entry: { title } }] }
      } as SitePaging)
    );

    fixture.detectChanges();
    component.form.controls.title.setValue(title);
    fixture.detectChanges();

    tick(500);
    expect(component.libraryTitleExists).toBe(true);
  }));

  it('should call findSites on queriesApi with trimmed title', fakeAsync(() => {
    const title = '    test   ';
    spyOn(component.queriesApi, 'findSites').and.returnValue(
      Promise.resolve({
        list: { entries: [{ entry: { title } }] }
      } as SitePaging)
    );
    component.ngOnInit();

    component.form.controls.title.setValue(title);
    tick(300);
    expect(component.queriesApi.findSites).toHaveBeenCalledWith(title.trim(), {
      maxItems: 1,
      fields: ['title']
    });
  }));

  it('should not warn if library name input is the same with library node data', fakeAsync(() => {
    spyOn(component['queriesApi'], 'findSites').and.returnValue(
      Promise.resolve({
        list: { entries: [{ entry: { title: 'libraryTitle' } }] }
      } as SitePaging)
    );

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

    fixture.detectChanges();
    component.form.controls.title.setValue('some-name');
    fixture.detectChanges();

    tick(500);
    expect(component.libraryTitleExists).toBe(false);
  }));

  it('should set proper titleErrorTranslationKey when there is error for empty title', () => {
    component.ngOnInit();
    component.toggleEdit();

    component.form.controls.title.setValue('     ');
    expect(component.titleErrorTranslationKey).toBe('LIBRARY.ERRORS.ONLY_SPACES');
  });

  it('should set proper titleErrorTranslationKey when there is error for too long title', () => {
    component.ngOnInit();

    component.form.controls.title.setValue('t'.repeat(257));
    expect(component.titleErrorTranslationKey).toBe('LIBRARY.ERRORS.TITLE_TOO_LONG_OR_MISSING');
  });

  it('should set proper titleErrorTranslationKey when there is error for missing title', () => {
    component.ngOnInit();

    component.form.controls.title.setValue('');
    expect(component.titleErrorTranslationKey).toBe('LIBRARY.ERRORS.TITLE_TOO_LONG_OR_MISSING');
  });
});
