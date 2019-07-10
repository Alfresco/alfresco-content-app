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

import { LoginPage, BrowsingPage } from '../../pages/pages';
import { Viewer } from './../../components/components';
import { RepoClient } from '../../utilities/repo-client/repo-client';
import { EXTENSIBILITY_CONFIGS, FILES } from '../../configs';
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

    const customAction = {
        id: 'app.viewer.my-action',
        title: 'My action',
        icon: 'http'
    };

    const customSecondaryAction = {
        id: 'app.viewer.my-secondary-action',
        title: 'My secondary action',
        icon: 'alarm'
    };

    const downloadButton = {
        id: 'app.viewer.download',
        title: 'My custom title'
    };

    const moveAction = {
        id: 'app.viewer.move',
        title: 'My new title'
    }

    const apis = {
        admin: new RepoClient(),
        user: new RepoClient(username, username)
    };

    const loginPage = new LoginPage();
    const page = new BrowsingPage();

    const viewer = new Viewer();
    const { toolbar } = viewer;

    beforeAll(async (done) => {
        await apis.admin.people.createUser({ username });
        pdfFileId = (await apis.user.upload.uploadFile(pdfFile.file_name)).entry.id;
        docxFileId = (await apis.user.upload.uploadFile(docxFile.file_name)).entry.id;

        await loginPage.load();
        await Utils.setSessionStorageFromConfig(EXTENSIBILITY_CONFIGS.VIEWER);
        await loginPage.loginWith(username);
        done();
    });

    afterAll(async (done) => {
        await apis.user.nodes.deleteNodesById([ pdfFileId, docxFileId ]);
        done();
    });

    beforeEach(async (done) => {
        await page.clickPersonalFilesAndWait();
        done();
    });

    afterEach(async (done) => {
        await Utils.pressEscape();
        done();
    });

    describe('content', () => {
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

    describe('toolbar actions', () => {
        it('Add a new action in the toolbar - [C286416]', async () => {
            await page.dataTable.doubleClickOnRowByName(pdfFile.file_name);
            expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not opened');

            expect(await toolbar.isButtonPresent(customAction.title)).toBe(true, 'Custom action is not present');
            expect(await toolbar.getButtonByTitleAttribute(customAction.title).getAttribute('id')).toEqual(customAction.id);
            expect(await toolbar.getButtonByTitleAttribute(customAction.title).getText()).toEqual(customAction.icon);
        });

        it('Modify title of action from toolbar - [C286417]', async () => {
            await page.dataTable.doubleClickOnRowByName(pdfFile.file_name);
            expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not opened');

            expect(await toolbar.getButtonById(downloadButton.id).getAttribute('title')).toEqual(downloadButton.title);
        });

        it('Remove action from toolbar - [C286419]', async () => {
            await page.dataTable.doubleClickOnRowByName(pdfFile.file_name);
            expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not opened');

            expect(await toolbar.isPrintPresent()).toBe(false, 'Print button is still displayed');
        });
    });

    describe('toolbar More actions menu', () => {
        it('Add a new action - [C286420]', async () => {
            await page.dataTable.doubleClickOnRowByName(pdfFile.file_name);
            expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not opened');

            await toolbar.openMoreMenu();
            expect(await toolbar.menu.isMenuItemPresent(customSecondaryAction.title)).toBe(true, 'action is not present');
            expect(await toolbar.menu.getItemIconText(customSecondaryAction.title)).toEqual(customSecondaryAction.icon);
            expect(await toolbar.menu.getItemIdAttribute(customSecondaryAction.title)).toEqual(customSecondaryAction.id);
        });

        it('Modify title of action from More actions menu - [C286421]', async () => {
            await page.dataTable.doubleClickOnRowByName(pdfFile.file_name);
            expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not opened');

            await toolbar.openMoreMenu();
            expect(await toolbar.menu.getItemById(moveAction.id).getAttribute('title')).toEqual(moveAction.title);
        });

        it('Remove action from More actions menu - [C286423]', async () => {
            await page.dataTable.doubleClickOnRowByName(pdfFile.file_name);
            expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not opened');

            await toolbar.openMoreMenu();
            expect(await toolbar.menu.isManagePermissionsPresent()).toBe(false, 'Action is still displayed');
        });
    });
});
