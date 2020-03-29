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
export { AppActionTypes };
var SetInitialStateAction = /** @class */ (function() {
  function SetInitialStateAction(payload) {
    this.payload = payload;
    this.type = AppActionTypes.SetInitialState;
  }
  return SetInitialStateAction;
})();
export { SetInitialStateAction };
if (false) {
  /** @type {?} */
  SetInitialStateAction.prototype.type;
  /** @type {?} */
  SetInitialStateAction.prototype.payload;
}
var SetLanguagePickerAction = /** @class */ (function() {
  function SetLanguagePickerAction(payload) {
    this.payload = payload;
    this.type = AppActionTypes.SetLanguagePicker;
  }
  return SetLanguagePickerAction;
})();
export { SetLanguagePickerAction };
if (false) {
  /** @type {?} */
  SetLanguagePickerAction.prototype.type;
  /** @type {?} */
  SetLanguagePickerAction.prototype.payload;
}
var SetCurrentFolderAction = /** @class */ (function() {
  function SetCurrentFolderAction(payload) {
    this.payload = payload;
    this.type = AppActionTypes.SetCurrentFolder;
  }
  return SetCurrentFolderAction;
})();
export { SetCurrentFolderAction };
if (false) {
  /** @type {?} */
  SetCurrentFolderAction.prototype.type;
  /** @type {?} */
  SetCurrentFolderAction.prototype.payload;
}
var SetCurrentUrlAction = /** @class */ (function() {
  function SetCurrentUrlAction(payload) {
    this.payload = payload;
    this.type = AppActionTypes.SetCurrentUrl;
  }
  return SetCurrentUrlAction;
})();
export { SetCurrentUrlAction };
if (false) {
  /** @type {?} */
  SetCurrentUrlAction.prototype.type;
  /** @type {?} */
  SetCurrentUrlAction.prototype.payload;
}
var SetUserProfileAction = /** @class */ (function() {
  function SetUserProfileAction(payload) {
    this.payload = payload;
    this.type = AppActionTypes.SetUserProfile;
  }
  return SetUserProfileAction;
})();
export { SetUserProfileAction };
if (false) {
  /** @type {?} */
  SetUserProfileAction.prototype.type;
  /** @type {?} */
  SetUserProfileAction.prototype.payload;
}
var ToggleInfoDrawerAction = /** @class */ (function() {
  function ToggleInfoDrawerAction() {
    this.type = AppActionTypes.ToggleInfoDrawer;
  }
  return ToggleInfoDrawerAction;
})();
export { ToggleInfoDrawerAction };
if (false) {
  /** @type {?} */
  ToggleInfoDrawerAction.prototype.type;
}
var ToggleDocumentDisplayMode = /** @class */ (function() {
  function ToggleDocumentDisplayMode() {
    this.type = AppActionTypes.ToggleDocumentDisplayMode;
  }
  return ToggleDocumentDisplayMode;
})();
export { ToggleDocumentDisplayMode };
if (false) {
  /** @type {?} */
  ToggleDocumentDisplayMode.prototype.type;
}
var LogoutAction = /** @class */ (function() {
  function LogoutAction() {
    this.type = AppActionTypes.Logout;
  }
  return LogoutAction;
})();
export { LogoutAction };
if (false) {
  /** @type {?} */
  LogoutAction.prototype.type;
}
var ReloadDocumentListAction = /** @class */ (function() {
  function ReloadDocumentListAction(payload) {
    this.payload = payload;
    this.type = AppActionTypes.ReloadDocumentList;
  }
  return ReloadDocumentListAction;
})();
export { ReloadDocumentListAction };
if (false) {
  /** @type {?} */
  ReloadDocumentListAction.prototype.type;
  /** @type {?} */
  ReloadDocumentListAction.prototype.payload;
}
var ResetSelectionAction = /** @class */ (function() {
  function ResetSelectionAction(payload) {
    this.payload = payload;
    this.type = AppActionTypes.ResetSelection;
  }
  return ResetSelectionAction;
})();
export { ResetSelectionAction };
if (false) {
  /** @type {?} */
  ResetSelectionAction.prototype.type;
  /** @type {?} */
  ResetSelectionAction.prototype.payload;
}
var SetInfoDrawerStateAction = /** @class */ (function() {
  function SetInfoDrawerStateAction(payload) {
    this.payload = payload;
    this.type = AppActionTypes.SetInfoDrawerState;
  }
  return SetInfoDrawerStateAction;
})();
export { SetInfoDrawerStateAction };
if (false) {
  /** @type {?} */
  SetInfoDrawerStateAction.prototype.type;
  /** @type {?} */
  SetInfoDrawerStateAction.prototype.payload;
}
var CloseModalDialogsAction = /** @class */ (function() {
  function CloseModalDialogsAction() {
    this.type = AppActionTypes.CloseModalDialogs;
  }
  return CloseModalDialogsAction;
})();
export { CloseModalDialogsAction };
if (false) {
  /** @type {?} */
  CloseModalDialogsAction.prototype.type;
}
var SetRepositoryInfoAction = /** @class */ (function() {
  function SetRepositoryInfoAction(payload) {
    this.payload = payload;
    this.type = AppActionTypes.SetRepositoryInfo;
  }
  return SetRepositoryInfoAction;
})();
export { SetRepositoryInfoAction };
if (false) {
  /** @type {?} */
  SetRepositoryInfoAction.prototype.type;
  /** @type {?} */
  SetRepositoryInfoAction.prototype.payload;
}
var ToggleProcessServicesAction = /** @class */ (function() {
  function ToggleProcessServicesAction(payload) {
    this.payload = payload;
    this.type = AppActionTypes.ToggleProcessServices;
  }
  return ToggleProcessServicesAction;
})();
export { ToggleProcessServicesAction };
if (false) {
  /** @type {?} */
  ToggleProcessServicesAction.prototype.type;
  /** @type {?} */
  ToggleProcessServicesAction.prototype.payload;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmFjdGlvbnMuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AYWxmcmVzY28vYWNhLXNoYXJlZC9zdG9yZS8iLCJzb3VyY2VzIjpbImFjdGlvbnMvYXBwLmFjdGlvbnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBOEJFLGlCQUFrQixtQkFBbUI7SUFDckMsbUJBQW9CLHFCQUFxQjtJQUN6QyxrQkFBbUIsb0JBQW9CO0lBQ3ZDLGVBQWdCLGlCQUFpQjtJQUNqQyxnQkFBaUIsa0JBQWtCO0lBQ25DLG1CQUFvQixxQkFBcUI7SUFDekMsa0JBQW1CLG9CQUFvQjtJQUN2QywyQkFBNEIsOEJBQThCO0lBQzFELFFBQVMsUUFBUTtJQUNqQixvQkFBcUIsc0JBQXNCO0lBQzNDLGdCQUFpQixpQkFBaUI7SUFDbEMsb0JBQXFCLHVCQUF1QjtJQUM1Qyw2QkFBOEIsaUNBQWlDO0lBQy9ELG1CQUFvQixxQkFBcUI7SUFDekMsdUJBQXdCLHlCQUF5Qjs7O0FBR25EO0lBR0UsK0JBQW1CLE9BQWlCO1FBQWpCLFlBQU8sR0FBUCxPQUFPLENBQVU7UUFGM0IsU0FBSSxHQUFHLGNBQWMsQ0FBQyxlQUFlLENBQUM7SUFFUixDQUFDO0lBQzFDLDRCQUFDO0FBQUQsQ0FBQyxBQUpELElBSUM7Ozs7SUFIQyxxQ0FBK0M7O0lBRW5DLHdDQUF3Qjs7QUFHdEM7SUFHRSxpQ0FBbUIsT0FBZ0I7UUFBaEIsWUFBTyxHQUFQLE9BQU8sQ0FBUztRQUYxQixTQUFJLEdBQUcsY0FBYyxDQUFDLGlCQUFpQixDQUFDO0lBRVgsQ0FBQztJQUN6Qyw4QkFBQztBQUFELENBQUMsQUFKRCxJQUlDOzs7O0lBSEMsdUNBQWlEOztJQUVyQywwQ0FBdUI7O0FBR3JDO0lBR0UsZ0NBQW1CLE9BQWE7UUFBYixZQUFPLEdBQVAsT0FBTyxDQUFNO1FBRnZCLFNBQUksR0FBRyxjQUFjLENBQUMsZ0JBQWdCLENBQUM7SUFFYixDQUFDO0lBQ3RDLDZCQUFDO0FBQUQsQ0FBQyxBQUpELElBSUM7Ozs7SUFIQyxzQ0FBZ0Q7O0lBRXBDLHlDQUFvQjs7QUFHbEM7SUFHRSw2QkFBbUIsT0FBZTtRQUFmLFlBQU8sR0FBUCxPQUFPLENBQVE7UUFGekIsU0FBSSxHQUFHLGNBQWMsQ0FBQyxhQUFhLENBQUM7SUFFUixDQUFDO0lBQ3hDLDBCQUFDO0FBQUQsQ0FBQyxBQUpELElBSUM7Ozs7SUFIQyxtQ0FBNkM7O0lBRWpDLHNDQUFzQjs7QUFHcEM7SUFHRSw4QkFBbUIsT0FBNEM7UUFBNUMsWUFBTyxHQUFQLE9BQU8sQ0FBcUM7UUFGdEQsU0FBSSxHQUFHLGNBQWMsQ0FBQyxjQUFjLENBQUM7SUFFb0IsQ0FBQztJQUNyRSwyQkFBQztBQUFELENBQUMsQUFKRCxJQUlDOzs7O0lBSEMsb0NBQThDOztJQUVsQyx1Q0FBbUQ7O0FBR2pFO0lBQUE7UUFDVyxTQUFJLEdBQUcsY0FBYyxDQUFDLGdCQUFnQixDQUFDO0lBQ2xELENBQUM7SUFBRCw2QkFBQztBQUFELENBQUMsQUFGRCxJQUVDOzs7O0lBREMsc0NBQWdEOztBQUdsRDtJQUFBO1FBQ1csU0FBSSxHQUFHLGNBQWMsQ0FBQyx5QkFBeUIsQ0FBQztJQUMzRCxDQUFDO0lBQUQsZ0NBQUM7QUFBRCxDQUFDLEFBRkQsSUFFQzs7OztJQURDLHlDQUF5RDs7QUFHM0Q7SUFBQTtRQUNXLFNBQUksR0FBRyxjQUFjLENBQUMsTUFBTSxDQUFDO0lBQ3hDLENBQUM7SUFBRCxtQkFBQztBQUFELENBQUMsQUFGRCxJQUVDOzs7O0lBREMsNEJBQXNDOztBQUd4QztJQUdFLGtDQUFtQixPQUFhO1FBQWIsWUFBTyxHQUFQLE9BQU8sQ0FBTTtRQUZ2QixTQUFJLEdBQUcsY0FBYyxDQUFDLGtCQUFrQixDQUFDO0lBRWYsQ0FBQztJQUN0QywrQkFBQztBQUFELENBQUMsQUFKRCxJQUlDOzs7O0lBSEMsd0NBQWtEOztJQUV0QywyQ0FBb0I7O0FBR2xDO0lBR0UsOEJBQW1CLE9BQWE7UUFBYixZQUFPLEdBQVAsT0FBTyxDQUFNO1FBRnZCLFNBQUksR0FBRyxjQUFjLENBQUMsY0FBYyxDQUFDO0lBRVgsQ0FBQztJQUN0QywyQkFBQztBQUFELENBQUMsQUFKRCxJQUlDOzs7O0lBSEMsb0NBQThDOztJQUVsQyx1Q0FBb0I7O0FBR2xDO0lBR0Usa0NBQW1CLE9BQWdCO1FBQWhCLFlBQU8sR0FBUCxPQUFPLENBQVM7UUFGMUIsU0FBSSxHQUFHLGNBQWMsQ0FBQyxrQkFBa0IsQ0FBQztJQUVaLENBQUM7SUFDekMsK0JBQUM7QUFBRCxDQUFDLEFBSkQsSUFJQzs7OztJQUhDLHdDQUFrRDs7SUFFdEMsMkNBQXVCOztBQUdyQztJQUFBO1FBQ1csU0FBSSxHQUFHLGNBQWMsQ0FBQyxpQkFBaUIsQ0FBQztJQUNuRCxDQUFDO0lBQUQsOEJBQUM7QUFBRCxDQUFDLEFBRkQsSUFFQzs7OztJQURDLHVDQUFpRDs7QUFHbkQ7SUFHRSxpQ0FBbUIsT0FBdUI7UUFBdkIsWUFBTyxHQUFQLE9BQU8sQ0FBZ0I7UUFGakMsU0FBSSxHQUFHLGNBQWMsQ0FBQyxpQkFBaUIsQ0FBQztJQUVKLENBQUM7SUFDaEQsOEJBQUM7QUFBRCxDQUFDLEFBSkQsSUFJQzs7OztJQUhDLHVDQUFpRDs7SUFFckMsMENBQThCOztBQUc1QztJQUdFLHFDQUFtQixPQUFnQjtRQUFoQixZQUFPLEdBQVAsT0FBTyxDQUFTO1FBRjFCLFNBQUksR0FBRyxjQUFjLENBQUMscUJBQXFCLENBQUM7SUFFZixDQUFDO0lBQ3pDLGtDQUFDO0FBQUQsQ0FBQyxBQUpELElBSUM7Ozs7SUFIQywyQ0FBcUQ7O0lBRXpDLDhDQUF1QiIsInNvdXJjZXNDb250ZW50IjpbIi8qIVxuICogQGxpY2Vuc2VcbiAqIEFsZnJlc2NvIEV4YW1wbGUgQ29udGVudCBBcHBsaWNhdGlvblxuICpcbiAqIENvcHlyaWdodCAoQykgMjAwNSAtIDIwMjAgQWxmcmVzY28gU29mdHdhcmUgTGltaXRlZFxuICpcbiAqIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIHRoZSBBbGZyZXNjbyBFeGFtcGxlIENvbnRlbnQgQXBwbGljYXRpb24uXG4gKiBJZiB0aGUgc29mdHdhcmUgd2FzIHB1cmNoYXNlZCB1bmRlciBhIHBhaWQgQWxmcmVzY28gbGljZW5zZSwgdGhlIHRlcm1zIG9mXG4gKiB0aGUgcGFpZCBsaWNlbnNlIGFncmVlbWVudCB3aWxsIHByZXZhaWwuICBPdGhlcndpc2UsIHRoZSBzb2Z0d2FyZSBpc1xuICogcHJvdmlkZWQgdW5kZXIgdGhlIGZvbGxvd2luZyBvcGVuIHNvdXJjZSBsaWNlbnNlIHRlcm1zOlxuICpcbiAqIFRoZSBBbGZyZXNjbyBFeGFtcGxlIENvbnRlbnQgQXBwbGljYXRpb24gaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuICogaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgTGVzc2VyIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG4gKiB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuICogKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cbiAqXG4gKiBUaGUgQWxmcmVzY28gRXhhbXBsZSBDb250ZW50IEFwcGxpY2F0aW9uIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG4gKiBidXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuICogTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuICogR05VIExlc3NlciBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG4gKlxuICogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIExlc3NlciBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiBhbG9uZyB3aXRoIEFsZnJlc2NvLiBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG4gKi9cblxuaW1wb3J0IHsgQWN0aW9uIH0gZnJvbSAnQG5ncngvc3RvcmUnO1xuaW1wb3J0IHsgTm9kZSwgUGVyc29uLCBHcm91cCwgUmVwb3NpdG9yeUluZm8gfSBmcm9tICdAYWxmcmVzY28vanMtYXBpJztcbmltcG9ydCB7IEFwcFN0YXRlIH0gZnJvbSAnLi4vc3RhdGVzL2FwcC5zdGF0ZSc7XG5cbmV4cG9ydCBlbnVtIEFwcEFjdGlvblR5cGVzIHtcbiAgU2V0SW5pdGlhbFN0YXRlID0gJ1NFVF9JTklUSUFMX1NUQVRFJyxcbiAgU2V0TGFuZ3VhZ2VQaWNrZXIgPSAnU0VUX0xBTkdVQUdFX1BJQ0tFUicsXG4gIFNldEN1cnJlbnRGb2xkZXIgPSAnU0VUX0NVUlJFTlRfRk9MREVSJyxcbiAgU2V0Q3VycmVudFVybCA9ICdTRVRfQ1VSUkVOVF9VUkwnLFxuICBTZXRVc2VyUHJvZmlsZSA9ICdTRVRfVVNFUl9QUk9GSUxFJyxcbiAgU2V0UmVwb3NpdG9yeUluZm8gPSAnU0VUX1JFUE9TSVRPUllfSU5GTycsXG4gIFRvZ2dsZUluZm9EcmF3ZXIgPSAnVE9HR0xFX0lORk9fRFJBV0VSJyxcbiAgVG9nZ2xlRG9jdW1lbnREaXNwbGF5TW9kZSA9ICdUT0dHTEVfRE9DVU1FTlRfRElTUExBWV9NT0RFJyxcbiAgTG9nb3V0ID0gJ0xPR09VVCcsXG4gIFJlbG9hZERvY3VtZW50TGlzdCA9ICdSRUxPQURfRE9DVU1FTlRfTElTVCcsXG4gIFJlc2V0U2VsZWN0aW9uID0gJ1JFU0VUX1NFTEVDVElPTicsXG4gIFNldEluZm9EcmF3ZXJTdGF0ZSA9ICdTRVRfSU5GT19EUkFXRVJfU1RBVEUnLFxuICBTZXRJbmZvRHJhd2VyTWV0YWRhdGFBc3BlY3QgPSAnU0VUX0lORk9fRFJBV0VSX01FVEFEQVRBX0FTUEVDVCcsXG4gIENsb3NlTW9kYWxEaWFsb2dzID0gJ0NMT1NFX01PREFMX0RJQUxPR1MnLFxuICBUb2dnbGVQcm9jZXNzU2VydmljZXMgPSAnVE9HR0xFX1BST0NFU1NfU0VSVklDRVMnXG59XG5cbmV4cG9ydCBjbGFzcyBTZXRJbml0aWFsU3RhdGVBY3Rpb24gaW1wbGVtZW50cyBBY3Rpb24ge1xuICByZWFkb25seSB0eXBlID0gQXBwQWN0aW9uVHlwZXMuU2V0SW5pdGlhbFN0YXRlO1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBwYXlsb2FkOiBBcHBTdGF0ZSkge31cbn1cblxuZXhwb3J0IGNsYXNzIFNldExhbmd1YWdlUGlja2VyQWN0aW9uIGltcGxlbWVudHMgQWN0aW9uIHtcbiAgcmVhZG9ubHkgdHlwZSA9IEFwcEFjdGlvblR5cGVzLlNldExhbmd1YWdlUGlja2VyO1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBwYXlsb2FkOiBib29sZWFuKSB7fVxufVxuXG5leHBvcnQgY2xhc3MgU2V0Q3VycmVudEZvbGRlckFjdGlvbiBpbXBsZW1lbnRzIEFjdGlvbiB7XG4gIHJlYWRvbmx5IHR5cGUgPSBBcHBBY3Rpb25UeXBlcy5TZXRDdXJyZW50Rm9sZGVyO1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBwYXlsb2FkOiBOb2RlKSB7fVxufVxuXG5leHBvcnQgY2xhc3MgU2V0Q3VycmVudFVybEFjdGlvbiBpbXBsZW1lbnRzIEFjdGlvbiB7XG4gIHJlYWRvbmx5IHR5cGUgPSBBcHBBY3Rpb25UeXBlcy5TZXRDdXJyZW50VXJsO1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBwYXlsb2FkOiBzdHJpbmcpIHt9XG59XG5cbmV4cG9ydCBjbGFzcyBTZXRVc2VyUHJvZmlsZUFjdGlvbiBpbXBsZW1lbnRzIEFjdGlvbiB7XG4gIHJlYWRvbmx5IHR5cGUgPSBBcHBBY3Rpb25UeXBlcy5TZXRVc2VyUHJvZmlsZTtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgcGF5bG9hZDogeyBwZXJzb246IFBlcnNvbjsgZ3JvdXBzOiBHcm91cFtdIH0pIHt9XG59XG5cbmV4cG9ydCBjbGFzcyBUb2dnbGVJbmZvRHJhd2VyQWN0aW9uIGltcGxlbWVudHMgQWN0aW9uIHtcbiAgcmVhZG9ubHkgdHlwZSA9IEFwcEFjdGlvblR5cGVzLlRvZ2dsZUluZm9EcmF3ZXI7XG59XG5cbmV4cG9ydCBjbGFzcyBUb2dnbGVEb2N1bWVudERpc3BsYXlNb2RlIGltcGxlbWVudHMgQWN0aW9uIHtcbiAgcmVhZG9ubHkgdHlwZSA9IEFwcEFjdGlvblR5cGVzLlRvZ2dsZURvY3VtZW50RGlzcGxheU1vZGU7XG59XG5cbmV4cG9ydCBjbGFzcyBMb2dvdXRBY3Rpb24gaW1wbGVtZW50cyBBY3Rpb24ge1xuICByZWFkb25seSB0eXBlID0gQXBwQWN0aW9uVHlwZXMuTG9nb3V0O1xufVxuXG5leHBvcnQgY2xhc3MgUmVsb2FkRG9jdW1lbnRMaXN0QWN0aW9uIGltcGxlbWVudHMgQWN0aW9uIHtcbiAgcmVhZG9ubHkgdHlwZSA9IEFwcEFjdGlvblR5cGVzLlJlbG9hZERvY3VtZW50TGlzdDtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgcGF5bG9hZD86IGFueSkge31cbn1cblxuZXhwb3J0IGNsYXNzIFJlc2V0U2VsZWN0aW9uQWN0aW9uIGltcGxlbWVudHMgQWN0aW9uIHtcbiAgcmVhZG9ubHkgdHlwZSA9IEFwcEFjdGlvblR5cGVzLlJlc2V0U2VsZWN0aW9uO1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBwYXlsb2FkPzogYW55KSB7fVxufVxuXG5leHBvcnQgY2xhc3MgU2V0SW5mb0RyYXdlclN0YXRlQWN0aW9uIGltcGxlbWVudHMgQWN0aW9uIHtcbiAgcmVhZG9ubHkgdHlwZSA9IEFwcEFjdGlvblR5cGVzLlNldEluZm9EcmF3ZXJTdGF0ZTtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgcGF5bG9hZDogYm9vbGVhbikge31cbn1cblxuZXhwb3J0IGNsYXNzIENsb3NlTW9kYWxEaWFsb2dzQWN0aW9uIGltcGxlbWVudHMgQWN0aW9uIHtcbiAgcmVhZG9ubHkgdHlwZSA9IEFwcEFjdGlvblR5cGVzLkNsb3NlTW9kYWxEaWFsb2dzO1xufVxuXG5leHBvcnQgY2xhc3MgU2V0UmVwb3NpdG9yeUluZm9BY3Rpb24gaW1wbGVtZW50cyBBY3Rpb24ge1xuICByZWFkb25seSB0eXBlID0gQXBwQWN0aW9uVHlwZXMuU2V0UmVwb3NpdG9yeUluZm87XG5cbiAgY29uc3RydWN0b3IocHVibGljIHBheWxvYWQ6IFJlcG9zaXRvcnlJbmZvKSB7fVxufVxuXG5leHBvcnQgY2xhc3MgVG9nZ2xlUHJvY2Vzc1NlcnZpY2VzQWN0aW9uIGltcGxlbWVudHMgQWN0aW9uIHtcbiAgcmVhZG9ubHkgdHlwZSA9IEFwcEFjdGlvblR5cGVzLlRvZ2dsZVByb2Nlc3NTZXJ2aWNlcztcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgcGF5bG9hZDogYm9vbGVhbikge31cbn1cbiJdfQ==
