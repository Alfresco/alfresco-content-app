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
import { Utils } from '../../../../utilities/utils';
import { TrashcanApi as AdfTrashcanApi} from '@alfresco/js-api';

export class TrashcanApi extends RepoApi {
  trashcanApi = new AdfTrashcanApi(this.alfrescoJsApi);

  constructor(username?, password?) {
    super(username, password);
  }

  async permanentlyDelete(id: string) {
    try {
      await this.apiAuth();
      return await this.trashcanApi.deleteDeletedNode(id);
    } catch (error) {
      this.handleError(`${this.constructor.name} ${this.permanentlyDelete.name}`, error);
    }
  }

  async restore(id: string) {
    try {
      await this.apiAuth();
      return await this.trashcanApi.restoreDeletedNode(id);
    } catch (error) {
      this.handleError(`${this.constructor.name} ${this.restore.name}`, error);
      return null;
    }
  }

  async getDeletedNodes() {
    const opts = {
        maxItems: 1000
    };
    try {
      await this.apiAuth();
      return await this.trashcanApi.listDeletedNodes(opts);
    } catch (error) {
      this.handleError(`${this.constructor.name} ${this.getDeletedNodes.name}`, error);
      return null;
    }
  }

  async emptyTrash() {
    try {
      const ids = (await this.getDeletedNodes()).list.entries.map(entries => entries.entry.id);

      return await ids.reduce(async (previous, current) => {
          await previous;
          return await this.permanentlyDelete(current);
      }, Promise.resolve());
    } catch (error) {
      this.handleError(`${this.constructor.name} ${this.emptyTrash.name}`, error);
    }
  }

  async waitForApi(data: { expect: number }) {
    try {
      const deletedFiles = async () => {
        const totalItems = (await this.getDeletedNodes()).list.pagination.totalItems;
        if ( totalItems !== data.expect) {
            return Promise.reject(totalItems);
        } else {
            return Promise.resolve(totalItems);
        }
      };

      return await Utils.retryCall(deletedFiles);
    } catch (error) {
      console.log(`${this.constructor.name} ${this.waitForApi.name} catch: `);
      console.log(`\tExpected: ${data.expect} items, but found ${error}`);
    }
  }
}
