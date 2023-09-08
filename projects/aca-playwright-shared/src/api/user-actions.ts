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

import { NodesApi } from './nodes-api';
import { SitesApi } from './sites-api';
import { SharedLinksApi } from './shared-links-api';
import { UploadApi } from './upload-api';
export class UserActions {
  protected nodesApi: NodesApi;
  protected sitesApi: SitesApi;
  protected sharedLinksApi: SharedLinksApi;
  protected uploadApi: UploadApi;

  constructor() {
    this.nodesApi = new NodesApi();
  }

  public async setUpUserAcaBackend(userName: string, password: string): Promise<void> {
    this.nodesApi = await NodesApi.initialize(userName, password);
    this.sitesApi = await SitesApi.initialize(userName, password);
    this.sharedLinksApi = await SharedLinksApi.initialize(userName, password);
    this.uploadApi = await UploadApi.initialize(userName, password);
  }

  async lockNodes(nodeIds: string[], lockType: string = 'ALLOW_OWNER_CHANGES') {
      return this.nodesApi.lockNodes(nodeIds, lockType);
  }

  async uploadFile(fileLocation: string, fileName: string, parentFolderId: string): Promise<any> {
    return this.uploadApi.uploadFile(fileLocation, fileName, parentFolderId);
  }

  /**
   * Delete multiple sites/libraries.
   * @param siteIds The list of the site/library IDs to delete.
   * @param permanent Delete permanently, without moving to the trashcan? (default: true)
   */
  async deleteSites(siteIds: string[], permanent: boolean = true) {
      return this.sitesApi.deleteSites(siteIds,permanent);
  }

  /**
   * Delete multiple nodes.
   * @param nodeIds The list of node IDs to delete.
   * @param permanent Delete permanently, without moving to the trashcan? (default: true)
   */
    async deleteNodes(nodeIds: string[], permanent: boolean = true): Promise<any> {
      return this.nodesApi.deleteNodes(nodeIds, permanent);
    }
}
