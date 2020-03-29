import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { __decorate, __metadata } from 'tslib';
import { TranslationService } from '@alfresco/adf-core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { map } from 'rxjs/operators';
import { Store, createSelector } from '@ngrx/store';
import { Injectable, NgModule } from '@angular/core';
import { Effect, Actions, ofType, EffectsModule } from '@ngrx/effects';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
/** @enum {string} */
const AppActionTypes = {
  SetInitialState: 'SET_INITIAL_STATE',
  SetLanguagePicker: 'SET_LANGUAGE_PICKER',
  SetCurrentFolder: 'SET_CURRENT_FOLDER',
  SetCurrentUrl: 'SET_CURRENT_URL',
  SetUserProfile: 'SET_USER_PROFILE',
  SetRepositoryInfo: 'SET_REPOSITORY_INFO',
  ToggleInfoDrawer: 'TOGGLE_INFO_DRAWER',
  ToggleDocumentDisplayMode: 'TOGGLE_DOCUMENT_DISPLAY_MODE',
  Logout: 'LOGOUT',
  ReloadDocumentList: 'RELOAD_DOCUMENT_LIST',
  ResetSelection: 'RESET_SELECTION',
  SetInfoDrawerState: 'SET_INFO_DRAWER_STATE',
  SetInfoDrawerMetadataAspect: 'SET_INFO_DRAWER_METADATA_ASPECT',
  CloseModalDialogs: 'CLOSE_MODAL_DIALOGS',
  ToggleProcessServices: 'TOGGLE_PROCESS_SERVICES'
};
class SetInitialStateAction {
  /**
   * @param {?} payload
   */
  constructor(payload) {
    this.payload = payload;
    this.type = AppActionTypes.SetInitialState;
  }
}
class SetLanguagePickerAction {
  /**
   * @param {?} payload
   */
  constructor(payload) {
    this.payload = payload;
    this.type = AppActionTypes.SetLanguagePicker;
  }
}
class SetCurrentFolderAction {
  /**
   * @param {?} payload
   */
  constructor(payload) {
    this.payload = payload;
    this.type = AppActionTypes.SetCurrentFolder;
  }
}
class SetCurrentUrlAction {
  /**
   * @param {?} payload
   */
  constructor(payload) {
    this.payload = payload;
    this.type = AppActionTypes.SetCurrentUrl;
  }
}
class SetUserProfileAction {
  /**
   * @param {?} payload
   */
  constructor(payload) {
    this.payload = payload;
    this.type = AppActionTypes.SetUserProfile;
  }
}
class ToggleInfoDrawerAction {
  constructor() {
    this.type = AppActionTypes.ToggleInfoDrawer;
  }
}
class ToggleDocumentDisplayMode {
  constructor() {
    this.type = AppActionTypes.ToggleDocumentDisplayMode;
  }
}
class LogoutAction {
  constructor() {
    this.type = AppActionTypes.Logout;
  }
}
class ReloadDocumentListAction {
  /**
   * @param {?=} payload
   */
  constructor(payload) {
    this.payload = payload;
    this.type = AppActionTypes.ReloadDocumentList;
  }
}
class ResetSelectionAction {
  /**
   * @param {?=} payload
   */
  constructor(payload) {
    this.payload = payload;
    this.type = AppActionTypes.ResetSelection;
  }
}
class SetInfoDrawerStateAction {
  /**
   * @param {?} payload
   */
  constructor(payload) {
    this.payload = payload;
    this.type = AppActionTypes.SetInfoDrawerState;
  }
}
class CloseModalDialogsAction {
  constructor() {
    this.type = AppActionTypes.CloseModalDialogs;
  }
}
class SetRepositoryInfoAction {
  /**
   * @param {?} payload
   */
  constructor(payload) {
    this.payload = payload;
    this.type = AppActionTypes.SetRepositoryInfo;
  }
}
class ToggleProcessServicesAction {
  /**
   * @param {?} payload
   */
  constructor(payload) {
    this.payload = payload;
    this.type = AppActionTypes.ToggleProcessServices;
  }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
/** @enum {string} */
const LibraryActionTypes = {
  Delete: 'DELETE_LIBRARY',
  Create: 'CREATE_LIBRARY',
  Navigate: 'NAVIGATE_LIBRARY',
  Update: 'UPDATE_LIBRARY',
  Leave: 'LEAVE_LIBRARY'
};
class DeleteLibraryAction {
  /**
   * @param {?=} payload
   */
  constructor(payload) {
    this.payload = payload;
    this.type = LibraryActionTypes.Delete;
  }
}
class CreateLibraryAction {
  constructor() {
    this.type = LibraryActionTypes.Create;
  }
}
class NavigateLibraryAction {
  /**
   * @param {?=} payload
   */
  constructor(payload) {
    this.payload = payload;
    this.type = LibraryActionTypes.Navigate;
  }
}
class UpdateLibraryAction {
  /**
   * @param {?=} payload
   */
  constructor(payload) {
    this.payload = payload;
    this.type = LibraryActionTypes.Update;
  }
}
class LeaveLibraryAction {
  /**
   * @param {?=} payload
   */
  constructor(payload) {
    this.payload = payload;
    this.type = LibraryActionTypes.Leave;
  }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
/** @enum {string} */
const NodeActionTypes = {
  SetSelection: 'SET_SELECTED_NODES',
  Delete: 'DELETE_NODES',
  UndoDelete: 'UNDO_DELETE_NODES',
  RestoreDeleted: 'RESTORE_DELETED_NODES',
  PurgeDeleted: 'PURGE_DELETED_NODES',
  Download: 'DOWNLOAD_NODES',
  CreateFolder: 'CREATE_FOLDER',
  EditFolder: 'EDIT_FOLDER',
  Share: 'SHARE_NODE',
  Unshare: 'UNSHARE_NODES',
  Copy: 'COPY_NODES',
  Move: 'MOVE_NODES',
  ManagePermissions: 'MANAGE_PERMISSIONS',
  PrintFile: 'PRINT_FILE',
  ManageVersions: 'MANAGE_VERSIONS',
  EditOffline: 'EDIT_OFFLINE',
  UnlockForWriting: 'UNLOCK_WRITE_LOCK',
  AddFavorite: 'ADD_FAVORITE',
  RemoveFavorite: 'REMOVE_FAVORITE'
};
class SetSelectedNodesAction {
  /**
   * @param {?=} payload
   */
  constructor(payload = []) {
    this.payload = payload;
    this.type = NodeActionTypes.SetSelection;
  }
}
class DeleteNodesAction {
  /**
   * @param {?=} payload
   */
  constructor(payload = []) {
    this.payload = payload;
    this.type = NodeActionTypes.Delete;
  }
}
class UndoDeleteNodesAction {
  /**
   * @param {?=} payload
   */
  constructor(payload = []) {
    this.payload = payload;
    this.type = NodeActionTypes.UndoDelete;
  }
}
class RestoreDeletedNodesAction {
  /**
   * @param {?} payload
   */
  constructor(payload) {
    this.payload = payload;
    this.type = NodeActionTypes.RestoreDeleted;
  }
}
class PurgeDeletedNodesAction {
  /**
   * @param {?} payload
   */
  constructor(payload) {
    this.payload = payload;
    this.type = NodeActionTypes.PurgeDeleted;
  }
}
class DownloadNodesAction {
  /**
   * @param {?=} payload
   */
  constructor(payload = []) {
    this.payload = payload;
    this.type = NodeActionTypes.Download;
  }
}
class CreateFolderAction {
  /**
   * @param {?} payload
   */
  constructor(payload) {
    this.payload = payload;
    this.type = NodeActionTypes.CreateFolder;
  }
}
class EditFolderAction {
  /**
   * @param {?} payload
   */
  constructor(payload) {
    this.payload = payload;
    this.type = NodeActionTypes.EditFolder;
  }
}
class ShareNodeAction {
  /**
   * @param {?} payload
   */
  constructor(payload) {
    this.payload = payload;
    this.type = NodeActionTypes.Share;
  }
}
class UnshareNodesAction {
  /**
   * @param {?} payload
   */
  constructor(payload) {
    this.payload = payload;
    this.type = NodeActionTypes.Unshare;
  }
}
class CopyNodesAction {
  /**
   * @param {?} payload
   */
  constructor(payload) {
    this.payload = payload;
    this.type = NodeActionTypes.Copy;
  }
}
class MoveNodesAction {
  /**
   * @param {?} payload
   */
  constructor(payload) {
    this.payload = payload;
    this.type = NodeActionTypes.Move;
  }
}
class ManagePermissionsAction {
  /**
   * @param {?} payload
   */
  constructor(payload) {
    this.payload = payload;
    this.type = NodeActionTypes.ManagePermissions;
  }
}
class PrintFileAction {
  /**
   * @param {?} payload
   */
  constructor(payload) {
    this.payload = payload;
    this.type = NodeActionTypes.PrintFile;
  }
}
class ManageVersionsAction {
  /**
   * @param {?} payload
   */
  constructor(payload) {
    this.payload = payload;
    this.type = NodeActionTypes.ManageVersions;
  }
}
class EditOfflineAction {
  /**
   * @param {?} payload
   */
  constructor(payload) {
    this.payload = payload;
    this.type = NodeActionTypes.EditOffline;
  }
}
class UnlockWriteAction {
  /**
   * @param {?} payload
   */
  constructor(payload) {
    this.payload = payload;
    this.type = NodeActionTypes.UnlockForWriting;
  }
}
class AddFavoriteAction {
  /**
   * @param {?} payload
   */
  constructor(payload) {
    this.payload = payload;
    this.type = NodeActionTypes.AddFavorite;
  }
}
class RemoveFavoriteAction {
  /**
   * @param {?} payload
   */
  constructor(payload) {
    this.payload = payload;
    this.type = NodeActionTypes.RemoveFavorite;
  }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
/** @enum {string} */
const RouterActionTypes = {
  NavigateUrl: 'NAVIGATE_URL',
  NavigateRoute: 'NAVIGATE_ROUTE',
  NavigateFolder: 'NAVIGATE_FOLDER',
  NavigateParentFolder: 'NAVIGATE_PARENT_FOLDER'
};
class NavigateUrlAction {
  /**
   * @param {?} payload
   */
  constructor(payload) {
    this.payload = payload;
    this.type = RouterActionTypes.NavigateUrl;
  }
}
class NavigateRouteAction {
  /**
   * @param {?} payload
   */
  constructor(payload) {
    this.payload = payload;
    this.type = RouterActionTypes.NavigateRoute;
  }
}
class NavigateToFolder {
  /**
   * @param {?} payload
   */
  constructor(payload) {
    this.payload = payload;
    this.type = RouterActionTypes.NavigateFolder;
  }
}
class NavigateToParentFolder {
  /**
   * @param {?} payload
   */
  constructor(payload) {
    this.payload = payload;
    this.type = RouterActionTypes.NavigateParentFolder;
  }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
/** @enum {string} */
const SearchActionTypes = {
  SearchByTerm: 'SEARCH_BY_TERM',
  ToggleFilter: 'TOGGLE_SEARCH_FILTER',
  ShowFilter: 'SHOW_SEARCH_FILTER',
  HideFilter: 'HIDE_SEARCH_FILTER'
};
class SearchByTermAction {
  /**
   * @param {?} payload
   * @param {?=} searchOptions
   */
  constructor(payload, searchOptions) {
    this.payload = payload;
    this.searchOptions = searchOptions;
    this.type = SearchActionTypes.SearchByTerm;
  }
}
class ToggleSearchFilterAction {
  constructor() {
    this.type = SearchActionTypes.ToggleFilter;
  }
}
class ShowSearchFilterAction {
  constructor() {
    this.type = SearchActionTypes.ShowFilter;
  }
}
class HideSearchFilterAction {
  constructor() {
    this.type = SearchActionTypes.HideFilter;
  }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
/** @enum {string} */
const SnackbarActionTypes = {
  Info: 'SNACKBAR_INFO',
  Warning: 'SNACKBAR_WARNING',
  Error: 'SNACKBAR_ERROR'
};
class SnackbarUserAction {
  /**
   * @param {?} title
   * @param {?} action
   */
  constructor(title, action) {
    this.title = title;
    this.action = action;
  }
}
class SnackbarInfoAction {
  /**
   * @param {?} payload
   * @param {?=} params
   */
  constructor(payload, params) {
    this.payload = payload;
    this.params = params;
    this.type = SnackbarActionTypes.Info;
    this.duration = 4000;
  }
}
class SnackbarWarningAction {
  /**
   * @param {?} payload
   * @param {?=} params
   */
  constructor(payload, params) {
    this.payload = payload;
    this.params = params;
    this.type = SnackbarActionTypes.Warning;
    this.duration = 4000;
  }
}
class SnackbarErrorAction {
  /**
   * @param {?} payload
   * @param {?=} params
   */
  constructor(payload, params) {
    this.payload = payload;
    this.params = params;
    this.type = SnackbarActionTypes.Error;
    this.duration = 4000;
  }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
/** @enum {string} */
const UploadActionTypes = {
  UploadFiles: 'UPLOAD_FILES',
  UploadFolder: 'UPLOAD_FOLDER',
  UploadFileVersion: 'UPLOAD_FILE_VERSION'
};
class UploadFilesAction {
  /**
   * @param {?} payload
   */
  constructor(payload) {
    this.payload = payload;
    this.type = UploadActionTypes.UploadFiles;
  }
}
class UploadFolderAction {
  /**
   * @param {?} payload
   */
  constructor(payload) {
    this.payload = payload;
    this.type = UploadActionTypes.UploadFolder;
  }
}
class UploadFileVersionAction {
  constructor() {
    this.type = UploadActionTypes.UploadFileVersion;
  }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
/** @enum {string} */
const ViewerActionTypes = {
  ViewFile: 'VIEW_FILE',
  ViewNode: 'VIEW_NODE',
  FullScreen: 'FULLSCREEN_VIEWER',
  ClosePreview: 'CLOSE_PREVIEW'
};
class ViewFileAction {
  /**
   * @param {?=} payload
   * @param {?=} parentId
   */
  constructor(payload, parentId) {
    this.payload = payload;
    this.parentId = parentId;
    this.type = ViewerActionTypes.ViewFile;
  }
}
class ViewNodeAction {
  /**
   * @param {?} nodeId
   * @param {?=} viewNodeExtras
   */
  constructor(nodeId, viewNodeExtras) {
    this.nodeId = nodeId;
    this.viewNodeExtras = viewNodeExtras;
    this.type = ViewerActionTypes.ViewNode;
  }
}
class FullscreenViewerAction {
  /**
   * @param {?} payload
   */
  constructor(payload) {
    this.payload = payload;
    this.type = ViewerActionTypes.FullScreen;
  }
}
class ClosePreviewAction {
  /**
   * @param {?=} payload
   */
  constructor(payload) {
    this.payload = payload;
    this.type = ViewerActionTypes.ClosePreview;
  }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
/** @type {?} */
const SET_INFO_DRAWER_METADATA_ASPECT = 'SET_INFO_DRAWER_METADATA_ASPECT';
class SetInfoDrawerMetadataAspectAction {
  /**
   * @param {?} payload
   */
  constructor(payload) {
    this.payload = payload;
    this.type = SET_INFO_DRAWER_METADATA_ASPECT;
  }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
/** @enum {string} */
const TemplateActionTypes = {
  FileFromTemplate: 'FILE_FROM_TEMPLATE',
  FolderFromTemplate: 'FOLDER_FROM_TEMPLATE',
  CreateFromTemplate: 'CREATE_FROM_TEMPLATE',
  CreateFromTemplateSuccess: 'CREATE_FROM_TEMPLATE_SUCCESS'
};
class FileFromTemplate {
  constructor() {
    this.type = TemplateActionTypes.FileFromTemplate;
  }
}
class FolderFromTemplate {
  constructor() {
    this.type = TemplateActionTypes.FolderFromTemplate;
  }
}
class CreateFromTemplate {
  /**
   * @param {?} payload
   */
  constructor(payload) {
    this.payload = payload;
    this.type = TemplateActionTypes.CreateFromTemplate;
  }
}
class CreateFromTemplateSuccess {
  /**
   * @param {?} node
   */
  constructor(node) {
    this.node = node;
    this.type = TemplateActionTypes.CreateFromTemplateSuccess;
  }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
/** @enum {string} */
const ContextMenuActionTypes = {
  ContextMenu: 'CONTEXT_MENU'
};
class ContextMenu {
  /**
   * @param {?} event
   */
  constructor(event) {
    this.event = event;
    this.type = ContextMenuActionTypes.ContextMenu;
  }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class DialogEffects {
  /**
   * @param {?} actions$
   * @param {?} matDialog
   */
  constructor(actions$, matDialog) {
    this.actions$ = actions$;
    this.matDialog = matDialog;
    this.closeAll$ = this.actions$.pipe(
      ofType(AppActionTypes.CloseModalDialogs),
      map(() => this.matDialog.closeAll())
    );
  }
}
DialogEffects.decorators = [{ type: Injectable }];
/** @nocollapse */
DialogEffects.ctorParameters = () => [{ type: Actions }, { type: MatDialog }];
__decorate(
  [Effect({ dispatch: false }), __metadata('design:type', Object)],
  DialogEffects.prototype,
  'closeAll$',
  void 0
);

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class RouterEffects {
  /**
   * @param {?} store
   * @param {?} actions$
   * @param {?} router
   */
  constructor(store, actions$, router) {
    this.store = store;
    this.actions$ = actions$;
    this.router = router;
    this.navigateUrl$ = this.actions$.pipe(
      ofType(RouterActionTypes.NavigateUrl),
      map(action => {
        if (action.payload) {
          this.router.navigateByUrl(action.payload);
        }
      })
    );
    this.navigateRoute$ = this.actions$.pipe(
      ofType(RouterActionTypes.NavigateRoute),
      map(action => {
        this.router.navigate(action.payload);
      })
    );
    this.navigateToFolder$ = this.actions$.pipe(
      ofType(RouterActionTypes.NavigateFolder),
      map(action => {
        if (action.payload && action.payload.entry) {
          this.navigateToFolder(action.payload.entry);
        }
      })
    );
    this.navigateToParentFolder$ = this.actions$.pipe(
      ofType(RouterActionTypes.NavigateParentFolder),
      map(action => {
        if (action.payload && action.payload.entry) {
          this.navigateToParentFolder(action.payload.entry);
        }
      })
    );
  }
  /**
   * @private
   * @param {?} node
   * @return {?}
   */
  navigateToFolder(node) {
    /** @type {?} */
    let link = null;
    const { path, id } = node;
    if (path && path.name && path.elements) {
      /** @type {?} */
      const isLibraryPath = this.isLibraryContent(/** @type {?} */ (path));
      /** @type {?} */
      const parent = path.elements[path.elements.length - 1];
      /** @type {?} */
      const area = isLibraryPath ? '/libraries' : '/personal-files';
      if (!isLibraryPath) {
        link = [area, id];
      } else {
        // parent.id could be 'Site' folder or child as 'documentLibrary'
        link = [area, parent.name === 'Sites' ? {} : id];
      }
      setTimeout(() => {
        this.router.navigate(link);
      }, 10);
    } else {
      this.router.navigate(['/personal-files', node.id]);
    }
  }
  /**
   * @private
   * @param {?} node
   * @return {?}
   */
  navigateToParentFolder(node) {
    /** @type {?} */
    let link = null;
    const { path } = node;
    if (path && path.name && path.elements) {
      /** @type {?} */
      const isLibraryPath = this.isLibraryContent(/** @type {?} */ (path));
      /** @type {?} */
      const parent = path.elements[path.elements.length - 1];
      /** @type {?} */
      const area = isLibraryPath ? '/libraries' : '/personal-files';
      if (!isLibraryPath) {
        link = [area, parent.id];
      } else {
        // parent.id could be 'Site' folder or child as 'documentLibrary'
        link = [area, parent.name === 'Sites' ? {} : parent.id];
      }
      setTimeout(() => {
        this.router.navigate(link);
      }, 10);
    } else {
      this.store.dispatch(
        new SnackbarErrorAction('APP.MESSAGES.ERRORS.CANNOT_NAVIGATE_LOCATION')
      );
    }
  }
  /**
   * @private
   * @param {?} path
   * @return {?}
   */
  isLibraryContent(path) {
    if (
      path &&
      path.elements.length >= 2 &&
      path.elements[1].name === 'Sites'
    ) {
      return true;
    }
    return false;
  }
}
RouterEffects.decorators = [{ type: Injectable }];
/** @nocollapse */
RouterEffects.ctorParameters = () => [
  { type: Store },
  { type: Actions },
  { type: Router }
];
__decorate(
  [Effect({ dispatch: false }), __metadata('design:type', Object)],
  RouterEffects.prototype,
  'navigateUrl$',
  void 0
);
__decorate(
  [Effect({ dispatch: false }), __metadata('design:type', Object)],
  RouterEffects.prototype,
  'navigateRoute$',
  void 0
);
__decorate(
  [Effect({ dispatch: false }), __metadata('design:type', Object)],
  RouterEffects.prototype,
  'navigateToFolder$',
  void 0
);
__decorate(
  [Effect({ dispatch: false }), __metadata('design:type', Object)],
  RouterEffects.prototype,
  'navigateToParentFolder$',
  void 0
);

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class SnackbarEffects {
  /**
   * @param {?} store
   * @param {?} actions$
   * @param {?} snackBar
   * @param {?} translationService
   */
  constructor(store, actions$, snackBar, translationService) {
    this.store = store;
    this.actions$ = actions$;
    this.snackBar = snackBar;
    this.translationService = translationService;
    this.infoEffect = this.actions$.pipe(
      ofType(SnackbarActionTypes.Info),
      map(action => {
        this.showSnackBar(action, 'info-snackbar');
      })
    );
    this.warningEffect = this.actions$.pipe(
      ofType(SnackbarActionTypes.Warning),
      map(action => {
        this.showSnackBar(action, 'warning-snackbar');
      })
    );
    this.errorEffect = this.actions$.pipe(
      ofType(SnackbarActionTypes.Error),
      map(action => {
        this.showSnackBar(action, 'error-snackbar');
      })
    );
  }
  /**
   * @private
   * @param {?} action
   * @param {?} panelClass
   * @return {?}
   */
  showSnackBar(action, panelClass) {
    /** @type {?} */
    const message = this.translate(action.payload, action.params);
    /** @type {?} */
    let actionName = null;
    if (action.userAction) {
      actionName = this.translate(action.userAction.title);
    }
    /** @type {?} */
    const snackBarRef = this.snackBar.open(message, actionName, {
      duration: action.duration || 4000,
      panelClass: panelClass
    });
    if (action.userAction) {
      snackBarRef.onAction().subscribe(() => {
        this.store.dispatch(action.userAction.action);
      });
    }
  }
  /**
   * @private
   * @param {?} message
   * @param {?=} params
   * @return {?}
   */
  translate(message, params) {
    return this.translationService.instant(message, params);
  }
}
SnackbarEffects.decorators = [{ type: Injectable }];
/** @nocollapse */
SnackbarEffects.ctorParameters = () => [
  { type: Store },
  { type: Actions },
  { type: MatSnackBar },
  { type: TranslationService }
];
__decorate(
  [Effect({ dispatch: false }), __metadata('design:type', Object)],
  SnackbarEffects.prototype,
  'infoEffect',
  void 0
);
__decorate(
  [Effect({ dispatch: false }), __metadata('design:type', Object)],
  SnackbarEffects.prototype,
  'warningEffect',
  void 0
);
__decorate(
  [Effect({ dispatch: false }), __metadata('design:type', Object)],
  SnackbarEffects.prototype,
  'errorEffect',
  void 0
);

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
/** @enum {string} */
const SearchOptionIds = {
  Files: 'content',
  Folders: 'folder',
  Libraries: 'libraries'
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @type {?} */
const selectApp = state => state.app;
/** @type {?} */
const getHeaderColor = createSelector(
  selectApp,
  state => state.headerColor
);
/** @type {?} */
const getAppName = createSelector(
  selectApp,
  state => state.appName
);
/** @type {?} */
const getLogoPath = createSelector(
  selectApp,
  state => state.logoPath
);
/** @type {?} */
const getLanguagePickerState = createSelector(
  selectApp,
  state => state.languagePicker
);
/** @type {?} */
const getUserProfile = createSelector(
  selectApp,
  state => state.user
);
/** @type {?} */
const getCurrentFolder = createSelector(
  selectApp,
  state => state.navigation.currentFolder
);
/** @type {?} */
const getAppSelection = createSelector(
  selectApp,
  state => state.selection
);
/** @type {?} */
const getSharedUrl = createSelector(
  selectApp,
  state => state.sharedUrl
);
/** @type {?} */
const getNavigationState = createSelector(
  selectApp,
  state => state.navigation
);
/** @type {?} */
const isInfoDrawerOpened = createSelector(
  selectApp,
  state => state.infoDrawerOpened
);
/** @type {?} */
const showFacetFilter = createSelector(
  selectApp,
  state => state.showFacetFilter
);
/** @type {?} */
const getDocumentDisplayMode = createSelector(
  selectApp,
  state => state.documentDisplayMode
);
/** @type {?} */
const getRepositoryStatus = createSelector(
  selectApp,
  state => state.repository
);
/** @type {?} */
const isQuickShareEnabled = createSelector(
  getRepositoryStatus,
  info => info.status.isQuickShareEnabled
);
/** @type {?} */
const isAdmin = createSelector(
  selectApp,
  state => state.user.isAdmin
);
/** @type {?} */
const getSideNavState = createSelector(
  getAppSelection,
  getNavigationState,
  (selection, navigation) => {
    return {
      selection,
      navigation
    };
  }
);
/** @type {?} */
const getRuleContext = createSelector(
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
/** @type {?} */
const infoDrawerMetadataAspect = createSelector(
  selectApp,
  state => state.infoDrawerMetadataAspect
);
/** @type {?} */
const getProcessServicesState = createSelector(
  selectApp,
  state => state.processServices
);

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class SharedStoreModule {}
SharedStoreModule.decorators = [
  {
    type: NgModule,
    args: [
      {
        imports: [
          EffectsModule.forFeature([
            SnackbarEffects,
            DialogEffects,
            RouterEffects
          ])
        ]
      }
    ]
  }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

export {
  AppActionTypes,
  SetInitialStateAction,
  SetLanguagePickerAction,
  SetCurrentFolderAction,
  SetCurrentUrlAction,
  SetUserProfileAction,
  ToggleInfoDrawerAction,
  ToggleDocumentDisplayMode,
  LogoutAction,
  ReloadDocumentListAction,
  ResetSelectionAction,
  SetInfoDrawerStateAction,
  CloseModalDialogsAction,
  SetRepositoryInfoAction,
  ToggleProcessServicesAction,
  LibraryActionTypes,
  DeleteLibraryAction,
  CreateLibraryAction,
  NavigateLibraryAction,
  UpdateLibraryAction,
  LeaveLibraryAction,
  NodeActionTypes,
  SetSelectedNodesAction,
  DeleteNodesAction,
  UndoDeleteNodesAction,
  RestoreDeletedNodesAction,
  PurgeDeletedNodesAction,
  DownloadNodesAction,
  CreateFolderAction,
  EditFolderAction,
  ShareNodeAction,
  UnshareNodesAction,
  CopyNodesAction,
  MoveNodesAction,
  ManagePermissionsAction,
  PrintFileAction,
  ManageVersionsAction,
  EditOfflineAction,
  UnlockWriteAction,
  AddFavoriteAction,
  RemoveFavoriteAction,
  RouterActionTypes,
  NavigateUrlAction,
  NavigateRouteAction,
  NavigateToFolder,
  NavigateToParentFolder,
  SearchActionTypes,
  SearchByTermAction,
  ToggleSearchFilterAction,
  ShowSearchFilterAction,
  HideSearchFilterAction,
  SnackbarActionTypes,
  SnackbarUserAction,
  SnackbarInfoAction,
  SnackbarWarningAction,
  SnackbarErrorAction,
  UploadActionTypes,
  UploadFilesAction,
  UploadFolderAction,
  UploadFileVersionAction,
  ViewerActionTypes,
  ViewFileAction,
  ViewNodeAction,
  FullscreenViewerAction,
  ClosePreviewAction,
  SET_INFO_DRAWER_METADATA_ASPECT,
  SetInfoDrawerMetadataAspectAction,
  TemplateActionTypes,
  FileFromTemplate,
  FolderFromTemplate,
  CreateFromTemplate,
  CreateFromTemplateSuccess,
  ContextMenuActionTypes,
  ContextMenu,
  DialogEffects,
  RouterEffects,
  SnackbarEffects,
  SearchOptionIds,
  selectApp,
  getHeaderColor,
  getAppName,
  getLogoPath,
  getLanguagePickerState,
  getUserProfile,
  getCurrentFolder,
  getAppSelection,
  getSharedUrl,
  getNavigationState,
  isInfoDrawerOpened,
  showFacetFilter,
  getDocumentDisplayMode,
  getRepositoryStatus,
  isQuickShareEnabled,
  isAdmin,
  getSideNavState,
  getRuleContext,
  infoDrawerMetadataAspect,
  getProcessServicesState,
  SharedStoreModule
};

//# sourceMappingURL=alfresco-aca-shared-store.js.map
