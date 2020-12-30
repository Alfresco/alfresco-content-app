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

import { ApiService, Logger } from '@alfresco/adf-testing';
import {
  Comment,
  CommentsApi,
  TrashcanApi,
  SharedlinksApi,
  PersonEntry,
  NodeEntry,
  NodesApi as JsNodesApi,
  SitesApi as JsSitesApi,
  PeopleApi
} from '@alfresco/js-api';
import { browser } from 'protractor';
import { Utils } from './utils';
import {
  FavoritesApi,
  NodeContentTree,
  SearchApi,
  SharedLinksApi,
  UploadApi,
  SitesApi,
  NodesApi
} from './repo-client/apis';

export class ApiActions {
  protected readonly apiService: ApiService;

  readonly commentsApi: CommentsApi;
  readonly nodesApi: JsNodesApi;
  readonly trashcanApi: TrashcanApi;
  readonly sitesApi: JsSitesApi;
  readonly sharedLinksApi: SharedlinksApi;
  readonly sites: SitesApi;
  readonly upload: UploadApi;
  readonly nodes: NodesApi;
  readonly favorites: FavoritesApi;
  readonly search: SearchApi;
  readonly shared: SharedLinksApi;
  readonly peopleApi: PeopleApi;

  constructor(alfrescoApi?: ApiService) {
    this.apiService = alfrescoApi;

    this.commentsApi = new CommentsApi(this.apiService.getInstance());
    this.nodesApi = new JsNodesApi(this.apiService.getInstance());
    this.trashcanApi = new TrashcanApi(this.apiService.getInstance());
    this.sitesApi = new JsSitesApi(this.apiService.getInstance());
    this.sharedLinksApi = new SharedlinksApi(this.apiService.getInstance());
    this.peopleApi = new PeopleApi(this.apiService.getInstance());

    this.sites = new SitesApi(this.apiService);
    this.upload = new UploadApi(this.apiService);
    this.nodes = new NodesApi(this.apiService);
    this.favorites = new FavoritesApi(this.apiService);
    this.search = new SearchApi(this.apiService);
    this.shared = new SharedLinksApi(this.apiService);
  }

