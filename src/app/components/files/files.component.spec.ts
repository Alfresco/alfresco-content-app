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

import { Observable } from 'rxjs/Rx';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TestBed, async } from '@angular/core/testing';
import { UploadService, NodesApiService, FileUploadCompleteEvent,
        FileUploadDeleteEvent, FileModel, AlfrescoContentService } from 'ng2-alfresco-core';

import { CommonModule } from '../../common/common.module';
import { ContentManagementService } from '../../common/services/content-management.service';
import { BrowsingFilesService } from '../../common/services/browsing-files.service';
import { NodeActionsService } from '../../common/services/node-actions.service';
import { GenericErrorComponent } from '../generic-error/generic-error.component';
import { FilesComponent } from './files.component';

describe('FilesComponent', () => {
    let node;
    let page;
    let fixture;
    let component: FilesComponent;
    let contentManagementService: ContentManagementService;
    let alfrescoContentService: AlfrescoContentService;
    let uploadService: UploadService;
    let nodesApi: NodesApiService;
    let router: Router;
    let browsingFilesService: BrowsingFilesService;
    let nodeActionsService: NodeActionsService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule,
                CommonModule
            ],
            declarations: [
                FilesComponent,
                GenericErrorComponent
            ]
        }).compileComponents()
        .then(() => {

            fixture = TestBed.createComponent(FilesComponent);
            component = fixture.componentInstance;

            contentManagementService = TestBed.get(ContentManagementService);
            uploadService = TestBed.get(UploadService);
            nodesApi = TestBed.get(NodesApiService);
            router = TestBed.get(Router);
            alfrescoContentService = TestBed.get(AlfrescoContentService);
            browsingFilesService = TestBed.get(BrowsingFilesService);
            nodeActionsService = TestBed.get(NodeActionsService);
        });
    }));

    beforeEach(() => {
        node = { id: 'node-id' };
        page = {
            list: {
                entries: ['a', 'b', 'c'],
                pagination: {}
            }
        };
    });

    describe('OnInit', () => {
        it('set current node', () => {
            spyOn(component, 'fetchNode').and.returnValue(Observable.of(node));
            spyOn(component, 'fetchNodes').and.returnValue(Observable.of(page));

            fixture.detectChanges();

            expect(component.node).toBe(node);
        });

        it('get current node children', () => {
            spyOn(component, 'fetchNode').and.returnValue(Observable.of(node));
            spyOn(component, 'fetchNodes').and.returnValue(Observable.of(page));

            fixture.detectChanges();

            expect(component.paging).toBe(page);
        });

        it('emits onChangeParent event', () => {
            spyOn(component, 'fetchNode').and.returnValue(Observable.of(node));
            spyOn(component, 'fetchNodes').and.returnValue(Observable.of(page));
            spyOn(browsingFilesService.onChangeParent, 'next').and.callFake((val) => val);

            fixture.detectChanges();

            expect(browsingFilesService.onChangeParent.next)
                .toHaveBeenCalledWith(node);
        });

        it('raise error when fetchNode() fails', () => {
            spyOn(component, 'fetchNode').and.returnValue(Observable.throw(null));
            spyOn(component, 'onFetchError');

            fixture.detectChanges();

            expect(component.onFetchError).toHaveBeenCalled();
        });

        it('raise error when fetchNodes() fails', () => {
            spyOn(component, 'fetchNode').and.returnValue(Observable.of(node));
            spyOn(component, 'fetchNodes').and.returnValue(Observable.throw(null));
            spyOn(component, 'onFetchError');

            fixture.detectChanges();

            expect(component.onFetchError).toHaveBeenCalled();
        });
    });

    describe('refresh on events', () => {
        beforeEach(() => {
            spyOn(component, 'fetchNode').and.returnValue(Observable.of(node));
            spyOn(component, 'fetchNodes').and.returnValue(Observable.of(page));
            spyOn(component, 'load');

            fixture.detectChanges();
        });

        it('reset favorites colection  onToggleFavorite event', () => {
            contentManagementService.toggleFavorite.next(null);

            expect(component.load).toHaveBeenCalled();
        });

        it('calls refresh onContentCopied event if parent is the same', () => {
            const nodes = [
                {  entry: { parentId: '1' } },
                {  entry: { parentId: '2' } }
            ];

            component.node =  <any>{ id: '1' };

            nodeActionsService.contentCopied.next(<any>nodes);

            expect(component.load).toHaveBeenCalled();
        });

        it('does not call refresh onContentCopied event when parent mismatch', () => {
            const nodes = [
                {  entry: { parentId: '1' } },
                {  entry: { parentId: '2' } }
            ];

            component.node =  <any>{ id: '3' };

            nodeActionsService.contentCopied.next(<any>nodes);

            expect(component.load).not.toHaveBeenCalled();
        });

        it('calls refresh onCreateFolder event', () => {
            alfrescoContentService.folderCreate.next();

            expect(component.load).toHaveBeenCalled();
        });

        it('calls refresh editFolder event', () => {
            alfrescoContentService.folderEdit.next();

            expect(component.load).toHaveBeenCalled();
        });

        it('calls refresh deleteNode event', () => {
            contentManagementService.deleteNode.next();

            expect(component.load).toHaveBeenCalled();
        });

        it('calls refresh moveNode event', () => {
            contentManagementService.moveNode.next();

            expect(component.load).toHaveBeenCalled();
        });

        it('calls refresh restoreNode event', () => {
            contentManagementService.restoreNode.next();

            expect(component.load).toHaveBeenCalled();
        });

        it('calls refresh on fileUploadComplete event if parent node match', () => {
            const file = { file: { options: { parentId: 'parentId' } } };
            component.node =  <any>{ id: 'parentId' };

            uploadService.fileUploadComplete.next(<any>file);

            expect(component.load).toHaveBeenCalled();
        });

        it('does not call refresh on fileUploadComplete event if parent mismatch', () => {
            const file = { file: { options: { parentId: 'otherId' } } };
            component.node =  <any>{ id: 'parentId' };

            uploadService.fileUploadComplete.next(<any>file);

            expect(component.load).not.toHaveBeenCalled();
        });

        it('calls refresh on fileUploadDeleted event if parent node match', () => {
            const file = { file: { options: { parentId: 'parentId' } } };
            component.node =  <any>{ id: 'parentId' };

            uploadService.fileUploadDeleted.next(<any>file);

            expect(component.load).toHaveBeenCalled();
        });

        it('does not call refresh on fileUploadDeleted event if parent mismatch', () => {
            const file = { file: { options: { parentId: 'otherId' } } };
            component.node =  <any>{ id: 'parentId' };

            uploadService.fileUploadDeleted.next(<any>file);

            expect(component.load).not.toHaveBeenCalled();
        });
    });

    describe('fetchNode()', () => {
        beforeEach(() => {
            spyOn(component, 'fetchNodes').and.returnValue(Observable.of(page));
            spyOn(nodesApi, 'getNode').and.returnValue(Observable.of(node));

            fixture.detectChanges();
        });

        it('calls getNode api with node id', () => {
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

        it('calls getNode api with node id', () => {
            component.fetchNodes('nodeId');

            expect(nodesApi.getNodeChildren).toHaveBeenCalledWith('nodeId', {});
        });
    });

    describe('Create permission', () => {
        beforeEach(() => {
            spyOn(component, 'fetchNode').and.returnValue(Observable.of(node));
            spyOn(component, 'fetchNodes').and.returnValue(Observable.of(page));

            fixture.detectChanges();
        });

        it('returns false when node is not provided', () => {
            expect(component.canCreateContent(null)).toBe(false);
        });

        it('returns false when node does not have permission', () => {
            spyOn(alfrescoContentService, 'hasPermission').and.returnValue(false);

            expect(component.canCreateContent(node)).toBe(false);
        });

        it('returns false when node has permission', () => {
            spyOn(alfrescoContentService, 'hasPermission').and.returnValue(true);

            expect(component.canCreateContent(node)).toBe(true);
        });
    });

    describe('onNodeDoubleClick()', () => {
        beforeEach(() => {
            spyOn(component, 'fetchNode').and.returnValue(Observable.of(node));
            spyOn(component, 'fetchNodes').and.returnValue(Observable.of(page));

            fixture.detectChanges();
        });

        it('opens preview if node is file', () => {
            spyOn(router, 'navigate').and.stub();
            node.isFile = true;

            component.onNodeDoubleClick(<any> node);

            expect(router.navigate).toHaveBeenCalledWith(['/preview', node.id]);
        });

        it('navigate if node is folder', () => {
            spyOn(component, 'navigate').and.stub();
            node.isFolder = true;

            component.onNodeDoubleClick(<any> node);

            expect(component.navigate).toHaveBeenCalled();
        });
    });

    describe('load()', () => {
        let fetchNodesSpy;

        beforeEach(() => {
            spyOn(component, 'fetchNode').and.returnValue(Observable.of(node));
            fetchNodesSpy = spyOn(component, 'fetchNodes');

            fetchNodesSpy.and.returnValue(Observable.of(page));

            fixture.detectChanges();
        });

        afterEach(() => {
            fetchNodesSpy.calls.reset();
        });

        it('shows load indicator', () => {
            spyOn(component, 'onPageLoaded');
            component.node = <any>{ id: 'currentNode' };

            expect(component.isLoading).toBe(false);

            component.load(true);

            expect(component.isLoading).toBe(true);
        });

        it('does not show load indicator', () => {
            spyOn(component, 'onPageLoaded');
            component.node = <any>{ id: 'currentNode' };

            expect(component.isLoading).toBe(false);

            component.load();

            expect(component.isLoading).toBe(false);
        });

        it('sets data on success', () => {
            component.node = <any>{ id: 'currentNode' };

            component.load();

            expect(component.paging).toBe(page);
            expect(component.pagination).toBe(page.list.pagination);
        });

        it('raise error on fail', () => {
            fetchNodesSpy.and.returnValue(Observable.throw(null));
            spyOn(component, 'onFetchError');

            component.load();

            expect(component.onFetchError).toHaveBeenCalled();
        });
    });

    describe('onBreadcrumbNavigate()', () => {
        beforeEach(() => {
            spyOn(component, 'fetchNode').and.returnValue(Observable.of(node));
            spyOn(component, 'fetchNodes').and.returnValue(Observable.of(page));

            fixture.detectChanges();
        });

        it('navigates to node id', () => {
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

        it('navigates to node when id provided', () => {
            component.navigate(node.id);

            expect(router.navigate).toHaveBeenCalledWith(['./', node.id], jasmine.any(Object));
        });

        it('navigates to home when id not provided', () => {
            component.navigate();

            expect(router.navigate).toHaveBeenCalledWith(['./'], jasmine.any(Object));
        });

        it('it navigate home if node is root', () => {
            (<any>component).node = {
                path: {
                    elements: [ {id: 'node-id'} ]
                }
            };

            component.navigate(node.id);

            expect(router.navigate).toHaveBeenCalledWith(['./'], jasmine.any(Object));
        });
    });
});
