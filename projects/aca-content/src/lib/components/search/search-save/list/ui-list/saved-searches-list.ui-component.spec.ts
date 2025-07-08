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
import { DataCellEvent, DataTableComponent, NoopTranslateModule, NotificationService } from '@alfresco/adf-core';
import { SavedSearchesListUiComponent } from './saved-searches-list.ui-component';
import { SavedSearchesListUiService } from '../saved-searches-list-ui.service';
import { By } from '@angular/platform-browser';
import { SavedSearch } from '@alfresco/adf-content-services';
import { Subject } from 'rxjs';
import { Clipboard } from '@angular/cdk/clipboard';
import { Router } from '@angular/router';

describe('SavedSearchesListUiComponent ', () => {
  let fixture: ComponentFixture<SavedSearchesListUiComponent>;
  let component: SavedSearchesListUiComponent;
  let notificationService: NotificationService;
  let savedSearchesListUiService: SavedSearchesListUiService;
  let clipboard: Clipboard;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NoopTranslateModule, SavedSearchesListUiComponent],
      providers: [SavedSearchesListUiService]
    });

    notificationService = TestBed.inject(NotificationService);
    savedSearchesListUiService = TestBed.inject(SavedSearchesListUiService);
    clipboard = TestBed.inject(Clipboard);
    router = TestBed.inject(Router);

    fixture = TestBed.createComponent(SavedSearchesListUiComponent);
    component = fixture.componentInstance;
  });

  function getColumnDefinition(key: string, title: string) {
    return jasmine.objectContaining({
      id: '',
      key,
      type: 'text',
      sortable: false,
      title,
      draggable: false,
      isHidden: false
    });
  }

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
            name: 'test',
            encodedUrl: 'test',
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
      const mockSavedSearches: SavedSearch[] = [
        { name: '1', order: 0, encodedUrl: '123' },
        { name: '2', order: 1, encodedUrl: '1234' }
      ];
      component.savedSearches = mockSavedSearches;

      fixture.detectChanges();
      expect(dataTable.rows).toEqual(mockSavedSearches);
    });

    it('should have assigned correct columns', () => {
      fixture.detectChanges();
      expect(dataTable.columns).toEqual([
        getColumnDefinition('name', 'APP.BROWSE.SEARCH.SAVE_SEARCH.LIST.NAME'),
        getColumnDefinition('description', 'APP.BROWSE.SEARCH.SAVE_SEARCH.LIST.DESCRIPTION')
      ]);
    });

    it('should fill context menu options on showRowContextMenu event', () => {
      dataTable.showRowContextMenu.emit(dataCellEvent);
      expect(dataCellEvent.value.actions).toEqual([
        {
          title: 'APP.BROWSE.SEARCH.SAVE_SEARCH.LIST.COPY_TO_CLIPBOARD',
          key: 'copy',
          subject: jasmine.any(Subject),
          model: {
            visible: true,
            icon: 'copy'
          },
          data: dataCellEvent.value.row.obj
        },
        {
          title: 'APP.BROWSE.SEARCH.SAVE_SEARCH.LIST.EXECUTE_SEARCH',
          key: 'execute',
          subject: jasmine.any(Subject),
          model: {
            visible: true,
            icon: 'exit_to_app'
          },
          data: dataCellEvent.value.row.obj
        },
        {
          title: 'APP.BROWSE.SEARCH.SAVE_SEARCH.EDIT_DIALOG.CONTEXT_OPTION',
          key: 'edit',
          subject: jasmine.any(Subject),
          model: {
            visible: true,
            icon: 'edit'
          },
          data: dataCellEvent.value.row.obj
        },
        {
          title: 'APP.BROWSE.SEARCH.SAVE_SEARCH.DELETE_DIALOG.CONTEXT_OPTION',
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
      beforeEach(() => {
        spyOn(savedSearchesListUiService, 'openEditSavedSearch');
        spyOn(savedSearchesListUiService, 'confirmDeleteSavedSearch');
        spyOn(clipboard, 'copy');
        dataTable.showRowContextMenu.emit(dataCellEvent);
      });

      describe('Edit save search', () => {
        let editAction: any;

        beforeEach(() => {
          editAction = dataCellEvent.value.actions[2];
          editAction.subject.next(editAction);
        });

        it('should call openEditSavedSearch when selected edit option', () => {
          expect(savedSearchesListUiService.openEditSavedSearch).toHaveBeenCalledWith(editAction.data);
        });
      });

      describe('Delete save search', () => {
        let deleteAction: any;

        beforeEach(() => {
          deleteAction = dataCellEvent.value.actions[3];
          deleteAction.subject.next(deleteAction);
        });

        it('should call confirmDeleteSavedSearch when selected delete option', () => {
          expect(savedSearchesListUiService.confirmDeleteSavedSearch).toHaveBeenCalledWith(deleteAction.data);
        });
      });

      describe('Copy to clipboard save search', () => {
        let actionData: any;

        beforeEach(() => {
          spyOn(notificationService, 'showInfo');
          actionData = dataCellEvent.value.actions[0];
          actionData.subject.next(actionData);
        });

        it('should call copy to clipboard when selected delete option', () => {
          expect(clipboard.copy).toHaveBeenCalled();
        });

        it('should show snackbar message when selected delete option', () => {
          expect(notificationService.showInfo).toHaveBeenCalledWith('APP.BROWSE.SEARCH.SAVE_SEARCH.LIST.COPY_TO_CLIPBOARD_SUCCESS');
        });
      });

      describe('Execute search', () => {
        let actionData: any;

        beforeEach(() => {
          spyOn(router, 'navigate').and.stub();
          actionData = dataCellEvent.value.actions[1];
          actionData.subject.next(actionData);
        });

        it('should navigate to search when selected execute search option', () => {
          expect(router.navigate).toHaveBeenCalledWith(['/search'], { queryParams: { q: 'test' } });
        });
      });
    });
  });
});
