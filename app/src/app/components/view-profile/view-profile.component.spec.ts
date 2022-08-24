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

  it('Save Button is Disabled if Profile Form has invalid inputs.', () => {
    component.ngOnInit();
    const profileFormGroup = component.profileForm;

    profileFormGroup.setValue({
      jobTitle: "Developer",
      location: "Kolkata",
      telephone: "27442ABC", //invalid format
      mobile: "AB8866322112", //invalid format
      oldPassword: "admin@123",
      newPassword: "admin@1234",
      verifyPassword: "admin@1234",
      companyName: "Hyland",
      companyPostCode: "12345",
      companyAddress: "Hyland Software, Kolkata, West Bengal",
      companyTelephone: "27442266",
      companyEmail: "HylandContact" //invalid format
    });

    expect(profileFormGroup.valid).toEqual(false);
    expect(component.isSaveButtonDisabled()).toBeTruthy();

   });

   it('Save Button is Enabled if Profile Form has valid inputs.', () => {
    component.ngOnInit();
    const profileFormGroup = component.profileForm;
    profileFormGroup.setValue({
      jobTitle: "Developer",
      location: "Kolkata",
      telephone: "27442255", //valid format
      mobile: "8866322112", //valid format
      oldPassword: "admin@123",
      newPassword: "admin@1234",
      verifyPassword: "admin@1234",
      companyName: "Hyland",
      companyPostCode: "12345",
      companyAddress: "Hyland Software, Kolkata, West Bengal",
      companyTelephone: "27442266", //valid format
      companyEmail: "HylandContact@hyland.com" //valid format
    });

    expect(profileFormGroup.valid).toEqual(true);
    expect(component.isSaveButtonDisabled()).toBeFalsy();

   });
});
