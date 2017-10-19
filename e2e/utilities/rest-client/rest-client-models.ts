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

interface RequestConfig {
    timeout?: number;
    noDelay?: boolean;
    keepAlive?: boolean;
    keepAliveDelay?: number;
}

interface ResponseConfig {
    timeout?: number;
}

interface ResponseRequest {
    method: string;
    path: string;
    data: string;
}

export interface NodeRestClient {
    get(uri: string, callback: Function): Function;
    post(uri: string, callback: Function): Function;
    put(uri: string, callback: Function): Function;
    delete(uri: string, callback: Function): Function;
}

export interface RestClientArgs {
    data?: any;
    parameters?: any;
    headers?: any;
    requestConfig?: RequestConfig;
    responseConfig?: ResponseConfig;
}

export interface RestClientResponse {
    request: ResponseRequest;
    data: any;
    statusMessage: string;
    statusCode: number;
}
