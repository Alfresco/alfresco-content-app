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

import { Actions, ofType, createEffect } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { map, take } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import {
  AppStore,
  NodeActionTypes,
  PurgeDeletedNodesAction,
  DeleteNodesAction,
  UndoDeleteNodesAction,
  CreateFolderAction,
  EditFolderAction,
  RestoreDeletedNodesAction,
  ShareNodeAction,
  ManageVersionsAction,
  UnlockWriteAction,
  UnshareNodesAction,
  CopyNodesAction,
  MoveNodesAction,
  ManagePermissionsAction,
  PrintFileAction,
  getCurrentFolder,
  getAppSelection,
  ManageAspectsAction,
  NavigateRouteAction,
  ExpandInfoDrawerAction,
  ManageRulesAction,
  ShowLoaderAction
} from '@alfresco/aca-shared/store';
import { ContentManagementService } from '../../services/content-management.service';
import { ViewUtilService } from '@alfresco/adf-core';

@Injectable()
export class NodeEffects {
  constructor(
    private store: Store<AppStore>,
    private actions$: Actions,
    private contentService: ContentManagementService,
    private viewUtils: ViewUtilService
  ) {}

  shareNode$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType<ShareNodeAction>(NodeActionTypes.Share),
        map((action) => {
          if (action.payload) {
            this.contentService.shareNode(action.payload);
          } else {
            this.store
              .select(getAppSelection)
              .pipe(take(1))
              .subscribe((selection) => {
                if (selection && selection.file) {
                  this.contentService.shareNode(selection.file);
                }
              });
          }
        })
      ),
    { dispatch: false }
  );

  unshareNodes$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType<UnshareNodesAction>(NodeActionTypes.Unshare),
        map((action) => {
          if (action && action.payload && action.payload.length > 0) {
            this.contentService.unshareNodes(action.payload);
          } else {
            this.store
              .select(getAppSelection)
              .pipe(take(1))
              .subscribe((selection) => {
                if (selection && !selection.isEmpty) {
                  this.contentService.unshareNodes(selection.nodes);
                }
              });
          }
        })
      ),
    { dispatch: false }
  );

  purgeDeletedNodes$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType<PurgeDeletedNodesAction>(NodeActionTypes.PurgeDeleted),
        map((action) => {
          if (action && action.payload && action.payload.length > 0) {
            this.contentService.purgeDeletedNodes(action.payload);
          } else {
            this.store
              .select(getAppSelection)
              .pipe(take(1))
              .subscribe((selection) => {
                if (selection && selection.count > 0) {
                  this.contentService.purgeDeletedNodes(selection.nodes);
                }
              });
          }
        })
      ),
    { dispatch: false }
  );

  restoreDeletedNodes$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType<RestoreDeletedNodesAction>(NodeActionTypes.RestoreDeleted),
        map((action) => {
          if (action && action.payload && action.payload.length > 0) {
            this.contentService.restoreDeletedNodes(action.payload);
          } else {
            this.store
              .select(getAppSelection)
              .pipe(take(1))
              .subscribe((selection) => {
                if (selection && selection.count > 0) {
                  this.contentService.restoreDeletedNodes(selection.nodes);
                }
              });
          }
        })
      ),
    { dispatch: false }
  );

  deleteNodes$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType<DeleteNodesAction>(NodeActionTypes.Delete),
        map((action) => {
          this.store.dispatch(new ShowLoaderAction(true));
          if (action && action.payload && action.payload.length > 0) {
            this.contentService.deleteNodes(action.payload);
          } else {
            this.store
              .select(getAppSelection)
              .pipe(take(1))
              .subscribe((selection) => {
                if (selection && selection.count > 0) {
                  this.contentService.deleteNodes(selection.nodes);
                }
              });
          }
        })
      ),
    { dispatch: false }
  );

  undoDeleteNodes$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType<UndoDeleteNodesAction>(NodeActionTypes.UndoDelete),
        map((action) => {
          if (action.payload.length > 0) {
            this.contentService.undoDeleteNodes(action.payload);
          }
        })
      ),
    { dispatch: false }
  );

  createFolder$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType<CreateFolderAction>(NodeActionTypes.CreateFolder),
        map((action) => {
          if (action.payload) {
            this.contentService.createFolder(action.payload);
          } else {
            this.store
              .select(getCurrentFolder)
              .pipe(take(1))
              .subscribe((node) => {
                if (node && node.id) {
                  this.contentService.createFolder(node.id);
                }
              });
          }
        })
      ),
    { dispatch: false }
  );

  editFolder$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType<EditFolderAction>(NodeActionTypes.EditFolder),
        map((action) => {
          if (action.payload) {
            this.contentService.editFolder(action.payload);
          } else {
            this.store
              .select(getAppSelection)
              .pipe(take(1))
              .subscribe((selection) => {
                if (selection && selection.folder) {
                  this.contentService.editFolder(selection.folder);
                }
              });
          }
        })
      ),
    { dispatch: false }
  );

  copyNodes$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType<CopyNodesAction>(NodeActionTypes.Copy),
        map((action) => {
          if (action.payload && action.payload.length > 0) {
            this.contentService.copyNodes(action.payload);
          } else {
            this.store
              .select(getAppSelection)
              .pipe(take(1))
              .subscribe((selection) => {
                if (selection && !selection.isEmpty) {
                  this.contentService.copyNodes(selection.nodes);
                }
              });
          }
        })
      ),
    { dispatch: false }
  );

  moveNodes$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType<MoveNodesAction>(NodeActionTypes.Move),
        map((action) => {
          if (action.payload && action.payload.length > 0) {
            this.contentService.moveNodes(action.payload);
          } else {
            this.store
              .select(getAppSelection)
              .pipe(take(1))
              .subscribe((selection) => {
                if (selection && !selection.isEmpty) {
                  this.contentService.moveNodes(selection.nodes);
                }
              });
          }
        })
      ),
    { dispatch: false }
  );

  managePermissions$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType<ManagePermissionsAction>(NodeActionTypes.ManagePermissions),
        map((action) => {
          if (action && action.payload) {
            const route = 'personal-files/details';
            this.store.dispatch(new NavigateRouteAction([route, action.payload.entry.id, 'permissions']));
          } else {
            this.store
              .select(getAppSelection)
              .pipe(take(1))
              .subscribe((selection) => {
                if (selection && !selection.isEmpty) {
                  const route = 'personal-files/details';
                  this.store.dispatch(new NavigateRouteAction([route, selection.first.entry.id, 'permissions']));
                }
              });
          }
        })
      ),
    { dispatch: false }
  );

  expandInfoDrawer$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType<ExpandInfoDrawerAction>(NodeActionTypes.ExpandInfoDrawer),
        map((action) => {
          if (action && action.payload) {
            const route = 'personal-files/details';
            this.store.dispatch(new NavigateRouteAction([route, action.payload.entry.id]));
          } else {
            this.store
              .select(getAppSelection)
              .pipe(take(1))
              .subscribe((selection) => {
                if (selection && !selection.isEmpty) {
                  const route = 'personal-files/details';
                  this.store.dispatch(new NavigateRouteAction([route, selection.first.entry.id]));
                }
              });
          }
        })
      ),
    { dispatch: false }
  );

  manageVersions$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType<ManageVersionsAction>(NodeActionTypes.ManageVersions),
        map((action) => {
          if (action && action.payload) {
            this.contentService.manageVersions(action.payload);
          } else {
            this.store
              .select(getAppSelection)
              .pipe(take(1))
              .subscribe((selection) => {
                if (selection && selection.file) {
                  this.contentService.manageVersions(selection.file);
                }
              });
          }
        })
      ),
    { dispatch: false }
  );

  printFile$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType<PrintFileAction>(NodeActionTypes.PrintFile),
        map((action) => {
          if (action && action.payload) {
            this.printFile(action.payload);
          } else {
            this.store
              .select(getAppSelection)
              .pipe(take(1))
              .subscribe((selection) => {
                if (selection && selection.file) {
                  this.printFile(selection.file);
                }
              });
          }
        })
      ),
    { dispatch: false }
  );

  unlockWrite$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType<UnlockWriteAction>(NodeActionTypes.UnlockForWriting),
        map((action) => {
          if (action && action.payload) {
            this.contentService.unlockNode(action.payload);
          } else {
            this.store
              .select(getAppSelection)
              .pipe(take(1))
              .subscribe((selection) => {
                if (selection && selection.file) {
                  this.contentService.unlockNode(selection.file);
                }
              });
          }
        })
      ),
    { dispatch: false }
  );

  aspectList$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType<ManageAspectsAction>(NodeActionTypes.ChangeAspects),
        map((action) => {
          if (action && action.payload) {
            this.contentService.manageAspects(action.payload);
          } else {
            this.store
              .select(getAppSelection)
              .pipe(take(1))
              .subscribe((selection) => {
                if (selection && !selection.isEmpty) {
                  this.contentService.manageAspects(selection.nodes[0]);
                }
              });
          }
        })
      ),
    { dispatch: false }
  );

  printFile(node: any) {
    if (node && node.entry) {
      // shared and favorite
      const id = node.entry.nodeId || node.entry.guid || node.entry.id;
      const mimeType = node.entry.content.mimeType;

      if (id) {
        this.viewUtils.printFileGeneric(id, mimeType);
      }
    }
  }

  manageRules$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType<ManageRulesAction>(NodeActionTypes.ManageRules),
        map((action) => {
          if (action && action.payload) {
            this.store.dispatch(new NavigateRouteAction(['nodes', action.payload.entry.id, 'rules']));
          } else {
            this.store
              .select(getAppSelection)
              .pipe(take(1))
              .subscribe((selection) => {
                if (selection && !selection.isEmpty) {
                  this.store.dispatch(new NavigateRouteAction(['nodes', selection.first.entry.id, 'rules']));
                }
              });
          }
        })
      ),
    { dispatch: false }
  );
}
