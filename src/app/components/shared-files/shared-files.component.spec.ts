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
import { TestBed, async, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { AlfrescoApiService } from '@alfresco/adf-core';

import { CommonModule } from '../../common/common.module';
import { ContentManagementService } from '../../common/services/content-management.service';
import { LocationLinkComponent } from '../location-link/location-link.component';
import { SharedFilesComponent } from './shared-files.component';

describe('SharedFilesComponent', () => {
    let fixture;
    let component: SharedFilesComponent;
    let contentService: ContentManagementService;
    let nodeService;
    let alfrescoApi: AlfrescoApiService;
    let router: Router;
    let page;

    beforeEach(() => {
        page = {
            list: {
                entries: [ { entry: { id: 1 } }, { entry: { id: 2 } } ],
                pagination: { data: 'data'}
            }
        };
    });

    beforeEach(async(() => {
        TestBed
            .configureTestingModule({
                imports: [
                    RouterTestingModule,
                    CommonModule
                ],
                declarations: [
                    LocationLinkComponent,
                    SharedFilesComponent
                ]
            })
            .compileComponents()
            .then(() => {
                fixture = TestBed.createComponent(SharedFilesComponent);
                component = fixture.componentInstance;

                contentService = TestBed.get(ContentManagementService);
                alfrescoApi = TestBed.get(AlfrescoApiService);
                nodeService = alfrescoApi.getInstance().nodes;
                router = TestBed.get(Router);
            });

    }));

    beforeEach(() => {
        spyOn(alfrescoApi.sharedLinksApi, 'findSharedLinks').and.returnValue(Promise.resolve(page));
    });

    describe('OnInit', () => {
        beforeEach(() => {
            spyOn(component, 'refresh').and.callFake(val => val);
        });

        it('should refresh on deleteNode event', () => {
            fixture.detectChanges();

            contentService.deleteNode.next();

            expect(component.refresh).toHaveBeenCalled();
        });

        it('should refresh on restoreNode event', () => {
            fixture.detectChanges();

            contentService.restoreNode.next();

            expect(component.refresh).toHaveBeenCalled();
        });

        it('should refresh on favorite toggle event', () => {
            fixture.detectChanges();

            contentService.toggleFavorite.next();

            expect(component.refresh).toHaveBeenCalled();
        });

        it('should reload on move node event', () => {
            fixture.detectChanges();

            contentService.moveNode.next();

            expect(component.refresh).toHaveBeenCalled();
        });
    });

    describe('onNodeDoubleClick()', () => {
        beforeEach(() => {
            spyOn(component, 'fetchNodes').and.callFake(val => val);
            fixture.detectChanges();
        });

        it('opens viewer if node is file', fakeAsync(() => {
            spyOn(router, 'navigate').and.stub();
            const link = { nodeId: 'nodeId' };
            const node = { entry: { isFile: true, id: 'nodeId' } };

            spyOn(nodeService, 'getNode').and.returnValue(Promise.resolve(node));
            component.onNodeDoubleClick(link);
            tick();

            expect(router.navigate).toHaveBeenCalledWith(['/preview', node.entry.id]);
        }));

        it('does nothing if node is folder', fakeAsync(() => {
            spyOn(router, 'navigate').and.stub();
            spyOn(nodeService, 'getNode').and.returnValue(Promise.resolve({ entry: { isFile: false } }));
            const link = { nodeId: 'nodeId' };

            component.onNodeDoubleClick(link);
            tick();

            expect(router.navigate).not.toHaveBeenCalled();
        }));

        it('does nothing if link data is not passed', () => {
            spyOn(router, 'navigate').and.stub();
            spyOn(nodeService, 'getNode').and.returnValue(Promise.resolve({ entry: { isFile: true } }));

            component.onNodeDoubleClick(null);

            expect(router.navigate).not.toHaveBeenCalled();
        });
    });

    describe('refresh', () => {
        it('should call document list reload', () => {
            spyOn(component.documentList, 'reload');
            fixture.detectChanges();

            component.refresh();

            expect(component.documentList.reload).toHaveBeenCalled();
        });
    });
});
