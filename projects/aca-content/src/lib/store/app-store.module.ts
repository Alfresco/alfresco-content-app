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
import { provideStore } from '@ngrx/store';
import { appReducer } from './reducers/app.reducer';
import { FullRouterStateSerializer, provideRouterStore } from '@ngrx/router-store';
import { provideEffects } from '@ngrx/effects';
import { RouterEffects } from '@alfresco/aca-shared/store';
import {
  AppEffects,
  ContextMenuEffects,
  DownloadEffects,
  FavoriteEffects,
  LibraryEffects,
  NodeEffects,
  SearchEffects,
  TemplateEffects,
  UploadEffects,
  ViewerEffects
} from './effects';
import { INITIAL_STATE } from './initial-state';
import { SearchAiEffects } from './effects/search-ai.effects';

@NgModule({
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
    provideRouterStore({ stateKey: 'router', serializer: FullRouterStateSerializer }),
    provideEffects([
      AppEffects,
      NodeEffects,
      DownloadEffects,
      ViewerEffects,
      SearchEffects,
      LibraryEffects,
      UploadEffects,
      FavoriteEffects,
      TemplateEffects,
      ContextMenuEffects,
      SearchAiEffects,
      RouterEffects
    ])
  ]
})
export class AppStoreModule {}
