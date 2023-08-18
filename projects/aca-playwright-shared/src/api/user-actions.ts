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

import * as fs from 'fs';
import { Logger } from '@alfresco/adf-testing';
import { AlfrescoApi, CommentsApi, NodesApi, TrashcanApi, SitesApi, SharedlinksApi, UploadApi } from '@alfresco/js-api';

const { BASE_URL } = process.env;

const config = {
  authType: 'BASIC',
  hostBpm: BASE_URL,
  hostEcm: BASE_URL,
  provider: 'ECM',
  contextRoot: 'alfresco'
};

export class UserActions {
  public alfrescoApi: AlfrescoApi;

  public commentsApi: CommentsApi;
  public nodesApi: NodesApi;
  public trashCanApi: TrashcanApi;
  public sitesApi: SitesApi;
  public sharedLinksApi: SharedlinksApi;
  public uploadApi: UploadApi;

  protected username: string;
  protected password: string;

  constructor() {
    this.alfrescoApi = new AlfrescoApi(config);
  }

  public async setUpUserAcaBackend(username: string, password: string): Promise<void> {
    await this.loginUser(username, password );

    this.commentsApi = new CommentsApi(this.alfrescoApi);
    this.nodesApi = new NodesApi(this.alfrescoApi);
    this.trashCanApi = new TrashcanApi(this.alfrescoApi);
    this.sitesApi = new SitesApi(this.alfrescoApi);
    this.sharedLinksApi = new SharedlinksApi(this.alfrescoApi);
    this.uploadApi = new UploadApi(this.alfrescoApi);
  }

  public async loginUser(username: string, password: string): Promise<any> {
    this.username = username || this.username;
    this.password = password || this.password;

    try {
      return this.alfrescoApi.login(this.username, this.password);
    } catch (error) {
      Logger.error(`\n [User Actions] - login failed ${error} error :`);
    }
  }

  async lockNodes(nodeIds: string[], lockType: string = 'ALLOW_OWNER_CHANGES') {
    try {
      for (const nodeId of nodeIds) {
        await this.nodesApi.lockNode(nodeId, { type: lockType });
      }
    } catch (error) {
      Logger.error(`\n [User Actions] - lockNodes failed ${error} error :`);
    }
  }

  async uploadFile(fileLocation: string, fileName: string, parentFolderId: string): Promise<any> {
    const file = fs.createReadStream(fileLocation);
    return this.uploadApi.uploadFile(
        file,
        '',
        parentFolderId,
        null,
        {
            name: fileName,
            nodeType: 'cm:content',
            renditions: 'doclib'
        }
    );
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
          await this.sitesApi.deleteSite(siteId, { permanent });
        }
      }
    } catch (error) {
      Logger.error(`\n [User Actions] - deleteSites failed error : ${error}`);
    }
  }

  /**
   * Delete multiple nodes.
   * @param nodeIds The list of node IDs to delete.
   * @param permanent Delete permanently, without moving to the trashcan? (default: true)
   */
    async deleteNodes(nodeIds: string[], permanent: boolean = true): Promise<any> {
      try {
        for (const nodeId of nodeIds) {
          await this.nodesApi.deleteNode(nodeId, { permanent });
        }
      } catch (error) {
        Logger.error(`\n [User Actions] - deleteNodes failed error : ${error}`);
      }
    }
}
