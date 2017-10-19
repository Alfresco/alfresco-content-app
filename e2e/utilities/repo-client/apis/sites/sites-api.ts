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
import { Site } from './sites-api-models';

export class SitesApi extends RepoApi {
    getSite(id: string) {
        return this
            .get(`/sites/${id}`)
            .catch(this.handleError);
    }

    updateSite(id: string, details?: Site): Promise<any> {
        if (details.id) {
            delete details.id;
        }

        return this
            .put(`/sites/${id}`, { data: details })
            .catch(this.handleError);
    }

    createSite(title: string, visibility: string, details?: Site): Promise<any> {
        const site: Site = new Site(title, visibility, details);
        const onSuccess = (response) => response;
        const onError = (response) => {
            return (response.statusCode === 409)
                ? Promise.resolve(this.updateSite(site.id, site))
                : Promise.reject(response);
        };

        return this
            .post(`/sites`, { data: site })
            .then(onSuccess, onError)
            .catch(this.handleError);
    }

    deleteSite(id: string, permanent: boolean = true): Promise<any> {
        return this
            .delete(`/sites/${id}?permanent=${permanent}`)
            .catch(this.handleError);
    }

    updateSiteMember(siteId: string, userId: string, role: string): Promise<any> {
        return this
            .put(`/sites/${siteId}/members/${userId}`, { data: { role } })
            .catch(this.handleError);
    }

    addSiteMember(siteId: string, userId: string, role: string): Promise<any> {
        const onSuccess = (response) => response;
        const onError = (response) => {
            return (response.statusCode === 409)
                ? Promise.resolve(this.updateSiteMember(siteId, userId, role))
                : Promise.reject(response);
        };

        return this
            .post(`/sites/${siteId}/members`, { data: { role, id: userId } })
            .then(onSuccess, onError)
            .catch(this.handleError);
    }

    deleteSiteMember(siteId: string, userId: string): Promise<any> {
        return this
            .delete(`/sites/${siteId}/members/${userId}`)
            .catch(this.handleError);
    }
}
