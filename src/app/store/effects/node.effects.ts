/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2018 Alfresco Software Limited
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
import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppStore } from '../states/app.state';
import {
    PurgeDeletedNodesAction,
    PURGE_DELETED_NODES,
    DeleteNodesAction,
    DELETE_NODES,
    UndoDeleteNodesAction,
    UNDO_DELETE_NODES,
    CreateFolderAction,
    CREATE_FOLDER
} from '../actions';
import { ContentManagementService } from '../../services/content-management.service';
import { currentFolder, appSelection } from '../selectors/app.selectors';
import { EditFolderAction, EDIT_FOLDER, RestoreDeletedNodesAction, RESTORE_DELETED_NODES } from '../actions/node.actions';

@Injectable()
export class NodeEffects {
    constructor(
        private store: Store<AppStore>,
        private actions$: Actions,
        private contentManagementService: ContentManagementService
    ) {}

    @Effect({ dispatch: false })
    purgeDeletedNodes$ = this.actions$.pipe(
        ofType<PurgeDeletedNodesAction>(PURGE_DELETED_NODES),
        map(action => {
            if (action && action.payload && action.payload.length > 0) {
                this.contentManagementService.purgeDeletedNodes(action.payload);
            } else {
                this.store
                    .select(appSelection)
                    .take(1)
                    .subscribe(selection => {
                        if (selection && selection.count > 0) {
                            this.contentManagementService.purgeDeletedNodes(selection.nodes);
                        }
                    });
            }
        })
    );

    @Effect({ dispatch: false })
    restoreDeletedNodes$ = this.actions$.pipe(
        ofType<RestoreDeletedNodesAction>(RESTORE_DELETED_NODES),
        map(action => {
            if (action && action.payload && action.payload.length > 0) {
                this.contentManagementService.restoreDeletedNodes(action.payload);
            } else {
                this.store
                    .select(appSelection)
                    .take(1)
                    .subscribe(selection => {
                        if (selection && selection.count > 0) {
                            this.contentManagementService.restoreDeletedNodes(selection.nodes);
                        }
                    });
            }
        })
    );

    @Effect({ dispatch: false })
    deleteNodes$ = this.actions$.pipe(
        ofType<DeleteNodesAction>(DELETE_NODES),
        map(action => {
            if (action && action.payload && action.payload.length > 0) {
                this.contentManagementService.deleteNodes(action.payload);
            } else {
                this.store
                    .select(appSelection)
                    .take(1)
                    .subscribe(selection => {
                        if (selection && selection.count > 0) {
                            this.contentManagementService.deleteNodes(selection.nodes);
                        }
                    });
            }
        })
    );

    @Effect({ dispatch: false })
    undoDeleteNodes$ = this.actions$.pipe(
        ofType<UndoDeleteNodesAction>(UNDO_DELETE_NODES),
        map(action => {
            if (action.payload.length > 0) {
                this.contentManagementService.undoDeleteNodes(action.payload);
            }
        })
    );

    @Effect({ dispatch: false })
    createFolder$ = this.actions$.pipe(
        ofType<CreateFolderAction>(CREATE_FOLDER),
        map(action => {
            if (action.payload) {
                this.contentManagementService.createFolder(action.payload);
            } else {
                this.store
                    .select(currentFolder)
                    .take(1)
                    .subscribe(node => {
                        if (node && node.id) {
                            this.contentManagementService.createFolder(node.id);
                        }
                    });
            }
        })
    );

    @Effect({ dispatch: false })
    editFolder$ = this.actions$.pipe(
        ofType<EditFolderAction>(EDIT_FOLDER),
        map(action => {
            if (action.payload) {
                this.contentManagementService.editFolder(action.payload);
            } else {
                this.store
                    .select(appSelection)
                    .take(1)
                    .subscribe(selection => {
                        if (selection && selection.folder) {
                            this.contentManagementService.editFolder(selection.folder);
                        }
                    });
            }
        })
    );
}
