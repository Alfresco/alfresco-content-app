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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SavedSearchesListUiComponent } from './saved-searches-list.ui-component';
import { AppConfigService, CoreTestingModule, DataCellEvent, DataRowActionEvent, DataTableComponent } from '@alfresco/adf-core';
import { By } from '@angular/platform-browser';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { DebugElement } from '@angular/core';
import { Tag } from '@alfresco/js-api';
import { savedSearchesListSchema } from '../smart-list/saved-searches-list-schema';
import { EMPTY, of, Subject } from 'rxjs';
import { SavedSearchesListUiService } from '../saved-searches-list-ui.service';

describe('TagsListUiComponent', () => {
  let fixture: ComponentFixture<SavedSearchesListUiComponent>;
  let component: SavedSearchesListUiComponent;
  let appConfig: AppConfigService;
  let tagsUiService: SavedSearchesListUiService;

  function getSpinner(): DebugElement {
    return fixture.debugElement.query(By.directive(MatProgressSpinner));
  }

  function getColumnDefinition(key: string, title: string) {
    return jasmine.objectContaining({
      id: '',
      key,
      type: 'text',
      sortable: true,
      title,
      draggable: true,
      isHidden: false
    });
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CoreTestingModule, SavedSearchesListUiComponent],
      teardown: { destroyAfterEach: true }
    });

    appConfig = TestBed.inject(AppConfigService);
    appConfig.config = Object.assign(appConfig.config, {
      'content-structuring': {
        presets: {
          ...savedSearchesListSchema
        }
      }
    });

    tagsUiService = TestBed.inject(SavedSearchesListUiService);

    fixture = TestBed.createComponent(SavedSearchesListUiComponent);
    component = fixture.componentInstance;
  });

  describe('Spinner', () => {
    it('should not be showed when loading is false', () => {
      component.loading = false;
      fixture.detectChanges();
      expect(getSpinner()).toBeFalsy();
    });

    it('should be showed when loading is true', () => {
      component.loading = true;
      fixture.detectChanges();
      expect(getSpinner()).toBeTruthy();
    });
  });

  describe('Data table', () => {
    let dataTable: DataTableComponent;
    let dataCellEvent: DataCellEvent;

    beforeEach(() => {
      fixture.detectChanges();
      dataTable = fixture.debugElement.query(By.directive(DataTableComponent)).componentInstance;
      dataCellEvent = new DataCellEvent(
        {
          isSelected: true,
          hasValue: () => true,
          getValue: () => 'Some value',
          obj: {
            field: 'some value',
            id: 'some id'
          }
        },
        {
          key: 'col 1',
          type: 'text'
        },
        []
      );
    });

    it('should have assigned tags as rows', () => {
      const tag1 = new Tag();
      tag1.id = 'id 1';
      const tag2 = new Tag();
      tag2.id = 'id 2';
      component.savedSearches = [tag1, tag2];

      fixture.detectChanges();
      expect(dataTable.rows).toEqual(component.savedSearches);
    });

    it('should have assigned correct columns', () => {
      fixture.detectChanges();
      expect(dataTable.columns).toEqual([
        getColumnDefinition('id', 'CONTENT_STRUCTURING.TAGS.TAG_LIST.PROPERTIES.ID'),
        getColumnDefinition('tag', 'CONTENT_STRUCTURING.TAGS.TAG_LIST.PROPERTIES.TAG'),
        getColumnDefinition('count', 'CONTENT_STRUCTURING.TAGS.TAG_LIST.PROPERTIES.COUNT')
      ]);
    });

    it('should fill context menu options on showRowContextMenu event', () => {
      dataTable.showRowContextMenu.emit(dataCellEvent);
      expect(dataCellEvent.value.actions).toEqual([
        {
          title: 'CONTENT_STRUCTURING.EDIT',
          key: 'edit',
          subject: jasmine.any(Subject),
          model: {
            visible: true,
            icon: 'edit'
          },
          data: dataCellEvent.value.row.obj
        },
        {
          title: 'CONTENT_STRUCTURING.DELETE',
          key: 'delete',
          subject: jasmine.any(Subject),
          model: {
            visible: true,
            icon: 'delete'
          },
          data: dataCellEvent.value.row.obj
        }
      ]);
    });

    describe('Context menu actions', () => {
      let afterClosed$: Subject<boolean>;

      beforeEach(() => {
        afterClosed$ = new Subject<boolean>();
        spyOn(tagsUiService, 'openEditTagDialog').and.returnValue(afterClosed$);
        spyOn(tagsUiService, 'confirmDeleteTag').and.returnValue(afterClosed$);
        dataTable.showRowContextMenu.emit(dataCellEvent);
      });

      describe('Tag editing', () => {
        let editAction: any;

        beforeEach(() => {
          editAction = dataCellEvent.value.actions[0];
          editAction.subject.next(editAction);
          spyOn(component.savedSearchEdited, 'emit');
        });

        it('should open dialog for TagEditDialogComponent when selected edit option', () => {
          expect(tagsUiService.openEditSavedSearch).toHaveBeenCalledWith(editAction.data);
        });

        it('should emit tagEdited after closing editing dialog with true as result', () => {
          afterClosed$.next(true);
          expect(component.savedSearchEdited.emit).toHaveBeenCalled();
        });

        it('should not emit tagEdited after closing editing dialog with false as result', () => {
          afterClosed$.next(false);
          expect(component.savedSearchEdited.emit).not.toHaveBeenCalled();
        });
      });

      describe('Tag deleting', () => {
        let deleteAction: any;

        beforeEach(() => {
          deleteAction = dataCellEvent.value.actions[1];
          deleteAction.subject.next(deleteAction);
          spyOn(component.savedSearchDeleted, 'emit');
        });

        it('should open dialog for ConfirmDialogComponent when selected delete option', () => {
          expect(tagsUiService.confirmDeleteSavedSearch).toHaveBeenCalledTimes(1);
        });

        it('should emit deleteTag after closing deleting dialog with true as result', () => {
          afterClosed$.next(true);
          expect(component.savedSearchDeleted.emit).toHaveBeenCalledWith(dataCellEvent.value.row.obj.id);
        });

        it('should not emit deleteTag after closing deleting dialog with false as result', () => {
          afterClosed$.next(false);
          expect(component.savedSearchDeleted.emit).not.toHaveBeenCalled();
        });
      });
    });
  });

  describe('Row actions menu', () => {
    it('should execute openEditTagDialog method if the tag edit option is selected', () => {
      const openEditTagDialogSpy = spyOn(component, 'openEditTagDialog');
      const rowActionEvent = new DataRowActionEvent({ isSelected: false, hasValue: () => null, getValue: () => null }, { key: 'edit' });
      component.executeMenuOption(rowActionEvent.value.action.key, rowActionEvent.value.row.obj);
      expect(openEditTagDialogSpy).toHaveBeenCalled();
    });

    it('should execute openDeleteTagDialog method if the tag delete option is selected', () => {
      const openDeleteTagDialogSpy = spyOn(component, 'openDeleteTagDialog');
      const rowActionEvent = new DataRowActionEvent({ isSelected: false, hasValue: () => null, getValue: () => null }, { key: 'delete' });
      component.executeMenuOption(rowActionEvent.value.action.key, rowActionEvent.value.row.obj);
      expect(openDeleteTagDialogSpy).toHaveBeenCalled();
    });

    it('should open confirmation dialog on openDeleteTagDialog', () => {
      spyOn(tagsUiService, 'confirmDeleteTag').and.returnValue(EMPTY);
      component.openDeleteSavedSearchDialog({ tag: 'tag', id: 'tag-id' });

      expect(tagsUiService.confirmDeleteSavedSearch).toHaveBeenCalled();
    });

    it('should emit deleteTag with tag id if confirmation dialog returns true', () => {
      spyOn(tagsUiService, 'confirmDeleteTag').and.returnValue(of(true));
      spyOn(component.savedSearchDeleted, 'emit');
      component.openDeleteSavedSearchDialog({ tag: 'tag', id: 'tag-id' });

      fixture.detectChanges();
      expect(component.savedSearchDeleted.emit).toHaveBeenCalledWith('tag-id');
    });

    it('should not emit deleteTag if confirmation dialog returns false', () => {
      spyOn(tagsUiService, 'confirmDeleteTag').and.returnValue(of(false));
      spyOn(component.savedSearchDeleted, 'emit');

      fixture.detectChanges();
      expect(component.savedSearchDeleted.emit).not.toHaveBeenCalled();
    });
  });
});
