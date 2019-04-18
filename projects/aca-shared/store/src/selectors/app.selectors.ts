/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2019 Alfresco Software Limited
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

import { AppStore } from '../states/app.state';
import { createSelector } from '@ngrx/store';

export const selectApp = (state: AppStore) => state.app;

export const getHeaderColor = createSelector(
  selectApp,
  state => state.headerColor
);

export const getAppName = createSelector(
  selectApp,
  state => state.appName
);

export const getLogoPath = createSelector(
  selectApp,
  state => state.logoPath
);

export const getLanguagePickerState = createSelector(
  selectApp,
  state => state.languagePicker
);

export const getUserProfile = createSelector(
  selectApp,
  state => state.user
);

export const getCurrentFolder = createSelector(
  selectApp,
  state => state.navigation.currentFolder
);

export const getAppSelection = createSelector(
  selectApp,
  state => state.selection
);

export const getSharedUrl = createSelector(
  selectApp,
  state => state.sharedUrl
);

export const getNavigationState = createSelector(
  selectApp,
  state => state.navigation
);

export const isInfoDrawerOpened = createSelector(
  selectApp,
  state => state.infoDrawerOpened
);

export const showFacetFilter = createSelector(
  selectApp,
  state => state.showFacetFilter
);

export const getDocumentDisplayMode = createSelector(
  selectApp,
  state => state.documentDisplayMode
);

export const getRepositoryStatus = createSelector(
  selectApp,
  state => state.repository
);

export const isQuickShareEnabled = createSelector(
  getRepositoryStatus,
  info => info.status.isQuickShareEnabled
);

export const isAdmin = createSelector(
  selectApp,
  state => state.user.isAdmin
);

export const getSideNavState = createSelector(
  getAppSelection,
  getNavigationState,
  (selection, navigation) => {
    return {
      selection,
      navigation
    };
  }
);

export const getRuleContext = createSelector(
  getAppSelection,
  getNavigationState,
  getUserProfile,
  getRepositoryStatus,
  (selection, navigation, profile, repository) => {
    return {
      selection,
      navigation,
      profile,
      repository
    };
  }
);
