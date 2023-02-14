/*
 * Copyright © 2005 - 2021 Alfresco Software, Ltd. All rights reserved.
 *
 * License rights for this program may be obtained from Alfresco Software, Ltd.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
 */
import { AlfrescoApiService, AppConfigService } from '@alfresco/adf-core';
import { PeopleApi, Person } from '@alfresco/js-api';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-view-profile',
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: { class: 'app-view-profile' }
})
export class ViewProfileComponent implements OnInit {
  private _peopleApi: PeopleApi;

  get peopleApi(): PeopleApi {
    return this._peopleApi ?? (this._peopleApi = new PeopleApi(this.apiService.getInstance()));
  }

  profileForm: FormGroup;
  personDetails: Person;

  generalSectionDropdown = true;
  generalSectionButtonsToggle = true;

  contactSectionDropdown = false;
  contactSectionButtonsToggle = true;

  landingPage: string;

  constructor(private apiService: AlfrescoApiService, private appConfigService: AppConfigService) {
    this.landingPage = this.appConfigService.get('landingPage', '/personal-files');
  }

  ngOnInit() {
    this.peopleApi
      .getPerson('-me-')
      .then((userInfo) => {
        this.personDetails = userInfo?.entry;
        this.populateForm(userInfo?.entry);
      })
      .catch((error) => {
        throwError(error);
      });
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

  toggleGeneralDropdown() {
    this.generalSectionDropdown = !this.generalSectionDropdown;
    this.generalSectionButtonsToggle = true;
  }

  toggleGeneralButtons() {
    this.generalSectionButtonsToggle = !this.generalSectionButtonsToggle;
    this.generalSectionDropdown = true;
  }

  onSaveGeneralData(event) {
    this.generalSectionButtonsToggle = !this.generalSectionButtonsToggle;
    this.updatePersonDetails(event);
  }

  onSaveCompanyData(event) {
    this.contactSectionButtonsToggle = !this.contactSectionButtonsToggle;
    this.updatePersonDetails(event);
  }

  toggleContactDropdown() {
    this.contactSectionDropdown = !this.contactSectionDropdown;
    this.contactSectionButtonsToggle = true;
  }

  toggleContactButtons() {
    this.contactSectionButtonsToggle = !this.contactSectionButtonsToggle;
    this.contactSectionDropdown = true;
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
