/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2020 Alfresco Software Limited
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
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  AlfrescoApiService,
  AlfrescoApiServiceMock,
  PipeModule,
  TranslateLoaderService,
  TranslationMock,
  TranslationService
} from '@alfresco/adf-core';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { CommonModule } from '@angular/common';

export const initialState = {
  app: {
    appName: 'Alfresco Content Application',
    headerColor: '#ffffff',
    logoPath: 'assets/images/alfresco-logo-white.svg',
    headerImagePath: 'assets/images/mastHead-bg-shapesPattern.svg',
    sharedUrl: '',
    user: {
      isAdmin: null,
      id: null,
      firstName: '',
      lastName: ''
    },
    selection: {
      nodes: [],
      libraries: [],
      isEmpty: true,
      count: 0
    },
    navigation: {
      currentFolder: null
    },
    infoDrawerOpened: false,
    infoDrawerMetadataAspect: '',
    showFacetFilter: true,
    documentDisplayMode: 'list',
    repository: {
      status: {
        isQuickShareEnabled: true
      }
    } as any
  }
};

@NgModule({
  imports: [
    NoopAnimationsModule,
    CommonModule,
    HttpClientModule,
    RouterTestingModule,
    StoreModule,
    EffectsModule.forRoot([]),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useClass: TranslateLoaderService
      }
    }),
    PipeModule
  ],
  providers: [
    { provide: AlfrescoApiService, useClass: AlfrescoApiServiceMock },
    { provide: TranslationService, useClass: TranslationMock }
  ]
})
export class LibTestingModule {}
