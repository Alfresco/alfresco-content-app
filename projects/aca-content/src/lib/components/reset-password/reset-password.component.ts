/*!
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { AlfrescoApiService } from '@alfresco/adf-core';
import { PasswordResetBody, PeopleApi } from '@alfresco/js-api';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  private peopleApi: PeopleApi;
  resetPasswordForm: FormGroup;
  passwordVisibility: boolean;
  confirmPasswordVisibility: boolean;
  passwordChanged: boolean;
  passwordChangeSuccess: boolean;
  passwordChangeFailure: boolean;
  passwordResetStatus: any;

  constructor(private activatedRoute: ActivatedRoute, private apiService: AlfrescoApiService, private router: Router) {}

  get peopleApiInstance() {
    return this.peopleApi || (this.peopleApi = new PeopleApi(this.apiService.getInstance()));
  }

  ngOnInit(): void {
    this.resetPasswordForm = new FormGroup(
      {
        username: new FormControl('', [Validators.required]),
        password: new FormControl('', [Validators.required]),
        confirmPassword: new FormControl('', [Validators.required])
      },
      [this.matchValidator('password', 'confirmPassword')]
    );
    this.passwordChanged = false;
    this.passwordChangeSuccess = false;
    this.passwordChangeFailure = false;
    this.passwordVisibility = false;
    this.confirmPasswordVisibility = false;
  }

  togglePasswordVisibility() {
    this.passwordVisibility = !this.passwordVisibility;
  }

  toggleConfirmPasswordVisibility() {
    this.confirmPasswordVisibility = !this.confirmPasswordVisibility;
  }

  changePassword() {
    let key = '';
    let id = '';
    let userName = '';

    this.activatedRoute.queryParams.subscribe((data) => {
      key = data.key;
      id = data.id;
      userName = this.resetPasswordForm.controls.username.value;
    });

    const resetPassword = this.peopleApiInstance.resetPassword(userName, {
      password: this.resetPasswordForm.controls.password.value,
      id,
      key
    } as PasswordResetBody);

    resetPassword.then((value) => {
      this.passwordResetStatus = value;
      this.passwordChangeSuccess = true;
    });
    resetPassword.catch((error) => {
      this.passwordResetStatus = error;
      this.passwordChangeFailure = true;
    });
  }

  isSubmitButtonDisabled(): boolean {
    if (this.resetPasswordForm.invalid || this.passwordMatchError()) {
      return this.resetPasswordForm.invalid || this.passwordMatchError();
    } else {
      return false;
    }
  }

  passwordMatchError(): boolean {
    return this.resetPasswordForm.getError('mismatch') && this.resetPasswordForm.get('confirmPassword')?.dirty;
  }

  matchValidator(source: string, target: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const sourceCtrl = control.get(source);
      const targetCtrl = control.get(target);

      return sourceCtrl && targetCtrl && sourceCtrl.value !== targetCtrl.value ? { mismatch: true } : null;
    };
  }

  close() {
    this.router.navigate(['./login']);
  }
}
