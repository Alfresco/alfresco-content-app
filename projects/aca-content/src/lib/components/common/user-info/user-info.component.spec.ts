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
import { AuthenticationService, IdentityUserService } from '@alfresco/adf-core';
import { PeopleContentService } from '@alfresco/adf-content-services';
import { UserInfoComponent } from './user-info.component';
import { AppTestingModule } from '../../../testing/app-testing.module';
import { of } from 'rxjs';

describe('UserInfoComponent', () => {
  let component: UserInfoComponent;
  let fixture: ComponentFixture<UserInfoComponent>;
  let authServiceStub: Partial<AuthenticationService>;
  let peopleContentServiceStub: Partial<PeopleContentService>;
  let identityUserServiceStub: Partial<IdentityUserService>;

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
      getCurrentUserInfo: () => ({
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
      imports: [AppTestingModule, UserInfoComponent],
      providers: [
        { provide: AuthenticationService, useValue: authServiceStub },
        { provide: PeopleContentService, useValue: peopleContentServiceStub },
        { provide: IdentityUserService, useValue: identityUserServiceStub }
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

  it('should return an object with empty strings for all properties when the input model is empty', () => {
    const result = component.parseDisplayName({});
    expect(result.firstName).toEqual('');
    expect(result.initials).toEqual('');
    expect(result.email).toEqual('');
  });

  it('should return an object with the correct firstName and initials when the input model has only the firstName property', () => {
    const result = component.parseDisplayName({ firstName: 'John' });
    expect(result.firstName).toEqual('John');
    expect(result.initials).toEqual('J');
    expect(result.email).toEqual('');
  });

  it('should return an object with the correct firstName and initials when the input model has only the lastName property', () => {
    const result = component.parseDisplayName({ lastName: 'Doe' });
    expect(result.firstName).toEqual(' Doe');
    expect(result.initials).toEqual('D');
    expect(result.email).toEqual('');
  });

  it('should return an object with the correct email property when the input model has only the email property', () => {
    const result = component.parseDisplayName({ email: 'john.doe@example.com' });
    expect(result.firstName).toEqual('');
    expect(result.initials).toEqual('');
    expect(result.email).toEqual('john.doe@example.com');
  });

  it('should return an object with the correct firstName, initials, and lastName concatenated when the input model has both firstName and lastName properties', () => {
    const result = component.parseDisplayName({ firstName: 'John', lastName: 'Doe' });
    expect(result.firstName).toEqual('John Doe');
    expect(result.initials).toEqual('JD');
    expect(result.email).toEqual('');
  });

  it('should return an object with all properties correctly parsed when the input model has all three properties', () => {
    const result = component.parseDisplayName({ firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com' });
    expect(result.firstName).toEqual('John Doe');
    expect(result.initials).toEqual('JD');
    expect(result.email).toEqual('john.doe@example.com');
  });
});
