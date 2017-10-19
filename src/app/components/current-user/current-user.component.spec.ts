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

import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs/Rx';
import { MaterialModule } from '@angular/material';
import { CoreModule, PeopleContentService } from 'ng2-alfresco-core';

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
