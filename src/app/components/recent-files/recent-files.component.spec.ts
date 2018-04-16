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

import { TestBed, async } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import {
    NotificationService, TranslationService, TranslationMock,
    NodesApiService, AlfrescoApiService, ContentService,
    UserPreferencesService, LogService, AppConfigService,
    StorageService, CookieService, ThumbnailService, AuthenticationService,
    TimeAgoPipe, NodeNameTooltipPipe, NodeFavoriteDirective, DataTableComponent
} from '@alfresco/adf-core';
import { DocumentListComponent, CustomResourcesService } from '@alfresco/adf-content-services';
import { TranslateModule } from '@ngx-translate/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatMenuModule, MatSnackBarModule, MatIconModule } from '@angular/material';
import { DocumentListService } from '@alfresco/adf-content-services';
import { ContentManagementService } from '../../common/services/content-management.service';
import { NodeInfoDirective } from '../../common/directives/node-info.directive';
import { AppConfigPipe } from '../../common/pipes/app-config.pipe';

import { RecentFilesComponent } from './recent-files.component';

describe('RecentFiles Routed Component', () => {
    let fixture;
    let component;
    let router: Router;
    let alfrescoApi: AlfrescoApiService;
    let contentService: ContentManagementService;
    let preferenceService: UserPreferencesService;
    let page;
    let person;

    beforeEach(() => {
        page = {
            list: {
                entries: [ { entry: { id: 1 } }, { entry: { id: 2 } } ],
                pagination: { data: 'data'}
            }
        };

        person = { entry: { id: 'bogus' } };
    });

    beforeEach(async(() => {
        TestBed.configureTestingModule({
                imports: [
                    MatMenuModule,
                    NoopAnimationsModule,
                    HttpClientModule,
                    TranslateModule.forRoot(),
                    RouterTestingModule,
                    MatSnackBarModule, MatIconModule
                ],
                declarations: [
                    DataTableComponent,
                    TimeAgoPipe,
                    NodeNameTooltipPipe,
                    NodeFavoriteDirective,
                    NodeInfoDirective,
                    DocumentListComponent,
                    RecentFilesComponent,
                    AppConfigPipe
                ],
                providers: [
                    { provide: ActivatedRoute, useValue: {
                        snapshot: { data: { preferencePrefix: 'prefix' } }
                    } } ,
                    { provide: TranslationService, useClass: TranslationMock },
                    AuthenticationService,
                    UserPreferencesService,
                    AppConfigService, StorageService, CookieService,
                    AlfrescoApiService,
                    LogService,
                    NotificationService,
                    ContentManagementService,
                    ContentService,
                    NodesApiService,
                    DocumentListService,
                    ThumbnailService,
                    CustomResourcesService
                ],
                schemas: [ NO_ERRORS_SCHEMA ]
        })
        .compileComponents().then(() => {
            fixture = TestBed.createComponent(RecentFilesComponent);
            component = fixture.componentInstance;

            router = TestBed.get(Router);
            contentService = TestBed.get(ContentManagementService);
            preferenceService = TestBed.get(UserPreferencesService);
            alfrescoApi = TestBed.get(AlfrescoApiService);
            alfrescoApi.reset();
        });
    }));

    beforeEach(() => {
        spyOn(alfrescoApi.peopleApi, 'getPerson').and.returnValue(Promise.resolve({
             entry: { id: 'personId' }
        }));

        spyOn(alfrescoApi.searchApi, 'search').and.returnValue(Promise.resolve(page));
    });

    describe('OnInit()', () => {
        beforeEach(() => {
            spyOn(component, 'refresh').and.stub();
        });

        it('should reload nodes on onDeleteNode event', () => {
            fixture.detectChanges();

            contentService.nodeDeleted.next();

            expect(component.refresh).toHaveBeenCalled();
        });

        it('should reload on onRestoreNode event', () => {
            fixture.detectChanges();

            contentService.nodeRestored.next();

            expect(component.refresh).toHaveBeenCalled();
        });

        it('should reload on move node event', () => {
            fixture.detectChanges();

            contentService.nodeMoved.next();

            expect(component.refresh).toHaveBeenCalled();
        });
    });

    describe('onNodeDoubleClick()', () => {
        beforeEach(() => {
            spyOn(component, 'fetchNodes').and.callFake(val => val);
        });

        it('open preview if node is file', () => {
            spyOn(router, 'navigate').and.stub();
            const node: any = { id: 'node-id', isFile: true };

            component.onNodeDoubleClick(node);
            fixture.detectChanges();

            expect(router.navigate['calls'].argsFor(0)[0]).toEqual(['./preview', node.id]);
        });

        it('does not open preview if node is folder', () => {
            spyOn(router, 'navigate').and.stub();
            const node: any = { isFolder: true };

            component.onNodeDoubleClick(node);
            fixture.detectChanges();

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

    describe('onSortingChanged', () => {
        it('should save sorting input', () => {
            spyOn(preferenceService, 'set');

            const event = <any>{
                detail: {
                    key: 'some-name',
                    direction: 'some-direction'
                }
             };

            component.onSortingChanged(event);

            expect(preferenceService.set).toHaveBeenCalledWith('prefix.sorting.key', 'some-name');
            expect(preferenceService.set).toHaveBeenCalledWith('prefix.sorting.direction', 'some-direction');
        });

        it('should save default sorting when no input', () => {
            spyOn(preferenceService, 'set');

            const event = <any>{
                detail: {}
             };

            component.onSortingChanged(event);

            expect(preferenceService.set).toHaveBeenCalledWith('prefix.sorting.key', 'modifiedAt');
            expect(preferenceService.set).toHaveBeenCalledWith('prefix.sorting.direction', 'desc');
        });
    });
});
