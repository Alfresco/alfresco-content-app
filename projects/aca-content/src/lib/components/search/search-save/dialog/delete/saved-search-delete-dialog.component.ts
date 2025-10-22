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

import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { SavedSearch } from '@alfresco/adf-content-services';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { take } from 'rxjs/operators';
import { NotificationService } from '@alfresco/adf-core';
import { TranslatePipe } from '@ngx-translate/core';
import { TitleCasePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { SavedSearchesContextService } from '../../../../../services/saved-searches-context.service';

@Component({
  imports: [TranslatePipe, TitleCasePipe, MatIconModule, MatButtonModule, MatDialogModule],
  selector: 'aca-saved-search-delete-dialog',
  templateUrl: './saved-search-delete-dialog.component.html',
  styleUrls: ['./saved-search-delete-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: { class: 'aca-saved-search-delete-dialog' }
})
export class SavedSearchDeleteDialogComponent {
  isLoading = false;

  constructor(
    private readonly dialog: MatDialogRef<SavedSearchDeleteDialogComponent>,
    private readonly notificationService: NotificationService,
    private readonly savedSearchesService: SavedSearchesContextService,
    @Inject(MAT_DIALOG_DATA) private readonly data: SavedSearch
  ) {}

  onSubmit() {
    if (this.isLoading) {
      return;
    }
    this.isLoading = true;
    this.savedSearchesService
      .deleteSavedSearch(this.data)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.dialog.close(this.data);
          this.notificationService.showInfo('APP.BROWSE.SEARCH.SAVE_SEARCH.DELETE_DIALOG.SUCCESS_MESSAGE');
          this.isLoading = false;
        },
        error: () => {
          this.notificationService.showError('APP.BROWSE.SEARCH.SAVE_SEARCH.DELETE_DIALOG.ERROR_MESSAGE');
          this.isLoading = false;
        }
      });
  }
}
