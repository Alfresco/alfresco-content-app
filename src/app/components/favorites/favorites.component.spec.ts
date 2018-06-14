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
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import {
    NodesApiService, AlfrescoApiService, ContentService,
    UserPreferencesService, LogService, AppConfigService,
    StorageService, CookieService, ThumbnailService,
    AuthenticationService, TimeAgoPipe, NodeNameTooltipPipe,
    NodeFavoriteDirective, DataTableComponent, AppConfigPipe
} from '@alfresco/adf-core';
import { DocumentListComponent, CustomResourcesService } from '@alfresco/adf-content-services';

import { MatMenuModule, MatSnackBarModule, MatIconModule } from '@angular/material';
import { DocumentListService } from '@alfresco/adf-content-services';
import { ContentManagementService } from '../../common/services/content-management.service';
import { NodePermissionService } from '../../common/services/node-permission.service';

import { FavoritesComponent } from './favorites.component';
import { AppTestingModule } from '../../testing/app-testing.module';

describe('FavoritesComponent', () => {
    let fixture: ComponentFixture<FavoritesComponent>;
    let component: FavoritesComponent;
    let nodesApi: NodesApiService;
    let alfrescoApi: AlfrescoApiService;
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
                    AppTestingModule,
                    MatMenuModule,
                    MatSnackBarModule, MatIconModule,
                ],
                declarations: [
                    DataTableComponent,
                    TimeAgoPipe,
                    NodeNameTooltipPipe,
                    NodeFavoriteDirective,
                    DocumentListComponent,
                    FavoritesComponent,
                    AppConfigPipe
                ],
                providers: [
                    AuthenticationService,
                    UserPreferencesService,
                    AppConfigService, StorageService, CookieService,
                    AlfrescoApiService,
                    CustomResourcesService,
                    LogService,
                    ContentManagementService,
                    ContentService,
                    NodesApiService,
                    NodePermissionService,
                    DocumentListService,
                    ThumbnailService
                ],
                schemas: [ NO_ERRORS_SCHEMA ]
        })
        .compileComponents().then(() => {
            fixture = TestBed.createComponent(FavoritesComponent);
            component = fixture.componentInstance;

            nodesApi = TestBed.get(NodesApiService);
            alfrescoApi = TestBed.get(AlfrescoApiService);
            alfrescoApi.reset();
            contentService = TestBed.get(ContentManagementService);
            router = TestBed.get(Router);
        });
    }));

    beforeEach(() => {
        spyOn(alfrescoApi.favoritesApi, 'getFavorites').and.returnValue(Promise.resolve(page));
    });

    describe('Events', () => {
        beforeEach(() => {
            spyOn(component, 'reload');
            fixture.detectChanges();
        });

        it('should refresh on editing folder event', () => {
            contentService.folderEdited.next(null);

            expect(component.reload).toHaveBeenCalled();
        });

        it('should refresh on move node event', () => {
            contentService.nodesMoved.next(null);

            expect(component.reload).toHaveBeenCalled();
        });

        it('should refresh on node deleted event', () => {
            contentService.nodesDeleted.next(null);

            expect(component.reload).toHaveBeenCalled();
        });

        it('should refresh on node restore event', () => {
            contentService.nodesRestored.next(null);

            expect(component.reload).toHaveBeenCalled();
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

    describe('refresh', () => {
        it('should call document list reload', () => {
            spyOn(component.documentList, 'reload');
            fixture.detectChanges();

            component.reload();

            expect(component.documentList.reload).toHaveBeenCalled();
        });
    });
});
