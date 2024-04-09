/*!
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * Alfresco Example Content Application
 *
 * This file is part of the Alfresco Example Content Application.
 * If the software was purchased under a paid Alfresco license, the terms of
 * the paid license agreement will prevail. Otherwise, the software is
 * provided under the following open source license terms:
 *
 * The Alfresco Example Content Application is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * The Alfresco Example Content Application is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with Alfresco. If not, see <http://www.gnu.org/licenses/>.
 */

import { RepoApi } from '../repo-api';
import { SiteBodyCreate, SiteMembershipBodyUpdate, SiteMembershipBodyCreate, SiteEntry, SitesApi as AdfSiteApi } from '@alfresco/js-api';
import { SITE_VISIBILITY } from '../../../../configs';
import { Utils } from '../../../utils';

export class SitesApi extends RepoApi {
  sitesApi = new AdfSiteApi(this.alfrescoJsApi);

  constructor(username?: string, password?: string) {
    super(username, password);
  }

  async getSite(siteId: string) {
    try {
      await this.apiAuth();
      return await this.sitesApi.getSite(siteId);
    } catch (error) {
      this.handleError(`SitesApi getSite : catch : `, error);
      return null;
    }
  }

  async getDocLibId(siteId: string): Promise<string> {
    try {
      await this.apiAuth();
      return (await this.sitesApi.listSiteContainers(siteId)).list.entries[0].entry.id;
    } catch (error) {
      this.handleError(`SitesApi getDocLibId : catch : `, error);
      return null;
    }
  }

  async createSite(title: string, visibility?: string, description?: string, siteId?: string): Promise<SiteEntry | null> {
    const site = {
      title,
      visibility: visibility || SITE_VISIBILITY.PUBLIC,
      description: description,
      id: siteId || title
    } as SiteBodyCreate;

    try {
      await this.apiAuth();
      return await this.sitesApi.createSite(site);
    } catch (error) {
      this.handleError(`SitesApi createSite : catch : `, error);
      return null;
    }
  }

  async deleteSite(siteId: string, permanent: boolean = true) {
    try {
      await this.apiAuth();
      return await this.sitesApi.deleteSite(siteId, { permanent });
    } catch (error) {
      this.handleError(`SitesApi deleteSite : catch : `, error);
    }
  }

  async deleteSites(siteIds: string[], permanent: boolean = true) {
    try {
      if (siteIds && siteIds.length > 0) {
        await this.apiAuth();

        for (const siteId of siteIds) {
          await this.sitesApi.deleteSite(siteId, { permanent });
        }
      }
    } catch (error) {
      this.handleError(`SitesApi deleteSites : catch : `, error);
    }
  }

  async updateSiteMember(siteId: string, userId: string, role: string) {
    const siteRole = {
      role: role
    } as SiteMembershipBodyUpdate;

    try {
      await this.apiAuth();
      return await this.sitesApi.updateSiteMembership(siteId, userId, siteRole);
    } catch (error) {
      this.handleError(`SitesApi updateSiteMember : catch : `, error);
      return null;
    }
  }

  async addSiteMember(siteId: string, userId: string, role: string) {
    const memberBody = {
      id: userId,
      role: role
    } as SiteMembershipBodyCreate;

    try {
      await this.apiAuth();
      return await this.sitesApi.createSiteMembership(siteId, memberBody);
    } catch (error) {
      if (error.status === 409) {
        return this.updateSiteMember(siteId, userId, role);
      } else {
        this.handleError(`SitesApi addSiteMember : catch : `, error);
        return null;
      }
    }
  }

  async waitForSitesToBeCreated(sitesIds: string[]) {
    try {
      const site = async () => {
        await this.apiAuth();
        const sites = await this.sitesApi.listSiteMembershipsForPerson(this.username);
        const sitesList = sites.list.entries.map((link) => link.entry.id);
        const foundItems = sitesIds.every((id) => sitesList.includes(id));
        if (foundItems) {
          return Promise.resolve(foundItems);
        } else {
          return Promise.reject(foundItems);
        }
      };

      return await Utils.retryCall(site);
    } catch (error) {
      console.error(`SitesApi waitForSitesToBeCreated :  catch : ${error}`);
      console.error(`\tWait timeout reached waiting for sites to be created`);
    }
  }
}
