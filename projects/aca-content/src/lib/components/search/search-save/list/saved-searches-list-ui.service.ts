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

import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SavedSearch } from '@alfresco/adf-content-services';
import { SavedSearchDeleteDialogComponent } from '../dialog/delete/saved-search-delete-dialog.component';
import { SavedSearchEditDialogComponent } from '../dialog/edit/saved-search-edit-dialog.component';

@Injectable({ providedIn: 'root' })
export class SavedSearchesListUiService {
  private readonly dialog = inject(MatDialog);

  openEditSavedSearch(savedSearch: SavedSearch): void {
    this.dialog
      .open(SavedSearchEditDialogComponent, {
        data: savedSearch,
        width: '600px'
      })
      .afterClosed()
      .subscribe(() => this.focusAfterClose(`.adf-datatable-cell--${savedSearch.name}`));
  }

  confirmDeleteSavedSearch(savedSearch: SavedSearch): void {
    this.dialog
      .open(SavedSearchDeleteDialogComponent, {
        data: savedSearch,
        minWidth: '500px'
      })
      .afterClosed()
      .subscribe(() => this.focusAfterClose(`.adf-datatable-cell--${savedSearch.name}`));
  }

  private focusAfterClose(focusedElementSelector: string): void {
    if (focusedElementSelector) {
      document.querySelector<HTMLElement>(focusedElementSelector)?.closest<HTMLElement>('adf-datatable-row').focus();
    }
  }
}
