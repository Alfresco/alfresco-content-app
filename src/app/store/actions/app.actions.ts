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

import { Action } from '@ngrx/store';
import { Node, Person } from '@alfresco/js-api';
import { AppState } from '../states';

export const SET_INITIAL_STATE = 'SET_INITIAL_STATE';
export const SET_LANGUAGE_PICKER = 'SET_LANGUAGE_PICKER';
export const SET_CURRENT_FOLDER = 'SET_CURRENT_FOLDER';
export const SET_CURRENT_URL = 'SET_CURRENT_URL';
export const SET_USER_PROFILE = 'SET_USER_PROFILE';
export const TOGGLE_INFO_DRAWER = 'TOGGLE_INFO_DRAWER';
export const TOGGLE_DOCUMENT_DISPLAY_MODE = 'TOGGLE_DOCUMENT_DISPLAY_MODE';
export const LOGOUT = 'LOGOUT';
export const RELOAD_DOCUMENT_LIST = 'RELOAD_DOCUMENT_LIST';

export class SetInitialStateAction implements Action {
  readonly type = SET_INITIAL_STATE;
  constructor(public payload: AppState) {}
}

export class SetLanguagePickerAction implements Action {
  readonly type = SET_LANGUAGE_PICKER;
  constructor(public payload: boolean) {}
}

export class SetCurrentFolderAction implements Action {
  readonly type = SET_CURRENT_FOLDER;
  constructor(public payload: Node) {}
}

export class SetCurrentUrlAction implements Action {
  readonly type = SET_CURRENT_URL;
  constructor(public payload: string) {}
}

export class SetUserProfileAction implements Action {
  readonly type = SET_USER_PROFILE;
  constructor(public payload: Person) {}
}

export class ToggleInfoDrawerAction implements Action {
  readonly type = TOGGLE_INFO_DRAWER;
  constructor(public payload?: any) {}
}

export class ToggleDocumentDisplayMode implements Action {
  readonly type = TOGGLE_DOCUMENT_DISPLAY_MODE;
  constructor(public payload?: any) {}
}

export class LogoutAction implements Action {
  readonly type = LOGOUT;
  constructor(public payload?: any) {}
}

export class ReloadDocumentListAction implements Action {
  readonly type = RELOAD_DOCUMENT_LIST;
  constructor(public payload?: any) {}
}
