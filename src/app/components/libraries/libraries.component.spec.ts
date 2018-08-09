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

import { TestBed, ComponentFixture } from '@angular/core/testing';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import {
    AlfrescoApiService,
    TimeAgoPipe, NodeNameTooltipPipe, NodeFavoriteDirective, DataTableComponent, AppConfigPipe
} from '@alfresco/adf-core';
import { DocumentListComponent } from '@alfresco/adf-content-services';
import { ShareDataTableAdapter } from '@alfresco/adf-content-services';
import { LibrariesComponent } from './libraries.component';
import { AppTestingModule } from '../../testing/app-testing.module';
import { ContentApiService } from '../../services/content-api.service';
import { ExperimentalDirective } from '../../directives/experimental.directive';

describe('LibrariesComponent', () => {
    let fixture: ComponentFixture<LibrariesComponent>;
    let component: LibrariesComponent;
    let contentApi: ContentApiService;
    let alfrescoApi: AlfrescoApiService;
    let router: Router;
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

    beforeEach(() => {
        TestBed.configureTestingModule({
                imports: [ AppTestingModule ],
                declarations: [
                    DataTableComponent,
                    TimeAgoPipe,
                    NodeNameTooltipPipe,
                    NodeFavoriteDirective,
                    DocumentListComponent,
                    LibrariesComponent,
                    AppConfigPipe,
                    ExperimentalDirective
                ],
                schemas: [ NO_ERRORS_SCHEMA ]
        });

        fixture = TestBed.createComponent(LibrariesComponent);
        component = fixture.componentInstance;

        alfrescoApi = TestBed.get(AlfrescoApiService);
        alfrescoApi.reset();
        router = TestBed.get(Router);

        spyOn(alfrescoApi.sitesApi, 'getSites').and.returnValue((Promise.resolve(page)));
        spyOn(alfrescoApi.peopleApi, 'getSiteMembership').and.returnValue((Promise.resolve({})));

        contentApi = TestBed.get(ContentApiService);
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

            const data = new ShareDataTableAdapter(null, null);
            data.setRows([<any>{ node: { entry: { id: 'some-id', title: 'title' } } }]);

            component.documentList.data = data;

            const title = component.makeLibraryTitle(node);
            expect(title).toContain('nodeId');
        });

        it('sets title when no duplicate nodes title exists in list', () => {
            node.title = 'title';

            const data = new ShareDataTableAdapter(null, null);
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
            spyOn(contentApi, 'getNode').and.returnValue(of({ entry: document }));

            component.navigate(node.id);

            expect(routerSpy.calls.argsFor(0)[0]).toEqual(['./', document.id]);
        });
    });

    describe('navigateTo', () => {
        it('navigates into library folder', () => {
            spyOn(component, 'navigate');

            const site: any = {
                entry: { guid: 'node-guid' }
            };

            component.navigateTo(site);

            expect(component.navigate).toHaveBeenCalledWith('node-guid');
        });

        it(' does not navigate when library is not provided', () => {
            spyOn(component, 'navigate');

            component.navigateTo(null);

            expect(component.navigate).not.toHaveBeenCalled();
        });
    });
});
