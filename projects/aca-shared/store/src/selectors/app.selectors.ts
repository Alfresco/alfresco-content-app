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

import { AppStore } from '../states/app.state';
import { createSelector } from '@ngrx/store';

const HXI_CONNECTOR = 'alfresco-hxinsight-connector-prediction-applier-extension';
export const selectApp = (state: AppStore) => state.app;

/** @deprecated use `UserProfileService` instead */
export const getUserProfile = createSelector(selectApp, (state) => state.user);
export const getCurrentFolder = createSelector(selectApp, (state) => state.navigation.currentFolder);
export const getCurrentVersion = createSelector(selectApp, (state) => state.currentNodeVersion);
export const getAppSelection = createSelector(selectApp, (state) => state.selection);
export const getNavigationState = createSelector(selectApp, (state) => state.navigation);
export const isInfoDrawerOpened = createSelector(selectApp, (state) => state.infoDrawerOpened);
export const infoDrawerPreview = createSelector(selectApp, (state) => state.infoDrawerPreview);
export const getRepositoryStatus = createSelector(selectApp, (state) => state.repository);
export const isQuickShareEnabled = createSelector(getRepositoryStatus, (info) => info.status.isQuickShareEnabled);
export const isHXIConnectorEnabled = createSelector(getRepositoryStatus, (info) => !!info?.modules?.find((module) => module.id === HXI_CONNECTOR));
export const isAdmin = createSelector(selectApp, (state) => state.user.isAdmin);
export const getFileUploadingDialog = createSelector(selectApp, (state) => state.fileUploadingDialog);
export const showLoaderSelector = createSelector(selectApp, (state) => state.showLoader);
export const getSearchItemsTotalCount = createSelector(selectApp, (state) => state.searchItemsTotalCount);

export const getSideNavState = createSelector(getAppSelection, getNavigationState, (selection, navigation) => ({
  selection,
  navigation
}));

export const getRuleContext = createSelector(
  getAppSelection,
  getNavigationState,
  getUserProfile,
  getRepositoryStatus,
  (selection, navigation, profile, repository) => ({
    selection,
    navigation,
    profile,
    repository
  })
);

export const infoDrawerMetadataAspect = createSelector(selectApp, (state) => state.infoDrawerMetadataAspect);
