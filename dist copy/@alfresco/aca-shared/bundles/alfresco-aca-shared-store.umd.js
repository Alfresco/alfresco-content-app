(function(global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined'
    ? factory(
        exports,
        require('@angular/material/dialog'),
        require('@angular/router'),
        require('@alfresco/adf-core'),
        require('@angular/material/snack-bar'),
        require('rxjs/operators'),
        require('@ngrx/store'),
        require('@angular/core'),
        require('@ngrx/effects')
      )
    : typeof define === 'function' && define.amd
    ? define('@alfresco/aca-shared/store', [
        'exports',
        '@angular/material/dialog',
        '@angular/router',
        '@alfresco/adf-core',
        '@angular/material/snack-bar',
        'rxjs/operators',
        '@ngrx/store',
        '@angular/core',
        '@ngrx/effects'
      ], factory)
    : factory(
        ((global.alfresco = global.alfresco || {}),
        (global.alfresco['aca-shared'] = global.alfresco['aca-shared'] || {}),
        (global.alfresco['aca-shared'].store = {})),
        global.ng.material.dialog,
        global.ng.router,
        global.adfCore,
        global.ng.material['snack-bar'],
        global.rxjs.operators,
        global.store,
        global.ng.core,
        global.effects
      );
})(this, function(
  exports,
  dialog,
  router,
  adfCore,
  snackBar,
  operators,
  store,
  core,
  effects
) {
  'use strict';

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
  var AppActionTypes = {
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
  var SetInitialStateAction = /** @class */ (function() {
    function SetInitialStateAction(payload) {
      this.payload = payload;
      this.type = AppActionTypes.SetInitialState;
    }
    return SetInitialStateAction;
  })();
  var SetLanguagePickerAction = /** @class */ (function() {
    function SetLanguagePickerAction(payload) {
      this.payload = payload;
      this.type = AppActionTypes.SetLanguagePicker;
    }
    return SetLanguagePickerAction;
  })();
  var SetCurrentFolderAction = /** @class */ (function() {
    function SetCurrentFolderAction(payload) {
      this.payload = payload;
      this.type = AppActionTypes.SetCurrentFolder;
    }
    return SetCurrentFolderAction;
  })();
  var SetCurrentUrlAction = /** @class */ (function() {
    function SetCurrentUrlAction(payload) {
      this.payload = payload;
      this.type = AppActionTypes.SetCurrentUrl;
    }
    return SetCurrentUrlAction;
  })();
  var SetUserProfileAction = /** @class */ (function() {
    function SetUserProfileAction(payload) {
      this.payload = payload;
      this.type = AppActionTypes.SetUserProfile;
    }
    return SetUserProfileAction;
  })();
  var ToggleInfoDrawerAction = /** @class */ (function() {
    function ToggleInfoDrawerAction() {
      this.type = AppActionTypes.ToggleInfoDrawer;
    }
    return ToggleInfoDrawerAction;
  })();
  var ToggleDocumentDisplayMode = /** @class */ (function() {
    function ToggleDocumentDisplayMode() {
      this.type = AppActionTypes.ToggleDocumentDisplayMode;
    }
    return ToggleDocumentDisplayMode;
  })();
  var LogoutAction = /** @class */ (function() {
    function LogoutAction() {
      this.type = AppActionTypes.Logout;
    }
    return LogoutAction;
  })();
  var ReloadDocumentListAction = /** @class */ (function() {
    function ReloadDocumentListAction(payload) {
      this.payload = payload;
      this.type = AppActionTypes.ReloadDocumentList;
    }
    return ReloadDocumentListAction;
  })();
  var ResetSelectionAction = /** @class */ (function() {
    function ResetSelectionAction(payload) {
      this.payload = payload;
      this.type = AppActionTypes.ResetSelection;
    }
    return ResetSelectionAction;
  })();
  var SetInfoDrawerStateAction = /** @class */ (function() {
    function SetInfoDrawerStateAction(payload) {
      this.payload = payload;
      this.type = AppActionTypes.SetInfoDrawerState;
    }
    return SetInfoDrawerStateAction;
  })();
  var CloseModalDialogsAction = /** @class */ (function() {
    function CloseModalDialogsAction() {
      this.type = AppActionTypes.CloseModalDialogs;
    }
    return CloseModalDialogsAction;
  })();
  var SetRepositoryInfoAction = /** @class */ (function() {
    function SetRepositoryInfoAction(payload) {
      this.payload = payload;
      this.type = AppActionTypes.SetRepositoryInfo;
    }
    return SetRepositoryInfoAction;
  })();
  var ToggleProcessServicesAction = /** @class */ (function() {
    function ToggleProcessServicesAction(payload) {
      this.payload = payload;
      this.type = AppActionTypes.ToggleProcessServices;
    }
    return ToggleProcessServicesAction;
  })();

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
  var LibraryActionTypes = {
    Delete: 'DELETE_LIBRARY',
    Create: 'CREATE_LIBRARY',
    Navigate: 'NAVIGATE_LIBRARY',
    Update: 'UPDATE_LIBRARY',
    Leave: 'LEAVE_LIBRARY'
  };
  var DeleteLibraryAction = /** @class */ (function() {
    function DeleteLibraryAction(payload) {
      this.payload = payload;
      this.type = LibraryActionTypes.Delete;
    }
    return DeleteLibraryAction;
  })();
  var CreateLibraryAction = /** @class */ (function() {
    function CreateLibraryAction() {
      this.type = LibraryActionTypes.Create;
    }
    return CreateLibraryAction;
  })();
  var NavigateLibraryAction = /** @class */ (function() {
    function NavigateLibraryAction(payload) {
      this.payload = payload;
      this.type = LibraryActionTypes.Navigate;
    }
    return NavigateLibraryAction;
  })();
  var UpdateLibraryAction = /** @class */ (function() {
    function UpdateLibraryAction(payload) {
      this.payload = payload;
      this.type = LibraryActionTypes.Update;
    }
    return UpdateLibraryAction;
  })();
  var LeaveLibraryAction = /** @class */ (function() {
    function LeaveLibraryAction(payload) {
      this.payload = payload;
      this.type = LibraryActionTypes.Leave;
    }
    return LeaveLibraryAction;
  })();

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
  var NodeActionTypes = {
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
  var SetSelectedNodesAction = /** @class */ (function() {
    function SetSelectedNodesAction(payload) {
      if (payload === void 0) {
        payload = [];
      }
      this.payload = payload;
      this.type = NodeActionTypes.SetSelection;
    }
    return SetSelectedNodesAction;
  })();
  var DeleteNodesAction = /** @class */ (function() {
    function DeleteNodesAction(payload) {
      if (payload === void 0) {
        payload = [];
      }
      this.payload = payload;
      this.type = NodeActionTypes.Delete;
    }
    return DeleteNodesAction;
  })();
  var UndoDeleteNodesAction = /** @class */ (function() {
    function UndoDeleteNodesAction(payload) {
      if (payload === void 0) {
        payload = [];
      }
      this.payload = payload;
      this.type = NodeActionTypes.UndoDelete;
    }
    return UndoDeleteNodesAction;
  })();
  var RestoreDeletedNodesAction = /** @class */ (function() {
    function RestoreDeletedNodesAction(payload) {
      this.payload = payload;
      this.type = NodeActionTypes.RestoreDeleted;
    }
    return RestoreDeletedNodesAction;
  })();
  var PurgeDeletedNodesAction = /** @class */ (function() {
    function PurgeDeletedNodesAction(payload) {
      this.payload = payload;
      this.type = NodeActionTypes.PurgeDeleted;
    }
    return PurgeDeletedNodesAction;
  })();
  var DownloadNodesAction = /** @class */ (function() {
    function DownloadNodesAction(payload) {
      if (payload === void 0) {
        payload = [];
      }
      this.payload = payload;
      this.type = NodeActionTypes.Download;
    }
    return DownloadNodesAction;
  })();
  var CreateFolderAction = /** @class */ (function() {
    function CreateFolderAction(payload) {
      this.payload = payload;
      this.type = NodeActionTypes.CreateFolder;
    }
    return CreateFolderAction;
  })();
  var EditFolderAction = /** @class */ (function() {
    function EditFolderAction(payload) {
      this.payload = payload;
      this.type = NodeActionTypes.EditFolder;
    }
    return EditFolderAction;
  })();
  var ShareNodeAction = /** @class */ (function() {
    function ShareNodeAction(payload) {
      this.payload = payload;
      this.type = NodeActionTypes.Share;
    }
    return ShareNodeAction;
  })();
  var UnshareNodesAction = /** @class */ (function() {
    function UnshareNodesAction(payload) {
      this.payload = payload;
      this.type = NodeActionTypes.Unshare;
    }
    return UnshareNodesAction;
  })();
  var CopyNodesAction = /** @class */ (function() {
    function CopyNodesAction(payload) {
      this.payload = payload;
      this.type = NodeActionTypes.Copy;
    }
    return CopyNodesAction;
  })();
  var MoveNodesAction = /** @class */ (function() {
    function MoveNodesAction(payload) {
      this.payload = payload;
      this.type = NodeActionTypes.Move;
    }
    return MoveNodesAction;
  })();
  var ManagePermissionsAction = /** @class */ (function() {
    function ManagePermissionsAction(payload) {
      this.payload = payload;
      this.type = NodeActionTypes.ManagePermissions;
    }
    return ManagePermissionsAction;
  })();
  var PrintFileAction = /** @class */ (function() {
    function PrintFileAction(payload) {
      this.payload = payload;
      this.type = NodeActionTypes.PrintFile;
    }
    return PrintFileAction;
  })();
  var ManageVersionsAction = /** @class */ (function() {
    function ManageVersionsAction(payload) {
      this.payload = payload;
      this.type = NodeActionTypes.ManageVersions;
    }
    return ManageVersionsAction;
  })();
  var EditOfflineAction = /** @class */ (function() {
    function EditOfflineAction(payload) {
      this.payload = payload;
      this.type = NodeActionTypes.EditOffline;
    }
    return EditOfflineAction;
  })();
  var UnlockWriteAction = /** @class */ (function() {
    function UnlockWriteAction(payload) {
      this.payload = payload;
      this.type = NodeActionTypes.UnlockForWriting;
    }
    return UnlockWriteAction;
  })();
  var AddFavoriteAction = /** @class */ (function() {
    function AddFavoriteAction(payload) {
      this.payload = payload;
      this.type = NodeActionTypes.AddFavorite;
    }
    return AddFavoriteAction;
  })();
  var RemoveFavoriteAction = /** @class */ (function() {
    function RemoveFavoriteAction(payload) {
      this.payload = payload;
      this.type = NodeActionTypes.RemoveFavorite;
    }
    return RemoveFavoriteAction;
  })();

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
  var RouterActionTypes = {
    NavigateUrl: 'NAVIGATE_URL',
    NavigateRoute: 'NAVIGATE_ROUTE',
    NavigateFolder: 'NAVIGATE_FOLDER',
    NavigateParentFolder: 'NAVIGATE_PARENT_FOLDER'
  };
  var NavigateUrlAction = /** @class */ (function() {
    function NavigateUrlAction(payload) {
      this.payload = payload;
      this.type = RouterActionTypes.NavigateUrl;
    }
    return NavigateUrlAction;
  })();
  var NavigateRouteAction = /** @class */ (function() {
    function NavigateRouteAction(payload) {
      this.payload = payload;
      this.type = RouterActionTypes.NavigateRoute;
    }
    return NavigateRouteAction;
  })();
  var NavigateToFolder = /** @class */ (function() {
    function NavigateToFolder(payload) {
      this.payload = payload;
      this.type = RouterActionTypes.NavigateFolder;
    }
    return NavigateToFolder;
  })();
  var NavigateToParentFolder = /** @class */ (function() {
    function NavigateToParentFolder(payload) {
      this.payload = payload;
      this.type = RouterActionTypes.NavigateParentFolder;
    }
    return NavigateToParentFolder;
  })();

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
  var SearchActionTypes = {
    SearchByTerm: 'SEARCH_BY_TERM',
    ToggleFilter: 'TOGGLE_SEARCH_FILTER',
    ShowFilter: 'SHOW_SEARCH_FILTER',
    HideFilter: 'HIDE_SEARCH_FILTER'
  };
  var SearchByTermAction = /** @class */ (function() {
    function SearchByTermAction(payload, searchOptions) {
      this.payload = payload;
      this.searchOptions = searchOptions;
      this.type = SearchActionTypes.SearchByTerm;
    }
    return SearchByTermAction;
  })();
  var ToggleSearchFilterAction = /** @class */ (function() {
    function ToggleSearchFilterAction() {
      this.type = SearchActionTypes.ToggleFilter;
    }
    return ToggleSearchFilterAction;
  })();
  var ShowSearchFilterAction = /** @class */ (function() {
    function ShowSearchFilterAction() {
      this.type = SearchActionTypes.ShowFilter;
    }
    return ShowSearchFilterAction;
  })();
  var HideSearchFilterAction = /** @class */ (function() {
    function HideSearchFilterAction() {
      this.type = SearchActionTypes.HideFilter;
    }
    return HideSearchFilterAction;
  })();

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
  var SnackbarActionTypes = {
    Info: 'SNACKBAR_INFO',
    Warning: 'SNACKBAR_WARNING',
    Error: 'SNACKBAR_ERROR'
  };
  var SnackbarUserAction = /** @class */ (function() {
    function SnackbarUserAction(title, action) {
      this.title = title;
      this.action = action;
    }
    return SnackbarUserAction;
  })();
  var SnackbarInfoAction = /** @class */ (function() {
    function SnackbarInfoAction(payload, params) {
      this.payload = payload;
      this.params = params;
      this.type = SnackbarActionTypes.Info;
      this.duration = 4000;
    }
    return SnackbarInfoAction;
  })();
  var SnackbarWarningAction = /** @class */ (function() {
    function SnackbarWarningAction(payload, params) {
      this.payload = payload;
      this.params = params;
      this.type = SnackbarActionTypes.Warning;
      this.duration = 4000;
    }
    return SnackbarWarningAction;
  })();
  var SnackbarErrorAction = /** @class */ (function() {
    function SnackbarErrorAction(payload, params) {
      this.payload = payload;
      this.params = params;
      this.type = SnackbarActionTypes.Error;
      this.duration = 4000;
    }
    return SnackbarErrorAction;
  })();

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
  var UploadActionTypes = {
    UploadFiles: 'UPLOAD_FILES',
    UploadFolder: 'UPLOAD_FOLDER',
    UploadFileVersion: 'UPLOAD_FILE_VERSION'
  };
  var UploadFilesAction = /** @class */ (function() {
    function UploadFilesAction(payload) {
      this.payload = payload;
      this.type = UploadActionTypes.UploadFiles;
    }
    return UploadFilesAction;
  })();
  var UploadFolderAction = /** @class */ (function() {
    function UploadFolderAction(payload) {
      this.payload = payload;
      this.type = UploadActionTypes.UploadFolder;
    }
    return UploadFolderAction;
  })();
  var UploadFileVersionAction = /** @class */ (function() {
    function UploadFileVersionAction() {
      this.type = UploadActionTypes.UploadFileVersion;
    }
    return UploadFileVersionAction;
  })();

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
  var ViewerActionTypes = {
    ViewFile: 'VIEW_FILE',
    ViewNode: 'VIEW_NODE',
    FullScreen: 'FULLSCREEN_VIEWER',
    ClosePreview: 'CLOSE_PREVIEW'
  };
  var ViewFileAction = /** @class */ (function() {
    function ViewFileAction(payload, parentId) {
      this.payload = payload;
      this.parentId = parentId;
      this.type = ViewerActionTypes.ViewFile;
    }
    return ViewFileAction;
  })();
  var ViewNodeAction = /** @class */ (function() {
    function ViewNodeAction(nodeId, viewNodeExtras) {
      this.nodeId = nodeId;
      this.viewNodeExtras = viewNodeExtras;
      this.type = ViewerActionTypes.ViewNode;
    }
    return ViewNodeAction;
  })();
  var FullscreenViewerAction = /** @class */ (function() {
    function FullscreenViewerAction(payload) {
      this.payload = payload;
      this.type = ViewerActionTypes.FullScreen;
    }
    return FullscreenViewerAction;
  })();
  var ClosePreviewAction = /** @class */ (function() {
    function ClosePreviewAction(payload) {
      this.payload = payload;
      this.type = ViewerActionTypes.ClosePreview;
    }
    return ClosePreviewAction;
  })();

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
  var SET_INFO_DRAWER_METADATA_ASPECT = 'SET_INFO_DRAWER_METADATA_ASPECT';
  var SetInfoDrawerMetadataAspectAction = /** @class */ (function() {
    function SetInfoDrawerMetadataAspectAction(payload) {
      this.payload = payload;
      this.type = SET_INFO_DRAWER_METADATA_ASPECT;
    }
    return SetInfoDrawerMetadataAspectAction;
  })();

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
  var TemplateActionTypes = {
    FileFromTemplate: 'FILE_FROM_TEMPLATE',
    FolderFromTemplate: 'FOLDER_FROM_TEMPLATE',
    CreateFromTemplate: 'CREATE_FROM_TEMPLATE',
    CreateFromTemplateSuccess: 'CREATE_FROM_TEMPLATE_SUCCESS'
  };
  var FileFromTemplate = /** @class */ (function() {
    function FileFromTemplate() {
      this.type = TemplateActionTypes.FileFromTemplate;
    }
    return FileFromTemplate;
  })();
  var FolderFromTemplate = /** @class */ (function() {
    function FolderFromTemplate() {
      this.type = TemplateActionTypes.FolderFromTemplate;
    }
    return FolderFromTemplate;
  })();
  var CreateFromTemplate = /** @class */ (function() {
    function CreateFromTemplate(payload) {
      this.payload = payload;
      this.type = TemplateActionTypes.CreateFromTemplate;
    }
    return CreateFromTemplate;
  })();
  var CreateFromTemplateSuccess = /** @class */ (function() {
    function CreateFromTemplateSuccess(node) {
      this.node = node;
      this.type = TemplateActionTypes.CreateFromTemplateSuccess;
    }
    return CreateFromTemplateSuccess;
  })();

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
  var ContextMenuActionTypes = {
    ContextMenu: 'CONTEXT_MENU'
  };
  var ContextMenu = /** @class */ (function() {
    function ContextMenu(event) {
      this.event = event;
      this.type = ContextMenuActionTypes.ContextMenu;
    }
    return ContextMenu;
  })();

  /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */
  function __decorate(decorators, target, key, desc) {
    var c = arguments.length,
      r =
        c < 3
          ? target
          : desc === null
          ? (desc = Object.getOwnPropertyDescriptor(target, key))
          : desc,
      d;
    if (typeof Reflect === 'object' && typeof Reflect.decorate === 'function')
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if ((d = decorators[i]))
          r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  }
  function __metadata(metadataKey, metadataValue) {
    if (typeof Reflect === 'object' && typeof Reflect.metadata === 'function')
      return Reflect.metadata(metadataKey, metadataValue);
  }

  /**
   * @fileoverview added by tsickle
   * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
   */
  var DialogEffects = /** @class */ (function() {
    function DialogEffects(actions$, matDialog) {
      var _this = this;
      this.actions$ = actions$;
      this.matDialog = matDialog;
      this.closeAll$ = this.actions$.pipe(
        effects.ofType(AppActionTypes.CloseModalDialogs),
        operators.map(function() {
          return _this.matDialog.closeAll();
        })
      );
    }
    DialogEffects.decorators = [{ type: core.Injectable }];
    /** @nocollapse */
    DialogEffects.ctorParameters = function() {
      return [{ type: effects.Actions }, { type: dialog.MatDialog }];
    };
    __decorate(
      [effects.Effect({ dispatch: false }), __metadata('design:type', Object)],
      DialogEffects.prototype,
      'closeAll$',
      void 0
    );
    return DialogEffects;
  })();

  /**
   * @fileoverview added by tsickle
   * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
   */
  var RouterEffects = /** @class */ (function() {
    function RouterEffects(store$$1, actions$, router$$1) {
      var _this = this;
      this.store = store$$1;
      this.actions$ = actions$;
      this.router = router$$1;
      this.navigateUrl$ = this.actions$.pipe(
        effects.ofType(RouterActionTypes.NavigateUrl),
        operators.map(function(action) {
          if (action.payload) {
            _this.router.navigateByUrl(action.payload);
          }
        })
      );
      this.navigateRoute$ = this.actions$.pipe(
        effects.ofType(RouterActionTypes.NavigateRoute),
        operators.map(function(action) {
          _this.router.navigate(action.payload);
        })
      );
      this.navigateToFolder$ = this.actions$.pipe(
        effects.ofType(RouterActionTypes.NavigateFolder),
        operators.map(function(action) {
          if (action.payload && action.payload.entry) {
            _this.navigateToFolder(action.payload.entry);
          }
        })
      );
      this.navigateToParentFolder$ = this.actions$.pipe(
        effects.ofType(RouterActionTypes.NavigateParentFolder),
        operators.map(function(action) {
          if (action.payload && action.payload.entry) {
            _this.navigateToParentFolder(action.payload.entry);
          }
        })
      );
    }
    /**
     * @private
     * @param {?} node
     * @return {?}
     */
    RouterEffects.prototype.navigateToFolder
    /**
     * @private
     * @param {?} node
     * @return {?}
     */ = function(node) {
      var _this = this;
      /** @type {?} */
      var link = null;
      var path = node.path,
        id = node.id;
      if (path && path.name && path.elements) {
        /** @type {?} */
        var isLibraryPath = this.isLibraryContent(/** @type {?} */ (path));
        /** @type {?} */
        var parent_1 = path.elements[path.elements.length - 1];
        /** @type {?} */
        var area = isLibraryPath ? '/libraries' : '/personal-files';
        if (!isLibraryPath) {
          link = [area, id];
        } else {
          // parent.id could be 'Site' folder or child as 'documentLibrary'
          link = [area, parent_1.name === 'Sites' ? {} : id];
        }
        setTimeout(function() {
          _this.router.navigate(link);
        }, 10);
      } else {
        this.router.navigate(['/personal-files', node.id]);
      }
    };
    /**
     * @private
     * @param {?} node
     * @return {?}
     */
    RouterEffects.prototype.navigateToParentFolder
    /**
     * @private
     * @param {?} node
     * @return {?}
     */ = function(node) {
      var _this = this;
      /** @type {?} */
      var link = null;
      var path = node.path;
      if (path && path.name && path.elements) {
        /** @type {?} */
        var isLibraryPath = this.isLibraryContent(/** @type {?} */ (path));
        /** @type {?} */
        var parent_2 = path.elements[path.elements.length - 1];
        /** @type {?} */
        var area = isLibraryPath ? '/libraries' : '/personal-files';
        if (!isLibraryPath) {
          link = [area, parent_2.id];
        } else {
          // parent.id could be 'Site' folder or child as 'documentLibrary'
          link = [area, parent_2.name === 'Sites' ? {} : parent_2.id];
        }
        setTimeout(function() {
          _this.router.navigate(link);
        }, 10);
      } else {
        this.store.dispatch(
          new SnackbarErrorAction(
            'APP.MESSAGES.ERRORS.CANNOT_NAVIGATE_LOCATION'
          )
        );
      }
    };
    /**
     * @private
     * @param {?} path
     * @return {?}
     */
    RouterEffects.prototype.isLibraryContent
    /**
     * @private
     * @param {?} path
     * @return {?}
     */ = function(path) {
      if (
        path &&
        path.elements.length >= 2 &&
        path.elements[1].name === 'Sites'
      ) {
        return true;
      }
      return false;
    };
    RouterEffects.decorators = [{ type: core.Injectable }];
    /** @nocollapse */
    RouterEffects.ctorParameters = function() {
      return [
        { type: store.Store },
        { type: effects.Actions },
        { type: router.Router }
      ];
    };
    __decorate(
      [effects.Effect({ dispatch: false }), __metadata('design:type', Object)],
      RouterEffects.prototype,
      'navigateUrl$',
      void 0
    );
    __decorate(
      [effects.Effect({ dispatch: false }), __metadata('design:type', Object)],
      RouterEffects.prototype,
      'navigateRoute$',
      void 0
    );
    __decorate(
      [effects.Effect({ dispatch: false }), __metadata('design:type', Object)],
      RouterEffects.prototype,
      'navigateToFolder$',
      void 0
    );
    __decorate(
      [effects.Effect({ dispatch: false }), __metadata('design:type', Object)],
      RouterEffects.prototype,
      'navigateToParentFolder$',
      void 0
    );
    return RouterEffects;
  })();

  /**
   * @fileoverview added by tsickle
   * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
   */
  var SnackbarEffects = /** @class */ (function() {
    function SnackbarEffects(
      store$$1,
      actions$,
      snackBar$$1,
      translationService
    ) {
      var _this = this;
      this.store = store$$1;
      this.actions$ = actions$;
      this.snackBar = snackBar$$1;
      this.translationService = translationService;
      this.infoEffect = this.actions$.pipe(
        effects.ofType(SnackbarActionTypes.Info),
        operators.map(function(action) {
          _this.showSnackBar(action, 'info-snackbar');
        })
      );
      this.warningEffect = this.actions$.pipe(
        effects.ofType(SnackbarActionTypes.Warning),
        operators.map(function(action) {
          _this.showSnackBar(action, 'warning-snackbar');
        })
      );
      this.errorEffect = this.actions$.pipe(
        effects.ofType(SnackbarActionTypes.Error),
        operators.map(function(action) {
          _this.showSnackBar(action, 'error-snackbar');
        })
      );
    }
    /**
     * @private
     * @param {?} action
     * @param {?} panelClass
     * @return {?}
     */
    SnackbarEffects.prototype.showSnackBar
    /**
     * @private
     * @param {?} action
     * @param {?} panelClass
     * @return {?}
     */ = function(action, panelClass) {
      var _this = this;
      /** @type {?} */
      var message = this.translate(action.payload, action.params);
      /** @type {?} */
      var actionName = null;
      if (action.userAction) {
        actionName = this.translate(action.userAction.title);
      }
      /** @type {?} */
      var snackBarRef = this.snackBar.open(message, actionName, {
        duration: action.duration || 4000,
        panelClass: panelClass
      });
      if (action.userAction) {
        snackBarRef.onAction().subscribe(function() {
          _this.store.dispatch(action.userAction.action);
        });
      }
    };
    /**
     * @private
     * @param {?} message
     * @param {?=} params
     * @return {?}
     */
    SnackbarEffects.prototype.translate
    /**
     * @private
     * @param {?} message
     * @param {?=} params
     * @return {?}
     */ = function(message, params) {
      return this.translationService.instant(message, params);
    };
    SnackbarEffects.decorators = [{ type: core.Injectable }];
    /** @nocollapse */
    SnackbarEffects.ctorParameters = function() {
      return [
        { type: store.Store },
        { type: effects.Actions },
        { type: snackBar.MatSnackBar },
        { type: adfCore.TranslationService }
      ];
    };
    __decorate(
      [effects.Effect({ dispatch: false }), __metadata('design:type', Object)],
      SnackbarEffects.prototype,
      'infoEffect',
      void 0
    );
    __decorate(
      [effects.Effect({ dispatch: false }), __metadata('design:type', Object)],
      SnackbarEffects.prototype,
      'warningEffect',
      void 0
    );
    __decorate(
      [effects.Effect({ dispatch: false }), __metadata('design:type', Object)],
      SnackbarEffects.prototype,
      'errorEffect',
      void 0
    );
    return SnackbarEffects;
  })();

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
  var SearchOptionIds = {
    Files: 'content',
    Folders: 'folder',
    Libraries: 'libraries'
  };

  /**
   * @fileoverview added by tsickle
   * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
   */
  /** @type {?} */
  var selectApp = function(state) {
    return state.app;
  };
  /** @type {?} */
  var getHeaderColor = store.createSelector(
    selectApp,
    function(state) {
      return state.headerColor;
    }
  );
  /** @type {?} */
  var getAppName = store.createSelector(
    selectApp,
    function(state) {
      return state.appName;
    }
  );
  /** @type {?} */
  var getLogoPath = store.createSelector(
    selectApp,
    function(state) {
      return state.logoPath;
    }
  );
  /** @type {?} */
  var getLanguagePickerState = store.createSelector(
    selectApp,
    function(state) {
      return state.languagePicker;
    }
  );
  /** @type {?} */
  var getUserProfile = store.createSelector(
    selectApp,
    function(state) {
      return state.user;
    }
  );
  /** @type {?} */
  var getCurrentFolder = store.createSelector(
    selectApp,
    function(state) {
      return state.navigation.currentFolder;
    }
  );
  /** @type {?} */
  var getAppSelection = store.createSelector(
    selectApp,
    function(state) {
      return state.selection;
    }
  );
  /** @type {?} */
  var getSharedUrl = store.createSelector(
    selectApp,
    function(state) {
      return state.sharedUrl;
    }
  );
  /** @type {?} */
  var getNavigationState = store.createSelector(
    selectApp,
    function(state) {
      return state.navigation;
    }
  );
  /** @type {?} */
  var isInfoDrawerOpened = store.createSelector(
    selectApp,
    function(state) {
      return state.infoDrawerOpened;
    }
  );
  /** @type {?} */
  var showFacetFilter = store.createSelector(
    selectApp,
    function(state) {
      return state.showFacetFilter;
    }
  );
  /** @type {?} */
  var getDocumentDisplayMode = store.createSelector(
    selectApp,
    function(state) {
      return state.documentDisplayMode;
    }
  );
  /** @type {?} */
  var getRepositoryStatus = store.createSelector(
    selectApp,
    function(state) {
      return state.repository;
    }
  );
  /** @type {?} */
  var isQuickShareEnabled = store.createSelector(
    getRepositoryStatus,
    function(info) {
      return info.status.isQuickShareEnabled;
    }
  );
  /** @type {?} */
  var isAdmin = store.createSelector(
    selectApp,
    function(state) {
      return state.user.isAdmin;
    }
  );
  /** @type {?} */
  var getSideNavState = store.createSelector(
    getAppSelection,
    getNavigationState,
    function(selection, navigation) {
      return {
        selection: selection,
        navigation: navigation
      };
    }
  );
  /** @type {?} */
  var getRuleContext = store.createSelector(
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
  /** @type {?} */
  var infoDrawerMetadataAspect = store.createSelector(
    selectApp,
    function(state) {
      return state.infoDrawerMetadataAspect;
    }
  );
  /** @type {?} */
  var getProcessServicesState = store.createSelector(
    selectApp,
    function(state) {
      return state.processServices;
    }
  );

  /**
   * @fileoverview added by tsickle
   * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
   */
  var SharedStoreModule = /** @class */ (function() {
    function SharedStoreModule() {}
    SharedStoreModule.decorators = [
      {
        type: core.NgModule,
        args: [
          {
            imports: [
              effects.EffectsModule.forFeature([
                SnackbarEffects,
                DialogEffects,
                RouterEffects
              ])
            ]
          }
        ]
      }
    ];
    return SharedStoreModule;
  })();

  /**
   * @fileoverview added by tsickle
   * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
   */

  /**
   * @fileoverview added by tsickle
   * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
   */

  exports.AppActionTypes = AppActionTypes;
  exports.SetInitialStateAction = SetInitialStateAction;
  exports.SetLanguagePickerAction = SetLanguagePickerAction;
  exports.SetCurrentFolderAction = SetCurrentFolderAction;
  exports.SetCurrentUrlAction = SetCurrentUrlAction;
  exports.SetUserProfileAction = SetUserProfileAction;
  exports.ToggleInfoDrawerAction = ToggleInfoDrawerAction;
  exports.ToggleDocumentDisplayMode = ToggleDocumentDisplayMode;
  exports.LogoutAction = LogoutAction;
  exports.ReloadDocumentListAction = ReloadDocumentListAction;
  exports.ResetSelectionAction = ResetSelectionAction;
  exports.SetInfoDrawerStateAction = SetInfoDrawerStateAction;
  exports.CloseModalDialogsAction = CloseModalDialogsAction;
  exports.SetRepositoryInfoAction = SetRepositoryInfoAction;
  exports.ToggleProcessServicesAction = ToggleProcessServicesAction;
  exports.LibraryActionTypes = LibraryActionTypes;
  exports.DeleteLibraryAction = DeleteLibraryAction;
  exports.CreateLibraryAction = CreateLibraryAction;
  exports.NavigateLibraryAction = NavigateLibraryAction;
  exports.UpdateLibraryAction = UpdateLibraryAction;
  exports.LeaveLibraryAction = LeaveLibraryAction;
  exports.NodeActionTypes = NodeActionTypes;
  exports.SetSelectedNodesAction = SetSelectedNodesAction;
  exports.DeleteNodesAction = DeleteNodesAction;
  exports.UndoDeleteNodesAction = UndoDeleteNodesAction;
  exports.RestoreDeletedNodesAction = RestoreDeletedNodesAction;
  exports.PurgeDeletedNodesAction = PurgeDeletedNodesAction;
  exports.DownloadNodesAction = DownloadNodesAction;
  exports.CreateFolderAction = CreateFolderAction;
  exports.EditFolderAction = EditFolderAction;
  exports.ShareNodeAction = ShareNodeAction;
  exports.UnshareNodesAction = UnshareNodesAction;
  exports.CopyNodesAction = CopyNodesAction;
  exports.MoveNodesAction = MoveNodesAction;
  exports.ManagePermissionsAction = ManagePermissionsAction;
  exports.PrintFileAction = PrintFileAction;
  exports.ManageVersionsAction = ManageVersionsAction;
  exports.EditOfflineAction = EditOfflineAction;
  exports.UnlockWriteAction = UnlockWriteAction;
  exports.AddFavoriteAction = AddFavoriteAction;
  exports.RemoveFavoriteAction = RemoveFavoriteAction;
  exports.RouterActionTypes = RouterActionTypes;
  exports.NavigateUrlAction = NavigateUrlAction;
  exports.NavigateRouteAction = NavigateRouteAction;
  exports.NavigateToFolder = NavigateToFolder;
  exports.NavigateToParentFolder = NavigateToParentFolder;
  exports.SearchActionTypes = SearchActionTypes;
  exports.SearchByTermAction = SearchByTermAction;
  exports.ToggleSearchFilterAction = ToggleSearchFilterAction;
  exports.ShowSearchFilterAction = ShowSearchFilterAction;
  exports.HideSearchFilterAction = HideSearchFilterAction;
  exports.SnackbarActionTypes = SnackbarActionTypes;
  exports.SnackbarUserAction = SnackbarUserAction;
  exports.SnackbarInfoAction = SnackbarInfoAction;
  exports.SnackbarWarningAction = SnackbarWarningAction;
  exports.SnackbarErrorAction = SnackbarErrorAction;
  exports.UploadActionTypes = UploadActionTypes;
  exports.UploadFilesAction = UploadFilesAction;
  exports.UploadFolderAction = UploadFolderAction;
  exports.UploadFileVersionAction = UploadFileVersionAction;
  exports.ViewerActionTypes = ViewerActionTypes;
  exports.ViewFileAction = ViewFileAction;
  exports.ViewNodeAction = ViewNodeAction;
  exports.FullscreenViewerAction = FullscreenViewerAction;
  exports.ClosePreviewAction = ClosePreviewAction;
  exports.SET_INFO_DRAWER_METADATA_ASPECT = SET_INFO_DRAWER_METADATA_ASPECT;
  exports.SetInfoDrawerMetadataAspectAction = SetInfoDrawerMetadataAspectAction;
  exports.TemplateActionTypes = TemplateActionTypes;
  exports.FileFromTemplate = FileFromTemplate;
  exports.FolderFromTemplate = FolderFromTemplate;
  exports.CreateFromTemplate = CreateFromTemplate;
  exports.CreateFromTemplateSuccess = CreateFromTemplateSuccess;
  exports.ContextMenuActionTypes = ContextMenuActionTypes;
  exports.ContextMenu = ContextMenu;
  exports.DialogEffects = DialogEffects;
  exports.RouterEffects = RouterEffects;
  exports.SnackbarEffects = SnackbarEffects;
  exports.SearchOptionIds = SearchOptionIds;
  exports.selectApp = selectApp;
  exports.getHeaderColor = getHeaderColor;
  exports.getAppName = getAppName;
  exports.getLogoPath = getLogoPath;
  exports.getLanguagePickerState = getLanguagePickerState;
  exports.getUserProfile = getUserProfile;
  exports.getCurrentFolder = getCurrentFolder;
  exports.getAppSelection = getAppSelection;
  exports.getSharedUrl = getSharedUrl;
  exports.getNavigationState = getNavigationState;
  exports.isInfoDrawerOpened = isInfoDrawerOpened;
  exports.showFacetFilter = showFacetFilter;
  exports.getDocumentDisplayMode = getDocumentDisplayMode;
  exports.getRepositoryStatus = getRepositoryStatus;
  exports.isQuickShareEnabled = isQuickShareEnabled;
  exports.isAdmin = isAdmin;
  exports.getSideNavState = getSideNavState;
  exports.getRuleContext = getRuleContext;
  exports.infoDrawerMetadataAspect = infoDrawerMetadataAspect;
  exports.getProcessServicesState = getProcessServicesState;
  exports.SharedStoreModule = SharedStoreModule;

  Object.defineProperty(exports, '__esModule', { value: true });
});

//# sourceMappingURL=alfresco-aca-shared-store.umd.js.map
