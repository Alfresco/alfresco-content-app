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

import { RepoClient, NodeContentTree } from './repo-client/repo-client';
import { PersonEntry, NodeEntry } from '@alfresco/js-api';
import { PersonModel } from './repo-client/apis/people/people-api-models';

import { SitesApi } from './repo-client/apis/sites/sites-api';
import { UploadApi } from './repo-client/apis/upload/upload-api';
import { NodesApi } from './repo-client/apis/nodes/nodes-api';
import { FavoritesApi } from './repo-client/apis/favorites/favorites-api';
import { SearchApi } from './repo-client/apis/search/search-api';

export class AdminActions {
  private adminApi: RepoClient;

  constructor() {
    this.adminApi = new RepoClient();
  }

  sites: SitesApi = new SitesApi();
  upload: UploadApi = new UploadApi();
  nodes: NodesApi = new NodesApi();
  favorites: FavoritesApi = new FavoritesApi();
  search: SearchApi = new SearchApi();

  async getDataDictionaryId(): Promise<string> {
    return await this.adminApi.nodes.getNodeIdFromParent('Data Dictionary', '-root-');
  }

  async getNodeTemplatesFolderId(): Promise<string> {
    return await this.adminApi.nodes.getNodeIdFromParent('Node Templates', await this.getDataDictionaryId());
  }

  async getSpaceTemplatesFolderId(): Promise<string> {
    return await this.adminApi.nodes.getNodeIdFromParent('Space Templates', await this.getDataDictionaryId());
  }

  async createUser(user: PersonModel): Promise<PersonEntry> {
    return await this.adminApi.people.createUser(user);
  }

  async createNodeTemplate(name: string, title: string = '', description: string = '', author: string = ''): Promise<NodeEntry> {
    const templatesRootFolderId: string = await this.getNodeTemplatesFolderId();

    return await this.adminApi.nodes.createFile(name, templatesRootFolderId, title, description, author);
  }

  async createNodeTemplatesHierarchy(hierarchy: NodeContentTree): Promise<any> {
    return await this.adminApi.nodes.createContent(hierarchy, `Data Dictionary/Node Templates`);
  }

  async createSpaceTemplate(name: string, title: string = '', description: string = ''): Promise<NodeEntry> {
    const templatesRootFolderId: string = await this.getSpaceTemplatesFolderId();

    return await this.adminApi.nodes.createFolder(name, templatesRootFolderId, title, description);
  }

  async createSpaceTemplatesHierarchy(hierarchy: NodeContentTree): Promise<any> {
    return await this.adminApi.nodes.createContent(hierarchy, `Data Dictionary/Space Templates`);
  }

  async removeUserAccessOnNodeTemplate(nodeName: string): Promise<NodeEntry> {
    const templatesRootFolderId = await this.getNodeTemplatesFolderId();
    const nodeId: string = await this.adminApi.nodes.getNodeIdFromParent(nodeName, templatesRootFolderId);

    return await this.adminApi.nodes.setInheritPermissions(nodeId, false);
  }

  async removeUserAccessOnSpaceTemplate(nodeName: string): Promise<NodeEntry> {
    const templatesRootFolderId = await this.getSpaceTemplatesFolderId();
    const nodeId: string = await this.adminApi.nodes.getNodeIdFromParent(nodeName, templatesRootFolderId);

    return await this.adminApi.nodes.setInheritPermissions(nodeId, false);
  }

  async cleanupNodeTemplatesFolder(): Promise<void> {
    return await this.adminApi.nodes.deleteNodeChildren(await this.getNodeTemplatesFolderId());
  }

  async cleanupSpaceTemplatesFolder(): Promise<void> {
    const spaceTemplatesNodeId = await this.getSpaceTemplatesFolderId();

    // folder links are deleted automatically when original folder is deleted
    // Software Engineering Project is the default folder template coming from ACS, should not be deleted
    const nodesToDelete = (await this.adminApi.nodes.getNodeChildren(spaceTemplatesNodeId)).list.entries
      .filter(node => (node.entry.nodeType !== 'app:folderlink') && (node.entry.name !== 'Software Engineering Project'))
      .map(node => node.entry.id);
    return await this.adminApi.nodes.deleteNodesById(nodesToDelete);
  }

  async createLinkToFileId(originalFileId: string, destinationParentId: string): Promise<NodeEntry> {
    return await this.adminApi.nodes.createFileLink(originalFileId, destinationParentId);
  }

  async createLinkToFileName(originalFileName: string, originalFileParentId: string, destinationParentId?: string): Promise<NodeEntry> {
    if (!destinationParentId) {
      destinationParentId = originalFileParentId
    };

    const nodeId = await this.adminApi.nodes.getNodeIdFromParent(originalFileName, originalFileParentId);

    return await this.createLinkToFileId(nodeId, destinationParentId);
  }

  async createLinkToFolderId(originalFolderId: string, destinationParentId: string): Promise<NodeEntry> {
    return await this.adminApi.nodes.createFolderLink(originalFolderId, destinationParentId);
  }

  async createLinkToFolderName(originalFolderName: string, originalFolderParentId: string, destinationParentId?: string): Promise<NodeEntry> {
    if (!destinationParentId) {
      destinationParentId = originalFolderParentId
    };

    const nodeId = await this.adminApi.nodes.getNodeIdFromParent(originalFolderName, originalFolderParentId);

    return await this.createLinkToFolderId(nodeId, destinationParentId);
  }

}
