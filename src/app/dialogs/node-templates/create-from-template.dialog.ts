/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2019 Alfresco Software Limited
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
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Node } from '@alfresco/js-api';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  ValidationErrors
} from '@angular/forms';

@Component({
  templateUrl: './create-from-template.dialog.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./create-from-template.dialog.scss']
})
export class CreateFileFromTemplateDialogComponent implements OnInit {
  public form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<CreateFileFromTemplateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      name: [
        this.data.name,
        [
          Validators.required,
          this.forbidEndingDot,
          this.forbidOnlySpaces,
          this.forbidSpecialCharacters
        ]
      ],
      title: [this.data.properties['cm:title'], Validators.maxLength(256)],
      description: [
        this.data.properties['cm:description'],
        Validators.maxLength(512)
      ]
    });
  }

  onSubmit() {
    const update = {
      name: this.form.value.name,
      properties: {
        'cm:title': this.form.value.title,
        'cm:description': this.form.value.description
      }
    };
    const data: Node = Object.assign({}, this.data, update);
    this.dialogRef.close(data);
  }

  close() {
    this.dialogRef.close();
  }

  private forbidSpecialCharacters({
    value
  }: FormControl): ValidationErrors | null {
    const specialCharacters: RegExp = /([\*\"\<\>\\\/\?\:\|])/;
    const isValid: boolean = !specialCharacters.test(value);

    return isValid
      ? null
      : {
          message: `FILE_FROM_TEMPLATE.FORM.ERRORS.SPECIAL_CHARACTERS`
        };
  }

  private forbidEndingDot({ value }: FormControl): ValidationErrors | null {
    const isValid: boolean =
      (value || '')
        .trim()
        .split('')
        .pop() !== '.';

    return isValid
      ? null
      : {
          message: `FILE_FROM_TEMPLATE.FORM.ERRORS.ENDING_DOT`
        };
  }

  private forbidOnlySpaces({ value }: FormControl): ValidationErrors | null {
    if (value.length) {
      const isValid: boolean = !!(value || '').trim();

      return isValid
        ? null
        : {
            message: `FILE_FROM_TEMPLATE.FORM.ERRORS.ONLY_SPACES`
          };
    } else {
      return {
        message: `FILE_FROM_TEMPLATE.FORM.ERRORS.REQUIRED`
      };
    }
  }
}
