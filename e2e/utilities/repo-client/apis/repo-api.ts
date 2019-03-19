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

import { AlfrescoApi } from '@alfresco/js-api';
import { REPO_API_HOST } from '../../../configs';
import { RepoClientAuth } from '../repo-client-models';

export abstract class RepoApi {
    alfrescoJsApi = new AlfrescoApi();

    constructor(
        private username: string = RepoClientAuth.DEFAULT_USERNAME,
        private password: string = RepoClientAuth.DEFAULT_PASSWORD
    ) {
        this.alfrescoJsApi.setConfig({
            provider: 'ECM',
            hostEcm: REPO_API_HOST
        });
    }

    apiAuth() {
        return this.alfrescoJsApi.login(this.username, this.password);
    }

    getUsername() {
        return this.username;
    }

}
