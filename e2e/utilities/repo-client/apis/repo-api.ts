/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2017 Alfresco Software Limited
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
