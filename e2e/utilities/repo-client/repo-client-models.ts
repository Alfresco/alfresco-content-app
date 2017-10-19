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

import {
    ADMIN_USERNAME,
    ADMIN_PASSWORD,
    REPO_API_HOST,
    REPO_API_TENANT
} from '../../configs';

export class RepoClientAuth {
    static DEFAULT_USERNAME: string = ADMIN_USERNAME;
    static DEFAULT_PASSWORD: string = ADMIN_PASSWORD;

    constructor(
        public username: string = RepoClientAuth.DEFAULT_USERNAME,
        public password: string = RepoClientAuth.DEFAULT_PASSWORD
    ) {}
}

export class RepoClientConfig {
    host?: string = REPO_API_HOST;
    tenant?: string = REPO_API_TENANT;
}
