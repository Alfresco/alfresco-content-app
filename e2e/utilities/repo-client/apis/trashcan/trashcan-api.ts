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
    permanentlyDelete(id: string): Promise<any> {
        return this
            .delete(`/deleted-nodes/${id}`)
            .catch(this.handleError);
    }

    restore(id: string) {
        return this
            .post(`/deleted-nodes/${id}/restore`)
            .catch(this.handleError);
    }

    getDeletedNodes(): Promise<any> {
        return this
            .get(`/deleted-nodes?maxItems=1000`)
            .catch(this.handleError);
    }

    emptyTrash(): Promise<any> {
        return this.getDeletedNodes()
            .then(resp => {
                return resp.data.list.entries.map(entries => entries.entry.id);
            })
            .then(ids => {
                return ids.reduce((previous, current) => (
                    previous.then(() => this.permanentlyDelete(current))
                ), Promise.resolve());
            })
            .catch(this.handleError);
    }

    waitForApi(data) {
        const deletedFiles = () => {
            return this.getDeletedNodes()
                .then(response => response.data.list.pagination.totalItems)
                .then(totalItems => {
                    if ( totalItems === data.expect) {
                        return Promise.resolve(totalItems);
                    } else {
                        return Promise.reject(totalItems);
                    }
                });
        };

        return Utils.retryCall(deletedFiles);
    }
}
