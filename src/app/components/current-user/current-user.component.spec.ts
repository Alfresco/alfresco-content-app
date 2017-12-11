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

import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs/Rx';
import { MaterialModule } from '../../common/material.module';
import { CoreModule, PeopleContentService } from '@alfresco/adf-core';

import { CurrentUserComponent } from './current-user.component';

describe('CurrentUserComponent', () => {
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
                MaterialModule,
                CoreModule,
                RouterTestingModule
            ],
            declarations: [
                CurrentUserComponent
            ]
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
