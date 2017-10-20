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

import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CoreModule, AppConfigService, PeopleContentService } from 'ng2-alfresco-core';
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
