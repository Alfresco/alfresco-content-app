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

import { PersonEntry, NodeEntry, PeopleApi } from '@alfresco/js-api';
import { PersonModel, SitesApi, UploadApi, NodesApi, NodeContentTree, Person, SharedLinksApi } from './repo-client/apis';
import { UserActions } from './user-actions';
import { browser } from 'protractor';

export class AdminActions extends UserActions {
  constructor() {
    super();
  }

  sites: SitesApi = new SitesApi();
  upload: UploadApi = new UploadApi();
  nodes: NodesApi = new NodesApi();
  shared: SharedLinksApi = new SharedLinksApi();

  async login(username?: string, password?: string) {
    return super.login(username || browser.params.ADMIN_USERNAME, password || browser.params.ADMIN_PASSWORD);
  }

  private async getDataDictionaryId(): Promise<string> {
    try {
      return this.nodes.getNodeIdFromParent('Data Dictionary', '-root-');
    } catch (error) {
      super.handleError('Admin Actions - getDataDictionaryId failed : ', error);
      return '';
    }
  }

  async getNodeTemplatesFolderId(): Promise<string> {
    try {
      return this.nodes.getNodeIdFromParent('Node Templates', await this.getDataDictionaryId());
    } catch (error) {
      super.handleError('Admin Actions - getNodeTemplatesFolderId failed : ', error);
      return '';
    }
  }

  async getSpaceTemplatesFolderId(): Promise<string> {
    try {
      return this.nodes.getNodeIdFromParent('Space Templates', await this.getDataDictionaryId());
    } catch (error) {
      super.handleError('Admin Actions - getSpaceTemplatesFolderId failed : ', error);
      return '';
    }
  }

  async createUser(user: PersonModel): Promise<PersonEntry> {
    const person = new Person(user);
    const peopleApi = new PeopleApi(this.alfrescoApi);

    await this.login();
    try {
      return peopleApi.createPerson(person);
    } catch (error) {
      super.handleError('Admin Actions - createUser failed : ', error);
      return null;
    }
  }

  async disableUser(username: string): Promise<PersonEntry> {
    const peopleApi = new PeopleApi(this.alfrescoApi);

    await this.login();
    try {
      return peopleApi.updatePerson(username, { enabled: false });
    } catch (error) {
      super.handleError('Admin Actions - createUser failed : ', error);
      return null;
    }
  }

  async changePassword(username: string, newPassword: string): Promise<PersonEntry> {
    const peopleApi = new PeopleApi(this.alfrescoApi);

    await this.login();
    try {
      return peopleApi.updatePerson(username, { password: newPassword });
    } catch (error) {
      super.handleError('Admin Actions - changePassword failed : ', error);
      return null;
    }
  }

  async createNodeTemplatesHierarchy(hierarchy: NodeContentTree): Promise<any> {
    try {
      return this.nodes.createContent(hierarchy, `Data Dictionary/Node Templates`);
    } catch (error) {
      super.handleError('Admin Actions - createNodeTemplatesHierarchy failed : ', error);
    }
  }

  async createSpaceTemplatesHierarchy(hierarchy: NodeContentTree): Promise<any> {
    try {
      return this.nodes.createContent(hierarchy, `Data Dictionary/Space Templates`);
    } catch (error) {
      super.handleError('Admin Actions - createSpaceTemplatesHierarchy failed : ', error);
    }
  }

  async removeUserAccessOnNodeTemplate(nodeName: string): Promise<NodeEntry> {
    try {
      const templatesRootFolderId = await this.getNodeTemplatesFolderId();
      const nodeId: string = await this.nodes.getNodeIdFromParent(nodeName, templatesRootFolderId);

      return this.nodes.setInheritPermissions(nodeId, false);
    } catch (error) {
      super.handleError('Admin Actions - removeUserAccessOnNodeTemplate failed : ', error);
      return null;
    }
  }

  async removeUserAccessOnSpaceTemplate(nodeName: string): Promise<NodeEntry> {
    try {
      const templatesRootFolderId = await this.getSpaceTemplatesFolderId();
      const nodeId: string = await this.nodes.getNodeIdFromParent(nodeName, templatesRootFolderId);

      return this.nodes.setInheritPermissions(nodeId, false);
    } catch (error) {
      super.handleError('Admin Actions - removeUserAccessOnSpaceTemplate failed : ', error);
      return null;
    }
  }

  async cleanupNodeTemplatesItems(nodeNames: string[]): Promise<void> {
    try {
      const templatesFolderId = await this.getNodeTemplatesFolderId();
      for (const nodeName of nodeNames) {
        const nodeId = await this.nodes.getNodeIdFromParent(nodeName, templatesFolderId);
        await this.nodes.deleteNodeById(nodeId);
      }
    } catch (error) {
      super.handleError('Admin Actions - cleanupNodeTemplatesItems failed : ', error);
    }
  }

  async cleanupSpaceTemplatesItems(nodeNames: string[]): Promise<void> {
    try {
      const spaceTemplatesNodeId = await this.getSpaceTemplatesFolderId();
      for (const nodeName of nodeNames) {
        const nodeId = await this.nodes.getNodeIdFromParent(nodeName, spaceTemplatesNodeId);
        await this.nodes.deleteNodeById(nodeId);
      }
    } catch (error) {
      super.handleError('Admin Actions - cleanupSpaceTemplatesFolder failed : ', error);
    }
  }

  async createLinkToFileName(originalFileName: string, originalFileParentId: string, destinationParentId?: string): Promise<NodeEntry> {
    if (!destinationParentId) {
      destinationParentId = originalFileParentId;
    }

    try {
      const nodeId = await this.nodes.getNodeIdFromParent(originalFileName, originalFileParentId);

      return this.nodes.createFileLink(nodeId, destinationParentId);
    } catch (error) {
      super.handleError('Admin Actions - createLinkToFileName failed : ', error);
      return null;
    }
  }

  async createLinkToFolderName(originalFolderName: string, originalFolderParentId: string, destinationParentId?: string): Promise<NodeEntry> {
    if (!destinationParentId) {
      destinationParentId = originalFolderParentId;
    }

    try {
      const nodeId = await this.nodes.getNodeIdFromParent(originalFolderName, originalFolderParentId);

      return this.nodes.createFolderLink(nodeId, destinationParentId);
    } catch (error) {
      super.handleError('Admin Actions - createLinkToFolderName failed : ', error);
      return null;
    }
  }
}
