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

import {
  SelectionState,
  ProfileState,
  NavigationState
} from '@alfresco/adf-extensions';
import { RepositoryState } from '../states';

export interface AppState {
  appName: string;
  headerColor: string;
  logoPath: string;
  languagePicker: boolean;
  sharedUrl: string;
  selection: SelectionState;
  user: ProfileState;
  navigation: NavigationState;
  infoDrawerOpened: boolean;
  documentDisplayMode: string;
  repository: RepositoryState;
}

export const INITIAL_APP_STATE: AppState = {
  appName: 'Alfresco Example Content Application',
  headerColor: '#2196F3',
  logoPath: 'assets/images/alfresco-logo-white.svg',
  languagePicker: false,
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
  documentDisplayMode: 'list',
  repository: {
    isQuickShareEnabled: null
  }
};

export interface AppStore {
  app: AppState;
}

export const INITIAL_STATE: AppStore = {
  app: INITIAL_APP_STATE
};
