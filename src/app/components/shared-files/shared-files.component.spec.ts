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
