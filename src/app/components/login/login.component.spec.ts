/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2018 Alfresco Software Limited
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

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { Location } from '@angular/common';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import {
    AuthenticationService, UserPreferencesService, TranslationService,
    TranslationMock, AppConfigService, StorageService, AlfrescoApiService,
    CookieService, LogService, AppConfigPipe
} from '@alfresco/adf-core';

import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
    let fixture: ComponentFixture<LoginComponent>;
    let router: Router;
    let userPreference: UserPreferencesService;
    let auth: AuthenticationService;
    let location: Location;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientModule,
                TranslateModule.forRoot(),
                RouterTestingModule
            ],
            declarations: [
                LoginComponent,
                AppConfigPipe
            ],
            providers: [
                { provide: TranslationService, useClass: TranslationMock },
                Location,
                CookieService,
                LogService,
                StorageService,
                AlfrescoApiService,
                AppConfigService,
                AuthenticationService,
                UserPreferencesService
            ],
            schemas: [ NO_ERRORS_SCHEMA ]
        });

        fixture = TestBed.createComponent(LoginComponent);

        router = TestBed.get(Router);
        location = TestBed.get(Location);
        auth = TestBed.get(AuthenticationService);
        userPreference = TestBed.get(UserPreferencesService);
    }));

    beforeEach(() => {
        spyOn(userPreference, 'setStoragePrefix');
        spyOn(router, 'navigateByUrl');
        spyOn(auth, 'getRedirect').and.returnValue('/some-url');
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
});
