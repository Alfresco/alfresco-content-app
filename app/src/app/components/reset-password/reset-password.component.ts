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
import { ActivatedRoute } from '@angular/router';

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

  constructor(private activatedRoute: ActivatedRoute, private apiService: AlfrescoApiService) {}

  get peopleApiInstance() {
    return this.peopleApi || (this.peopleApi = new PeopleApi(this.apiService.getInstance()));
  }

  ngOnInit(): void {
    this.resetPasswordForm = new FormGroup(
      {
        password: new FormControl('', [Validators.required]),
        confirmPassword: new FormControl('', [Validators.required])
      },
      [this.matchValidator('password', 'confirmPassword')]
    );
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
      userName = data.userName;
    });

    this.peopleApiInstance.resetPassword(userName, {
      password: this.resetPasswordForm.controls.password.value,
      id,
      key
    } as PasswordResetBody);
  }

  isSubmitButtonDisabled(): boolean {
    return this.resetPasswordForm.invalid || this.passwordMatchError();
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
}
