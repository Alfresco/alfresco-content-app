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
import { MatMenuModule, MatSnackBarModule } from '@angular/material';
import { AppConfigService, TranslationService, TranslationMock, CoreModule } from '@alfresco/adf-core';
import { BrowsingFilesService } from '../../common/services/browsing-files.service';
import { NodePermissionService } from '../../common/services/node-permission.service';

import { SidenavComponent } from './sidenav.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';
import { appReducer } from '../../store/reducers/app.reducer';
import { INITIAL_STATE } from '../../store/states/app.state';
import { EffectsModule } from '@ngrx/effects';
import { NodeEffects } from '../../store/effects/node.effects';
import { ContentManagementService } from '../../common/services/content-management.service';

describe('SidenavComponent', () => {
    let fixture;
    let component: SidenavComponent;
    let browsingService: BrowsingFilesService;
    let appConfig: AppConfigService;
    let appConfigSpy;

    const navItem = {
        label: 'some-label',
        route: {
            url: '/some-url'
        }
    };

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                NoopAnimationsModule,
                CoreModule.forRoot(),
                MatMenuModule,
                MatSnackBarModule,
                RouterTestingModule,
                StoreModule.forRoot({ app: appReducer }, { initialState: INITIAL_STATE }),
                EffectsModule.forRoot([NodeEffects])
            ],
            declarations: [
                SidenavComponent
            ],
            providers: [
                { provide: TranslationService, useClass: TranslationMock },
                NodePermissionService,
                BrowsingFilesService,
                ContentManagementService
            ],
            schemas: [ NO_ERRORS_SCHEMA ]
        })
        .compileComponents()
        .then(() => {
            browsingService = TestBed.get(BrowsingFilesService);
            appConfig = TestBed.get(AppConfigService);

            fixture = TestBed.createComponent(SidenavComponent);
            component = fixture.componentInstance;

            appConfigSpy = spyOn(appConfig, 'get').and.returnValue([navItem]);
        });
    }));

    it('should update node on change', () => {
        fixture.detectChanges();
        const node: any = { entry: { id: 'someNodeId' } };

        browsingService.onChangeParent.next(<any>node);

        expect(component.node).toBe(node);
    });

    describe('menu', () => {
        it('should build menu from array', () => {
            appConfigSpy.and.returnValue([navItem, navItem]);
            fixture.detectChanges();

            expect(component.navigation).toEqual([[navItem, navItem]]);
        });

        it('should build menu from object', () => {
            appConfigSpy.and.returnValue({ a: [navItem, navItem], b: [navItem, navItem] });
            fixture.detectChanges();

            expect(component.navigation).toEqual([[navItem, navItem], [navItem, navItem]]);
        });
    });
});
