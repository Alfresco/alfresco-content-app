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

import { Component, ViewEncapsulation, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { Node } from '@alfresco/js-api';
import { UntypedFormBuilder, UntypedFormGroup, Validators, UntypedFormControl, ValidationErrors, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppStore, CreateFromTemplate } from '@alfresco/aca-shared/store';
import { TranslationService } from '@alfresco/adf-core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  standalone: true,
  imports: [CommonModule, TranslateModule, MatDialogModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './create-from-template.dialog.html',
  styleUrls: ['./create-from-template.dialog.scss'],
  selector: 'app-create-from-template-dialog',
  encapsulation: ViewEncapsulation.None
})
export class CreateFromTemplateDialogComponent implements OnInit {
  public form: UntypedFormGroup;

  title = '';

  constructor(
    private translationService: TranslationService,
    private store: Store<AppStore>,
    private formBuilder: UntypedFormBuilder,
    private dialogRef: MatDialogRef<CreateFromTemplateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Node
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      name: [this.data.name, [Validators.required, this.forbidEndingDot, this.forbidOnlySpaces, this.forbidSpecialCharacters]],
      title: [this.data.properties ? this.data.properties['cm:title'] : '', Validators.maxLength(256)],
      description: [this.data.properties ? this.data.properties['cm:description'] : '', Validators.maxLength(512)]
    });

    this.title = this.translationService.instant(
      this.data.isFolder ? 'NODE_FROM_TEMPLATE.FOLDER_DIALOG_TITLE' : 'NODE_FROM_TEMPLATE.FILE_DIALOG_TITLE',
      { template: this.data.name }
    );
  }

  onSubmit() {
    const update = {
      name: this.form.value.name.trim(),
      properties: {
        'cm:title': this.form.value.title,
        'cm:description': this.form.value.description
      }
    };
    const data: Node = Object.assign({}, this.data, update);
    this.store.dispatch(new CreateFromTemplate(data));
  }

  close() {
    this.dialogRef.close();
  }

  private forbidSpecialCharacters({ value }: UntypedFormControl): ValidationErrors | null {
    const specialCharacters = /([\*\"\<\>\\\/\?\:\|])/;
    const isValid = !specialCharacters.test(value);

    return isValid
      ? null
      : {
          message: `NODE_FROM_TEMPLATE.FORM.ERRORS.SPECIAL_CHARACTERS`
        };
  }

  private forbidEndingDot({ value }: UntypedFormControl): ValidationErrors | null {
    const isValid: boolean = (value || '').trim().split('').pop() !== '.';

    return isValid
      ? null
      : {
          message: `NODE_FROM_TEMPLATE.FORM.ERRORS.ENDING_DOT`
        };
  }

  private forbidOnlySpaces({ value }: UntypedFormControl): ValidationErrors | null {
    if (value.length) {
      const isValid = !!(value || '').trim();

      return isValid
        ? null
        : {
            message: `NODE_FROM_TEMPLATE.FORM.ERRORS.ONLY_SPACES`
          };
    } else {
      return {
        message: `NODE_FROM_TEMPLATE.FORM.ERRORS.REQUIRED`
      };
    }
  }
}
