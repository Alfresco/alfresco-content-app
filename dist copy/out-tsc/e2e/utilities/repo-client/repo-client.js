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
var RepoClient = /** @class */ (function () {
    function RepoClient(username, password) {
        if (username === void 0) { username = RepoClientAuth.DEFAULT_USERNAME; }
        if (password === void 0) { password = RepoClientAuth.DEFAULT_PASSWORD; }
        this.username = username;
        this.password = password;
    }
    Object.defineProperty(RepoClient.prototype, "auth", {
        get: function () {
            var _a = this, username = _a.username, password = _a.password;
            return { username: username, password: password };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RepoClient.prototype, "people", {
        get: function () {
            return new PeopleApi(this.auth.username, this.auth.password);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RepoClient.prototype, "nodes", {
        get: function () {
            return new NodesApi(this.auth.username, this.auth.password);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RepoClient.prototype, "comments", {
        get: function () {
            return new CommentsApi(this.auth.username, this.auth.password);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RepoClient.prototype, "sites", {
        get: function () {
            return new SitesApi(this.auth.username, this.auth.password);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RepoClient.prototype, "favorites", {
        get: function () {
            return new FavoritesApi(this.auth.username, this.auth.password);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RepoClient.prototype, "shared", {
        get: function () {
            return new SharedLinksApi(this.auth.username, this.auth.password);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RepoClient.prototype, "trashcan", {
        get: function () {
            return new TrashcanApi(this.auth.username, this.auth.password);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RepoClient.prototype, "search", {
        get: function () {
            return new SearchApi(this.auth.username, this.auth.password);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RepoClient.prototype, "queries", {
        get: function () {
            return new QueriesApi(this.auth.username, this.auth.password);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RepoClient.prototype, "upload", {
        get: function () {
            return new UploadApi(this.auth.username, this.auth.password);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RepoClient.prototype, "authentication", {
        get: function () {
            return new AuthenticationApi(this.auth.username, this.auth.password);
        },
        enumerable: true,
        configurable: true
    });
    return RepoClient;
}());
export { RepoClient };
export * from './apis/nodes/node-body-create';
export * from './apis/nodes/node-content-tree';
export * from './apis/nodes/nodes-api';
//# sourceMappingURL=repo-client.js.map