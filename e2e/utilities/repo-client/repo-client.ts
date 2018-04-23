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

import { RepoClientAuth, RepoClientConfig } from './repo-client-models';

import { PeopleApi } from './apis/people/people-api';
import { NodesApi } from './apis/nodes/nodes-api';
import { SitesApi } from './apis/sites/sites-api';
import { FavoritesApi } from './apis/favorites/favorites-api';
import { SharedLinksApi } from './apis/shared-links/shared-links-api';
import { TrashcanApi } from './apis/trashcan/trashcan-api';
import { SearchApi } from './apis/search/search-api';

export class RepoClient {
    public people: PeopleApi = new PeopleApi(this.auth, this.config);
    public nodes: NodesApi = new NodesApi(this.auth, this.config);
    public sites: SitesApi = new SitesApi(this.auth, this.config);
    public favorites: FavoritesApi = new FavoritesApi(this.auth, this.config);
    public shared: SharedLinksApi = new SharedLinksApi(this.auth, this.config);
    public trashcan: TrashcanApi = new TrashcanApi(this.auth, this.config);
    public search: SearchApi = new SearchApi(this.auth, this.config);

    constructor(
        private username: string = RepoClientAuth.DEFAULT_USERNAME,
        private password: string = RepoClientAuth.DEFAULT_PASSWORD,
        private config?: RepoClientConfig
    ) {}

    private get auth(): RepoClientAuth {
        const { username, password } = this;
        return { username, password };
    }
}

export * from './apis/nodes/node-body-create';
export * from './apis/nodes/node-content-tree';
export * from './apis/nodes/nodes-api';
