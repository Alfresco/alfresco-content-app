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

import { Observable } from 'rxjs/Rx';
import { TestBed, fakeAsync, tick, ComponentFixture } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
    NodesApiService,
    TimeAgoPipe, NodeNameTooltipPipe, FileSizePipe, NodeFavoriteDirective,
    DataTableComponent, UploadService, AppConfigPipe
} from '@alfresco/adf-core';
import { DocumentListComponent } from '@alfresco/adf-content-services';
import { ContentManagementService } from '../../common/services/content-management.service';
import { BrowsingFilesService } from '../../common/services/browsing-files.service';
import { NodeActionsService } from '../../common/services/node-actions.service';
import { NodePermissionService } from '../../common/services/node-permission.service';

import { FilesComponent } from './files.component';
import { AppTestingModule } from '../../testing/app-testing.module';
import { MaterialModule } from '../../material.module';

describe('FilesComponent', () => {
    let node;
    let page;
    let fixture: ComponentFixture<FilesComponent>;
    let component: FilesComponent;
    let contentManagementService: ContentManagementService;
    let uploadService: UploadService;
    let nodesApi: NodesApiService;
    let router: Router;
    let browsingFilesService: BrowsingFilesService;
    let nodeActionsService: NodeActionsService;

    beforeAll(() => {
        // testing only functional-wise not time-wise
        Observable.prototype.debounceTime = function () { return this; };
    });

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                AppTestingModule,
                MaterialModule
            ],
            declarations: [
                FilesComponent,
                DataTableComponent,
                TimeAgoPipe,
                NodeNameTooltipPipe,
                NodeFavoriteDirective,
                DocumentListComponent,
                FileSizePipe,
                AppConfigPipe
            ],
            providers: [
                { provide: ActivatedRoute, useValue: {
                    snapshot: { data: { preferencePrefix: 'prefix' } },
                    params: Observable.of({ folderId: 'someId' })
                } } ,

                ContentManagementService,
                NodeActionsService,
                NodePermissionService,
                BrowsingFilesService
            ],
            schemas: [ NO_ERRORS_SCHEMA ]
        });

        fixture = TestBed.createComponent(FilesComponent);
        component = fixture.componentInstance;

        contentManagementService = TestBed.get(ContentManagementService);
        uploadService = TestBed.get(UploadService);
        nodesApi = TestBed.get(NodesApiService);
        router = TestBed.get(Router);
        browsingFilesService = TestBed.get(BrowsingFilesService);
        nodeActionsService = TestBed.get(NodeActionsService);
    });

    beforeEach(() => {
        node = { id: 'node-id', isFolder: true };
        page = {
            list: {
                entries: ['a', 'b', 'c'],
                pagination: {}
            }
        };

        spyOn(component.documentList, 'loadFolder').and.callFake(() => {});
    });

    describe('Current page is valid', () => {
        it('should be a valid current page', fakeAsync(() => {
            spyOn(component, 'fetchNode').and.returnValue(Observable.of(node));
            spyOn(component, 'fetchNodes').and.returnValue(Observable.throw(null));

            component.ngOnInit();
            fixture.detectChanges();
            tick();

            expect(component.isValidPath).toBe(false);
        }));

        it('should set current page as invalid path', fakeAsync(() => {
            spyOn(component, 'fetchNode').and.returnValue(Observable.of(node));
            spyOn(component, 'fetchNodes').and.returnValue(Observable.of(page));

            component.ngOnInit();
            tick();
            fixture.detectChanges();

            expect(component.isValidPath).toBe(true);
        }));
    });

    describe('OnInit', () => {
        it('should set current node', () => {
            spyOn(component, 'fetchNode').and.returnValue(Observable.of(node));
            spyOn(component, 'fetchNodes').and.returnValue(Observable.of(page));

            fixture.detectChanges();

            expect(component.node).toBe(node);
        });

        it('should get current node children', () => {
            spyOn(component, 'fetchNode').and.returnValue(Observable.of(node));
            spyOn(component, 'fetchNodes').and.returnValue(Observable.of(page));

            fixture.detectChanges();

            expect(component.fetchNodes).toHaveBeenCalled();
        });

        it('emits onChangeParent event', () => {
            spyOn(component, 'fetchNode').and.returnValue(Observable.of(node));
            spyOn(component, 'fetchNodes').and.returnValue(Observable.of(page));
            spyOn(browsingFilesService.onChangeParent, 'next').and.callFake((val) => val);

            fixture.detectChanges();

            expect(browsingFilesService.onChangeParent.next)
                .toHaveBeenCalledWith(node);
        });

        it('if should navigate to parent if node is not a folder', () => {
            node.isFolder = false;
            node.parentId = 'parent-id';
            spyOn(component, 'fetchNode').and.returnValue(Observable.of(node));
            spyOn(router, 'navigate');

            fixture.detectChanges();

            expect(router.navigate['calls'].argsFor(0)[0]).toEqual(['/personal-files', 'parent-id']);
        });
    });

    describe('refresh on events', () => {
        beforeEach(() => {
            spyOn(component, 'fetchNode').and.returnValue(Observable.of(node));
            spyOn(component, 'fetchNodes').and.returnValue(Observable.of(page));
            spyOn(component.documentList, 'reload');

            fixture.detectChanges();
        });

        it('should call refresh onContentCopied event if parent is the same', () => {
            const nodes = [
                {  entry: { parentId: '1' } },
                {  entry: { parentId: '2' } }
            ];

            component.node =  <any>{ id: '1' };

            nodeActionsService.contentCopied.next(<any>nodes);

            expect(component.documentList.reload).toHaveBeenCalled();
        });

        it('should not call refresh onContentCopied event when parent mismatch', () => {
            const nodes = [
                {  entry: { parentId: '1' } },
                {  entry: { parentId: '2' } }
            ];

            component.node =  <any>{ id: '3' };

            nodeActionsService.contentCopied.next(<any>nodes);

            expect(component.documentList.reload).not.toHaveBeenCalled();
        });

        it('should call refresh onCreateFolder event', () => {
            contentManagementService.folderCreated.next();

            expect(component.documentList.reload).toHaveBeenCalled();
        });

        it('should call refresh editFolder event', () => {
            contentManagementService.folderEdited.next();

            expect(component.documentList.reload).toHaveBeenCalled();
        });

        it('should call refresh deleteNode event', () => {
            contentManagementService.nodesDeleted.next();

            expect(component.documentList.reload).toHaveBeenCalled();
        });

        it('should call refresh moveNode event', () => {
            contentManagementService.nodesMoved.next();

            expect(component.documentList.reload).toHaveBeenCalled();
        });

        it('should call refresh restoreNode event', () => {
            contentManagementService.nodesRestored.next();

            expect(component.documentList.reload).toHaveBeenCalled();
        });

        it('should call refresh on fileUploadComplete event if parent node match', () => {
            const file = { file: { options: { parentId: 'parentId' } } };
            component.node =  <any>{ id: 'parentId' };

            uploadService.fileUploadComplete.next(<any>file);

            expect(component.documentList.reload).toHaveBeenCalled();
        });

        it('should not call refresh on fileUploadComplete event if parent mismatch', () => {
            const file = { file: { options: { parentId: 'otherId' } } };
            component.node =  <any>{ id: 'parentId' };

            uploadService.fileUploadComplete.next(<any>file);

            expect(component.documentList.reload).not.toHaveBeenCalled();
        });

        it('should call refresh on fileUploadDeleted event if parent node match', () => {
            const file = { file: { options: { parentId: 'parentId' } } };
            component.node =  <any>{ id: 'parentId' };

            uploadService.fileUploadDeleted.next(<any>file);

            expect(component.documentList.reload).toHaveBeenCalled();
        });

        it('should not call refresh on fileUploadDeleted event if parent mismatch', () => {
            const file = { file: { options: { parentId: 'otherId' } } };
            component.node =  <any>{ id: 'parentId' };

            uploadService.fileUploadDeleted.next(<any>file);

            expect(component.documentList.reload).not.toHaveBeenCalled();
        });
    });

    describe('fetchNode()', () => {
        beforeEach(() => {
            spyOn(component, 'fetchNodes').and.returnValue(Observable.of(page));
            spyOn(nodesApi, 'getNode').and.returnValue(Observable.of(node));

            fixture.detectChanges();
        });

        it('should call getNode api with node id', () => {
            component.fetchNode('nodeId');

            expect(nodesApi.getNode).toHaveBeenCalledWith('nodeId');
        });
    });

    describe('fetchNodes()', () => {
        beforeEach(() => {
            spyOn(component, 'fetchNode').and.returnValue(Observable.of(node));
            spyOn(nodesApi, 'getNodeChildren').and.returnValue(Observable.of(page));

            fixture.detectChanges();
        });

        it('should call getNode api with node id', () => {
            component.fetchNodes('nodeId');

            expect(nodesApi.getNodeChildren).toHaveBeenCalledWith('nodeId', jasmine.any(Object));
        });
    });

    describe('onBreadcrumbNavigate()', () => {
        beforeEach(() => {
            spyOn(component, 'fetchNode').and.returnValue(Observable.of(node));
            spyOn(component, 'fetchNodes').and.returnValue(Observable.of(page));

            fixture.detectChanges();
        });

        it('should navigates to node id', () => {
            const routeData = <any>{ id: 'some-where-over-the-rainbow' };
            spyOn(component, 'navigate');

            component.onBreadcrumbNavigate(routeData);

            expect(component.navigate).toHaveBeenCalledWith(routeData.id);
        });
    });

    describe('Node navigation', () => {
        beforeEach(() => {
            spyOn(component, 'fetchNode').and.returnValue(Observable.of(node));
            spyOn(component, 'fetchNodes').and.returnValue(Observable.of(page));
            spyOn(router, 'navigate');

            fixture.detectChanges();
        });

        it('should navigates to node when id provided', () => {
            component.navigate(node.id);

            expect(router.navigate).toHaveBeenCalledWith(['./', node.id], jasmine.any(Object));
        });

        it('should navigates to home when id not provided', () => {
            component.navigate();

            expect(router.navigate).toHaveBeenCalledWith(['./'], jasmine.any(Object));
        });

        it('should navigate home if node is root', () => {
            (<any>component).node = {
                path: {
                    elements: [ {id: 'node-id'} ]
                }
            };

            component.navigate(node.id);

            expect(router.navigate).toHaveBeenCalledWith(['./'], jasmine.any(Object));
        });
    });

    describe('isSiteContainer', () => {
        it('should return false if node has no aspectNames', () => {
            const mock  = { aspectNames: [] };

            expect(component.isSiteContainer(mock)).toBe(false);
        });

        it('should return false if node is not site container', () => {
            const mock  = { aspectNames: ['something-else'] };

            expect(component.isSiteContainer(mock)).toBe(false);
        });

        it('should return true if node is a site container', () => {
            const mock  = { aspectNames: [ 'st:siteContainer' ] };

            expect(component.isSiteContainer(mock)).toBe(true);
        });
    });
});
