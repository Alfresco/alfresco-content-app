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
export var AppActionTypes;
(function(AppActionTypes) {
  AppActionTypes['SetInitialState'] = 'SET_INITIAL_STATE';
  AppActionTypes['SetLanguagePicker'] = 'SET_LANGUAGE_PICKER';
  AppActionTypes['SetCurrentFolder'] = 'SET_CURRENT_FOLDER';
  AppActionTypes['SetCurrentUrl'] = 'SET_CURRENT_URL';
  AppActionTypes['SetUserProfile'] = 'SET_USER_PROFILE';
  AppActionTypes['SetRepositoryInfo'] = 'SET_REPOSITORY_INFO';
  AppActionTypes['ToggleInfoDrawer'] = 'TOGGLE_INFO_DRAWER';
  AppActionTypes['ToggleDocumentDisplayMode'] = 'TOGGLE_DOCUMENT_DISPLAY_MODE';
  AppActionTypes['Logout'] = 'LOGOUT';
  AppActionTypes['ReloadDocumentList'] = 'RELOAD_DOCUMENT_LIST';
  AppActionTypes['ResetSelection'] = 'RESET_SELECTION';
  AppActionTypes['SetInfoDrawerState'] = 'SET_INFO_DRAWER_STATE';
  AppActionTypes['SetInfoDrawerMetadataAspect'] =
    'SET_INFO_DRAWER_METADATA_ASPECT';
  AppActionTypes['CloseModalDialogs'] = 'CLOSE_MODAL_DIALOGS';
  AppActionTypes['ToggleProcessServices'] = 'TOGGLE_PROCESS_SERVICES';
})(AppActionTypes || (AppActionTypes = {}));
var SetInitialStateAction = /** @class */ (function() {
  function SetInitialStateAction(payload) {
    this.payload = payload;
    this.type = AppActionTypes.SetInitialState;
  }
  return SetInitialStateAction;
})();
export { SetInitialStateAction };
var SetLanguagePickerAction = /** @class */ (function() {
  function SetLanguagePickerAction(payload) {
    this.payload = payload;
    this.type = AppActionTypes.SetLanguagePicker;
  }
  return SetLanguagePickerAction;
})();
export { SetLanguagePickerAction };
var SetCurrentFolderAction = /** @class */ (function() {
  function SetCurrentFolderAction(payload) {
    this.payload = payload;
    this.type = AppActionTypes.SetCurrentFolder;
  }
  return SetCurrentFolderAction;
})();
export { SetCurrentFolderAction };
var SetCurrentUrlAction = /** @class */ (function() {
  function SetCurrentUrlAction(payload) {
    this.payload = payload;
    this.type = AppActionTypes.SetCurrentUrl;
  }
  return SetCurrentUrlAction;
})();
export { SetCurrentUrlAction };
var SetUserProfileAction = /** @class */ (function() {
  function SetUserProfileAction(payload) {
    this.payload = payload;
    this.type = AppActionTypes.SetUserProfile;
  }
  return SetUserProfileAction;
})();
export { SetUserProfileAction };
var ToggleInfoDrawerAction = /** @class */ (function() {
  function ToggleInfoDrawerAction() {
    this.type = AppActionTypes.ToggleInfoDrawer;
  }
  return ToggleInfoDrawerAction;
})();
export { ToggleInfoDrawerAction };
var ToggleDocumentDisplayMode = /** @class */ (function() {
  function ToggleDocumentDisplayMode() {
    this.type = AppActionTypes.ToggleDocumentDisplayMode;
  }
  return ToggleDocumentDisplayMode;
})();
export { ToggleDocumentDisplayMode };
var LogoutAction = /** @class */ (function() {
  function LogoutAction() {
    this.type = AppActionTypes.Logout;
  }
  return LogoutAction;
})();
export { LogoutAction };
var ReloadDocumentListAction = /** @class */ (function() {
  function ReloadDocumentListAction(payload) {
    this.payload = payload;
    this.type = AppActionTypes.ReloadDocumentList;
  }
  return ReloadDocumentListAction;
})();
export { ReloadDocumentListAction };
var ResetSelectionAction = /** @class */ (function() {
  function ResetSelectionAction(payload) {
    this.payload = payload;
    this.type = AppActionTypes.ResetSelection;
  }
  return ResetSelectionAction;
})();
export { ResetSelectionAction };
var SetInfoDrawerStateAction = /** @class */ (function() {
  function SetInfoDrawerStateAction(payload) {
    this.payload = payload;
    this.type = AppActionTypes.SetInfoDrawerState;
  }
  return SetInfoDrawerStateAction;
})();
export { SetInfoDrawerStateAction };
var CloseModalDialogsAction = /** @class */ (function() {
  function CloseModalDialogsAction() {
    this.type = AppActionTypes.CloseModalDialogs;
  }
  return CloseModalDialogsAction;
})();
export { CloseModalDialogsAction };
var SetRepositoryInfoAction = /** @class */ (function() {
  function SetRepositoryInfoAction(payload) {
    this.payload = payload;
    this.type = AppActionTypes.SetRepositoryInfo;
  }
  return SetRepositoryInfoAction;
})();
export { SetRepositoryInfoAction };
var ToggleProcessServicesAction = /** @class */ (function() {
  function ToggleProcessServicesAction(payload) {
    this.payload = payload;
    this.type = AppActionTypes.ToggleProcessServices;
  }
  return ToggleProcessServicesAction;
})();
export { ToggleProcessServicesAction };
//# sourceMappingURL=app.actions.js.map
