/*!
 * @license
 * Copyright 2017 Alfresco Software, Ltd.
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

import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { TestBed, async } from '@angular/core/testing';
import { CoreModule, AuthenticationService, UserPreferencesService } from '@alfresco/adf-core';

import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
    let component;
    let fixture;
    let router;
    let userPreference;
    let auth;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule,
                CoreModule
            ],
            declarations: [
                LoginComponent
            ]
        });

        fixture = TestBed.createComponent(LoginComponent);
        component = fixture.componentInstance;

        router = TestBed.get(Router);
        auth = TestBed.get(AuthenticationService);
        userPreference = TestBed.get(UserPreferencesService);
    }));

    beforeEach(() => {
        spyOn(userPreference, 'setStoragePrefix');
        spyOn(router, 'navigateByUrl');
        spyOn(auth, 'getRedirectUrl').and.returnValue('/some-url');
    });

    describe('OnInit()', () => {
        it('should perform normal login when user is not logged in', () => {
            spyOn(auth, 'isEcmLoggedIn').and.returnValue(false);
            fixture.detectChanges();

            expect(router.navigateByUrl).not.toHaveBeenCalled();
        });

        it('should redirect when user is logged in', () => {
            spyOn(auth, 'isEcmLoggedIn').and.returnValue(true);
            fixture.detectChanges();

            expect(router.navigateByUrl).toHaveBeenCalledWith('/some-url');
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
