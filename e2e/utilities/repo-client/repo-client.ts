/*!
 * @license
 * Copyright 2017 Alfresco Software, Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { RepoClientAuth, RepoClientConfig } from './repo-client-models';

import { PeopleApi } from './apis/people/people-api';
import { NodesApi } from './apis/nodes/nodes-api';
import { SitesApi } from './apis/sites/sites-api';
import { FavoritesApi } from './apis/favorites/favorites-api';

export class RepoClient {
    public people: PeopleApi = new PeopleApi(this.auth, this.config);
    public nodes: NodesApi = new NodesApi(this.auth, this.config);
    public sites: SitesApi = new SitesApi(this.auth, this.config);
    public favorites: FavoritesApi = new FavoritesApi(this.auth, this.config);
    // public shared: SharedLinksApi = new SharedLinksApi(this.auth, this.config);

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
