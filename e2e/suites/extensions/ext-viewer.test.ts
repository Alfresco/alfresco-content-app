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

import { LoginPage, LogoutPage, BrowsingPage } from '../../pages/pages';
import { Viewer } from './../../components/components';
import { RepoClient } from '../../utilities/repo-client/repo-client';
import { SIDEBAR_LABELS, EXTENSIBILITY_CONFIGS, FILES } from '../../configs';
import { Utils } from '../../utilities/utils';

describe('Extensions - Viewer', () => {
    const username = `user-${Utils.random()}`;

    const pdfFile = {
        file_name: FILES.pdfFile,
        component: 'app.components.tabs.metadata'
    };
    let pdfFileId;

    const docxFile = {
        file_name: FILES.docxFile,
        component: 'app.components.tabs.comments'
    };
    let docxFileId;

    const apis = {
        admin: new RepoClient(),
        user: new RepoClient(username, username)
    };

    const loginPage = new LoginPage();
    const logoutPage = new LogoutPage();
    const page = new BrowsingPage();

    const viewer = new Viewer();

    beforeAll(async (done) => {
        await apis.admin.people.createUser({ username });
        pdfFileId = (await apis.user.upload.uploadFile(pdfFile.file_name)).entry.id;
        docxFileId = (await apis.user.upload.uploadFile(docxFile.file_name)).entry.id;

        await loginPage.load();
        await Utils.setSessionStorageFromConfig('"aca.extension.config"', EXTENSIBILITY_CONFIGS.VIEWER);
        await loginPage.loginWith(username);
        done();
    });

    afterAll(async (done) => {
        await Promise.all([
            apis.user.nodes.deleteNodesById([ pdfFileId, docxFileId ]),
            logoutPage.load()
        ]);
        done();
    });

    beforeEach(async (done) => {
        await page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.PERSONAL_FILES);
        await page.dataTable.waitForHeader();
        done();
    });

    it('Insert new component in a content viewer - [C284659]', async () => {
        await page.dataTable.doubleClickOnRowByName(pdfFile.file_name);
        expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not opened');
        expect(await viewer.isCustomContentPresent()).toBe(true, 'Custom content is not present');
        expect(await viewer.getComponentIdOfView()).toEqual(pdfFile.component);
        await viewer.clickClose();

        await page.dataTable.doubleClickOnRowByName(docxFile.file_name);
        expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not opened');
        expect(await viewer.isCustomContentPresent()).toBe(true, 'Custom content is not present');
        expect(await viewer.getComponentIdOfView()).toEqual(docxFile.component);
    });

});
