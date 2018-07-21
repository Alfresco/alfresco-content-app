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

// import { browser, protractor, promise } from 'protractor';
import { LoginPage, LogoutPage, BrowsingPage } from '../../pages/pages';
import { SIDEBAR_LABELS } from '../../configs';
import { RepoClient } from '../../utilities/repo-client/repo-client';
import { Utils } from '../../utilities/utils';

describe('Upload files', () => {
    const username = `user-${Utils.random()}`;

    const folder1 = `folder1-${Utils.random()}`; let folder1Id;

    const apis = {
        admin: new RepoClient(),
        user: new RepoClient(username, username)
    };

    const loginPage = new LoginPage();
    const logoutPage = new LogoutPage();
    const page = new BrowsingPage();
    const { dataTable } = page;

    beforeAll(done => {
        apis.admin.people.createUser(username)
            .then(() => apis.user.nodes.createFolder(folder1).then(resp => folder1Id = resp.data.entry.id))

            .then(() => loginPage.loginWith(username))
            .then(done);
    });

    beforeEach(done => {
        page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.PERSONAL_FILES)
            .then(() => dataTable.waitForHeader())
            .then(done);
    });

    afterAll(done => {
        Promise.all([
            // apis.user.nodes.deleteNodeById(folder1Id),
            logoutPage.load()
        ])
        .then(done);
    });

    it('Upload a file', () => {
        dataTable.doubleClickOnItemNameRow(folder1)
            .then(() => page.sidenav.openNewMenu())
            .then(() => page.sidenav.menu.uploadFile().sendKeys(`${__dirname}/create-folder.test.ts`));
    });
});
