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

import { Component, ViewEncapsulation, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Node } from '@alfresco/js-api';
import { FormBuilder, FormGroup, Validators, FormControl, ValidationErrors } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppStore, CreateFromTemplate } from '@alfresco/aca-shared/store';
import { TranslationService } from '@alfresco/adf-core';

@Component({
  templateUrl: './create-from-template.dialog.html',
  styleUrls: ['./create-from-template.dialog.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CreateFromTemplateDialogComponent implements OnInit {
  public form: FormGroup;

  constructor(
    private translationService: TranslationService,
    private store: Store<AppStore>,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<CreateFromTemplateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Node
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      name: [this.data.name, [Validators.required, this.forbidEndingDot, this.forbidOnlySpaces, this.forbidSpecialCharacters]],
      title: [this.data.properties ? this.data.properties['cm:title'] : '', Validators.maxLength(256)],
      description: [this.data.properties ? this.data.properties['cm:description'] : '', Validators.maxLength(512)]
    });
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

  title(): string {
    if (this.data.isFolder) {
      return this.translationService.instant('NODE_FROM_TEMPLATE.FOLDER_DIALOG_TITLE', { template: this.data.name });
    }

    return this.translationService.instant('NODE_FROM_TEMPLATE.FILE_DIALOG_TITLE', { template: this.data.name });
  }

  close() {
    this.dialogRef.close();
  }

  private forbidSpecialCharacters({ value }: FormControl): ValidationErrors | null {
    const specialCharacters = /([\*\"\<\>\\\/\?\:\|])/;
    const isValid = !specialCharacters.test(value);

    return isValid
      ? null
      : {
          message: `NODE_FROM_TEMPLATE.FORM.ERRORS.SPECIAL_CHARACTERS`
        };
  }

  private forbidEndingDot({ value }: FormControl): ValidationErrors | null {
    const isValid: boolean = (value || '').trim().split('').pop() !== '.';

    return isValid
      ? null
      : {
          message: `NODE_FROM_TEMPLATE.FORM.ERRORS.ENDING_DOT`
        };
  }

  private forbidOnlySpaces({ value }: FormControl): ValidationErrors | null {
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
