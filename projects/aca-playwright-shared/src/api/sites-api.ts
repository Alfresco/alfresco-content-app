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
import { SiteBody, SiteEntry } from '@alfresco/js-api';
import { users } from '../base-config/global-variables';
import { logger } from '@alfresco/adf-cli/scripts/logger';
import { SITE_VISIBILITY } from '../utils/configs';

export class SitesApi extends ApiClientFactory {
  private apiService: ApiClientFactory;

  constructor() {
    super();
    this.apiService = new ApiClientFactory();
  }
  static async initialize(userProfile: keyof typeof users): Promise<SitesApi> {
    const classObj = new SitesApi();
    await classObj.apiService.setUpAcaBackend(userProfile);
    return classObj;
  }

  async createSite(title: string, visibility?: string, description?: string, siteId?: string): Promise<SiteEntry | null> {
    const site = {
      title,
      visibility: visibility || SITE_VISIBILITY.PUBLIC,
      description: description,
      id: siteId || title
    } as SiteBody;

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
}
