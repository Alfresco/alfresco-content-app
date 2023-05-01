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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlfrescoApiService, AlfrescoApiServiceMock, CoreModule } from '@alfresco/adf-core';
import { ResetPasswordComponent } from './reset-password.component';
import { AppTestingModule } from '../../testing/app-testing.module';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';

describe('ResetPasswordComponent', () => {
  let component: ResetPasswordComponent;
  let fixture: ComponentFixture<ResetPasswordComponent>;
  const router: any = {
    url: '',
    navigate: jasmine.createSpy('navigate')
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule, CoreModule.forChild()],
      declarations: [ResetPasswordComponent],
      providers: [
        {
          provide: Router,
          useValue: router
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { data: { preferencePrefix: 'prefix' }, paramMap: convertToParamMap({ folderId: undefined }) },
            params: of({ folderId: 'someId' }),
            queryParamMap: of({})
          }
        },
        {
          provide: AlfrescoApiService,
          useClass: AlfrescoApiServiceMock
        }
      ]
    });

    fixture = TestBed.createComponent(ResetPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('change password button should be disabled by default', async () => {
    expect(component.isSubmitButtonDisabled).toBeTruthy();
  });

  it('change password button should be disabled if username field is empty', async () => {
    component.resetPasswordForm.controls['username'].setValue('');
    component.resetPasswordForm.controls['password'].setValue('password');
    component.resetPasswordForm.controls['confirmPassword'].setValue('password');

    expect(component.isSubmitButtonDisabled).toBeTruthy();
  });

  it('change password button should be disabled if new password field is empty', async () => {
    component.resetPasswordForm.controls['username'].setValue('user');
    component.resetPasswordForm.controls['password'].setValue('');
    component.resetPasswordForm.controls['confirmPassword'].setValue('password');

    expect(component.isSubmitButtonDisabled).toBeTruthy();
  });

  it('change password button should be disabled if confirm password field is empty', async () => {
    component.resetPasswordForm.controls['username'].setValue('user');
    component.resetPasswordForm.controls['password'].setValue('password');
    component.resetPasswordForm.controls['confirmPassword'].setValue('');

    expect(component.isSubmitButtonDisabled).toBeTruthy();
  });

  it('change password button should be disabled if new password and confirm password field values do not match', async () => {
    component.resetPasswordForm.controls['username'].setValue('user');
    component.resetPasswordForm.controls['password'].setValue('password1');
    component.resetPasswordForm.controls['confirmPassword'].setValue('password2');

    expect(component.isSubmitButtonDisabled).toBeTruthy();
  });

  it('change password button should be enabled when new password and confirm password field values match and username field is not empty', async () => {
    component.resetPasswordForm.controls['username'].setValue('user');
    component.resetPasswordForm.controls['password'].setValue('password');
    component.resetPasswordForm.controls['confirmPassword'].setValue('password');

    spyOn(component, 'isSubmitButtonDisabled').and.callThrough();
    const changePasswordBtn = fixture.debugElement.nativeElement.querySelector('.change-password-button');

    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.isSubmitButtonDisabled).toHaveBeenCalled();
    expect(changePasswordBtn.disabled).toBeFalsy();
  });

  it('should toggle new password field value visibility when visibility icon is clicked', async () => {
    component.passwordVisibility = false;
    spyOn(component, 'togglePasswordVisibility').and.callThrough();

    const eyeIcon = fixture.debugElement.nativeElement.querySelector('.new-password-visibility-toggle');
    eyeIcon.click();

    expect(component.togglePasswordVisibility).toHaveBeenCalled();
    expect(component.passwordVisibility).toEqual(true);
  });

  it('should toggle confirm password field value visibility when visibility icon is clicked', async () => {
    component.confirmPasswordVisibility = false;
    spyOn(component, 'toggleConfirmPasswordVisibility').and.callThrough();

    const eyeIcon = fixture.debugElement.nativeElement.querySelector('.confirm-password-visibility-toggle');
    eyeIcon.click();

    expect(component.toggleConfirmPasswordVisibility).toHaveBeenCalled();
    expect(component.confirmPasswordVisibility).toEqual(true);
  });

  it('should change password when the change password button is clicked', async () => {
    component.resetPasswordForm.controls['username'].setValue('user');
    component.resetPasswordForm.controls['password'].setValue('password');
    component.resetPasswordForm.controls['confirmPassword'].setValue('password');
    spyOn(component, 'changePassword').and.callThrough();

    const changePasswordBtn = fixture.debugElement.nativeElement.querySelector('.change-password-button');
    changePasswordBtn.dispatchEvent(new Event('click'));

    expect(component.changePassword).toHaveBeenCalled();
  });
});
