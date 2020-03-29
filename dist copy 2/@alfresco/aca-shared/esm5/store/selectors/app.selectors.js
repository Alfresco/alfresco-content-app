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
import { createSelector } from '@ngrx/store';
/** @type {?} */
export var selectApp = function(state) {
  return state.app;
};
/** @type {?} */
export var getHeaderColor = createSelector(
  selectApp,
  function(state) {
    return state.headerColor;
  }
);
/** @type {?} */
export var getAppName = createSelector(
  selectApp,
  function(state) {
    return state.appName;
  }
);
/** @type {?} */
export var getLogoPath = createSelector(
  selectApp,
  function(state) {
    return state.logoPath;
  }
);
/** @type {?} */
export var getLanguagePickerState = createSelector(
  selectApp,
  function(state) {
    return state.languagePicker;
  }
);
/** @type {?} */
export var getUserProfile = createSelector(
  selectApp,
  function(state) {
    return state.user;
  }
);
/** @type {?} */
export var getCurrentFolder = createSelector(
  selectApp,
  function(state) {
    return state.navigation.currentFolder;
  }
);
/** @type {?} */
export var getAppSelection = createSelector(
  selectApp,
  function(state) {
    return state.selection;
  }
);
/** @type {?} */
export var getSharedUrl = createSelector(
  selectApp,
  function(state) {
    return state.sharedUrl;
  }
);
/** @type {?} */
export var getNavigationState = createSelector(
  selectApp,
  function(state) {
    return state.navigation;
  }
);
/** @type {?} */
export var isInfoDrawerOpened = createSelector(
  selectApp,
  function(state) {
    return state.infoDrawerOpened;
  }
);
/** @type {?} */
export var showFacetFilter = createSelector(
  selectApp,
  function(state) {
    return state.showFacetFilter;
  }
);
/** @type {?} */
export var getDocumentDisplayMode = createSelector(
  selectApp,
  function(state) {
    return state.documentDisplayMode;
  }
);
/** @type {?} */
export var getRepositoryStatus = createSelector(
  selectApp,
  function(state) {
    return state.repository;
  }
);
/** @type {?} */
export var isQuickShareEnabled = createSelector(
  getRepositoryStatus,
  function(info) {
    return info.status.isQuickShareEnabled;
  }
);
/** @type {?} */
export var isAdmin = createSelector(
  selectApp,
  function(state) {
    return state.user.isAdmin;
  }
);
/** @type {?} */
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
/** @type {?} */
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
/** @type {?} */
export var infoDrawerMetadataAspect = createSelector(
  selectApp,
  function(state) {
    return state.infoDrawerMetadataAspect;
  }
);
/** @type {?} */
export var getProcessServicesState = createSelector(
  selectApp,
  function(state) {
    return state.processServices;
  }
);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLnNlbGVjdG9ycy5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BhbGZyZXNjby9hY2Etc2hhcmVkL3N0b3JlLyIsInNvdXJjZXMiOlsic2VsZWN0b3JzL2FwcC5zZWxlY3RvcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTBCQSxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sYUFBYSxDQUFDOztBQUU3QyxNQUFNLEtBQU8sU0FBUyxHQUFHLFVBQUMsS0FBZSxJQUFLLE9BQUEsS0FBSyxDQUFDLEdBQUcsRUFBVCxDQUFTOztBQUV2RCxNQUFNLEtBQU8sY0FBYyxHQUFHLGNBQWMsQ0FDMUMsU0FBUyxFQUNULFVBQUEsS0FBSyxJQUFJLE9BQUEsS0FBSyxDQUFDLFdBQVcsRUFBakIsQ0FBaUIsQ0FDM0I7O0FBRUQsTUFBTSxLQUFPLFVBQVUsR0FBRyxjQUFjLENBQ3RDLFNBQVMsRUFDVCxVQUFBLEtBQUssSUFBSSxPQUFBLEtBQUssQ0FBQyxPQUFPLEVBQWIsQ0FBYSxDQUN2Qjs7QUFFRCxNQUFNLEtBQU8sV0FBVyxHQUFHLGNBQWMsQ0FDdkMsU0FBUyxFQUNULFVBQUEsS0FBSyxJQUFJLE9BQUEsS0FBSyxDQUFDLFFBQVEsRUFBZCxDQUFjLENBQ3hCOztBQUVELE1BQU0sS0FBTyxzQkFBc0IsR0FBRyxjQUFjLENBQ2xELFNBQVMsRUFDVCxVQUFBLEtBQUssSUFBSSxPQUFBLEtBQUssQ0FBQyxjQUFjLEVBQXBCLENBQW9CLENBQzlCOztBQUVELE1BQU0sS0FBTyxjQUFjLEdBQUcsY0FBYyxDQUMxQyxTQUFTLEVBQ1QsVUFBQSxLQUFLLElBQUksT0FBQSxLQUFLLENBQUMsSUFBSSxFQUFWLENBQVUsQ0FDcEI7O0FBRUQsTUFBTSxLQUFPLGdCQUFnQixHQUFHLGNBQWMsQ0FDNUMsU0FBUyxFQUNULFVBQUEsS0FBSyxJQUFJLE9BQUEsS0FBSyxDQUFDLFVBQVUsQ0FBQyxhQUFhLEVBQTlCLENBQThCLENBQ3hDOztBQUVELE1BQU0sS0FBTyxlQUFlLEdBQUcsY0FBYyxDQUMzQyxTQUFTLEVBQ1QsVUFBQSxLQUFLLElBQUksT0FBQSxLQUFLLENBQUMsU0FBUyxFQUFmLENBQWUsQ0FDekI7O0FBRUQsTUFBTSxLQUFPLFlBQVksR0FBRyxjQUFjLENBQ3hDLFNBQVMsRUFDVCxVQUFBLEtBQUssSUFBSSxPQUFBLEtBQUssQ0FBQyxTQUFTLEVBQWYsQ0FBZSxDQUN6Qjs7QUFFRCxNQUFNLEtBQU8sa0JBQWtCLEdBQUcsY0FBYyxDQUM5QyxTQUFTLEVBQ1QsVUFBQSxLQUFLLElBQUksT0FBQSxLQUFLLENBQUMsVUFBVSxFQUFoQixDQUFnQixDQUMxQjs7QUFFRCxNQUFNLEtBQU8sa0JBQWtCLEdBQUcsY0FBYyxDQUM5QyxTQUFTLEVBQ1QsVUFBQSxLQUFLLElBQUksT0FBQSxLQUFLLENBQUMsZ0JBQWdCLEVBQXRCLENBQXNCLENBQ2hDOztBQUVELE1BQU0sS0FBTyxlQUFlLEdBQUcsY0FBYyxDQUMzQyxTQUFTLEVBQ1QsVUFBQSxLQUFLLElBQUksT0FBQSxLQUFLLENBQUMsZUFBZSxFQUFyQixDQUFxQixDQUMvQjs7QUFFRCxNQUFNLEtBQU8sc0JBQXNCLEdBQUcsY0FBYyxDQUNsRCxTQUFTLEVBQ1QsVUFBQSxLQUFLLElBQUksT0FBQSxLQUFLLENBQUMsbUJBQW1CLEVBQXpCLENBQXlCLENBQ25DOztBQUVELE1BQU0sS0FBTyxtQkFBbUIsR0FBRyxjQUFjLENBQy9DLFNBQVMsRUFDVCxVQUFBLEtBQUssSUFBSSxPQUFBLEtBQUssQ0FBQyxVQUFVLEVBQWhCLENBQWdCLENBQzFCOztBQUVELE1BQU0sS0FBTyxtQkFBbUIsR0FBRyxjQUFjLENBQy9DLG1CQUFtQixFQUNuQixVQUFBLElBQUksSUFBSSxPQUFBLElBQUksQ0FBQyxNQUFNLENBQUMsbUJBQW1CLEVBQS9CLENBQStCLENBQ3hDOztBQUVELE1BQU0sS0FBTyxPQUFPLEdBQUcsY0FBYyxDQUNuQyxTQUFTLEVBQ1QsVUFBQSxLQUFLLElBQUksT0FBQSxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBbEIsQ0FBa0IsQ0FDNUI7O0FBRUQsTUFBTSxLQUFPLGVBQWUsR0FBRyxjQUFjLENBQzNDLGVBQWUsRUFDZixrQkFBa0IsRUFDbEIsVUFBQyxTQUFTLEVBQUUsVUFBVTtJQUNwQixPQUFPO1FBQ0wsU0FBUyxXQUFBO1FBQ1QsVUFBVSxZQUFBO0tBQ1gsQ0FBQztBQUNKLENBQUMsQ0FDRjs7QUFFRCxNQUFNLEtBQU8sY0FBYyxHQUFHLGNBQWMsQ0FDMUMsZUFBZSxFQUNmLGtCQUFrQixFQUNsQixjQUFjLEVBQ2QsbUJBQW1CLEVBQ25CLFVBQUMsU0FBUyxFQUFFLFVBQVUsRUFBRSxPQUFPLEVBQUUsVUFBVTtJQUN6QyxPQUFPO1FBQ0wsU0FBUyxXQUFBO1FBQ1QsVUFBVSxZQUFBO1FBQ1YsT0FBTyxTQUFBO1FBQ1AsVUFBVSxZQUFBO0tBQ1gsQ0FBQztBQUNKLENBQUMsQ0FDRjs7QUFFRCxNQUFNLEtBQU8sd0JBQXdCLEdBQUcsY0FBYyxDQUNwRCxTQUFTLEVBQ1QsVUFBQSxLQUFLLElBQUksT0FBQSxLQUFLLENBQUMsd0JBQXdCLEVBQTlCLENBQThCLENBQ3hDOztBQUVELE1BQU0sS0FBTyx1QkFBdUIsR0FBRyxjQUFjLENBQ25ELFNBQVMsRUFDVCxVQUFBLEtBQUssSUFBSSxPQUFBLEtBQUssQ0FBQyxlQUFlLEVBQXJCLENBQXFCLENBQy9CIiwic291cmNlc0NvbnRlbnQiOlsiLyohXG4gKiBAbGljZW5zZVxuICogQWxmcmVzY28gRXhhbXBsZSBDb250ZW50IEFwcGxpY2F0aW9uXG4gKlxuICogQ29weXJpZ2h0IChDKSAyMDA1IC0gMjAyMCBBbGZyZXNjbyBTb2Z0d2FyZSBMaW1pdGVkXG4gKlxuICogVGhpcyBmaWxlIGlzIHBhcnQgb2YgdGhlIEFsZnJlc2NvIEV4YW1wbGUgQ29udGVudCBBcHBsaWNhdGlvbi5cbiAqIElmIHRoZSBzb2Z0d2FyZSB3YXMgcHVyY2hhc2VkIHVuZGVyIGEgcGFpZCBBbGZyZXNjbyBsaWNlbnNlLCB0aGUgdGVybXMgb2ZcbiAqIHRoZSBwYWlkIGxpY2Vuc2UgYWdyZWVtZW50IHdpbGwgcHJldmFpbC4gIE90aGVyd2lzZSwgdGhlIHNvZnR3YXJlIGlzXG4gKiBwcm92aWRlZCB1bmRlciB0aGUgZm9sbG93aW5nIG9wZW4gc291cmNlIGxpY2Vuc2UgdGVybXM6XG4gKlxuICogVGhlIEFsZnJlc2NvIEV4YW1wbGUgQ29udGVudCBBcHBsaWNhdGlvbiBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG4gKiBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBMZXNzZXIgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbiAqIHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4gKiAoYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuICpcbiAqIFRoZSBBbGZyZXNjbyBFeGFtcGxlIENvbnRlbnQgQXBwbGljYXRpb24gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbiAqIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG4gKiBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG4gKiBHTlUgTGVzc2VyIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cbiAqXG4gKiBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgTGVzc2VyIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIGFsb25nIHdpdGggQWxmcmVzY28uIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbiAqL1xuXG5pbXBvcnQgeyBBcHBTdG9yZSB9IGZyb20gJy4uL3N0YXRlcy9hcHAuc3RhdGUnO1xuaW1wb3J0IHsgY3JlYXRlU2VsZWN0b3IgfSBmcm9tICdAbmdyeC9zdG9yZSc7XG5cbmV4cG9ydCBjb25zdCBzZWxlY3RBcHAgPSAoc3RhdGU6IEFwcFN0b3JlKSA9PiBzdGF0ZS5hcHA7XG5cbmV4cG9ydCBjb25zdCBnZXRIZWFkZXJDb2xvciA9IGNyZWF0ZVNlbGVjdG9yKFxuICBzZWxlY3RBcHAsXG4gIHN0YXRlID0+IHN0YXRlLmhlYWRlckNvbG9yXG4pO1xuXG5leHBvcnQgY29uc3QgZ2V0QXBwTmFtZSA9IGNyZWF0ZVNlbGVjdG9yKFxuICBzZWxlY3RBcHAsXG4gIHN0YXRlID0+IHN0YXRlLmFwcE5hbWVcbik7XG5cbmV4cG9ydCBjb25zdCBnZXRMb2dvUGF0aCA9IGNyZWF0ZVNlbGVjdG9yKFxuICBzZWxlY3RBcHAsXG4gIHN0YXRlID0+IHN0YXRlLmxvZ29QYXRoXG4pO1xuXG5leHBvcnQgY29uc3QgZ2V0TGFuZ3VhZ2VQaWNrZXJTdGF0ZSA9IGNyZWF0ZVNlbGVjdG9yKFxuICBzZWxlY3RBcHAsXG4gIHN0YXRlID0+IHN0YXRlLmxhbmd1YWdlUGlja2VyXG4pO1xuXG5leHBvcnQgY29uc3QgZ2V0VXNlclByb2ZpbGUgPSBjcmVhdGVTZWxlY3RvcihcbiAgc2VsZWN0QXBwLFxuICBzdGF0ZSA9PiBzdGF0ZS51c2VyXG4pO1xuXG5leHBvcnQgY29uc3QgZ2V0Q3VycmVudEZvbGRlciA9IGNyZWF0ZVNlbGVjdG9yKFxuICBzZWxlY3RBcHAsXG4gIHN0YXRlID0+IHN0YXRlLm5hdmlnYXRpb24uY3VycmVudEZvbGRlclxuKTtcblxuZXhwb3J0IGNvbnN0IGdldEFwcFNlbGVjdGlvbiA9IGNyZWF0ZVNlbGVjdG9yKFxuICBzZWxlY3RBcHAsXG4gIHN0YXRlID0+IHN0YXRlLnNlbGVjdGlvblxuKTtcblxuZXhwb3J0IGNvbnN0IGdldFNoYXJlZFVybCA9IGNyZWF0ZVNlbGVjdG9yKFxuICBzZWxlY3RBcHAsXG4gIHN0YXRlID0+IHN0YXRlLnNoYXJlZFVybFxuKTtcblxuZXhwb3J0IGNvbnN0IGdldE5hdmlnYXRpb25TdGF0ZSA9IGNyZWF0ZVNlbGVjdG9yKFxuICBzZWxlY3RBcHAsXG4gIHN0YXRlID0+IHN0YXRlLm5hdmlnYXRpb25cbik7XG5cbmV4cG9ydCBjb25zdCBpc0luZm9EcmF3ZXJPcGVuZWQgPSBjcmVhdGVTZWxlY3RvcihcbiAgc2VsZWN0QXBwLFxuICBzdGF0ZSA9PiBzdGF0ZS5pbmZvRHJhd2VyT3BlbmVkXG4pO1xuXG5leHBvcnQgY29uc3Qgc2hvd0ZhY2V0RmlsdGVyID0gY3JlYXRlU2VsZWN0b3IoXG4gIHNlbGVjdEFwcCxcbiAgc3RhdGUgPT4gc3RhdGUuc2hvd0ZhY2V0RmlsdGVyXG4pO1xuXG5leHBvcnQgY29uc3QgZ2V0RG9jdW1lbnREaXNwbGF5TW9kZSA9IGNyZWF0ZVNlbGVjdG9yKFxuICBzZWxlY3RBcHAsXG4gIHN0YXRlID0+IHN0YXRlLmRvY3VtZW50RGlzcGxheU1vZGVcbik7XG5cbmV4cG9ydCBjb25zdCBnZXRSZXBvc2l0b3J5U3RhdHVzID0gY3JlYXRlU2VsZWN0b3IoXG4gIHNlbGVjdEFwcCxcbiAgc3RhdGUgPT4gc3RhdGUucmVwb3NpdG9yeVxuKTtcblxuZXhwb3J0IGNvbnN0IGlzUXVpY2tTaGFyZUVuYWJsZWQgPSBjcmVhdGVTZWxlY3RvcihcbiAgZ2V0UmVwb3NpdG9yeVN0YXR1cyxcbiAgaW5mbyA9PiBpbmZvLnN0YXR1cy5pc1F1aWNrU2hhcmVFbmFibGVkXG4pO1xuXG5leHBvcnQgY29uc3QgaXNBZG1pbiA9IGNyZWF0ZVNlbGVjdG9yKFxuICBzZWxlY3RBcHAsXG4gIHN0YXRlID0+IHN0YXRlLnVzZXIuaXNBZG1pblxuKTtcblxuZXhwb3J0IGNvbnN0IGdldFNpZGVOYXZTdGF0ZSA9IGNyZWF0ZVNlbGVjdG9yKFxuICBnZXRBcHBTZWxlY3Rpb24sXG4gIGdldE5hdmlnYXRpb25TdGF0ZSxcbiAgKHNlbGVjdGlvbiwgbmF2aWdhdGlvbikgPT4ge1xuICAgIHJldHVybiB7XG4gICAgICBzZWxlY3Rpb24sXG4gICAgICBuYXZpZ2F0aW9uXG4gICAgfTtcbiAgfVxuKTtcblxuZXhwb3J0IGNvbnN0IGdldFJ1bGVDb250ZXh0ID0gY3JlYXRlU2VsZWN0b3IoXG4gIGdldEFwcFNlbGVjdGlvbixcbiAgZ2V0TmF2aWdhdGlvblN0YXRlLFxuICBnZXRVc2VyUHJvZmlsZSxcbiAgZ2V0UmVwb3NpdG9yeVN0YXR1cyxcbiAgKHNlbGVjdGlvbiwgbmF2aWdhdGlvbiwgcHJvZmlsZSwgcmVwb3NpdG9yeSkgPT4ge1xuICAgIHJldHVybiB7XG4gICAgICBzZWxlY3Rpb24sXG4gICAgICBuYXZpZ2F0aW9uLFxuICAgICAgcHJvZmlsZSxcbiAgICAgIHJlcG9zaXRvcnlcbiAgICB9O1xuICB9XG4pO1xuXG5leHBvcnQgY29uc3QgaW5mb0RyYXdlck1ldGFkYXRhQXNwZWN0ID0gY3JlYXRlU2VsZWN0b3IoXG4gIHNlbGVjdEFwcCxcbiAgc3RhdGUgPT4gc3RhdGUuaW5mb0RyYXdlck1ldGFkYXRhQXNwZWN0XG4pO1xuXG5leHBvcnQgY29uc3QgZ2V0UHJvY2Vzc1NlcnZpY2VzU3RhdGUgPSBjcmVhdGVTZWxlY3RvcihcbiAgc2VsZWN0QXBwLFxuICBzdGF0ZSA9PiBzdGF0ZS5wcm9jZXNzU2VydmljZXNcbik7XG4iXX0=
