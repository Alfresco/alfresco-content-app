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

export enum AppActionTypes {
  SetSettingsParameter = 'SET_SETTINGS_PARAMETER',
  SetInitialState = 'SET_INITIAL_STATE',
  SetCurrentFolder = 'SET_CURRENT_FOLDER',
  SetCurrentVersion = 'SET_CURRENT_VERSION',
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
  SetFileUploadingDialog = 'SET_FILE_UPLOADING_DIALOG',
  ShowInfoDrawerPreview = 'SHOW_INFO_DRAWER_PREVIEW',
  SetInfoDrawerPreviewState = 'SET_INFO_DRAWER_PREVIEW_STATE',
  ShowLoaderAction = 'SHOW_LOADER'
}
