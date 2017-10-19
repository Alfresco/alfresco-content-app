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

import { RestClient, RestClientArgs, RestClientResponse } from '../../rest-client/rest-client';
import { RepoClientAuth, RepoClientConfig } from '../repo-client-models';

export abstract class RepoApi {
    private client: RestClient;
    private defaults: RepoClientConfig = new RepoClientConfig();

    constructor(
        auth: RepoClientAuth = new RepoClientAuth(),
        private config?: RepoClientConfig
    ) {
        const { username, password } = auth;

        this.client = new RestClient(username, password);
    }

    private createEndpointUri(endpoint: string): string {
        const { defaults, config } = this;
        const { host, tenant } = Object.assign(defaults, config);

        return `${host}/alfresco/api/${tenant}/public/alfresco/versions/1${endpoint}`;
    }

    protected handleError(response: RestClientResponse) {
        const { request: { method, path, data }, data: error } = response;

        console.log(`ERROR on ${method}\n${path}\n${data}`);
        console.log(error);
    }

    protected get(endpoint: string, args: RestClientArgs = {}) {
        return this.client.get(this.createEndpointUri(endpoint), args);
    }

    protected post(endpoint: string, args: RestClientArgs = {}) {
        return this.client.post(this.createEndpointUri(endpoint), args);
    }

    protected put(endpoint: string, args: RestClientArgs = {}) {
        return this.client.put(this.createEndpointUri(endpoint), args);
    }

    protected delete(endpoint: string, args: RestClientArgs = {}) {
        return this.client.delete(this.createEndpointUri(endpoint), args);
    }
}
