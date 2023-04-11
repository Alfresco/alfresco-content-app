/*!
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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
 * along with Alfresco. If not, see <http://www.gnu.org/licenses/>.
 */

import { NgModule } from '@angular/core';
import { TranslatePipe, TranslateModule } from '@ngx-translate/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  TranslationService,
  TranslationMock,
  AuthenticationService,
  AlfrescoApiService,
  PipeModule,
  AlfrescoApiServiceMock
} from '@alfresco/adf-core';
import { DiscoveryApiService } from '@alfresco/adf-content-services';
import { RepositoryInfo } from '@alfresco/js-api';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { appReducer } from '../store/reducers/app.reducer';
import { RouterTestingModule } from '@angular/router/testing';
import { EffectsModule } from '@ngrx/effects';
import { MaterialModule } from '../material.module';
import { INITIAL_STATE } from '../store/initial-state';
import { TranslatePipeMock } from './translate-pipe.directive';
import { BehaviorSubject, Observable, of } from 'rxjs';

@NgModule({
  imports: [
    NoopAnimationsModule,
    HttpClientModule,
    RouterTestingModule,
    MaterialModule,
    TranslateModule.forRoot(),
    StoreModule.forRoot(
      { app: appReducer },
      {
        initialState: INITIAL_STATE,
        runtimeChecks: {
          strictStateImmutability: false,
          strictActionImmutability: false
        }
      }
    ),
    EffectsModule.forRoot([]),
    PipeModule
  ],
  declarations: [TranslatePipeMock],
  exports: [TranslatePipeMock, RouterTestingModule, MaterialModule, PipeModule],
  providers: [
    { provide: AlfrescoApiService, useClass: AlfrescoApiServiceMock },
    { provide: TranslationService, useClass: TranslationMock },
    { provide: TranslatePipe, useClass: TranslatePipeMock },
    {
      provide: DiscoveryApiService,
      useValue: {
        ecmProductInfo$: new BehaviorSubject<RepositoryInfo | null>(null),
        getEcmProductInfo: (): Observable<RepositoryInfo> => of(new RepositoryInfo({ version: '10.0.0' }))
      }
    },
    {
      provide: AuthenticationService,
      useValue: {
        isEcmLoggedIn: (): boolean => true,
        getRedirect: (): string | null => null,
        setRedirect() {},
        isOauth: (): boolean => false,
        isOAuthWithoutSilentLogin: (): boolean => false
      }
    }
  ]
})
export class AppTestingModule {}
