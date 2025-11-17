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

import { LibraryMetadataFormComponent } from './library-metadata-form.component';
import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { UpdateLibraryAction } from '@alfresco/aca-shared/store';
import { AppHookService } from '@alfresco/aca-shared';
import { AppTestingModule } from '../../../testing/app-testing.module';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Site, SiteBodyCreate, SiteEntry, SitePaging } from '@alfresco/js-api';
import { of, Subject } from 'rxjs';
import { UnitTestingUtils } from '@alfresco/adf-core';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';

describe('LibraryMetadataFormComponent', () => {
  let fixture: ComponentFixture<LibraryMetadataFormComponent>;
  let component: LibraryMetadataFormComponent;
  let store: Store<any>;
  let siteEntryModel: SiteBodyCreate;
  let appHookService: AppHookService;
  let unitTestingUtils: UnitTestingUtils;

  const getNameInput = (): HTMLInputElement => unitTestingUtils.getInputByDataAutomationId('app-library-metadata-form-name-input');

  const clickEditButton = (): Promise<void> => unitTestingUtils.clickMatButtonByDataAutomationId('app-library-metadata-form-edit-button');

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule, LibraryMetadataFormComponent],
      providers: [
        {
          provide: AppHookService,
          useValue: {
            libraryUpdated: new Subject<SiteEntry>(),
            libraryUpdateFailed: new Subject<void>()
          }
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

    appHookService = TestBed.inject(AppHookService);
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
    unitTestingUtils = new UnitTestingUtils(fixture.debugElement, TestbedHarnessEnvironment.loader(fixture));
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

    appHookService.libraryUpdated.next({ entry: entry } as SiteEntry);
    expect(component.node.entry).toEqual(jasmine.objectContaining(entry));
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

    appHookService.libraryUpdateFailed.next();
    expect(component.form.markAsDirty).toHaveBeenCalled();
  });

  it('should update library node if form is valid', () => {
    component.node.entry.role = Site.RoleEnum.SiteManager;

    fixture.detectChanges();
    component.toggleEdit();

    component.update();

    expect(store.dispatch).toHaveBeenCalledWith(jasmine.objectContaining({ ...new UpdateLibraryAction(siteEntryModel) }));
  });

  it('should update library node with trimmed title', () => {
    component.node.entry.role = Site.RoleEnum.SiteManager;
    siteEntryModel.title = '   some title    ';
    component.node.entry.title = siteEntryModel.title;
    fixture.detectChanges();
    component.toggleEdit();

    component.update();
    expect(store.dispatch).toHaveBeenCalledWith(
      jasmine.objectContaining({
        ...new UpdateLibraryAction({
          ...siteEntryModel,
          title: siteEntryModel.title.trim()
        })
      })
    );
  });

  it('should call markAsPristine on form when updating valid form and has permission to update', () => {
    component.node.entry.role = Site.RoleEnum.SiteManager;
    spyOn(component.form, 'markAsPristine');
    fixture.detectChanges();
    component.toggleEdit();

    component.update();
    expect(component.form.markAsPristine).toHaveBeenCalled();
  });

  it('should not update library node if it has no permission', () => {
    component.node.entry.role = Site.RoleEnum.SiteConsumer;

    fixture.detectChanges();
    component.toggleEdit();

    component.update();

    expect(store.dispatch).not.toHaveBeenCalledWith(jasmine.objectContaining({ ...new UpdateLibraryAction(siteEntryModel) }));
  });

  it('should update library node when the user is an admin but has consumer rights', () => {
    component.node.entry.role = Site.RoleEnum.SiteConsumer;
    component.isAdmin = true;

    fixture.detectChanges();
    component.toggleEdit();

    component.update();

    expect(store.dispatch).toHaveBeenCalledWith(jasmine.objectContaining({ ...new UpdateLibraryAction(siteEntryModel) }));
  });

  it('should not call markAsPristine on form when updating valid form but has not permission to update', () => {
    component.node.entry.role = Site.RoleEnum.SiteConsumer;
    spyOn(component.form, 'markAsPristine');
    fixture.detectChanges();
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

    expect(store.dispatch).not.toHaveBeenCalledWith(jasmine.objectContaining({ ...new UpdateLibraryAction(siteEntryModel) }));
  });

  it('should not call markAsPristine on form when updating invalid form and has permission to update', () => {
    component.node.entry.role = Site.RoleEnum.SiteManager;
    spyOn(component.form, 'markAsPristine');
    spyOnProperty(component.form, 'valid').and.returnValue(false);
    fixture.detectChanges();
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
    fixture.detectChanges();
    spyOn(component.form, 'enable');
    spyOn(component.form.controls.id, 'disable');

    component.toggleEdit();
    expect(component.form.enable).toHaveBeenCalledWith({
      emitEvent: false
    });
    expect(component.form.controls.id.disable).toHaveBeenCalled();
  });

  it('should call focus on name input after clicking on edit button', async () => {
    component.node.entry.role = Site.RoleEnum.SiteManager;
    fixture.detectChanges();
    const nameInput = getNameInput();
    spyOn(nameInput, 'focus');

    await clickEditButton();
    expect(nameInput.focus).toHaveBeenCalled();
  });

  it('should not call focus on name input after clicking on cancel button', async () => {
    component.node.entry.role = Site.RoleEnum.SiteManager;
    fixture.detectChanges();
    await clickEditButton();
    const nameInput = getNameInput();
    spyOn(nameInput, 'focus');

    await unitTestingUtils.clickMatButtonByDataAutomationId('app-library-metadata-form-cancel-button');
    expect(nameInput.focus).not.toHaveBeenCalled();
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
    fixture.detectChanges();
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
