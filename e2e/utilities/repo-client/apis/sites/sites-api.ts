/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2019 Alfresco Software Limited
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
import { SiteBody, SiteMemberRoleBody, SiteMemberBody } from '@alfresco/js-api';
import { SITE_VISIBILITY } from '../../../../configs';
import { Utils } from '../../../../utilities/utils';
import { SitesApi as AdfSiteApi } from '@alfresco/js-api';

export class SitesApi extends RepoApi {
    sitesApi = new AdfSiteApi(this.alfrescoJsApi);

    constructor(username?, password?) {
        super(username, password);
    }

    async getSite(siteId: string) {
        await this.apiAuth();
        return await this.sitesApi.getSite(siteId);
    }

    async getSites() {
        await this.apiAuth();
        return await this.sitesApi.listSiteMembershipsForPerson(this.getUsername());
    }

    async getDocLibId(siteId: string) {
        await this.apiAuth();
        return (await this.sitesApi.listSiteContainers(siteId)).list.entries[0].entry.id;
    }

    async getVisibility(siteId: string) {
        const site = await this.getSite(siteId);
        return site.entry.visibility;
    }

    async getDescription(siteId: string) {
      const site = await this.getSite(siteId);
      return site.entry.description;
    }

    async getTitle(siteId: string) {
      const site = await this.getSite(siteId);
      return site.entry.title;
    }

    async createSite(title: string, visibility?: string, description?: string, siteId?: string) {
        const site = <SiteBody>{
            title,
            visibility: visibility || SITE_VISIBILITY.PUBLIC,
            description: description,
            id: siteId || title
        };

        await this.apiAuth();
        return await this.sitesApi.createSite(site);
    }

   async createSites(titles: string[], visibility?: string) {
        return titles.reduce(async (previous: any, current: any) => {
            await previous;
            return await this.createSite(current, visibility);
        }, Promise.resolve());
    }

    async deleteSite(siteId: string, permanent: boolean = true) {
        await this.apiAuth();
        return await this.sitesApi.deleteSite(siteId, { permanent });
    }

    async deleteSites(siteIds: string[], permanent: boolean = true) {
        return siteIds.reduce(async (previous, current) => {
            await previous;
            return await this.deleteSite(current, permanent);
        }, Promise.resolve());
    }

    async deleteAllUserSites(permanent: boolean = true) {
      const siteIds = (await this.getSites()).list.entries.map(entries => entries.entry.id);

      return await siteIds.reduce(async (previous, current) => {
        await previous;
        return await this.deleteSite(current, permanent);
      }, Promise.resolve());
    }

    async updateSiteMember(siteId: string, userId: string, role: string) {
        const siteRole = <SiteMemberRoleBody>{
            role: role
        };

        await this.apiAuth();
        return await this.sitesApi.updateSiteMembership(siteId, userId, siteRole);
    }

    async addSiteMember(siteId: string, userId: string, role: string) {
        const memberBody = <SiteMemberBody>{
            id: userId,
            role: role
        };

        await this.apiAuth();
        return await this.sitesApi.createSiteMembership(siteId, memberBody);
    }

    async deleteSiteMember(siteId: string, userId: string) {
        await this.apiAuth();
        return await this.sitesApi.deleteSiteMembership(siteId, userId);
    }

    async requestToJoin(siteId: string) {
        const body = {
          id: siteId
        };
        await this.apiAuth();
        try {
          return await this.sitesApi.createSiteMembershipRequestForPerson('-me-', body);
        } catch (error) {
          console.log('====== requestToJoin catch ', error);
        };
    }

    async hasMembershipRequest(siteId: string) {
      await this.apiAuth();
      const requests = (await this.sitesApi.getSiteMembershipRequests('-me-')).list.entries.map(e => e.entry.id);
      return requests.includes(siteId);
    }

    async waitForApi(data) {
        try {
          const sites = async () => {
            const totalItems = (await this.getSites()).list.pagination.totalItems;
            if ( totalItems !== data.expect ) {
                return Promise.reject(totalItems);
            } else {
                return Promise.resolve(totalItems);
            }
        };

        return await Utils.retryCall(sites);
        } catch (error) {
          console.log('-----> catch sites: ', error);
        }
    }
}
