/*!
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { Logger } from '@alfresco/adf-testing';
import {
  SiteBodyCreate,
  SiteMembershipBodyUpdate,
  SiteMembershipBodyCreate,
  SiteEntry,
  SiteMembershipRequestEntry,
  SitesApi as AdfSiteApi,
  SiteMemberEntry
} from '@alfresco/js-api';
import { SITE_VISIBILITY, SITE_ROLES } from '../../../../configs';
import { Utils } from '../../../../utilities/utils';

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

  async createSites(siteNames: string[], visibility?: string): Promise<SiteEntry[]> {
    const sites: SiteEntry[] = [];
    try {
      if (siteNames && siteNames.length > 0) {
        for (const siteName of siteNames) {
          const site = await this.createSite(siteName, visibility);
          sites.push(site);
        }
      }
    } catch (error) {
      this.handleError(`SitesApi createSites : catch : `, error);
    }
    return sites;
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

  async deleteAllUserSites(permanent: boolean = true) {
    try {
      await this.apiAuth();
      const sites = await this.sitesApi.listSiteMembershipsForPerson(this.username);
      const siteIds = sites.list.entries.map((entries) => entries.entry.id);

      return await siteIds.reduce(async (previous, current) => {
        await previous;
        return this.deleteSite(current, permanent);
      }, Promise.resolve());
    } catch (error) {
      this.handleError(`SitesApi deleteAllUserSites : catch : `, error);
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

  async addSiteConsumer(siteId: string, userId: string): Promise<SiteMemberEntry> {
    return this.addSiteMember(siteId, userId, SITE_ROLES.SITE_CONSUMER.ROLE);
  }

  async addSiteContributor(siteId: string, userId: string): Promise<SiteMemberEntry> {
    return this.addSiteMember(siteId, userId, SITE_ROLES.SITE_CONTRIBUTOR.ROLE);
  }

  async addSiteCollaborator(siteId: string, userId: string): Promise<SiteMemberEntry> {
    return this.addSiteMember(siteId, userId, SITE_ROLES.SITE_COLLABORATOR.ROLE);
  }

  async addSiteManager(siteId: string, userId: string): Promise<SiteMemberEntry> {
    return this.addSiteMember(siteId, userId, SITE_ROLES.SITE_MANAGER.ROLE);
  }

  async deleteSiteMember(siteId: string, userId: string) {
    try {
      await this.apiAuth();
      return await this.sitesApi.deleteSiteMembership(siteId, userId);
    } catch (error) {
      this.handleError(`SitesApi deleteSiteMember : catch : `, error);
    }
  }

  async requestToJoin(siteId: string): Promise<SiteMembershipRequestEntry | null> {
    const body = {
      id: siteId
    };

    try {
      await this.apiAuth();
      return await this.sitesApi.createSiteMembershipRequestForPerson('-me-', body);
    } catch (error) {
      this.handleError(`SitesApi requestToJoin : catch : `, error);
      return null;
    }
  }

  async hasMembershipRequest(siteId: string) {
    try {
      await this.apiAuth();
      const requests = (await this.sitesApi.listSiteMembershipRequestsForPerson('-me-')).list.entries.map((e) => e.entry.id);
      return requests.includes(siteId);
    } catch (error) {
      this.handleError(`SitesApi hasMembershipRequest : catch : `, error);
      return null;
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
      Logger.error(`SitesApi waitForSitesToBeCreated :  catch : ${error}`);
      Logger.error(`\tWait timeout reached waiting for sites to be created`);
    }
  }
}
