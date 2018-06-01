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

import { TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Rx';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import {
    NotificationService, TranslationService, TranslationMock,
    NodesApiService, AlfrescoApiService, ContentService,
    UserPreferencesService, LogService, AppConfigService,
    StorageService, CookieService, ThumbnailService, AuthenticationService,
    TimeAgoPipe, NodeNameTooltipPipe, NodeFavoriteDirective, DataTableComponent, AppConfigPipe
} from '@alfresco/adf-core';
import { DocumentListComponent, CustomResourcesService } from '@alfresco/adf-content-services';
import { TranslateModule } from '@ngx-translate/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatMenuModule, MatSnackBarModule, MatIconModule } from '@angular/material';
import { DocumentListService } from '@alfresco/adf-content-services';
import { ShareDataTableAdapter } from '@alfresco/adf-content-services';

import { LibrariesComponent } from './libraries.component';

describe('Libraries Routed Component', () => {
    let fixture;
    let component: LibrariesComponent;
    let nodesApi: NodesApiService;
    let alfrescoApi: AlfrescoApiService;
    let router: Router;
    let preferenceService: UserPreferencesService;
    let page;
    let node;

    beforeEach(() => {
        page = {
            list: {
                entries: [ { entry: { id: 1 } }, { entry: { id: 2 } } ],
                pagination: { data: 'data'}
            }
        };

        node = <any> {
            id: 'nodeId',
            path: {
                elements: []
            }
        };
    });

    beforeEach(async(() => {
        TestBed.configureTestingModule({
                imports: [
                    MatMenuModule,
                    NoopAnimationsModule,
                    HttpClientModule,
                    TranslateModule.forRoot(),
                    RouterTestingModule,
                    MatSnackBarModule, MatIconModule
                ],
                declarations: [
                    DataTableComponent,
                    TimeAgoPipe,
                    NodeNameTooltipPipe,
                    NodeFavoriteDirective,
                    DocumentListComponent,
                    LibrariesComponent,
                    AppConfigPipe
                ],
                providers: [
                    { provide: ActivatedRoute, useValue: {
                        snapshot: { data: { preferencePrefix: 'prefix' } }
                    } } ,
                    { provide: TranslationService, useClass: TranslationMock },
                    AuthenticationService,
                    UserPreferencesService,
                    AppConfigService, StorageService, CookieService,
                    AlfrescoApiService,
                    LogService,
                    NotificationService,
                    ContentService,
                    NodesApiService,
                    DocumentListService,
                    ThumbnailService,
                    CustomResourcesService
                ],
                schemas: [ NO_ERRORS_SCHEMA ]
        })
        .compileComponents().then(() => {
            fixture = TestBed.createComponent(LibrariesComponent);
            component = fixture.componentInstance;

            nodesApi = TestBed.get(NodesApiService);
            alfrescoApi = TestBed.get(AlfrescoApiService);
            alfrescoApi.reset();
            router = TestBed.get(Router);
            preferenceService = TestBed.get(UserPreferencesService);
        });
    }));

    beforeEach(() => {
        spyOn(alfrescoApi.sitesApi, 'getSites').and.returnValue((Promise.resolve(page)));
        spyOn(alfrescoApi.peopleApi, 'getSiteMembership').and.returnValue((Promise.resolve({})));
    });

    describe('makeLibraryTooltip()', () => {
        it('maps tooltip to description', () => {
            node.description = 'description';
            const tooltip = component.makeLibraryTooltip(node);

            expect(tooltip).toBe(node.description);
        });

        it('maps tooltip to description', () => {
            node.title = 'title';
            const tooltip = component.makeLibraryTooltip(node);

            expect(tooltip).toBe(node.title);
        });

        it('sets tooltip to empty string', () => {
            const tooltip = component.makeLibraryTooltip(node);

            expect(tooltip).toBe('');
        });
    });

    describe('makeLibraryTitle()', () => {
        it('sets title with id when duplicate nodes title exists in list', () => {
            node.title = 'title';

            const data = new ShareDataTableAdapter(null);
            data.setRows([<any>{ node: { entry: { id: 'some-id', title: 'title' } } }]);

            component.documentList.data = data;

            const title = component.makeLibraryTitle(node);
            expect(title).toContain('nodeId');
        });

        it('sets title when no duplicate nodes title exists in list', () => {
            node.title = 'title';

            const data = new ShareDataTableAdapter(null);
            data.setRows([<any>{ node: { entry: { id: 'some-id', title: 'title-some-id' } } }]);

            component.documentList.data = data;
            const title = component.makeLibraryTitle(node);

            expect(title).toBe('title');
        });
    });

    describe('Node navigation', () => {
        let routerSpy;

        beforeEach(() => {
            routerSpy = spyOn(router, 'navigate');
        });

        it('does not navigate when id is not passed', () => {
            component.navigate(null);

            expect(router.navigate).not.toHaveBeenCalled();
        });

        it('navigates to node id', () => {
            const document = { id: 'documentId' };
            spyOn(nodesApi, 'getNode').and.returnValue(Observable.of(document));

            component.navigate(node.id);

            expect(routerSpy.calls.argsFor(0)[0]).toEqual(['./', document.id]);
        });
    });

    describe('onNodeDoubleClick', () => {
        it('navigates to document', () => {
            spyOn(component, 'navigate');

            const event: any = {
                detail: {
                    node: {
                        entry: { guid: 'node-guid' }
                    }
                }
            };

            component.onNodeDoubleClick(event);

            expect(component.navigate).toHaveBeenCalledWith('node-guid');
        });

        it(' does not navigate when document is not provided', () => {
            spyOn(component, 'navigate');

            const event: any = {
                detail: {
                    node: {
                        entry: null
                    }
                }
            };

            component.onNodeDoubleClick(event);

            expect(component.navigate).not.toHaveBeenCalled();
        });
    });

    describe('onSortingChanged', () => {
        it('should save sorting input', () => {
            spyOn(preferenceService, 'set');

            const event = <any>{
                detail: {
                    key: 'some-name',
                    direction: 'some-direction'
                }
             };

            component.onSortingChanged(event);

            expect(preferenceService.set).toHaveBeenCalledWith('prefix.sorting.key', 'some-name');
            expect(preferenceService.set).toHaveBeenCalledWith('prefix.sorting.direction', 'some-direction');
        });

        it('should save default sorting when no input', () => {
            spyOn(preferenceService, 'set');

            const event = <any>{
                detail: {}
             };

            component.onSortingChanged(event);

            expect(preferenceService.set).toHaveBeenCalledWith('prefix.sorting.key', 'modifiedAt');
            expect(preferenceService.set).toHaveBeenCalledWith('prefix.sorting.direction', 'desc');
        });
    });
});
