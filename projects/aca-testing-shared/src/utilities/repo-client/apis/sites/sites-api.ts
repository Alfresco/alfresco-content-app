/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2020 Alfresco Software Limited
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
import { Logger } from '@alfresco/adf-testing';
import { SiteEntry, SiteMembershipRequestEntry, SitesApi as AdfSiteApi, SiteMemberEntry } from '@alfresco/js-api';
import { SITE_ROLES } from '../../../../configs';
import { Utils } from '../../../../utilities/utils';

export type SiteVisibility = 'PUBLIC' | 'MODERATED' | 'PRIVATE';

export class SitesApi extends RepoApi {
  sitesApi = new AdfSiteApi(this.alfrescoJsApi);

  constructor(username?: string, password?: string) {
    super(username, password);
  }

  async getSitesTotalItems(): Promise<number> {
    try {
      await this.apiAuth();
      return (await this.sitesApi.listSiteMembershipsForPerson(this.username)).list.pagination.totalItems;
    } catch (error) {
      this.handleError(`SitesApi getSitesTotalItems : catch : `, error);
      return -1;
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

  async createSite(title: string, visibility: SiteVisibility = 'PUBLIC', description?: string, siteId?: string): Promise<SiteEntry | null> {
    try {
      await this.apiAuth();
      return await this.sitesApi.createSite({
        title,
        visibility,
        description,
        id: siteId || title
      });
    } catch (error) {
      this.handleError(`SitesApi createSite : catch : `, error);
      return null;
    }
  }

  async createSites(titles: string[], visibility?: SiteVisibility): Promise<any> {
    if (titles && titles.length > 0) {
      for (const title of titles) {
        await this.createSite(title, visibility);
      }
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

  async updateSiteMember(siteId: string, userId: string, role: string) {
    try {
      await this.apiAuth();
      return await this.sitesApi.updateSiteMembership(siteId, userId, { role });
    } catch (error) {
      this.handleError(`SitesApi updateSiteMember : catch : `, error);
      return null;
    }
  }

  async addSiteMember(siteId: string, userId: string, role: string) {
    try {
      await this.apiAuth();
      return await this.sitesApi.createSiteMembership(siteId, {
        id: userId,
        role
      });
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
    try {
      await this.apiAuth();
      return await this.sitesApi.createSiteMembershipRequestForPerson('-me-', {
        id: siteId
      });
    } catch (error) {
      this.handleError(`SitesApi requestToJoin : catch : `, error);
      return null;
    }
  }

  async hasMembershipRequest(siteId: string) {
    try {
      await this.apiAuth();
      const requests = (await this.sitesApi.getSiteMembershipRequests('-me-')).list.entries.map((e) => e.entry.id);
      return requests.includes(siteId);
    } catch (error) {
      this.handleError(`SitesApi hasMembershipRequest : catch : `, error);
      return null;
    }
  }

  async waitForApi(data: { expect: number }) {
    try {
      const sites = async () => {
        const totalItems = await this.getSitesTotalItems();
        if (totalItems !== data.expect) {
          return Promise.reject(totalItems);
        } else {
          return Promise.resolve(totalItems);
        }
      };

      return await Utils.retryCall(sites);
    } catch (error) {
      Logger.error(`SitesApi waitForApi : catch : `);
      Logger.error(`\tExpected: ${data.expect} items, but found ${error}`);
    }
  }
}
