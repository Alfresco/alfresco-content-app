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

import { RouterTestingModule } from '@angular/router/testing';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { MinimalNodeEntryEntity } from 'alfresco-js-api';
import { CoreModule, ContentService, PeopleContentService, AppConfigService } from '@alfresco/adf-core';
import { Observable } from 'rxjs/Observable';

import { BrowsingFilesService } from '../../common/services/browsing-files.service';
import { LayoutComponent } from './layout.component';
import { CommonModule } from './../../common/common.module';
import { HeaderComponent } from '../header/header.component';
import { SidenavComponent } from '../sidenav/sidenav.component';
import { SearchComponent } from '../search/search.component';
import { CurrentUserComponent } from '../current-user/current-user.component';

describe('LayoutComponent', () => {
    let fixture: ComponentFixture<LayoutComponent>;
    let component: LayoutComponent;
    let browsingFilesService: BrowsingFilesService;
    let contentService: ContentService;
    let node;
    const navItem = {
        label: 'some-label',
        route: {
            url: '/some-url'
        }
    };

    beforeEach(() => {
        node = { id: 'node-id' };

        TestBed.configureTestingModule({
            imports: [
                CoreModule,
                RouterTestingModule,
                CommonModule
            ],
            declarations: [
                LayoutComponent,
                HeaderComponent,
                SidenavComponent,
                SearchComponent,
                CurrentUserComponent
            ],
            providers: [
                AppConfigService,
                {
                    provide: PeopleContentService,
                    useValue: {
                        getCurrentPerson: () => Observable.of({ entry: {} })
                    }
                }
            ]
        });

        fixture = TestBed.createComponent(LayoutComponent);
        component = fixture.componentInstance;
        browsingFilesService = TestBed.get(BrowsingFilesService);
        contentService = TestBed.get(ContentService);

        const appConfig = TestBed.get(AppConfigService);
        spyOn(appConfig, 'get').and.returnValue([navItem]);

        fixture.detectChanges();
    });

    it('sets current node', () => {
        const currentNode = <MinimalNodeEntryEntity>{ id: 'someId' };

        browsingFilesService.onChangeParent.next(currentNode);

        expect(component.node).toEqual(currentNode);
    });

    describe('canCreateContent()', () => {
        it('returns true if node has permission', () => {
            spyOn(contentService, 'hasPermission').and.returnValue(true);

            const permission = component.canCreateContent(<any>{});

            expect(permission).toBe(true);
        });

        it('returns false if node does not have permission', () => {
            spyOn(contentService, 'hasPermission').and.returnValue(false);

            const permission = component.canCreateContent(<any>{});

            expect(permission).toBe(false);
        });

        it('returns false if node is null', () => {
            const permission = component.canCreateContent(null);

            expect(permission).toBe(false);
        });
    });
 });
