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
import { CommentsApi as AdfCommentsApi } from '@alfresco/js-api';

export class CommentsApi extends RepoApi {
  commentsApi = new AdfCommentsApi(this.alfrescoJsApi);

  constructor(username?, password?) {
    super(username, password);
  }

  async getNodeComments(nodeId: string) {
    try {
      await this.apiAuth();
      return await this.commentsApi.listComments(nodeId);
    } catch (error) {
      this.handleError(`${this.constructor.name} ${this.getNodeComments.name}`, error);
      return null;
    }
  }

  async addComment(nodeId: string, comment: string) {
    try {
      await this.apiAuth();
      return await this.commentsApi.createComment(nodeId, { "content": comment });
    } catch (error) {
      this.handleError(`${this.constructor.name} ${this.addComment.name}`, error);
      return null;
    }
  }

  async addComments(nodeId: string, comment: any) {
    try {
      await this.apiAuth();
      return await this.commentsApi.createComment(nodeId, comment);
    } catch (error) {
      this.handleError(`${this.constructor.name} ${this.addComments.name}`, error);
      return null;
    }
  }
}
