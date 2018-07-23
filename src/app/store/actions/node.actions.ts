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

import { Action } from '@ngrx/store';
import { NodeInfo } from '../models';
import { MinimalNodeEntity } from 'alfresco-js-api';

export const SET_SELECTED_NODES = 'SET_SELECTED_NODES';
export const DELETE_NODES = 'DELETE_NODES';
export const UNDO_DELETE_NODES = 'UNDO_DELETE_NODES';
export const RESTORE_DELETED_NODES = 'RESTORE_DELETED_NODES';
export const PURGE_DELETED_NODES = 'PURGE_DELETED_NODES';
export const DOWNLOAD_NODES = 'DOWNLOAD_NODES';
export const CREATE_FOLDER = 'CREATE_FOLDER';
export const EDIT_FOLDER = 'EDIT_FOLDER';

export class SetSelectedNodesAction implements Action {
    readonly type = SET_SELECTED_NODES;
    constructor(public payload: MinimalNodeEntity[] = []) {}
}

export class DeleteNodesAction implements Action {
    readonly type = DELETE_NODES;
    constructor(public payload: NodeInfo[] = []) {}
}

export class UndoDeleteNodesAction implements Action {
    readonly type = UNDO_DELETE_NODES;
    constructor(public payload: any[] = []) {}
}

export class RestoreDeletedNodesAction implements Action {
    readonly type = RESTORE_DELETED_NODES;
    constructor(public payload: Array<MinimalNodeEntity>) {}
}

export class PurgeDeletedNodesAction implements Action {
    readonly type = PURGE_DELETED_NODES;
    constructor(public payload: Array<MinimalNodeEntity>) {}
}

export class DownloadNodesAction implements Action {
    readonly type = DOWNLOAD_NODES;
    constructor(public payload: MinimalNodeEntity[] = []) {}
}

export class CreateFolderAction implements Action {
    readonly type = CREATE_FOLDER;
    constructor(public payload: string) {}
}

export class EditFolderAction implements Action {
    readonly type = EDIT_FOLDER;
    constructor(public payload: MinimalNodeEntity) {}
}
