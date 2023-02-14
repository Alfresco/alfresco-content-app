/*!
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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
      .then((userInfo) => this.populateForm(userInfo?.entry))
      .catch((error) => throwError(error));
  }

  populateForm(userInfo: Person) {
    this.personDetails = userInfo;
    this.profileForm = new FormGroup({
      jobTitle: new FormControl(userInfo?.jobTitle || ''),
      location: new FormControl(userInfo?.location || ''),
      telephone: new FormControl(userInfo?.telephone || '', [Validators.pattern('^([0-9]+-)*[0-9]+$')]),
      mobile: new FormControl(userInfo?.mobile || '', [Validators.pattern('^([0-9]+-)*[0-9]+$')]),
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
