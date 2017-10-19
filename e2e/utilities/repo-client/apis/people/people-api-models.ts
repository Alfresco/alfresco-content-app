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

export class Person {
    id?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    properties?: any;

    constructor(username: string, password: string, details: Person) {
        this.id = username;
        this.password = password || username;
        this.firstName = username;
        this.lastName = username;
        this.email = `${username}@alfresco.com`;

        Object.assign(this, details);
    }
}
