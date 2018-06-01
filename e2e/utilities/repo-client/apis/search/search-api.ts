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

export class SearchApi extends RepoApi {
    apiDefinition = 'search';

    search(data: any[]): Promise<any> {
        return this
            .post(`/search`, { data }, this.apiDefinition)
            .catch(this.handleError);
    }

    queryRecentFiles(username: string): Promise<any> {
        const data = {
            query: {
                query: '*',
                language: 'afts'
            },
            filterQueries: [
                { query: `cm:modified:[NOW/DAY-30DAYS TO NOW/DAY+1DAY]` },
                { query: `cm:modifier:${username} OR cm:creator:${username}` },
                { query: `TYPE:"content" AND -TYPE:"app:filelink" AND -TYPE:"fm:post"` }
            ]
        };

        return this
            .post(`/search`, { data }, this.apiDefinition)
            .catch(this.handleError);
    }

    waitForApi(username, data) {
        const recentFiles = () => {
            return this.queryRecentFiles(username)
                .then(response => response.data.list.pagination.totalItems)
                .then(totalItems => {
                    if ( totalItems === data.expect) {
                        return Promise.resolve(totalItems);
                    } else {
                        return Promise.reject(totalItems);
                    }
                });
        };

        return Utils.retryCall(recentFiles);
    }
}
