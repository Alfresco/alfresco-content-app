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
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { AppConfigService, CoreModule } from '@alfresco/adf-core';
import { BrowsingFilesService } from '../../common/services/browsing-files.service';
import { NodePermissionService } from '../../common/services/node-permission.service';

import { SidenavComponent } from './sidenav.component';
import { EffectsModule } from '@ngrx/effects';
import { NodeEffects } from '../../store/effects/node.effects';
import { ContentManagementService } from '../../common/services/content-management.service';
import { AppTestingModule } from '../../testing/app-testing.module';
import { MaterialModule } from '../../material.module';

describe('SidenavComponent', () => {
    let fixture: ComponentFixture<SidenavComponent>;
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
                AppTestingModule,
                MaterialModule,
                CoreModule.forRoot(),
                EffectsModule.forRoot([NodeEffects])
            ],
            declarations: [
                SidenavComponent
            ],
            providers: [
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
