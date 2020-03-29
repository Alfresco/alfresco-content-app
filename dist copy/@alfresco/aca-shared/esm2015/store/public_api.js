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
  ToggleProcessServicesAction
} from './actions/app.actions';
export {
  LibraryActionTypes,
  DeleteLibraryAction,
  CreateLibraryAction,
  NavigateLibraryAction,
  UpdateLibraryAction,
  LeaveLibraryAction
} from './actions/library.actions';
export {
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
  RemoveFavoriteAction
} from './actions/node.actions';
export {
  RouterActionTypes,
  NavigateUrlAction,
  NavigateRouteAction,
  NavigateToFolder,
  NavigateToParentFolder
} from './actions/router.actions';
export {
  SearchActionTypes,
  SearchByTermAction,
  ToggleSearchFilterAction,
  ShowSearchFilterAction,
  HideSearchFilterAction
} from './actions/search.actions';
export {
  SnackbarActionTypes,
  SnackbarUserAction,
  SnackbarInfoAction,
  SnackbarWarningAction,
  SnackbarErrorAction
} from './actions/snackbar.actions';
export {
  UploadActionTypes,
  UploadFilesAction,
  UploadFolderAction,
  UploadFileVersionAction
} from './actions/upload.actions';
export {
  ViewerActionTypes,
  ViewFileAction,
  ViewNodeAction,
  FullscreenViewerAction,
  ClosePreviewAction
} from './actions/viewer.actions';
export {
  SET_INFO_DRAWER_METADATA_ASPECT,
  SetInfoDrawerMetadataAspectAction
} from './actions/metadata-aspect.actions';
export {
  TemplateActionTypes,
  FileFromTemplate,
  FolderFromTemplate,
  CreateFromTemplate,
  CreateFromTemplateSuccess
} from './actions/template.actions';
export {
  ContextMenuActionTypes,
  ContextMenu
} from './actions/contextmenu.actions';
export { DialogEffects } from './effects/dialog.effects';
export { RouterEffects } from './effects/router.effects';
export { SnackbarEffects } from './effects/snackbar.effects';
export {} from './models/delete-status.model';
export {} from './models/deleted-node-info.model';
export {} from './models/node-info.model';
export { SearchOptionIds } from './models/search-option.model';
export {
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
  getProcessServicesState
} from './selectors/app.selectors';
export {} from './states/app.state';
export { SharedStoreModule } from './store.module';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHVibGljX2FwaS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BhbGZyZXNjby9hY2Etc2hhcmVkL3N0b3JlLyIsInNvdXJjZXMiOlsicHVibGljX2FwaS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBeUJBLDRXQUFjLHVCQUF1QixDQUFDO0FBQ3RDLDZJQUFjLDJCQUEyQixDQUFDO0FBQzFDLHVhQUFjLHdCQUF3QixDQUFDO0FBQ3ZDLG9IQUFjLDBCQUEwQixDQUFDO0FBQ3pDLGdJQUFjLDBCQUEwQixDQUFDO0FBQ3pDLHdIQUFjLDRCQUE0QixDQUFDO0FBQzNDLGtHQUFjLDBCQUEwQixDQUFDO0FBQ3pDLDhHQUFjLDBCQUEwQixDQUFDO0FBQ3pDLG1GQUFjLG1DQUFtQyxDQUFDO0FBQ2xELHlIQUFjLDRCQUE0QixDQUFDO0FBQzNDLG9EQUFjLCtCQUErQixDQUFDO0FBRTlDLDhCQUFjLDBCQUEwQixDQUFDO0FBQ3pDLDhCQUFjLDBCQUEwQixDQUFDO0FBQ3pDLGdDQUFjLDRCQUE0QixDQUFDO0FBRTNDLGVBQWMsOEJBQThCLENBQUM7QUFDN0MsZUFBYyxrQ0FBa0MsQ0FBQztBQUNqRCxlQUFjLDBCQUEwQixDQUFDO0FBQ3pDLGdDQUFjLDhCQUE4QixDQUFDO0FBRTdDLG9YQUFjLDJCQUEyQixDQUFDO0FBRTFDLGVBQWMsb0JBQW9CLENBQUM7QUFFbkMsa0NBQWMsZ0JBQWdCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiFcbiAqIEBsaWNlbnNlXG4gKiBBbGZyZXNjbyBFeGFtcGxlIENvbnRlbnQgQXBwbGljYXRpb25cbiAqXG4gKiBDb3B5cmlnaHQgKEMpIDIwMDUgLSAyMDIwIEFsZnJlc2NvIFNvZnR3YXJlIExpbWl0ZWRcbiAqXG4gKiBUaGlzIGZpbGUgaXMgcGFydCBvZiB0aGUgQWxmcmVzY28gRXhhbXBsZSBDb250ZW50IEFwcGxpY2F0aW9uLlxuICogSWYgdGhlIHNvZnR3YXJlIHdhcyBwdXJjaGFzZWQgdW5kZXIgYSBwYWlkIEFsZnJlc2NvIGxpY2Vuc2UsIHRoZSB0ZXJtcyBvZlxuICogdGhlIHBhaWQgbGljZW5zZSBhZ3JlZW1lbnQgd2lsbCBwcmV2YWlsLiAgT3RoZXJ3aXNlLCB0aGUgc29mdHdhcmUgaXNcbiAqIHByb3ZpZGVkIHVuZGVyIHRoZSBmb2xsb3dpbmcgb3BlbiBzb3VyY2UgbGljZW5zZSB0ZXJtczpcbiAqXG4gKiBUaGUgQWxmcmVzY28gRXhhbXBsZSBDb250ZW50IEFwcGxpY2F0aW9uIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbiAqIGl0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIExlc3NlciBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxuICogdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3JcbiAqIChhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG4gKlxuICogVGhlIEFsZnJlc2NvIEV4YW1wbGUgQ29udGVudCBBcHBsaWNhdGlvbiBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuICogYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2ZcbiAqIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbiAqIEdOVSBMZXNzZXIgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuICpcbiAqIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBMZXNzZXIgR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogYWxvbmcgd2l0aCBBbGZyZXNjby4gSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuICovXG5cbmV4cG9ydCAqIGZyb20gJy4vYWN0aW9ucy9hcHAuYWN0aW9ucyc7XG5leHBvcnQgKiBmcm9tICcuL2FjdGlvbnMvbGlicmFyeS5hY3Rpb25zJztcbmV4cG9ydCAqIGZyb20gJy4vYWN0aW9ucy9ub2RlLmFjdGlvbnMnO1xuZXhwb3J0ICogZnJvbSAnLi9hY3Rpb25zL3JvdXRlci5hY3Rpb25zJztcbmV4cG9ydCAqIGZyb20gJy4vYWN0aW9ucy9zZWFyY2guYWN0aW9ucyc7XG5leHBvcnQgKiBmcm9tICcuL2FjdGlvbnMvc25hY2tiYXIuYWN0aW9ucyc7XG5leHBvcnQgKiBmcm9tICcuL2FjdGlvbnMvdXBsb2FkLmFjdGlvbnMnO1xuZXhwb3J0ICogZnJvbSAnLi9hY3Rpb25zL3ZpZXdlci5hY3Rpb25zJztcbmV4cG9ydCAqIGZyb20gJy4vYWN0aW9ucy9tZXRhZGF0YS1hc3BlY3QuYWN0aW9ucyc7XG5leHBvcnQgKiBmcm9tICcuL2FjdGlvbnMvdGVtcGxhdGUuYWN0aW9ucyc7XG5leHBvcnQgKiBmcm9tICcuL2FjdGlvbnMvY29udGV4dG1lbnUuYWN0aW9ucyc7XG5cbmV4cG9ydCAqIGZyb20gJy4vZWZmZWN0cy9kaWFsb2cuZWZmZWN0cyc7XG5leHBvcnQgKiBmcm9tICcuL2VmZmVjdHMvcm91dGVyLmVmZmVjdHMnO1xuZXhwb3J0ICogZnJvbSAnLi9lZmZlY3RzL3NuYWNrYmFyLmVmZmVjdHMnO1xuXG5leHBvcnQgKiBmcm9tICcuL21vZGVscy9kZWxldGUtc3RhdHVzLm1vZGVsJztcbmV4cG9ydCAqIGZyb20gJy4vbW9kZWxzL2RlbGV0ZWQtbm9kZS1pbmZvLm1vZGVsJztcbmV4cG9ydCAqIGZyb20gJy4vbW9kZWxzL25vZGUtaW5mby5tb2RlbCc7XG5leHBvcnQgKiBmcm9tICcuL21vZGVscy9zZWFyY2gtb3B0aW9uLm1vZGVsJztcblxuZXhwb3J0ICogZnJvbSAnLi9zZWxlY3RvcnMvYXBwLnNlbGVjdG9ycyc7XG5cbmV4cG9ydCAqIGZyb20gJy4vc3RhdGVzL2FwcC5zdGF0ZSc7XG5cbmV4cG9ydCAqIGZyb20gJy4vc3RvcmUubW9kdWxlJztcbiJdfQ==
