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
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { UpdateLibraryAction } from '@alfresco/aca-shared/store';
import { AppTestingModule } from '../../../testing/app-testing.module';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { Site, SitePaging, Tag, TagBody, TagEntry, TagPaging, TagPagingList } from '@alfresco/js-api';
import { TagModule, TagsCreatorComponent, TagsCreatorMode, TagService } from '@alfresco/adf-content-services';
import { EMPTY, of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { AppHookService } from '@alfresco/aca-shared';

describe('LibraryMetadataFormComponent', () => {
  let fixture: ComponentFixture<LibraryMetadataFormComponent>;
  let component: LibraryMetadataFormComponent;
  let store: Store<any>;
  let tagService: TagService;

  const mockTagPaging = (): TagPaging => {
    const tagPaging = new TagPaging();
    tagPaging.list = new TagPagingList();
    const tagEntry1 = new TagEntry();
    tagEntry1.entry = new Tag();
    tagEntry1.entry.tag = 'Tag 1';
    tagEntry1.entry.id = 'some id 1';
    const tagEntry2 = new TagEntry();
    tagEntry2.entry = new Tag();
    tagEntry2.entry.tag = 'Tag 2';
    tagEntry2.entry.id = 'some id 2';
    tagPaging.list.entries = [tagEntry1, tagEntry2];
    return tagPaging;
  };

  const findTagElements = (): DebugElement[] => fixture.debugElement.queryAll(By.css('.app-metadata-properties-tag'));

  const toggleEditMode = () => {
    fixture.detectChanges();
    fixture.debugElement.query(By.css('[data-automation-id=toggle-edit-button]')).nativeElement.click();
    fixture.detectChanges();
  };

  const clickOnCancel = () => {
    fixture.debugElement.query(By.css('[data-automation-id=cancel-button]')).nativeElement.click();
    fixture.detectChanges();
  };

  const clickOnUpdate = () => {
    fixture.debugElement.query(By.css('[data-automation-id=update-button]')).nativeElement.click();
    fixture.detectChanges();
  };

  const findShowingTagInputButton = (): HTMLButtonElement =>
    fixture.debugElement.query(By.css('[data-automation-id=showing-tag-input-button]')).nativeElement;

  const findTagsCreator = (): TagsCreatorComponent => fixture.debugElement.query(By.directive(TagsCreatorComponent))?.componentInstance;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule, ReactiveFormsModule, MatSelectModule, TagModule],
      declarations: [LibraryMetadataFormComponent],
      providers: [
        {
          provide: Store,
          useValue: {
            dispatch: () => ({})
          }
        },
        {
          provide: TagService,
          useValue: {
            getTagsByNodeId: () => EMPTY
          }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });

    store = TestBed.inject(Store);

    fixture = TestBed.createComponent(LibraryMetadataFormComponent);
    component = fixture.componentInstance;
    tagService = TestBed.inject(TagService);
    component.node = {
      entry: {
        id: 'some id',
        guid: 'some guid',
        title: 'libraryTitle',
        description: 'description',
        visibility: 'PRIVATE',
        role: 'SiteManager'
      } as Site
    };
    spyOn(store, 'dispatch');
  });

  it('should initialize form with node data', () => {
    fixture.detectChanges();

    expect(component.form.value).toEqual({
      title: component.node.entry.title,
      description: component.node.entry.description,
      visibility: component.node.entry.visibility
    });
  });

  it('should update form data when node data changes', () => {
    const newSiteEntryModel = {
      title: 'libraryTitle2',
      description: 'description2',
      visibility: 'PUBLIC'
    };

    fixture.detectChanges();

    expect(component.form.value).toEqual({
      title: component.node.entry.title,
      description: component.node.entry.description,
      visibility: component.node.entry.visibility
    });

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
    const tagPaging = mockTagPaging();
    spyOn(tagService, 'getTagsByNodeId').and.returnValue(of(tagPaging));
    toggleEditMode();
    const tagName1 = tagPaging.list.entries[0].entry.tag;
    const tagName2 = 'New tag 3';
    findTagsCreator().tagsChange.emit([tagName1, tagName2]);

    component.update();

    const tag1 = new TagBody();
    tag1.tag = tagName1;
    const tag2 = new TagBody();
    tag2.tag = tagName2;
    expect(store.dispatch).toHaveBeenCalledWith(
      new UpdateLibraryAction(
        {
          title: component.node.entry.title,
          description: component.node.entry.description,
          visibility: component.node.entry.visibility
        },
        [tagPaging.list.entries[1].entry.id],
        [tag1, tag2]
      )
    );
  });

  it('should not update library node if it has no permission', () => {
    component.node.entry.role = 'Consumer';

    fixture.detectChanges();

    component.update();

    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('should not update library node if form is invalid', () => {
    fixture.detectChanges();

    component.form.controls['title'].setErrors({ maxlength: true });

    component.update();

    expect(store.dispatch).not.toHaveBeenCalled();
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
      title: component.node.entry.title,
      description: component.node.entry.description,
      visibility: component.node.entry.visibility
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

  describe('Tags list', () => {
    let tagPaging: TagPaging;

    beforeEach(() => {
      tagPaging = mockTagPaging();
    });

    it('should render tags after loading tags in ngOnInit', () => {
      spyOn(tagService, 'getTagsByNodeId').and.returnValue(of(tagPaging));
      component.ngOnInit();
      fixture.detectChanges();
      const tagElements = findTagElements();
      expect(tagElements).toHaveSize(2);
      expect(tagElements[0].nativeElement.textContent).toBe(tagPaging.list.entries[0].entry.tag);
      expect(tagElements[1].nativeElement.textContent).toBe(tagPaging.list.entries[1].entry.tag);
      expect(tagService.getTagsByNodeId).toHaveBeenCalledWith(component.node.entry.guid);
    });

    it('should render tags after loading tags in ngOnChanges', () => {
      spyOn(tagService, 'getTagsByNodeId').and.returnValue(of(tagPaging));
      component.ngOnChanges();
      fixture.detectChanges();
      const tagElements = findTagElements();
      expect(tagElements).toHaveSize(2);
      expect(tagElements[0].nativeElement.textContent).toBe(tagPaging.list.entries[0].entry.tag);
      expect(tagElements[1].nativeElement.textContent).toBe(tagPaging.list.entries[1].entry.tag);
      expect(tagService.getTagsByNodeId).toHaveBeenCalledWith(component.node.entry.guid);
    });

    it('should render tags after loading tags after clicking on Cancel button', () => {
      toggleEditMode();

      spyOn(tagService, 'getTagsByNodeId').and.returnValue(of(tagPaging));
      clickOnCancel();
      const tagElements = findTagElements();
      expect(tagElements).toHaveSize(2);
      expect(tagElements[0].nativeElement.textContent).toBe(tagPaging.list.entries[0].entry.tag);
      expect(tagElements[1].nativeElement.textContent).toBe(tagPaging.list.entries[1].entry.tag);
      expect(tagService.getTagsByNodeId).toHaveBeenCalledOnceWith(component.node.entry.guid);
    });

    it('should be hidden after click on edit button', () => {
      spyOn(tagService, 'getTagsByNodeId').and.returnValue(of(tagPaging));
      component.ngOnInit();

      toggleEditMode();
      expect(findTagElements()).toHaveSize(0);
    });
  });

  describe('Showing tag input button', () => {
    let button: HTMLButtonElement;

    beforeEach(() => {
      toggleEditMode();
      button = findShowingTagInputButton();
    });

    it('should be hidden after click', () => {
      button.click();
      fixture.detectChanges();

      expect(button.hasAttribute('hidden')).toBeTrue();
    });

    it('should assign true to tagNameControlVisible for TagsCreator after click', () => {
      button.click();
      fixture.detectChanges();

      expect(findTagsCreator().tagNameControlVisible).toBeTrue();
    });

    it('should be visible after clicking on update button', fakeAsync(() => {
      button.click();
      component.form.markAsDirty();
      fixture.detectChanges();
      tick();

      clickOnUpdate();
      tick(100);
      expect(button.hasAttribute('hidden')).toBeFalse();
    }));
  });

  describe('Tags creator', () => {
    let tagsCreator: TagsCreatorComponent;

    beforeEach(() => {
      toggleEditMode();
      tagsCreator = findTagsCreator();
    });

    it('should have assigned false to tagNameControlVisible initially', () => {
      expect(tagsCreator.tagNameControlVisible).toBeFalse();
    });

    it('should hide showing tag input button after emitting tagNameControlVisibleChange event with true', () => {
      tagsCreator.tagNameControlVisibleChange.emit(true);
      fixture.detectChanges();
      expect(findShowingTagInputButton().hasAttribute('hidden')).toBeTrue();
    });

    it('should show showing tag input button after emitting tagNameControlVisibleChange event with false', fakeAsync(() => {
      tagsCreator.tagNameControlVisibleChange.emit(true);
      fixture.detectChanges();
      tick();
      tagsCreator.tagNameControlVisibleChange.emit(false);
      fixture.detectChanges();
      tick(100);
      expect(findShowingTagInputButton().hasAttribute('hidden')).toBeFalse();
    }));

    it('should have assigned correct mode', () => {
      expect(tagsCreator.mode).toBe(TagsCreatorMode.CREATE_AND_ASSIGN);
    });

    it('should not be rendered when clicked on cancel button', () => {
      clickOnCancel();
      expect(findTagsCreator()).toBeUndefined();
    });

    it('should call markAsDirty on form after emitting tagsChange event', () => {
      spyOn(component.form, 'markAsDirty');

      tagsCreator.tagsChange.emit(['New tag 1', 'New tag 2', 'New tag 3']);
      expect(component.form.markAsDirty).toHaveBeenCalled();
    });

    it('should have assigned false to disabledTagsRemoving', () => {
      expect(tagsCreator.disabledTagsRemoving).toBeFalse();
    });

    it('should have assigned true to disabledTagsRemoving after clicking on update button', () => {
      component.form.markAsDirty();
      fixture.detectChanges();

      clickOnUpdate();
      expect(tagsCreator.disabledTagsRemoving).toBeTrue();
    });

    it('should have assigned false to disabledTagsRemoving when error occurs for libraryUpdated event', () => {
      component.form.markAsDirty();
      fixture.detectChanges();
      clickOnUpdate();

      TestBed.inject(AppHookService).libraryUpdated.error({});
      fixture.detectChanges();
      expect(tagsCreator.disabledTagsRemoving).toBeFalse();
    });

    it('should have assigned false to tagNameControlVisible after clicking on update button', fakeAsync(() => {
      tagsCreator.tagNameControlVisibleChange.emit(true);
      component.form.markAsDirty();
      fixture.detectChanges();
      tick();

      clickOnUpdate();
      tick(100);
      expect(findShowingTagInputButton().hasAttribute('hidden')).toBeFalse();
    }));

    describe('Setting tags', () => {
      let tagPaging: TagPaging;

      beforeEach(() => {
        tagPaging = mockTagPaging();
        spyOn(tagService, 'getTagsByNodeId').and.returnValue(of(tagPaging));
      });

      it('should assign correct tags after ngOnInit', () => {
        component.ngOnInit();

        fixture.detectChanges();
        expect(tagsCreator.tags).toEqual([tagPaging.list.entries[0].entry.tag, tagPaging.list.entries[1].entry.tag]);
        expect(tagService.getTagsByNodeId).toHaveBeenCalledWith(component.node.entry.guid);
      });

      it('should assign correct tags after ngOnChanges', () => {
        component.ngOnInit();

        fixture.detectChanges();
        expect(tagsCreator.tags).toEqual([tagPaging.list.entries[0].entry.tag, tagPaging.list.entries[1].entry.tag]);
        expect(tagService.getTagsByNodeId).toHaveBeenCalledWith(component.node.entry.guid);
      });
    });
  });

  describe('Edit button', () => {
    it('should show tags creator after click', () => {
      toggleEditMode();
      expect(findTagsCreator()).toBeDefined();
    });
  });
});
