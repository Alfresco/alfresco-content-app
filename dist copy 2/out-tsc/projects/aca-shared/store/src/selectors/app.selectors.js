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
import { createSelector } from '@ngrx/store';
export var selectApp = function(state) {
  return state.app;
};
export var getHeaderColor = createSelector(
  selectApp,
  function(state) {
    return state.headerColor;
  }
);
export var getAppName = createSelector(
  selectApp,
  function(state) {
    return state.appName;
  }
);
export var getLogoPath = createSelector(
  selectApp,
  function(state) {
    return state.logoPath;
  }
);
export var getLanguagePickerState = createSelector(
  selectApp,
  function(state) {
    return state.languagePicker;
  }
);
export var getUserProfile = createSelector(
  selectApp,
  function(state) {
    return state.user;
  }
);
export var getCurrentFolder = createSelector(
  selectApp,
  function(state) {
    return state.navigation.currentFolder;
  }
);
export var getAppSelection = createSelector(
  selectApp,
  function(state) {
    return state.selection;
  }
);
export var getSharedUrl = createSelector(
  selectApp,
  function(state) {
    return state.sharedUrl;
  }
);
export var getNavigationState = createSelector(
  selectApp,
  function(state) {
    return state.navigation;
  }
);
export var isInfoDrawerOpened = createSelector(
  selectApp,
  function(state) {
    return state.infoDrawerOpened;
  }
);
export var showFacetFilter = createSelector(
  selectApp,
  function(state) {
    return state.showFacetFilter;
  }
);
export var getDocumentDisplayMode = createSelector(
  selectApp,
  function(state) {
    return state.documentDisplayMode;
  }
);
export var getRepositoryStatus = createSelector(
  selectApp,
  function(state) {
    return state.repository;
  }
);
export var isQuickShareEnabled = createSelector(
  getRepositoryStatus,
  function(info) {
    return info.status.isQuickShareEnabled;
  }
);
export var isAdmin = createSelector(
  selectApp,
  function(state) {
    return state.user.isAdmin;
  }
);
export var getSideNavState = createSelector(
  getAppSelection,
  getNavigationState,
  function(selection, navigation) {
    return {
      selection: selection,
      navigation: navigation
    };
  }
);
export var getRuleContext = createSelector(
  getAppSelection,
  getNavigationState,
  getUserProfile,
  getRepositoryStatus,
  function(selection, navigation, profile, repository) {
    return {
      selection: selection,
      navigation: navigation,
      profile: profile,
      repository: repository
    };
  }
);
export var infoDrawerMetadataAspect = createSelector(
  selectApp,
  function(state) {
    return state.infoDrawerMetadataAspect;
  }
);
export var getProcessServicesState = createSelector(
  selectApp,
  function(state) {
    return state.processServices;
  }
);
//# sourceMappingURL=app.selectors.js.map
