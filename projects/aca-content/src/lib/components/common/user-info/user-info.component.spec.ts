/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
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
