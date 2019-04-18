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

import { Effect, Actions, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { map, take } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import {
  AppStore,
  NodeActionTypes,
  ViewerActionTypes,
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
  FullscreenViewerAction,
  getCurrentFolder,
  getAppSelection
} from '@alfresco/aca-shared/store';
import { ContentManagementService } from '../../services/content-management.service';

@Injectable()
export class NodeEffects {
  constructor(
    private store: Store<AppStore>,
    private actions$: Actions,
    private contentService: ContentManagementService
  ) {}

  @Effect({ dispatch: false })
  shareNode$ = this.actions$.pipe(
    ofType<ShareNodeAction>(NodeActionTypes.Share),
    map(action => {
      if (action.payload) {
        this.contentService.shareNode(action.payload);
      } else {
        this.store
          .select(getAppSelection)
          .pipe(take(1))
          .subscribe(selection => {
            if (selection && selection.file) {
              this.contentService.shareNode(selection.file);
            }
          });
      }
    })
  );

  @Effect({ dispatch: false })
  unshareNodes$ = this.actions$.pipe(
    ofType<UnshareNodesAction>(NodeActionTypes.Unshare),
    map(action => {
      if (action && action.payload && action.payload.length > 0) {
        this.contentService.unshareNodes(action.payload);
      } else {
        this.store
          .select(getAppSelection)
          .pipe(take(1))
          .subscribe(selection => {
            if (selection && !selection.isEmpty) {
              this.contentService.unshareNodes(selection.nodes);
            }
          });
      }
    })
  );

  @Effect({ dispatch: false })
  purgeDeletedNodes$ = this.actions$.pipe(
    ofType<PurgeDeletedNodesAction>(NodeActionTypes.PurgeDeleted),
    map(action => {
      if (action && action.payload && action.payload.length > 0) {
        this.contentService.purgeDeletedNodes(action.payload);
      } else {
        this.store
          .select(getAppSelection)
          .pipe(take(1))
          .subscribe(selection => {
            if (selection && selection.count > 0) {
              this.contentService.purgeDeletedNodes(selection.nodes);
            }
          });
      }
    })
  );

  @Effect({ dispatch: false })
  restoreDeletedNodes$ = this.actions$.pipe(
    ofType<RestoreDeletedNodesAction>(NodeActionTypes.RestoreDeleted),
    map(action => {
      if (action && action.payload && action.payload.length > 0) {
        this.contentService.restoreDeletedNodes(action.payload);
      } else {
        this.store
          .select(getAppSelection)
          .pipe(take(1))
          .subscribe(selection => {
            if (selection && selection.count > 0) {
              this.contentService.restoreDeletedNodes(selection.nodes);
            }
          });
      }
    })
  );

  @Effect({ dispatch: false })
  deleteNodes$ = this.actions$.pipe(
    ofType<DeleteNodesAction>(NodeActionTypes.Delete),
    map(action => {
      if (action && action.payload && action.payload.length > 0) {
        this.contentService.deleteNodes(action.payload);
      } else {
        this.store
          .select(getAppSelection)
          .pipe(take(1))
          .subscribe(selection => {
            if (selection && selection.count > 0) {
              this.contentService.deleteNodes(selection.nodes);
            }
          });
      }
    })
  );

  @Effect({ dispatch: false })
  undoDeleteNodes$ = this.actions$.pipe(
    ofType<UndoDeleteNodesAction>(NodeActionTypes.UndoDelete),
    map(action => {
      if (action.payload.length > 0) {
        this.contentService.undoDeleteNodes(action.payload);
      }
    })
  );

  @Effect({ dispatch: false })
  createFolder$ = this.actions$.pipe(
    ofType<CreateFolderAction>(NodeActionTypes.CreateFolder),
    map(action => {
      if (action.payload) {
        this.contentService.createFolder(action.payload);
      } else {
        this.store
          .select(getCurrentFolder)
          .pipe(take(1))
          .subscribe(node => {
            if (node && node.id) {
              this.contentService.createFolder(node.id);
            }
          });
      }
    })
  );

  @Effect({ dispatch: false })
  editFolder$ = this.actions$.pipe(
    ofType<EditFolderAction>(NodeActionTypes.EditFolder),
    map(action => {
      if (action.payload) {
        this.contentService.editFolder(action.payload);
      } else {
        this.store
          .select(getAppSelection)
          .pipe(take(1))
          .subscribe(selection => {
            if (selection && selection.folder) {
              this.contentService.editFolder(selection.folder);
            }
          });
      }
    })
  );

  @Effect({ dispatch: false })
  copyNodes$ = this.actions$.pipe(
    ofType<CopyNodesAction>(NodeActionTypes.Copy),
    map(action => {
      if (action.payload && action.payload.length > 0) {
        this.contentService.copyNodes(action.payload);
      } else {
        this.store
          .select(getAppSelection)
          .pipe(take(1))
          .subscribe(selection => {
            if (selection && !selection.isEmpty) {
              this.contentService.copyNodes(selection.nodes);
            }
          });
      }
    })
  );

  @Effect({ dispatch: false })
  moveNodes$ = this.actions$.pipe(
    ofType<MoveNodesAction>(NodeActionTypes.Move),
    map(action => {
      if (action.payload && action.payload.length > 0) {
        this.contentService.moveNodes(action.payload);
      } else {
        this.store
          .select(getAppSelection)
          .pipe(take(1))
          .subscribe(selection => {
            if (selection && !selection.isEmpty) {
              this.contentService.moveNodes(selection.nodes);
            }
          });
      }
    })
  );

  @Effect({ dispatch: false })
  managePermissions$ = this.actions$.pipe(
    ofType<ManagePermissionsAction>(NodeActionTypes.ManagePermissions),
    map(action => {
      if (action && action.payload) {
        this.contentService.managePermissions(action.payload);
      } else {
        this.store
          .select(getAppSelection)
          .pipe(take(1))
          .subscribe(selection => {
            if (selection && !selection.isEmpty) {
              this.contentService.managePermissions(selection.first);
            }
          });
      }
    })
  );

  @Effect({ dispatch: false })
  manageVersions$ = this.actions$.pipe(
    ofType<ManageVersionsAction>(NodeActionTypes.ManageVersions),
    map(action => {
      if (action && action.payload) {
        this.contentService.manageVersions(action.payload);
      } else {
        this.store
          .select(getAppSelection)
          .pipe(take(1))
          .subscribe(selection => {
            if (selection && selection.file) {
              this.contentService.manageVersions(selection.file);
            }
          });
      }
    })
  );

  @Effect({ dispatch: false })
  printFile$ = this.actions$.pipe(
    ofType<PrintFileAction>(NodeActionTypes.PrintFile),
    map(action => {
      if (action && action.payload) {
        this.contentService.printFile(action.payload);
      } else {
        this.store
          .select(getAppSelection)
          .pipe(take(1))
          .subscribe(selection => {
            if (selection && selection.file) {
              this.contentService.printFile(selection.file);
            }
          });
      }
    })
  );

  @Effect({ dispatch: false })
  fullscreenViewer$ = this.actions$.pipe(
    ofType<FullscreenViewerAction>(ViewerActionTypes.FullScreen),
    map(() => {
      this.contentService.fullscreenViewer();
    })
  );

  @Effect({ dispatch: false })
  unlockWrite$ = this.actions$.pipe(
    ofType<UnlockWriteAction>(NodeActionTypes.UnlockForWriting),
    map(action => {
      if (action && action.payload) {
        this.contentService.unlockNode(action.payload);
      } else {
        this.store
          .select(getAppSelection)
          .pipe(take(1))
          .subscribe(selection => {
            if (selection && selection.file) {
              this.contentService.unlockNode(selection.file);
            }
          });
      }
    })
  );
}
