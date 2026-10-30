/*!
 * Copyright © 2005-2026 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ViewProfileComponent } from './view-profile.component';
import { AppTestingModule } from '../../testing/app-testing.module';
import { Router } from '@angular/router';
import { BehaviorSubject, of, Subject } from 'rxjs';
import { AppExtensionService, AppService } from '@alfresco/aca-shared';
import { UnitTestingUtils } from '@alfresco/adf-core';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { HarnessLoader } from '@angular/cdk/testing';
import { DynamicExtensionComponent } from '@alfresco/adf-extensions';

describe('ViewProfileComponent', () => {
  let fixture: ComponentFixture<ViewProfileComponent>;
  let component: ViewProfileComponent;
  let router: Router;
  let unitTestingUtils: UnitTestingUtils;
  let loader: HarnessLoader;
  let appExtensionService: AppExtensionService;

  const appServiceMock = {
    toggleAppNavBar$: new Subject(),
    appNavNarMode$: new BehaviorSubject<'collapsed' | 'expanded'>('expanded')
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule, ViewProfileComponent],
      providers: [
        {
          provide: AppService,
          useValue: appServiceMock
        }
      ]
    });

    fixture = TestBed.createComponent(ViewProfileComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    loader = TestbedHarnessEnvironment.loader(fixture);
    unitTestingUtils = new UnitTestingUtils(fixture.debugElement, loader);
    appExtensionService = TestBed.inject(AppExtensionService);
    router.initialNavigation();
  });

  const isSaveButtonDisabled = async (section: 'general' | 'contact'): Promise<boolean> => {
    const saveButton = await unitTestingUtils.button.getByCSS(`#${section}-dropdown .app-general-save-btn`);

    return saveButton.isDisabled();
  };

  it('should expand only general section by default', async () => {
    expect(component.generalSectionExpanded).toBe(true);
    expect(component.contactSectionExpanded).toBe(false);
  });

  it('should toggle the appService toggleAppNavBar$ Subject', () => {
    spyOn(appServiceMock.toggleAppNavBar$, 'next');
    component.toggleNavigationMenu();
    expect(appServiceMock.toggleAppNavBar$.next).toHaveBeenCalled();
  });

  it('should show telephone number and phone number format hint of general details', () => {
    component.generalSectionEditMode = true;
    fixture.detectChanges();

    const telephoneHint = unitTestingUtils.getByDataAutomationId('app-telephone-number-hint');
    expect(telephoneHint.nativeElement.innerText.trim()).toBe('APP.EDIT_PROFILE.VALID_PHONE_FORMAT');

    const phoneNumberHint = unitTestingUtils.getByDataAutomationId('app-phone-number-hint');
    expect(phoneNumberHint.nativeElement.innerText.trim()).toBe('APP.EDIT_PROFILE.VALID_PHONE_FORMAT');
  });

  it('should not show phone number format hint of general details field if the user is not in edit mode', () => {
    component.generalSectionEditMode = false;
    fixture.detectChanges();

    const telephoneHint = unitTestingUtils.getByDataAutomationId('app-telephone-number-hint');
    expect(telephoneHint).toBeNull();
  });

  it('should show phone number format hint of general details field if the user is in edit mode', () => {
    component.generalSectionEditMode = true;
    fixture.detectChanges();

    const telephoneHint = unitTestingUtils.getByDataAutomationId('app-telephone-number-hint');
    expect(telephoneHint).not.toBeNull();
  });

  it('should not show the telephone number format hint of company details field if the company details is not expanded', () => {
    component.contactSectionExpanded = false;
    fixture.detectChanges();

    const telephoneHint = unitTestingUtils.getByDataAutomationId('app-company-telephone-number-hint');
    expect(telephoneHint).toBeNull();
  });

  it('should not show the telephone number format hint of company details field if the company details is expanded but user is not in edit mode', () => {
    component.contactSectionExpanded = true;
    component.contactSectionEditMode = false;
    fixture.detectChanges();

    const telephoneHint = unitTestingUtils.getByDataAutomationId('app-company-telephone-number-hint');
    expect(telephoneHint).toBeNull();
  });

  it('should show the telephone number format hint of company details field if the company details is expanded and user is in edit mode', () => {
    component.contactSectionExpanded = true;
    component.contactSectionEditMode = true;
    fixture.detectChanges();

    const telephoneHint = unitTestingUtils.getByDataAutomationId('app-company-telephone-number-hint');
    expect(telephoneHint).not.toBeNull();
  });

  it('should disable save buttons if form is invalid', async () => {
    fixture.detectChanges();

    unitTestingUtils.clickByCSS('#general-dropdown .app-general-edit');
    unitTestingUtils.clickByCSS('#contact-dropdown .app-general-edit');
    fixture.detectChanges();

    const profileFormGroup = component.profileForm;

    profileFormGroup.setValue({
      general: { firstName: 'John', lastName: 'Doe', jobTitle: 'Developer', location: 'US', telephone: '2744245', mobile: 'invalid' },
      company: {
        companyName: 'test Name',
        companyPostCode: '12345',
        companyAddress: 'test address',
        companyTelephone: '27442266',
        companyEmail: 'email@test.com'
      }
    });

    await expect(profileFormGroup.valid).toEqual(false);
    expect(await isSaveButtonDisabled('general')).toBeTrue();
    expect(await isSaveButtonDisabled('contact')).toBeTrue();

    profileFormGroup.setValue({
      general: { firstName: 'John', lastName: 'Doe', jobTitle: 'Developer', location: 'US', telephone: '274-424-55', mobile: '886-632-2112' },
      company: {
        companyName: 'test Name',
        companyPostCode: '12345',
        companyAddress: 'test address',
        companyTelephone: '274-42-266',
        companyEmail: 'invalid'
      }
    });

    await expect(profileFormGroup.valid).toEqual(false);
    expect(await isSaveButtonDisabled('general')).toBeTrue();
    expect(await isSaveButtonDisabled('contact')).toBeTrue();

    profileFormGroup.setValue({
      general: { firstName: 'John', lastName: 'Doe', jobTitle: 'Developer', location: 'US', telephone: 'invalid', mobile: '886-632-2112' },
      company: {
        companyName: 'test Name',
        companyPostCode: '12345',
        companyAddress: 'test address',
        companyTelephone: '274-42-266',
        companyEmail: 'test@test.com'
      }
    });

    await expect(profileFormGroup.valid).toEqual(false);
    expect(await isSaveButtonDisabled('general')).toBeTrue();
    expect(await isSaveButtonDisabled('contact')).toBeTrue();
  });

  it('should enable save buttons if form has valid inputs', async () => {
    fixture.detectChanges();

    unitTestingUtils.clickByCSS('#general-dropdown .app-general-edit');
    unitTestingUtils.clickByCSS('#contact-dropdown .app-general-edit');
    fixture.detectChanges();

    const profileFormGroup = component.profileForm;

    profileFormGroup.setValue({
      general: { firstName: 'John', lastName: 'Doe', jobTitle: 'Developer', location: 'US', telephone: '274-422-55', mobile: '886-632-2112' },
      company: {
        companyName: 'testCompany',
        companyPostCode: '12345',
        companyAddress: 'test address',
        companyTelephone: '274-22-66',
        companyEmail: 'testEmail@test.com'
      }
    });

    await expect(profileFormGroup.valid).toEqual(true);
    expect(await isSaveButtonDisabled('general')).toBeFalse();
    expect(await isSaveButtonDisabled('contact')).toBeFalse();
  });

  it('should expand or compress general dropdown when arrow button is clicked', () => {
    spyOn(component, 'toggleGeneralSection').and.callThrough();
    component.generalSectionExpanded = false;
    fixture.detectChanges();

    unitTestingUtils.clickByCSS('#general-dropdown button');

    expect(component.toggleGeneralSection).toHaveBeenCalled();
    expect(component.generalSectionExpanded).toBe(true);
  });

  it('should expand or compress contact dropdown when arrow button is clicked', () => {
    spyOn(component, 'toggleContactSection').and.callThrough();
    component.contactSectionExpanded = false;
    fixture.detectChanges();

    unitTestingUtils.clickByCSS('#contact-dropdown button');

    expect(component.toggleContactSection).toHaveBeenCalled();
    expect(component.contactSectionExpanded).toBe(true);
  });

  it('should toggle form view when edit or cancel buttons is clicked for general form', () => {
    spyOn(component, 'toggleGeneralSectionEditMode').and.callThrough();
    fixture.detectChanges();

    unitTestingUtils.clickByCSS('#general-dropdown .app-general-edit');
    fixture.detectChanges();

    unitTestingUtils.clickByCSS('#general-dropdown .app-general-cancel-btn');

    expect(component.toggleGeneralSectionEditMode).toHaveBeenCalledTimes(2);
  });

  it('should toggle form view when edit or cancel buttons is clicked for contact form', () => {
    spyOn(component, 'toggleContactSectionEditMode').and.callThrough();
    fixture.detectChanges();

    unitTestingUtils.clickByCSS('#contact-dropdown .app-general-edit');
    fixture.detectChanges();

    unitTestingUtils.clickByCSS('#contact-dropdown .app-general-cancel-btn');

    expect(component.toggleContactSectionEditMode).toHaveBeenCalledTimes(2);
  });

  it('should keep all the form controls disabled when no section is in edit mode', () => {
    fixture.detectChanges();

    expect(component.profileForm.disabled).toBeTrue();
  });

  it('should only enable the general section controls when general section is in edit mode', () => {
    fixture.detectChanges();

    unitTestingUtils.clickByCSS('#general-dropdown .app-general-edit');
    fixture.detectChanges();

    expect(component.profileForm.controls.general.controls.jobTitle.enabled).toBeTrue();
    expect(component.profileForm.controls.company.disabled).toBeTrue();

    unitTestingUtils.clickByCSS('#general-dropdown .app-general-cancel-btn');
    fixture.detectChanges();

    expect(component.profileForm.disabled).toBeTrue();
  });

  it('should never enable first and last name controls', () => {
    fixture.detectChanges();

    unitTestingUtils.clickByCSS('#general-dropdown .app-general-edit');
    fixture.detectChanges();

    expect(component.profileForm.controls.general.controls.firstName.disabled).toBeTrue();
    expect(component.profileForm.controls.general.controls.lastName.disabled).toBeTrue();
  });

  it('should only enable the company section controls when company section is in edit mode', () => {
    fixture.detectChanges();

    unitTestingUtils.clickByCSS('#contact-dropdown .app-general-edit');
    fixture.detectChanges();

    expect(component.profileForm.controls.company.enabled).toBeTrue();
    expect(component.profileForm.controls.general.disabled).toBeTrue();

    unitTestingUtils.clickByCSS('#contact-dropdown .app-general-cancel-btn');
    fixture.detectChanges();

    expect(component.profileForm.disabled).toBeTrue();
  });

  it('should navigate to personal files when go to personal files button is clicked', async () => {
    spyOn(router, 'navigate');
    await unitTestingUtils.button.clickByCSS('.app-profile-icon');

    expect(router.navigate).toHaveBeenCalledWith(['/personal-files'], { replaceUrl: true });
  });

  it('should render additional user profile sections if provided', () => {
    spyOn(appExtensionService, 'getUserProfileSections').and.returnValue(of([{ id: 'test-section' }]));
    fixture.detectChanges();

    expect(component.sections.length).toBe(1);
    expect(unitTestingUtils.getByDirective(DynamicExtensionComponent)).toBeDefined();
  });
});
