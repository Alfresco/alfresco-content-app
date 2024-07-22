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

import { SelectionState, ProfileState, NavigationState } from '@alfresco/adf-extensions';
import { RepositoryInfo, VersionEntry } from '@alfresco/js-api';
import { InjectionToken } from '@angular/core';

/** @deprecated no longer used */
export const STORE_INITIAL_APP_DATA = new InjectionToken<AppState>('STORE_INITIAL_APP_DATA');

export const INITIAL_APP_STATE: AppState = {
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
  currentNodeVersion: null,
  infoDrawerOpened: false,
  infoDrawerPreview: false,
  infoDrawerMetadataAspect: '',
  fileUploadingDialog: true,
  showLoader: false,
  repository: {
    status: {
      isQuickShareEnabled: true
    }
  } as any,
  searchItemsTotalCount: null
};

/** @deprecated no longer used */
export const INITIAL_STATE: AppStore = {
  app: INITIAL_APP_STATE
};

export interface AppState {
  currentNodeVersion: VersionEntry;
  selection: SelectionState;
  user: ProfileState;
  navigation: NavigationState;
  infoDrawerOpened: boolean;
  infoDrawerPreview: boolean;
  infoDrawerMetadataAspect: string;
  repository: RepositoryInfo;
  fileUploadingDialog: boolean;
  showLoader: boolean;
  searchItemsTotalCount: number;
}

export interface AppStore {
  app: AppState;
}
