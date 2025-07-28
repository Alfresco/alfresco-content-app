/*!
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { NgModule } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AuthenticationService, NoopTranslateModule, PageTitleService } from '@alfresco/adf-core';
import { AlfrescoApiService, AlfrescoApiServiceMock, DiscoveryApiService, SearchQueryBuilderService } from '@alfresco/adf-content-services';
import { RepositoryInfo, VersionInfo } from '@alfresco/js-api';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { appReducer } from '../store/reducers/app.reducer';
import { RouterTestingModule } from '@angular/router/testing';
import { provideEffects } from '@ngrx/effects';
import { INITIAL_STATE } from '../store/initial-state';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { ContentManagementService } from '../services/content-management.service';
import { DocumentBasePageService } from '@alfresco/aca-shared';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconTestingModule } from '@angular/material/icon/testing';

@NgModule({
  exports: [RouterTestingModule],
  imports: [NoopAnimationsModule, NoopTranslateModule, RouterTestingModule, MatSnackBarModule, MatDialogModule, MatIconTestingModule],
  providers: [
    provideStore(
      { app: appReducer },
      {
        initialState: INITIAL_STATE,
        runtimeChecks: {
          strictStateImmutability: false,
          strictActionImmutability: false
        }
      }
    ),
    provideEffects([]),
    SearchQueryBuilderService,
    { provide: AlfrescoApiService, useClass: AlfrescoApiServiceMock },
    { provide: DocumentBasePageService, useExisting: ContentManagementService },
    {
      provide: DiscoveryApiService,
      useValue: {
        ecmProductInfo$: new BehaviorSubject<RepositoryInfo | null>(null),
        getEcmProductInfo: (): Observable<RepositoryInfo> =>
          of(
            new RepositoryInfo({
              version: {
                major: '10.0.0'
              } as VersionInfo
            })
          )
      }
    },
    {
      provide: AuthenticationService,
      useValue: {
        isEcmLoggedIn: (): boolean => true,
        getRedirect: (): string | null => null,
        setRedirect() {},
        isOauth: (): boolean => false,
        isOAuthWithoutSilentLogin: (): boolean => false,
        onLogin: new Subject<any>(),
        onLogout: new Subject<any>(),
        isLoggedIn: () => true
      }
    },
    {
      provide: PageTitleService,
      useValue: {}
    },
    provideHttpClient(withInterceptorsFromDi())
  ]
})
export class AppTestingModule {}
