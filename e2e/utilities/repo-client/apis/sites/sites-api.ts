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
import { SiteBody, SiteMemberRoleBody, SiteMemberBody, SiteEntry, SiteMembershipRequestEntry, SitesApi as AdfSiteApi } from '@alfresco/js-api';
import { SITE_VISIBILITY } from '../../../../configs';
import { Utils } from '../../../../utilities/utils';

export class SitesApi extends RepoApi {
  sitesApi = new AdfSiteApi(this.alfrescoJsApi);

  constructor(username?, password?) {
    super(username, password);
  }

  async getSite(siteId: string) {
    try {
      await this.apiAuth();
      return await this.sitesApi.getSite(siteId);
    } catch (error) {
      this.handleError(`${this.constructor.name} ${this.getSite.name}`, error);
      return null;
    }
  }

  async getSites() {
    try {
      await this.apiAuth();
      return await this.sitesApi.listSiteMembershipsForPerson(this.getUsername());
    } catch (error) {
      this.handleError(`${this.constructor.name} ${this.getSites.name}`, error);
      return null;
    }
  }

  async getDocLibId(siteId: string) {
    try {
      await this.apiAuth();
      return (await this.sitesApi.listSiteContainers(siteId)).list.entries[0].entry.id;
    } catch (error) {
      this.handleError(`${this.constructor.name} ${this.getDocLibId.name}`, error);
      return null;
    }
  }

  async getVisibility(siteId: string) {
    try {
      const site = await this.getSite(siteId);
      return site.entry.visibility;
    } catch (error) {
      this.handleError(`${this.constructor.name} ${this.getVisibility.name}`, error);
      return null;
    }
  }

  async getDescription(siteId: string) {
    try {
      const site = await this.getSite(siteId);
      return site.entry.description;
    } catch (error) {
      this.handleError(`${this.constructor.name} ${this.getDescription.name}`, error);
      return null;
    }
  }

  async getTitle(siteId: string) {
    try {
      const site = await this.getSite(siteId);
      return site.entry.title;
    } catch (error) {
      this.handleError(`${this.constructor.name} ${this.getTitle.name}`, error);
      return null;
    }
  }

  async createSite(title: string, visibility?: string, description?: string, siteId?: string): Promise<SiteEntry|null> {
    const site = <SiteBody>{
        title,
        visibility: visibility || SITE_VISIBILITY.PUBLIC,
        description: description,
        id: siteId || title
    };

    try {
      await this.apiAuth();
      return await this.sitesApi.createSite(site);
    } catch (error) {
      this.handleError(`${this.constructor.name} ${this.createSite.name}`, error);
      return null;
    }
  }

  async createSites(titles: string[], visibility?: string) {
    try {
      return titles.reduce(async (previous: any, current: any) => {
        await previous;
        return await this.createSite(current, visibility);
      }, Promise.resolve());
    } catch (error) {
      this.handleError(`${this.constructor.name} ${this.createSites.name}`, error);
    }
  }

  async deleteSite(siteId: string, permanent: boolean = true) {
    try {
      await this.apiAuth();
      return await this.sitesApi.deleteSite(siteId, { permanent });
    } catch (error) {
      this.handleError(`${this.constructor.name} ${this.deleteSite.name}`, error);
    }
  }

  async deleteSites(siteIds: string[], permanent: boolean = true) {
    try {
      return siteIds.reduce(async (previous, current) => {
        await previous;
        return await this.deleteSite(current, permanent);
      }, Promise.resolve());
    } catch (error) {
      this.handleError(`${this.constructor.name} ${this.deleteSites.name}`, error);
    }
  }

  async deleteAllUserSites(permanent: boolean = true) {
    try {
      const siteIds = (await this.getSites()).list.entries.map(entries => entries.entry.id);

      return await siteIds.reduce(async (previous, current) => {
        await previous;
        return await this.deleteSite(current, permanent);
      }, Promise.resolve());
    } catch (error) {
      this.handleError(`${this.constructor.name} ${this.deleteAllUserSites.name}`, error);
    }
  }

  async updateSiteMember(siteId: string, userId: string, role: string) {
    const siteRole = <SiteMemberRoleBody>{
        role: role
    };

    try {
      await this.apiAuth();
      return await this.sitesApi.updateSiteMembership(siteId, userId, siteRole);
    } catch (error) {
      this.handleError(`${this.constructor.name} ${this.updateSiteMember.name}`, error);
      return null;
    }
  }

  async addSiteMember(siteId: string, userId: string, role: string) {
    const memberBody = <SiteMemberBody>{
        id: userId,
        role: role
    };

    try {
      await this.apiAuth();
      return await this.sitesApi.createSiteMembership(siteId, memberBody);
    } catch (error) {
      this.handleError(`${this.constructor.name} ${this.addSiteMember.name}`, error);
      return null;
    }
  }

  async deleteSiteMember(siteId: string, userId: string) {
    try {
      await this.apiAuth();
      return await this.sitesApi.deleteSiteMembership(siteId, userId);
    } catch (error) {
      this.handleError(`${this.constructor.name} ${this.deleteSiteMember.name}`, error);
    }
  }

  async requestToJoin(siteId: string): Promise<SiteMembershipRequestEntry|null> {
    const body = {
      id: siteId
    };

    try {
      await this.apiAuth();
      return await this.sitesApi.createSiteMembershipRequestForPerson('-me-', body);
    } catch (error) {
      this.handleError(`${this.constructor.name} ${this.requestToJoin.name}`, error);
      return null;
    };
  }

  async hasMembershipRequest(siteId: string) {
    try {
      await this.apiAuth();
      const requests = (await this.sitesApi.getSiteMembershipRequests('-me-')).list.entries.map(e => e.entry.id);
      return requests.includes(siteId);
    } catch (error) {
      this.handleError(`${this.constructor.name} ${this.hasMembershipRequest.name}`, error);
      return null;
    }
  }

  async waitForApi(data: { expect: number }) {
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
      console.log(`${this.constructor.name} ${this.waitForApi.name} catch: `);
      console.log(`\tExpected: ${data.expect} items, but found ${error}`);
    }
  }
}
