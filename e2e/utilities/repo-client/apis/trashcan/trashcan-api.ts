/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2018 Alfresco Software Limited
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

export class TrashcanApi extends RepoApi {

    constructor(username?, password?) {
        super(username, password);
    }

    async permanentlyDelete(id: string) {
        await this.apiAuth();
        return await this.alfrescoJsApi.core.nodesApi.purgeDeletedNode(id);
    }

    async restore(id: string) {
        await this.apiAuth();
        return await this.alfrescoJsApi.core.nodesApi.restoreNode(id);
    }

    async getDeletedNodes() {
        const opts = {
            maxItems: 1000
        };
        await this.apiAuth();
        return await this.alfrescoJsApi.core.nodesApi.getDeletedNodes(opts);
    }

    async emptyTrash() {
        const ids = (await this.getDeletedNodes()).list.entries.map(entries => entries.entry.id);

        return await ids.reduce(async (previous, current) => {
            await previous;
            return await this.permanentlyDelete(current);
        }, Promise.resolve());
    }

    async waitForApi(data) {
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
          console.log('-----> catch trash: ', error);
        }
    }
}
