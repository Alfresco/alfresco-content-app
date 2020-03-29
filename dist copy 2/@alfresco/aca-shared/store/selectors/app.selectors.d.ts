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
import { AppStore } from '../states/app.state';
export declare const selectApp: (
  state: AppStore
) => import('../states/app.state').AppState;
export declare const getHeaderColor: import('@ngrx/store').MemoizedSelector<
  AppStore,
  string
>;
export declare const getAppName: import('@ngrx/store').MemoizedSelector<
  AppStore,
  string
>;
export declare const getLogoPath: import('@ngrx/store').MemoizedSelector<
  AppStore,
  string
>;
export declare const getLanguagePickerState: import('@ngrx/store').MemoizedSelector<
  AppStore,
  boolean
>;
export declare const getUserProfile: import('@ngrx/store').MemoizedSelector<
  AppStore,
  import('@alfresco/adf-extensions').ProfileState
>;
export declare const getCurrentFolder: import('@ngrx/store').MemoizedSelector<
  AppStore,
  import('@alfresco/js-api').Node
>;
export declare const getAppSelection: import('@ngrx/store').MemoizedSelector<
  AppStore,
  import('@alfresco/adf-extensions').SelectionState
>;
export declare const getSharedUrl: import('@ngrx/store').MemoizedSelector<
  AppStore,
  string
>;
export declare const getNavigationState: import('@ngrx/store').MemoizedSelector<
  AppStore,
  import('@alfresco/adf-extensions').NavigationState
>;
export declare const isInfoDrawerOpened: import('@ngrx/store').MemoizedSelector<
  AppStore,
  boolean
>;
export declare const showFacetFilter: import('@ngrx/store').MemoizedSelector<
  AppStore,
  boolean
>;
export declare const getDocumentDisplayMode: import('@ngrx/store').MemoizedSelector<
  AppStore,
  string
>;
export declare const getRepositoryStatus: import('@ngrx/store').MemoizedSelector<
  AppStore,
  import('@alfresco/js-api').RepositoryInfo
>;
export declare const isQuickShareEnabled: import('@ngrx/store').MemoizedSelector<
  AppStore,
  boolean
>;
export declare const isAdmin: import('@ngrx/store').MemoizedSelector<
  AppStore,
  boolean
>;
export declare const getSideNavState: import('@ngrx/store').MemoizedSelector<
  AppStore,
  {
    selection: import('@alfresco/adf-extensions').SelectionState;
    navigation: import('@alfresco/adf-extensions').NavigationState;
  }
>;
export declare const getRuleContext: import('@ngrx/store').MemoizedSelector<
  AppStore,
  {
    selection: import('@alfresco/adf-extensions').SelectionState;
    navigation: import('@alfresco/adf-extensions').NavigationState;
    profile: import('@alfresco/adf-extensions').ProfileState;
    repository: import('@alfresco/js-api').RepositoryInfo;
  }
>;
export declare const infoDrawerMetadataAspect: import('@ngrx/store').MemoizedSelector<
  AppStore,
  string
>;
export declare const getProcessServicesState: import('@ngrx/store').MemoizedSelector<
  AppStore,
  boolean
>;
