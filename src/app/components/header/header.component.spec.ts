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

import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CoreModule, AppConfigService, PeopleContentService } from '@alfresco/adf-core';
import { Observable } from 'rxjs/Rx';
import { CommonModule } from './../../common/common.module';

import { HeaderComponent } from './header.component';
import { SearchComponent } from '../search/search.component';
import { CurrentUserComponent } from '../current-user/current-user.component';

describe('HeaderComponent', () => {
    let fixture;
    let component;
    let appConfigService: AppConfigService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                CoreModule,
                RouterTestingModule,
                CommonModule
            ],
            declarations: [
                HeaderComponent,
                SearchComponent,
                CurrentUserComponent
            ]
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
        });

        fixture.detectChanges();
    });

    it('should get application name from configuration file', () => {
        expect(appConfigService.get).toHaveBeenCalledWith('application.name');
    });

    it('it should set application name', () => {
        expect(component.appName).toBe('app-name');
    });
});
