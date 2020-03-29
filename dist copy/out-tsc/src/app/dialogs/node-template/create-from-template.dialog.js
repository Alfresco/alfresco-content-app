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
import * as tslib_1 from 'tslib';
import { Component, ViewEncapsulation, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Node } from '@alfresco/js-api';
import { FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { CreateFromTemplate } from '@alfresco/aca-shared/store';
import { TranslationService } from '@alfresco/adf-core';
var CreateFromTemplateDialogComponent = /** @class */ (function() {
  function CreateFromTemplateDialogComponent(
    translationService,
    store,
    formBuilder,
    dialogRef,
    data
  ) {
    this.translationService = translationService;
    this.store = store;
    this.formBuilder = formBuilder;
    this.dialogRef = dialogRef;
    this.data = data;
  }
  CreateFromTemplateDialogComponent.prototype.ngOnInit = function() {
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
      title: [
        this.data.properties ? this.data.properties['cm:title'] : '',
        Validators.maxLength(256)
      ],
      description: [
        this.data.properties ? this.data.properties['cm:description'] : '',
        Validators.maxLength(512)
      ]
    });
  };
  CreateFromTemplateDialogComponent.prototype.onSubmit = function() {
    var update = {
      name: this.form.value.name.trim(),
      properties: {
        'cm:title': this.form.value.title,
        'cm:description': this.form.value.description
      }
    };
    var data = Object.assign({}, this.data, update);
    this.store.dispatch(new CreateFromTemplate(data));
  };
  CreateFromTemplateDialogComponent.prototype.title = function() {
    if (this.data.isFolder) {
      return this.translationService.instant(
        'NODE_FROM_TEMPLATE.FOLDER_DIALOG_TITLE',
        { template: this.data.name }
      );
    }
    return this.translationService.instant(
      'NODE_FROM_TEMPLATE.FILE_DIALOG_TITLE',
      { template: this.data.name }
    );
  };
  CreateFromTemplateDialogComponent.prototype.close = function() {
    this.dialogRef.close();
  };
  CreateFromTemplateDialogComponent.prototype.forbidSpecialCharacters = function(
    _a
  ) {
    var value = _a.value;
    var specialCharacters = /([\*\"\<\>\\\/\?\:\|])/;
    var isValid = !specialCharacters.test(value);
    return isValid
      ? null
      : {
          message: 'NODE_FROM_TEMPLATE.FORM.ERRORS.SPECIAL_CHARACTERS'
        };
  };
  CreateFromTemplateDialogComponent.prototype.forbidEndingDot = function(_a) {
    var value = _a.value;
    var isValid =
      (value || '')
        .trim()
        .split('')
        .pop() !== '.';
    return isValid
      ? null
      : {
          message: 'NODE_FROM_TEMPLATE.FORM.ERRORS.ENDING_DOT'
        };
  };
  CreateFromTemplateDialogComponent.prototype.forbidOnlySpaces = function(_a) {
    var value = _a.value;
    if (value.length) {
      var isValid = !!(value || '').trim();
      return isValid
        ? null
        : {
            message: 'NODE_FROM_TEMPLATE.FORM.ERRORS.ONLY_SPACES'
          };
    } else {
      return {
        message: 'NODE_FROM_TEMPLATE.FORM.ERRORS.REQUIRED'
      };
    }
  };
  CreateFromTemplateDialogComponent = tslib_1.__decorate(
    [
      Component({
        templateUrl: './create-from-template.dialog.html',
        encapsulation: ViewEncapsulation.None,
        styleUrls: ['./create-from-template.dialog.scss']
      }),
      tslib_1.__param(4, Inject(MAT_DIALOG_DATA)),
      tslib_1.__metadata('design:paramtypes', [
        TranslationService,
        Store,
        FormBuilder,
        MatDialogRef,
        Node
      ])
    ],
    CreateFromTemplateDialogComponent
  );
  return CreateFromTemplateDialogComponent;
})();
export { CreateFromTemplateDialogComponent };
//# sourceMappingURL=create-from-template.dialog.js.map
