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
import { Node } from 'alfresco-js-api';

export const SET_APP_NAME = 'SET_APP_NAME';
export const SET_HEADER_COLOR = 'SET_HEADER_COLOR';
export const SET_LOGO_PATH = 'SET_LOGO_PATH';
export const SET_LANGUAGE_PICKER = 'SET_LANGUAGE_PICKER';
export const SET_SHARED_URL = 'SET_SHARED_URL';
export const SET_CURRENT_FOLDER = 'SET_CURRENT_FOLDER';
export const SET_CURRENT_URL = 'SET_CURRENT_URL';

export class SetAppNameAction implements Action {
    readonly type = SET_APP_NAME;
    constructor(public payload: string) {}
}

export class SetHeaderColorAction implements Action {
    readonly type = SET_HEADER_COLOR;
    constructor(public payload: string) {}
}

export class SetLogoPathAction implements Action {
    readonly type = SET_LOGO_PATH;
    constructor(public payload: string) {}
}

export class SetLanguagePickerAction implements Action {
    readonly type = SET_LANGUAGE_PICKER;
    constructor(public payload: boolean) {}
}

export class SetSharedUrlAction implements Action {
    readonly type = SET_SHARED_URL;
    constructor(public payload: string) {}
}

export class SetCurrentFolderAction implements Action {
    readonly type = SET_CURRENT_FOLDER;
    constructor(public payload: Node) {}
}

export class SetCurrentUrlAction implements Action {
    readonly type = SET_CURRENT_URL;
    constructor(public payload: string) {}
}
