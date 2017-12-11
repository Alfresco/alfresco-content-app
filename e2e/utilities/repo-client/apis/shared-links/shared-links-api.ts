/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2017 Alfresco Software Limited
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
import { NodesApi } from '../nodes/nodes-api';
import { RepoClient } from './../../repo-client';

export class SharedLinksApi extends RepoApi {

    shareFileById(id: string): Promise<any> {
        const data = [{ nodeId: id }];

        return this.post(`/shared-links`, { data })
            .catch(this.handleError);
    }

    shareFilesByIds(ids: string[]): Promise<any[]> {
        return ids.reduce((previous, current) => (
            previous.then(() => this.shareFileById(current))
        ), Promise.resolve());
    }

    getSharedLinks(): Promise<any> {
        return this.get(`/shared-links`)
            .catch(this.handleError);
    }

}
