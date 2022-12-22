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
import { CoreModule } from '@alfresco/adf-core';
import { ResetPasswordComponent } from './reset-password.component';
import { AppTestingModule } from '../../testing/app-testing.module';

describe('ResetPasswordComponent', () => {
  let component: ResetPasswordComponent;
  let fixture: ComponentFixture<ResetPasswordComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule, CoreModule.forChild()],
      declarations: [ResetPasswordComponent],
      providers: []
    });

    fixture = TestBed.createComponent(ResetPasswordComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('change password button should be disabled by default', async () => {
    component.ngOnInit();

    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.isSubmitButtonDisabled).toBeTruthy();
  });

  it('change password button should be disabled if new password field is empty', async () => {
    component.ngOnInit();
    component.resetPasswordForm.controls['password'].setValue('');
    component.resetPasswordForm.controls['confirmPassword'].setValue('password');

    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.isSubmitButtonDisabled).toBeTruthy();
  });

  it('change password button should be disabled if confirm password field is empty', async () => {
    component.ngOnInit();
    component.resetPasswordForm.controls['password'].setValue('password');
    component.resetPasswordForm.controls['confirmPassword'].setValue('');

    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.isSubmitButtonDisabled).toBeTruthy();
  });

  it('change password button should be disabled if new password and confirm password field values do not match', async () => {
    component.ngOnInit();
    component.resetPasswordForm.controls['password'].setValue('password1');
    component.resetPasswordForm.controls['confirmPassword'].setValue('password2');

    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.isSubmitButtonDisabled).toBeTruthy();
  });

  it('change password button should be enabled when new password and confirm password field values match', async () => {
    component.ngOnInit();
    fixture.detectChanges();
    await fixture.whenStable();

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
    component.ngOnInit();
    component.passwordVisibility = false;
    spyOn(component, 'togglePasswordVisibility').and.callThrough();

    fixture.detectChanges();
    await fixture.whenStable();

    const eyeIcon = fixture.debugElement.nativeElement.querySelector('.new-password-input-container > button');
    eyeIcon.click();

    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.togglePasswordVisibility).toHaveBeenCalled();
    expect(component.passwordVisibility).toEqual(true);
  });

  it('should toggle confirm password field value visibility when visibility icon is clicked', async () => {
    component.ngOnInit();
    component.confirmPasswordVisibility = false;
    spyOn(component, 'toggleConfirmPasswordVisibility').and.callThrough();

    fixture.detectChanges();
    await fixture.whenStable();

    const eyeIcon = fixture.debugElement.nativeElement.querySelector('.confirm-password-input-container > button');
    eyeIcon.click();

    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.toggleConfirmPasswordVisibility).toHaveBeenCalled();
    expect(component.confirmPasswordVisibility).toEqual(true);
  });

  it('should change password when the change password button is clicked', async () => {
    component.ngOnInit();
    component.resetPasswordForm.controls['password'].setValue('password');
    component.resetPasswordForm.controls['confirmPassword'].setValue('password');
    spyOn(component, 'changePassword').and.callThrough();

    fixture.detectChanges();
    await fixture.whenStable();

    const changePasswordBtn = fixture.debugElement.nativeElement.querySelector('.change-password-button');
    changePasswordBtn.dispatchEvent(new Event('click'));

    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.changePassword).toHaveBeenCalled();
  });
});
