/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2017 Alfresco Software Limited
 *
 * This file is part of the Alfresco Example Content Application.
 * If the software was purchased under a paid Alfresco license, the terms of
 * the paid license agreement will prevail.  Otherwise, the software is
 * provided under the following open source license terms:
 *
 * The Alfresco Example Content Application is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * The Alfresco Example Content Application is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with Alfresco. If not, see <http://www.gnu.org/licenses/>.
 */

import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { TestBed, async } from '@angular/core/testing';
import { CoreModule, AuthenticationService, UserPreferencesService } from '@alfresco/adf-core';

import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
    let component;
    let fixture;
    let router;
    let userPreference;
    let auth;
    let location;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule,
                CoreModule
            ],
            declarations: [
                LoginComponent
            ],
            providers: [
                Location
            ]
        });

        fixture = TestBed.createComponent(LoginComponent);
        component = fixture.componentInstance;

        router = TestBed.get(Router);
        location = TestBed.get(Location);
        auth = TestBed.get(AuthenticationService);
        userPreference = TestBed.get(UserPreferencesService);
    }));

    beforeEach(() => {
        spyOn(userPreference, 'setStoragePrefix');
        spyOn(router, 'navigateByUrl');
        spyOn(auth, 'getRedirectUrl').and.returnValue('/some-url');
        spyOn(location, 'forward');
    });

    describe('OnInit()', () => {
        it('should perform normal login when user is not logged in', () => {
            spyOn(auth, 'isEcmLoggedIn').and.returnValue(false);
            fixture.detectChanges();

            expect(location.forward).not.toHaveBeenCalled();
        });

        it('should redirect when user is logged in', () => {
            spyOn(auth, 'isEcmLoggedIn').and.returnValue(true);
            fixture.detectChanges();

            expect(location.forward).toHaveBeenCalled();
        });
    });

    describe('onLoginSuccess()', () => {
        beforeEach(() => {
            spyOn(auth, 'isEcmLoggedIn').and.returnValue(false);
            fixture.detectChanges();
        });

        it('should redirect on success', () => {
            component.onLoginSuccess();

            expect(router.navigateByUrl).toHaveBeenCalledWith('/personal-files');
        });

        it('should set user preference store prefix', () => {
            component.onLoginSuccess({ username: 'bogus' });

            expect(userPreference.setStoragePrefix).toHaveBeenCalledWith('bogus');
        });
    });
});
