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
import { browser } from 'protractor';
import { AlfrescoApi } from '@alfresco/js-api';
import { RepoClientAuth } from '../repo-client-models';
var RepoApi = /** @class */ (function () {
    function RepoApi(username, password) {
        if (username === void 0) { username = RepoClientAuth.DEFAULT_USERNAME; }
        if (password === void 0) { password = RepoClientAuth.DEFAULT_PASSWORD; }
        this.username = username;
        this.password = password;
        this.alfrescoJsApi = new AlfrescoApi();
        this.alfrescoJsApi.setConfig(browser.params.config);
    }
    RepoApi.prototype.apiAuth = function () {
        return this.alfrescoJsApi.login(this.username, this.password);
    };
    RepoApi.prototype.getUsername = function () {
        return this.username;
    };
    RepoApi.prototype.handleError = function (message, response) {
        console.log("\n--- " + message + " error :");
        if (response.status && response.response) {
            try {
                console.log('\t>>> Status: ', response.status);
                console.log('\t>>> Text: ', response.response.text);
                console.log('\t>>> Method: ', response.response.error.method);
                console.log('\t>>> Path: ', response.response.error.path);
            }
            catch (_a) {
                console.log('\t>>> ', response);
            }
        }
        else
            console.log('\t>>> ', response);
    };
    return RepoApi;
}());
export { RepoApi };
//# sourceMappingURL=repo-api.js.map