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

import { users } from '../base-config/global-variables';
import { logger } from '@alfresco/adf-cli/scripts/logger';
import { NodeContentTree} from './node-content-tree';
import { UserActions } from './user-actions';

export class AdminActions extends UserActions {

  constructor() {
    super();
  }

  static async initialize(): Promise<AdminActions> {
    const classObj = new AdminActions();
    await classObj.setUpUserAcaBackend(users.admin.username, users.admin.password);
    return classObj;
  }

  async createSpaceTemplatesHierarchy(hierarchy: NodeContentTree): Promise<any> {
    try {
      return this.nodesApi.createContent(hierarchy, `Data Dictionary/Space Templates`);
    } catch (error) {
      logger.error('Admin Actions - createSpaceTemplatesHierarchy failed : ', error);
    }
  }

  async cleanupSpaceTemplatesItems(nodeNames: string[]): Promise<void> {
    try {
      const spaceTemplatesNodeId = await this.getSpaceTemplatesFolderId();
      for (const nodeName of nodeNames) {
        const nodeId = await this.nodesApi.getNodeIdFromParent(nodeName, spaceTemplatesNodeId);
        await this.nodesApi.deleteNodeById(nodeId);
      }
    } catch (error) {
      logger.error('Admin Actions - cleanupSpaceTemplatesFolder failed : ', error);
    }
  }

  async getSpaceTemplatesFolderId(): Promise<string> {
    try {
      return this.nodesApi.getNodeIdFromParent('Space Templates', await this.getDataDictionaryId());
    } catch (error) {
      logger.error('Admin Actions - getSpaceTemplatesFolderId failed : ', error);
      return '';
    }
  }

  private async getDataDictionaryId(): Promise<string> {
    try {
      return this.nodesApi.getNodeIdFromParent('Data Dictionary', '-root-');
    } catch (error) {
      logger.error('Admin Actions - getDataDictionaryId failed : ', error);
      return '';
    }
  }
}
