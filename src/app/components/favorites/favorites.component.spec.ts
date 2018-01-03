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
import { RouterTestingModule } from '@angular/router/testing';
import { TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Rx';
import { CoreModule, NodesApiService, AlfrescoApiService, ContentService } from '@alfresco/adf-core';

import { CommonModule } from '../../common/common.module';
import { LocationLinkComponent } from '../location-link/location-link.component';
import { ContentManagementService } from '../../common/services/content-management.service';

import { FavoritesComponent } from './favorites.component';

describe('Favorites Routed Component', () => {
    let fixture;
    let component: FavoritesComponent;
    let nodesApi: NodesApiService;
    let alfrescoApi: AlfrescoApiService;
    let alfrescoContentService: ContentService;
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
                    LocationLinkComponent,
                    FavoritesComponent
                ]
        })
        .compileComponents().then(() => {
            fixture = TestBed.createComponent(FavoritesComponent);
            component = fixture.componentInstance;

            nodesApi = TestBed.get(NodesApiService);
            alfrescoApi = TestBed.get(AlfrescoApiService);
            alfrescoContentService = TestBed.get(ContentService);
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

    describe('edit option', () => {
        it('should return false if a file node is selected', () => {
            const selection = [
                {
                    entry: {
                        isFolder: false,
                        isFile: true
                    }
                }
            ];

            const result = component.showEditOption(selection);
            expect(result).toBe(false);
        });

        it('should return false if multiple nodes are selected', () => {
            const selection = [
                {
                    entry: {
                        isFolder: true,
                        isFile: false
                    }
                },
                {
                    entry: {
                        isFolder: true,
                        isFile: false
                    }
                }
            ];

            const result = component.showEditOption(selection);
            expect(result).toBe(false);
        });

        it('should return true if selected node is a folder', () => {
            const selection = [
                {
                    entry: {
                        isFolder: true,
                        isFile: false
                    }
                }
            ];

            const result = component.showEditOption(selection);
            expect(result).toBe(true);
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
