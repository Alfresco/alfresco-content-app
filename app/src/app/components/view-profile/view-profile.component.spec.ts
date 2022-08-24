/*
 * Copyright © 2005 - 2021 Alfresco Software, Ltd. All rights reserved.
 *
 * License rights for this program may be obtained from Alfresco Software, Ltd.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
 */
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AppConfigModule } from '@alfresco/adf-core';
import { ViewProfileComponent } from './view-profile.component';
import { AppTestingModule } from '../../testing/app-testing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('ViewProfileComponent', () => {
  let fixture: ComponentFixture<ViewProfileComponent>;
  let component: ViewProfileComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule, AppConfigModule, FormsModule, ReactiveFormsModule],
      declarations: [ViewProfileComponent]
    });

    fixture = TestBed.createComponent(ViewProfileComponent);
    component = fixture.componentInstance;
  });

  it('default login and company dropdown remains close', async () => {
    expect(component.loginSectionDropdown).toBe(false);
    expect(component.contactSectionDropdown).toBe(false);
  });

  it('save button is disabled if form has invalid mobile number', () => {
    component.ngOnInit();
    const profileFormGroup = component.profileForm;

    profileFormGroup.setValue({
      jobTitle: "Developer",
      location: "US",
      telephone: "2744245",
      mobile: "AB8866322112",
      oldPassword: "admin@123",
      newPassword: "admin@1234",
      verifyPassword: "admin@1234",
      companyName: "test Name",
      companyPostCode: "12345",
      companyAddress: "test address",
      companyTelephone: "27442266",
      companyEmail: "email@test.com"
    });

    expect(profileFormGroup.valid).toEqual(false);
    expect(component.isSaveButtonDisabled()).toBeTruthy();
   });

   it('save button is disabled if form has invalid email', () => {
    component.ngOnInit();
    const profileFormGroup = component.profileForm;

    profileFormGroup.setValue({
      jobTitle: "Developer",
      location: "US",
      telephone: "27442445",
      mobile: "457554",
      oldPassword: "admin@123",
      newPassword: "admin@1234",
      verifyPassword: "admin@1234",
      companyName: "test Name",
      companyPostCode: "12345",
      companyAddress: "test address",
      companyTelephone: "27442266",
      companyEmail: "email"
    });

    expect(profileFormGroup.valid).toEqual(false);
    expect(component.isSaveButtonDisabled()).toBeTruthy();
   });


   it('save button is enabled if form has valid inputs', () => {
    component.ngOnInit();
    const profileFormGroup = component.profileForm;

    profileFormGroup.setValue({
      jobTitle: "Developer",
      location: "US",
      telephone: "274-422-55",
      mobile: "886-632-2112",
      oldPassword: "test@123",
      newPassword: "test@1234",
      verifyPassword: "test@1234",
      companyName: "testCompany",
      companyPostCode: "12345",
      companyAddress: "test address",
      companyTelephone: "274-22-66",
      companyEmail: "testEmail@test.com"
    });

    expect(profileFormGroup.valid).toEqual(true);
    expect(component.isSaveButtonDisabled()).toBeFalsy();
   });
});
