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

    createUser(username: string, password?: string, details?: Person): Promise<any> {
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
