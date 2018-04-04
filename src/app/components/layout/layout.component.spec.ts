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
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { MinimalNodeEntryEntity } from 'alfresco-js-api';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientModule } from '@angular/common/http';
import {
    PeopleContentService, AppConfigService,
    AuthenticationService, UserPreferencesService, TranslationService,
    TranslationMock, StorageService, AlfrescoApiService, CookieService,
    LogService
} from '@alfresco/adf-core';
import { Observable } from 'rxjs/Observable';

import { BrowsingFilesService } from '../../common/services/browsing-files.service';
import { NodePermissionService } from '../../common/services/node-permission.service';
import { LayoutComponent } from './layout.component';

describe('LayoutComponent', () => {
    let fixture: ComponentFixture<LayoutComponent>;
    let component: LayoutComponent;
    let browsingFilesService: BrowsingFilesService;
    const navItem = {
        label: 'some-label',
        route: {
            url: '/some-url'
        }
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientModule,
                TranslateModule.forRoot(),
                RouterTestingModule
            ],
            declarations: [
                LayoutComponent
            ],
            providers: [
                { provide: TranslationService, useClass: TranslationMock },
                AlfrescoApiService,
                StorageService,
                CookieService,
                LogService,
                UserPreferencesService,
                AuthenticationService,
                AppConfigService,
                NodePermissionService,
                BrowsingFilesService,
                {
                    provide: PeopleContentService,
                    useValue: {
                        getCurrentPerson: () => Observable.of({ entry: {} })
                    }
                }
            ],
            schemas: [ NO_ERRORS_SCHEMA ]
        });

        fixture = TestBed.createComponent(LayoutComponent);
        component = fixture.componentInstance;
        browsingFilesService = TestBed.get(BrowsingFilesService);

        const appConfig = TestBed.get(AppConfigService);
        spyOn(appConfig, 'get').and.returnValue([navItem]);

        fixture.detectChanges();
    });

    it('sets current node', () => {
        const currentNode = <MinimalNodeEntryEntity>{ id: 'someId' };

        browsingFilesService.onChangeParent.next(currentNode);

        expect(component.node).toEqual(currentNode);
    });
 });