  async createComment(nodeId: string, content: string): Promise<Comment | null> {
    try {
      const comment = await this.commentsApi.createComment(nodeId, { content });
      return comment?.entry;
    } catch (error) {
      this.handleError('User Actions - createComment failed : ', error);
      return null;
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
        await this.nodes.deleteNodeById(nodeId, permanent );
      }
    } catch (error) {
      this.handleError('User Actions - deleteNodes failed : ', error);
    }
  }

  /**
   * Empties the trashcan. Uses multiple batches 1000 nodes each.
   */
  async emptyTrashcan(): Promise<any> {
    try {
      const nodes = await this.trashcanApi.listDeletedNodes({
        maxItems: 1000
      });

      if (nodes?.list?.entries && nodes?.list?.entries?.length > 0) {
        const ids = nodes.list.entries.map((entries) => entries.entry.id);

        for (const nodeId of ids) {
          await this.trashcanApi.deleteDeletedNode(nodeId);
        }

        await this.emptyTrashcan();
      }
    } catch (error) {
      this.handleError('User Actions - emptyTrashcan failed : ', error);
    }
  }

  /**
   * Returns the amount of deleted nodes in the trashcan.
   * TODO: limited to 1000 items only, needs improvements.
   */
  async getTrashcanSize(): Promise<number> {
    try {
      const response = await this.trashcanApi.listDeletedNodes({
        maxItems: 1000
      });

      return response?.list?.pagination?.totalItems || 0;
    } catch (error) {
      this.handleError('User Actions - getTrashcanSize failed : ', error);
      return -1;
    }
  }

  /**
   * Performs multiple calls to retrieve the size of the trashcan until the expectedSize is reached.
   * Used with eventual consistency calls.
   * @param expectedSize Size of the trashcan to wait for.
   */
  async waitForTrashcanSize(expectedSize: number): Promise<number> {
    try {
      return Utils.retryCall(async () => {
        const totalItems = await this.getTrashcanSize();

        if (totalItems !== expectedSize) {
          return Promise.reject(totalItems);
        } else {
          return Promise.resolve(totalItems);
        }
      });
    } catch (error) {
      this.handleError('User Actions - waitForTrashcanSize failed : ', error);
      return -1;
    }
  }

  /**
   * Unlock multiple nodes.
   * @param nodeIds The list of node IDs to unlock.
   */
  async unlockNodes(nodeIds: string[]): Promise<any> {
    try {
      for (const nodeId of nodeIds) {
        await this.nodesApi.unlockNode(nodeId);
      }
    } catch (error) {
      this.handleError('User Actions - unlockNodes failed : ', error);
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
          await this.sitesApi.deleteSite(siteId, permanent);
        }
      }
    } catch (error) {
      this.handleError('User Actions - deleteSites failed : ', error);
    }
  }

  /**
   * Creates shared links for the given nodes.
   * @param nodeIds The list of node IDs to share.
   * @param expiresAt (optional) Expiration date.
   */
  async shareNodes(nodeIds: string[], expiresAt?: Date): Promise<any> {
    try {
      for (const nodeId of nodeIds) {
        await this.sharedLinksApi.createSharedLink({
          nodeId,
          expiresAt
        });
      }
    } catch (error) {
      this.handleError('User Actions - shareNodes failed : ', error);
    }
  }

  async getDataDictionaryId(): Promise<string> {
    try {
      return this.nodes.getNodeIdFromParent('Data Dictionary', '-root-');
    } catch (error) {
      this.handleError('Admin Actions - getDataDictionaryId failed : ', error);
      return '';
    }
  }

  async getNodeTemplatesFolderId(): Promise<string> {
    try {
      return this.nodes.getNodeIdFromParent('Node Templates', await this.getDataDictionaryId());
    } catch (error) {
      this.handleError('Admin Actions - getNodeTemplatesFolderId failed : ', error);
      return '';
    }
  }

  async getSpaceTemplatesFolderId(): Promise<string> {
    try {
      return this.nodes.getNodeIdFromParent('Space Templates', await this.getDataDictionaryId());
    } catch (error) {
      this.handleError('Admin Actions - getSpaceTemplatesFolderId failed : ', error);
      return '';
    }
  }

  async disableUser(username: string): Promise<PersonEntry> {
    try {
      return this.peopleApi.updatePerson(username, { enabled: false });
    } catch (error) {
      this.handleError('Admin Actions - createUser failed : ', error);
      return null;
    }
  }

  async changePassword(username: string, newPassword: string): Promise<PersonEntry> {
    try {
      return this.peopleApi.updatePerson(username, { password: newPassword });
    } catch (error) {
      this.handleError('Admin Actions - changePassword failed : ', error);
      return null;
    }
  }

  async createNodeTemplate(name: string, title: string = '', description: string = '', author: string = ''): Promise<NodeEntry> {
    try {
      const templatesRootFolderId: string = await this.getNodeTemplatesFolderId();

      return this.nodes.createFile(name, templatesRootFolderId, title, description, author);
    } catch (error) {
      this.handleError('Admin Actions - createNodeTemplate failed : ', error);
      return null;
    }
  }

  async createNodeTemplatesHierarchy(hierarchy: NodeContentTree): Promise<any> {
    try {
      return this.nodes.createContent(hierarchy, `Data Dictionary/Node Templates`);
    } catch (error) {
      this.handleError('Admin Actions - createNodeTemplatesHierarchy failed : ', error);
    }
  }

  async createSpaceTemplate(name: string, title: string = '', description: string = ''): Promise<NodeEntry> {
    try {
      const templatesRootFolderId: string = await this.getSpaceTemplatesFolderId();

      return this.nodes.createFolder(name, templatesRootFolderId, title, description);
    } catch (error) {
      this.handleError('Admin Actions - createSpaceTemplate failed : ', error);
      return null;
    }
  }

  async createSpaceTemplatesHierarchy(hierarchy: NodeContentTree): Promise<any> {
    try {
      return this.nodes.createContent(hierarchy, `Data Dictionary/Space Templates`);
    } catch (error) {
      this.handleError('Admin Actions - createSpaceTemplatesHierarchy failed : ', error);
    }
  }

  async removeUserAccessOnNodeTemplate(nodeName: string): Promise<NodeEntry> {
    try {
      const templatesRootFolderId = await this.getNodeTemplatesFolderId();
      const nodeId: string = await this.nodes.getNodeIdFromParent(nodeName, templatesRootFolderId);

      return this.nodes.setInheritPermissions(nodeId, false);
    } catch (error) {
      this.handleError('Admin Actions - removeUserAccessOnNodeTemplate failed : ', error);
      return null;
    }
  }

  async removeUserAccessOnSpaceTemplate(nodeName: string): Promise<NodeEntry> {
    try {
      const templatesRootFolderId = await this.getSpaceTemplatesFolderId();
      const nodeId: string = await this.nodes.getNodeIdFromParent(nodeName, templatesRootFolderId);

      return this.nodes.setInheritPermissions(nodeId, false);
    } catch (error) {
      this.handleError('Admin Actions - removeUserAccessOnSpaceTemplate failed : ', error);
      return null;
    }
  }

  async cleanupNodeTemplatesFolder(): Promise<void> {
    try {
      return this.nodes.deleteNodeChildren(await this.getNodeTemplatesFolderId());
    } catch (error) {
      this.handleError('Admin Actions - cleanupNodeTemplatesFolder failed : ', error);
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
      this.handleError('Admin Actions - cleanupNodeTemplatesItems failed : ', error);
    }
  }

  async cleanupSpaceTemplatesFolder(): Promise<void> {
    try {
      const spaceTemplatesNodeId = await this.getSpaceTemplatesFolderId();

      // folder links are deleted automatically when original folder is deleted
      // Software Engineering Project is the default folder template coming from ACS, should not be deleted
      const nodesToDelete = (await this.nodes.getNodeChildren(spaceTemplatesNodeId)).list.entries
        .filter((node) => node.entry.nodeType !== 'app:folderlink' && node.entry.name !== 'Software Engineering Project')
        .map((node) => node.entry.id);
      return this.nodes.deleteNodesById(nodesToDelete);
    } catch (error) {
      this.handleError('Admin Actions - cleanupSpaceTemplatesFolder failed : ', error);
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
      this.handleError('Admin Actions - cleanupSpaceTemplatesFolder failed : ', error);
    }
  }

  async createLinkToFileId(originalFileId: string, destinationParentId: string): Promise<NodeEntry> {
    try {
      return this.nodes.createFileLink(originalFileId, destinationParentId);
    } catch (error) {
      this.handleError('Admin Actions - createLinkToFileId failed : ', error);
      return null;
    }
  }

  async createLinkToFileName(originalFileName: string, originalFileParentId: string, destinationParentId?: string): Promise<NodeEntry> {
    if (!destinationParentId) {
      destinationParentId = originalFileParentId;
    }

    try {
      const nodeId = await this.nodes.getNodeIdFromParent(originalFileName, originalFileParentId);

      return this.createLinkToFileId(nodeId, destinationParentId);
    } catch (error) {
      this.handleError('Admin Actions - createLinkToFileName failed : ', error);
      return null;
    }
  }

  async createLinkToFolderId(originalFolderId: string, destinationParentId: string): Promise<NodeEntry> {
    try {
      return this.nodes.createFolderLink(originalFolderId, destinationParentId);
    } catch (error) {
      this.handleError('Admin Actions - createLinkToFolderId failed : ', error);
      return null;
    }
  }

  async createLinkToFolderName(originalFolderName: string, originalFolderParentId: string, destinationParentId?: string): Promise<NodeEntry> {
    if (!destinationParentId) {
      destinationParentId = originalFolderParentId;
    }

    try {
      const nodeId = await this.nodes.getNodeIdFromParent(originalFolderName, originalFolderParentId);

      return this.createLinkToFolderId(nodeId, destinationParentId);
    } catch (error) {
      this.handleError('Admin Actions - createLinkToFolderName failed : ', error);
      return null;
    }
  }

  protected handleError(message: string, response: any) {
    Logger.error(`\n--- ${message} error :`);
    Logger.error('\t>>> username: ', this.apiService.getInstance().username);
    Logger.error('\t>>> JSON: ', JSON.stringify(browser.params.config));
    if (response.status && response.response) {
      try {
        Logger.error('\t>>> Status: ', response.status);
        Logger.error('\t>>> Text: ', response.response.text);
        Logger.error('\t>>> Method: ', response.response.error.method);
        Logger.error('\t>>> Path: ', response.response.error.path);
      } catch {
        Logger.error('\t>>> ', response);
      }
    } else Logger.error('\t>>> ', response);
  }
}
