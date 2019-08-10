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
import { FILES, SITE_VISIBILITY } from '../../configs';
import { RepoClient } from '../../utilities/repo-client/repo-client';
import { Utils } from '../../utilities/utils';
import { Viewer } from '../../components/viewer/viewer';

describe('Viewer general', () => {
    const username = `user-${Utils.random()}`;

    const parent = `parent-${Utils.random()}`; let parentId;

    const xlsxFile = FILES.xlsxFile; let xlsxFileId;
    const fileAdmin = FILES.docxFile; let fileAdminId;

    const siteAdmin = `siteAdmin-${Utils.random()}`; let docLibId;
    const siteUser = `siteUser-${Utils.random()}`; let docLibSiteUserId;

    const fileInSite = FILES.docxFile;

    const apis = {
        admin: new RepoClient(),
        user: new RepoClient(username, username)
    };

    const loginPage = new LoginPage();
    const page = new BrowsingPage();
    const { dataTable } = page;
    const viewer = new Viewer();
    const { searchInput } = page.header;

    beforeAll(async (done) => {
        await apis.admin.people.createUser({ username });
        parentId = (await apis.user.nodes.createFolder(parent)).entry.id;
        xlsxFileId = (await apis.user.upload.uploadFile(xlsxFile, parentId)).entry.id;

        await apis.admin.sites.createSite(siteAdmin, SITE_VISIBILITY.PRIVATE);
        docLibId = await apis.admin.sites.getDocLibId(siteAdmin);
        fileAdminId = (await apis.admin.upload.uploadFile(fileAdmin, docLibId)).entry.id;

        await apis.user.sites.createSite(siteUser, SITE_VISIBILITY.PUBLIC);
        docLibSiteUserId = await apis.user.sites.getDocLibId(siteUser);
        await apis.user.upload.uploadFile(fileInSite, docLibSiteUserId);

        await apis.user.shared.shareFileById(xlsxFileId);
        await apis.user.shared.waitForApi({ expect: 1 });
        await apis.user.favorites.addFavoriteById('file', xlsxFileId);
        await apis.user.favorites.waitForApi({ expect: 2 });

        await loginPage.loginWith(username);
        done();
    });

    beforeEach(async (done) => {
        await page.header.expandSideNav();
        await page.clickPersonalFilesAndWait();
        await dataTable.doubleClickOnRowByName(parent);
        await dataTable.waitForHeader();
        done();
    });

    afterEach(async (done) => {
        await Utils.pressEscape();
        await page.header.expandSideNav();
        done();
    });

    afterAll(async (done) => {
      await apis.user.nodes.deleteNodeById(parentId);
      await apis.admin.sites.deleteSite(siteAdmin);
      await apis.user.sites.deleteSite(siteUser);
      done();
    });

    it('Viewer opens on double clicking on a file from Personal Files - [C279269]', async () => {
        await dataTable.doubleClickOnRowByName(xlsxFile);
        expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not opened');
    });

    it('Viewer opens when clicking the View action for a file - [C279270]', async () => {
        await dataTable.selectItem(xlsxFile);
        await page.toolbar.clickView();
        expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not opened');
    });

    it('The viewer general elements are displayed - [C279283]', async () => {
        await dataTable.doubleClickOnRowByName(xlsxFile);
        expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not opened');
        expect(await viewer.isViewerToolbarDisplayed()).toBe(true, 'Toolbar not displayed');
        expect(await viewer.isCloseButtonDisplayed()).toBe(true, 'Close button is not displayed');
        expect(await viewer.isFileTitleDisplayed()).toBe(true, 'File title is not displayed');
    });

    it('Close the viewer - [C279271]', async () => {
        await dataTable.doubleClickOnRowByName(xlsxFile);
        expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not opened');
        await viewer.clickClose();
        expect(await viewer.isViewerOpened()).toBe(false, 'Viewer did not close');
    });

    it('Close button tooltip - [C284632]', async () => {
        await dataTable.doubleClickOnRowByName(xlsxFile);
        expect(await viewer.getCloseButtonTooltip()).toEqual('Close');
    });

    it('Viewer opens when accessing the preview URL for a file - [C279285]', async () => {
        const previewURL = `personal-files/${parentId}/(viewer:view/${xlsxFileId})`
        await page.load(previewURL);
        expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not opened');
        expect(await viewer.getFileTitle()).toEqual(xlsxFile);
    });

    it('Viewer does not open when accessing the preview URL for a file without permissions - [C279287]', async () => {
        const previewURL = `libraries/${docLibId}/(viewer:view/${fileAdminId})`
        await page.load(previewURL);
        expect(await viewer.isViewerOpened()).toBe(false, 'Viewer should not be opened!');
    });

    it('Viewer opens for a file from File Libraries - [C284633]', async () => {
      await page.goToMyLibrariesAndWait();
        await dataTable.doubleClickOnRowByName(siteUser);
        await dataTable.waitForHeader();
        await dataTable.doubleClickOnRowByName(fileInSite);
        expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not opened');
        expect(await viewer.isViewerToolbarDisplayed()).toBe(true, 'Toolbar not displayed');
        expect(await viewer.isCloseButtonDisplayed()).toBe(true, 'Close button is not displayed');
        expect(await viewer.isFileTitleDisplayed()).toBe(true, 'File title is not displayed');
    });

    it('Viewer opens for a file from Recent Files - [C284636]', async () => {
        await page.clickRecentFilesAndWait();
        await dataTable.doubleClickOnRowByName(xlsxFile);
        expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not opened');
        expect(await viewer.isViewerToolbarDisplayed()).toBe(true, 'Toolbar not displayed');
        expect(await viewer.isCloseButtonDisplayed()).toBe(true, 'Close button is not displayed');
        expect(await viewer.isFileTitleDisplayed()).toBe(true, 'File title is not displayed');
    });

    it('Viewer opens for a file from Shared Files - [C284635]', async () => {
        await page.clickSharedFilesAndWait();
        await dataTable.doubleClickOnRowByName(xlsxFile);
        expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not opened');
        expect(await viewer.isViewerToolbarDisplayed()).toBe(true, 'Toolbar not displayed');
        expect(await viewer.isCloseButtonDisplayed()).toBe(true, 'Close button is not displayed');
        expect(await viewer.isFileTitleDisplayed()).toBe(true, 'File title is not displayed');
    });

    it('Viewer opens for a file from Favorites - [C284634]', async () => {
        await page.clickFavoritesAndWait();
        await dataTable.doubleClickOnRowByName(xlsxFile);
        expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not opened');
        expect(await viewer.isViewerToolbarDisplayed()).toBe(true, 'Toolbar not displayed');
        expect(await viewer.isCloseButtonDisplayed()).toBe(true, 'Close button is not displayed');
        expect(await viewer.isFileTitleDisplayed()).toBe(true, 'File title is not displayed');
    });

    it('Viewer opens for a file from Search Results - [C279175]', async () => {
        await searchInput.clickSearchButton();
        await searchInput.checkFilesAndFolders();
        await searchInput.searchFor(xlsxFile);
        await dataTable.waitForBody();

        await dataTable.doubleClickOnRowByName(xlsxFile);
        expect(await viewer.isViewerOpened()).toBe(true, 'Viewer is not opened');
        expect(await viewer.isViewerToolbarDisplayed()).toBe(true, 'Toolbar not displayed');
        expect(await viewer.isCloseButtonDisplayed()).toBe(true, 'Close button is not displayed');
        expect(await viewer.isFileTitleDisplayed()).toBe(true, 'File title is not displayed');
    });

});
