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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthenticationService } from '@alfresco/adf-core';
import { PeopleContentService } from '@alfresco/adf-content-services';
import { UserInfoComponent } from './user-info.component';
import { AppTestingModule } from '../../../testing/app-testing.module';
import { of } from 'rxjs';

describe('UserInfoComponent', () => {
  let component: UserInfoComponent;
  let fixture: ComponentFixture<UserInfoComponent>;
  let authServiceStub: Partial<AuthenticationService>;
  let peopleContentServiceStub: Partial<PeopleContentService>;
  let identityUserServiceStub: Partial<PeopleContentService>;

  beforeEach(() => {
    authServiceStub = {
      isOauth: () => true,
      isECMProvider: () => true,
      isEcmLoggedIn: () => true,
      isKerberosEnabled: () => false,
      isLoggedIn: () => true
    };

    peopleContentServiceStub = {
      getCurrentUserInfo: () =>
        of({
          firstName: 'John',
          email: 'john@example.com',
          id: 'johnDoe1',
          enabled: true,
          company: {
            organization: 'ABC Organization',
            address1: 'XYZ Road',
            address2: 'Ohio',
            address3: 'Westlake',
            postcode: '44145',
            telephone: '456876',
            fax: '323984',
            email: 'contact.us@abc.com'
          },
          isAdmin: () => true
        })
    };

    identityUserServiceStub = {
      getCurrentUserInfo: () =>
        of({
          firstName: 'John',
          email: 'john@example.com',
          id: 'johnDoe1',
          enabled: true,
          company: {
            organization: 'ABC Organization',
            address1: 'XYZ Road',
            address2: 'Ohio',
            address3: 'Westlake',
            postcode: '44145',
            telephone: '456876',
            fax: '323984',
            email: 'contact.us@abc.com'
          },
          isAdmin: () => true
        })
    };

    TestBed.configureTestingModule({
      imports: [AppTestingModule],
      declarations: [UserInfoComponent],
      providers: [
        { provide: AuthenticationService, useValue: authServiceStub },
        { provide: PeopleContentService, useValue: peopleContentServiceStub },
        { provide: identityUserServiceStub, useValue: identityUserServiceStub }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should check if user is logged in', async () => {
    const loggedIn = component.isLoggedIn;
    expect(loggedIn).toBeTrue();
  });

  it('should parse display name without email', async () => {
    const model = { firstName: 'John' };
    const displayName = component['parseDisplayName'](model);
    expect(displayName).toBe('John');
  });

  it('should parse display name with email', async () => {
    const model = { firstName: 'John', email: 'john@example.com' };
    const displayName = component['parseDisplayName'](model);
    expect(displayName).toBe('John (john@example.com)');
  });
});
