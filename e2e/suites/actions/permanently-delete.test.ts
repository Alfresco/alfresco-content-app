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
import { ConfirmDialog } from './../../components/components';
import { SIDEBAR_LABELS } from '../../configs';
import { RepoClient } from '../../utilities/repo-client/repo-client';
import { Utils } from '../../utilities/utils';

describe('Permanently delete from Trash', () => {
    const username = `user-${Utils.random()}`;

    const file1 = `file1-${Utils.random()}.txt`;
    const file2 = `file2-${Utils.random()}.txt`;
    const file3 = `file3-${Utils.random()}.txt`;
    let filesIds;

    const folder1 = `folder1-${Utils.random()}`;
    const folder2 = `folder2-${Utils.random()}`;
    let foldersIds;

    const apis = {
        admin: new RepoClient(),
        user: new RepoClient(username, username)
    };

    const loginPage = new LoginPage();
    const logoutPage = new LogoutPage();
    const trashPage = new BrowsingPage();
    const { dataTable, toolbar } = trashPage;

    const confirmDialog = new ConfirmDialog();

    beforeAll(async (done) => {
        await apis.admin.people.createUser({ username });
        filesIds = (await apis.user.nodes.createFiles([ file1, file2, file3 ])).list.entries.map(entries => entries.entry.id);
        foldersIds = (await apis.user.nodes.createFolders([ folder1, folder2 ])).list.entries.map(entries => entries.entry.id);
        await apis.user.nodes.deleteNodesById(filesIds, false);
        await apis.user.nodes.deleteNodesById(foldersIds, false);

        await loginPage.loginWith(username);
        done();
    });

    beforeEach(async (done) => {
        await trashPage.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.TRASH);
        await dataTable.waitForHeader();
        done();
    });

    afterAll(async (done) => {
        await Promise.all([
            apis.user.trashcan.emptyTrash(),
            logoutPage.load()
        ]);
        done();
    });

    it('delete file - [C217091]', async () => {
        await dataTable.selectItem(file1);
        await toolbar.getButtonByTitleAttribute('Permanently delete').click();
        await trashPage.waitForDialog();
        // await trashPage.getDialogActionByLabel('Delete').click();
        // await trashPage.waitForDialogToClose();
        await confirmDialog.clickButton('Delete');
        const text = await trashPage.getSnackBarMessage();

        expect(text).toEqual(`${file1} deleted`);
        expect(await dataTable.getRowByName(file1).isPresent()).toBe(false, 'Item was not deleted');
    });

    it('delete folder - [C280416]', async () => {
        await dataTable.selectItem(folder1);
        await toolbar.getButtonByTitleAttribute('Permanently delete').click();
        await trashPage.waitForDialog();
        // await trashPage.getDialogActionByLabel('Delete').click();
        // await trashPage.waitForDialogToClose();
        await confirmDialog.clickButton('Delete');
        const text = await trashPage.getSnackBarMessage();

        expect(text).toEqual(`${folder1} deleted`);
        expect(await dataTable.getRowByName(folder1).isPresent()).toBe(false, 'Item was not deleted');
    });

    it('delete multiple items - [C280417]', async () => {
        await dataTable.selectMultipleItems([ file2, folder2 ]);
        await toolbar.getButtonByTitleAttribute('Permanently delete').click();
        await trashPage.waitForDialog();
        // await trashPage.getDialogActionByLabel('Delete').click();
        // await trashPage.waitForDialogToClose();
        await confirmDialog.clickButton('Delete');
        const text = await trashPage.getSnackBarMessage();

        expect(text).toEqual(`2 items deleted`);
        expect(await dataTable.getRowByName(file2).isPresent()).toBe(false, 'Item was not deleted');
        expect(await dataTable.getRowByName(folder2).isPresent()).toBe(false, 'Item was not deleted');
    });

    it('Confirmation dialog UI - [C269113]', async () => {
        await dataTable.selectItem(file3);
        await toolbar.getButtonByTitleAttribute('Permanently delete').click();
        await trashPage.waitForDialog();

        expect(await confirmDialog.isDialogOpen()).toBe(true, 'Confirm delete dialog not open');
        expect(await confirmDialog.getTitle()).toContain('Delete from trash');
        expect(await confirmDialog.getText()).toContain('This will permanently remove the selected item(s)');
        expect(await confirmDialog.isButtonEnabled('Delete')).toBe(true, 'DELETE button is not enabled');
        expect(await confirmDialog.isButtonEnabled('Keep')).toBe(true, 'KEEP button is not enabled');

        await Utils.pressEscape();
        await dataTable.clearSelection();
    });

    it('Keep action cancels the deletion - [C269115]', async () => {
        await dataTable.selectItem(file3);
        await toolbar.getButtonByTitleAttribute('Permanently delete').click();
        await trashPage.waitForDialog();

        expect(await confirmDialog.isButtonEnabled('Keep')).toBe(true, 'KEEP button is not enabled');
        await confirmDialog.clickButton('Keep');
        expect(await dataTable.getRowByName(file3).isPresent()).toBe(true, 'Item was deleted');
    });
});
