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

import { CoreModule, NodesApiService, AlfrescoApiService, AlfrescoContentService } from 'ng2-alfresco-core';
import { CommonModule } from '../../common/common.module';

import { ContentManagementService } from '../../common/services/content-management.service';

import { FavoritesComponent } from './favorites.component';

describe('Favorites Routed Component', () => {
    let fixture;
    let component: FavoritesComponent;
    let nodesApi: NodesApiService;
    let alfrescoApi: AlfrescoApiService;
    let alfrescoContentService: AlfrescoContentService;
    let contentService: ContentManagementService;
    let router: Router;
    let page;
    let node;

    beforeAll(() => {
        // testing only functional-wise not time-wise
        Observable.prototype.debounceTime = function () { return this; };
    });

    beforeEach(() => {
        page = {
            list: {
                entries: [
                    { entry: { id: 1, target: { file: {} } } },
                    { entry: { id: 2, target: { folder: {} } } }
                ],
                pagination: { data: 'data'}
            }
        };

        node = <any> {
            id: 'folder-node',
            isFolder: true,
            isFile: false,
            path: {
                elements: []
            }
        };
    });

    beforeEach(async(() => {
        TestBed.configureTestingModule({
                imports: [
                    CoreModule,
                    CommonModule,
                    RouterTestingModule
                ],
                declarations: [
                    FavoritesComponent
                ]
        })
        .compileComponents().then(() => {
            fixture = TestBed.createComponent(FavoritesComponent);
            component = fixture.componentInstance;

            nodesApi = TestBed.get(NodesApiService);
            alfrescoApi = TestBed.get(AlfrescoApiService);
            alfrescoContentService = TestBed.get(AlfrescoContentService);
            contentService = TestBed.get(ContentManagementService);
            router = TestBed.get(Router);
        });
    }));

    beforeEach(() => {
        spyOn(alfrescoApi.favoritesApi, 'getFavorites').and.returnValue(Promise.resolve(page));
    });

    describe('Events', () => {
        it('should refresh on editing folder event', () => {
            spyOn(component, 'refresh');
            fixture.detectChanges();

            alfrescoContentService.folderEdit.next(null);

            expect(component.refresh).toHaveBeenCalled();
        });

        it('should refresh on move node event', () => {
            spyOn(component, 'refresh');
            fixture.detectChanges();

            contentService.moveNode.next(null);

            expect(component.refresh).toHaveBeenCalled();
        });

        it('should fetch nodes on favorite toggle', () => {
            spyOn(component, 'refresh');
            fixture.detectChanges();

            contentService.toggleFavorite.next(null);

            expect(component.refresh).toHaveBeenCalled();
        });
    });

    describe('Node navigation', () => {
        beforeEach(() => {
            spyOn(nodesApi, 'getNode').and.returnValue(Observable.of(node));
            spyOn(router, 'navigate');
            fixture.detectChanges();
        });

        it('navigates to `/libraries` if node path has `Sites`', () => {
            node.path.elements = [{ name: 'Sites' }];

            component.navigate(node);

            expect(router.navigate).toHaveBeenCalledWith([ '/libraries', 'folder-node' ]);
        });

        it('navigates to `/personal-files` if node path has no `Sites`', () => {
            node.path.elements = [{ name: 'something else' }];

            component.navigate(node);

            expect(router.navigate).toHaveBeenCalledWith([ '/personal-files', 'folder-node' ]);
        });

        it('does not navigate when node is not folder', () => {
            node.isFolder = false;

            component.navigate(node);

            expect(router.navigate).not.toHaveBeenCalled();
        });
    });

    describe('onNodeDoubleClick', () => {
        beforeEach(() => {
            spyOn(nodesApi, 'getNode').and.returnValue(Observable.of(node));
            fixture.detectChanges();
        });

        it('navigates if node is a folder', () => {
            node.isFolder = true;
            spyOn(router, 'navigate');

            component.onNodeDoubleClick(node);

            expect(router.navigate).toHaveBeenCalled();
        });

        it('opens preview if node is a file', () => {
            node.isFolder = false;
            node.isFile = true;
            spyOn(router, 'navigate').and.stub();

            component.onNodeDoubleClick(node);

            expect(router.navigate).toHaveBeenCalledWith(['/preview', node.id]);
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
