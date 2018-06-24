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

import { Injectable } from '@angular/core';
import { AlfrescoApiService, UserPreferencesService } from '@alfresco/adf-core';
import { Observable } from 'rxjs/Observable';
import { MinimalNodeEntity, NodePaging, Node } from 'alfresco-js-api';

@Injectable()
export class ContentApiService {
    constructor(
        private api: AlfrescoApiService,
        private preferences: UserPreferencesService
    ) {}

    private get nodesApi() {
        return this.api.nodesApi;
    }

    /**
     * Moves a node to the trashcan.
     * @param nodeId ID of the target node
     * @param options Optional parameters supported by JS-API
     * @returns Empty result that notifies when the deletion is complete
     */
    deleteNode(
        nodeId: string,
        options: { permanent?: boolean } = {}
    ): Observable<void> {
        return Observable.fromPromise(
            this.nodesApi.deleteNode(nodeId, options)
        );
    }

    /**
     * Gets the stored information about a node.
     * @param nodeId ID of the target node
     * @param options Optional parameters supported by JS-API
     * @returns Node information
     */
    getNode(nodeId: string, options: any = {}): Observable<MinimalNodeEntity> {
        const defaults = {
            include: [
                'path',
                'properties',
                'allowableOperations',
                'permissions'
            ]
        };
        const queryOptions = Object.assign(defaults, options);

        return Observable.fromPromise(
            this.nodesApi.getNode(nodeId, queryOptions)
        );
    }

    getNodeInfo(nodeId: string, options: any = {}): Observable<Node> {
        return Observable.fromPromise(
            this.nodesApi.getNodeInfo(nodeId, options)
        );
    }

    /**
     * Gets the items contained in a folder node.
     * @param nodeId ID of the target node
     * @param options Optional parameters supported by JS-API
     * @returns List of child items from the folder
     */
    getNodeChildren(nodeId: string, options: any = {}): Observable<NodePaging> {
        const defaults = {
            maxItems: this.preferences.paginationSize,
            skipCount: 0,
            include: [
                'isLocked',
                'path',
                'properties',
                'allowableOperations',
                'permissions'
            ]
        };
        const queryOptions = Object.assign(defaults, options);

        return Observable.fromPromise(
            this.nodesApi.getNodeChildren(nodeId, queryOptions)
        );
    }
}
