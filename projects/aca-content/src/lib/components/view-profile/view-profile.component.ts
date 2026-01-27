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

import { AlfrescoApiService } from '@alfresco/adf-content-services';
import { PeopleApi, Person } from '@alfresco/js-api';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, take, throwError } from 'rxjs';
import { AppExtensionService, AppService, UserProfileSection } from '@alfresco/aca-shared';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DynamicExtensionComponent } from '@alfresco/adf-extensions';
import { MatInputModule } from '@angular/material/input';

@Component({
  imports: [
    CommonModule,
    TranslatePipe,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    DynamicExtensionComponent
  ],
  selector: 'app-view-profile',
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ViewProfileComponent implements OnInit {
  peopleApi: PeopleApi;
  profileForm = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    jobTitle: new FormControl(''),
    location: new FormControl(''),
    telephone: new FormControl('', [Validators.pattern('^([0-9]+-)*[0-9]+$')]),
    mobile: new FormControl('', [Validators.pattern('^([0-9]+-)*[0-9]+$')]),
    companyName: new FormControl(''),
    companyPostCode: new FormControl(''),
    companyAddress: new FormControl(''),
    companyTelephone: new FormControl('', [Validators.pattern('^([0-9]+-)*[0-9]+$')]),
    companyEmail: new FormControl('', [Validators.email])
  });
  personDetails: Person;
  generalSectionExpanded = true;
  generalSectionEditMode = false;
  contactSectionExpanded = false;
  contactSectionEditMode = false;
  appNavNarMode$: Observable<'collapsed' | 'expanded'>;
  sections: UserProfileSection[] = [];

  get generalSectionButtonTooltip(): string {
    return `APP.TOOLTIPS.${this.generalSectionExpanded ? 'COLLAPSE' : 'EXPAND'}_SECTION`;
  }

  get contactSectionButtonTooltip(): string {
    return `APP.TOOLTIPS.${this.contactSectionExpanded ? 'COLLAPSE' : 'EXPAND'}_SECTION`;
  }

  constructor(
    private router: Router,
    private readonly apiService: AlfrescoApiService,
    private readonly appService: AppService,
    private readonly extensionService: AppExtensionService
  ) {
    this.peopleApi = new PeopleApi(this.apiService.getInstance());
    this.appNavNarMode$ = appService.appNavNarMode$.pipe(takeUntilDestroyed());
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

    this.extensionService
      .getUserProfileSections()
      .pipe(take(1))
      .subscribe((sections) => (this.sections = sections));
  }

  toggleNavigationMenu() {
    this.appService.toggleAppNavBar$.next();
  }

  populateForm(userInfo: Person) {
    this.profileForm.setValue({
      firstName: userInfo?.firstName || '',
      lastName: userInfo?.lastName || '',
      jobTitle: userInfo?.jobTitle || '',
      location: userInfo?.location || '',
      telephone: userInfo?.telephone || '',
      mobile: userInfo?.mobile || '',
      companyName: userInfo?.company?.organization || '',
      companyPostCode: userInfo?.company?.postcode || '',
      companyAddress: userInfo?.company?.address1 || '',
      companyTelephone: userInfo?.company?.telephone || '',
      companyEmail: userInfo?.company?.email || ''
    });
  }

  navigateToPersonalFiles() {
    this.router.navigate(['/personal-files'], {
      replaceUrl: true
    });
  }

  toggleGeneralSection() {
    this.generalSectionExpanded = !this.generalSectionExpanded;
  }

  toggleGeneralSectionEditMode() {
    this.generalSectionEditMode = !this.generalSectionEditMode;

    if (this.generalSectionEditMode) {
      this.generalSectionExpanded = true;
    }
  }

  onSaveGeneralData(event) {
    this.generalSectionEditMode = false;
    this.updatePersonDetails(event);
  }

  onSaveCompanyData(event) {
    this.contactSectionEditMode = false;
    this.updatePersonDetails(event);
  }

  toggleContactSection() {
    this.contactSectionExpanded = !this.contactSectionExpanded;
  }

  toggleContactSectionEditMode() {
    this.contactSectionEditMode = !this.contactSectionEditMode;

    if (this.contactSectionEditMode) {
      this.contactSectionExpanded = true;
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
