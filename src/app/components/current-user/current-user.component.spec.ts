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
import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs/Rx';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatMenuModule } from '@angular/material';
import {
    TranslationService, TranslationMock, AlfrescoApiService,
    AppConfigService, StorageService, PeopleContentService, UserPreferencesService
 } from '@alfresco/adf-core';

import { CurrentUserComponent } from './current-user.component';

fdescribe('CurrentUserComponent', () => {
    let fixture;
    let component;
    let peopleApi: PeopleContentService;
    let user;

    beforeEach(() => {
        user = { entry: { firstName: 'joe', lastName: 'doe' } };
    });

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientModule,
                TranslateModule.forRoot(),
                NoopAnimationsModule,
                MatMenuModule,
                RouterTestingModule
            ],
            declarations: [
                CurrentUserComponent
            ],
            providers: [
                { provide: TranslationService, useClass: TranslationMock },
                AlfrescoApiService,
                AppConfigService,
                StorageService,
                PeopleContentService,
                UserPreferencesService
            ],
            schemas: [ NO_ERRORS_SCHEMA ]
        })
        .compileComponents()
        .then(() => {
            fixture = TestBed.createComponent(CurrentUserComponent);
            component = fixture.componentInstance;
            peopleApi = TestBed.get(PeopleContentService);

            spyOn(peopleApi, 'getCurrentPerson').and.returnValue(Observable.of(user));

            fixture.detectChanges();
        });
    }));

    it('updates user data', () => {
        expect(component.user).toBe(user.entry);
    });

    it('get user initials', () => {
        expect(component.userInitials).toBe('jd');
    });
});
