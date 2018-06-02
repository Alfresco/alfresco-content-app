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
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import {
    NotificationService, TranslationService, TranslationMock,
    NodesApiService, AlfrescoApiService, ContentService,
    UserPreferencesService, LogService, AppConfigService,
    StorageService, CookieService, ThumbnailService,
    AuthenticationService, TimeAgoPipe, NodeNameTooltipPipe,
    NodeFavoriteDirective, DataTableComponent, AppConfigPipe
} from '@alfresco/adf-core';
import { DocumentListComponent, CustomResourcesService } from '@alfresco/adf-content-services';
import { TranslateModule } from '@ngx-translate/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatMenuModule, MatSnackBarModule, MatIconModule } from '@angular/material';
import { DocumentListService } from '@alfresco/adf-content-services';
import { ContentManagementService } from '../../common/services/content-management.service';
import { NodeInfoDirective } from '../../common/directives/node-info.directive';

import { TrashcanComponent } from './trashcan.component';

describe('TrashcanComponent', () => {
    let fixture: ComponentFixture<TrashcanComponent>;
    let component: TrashcanComponent;
    let alfrescoApi: AlfrescoApiService;
    let contentService: ContentManagementService;
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
                TrashcanComponent,
                AppConfigPipe
            ],
            providers: [
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
        .compileComponents()
        .then(() => {
            fixture = TestBed.createComponent(TrashcanComponent);
            component = fixture.componentInstance;

            alfrescoApi = TestBed.get(AlfrescoApiService);
            alfrescoApi.reset();
            contentService = TestBed.get(ContentManagementService);

            component.documentList = {
                reload:  jasmine.createSpy('reload'),
                resetSelection: jasmine.createSpy('resetSelection')
            };
        });
    }));

    beforeEach(() => {
        spyOn(alfrescoApi.nodesApi, 'getDeletedNodes').and.returnValue(Promise.resolve(page));
    });

    describe('onRestoreNode()', () => {
        it('should call refresh()', () => {
            spyOn(component, 'refresh');
            fixture.detectChanges();

            contentService.nodeRestored.next();

            expect(component.refresh).toHaveBeenCalled();
        });
    });

    describe('refresh()', () => {
        it('calls child component to reload', () => {
            component.refresh();
            expect(component.documentList.reload).toHaveBeenCalled();
        });

        it('calls child component to reset selection', () => {
            component.refresh();
            expect(component.documentList.resetSelection).toHaveBeenCalled();
        });
    });
});
