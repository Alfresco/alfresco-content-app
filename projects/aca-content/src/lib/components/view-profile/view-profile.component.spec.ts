/*
 * Copyright © 2005 - 2021 Alfresco Software, Ltd. All rights reserved.
 *
 * License rights for this program may be obtained from Alfresco Software, Ltd.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
 */
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ViewProfileComponent } from './view-profile.component';
import { AppTestingModule } from '../../testing/app-testing.module';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ViewProfileModule } from './view-profile.module';

describe('ViewProfileComponent', () => {
  let fixture: ComponentFixture<ViewProfileComponent>;
  let component: ViewProfileComponent;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule, ViewProfileModule]
    });

    fixture = TestBed.createComponent(ViewProfileComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    router.initialNavigation();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should company dropdown remains close', async () => {
    expect(component.contactSectionDropdown).toBe(false);
  });

  it('should save button is disabled if form has invalid mobile number', async () => {
    spyOn(component.peopleApi, 'getPerson').and.returnValue(
      Promise.resolve({
        entry: {
          id: 'user1',
          firstName: 'User1',
          lastName: 'User1',
          email: 'user1@company.com',
          enabled: true,
          jobTitle: 'Developer',
          location: 'US',
          telephone: '2744245',
          mobile: 'AB8866322112',
          company: {
            organization: 'test Name',
            postcode: '12345',
            address1: 'test address',
            telephone: '27442266',
            email: 'email@test.com'
          }
        }
      })
    );

    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.profileForm.valid).toEqual(false);
    expect(component.isSaveButtonDisabled()).toBeTruthy();
  });

  it('should save button is disabled if form has invalid email', async () => {
    spyOn(component.peopleApi, 'getPerson').and.returnValue(
      Promise.resolve({
        entry: {
          id: 'user1',
          firstName: 'User1',
          lastName: 'User1',
          email: 'user1@company.com',
          enabled: true,
          jobTitle: 'Developer',
          location: 'US',
          telephone: '2744245',
          mobile: 'AB8866322112',
          company: {
            organization: 'test Name',
            postcode: '12345',
            address1: 'test address',
            telephone: '27442266',
            email: 'email'
          }
        }
      })
    );

    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.profileForm.valid).toEqual(false);
    expect(component.isSaveButtonDisabled()).toBeTruthy();
  });

  it('should enable save button if form is valid', async () => {
    spyOn(component.peopleApi, 'getPerson').and.returnValue(
      Promise.resolve({
        entry: {
          id: 'user1',
          firstName: 'User1',
          lastName: 'User1',
          email: 'user1@company.com',
          enabled: true,
          jobTitle: 'Developer',
          location: 'US',
          telephone: '274-422-55',
          mobile: '886-632-2112',
          company: {
            organization: 'testCompany',
            postcode: '12345',
            address1: 'test address',
            telephone: '274-22-66',
            email: 'testEmail@test.com'
          }
        }
      })
    );

    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.profileForm.valid).toEqual(true);
    expect(component.isSaveButtonDisabled()).toBeFalsy();
  });

  it('should expand or compress general dropdown when arrow button is clicked', () => {
    component.populateForm({} as any);
    spyOn(component, 'toggleGeneralDropdown').and.callThrough();
    component.generalSectionDropdown = false;
    fixture.detectChanges();

    const generalToggleIcon = fixture.debugElement.query(By.css('#toggle-general-dropdown'));
    generalToggleIcon.triggerEventHandler('click', null);

    expect(component.toggleGeneralDropdown).toHaveBeenCalled();
    expect(component.generalSectionButtonsToggle).toBe(true);
  });

  it('should expand or compress contact dropdown when arrow button is clicked', () => {
    component.populateForm({} as any);
    spyOn(component, 'toggleContactDropdown').and.callThrough();
    component.contactSectionDropdown = false;
    fixture.detectChanges();

    const contactToggleIcon = fixture.debugElement.query(By.css('#toggle-contact-dropdown'));
    contactToggleIcon.triggerEventHandler('click', null);

    expect(component.toggleContactDropdown).toHaveBeenCalled();
    expect(component.contactSectionButtonsToggle).toBe(true);
  });

  it('should toggle form view when edit or cancel buttons is clicked for general form', () => {
    component.populateForm({} as any);
    spyOn(component, 'toggleGeneralButtons').and.callThrough();
    fixture.detectChanges();

    const generalEditButton = fixture.debugElement.query(By.css('#general-edit-button'));
    generalEditButton.triggerEventHandler('click', null);
    fixture.detectChanges();

    const generalCancelButton = fixture.debugElement.query(By.css('#general-cancel-button'));
    generalCancelButton.triggerEventHandler('click', null);

    expect(component.toggleGeneralButtons).toHaveBeenCalledTimes(2);
  });

  it('should toggle form view when edit or cancel buttons is clicked for contact form', () => {
    component.populateForm({} as any);
    spyOn(component, 'toggleContactButtons').and.callThrough();
    fixture.detectChanges();

    const contactEditButton = fixture.debugElement.query(By.css('#contact-edit-button'));
    contactEditButton.triggerEventHandler('click', null);
    fixture.detectChanges();

    const contactCancelButton = fixture.debugElement.query(By.css('#contact-cancel-button'));
    contactCancelButton.triggerEventHandler('click', null);

    expect(component.toggleContactButtons).toHaveBeenCalledTimes(2);
  });
});
