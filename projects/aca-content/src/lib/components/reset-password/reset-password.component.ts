/*
 * Copyright © 2005 - 2021 Alfresco Software, Ltd. All rights reserved.
 *
 * License rights for this program may be obtained from Alfresco Software, Ltd.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
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
    //this.passwordChangeSuccess = true;
    //this.passwordChangeFailure = true;
    let key = '';
    let id = '';
    let userName = '';

    this.activatedRoute.queryParams.subscribe((data) => {
      key = data.key;
      id = data.id;
      // userName = data.userName;
      userName = this.resetPasswordForm.controls.username.value;
    });

    let resetPassword = this.peopleApi.resetPassword(userName, {
      password: this.resetPasswordForm.controls.password.value,
      id,
      key
    } as PasswordResetBody);

    resetPassword.then((value) => {
      console.log('resolved', value);
      this.passwordChangeSuccess = true;
    });
    resetPassword.catch((error) => {
      console.log('rejected', error);
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
