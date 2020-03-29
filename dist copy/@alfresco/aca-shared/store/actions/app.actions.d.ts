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
import { Action } from '@ngrx/store';
import { Node, Person, Group, RepositoryInfo } from '@alfresco/js-api';
import { AppState } from '../states/app.state';
export declare enum AppActionTypes {
  SetInitialState = 'SET_INITIAL_STATE',
  SetLanguagePicker = 'SET_LANGUAGE_PICKER',
  SetCurrentFolder = 'SET_CURRENT_FOLDER',
  SetCurrentUrl = 'SET_CURRENT_URL',
  SetUserProfile = 'SET_USER_PROFILE',
  SetRepositoryInfo = 'SET_REPOSITORY_INFO',
  ToggleInfoDrawer = 'TOGGLE_INFO_DRAWER',
  ToggleDocumentDisplayMode = 'TOGGLE_DOCUMENT_DISPLAY_MODE',
  Logout = 'LOGOUT',
  ReloadDocumentList = 'RELOAD_DOCUMENT_LIST',
  ResetSelection = 'RESET_SELECTION',
  SetInfoDrawerState = 'SET_INFO_DRAWER_STATE',
  SetInfoDrawerMetadataAspect = 'SET_INFO_DRAWER_METADATA_ASPECT',
  CloseModalDialogs = 'CLOSE_MODAL_DIALOGS',
  ToggleProcessServices = 'TOGGLE_PROCESS_SERVICES'
}
export declare class SetInitialStateAction implements Action {
  payload: AppState;
  readonly type = AppActionTypes.SetInitialState;
  constructor(payload: AppState);
}
export declare class SetLanguagePickerAction implements Action {
  payload: boolean;
  readonly type = AppActionTypes.SetLanguagePicker;
  constructor(payload: boolean);
}
export declare class SetCurrentFolderAction implements Action {
  payload: Node;
  readonly type = AppActionTypes.SetCurrentFolder;
  constructor(payload: Node);
}
export declare class SetCurrentUrlAction implements Action {
  payload: string;
  readonly type = AppActionTypes.SetCurrentUrl;
  constructor(payload: string);
}
export declare class SetUserProfileAction implements Action {
  payload: {
    person: Person;
    groups: Group[];
  };
  readonly type = AppActionTypes.SetUserProfile;
  constructor(payload: { person: Person; groups: Group[] });
}
export declare class ToggleInfoDrawerAction implements Action {
  readonly type = AppActionTypes.ToggleInfoDrawer;
}
export declare class ToggleDocumentDisplayMode implements Action {
  readonly type = AppActionTypes.ToggleDocumentDisplayMode;
}
export declare class LogoutAction implements Action {
  readonly type = AppActionTypes.Logout;
}
export declare class ReloadDocumentListAction implements Action {
  payload?: any;
  readonly type = AppActionTypes.ReloadDocumentList;
  constructor(payload?: any);
}
export declare class ResetSelectionAction implements Action {
  payload?: any;
  readonly type = AppActionTypes.ResetSelection;
  constructor(payload?: any);
}
export declare class SetInfoDrawerStateAction implements Action {
  payload: boolean;
  readonly type = AppActionTypes.SetInfoDrawerState;
  constructor(payload: boolean);
}
export declare class CloseModalDialogsAction implements Action {
  readonly type = AppActionTypes.CloseModalDialogs;
}
export declare class SetRepositoryInfoAction implements Action {
  payload: RepositoryInfo;
  readonly type = AppActionTypes.SetRepositoryInfo;
  constructor(payload: RepositoryInfo);
}
export declare class ToggleProcessServicesAction implements Action {
  payload: boolean;
  readonly type = AppActionTypes.ToggleProcessServices;
  constructor(payload: boolean);
}
