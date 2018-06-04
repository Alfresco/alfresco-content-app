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
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppConfigService, PeopleContentService, TranslationService, TranslationMock } from '@alfresco/adf-core';
import { HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';

import { HeaderComponent } from './header.component';
import { TranslateModule } from '@ngx-translate/core';
import { StoreModule, Store } from '@ngrx/store';
import { appReducer } from '../../store/reducers/app.reducer';
import { INITIAL_STATE, AcaState } from '../../store/states/app.state';
import { SetAppNameAction } from '../../store/actions/app-name.action';
import { SetHeaderColorAction } from '../../store/actions/header-color.action';

describe('HeaderComponent', () => {
    let fixture: ComponentFixture<HeaderComponent>;
    let component: HeaderComponent;
    let appConfigService: AppConfigService;
    let store: Store<AcaState>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientModule,
                RouterTestingModule,
                TranslateModule.forRoot(),
                StoreModule.forRoot({ app: appReducer }, { initialState: INITIAL_STATE }),
            ],
            declarations: [
                HeaderComponent
            ],
            providers: [
                AppConfigService,
                PeopleContentService,
                { provide: TranslationService, useClass: TranslationMock },
            ],
            schemas: [ NO_ERRORS_SCHEMA ]
        })
        .overrideProvider(PeopleContentService, {
            useValue: {
                getCurrentPerson: () => Observable.of({ entry: {} })
            }
        });

        store = TestBed.get(Store);
        store.dispatch(new SetAppNameAction('app-name'));
        store.dispatch(new SetHeaderColorAction('some-color'));

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

    it('it should set application name', done => {
        component.appName$.subscribe(val => {
            expect(val).toBe('app-name');
            done();
        });
    });

    it('it should set header background color', done => {
        component.headerColor$.subscribe(val => {
            expect(val).toBe('some-color');
            done();
        });
    });
});
