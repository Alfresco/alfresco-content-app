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

import { RepoClientAuth } from './repo-client-models';

import { PeopleApi } from './apis/people/people-api';
import { NodesApi } from './apis/nodes/nodes-api';
import { CommentsApi } from './apis/comments/comments-api';
import { SitesApi } from './apis/sites/sites-api';
import { FavoritesApi } from './apis/favorites/favorites-api';
import { QueriesApi } from './apis/queries/queries-api';
import { SharedLinksApi } from './apis/shared-links/shared-links-api';
import { TrashcanApi } from './apis/trashcan/trashcan-api';
import { SearchApi } from './apis/search/search-api';
import { UploadApi } from './apis/upload/upload-api';
import { AuthenticationApi } from './apis/authentication/authentication-api';

export class RepoClient {
    constructor(
        private username: string = RepoClientAuth.DEFAULT_USERNAME,
        private password: string = RepoClientAuth.DEFAULT_PASSWORD
    ) {}

    private get auth() {
        const { username, password } = this;
        return { username, password };
    }

    get people () {
        return new PeopleApi(this.auth.username, this.auth.password);
    }

    get nodes() {
        return new NodesApi(this.auth.username, this.auth.password);
    }

    get comments() {
        return new CommentsApi(this.auth.username, this.auth.password);
    }

    get sites() {
        return new SitesApi(this.auth.username, this.auth.password);
    }

    get favorites() {
        return new FavoritesApi(this.auth.username, this.auth.password);
    }

    get shared() {
        return new SharedLinksApi(this.auth.username, this.auth.password);
    }

    get trashcan() {
        return new TrashcanApi(this.auth.username, this.auth.password);
    }

    get search() {
        return new SearchApi(this.auth.username, this.auth.password);
    }

    get queries() {
        return new QueriesApi(this.auth.username, this.auth.password);
    }

    get upload() {
        return new UploadApi(this.auth.username, this.auth.password);
    }

    get authentication() {
        return new AuthenticationApi(this.auth.username, this.auth.password);
    }
}

export * from './apis/nodes/node-body-create';
export * from './apis/nodes/node-content-tree';
export * from './apis/nodes/nodes-api';
