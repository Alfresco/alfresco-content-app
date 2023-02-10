/*
 * Copyright © 2005 - 2021 Alfresco Software, Ltd. All rights reserved.
 *
 * License rights for this program may be obtained from Alfresco Software, Ltd.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
 */
import { AlfrescoApiService } from '@alfresco/adf-core';
import { PeopleApi, Person } from '@alfresco/js-api';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { AppService } from '@alfresco/aca-shared';

@Component({
  selector: 'app-view-profile',
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ViewProfileComponent implements OnInit {
  peopleApi: PeopleApi;

  profileForm: FormGroup;
  personDetails: Person;

  generalSectionDropdown = true;
  generalSectionButtonsToggle = true;

  loginSectionDropdown = false;
  loginSectionButtonsToggle = true;
  passwordSectionDropdown = false;

  contactSectionDropdown = false;
  contactSectionButtonsToggle = true;
  hideSidenav: boolean;

  constructor(private router: Router, apiService: AlfrescoApiService, private appService: AppService) {
    this.peopleApi = new PeopleApi(apiService.getInstance());
  }

  ngOnInit() {
    this.populateForm(this.personDetails);
    this.peopleApi
      .getPerson('-me-')
      .then((userInfo) => {
        this.personDetails = userInfo?.entry;
        this.populateForm(userInfo?.entry);
      })
      .catch((error) => {
        throwError(error);
      });
      this.appService.cast.subscribe((data) => (this.hideSidenav = data));
  }

  populateForm(userInfo: Person) {
    this.profileForm = new FormGroup({
      jobTitle: new FormControl(userInfo?.jobTitle || ''),
      location: new FormControl(userInfo?.location || ''),
      telephone: new FormControl(userInfo?.telephone || '', [Validators.pattern('^([0-9]+-)*[0-9]+$')]),
      mobile: new FormControl(userInfo?.mobile || '', [Validators.pattern('^([0-9]+-)*[0-9]+$')]),
      oldPassword: new FormControl(''),
      newPassword: new FormControl(''),
      verifyPassword: new FormControl(''),
      companyName: new FormControl(userInfo?.company?.organization || ''),
      companyPostCode: new FormControl(userInfo?.company?.postcode || ''),
      companyAddress: new FormControl(userInfo?.company?.address1 || ''),
      companyTelephone: new FormControl(userInfo?.company?.telephone || '', [Validators.pattern('^([0-9]+-)*[0-9]+$')]),
      companyEmail: new FormControl(userInfo?.company?.email || '', [Validators.email])
    });
  }

  navigateToPersonalFiles() {
    this.router.navigate(['/personal-files'], {
      replaceUrl: true
    });
  }

  toggleGeneralDropdown() {
    this.generalSectionDropdown = !this.generalSectionDropdown;

    if (!this.generalSectionDropdown) {
      this.generalSectionButtonsToggle = true;
    }
  }

  toggleGeneralButtons() {
    this.generalSectionButtonsToggle = !this.generalSectionButtonsToggle;

    if (!this.generalSectionButtonsToggle) {
      this.generalSectionDropdown = true;
    }
  }

  onSaveGeneralData(event) {
    this.generalSectionButtonsToggle = !this.generalSectionButtonsToggle;
    this.updatePersonDetails(event);
  }

  onSaveLoginData() {
    this.passwordSectionDropdown = !this.passwordSectionDropdown;
    this.loginSectionButtonsToggle = !this.loginSectionButtonsToggle;
  }

  onSaveCompanyData(event) {
    this.contactSectionButtonsToggle = !this.contactSectionButtonsToggle;
    this.updatePersonDetails(event);
  }

  toggleLoginDropdown() {
    this.loginSectionDropdown = !this.loginSectionDropdown;

    if (!this.loginSectionDropdown) {
      this.loginSectionButtonsToggle = true;
    }
  }

  toggleLoginButtons() {
    this.loginSectionButtonsToggle = !this.loginSectionButtonsToggle;
    this.passwordSectionDropdown = !this.passwordSectionDropdown;

    if (!this.loginSectionButtonsToggle) {
      this.loginSectionDropdown = true;
      this.passwordSectionDropdown = true;
    }
  }

  toggleContactDropdown() {
    this.contactSectionDropdown = !this.contactSectionDropdown;

    if (!this.contactSectionDropdown) {
      this.contactSectionButtonsToggle = true;
    }
  }

  toggleContactButtons() {
    this.contactSectionButtonsToggle = !this.contactSectionButtonsToggle;

    if (!this.contactSectionButtonsToggle) {
      this.contactSectionDropdown = true;
    }
  }

  updatePersonDetails(event) {
    if (this.profileForm.valid) {
      this.peopleApi
        .updatePerson('-me-', {
          jobTitle: event.value.jobTitle,
          location: event.value.location,
          telephone: event.value.telephone,
          mobile: event.value.mobile,
          company: {
            organization: event.value.companyName,
            postcode: event.value.companyPostCode,
            address1: event.value.companyAddress,
            telephone: event.value.companyTelephone,
            email: event.value.companyEmail
          }
        })
        .then((person) => {
          this.personDetails = person?.entry;
          this.populateForm(person?.entry);
        })
        .catch((error) => {
          this.populateForm(this.personDetails);
          throwError(error);
        });
    } else {
      this.populateForm(this.personDetails);
    }
  }

  isSaveButtonDisabled(): boolean {
    return this.profileForm.invalid;
  }
}
