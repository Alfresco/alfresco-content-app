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

import { RouterTestingModule } from '@angular/router/testing';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { MinimalNodeEntryEntity } from 'alfresco-js-api';
import { CoreModule, AlfrescoContentService, PeopleContentService } from '@alfresco/adf-core';
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
    let contentService: AlfrescoContentService;
    let node;

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
        contentService = TestBed.get(AlfrescoContentService);

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
