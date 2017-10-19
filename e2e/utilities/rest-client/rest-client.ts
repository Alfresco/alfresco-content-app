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
