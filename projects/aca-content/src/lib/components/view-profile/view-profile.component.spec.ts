/*!
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

  it('should expand only general section by default', async () => {
    expect(component.generalSectionExpanded).toBe(true);
    expect(component.contactSectionExpanded).toBe(false);
  });

  it('should toggle the appService toggleAppNavBar$ Subject', () => {
    spyOn(appServiceMock.toggleAppNavBar$, 'next');
    component.toggleNavigationMenu();
    expect(appServiceMock.toggleAppNavBar$.next).toHaveBeenCalled();
  });

  it('should disable save button if form is invalid', () => {
    component.ngOnInit();
    const profileFormGroup = component.profileForm;

    profileFormGroup.setValue({
      firstName: 'John',
      lastName: 'Doe',
      jobTitle: 'Developer',
      location: 'US',
      telephone: '2744245',
      mobile: 'invalid',
      companyName: 'test Name',
      companyPostCode: '12345',
      companyAddress: 'test address',
      companyTelephone: '27442266',
      companyEmail: 'email@test.com'
    });

    expect(profileFormGroup.valid).toEqual(false);
    expect(component.isSaveButtonDisabled()).toBeTrue();

    profileFormGroup.setValue({
      firstName: 'John',
      lastName: 'Doe',
      jobTitle: 'Developer',
      location: 'US',
      telephone: '274-424-55',
      mobile: '886-632-2112',
      companyName: 'test Name',
      companyPostCode: '12345',
      companyAddress: 'test address',
      companyTelephone: '274-42-266',
      companyEmail: 'invalid'
    });

    expect(profileFormGroup.valid).toEqual(false);
    expect(component.isSaveButtonDisabled()).toBeTrue();

    profileFormGroup.setValue({
      firstName: 'John',
      lastName: 'Doe',
      jobTitle: 'Developer',
      location: 'US',
      telephone: 'invalid',
      mobile: '886-632-2112',
      companyName: 'test Name',
      companyPostCode: '12345',
      companyAddress: 'test address',
      companyTelephone: '274-42-266',
      companyEmail: 'test@test.com'
    });

    expect(profileFormGroup.valid).toEqual(false);
    expect(component.isSaveButtonDisabled()).toBeTrue();
  });

  it('should enable save button if form has valid inputs', () => {
    component.ngOnInit();
    const profileFormGroup = component.profileForm;

    profileFormGroup.setValue({
      firstName: 'John',
      lastName: 'Doe',
      jobTitle: 'Developer',
      location: 'US',
      telephone: '274-422-55',
      mobile: '886-632-2112',
      companyName: 'testCompany',
      companyPostCode: '12345',
      companyAddress: 'test address',
      companyTelephone: '274-22-66',
      companyEmail: 'testEmail@test.com'
    });

    expect(profileFormGroup.valid).toEqual(true);
    expect(component.isSaveButtonDisabled()).toBeFalse();
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

  it('should navigate to personal files when go to personal files button is clicked', async () => {
    spyOn(router, 'navigate');
    await unitTestingUtils.clickMatButtonByCSS('.app-profile-icon');

    expect(router.navigate).toHaveBeenCalledWith(['/personal-files'], { replaceUrl: true });
  });

  it('should render additional user profile sections if provided', () => {
    spyOn(appExtensionService, 'getUserProfileSections').and.returnValue(of([{ id: 'test-section' }]));
    fixture.detectChanges();

    expect(component.sections.length).toBe(1);
    expect(unitTestingUtils.getByDirective(DynamicExtensionComponent)).toBeDefined();
  });
});
