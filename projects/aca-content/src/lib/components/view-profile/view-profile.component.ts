/*!
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { AlfrescoApiService } from '@alfresco/adf-core';
import { PeopleApi, Person } from '@alfresco/js-api';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subject, throwError } from 'rxjs';
import { AppService } from '@alfresco/aca-shared';
import { takeUntil } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  standalone: true,
  imports: [CommonModule, TranslateModule, ReactiveFormsModule, MatButtonModule, MatIconModule, MatDividerModule, MatFormFieldModule],
  selector: 'app-view-profile',
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ViewProfileComponent implements OnInit, OnDestroy {
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
  appNavNarMode$: Observable<'collapsed' | 'expanded'>;
  private onDestroy$ = new Subject<boolean>();

  constructor(private router: Router, apiService: AlfrescoApiService, private appService: AppService) {
    this.peopleApi = new PeopleApi(apiService.getInstance());
    this.appNavNarMode$ = appService.appNavNarMode$.pipe(takeUntil(this.onDestroy$));
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
  }

  toggleClick() {
    this.appService.toggleAppNavBar$.next();
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

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }
}
