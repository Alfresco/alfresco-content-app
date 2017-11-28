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

import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Rx';

import { CoreModule , NodesApiService, AlfrescoApiService} from '@alfresco/adf-core';
import { ShareDataTableAdapter } from '@alfresco/adf-content-services';

import { CommonModule } from '../../common/common.module';
import { LibrariesComponent } from './libraries.component';

describe('Libraries Routed Component', () => {
    let fixture;
    let component: LibrariesComponent;
    let nodesApi: NodesApiService;
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

    beforeEach(async(() => {
        TestBed.configureTestingModule({
                imports: [
                    CoreModule,
                    RouterTestingModule,
                    CommonModule
                ],
                declarations: [
                    LibrariesComponent
                ]
        })
        .compileComponents().then(() => {
            fixture = TestBed.createComponent(LibrariesComponent);
            component = fixture.componentInstance;

            nodesApi = TestBed.get(NodesApiService);
            alfrescoApi = TestBed.get(AlfrescoApiService);
            router = TestBed.get(Router);
        });
    }));

    beforeEach(() => {
        spyOn(alfrescoApi.sitesApi, 'getSites').and.returnValue((Promise.resolve(page)));
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
            spyOn(component, 'fetchNodes').and.callFake(val => val);
        });

        it('does not navigate when id is not passed', () => {
            component.navigate(null);

            expect(router.navigate).not.toHaveBeenCalled();
        });

        it('navigates to node id', () => {
            const document = { id: 'documentId' };
            spyOn(nodesApi, 'getNode').and.returnValue(Observable.of(document));

            component.navigate(node.id);

            fixture.detectChanges();

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
});
