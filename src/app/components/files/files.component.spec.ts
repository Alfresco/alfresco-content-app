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

import { TestBed, fakeAsync, tick, ComponentFixture } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
    TimeAgoPipe, NodeNameTooltipPipe, FileSizePipe, NodeFavoriteDirective,
    DataTableComponent,
    UploadService,
    AppConfigPipe
} from '@alfresco/adf-core';
import { DocumentListComponent } from '@alfresco/adf-content-services';
import { ContentManagementService } from '../../services/content-management.service';
import { NodeActionsService } from '../../services/node-actions.service';
import { FilesComponent } from './files.component';
import { AppTestingModule } from '../../testing/app-testing.module';
import { ContentApiService } from '../../services/content-api.service';
import { ExperimentalDirective } from '../../directives/experimental.directive';
import { of, throwError } from 'rxjs';

describe('FilesComponent', () => {
    let node;
    let fixture: ComponentFixture<FilesComponent>;
    let component: FilesComponent;
    let contentManagementService: ContentManagementService;
    let uploadService: UploadService;
    let router: Router;
    let nodeActionsService: NodeActionsService;
    let contentApi: ContentApiService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ AppTestingModule ],
            declarations: [
                FilesComponent,
                DataTableComponent,
                TimeAgoPipe,
                NodeNameTooltipPipe,
                NodeFavoriteDirective,
                DocumentListComponent,
                FileSizePipe,
                AppConfigPipe,
                ExperimentalDirective
            ],
            providers: [
                { provide: ActivatedRoute, useValue: {
                    snapshot: { data: { preferencePrefix: 'prefix' } },
                    params: of({ folderId: 'someId' })
                } }
            ],
            schemas: [ NO_ERRORS_SCHEMA ]
        });

        fixture = TestBed.createComponent(FilesComponent);
        component = fixture.componentInstance;

        contentManagementService = TestBed.get(ContentManagementService);
        uploadService = TestBed.get(UploadService);
        router = TestBed.get(Router);
        nodeActionsService = TestBed.get(NodeActionsService);
        contentApi = TestBed.get(ContentApiService);
    });

    beforeEach(() => {
        node = { id: 'node-id', isFolder: true };
        spyOn(component.documentList, 'loadFolder').and.callFake(() => {});
    });

    describe('Current page is valid', () => {
        it('should be a valid current page', fakeAsync(() => {
            spyOn(contentApi, 'getNode').and.returnValue(throwError(null));

            component.ngOnInit();
            fixture.detectChanges();
            tick();

            expect(component.isValidPath).toBe(false);
        }));

        it('should set current page as invalid path', fakeAsync(() => {
            spyOn(contentApi, 'getNode').and.returnValue(of({ entry: node }));

            component.ngOnInit();
            tick();
            fixture.detectChanges();

            expect(component.isValidPath).toBe(true);
        }));
    });

    describe('OnInit', () => {
        it('should set current node', () => {
            spyOn(contentApi, 'getNode').and.returnValue(of({ entry: node }));
            fixture.detectChanges();
            expect(component.node).toBe(node);
        });

        it('if should navigate to parent if node is not a folder', () => {
            node.isFolder = false;
            node.parentId = 'parent-id';
            spyOn(contentApi, 'getNode').and.returnValue(of({ entry: node }));
            spyOn(router, 'navigate');

            fixture.detectChanges();

            expect(router.navigate['calls'].argsFor(0)[0]).toEqual(['/personal-files', 'parent-id']);
        });
    });

    describe('refresh on events', () => {
        beforeEach(() => {
            spyOn(contentApi, 'getNode').and.returnValue(of({ entry: node }));
            spyOn(component.documentList, 'reload');

            fixture.detectChanges();
        });

        it('should call refresh onContentCopied event if parent is the same', () => {
            const nodes = [
                {  entry: { parentId: '1' } },
                {  entry: { parentId: '2' } }
            ];

            component.node = { id: '1' };

            nodeActionsService.contentCopied.next(nodes);

            expect(component.documentList.reload).toHaveBeenCalled();
        });

        it('should not call refresh onContentCopied event when parent mismatch', () => {
            const nodes = [
                {  entry: { parentId: '1' } },
                {  entry: { parentId: '2' } }
            ];

            component.node = { id: '3' };

            nodeActionsService.contentCopied.next(nodes);

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

        it('should call refresh on fileUploadComplete event if parent node match', fakeAsync(() => {
            const file = { file: { options: { parentId: 'parentId' } } };
            component.node = { id: 'parentId' };

            uploadService.fileUploadComplete.next(<any>file);

            tick(500);

            expect(component.documentList.reload).toHaveBeenCalled();
        }));

        it('should not call refresh on fileUploadComplete event if parent mismatch', fakeAsync(() => {
            const file = { file: { options: { parentId: 'otherId' } } };
            component.node = { id: 'parentId' };

            uploadService.fileUploadComplete.next(<any>file);

            tick(500);

            expect(component.documentList.reload).not.toHaveBeenCalled();
        }));

        it('should call refresh on fileUploadDeleted event if parent node match', fakeAsync(() => {
            const file = { file: { options: { parentId: 'parentId' } } };
            component.node = { id: 'parentId' };

            uploadService.fileUploadDeleted.next(<any>file);

            tick(500);

            expect(component.documentList.reload).toHaveBeenCalled();
        }));

        it('should not call refresh on fileUploadDeleted event if parent mismatch', fakeAsync(() => {
            const file: any = { file: { options: { parentId: 'otherId' } } };
            component.node = { id: 'parentId' };

            uploadService.fileUploadDeleted.next(file);

            tick(500);

            expect(component.documentList.reload).not.toHaveBeenCalled();
        }));
    });


    describe('onBreadcrumbNavigate()', () => {
        beforeEach(() => {
            spyOn(contentApi, 'getNode').and.returnValue(of({ entry: node }));
            fixture.detectChanges();
        });

        it('should navigates to node id', () => {
            const routeData: any = { id: 'some-where-over-the-rainbow' };
            spyOn(component, 'navigate');

            component.onBreadcrumbNavigate(routeData);

            expect(component.navigate).toHaveBeenCalledWith(routeData.id);
        });
    });

    describe('Node navigation', () => {
        beforeEach(() => {
            spyOn(contentApi, 'getNode').and.returnValue(of({ entry: node }));
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
            component.node = {
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
