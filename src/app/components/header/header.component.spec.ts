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
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppConfigService, PeopleContentService } from '@alfresco/adf-core';
import { HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';

import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
    let fixture;
    let component;
    let appConfigService: AppConfigService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientModule,
                RouterTestingModule
            ],
            declarations: [
                HeaderComponent
            ],
            providers: [
                AppConfigService,
                PeopleContentService
            ],
            schemas: [ NO_ERRORS_SCHEMA ]
        })
        .overrideProvider(PeopleContentService, {
            useValue: {
                getCurrentPerson: () => Observable.of({ entry: {} })
            }
        });

        fixture = TestBed.createComponent(HeaderComponent);
        component = fixture.componentInstance;
        appConfigService = TestBed.get(AppConfigService);

        spyOn(appConfigService, 'get').and.callFake((val) => {
            if (val === 'application.name') {
                return 'app-name';
            }

            if (val === 'headerColor') {
                return 'some-color';
            }

            if (val === 'application.logo') {
                return '';
            }
        });

        fixture.detectChanges();
    });

    it('it should set application name', () => {
        expect(component.appName).toBe('app-name');
    });

    it('it should set header background color', () => {
        expect(component.backgroundColor).toBe('some-color');
    });
});
