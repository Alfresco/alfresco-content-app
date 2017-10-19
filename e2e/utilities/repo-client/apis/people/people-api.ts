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

import { RepoApi } from '../repo-api';
import { Person } from './people-api-models';

export class PeopleApi extends RepoApi {
    getUser(username: string) {
        return this
            .get(`/people/${username}`)
            .catch(this.handleError);
    }

    updateUser(username: string, details?: Person): Promise<any> {
        if (details.id) {
            delete details.id;
        }

        return this
            .put(`/people/${username}`, { data: details })
            .catch(this.handleError);
    }

    createUser(username: string, password: string, details?: Person): Promise<any> {
        const person: Person = new Person(username, password, details);
        const onSuccess = (response) => response;
        const onError = (response) => {
            return (response.statusCode === 409)
                ? Promise.resolve(this.updateUser(username, person))
                : Promise.reject(response);
        };

        return this
            .post(`/people`, { data: person })
            .then(onSuccess, onError)
            .catch(this.handleError);
    }
}
