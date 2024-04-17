/*!
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * Alfresco Example Content Application
 *
 * This file is part of the Alfresco Example Content Application.
 * If the software was purchased under a paid Alfresco license, the terms of
 * the paid license agreement will prevail. Otherwise, the software is
 * provided under the following open source license terms:
 *
 * The Alfresco Example Content Application is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * The Alfresco Example Content Application is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * from Hyland Software. If not, see <http://www.gnu.org/licenses/>.
 */

import { Injectable, NgModule } from '@angular/core';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AlfrescoApiService, AlfrescoApiServiceMock, TranslateLoaderService, TranslationMock, TranslationService } from '@alfresco/adf-core';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { OverlayModule } from '@angular/cdk/overlay';
import { RepositoryInfo, VersionInfo } from '@alfresco/js-api';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { DocumentBasePageService } from '../../public-api';

export const initialState = {
  app: {
    appName: 'Alfresco Content Application',
    logoPath: 'assets/images/alfresco-logo-white.svg',
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
    repository: {
      status: {
        isQuickShareEnabled: true
      }
    } as any
  }
};

export const discoveryApiServiceMockValue = {
  ecmProductInfo$: new BehaviorSubject<RepositoryInfo | null>(null),
  getEcmProductInfo: (): Observable<RepositoryInfo> =>
    of(
      new RepositoryInfo({
        version: {
          major: '10.0.0'
        } as VersionInfo
      })
    )
};

@Injectable()
export class DocumentBasePageServiceMock extends DocumentBasePageService {
  canUpdateNode(): boolean {
    return true;
  }

  canUploadContent(): boolean {
    return true;
  }
}

@NgModule({
  imports: [
    NoopAnimationsModule,
    CommonModule,
    HttpClientModule,
    RouterTestingModule,
    MatIconTestingModule,
    StoreModule,
    OverlayModule,
    StoreModule.forRoot(
      { app: null },
      {
        initialState,
        runtimeChecks: {
          strictStateImmutability: false,
          strictActionImmutability: false
        }
      }
    ),
    EffectsModule.forRoot([]),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useClass: TranslateLoaderService
      }
    })
  ],
  exports: [TranslateModule],
  providers: [
    { provide: AlfrescoApiService, useClass: AlfrescoApiServiceMock },
    { provide: TranslationService, useClass: TranslationMock }
  ]
})
export class LibTestingModule {}
