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

import { Client } from 'node-rest-client';
import { NodeRestClient, RestClientArgs, RestClientResponse } from './rest-client-models';

export * from './rest-client-models';

export class RestClient {
    private static DEFAULT_HEADERS = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    };

    private client: NodeRestClient;

    constructor(user: string, password: string) {
        this.client = <NodeRestClient>(new Client({ user, password }));
    }

    get(uri: string, args: RestClientArgs = {}): Promise<RestClientResponse> {
        return this.promisify('get', uri, args);
    }

    post(uri: string, args: RestClientArgs = {}): Promise<RestClientResponse> {
        return this.promisify('post', uri, args);
    }

    put(uri: string, args: RestClientArgs = {}): Promise<RestClientResponse> {
        return this.promisify('put', uri, args);
    }

    delete(uri: string, args: RestClientArgs = {}): Promise<RestClientResponse> {
        return this.promisify('delete', uri, args);
    }

    private createArgs(args: RestClientArgs = {}): RestClientArgs {
        const data = JSON.stringify(args.data);

        return Object.assign({}, RestClient.DEFAULT_HEADERS, args, { data });
    }

    private promisify(fnName: string, uri: string, args: RestClientArgs): Promise<RestClientResponse> {
        const fn: Function = this.client[fnName];
        const fnArgs = [ encodeURI(uri), this.createArgs(args) ];

        return new Promise((resolve, reject) => {
            const fnCallback = (data, rawResponse) => {
                const {
                    statusCode, statusMessage,
                    req: { method, path }
                } = rawResponse;

                const response: RestClientResponse = {
                    data, statusCode, statusMessage,
                    request: { method, path, data: args.data }
                };

                (response.statusCode >= 400)
                    ? reject(response)
                    : resolve(response);
            };

            fn(...fnArgs, fnCallback);
        });
    }
}
