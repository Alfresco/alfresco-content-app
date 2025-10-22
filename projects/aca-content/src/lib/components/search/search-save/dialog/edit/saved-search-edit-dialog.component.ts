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
import { AutoFocusDirective, forbidOnlySpaces, SavedSearch } from '@alfresco/adf-content-services';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { take } from 'rxjs/operators';
import { NotificationService } from '@alfresco/adf-core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UniqueSearchNameValidator } from '../unique-search-name-validator';
import { SavedSearchForm } from '../saved-search-form.interface';
import { TranslatePipe } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TitleCasePipe } from '@angular/common';
import { SavedSearchesContextService } from '../../../../../services/saved-searches-context.service';

@Component({
  imports: [
    AutoFocusDirective,
    TranslatePipe,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    TitleCasePipe
  ],
  selector: 'aca-saved-search-edit-dialog',
  templateUrl: './saved-search-edit-dialog.component.html',
  styleUrls: ['./saved-search-edit-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: { class: 'aca-saved-search-edit-dialog' }
})
export class SavedSearchEditDialogComponent {
  form: FormGroup<SavedSearchForm>;
  isLoading = false;

  constructor(
    private readonly dialog: MatDialogRef<SavedSearchEditDialogComponent>,
    private readonly notificationService: NotificationService,
    private readonly savedSearchesService: SavedSearchesContextService,
    private readonly uniqueSearchNameValidator: UniqueSearchNameValidator,
    @Inject(MAT_DIALOG_DATA) private readonly data: SavedSearch
  ) {
    this.form = new FormGroup({
      name: new FormControl('', {
        validators: [Validators.required, forbidOnlySpaces],
        asyncValidators: [this.uniqueSearchNameValidator.validate.bind(this.uniqueSearchNameValidator)],
        updateOn: 'change'
      }),
      description: new FormControl('')
    });

    this.form.patchValue({
      name: this.data.name,
      description: this.data.description
    });
  }

  submit() {
    if (this.form.invalid || this.isLoading) {
      return;
    }
    this.isLoading = true;
    const formValue = this.form.value;
    const savedSearch: SavedSearch = {
      name: formValue.name,
      description: formValue.description,
      encodedUrl: this.data.encodedUrl,
      order: this.data.order
    };
    if (this.data.name === formValue.name && this.data.description === formValue.description) {
      this.onEditSuccess();
    }
    this.savedSearchesService
      .editSavedSearch(savedSearch)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.onEditSuccess();
          this.isLoading = false;
        },
        error: () => {
          this.notificationService.showError('APP.BROWSE.SEARCH.SAVE_SEARCH.EDIT_DIALOG.ERROR_MESSAGE');
          this.isLoading = false;
        }
      });
  }

  private onEditSuccess(): void {
    this.dialog.close();
    this.notificationService.showInfo('APP.BROWSE.SEARCH.SAVE_SEARCH.EDIT_DIALOG.SUCCESS_MESSAGE');
  }
}
