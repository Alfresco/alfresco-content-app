/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2018 Alfresco Software Limited
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
import { Site } from './sites-api-models';

export class SitesApi extends RepoApi {
    getSite(id: string): Promise<any> {
        return this
            .get(`/sites/${id}`)
            .catch(this.handleError);
    }

    getSiteContainers(siteId: string): Promise<any> {
        return this
            .get(`/sites/${siteId}/containers`)
            .then(resp => resp.data.list.entries)
            .catch(this.handleError);
    }

    getDocLibId(siteId: string) {
        return this.getSiteContainers(siteId)
            .then(resp => resp[0].entry.id)
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

    createOrUpdateSite(title: string, visibility: string, details?: Site): Promise<any> {
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

    createSite(title: string, visibility: string, details?: Site): Promise<any> {
        const site: Site = new Site(title, visibility, details);
        return this
            .post(`/sites`, { data: site })
            .catch(this.handleError);
    }

    createSites(titles: string[], visibility: string): Promise<any[]> {
        return titles.reduce((previous, current) => (
            previous.then(() => this.createSite(current, visibility))
        ), Promise.resolve());
    }

    deleteSite(id: string, permanent: boolean = true): Promise<any> {
        return this
            .delete(`/sites/${id}?permanent=${permanent}`)
            .catch(this.handleError);
    }

    deleteSites(ids: string[], permanent: boolean = true): Promise<any[]> {
        return ids.reduce((previous, current) => (
            previous.then(() => this.deleteSite(current))
        ), Promise.resolve());
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
