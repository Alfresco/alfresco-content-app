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
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { A11yModule } from '@angular/cdk/a11y';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NotificationService } from '@alfresco/adf-core';
import { AutoFocusDirective, forbidOnlySpaces } from '@alfresco/adf-content-services';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { take } from 'rxjs/operators';
import { UniqueSearchNameValidator } from './unique-search-name-validator';
import { SavedSearchForm } from './saved-search-form.interface';
import { SavedSearchesContextService } from '../../../../services/saved-searches-context.service';

@Component({
  imports: [
    CommonModule,
    TranslatePipe,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    A11yModule,
    MatCheckboxModule,
    FormsModule,
    AutoFocusDirective,
    ReactiveFormsModule,
    MatDialogModule
  ],
  selector: 'aca-save-search-dialog',
  templateUrl: './save-search-dialog.component.html',
  styleUrls: ['./save-search-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: { class: 'aca-save-search-dialog' }
})
export class SaveSearchDialogComponent {
  form: FormGroup<SavedSearchForm>;
  disableSubmitButton = false;

  constructor(
    private readonly dialog: MatDialogRef<SaveSearchDialogComponent>,
    private readonly notificationService: NotificationService,
    private readonly savedSearchesService: SavedSearchesContextService,
    private readonly uniqueSearchNameValidator: UniqueSearchNameValidator,
    @Inject(MAT_DIALOG_DATA) private readonly data: { searchUrl: string }
  ) {
    this.form = new FormGroup({
      name: new FormControl('', {
        validators: [Validators.required, forbidOnlySpaces],
        asyncValidators: [this.uniqueSearchNameValidator.validate.bind(this.uniqueSearchNameValidator)],
        updateOn: 'change'
      }),
      description: new FormControl('')
    });
  }

  submit() {
    if (this.form.invalid || this.disableSubmitButton) {
      return;
    }
    this.disableSubmitButton = true;
    const formValue = this.form.value;
    const saveSearch = { name: formValue.name, description: formValue.description, encodedUrl: encodeURIComponent(this.data.searchUrl) };
    this.savedSearchesService
      .saveSearch(saveSearch)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.dialog.close(true);
          this.notificationService.showInfo('APP.BROWSE.SEARCH.SAVE_SEARCH.SAVE_SUCCESS');
          this.disableSubmitButton = false;
        },
        error: () => {
          this.notificationService.showError('APP.BROWSE.SEARCH.SAVE_SEARCH.SAVE_ERROR');
          this.disableSubmitButton = false;
        }
      });
  }
}
