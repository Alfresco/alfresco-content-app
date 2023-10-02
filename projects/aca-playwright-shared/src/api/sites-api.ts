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

import { ApiClientFactory } from './api-client-factory';
import { Site, SiteBodyCreate, SiteEntry, SiteMemberEntry, SiteMembershipBodyCreate, SiteMembershipBodyUpdate } from '@alfresco/js-api';
import { logger } from '@alfresco/adf-cli/scripts/logger';

export class SitesApi {
  private apiService: ApiClientFactory;

  constructor() {
    this.apiService = new ApiClientFactory();
  }
  static async initialize(userName: string, password?: string): Promise<SitesApi> {
    const classObj = new SitesApi();
    await classObj.apiService.setUpAcaBackend(userName, password);
    return classObj;
  }

  async createSite(title: string, visibility?: string, description?: string, siteId?: string): Promise<SiteEntry | null> {
    const site = {
      title,
      visibility: visibility || Site.VisibilityEnum.PUBLIC,
      description: description,
      id: siteId || title
    } as SiteBodyCreate;

    try {
      return await this.apiService.sites.createSite(site);
    } catch (error) {
      logger.error(`SitesApi createSite : catch : `, error);
      return null;
    }
  }

  async getDocLibId(siteId: string): Promise<string> {
    try {
      return (await this.apiService.sites.listSiteContainers(siteId)).list.entries[0].entry.id;
    } catch (error) {
      logger.error(`SitesApi getDocLibId : catch : `, error);
      return null;
    }
  }

  /**
   * Delete multiple sites/libraries.
   * @param siteIds The list of the site/library IDs to delete.
   * @param permanent Delete permanently, without moving to the trashcan? (default: true)
   */
  async deleteSites(siteIds: string[], permanent: boolean = true) {
    try {
      if (siteIds && siteIds.length > 0) {
        for (const siteId of siteIds) {
          await this.apiService.sites.deleteSite(siteId, { permanent });
        }
      }
    } catch (error) {
      logger.error(`${this.constructor.name} ${this.deleteSites.name}`, error);
    }
  }

  async updateSiteMember(siteId: string, userId: string, role: string): Promise<SiteMemberEntry> {
    const siteRole = {
      role: role
    } as SiteMembershipBodyUpdate;

    try {
      return await this.apiService.sites.updateSiteMembership(siteId, userId, siteRole);
    } catch (error) {
      logger.error(`SitesApi updateSiteMember : catch : `, error);
      return new SiteMemberEntry;
    }
  }

  async addSiteMember(siteId: string, userId: string, role: string): Promise<SiteMemberEntry> {
    const memberBody = {
      id: userId,
      role: role
    } as SiteMembershipBodyCreate;

    try {
      return await this.apiService.sites.createSiteMembership(siteId, memberBody);
    } catch (error) {
      if (error.status === 409) {
        return this.updateSiteMember(siteId, userId, role);
      } else {
        logger.error(`SitesApi addSiteMember : catch : `, error);
        return new SiteMemberEntry;
      }
    }
  }
}
