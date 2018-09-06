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

import { NgModule } from '@angular/core';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { TranslatePipeMock } from './translate-pipe.directive';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
    TranslationService,
    TranslationMock,
    AuthenticationService,
    UserPreferencesService,
    AppConfigService,
    StorageService,
    AlfrescoApiService,
    LogService,
    NotificationService,
    NodesApiService,
    ContentService,
    ThumbnailService,
    UploadService,
    AlfrescoApiMock
} from '@alfresco/adf-core';
import { HttpClientModule } from '@angular/common/http';
import { TranslateServiceMock } from './translation.service';
import { StoreModule } from '@ngrx/store';
import { appReducer } from '../store/reducers/app.reducer';
import { INITIAL_STATE } from '../store/states/app.state';
import { RouterTestingModule } from '@angular/router/testing';
import { EffectsModule } from '@ngrx/effects';
import {
    CustomResourcesService,
    DocumentListService
} from '@alfresco/adf-content-services';
import { MaterialModule } from '../material.module';
import { ContentManagementService } from '../services/content-management.service';
import { NodeActionsService } from '../services/node-actions.service';
import { NodePermissionService } from '../services/node-permission.service';
import { ContentApiService } from '../services/content-api.service';
import { AppExtensionService } from '../extensions/extension.service';
import { ViewUtilService } from '../components/preview/view-util.service';
import { ExtensionLoaderService, ExtensionService } from '@alfresco/adf-extensions';

@NgModule({
    imports: [
        NoopAnimationsModule,
        HttpClientModule,
        RouterTestingModule,
        MaterialModule,
        StoreModule.forRoot(
            { app: appReducer },
            { initialState: INITIAL_STATE }
        ),
        EffectsModule.forRoot([])
    ],
    declarations: [TranslatePipeMock],
    exports: [
        TranslatePipeMock,
        RouterTestingModule,
        MaterialModule,
    ],
    providers: [
        { provide: AlfrescoApiService, useClass: AlfrescoApiMock },
        { provide: TranslationService, useClass: TranslationMock },
        { provide: TranslateService, useClass: TranslateServiceMock },
        { provide: TranslatePipe, useClass: TranslatePipeMock },
        {
            provide: AuthenticationService,
            useValue: {
                isEcmLoggedIn(): boolean {
                    return true;
                },
                getRedirect(): string {
                    return null;
                }
            }
        },
        UserPreferencesService,
        AppConfigService,
        StorageService,
        AlfrescoApiService,
        LogService,
        NotificationService,
        NodesApiService,
        ContentService,
        ThumbnailService,
        UploadService,
        CustomResourcesService,
        DocumentListService,

        ContentManagementService,
        NodeActionsService,
        NodePermissionService,
        ContentApiService,
        AppExtensionService,
        ExtensionService,
        ExtensionLoaderService,
        ViewUtilService
    ]
})
export class AppTestingModule {}
