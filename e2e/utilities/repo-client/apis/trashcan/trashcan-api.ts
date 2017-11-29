/*!
 * @license
 * Copyright 2017 Alfresco Software, Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { RepoApi } from '../repo-api';

export class TrashcanApi extends RepoApi {
    permanentlyDelete(id: string): Promise<any> {
        return this
            .delete(`/deleted-nodes/${id}`)
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

}
