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

import { protractor, browser } from 'protractor';
import { LoginPage, LogoutPage, BrowsingPage } from '../../pages/pages';
import { SIDEBAR_LABELS, SITE_VISIBILITY, SITE_ROLES } from '../../configs';
import { RepoClient } from '../../utilities/repo-client/repo-client';
import { CreateOrEditFolderDialog } from '../../components/dialog/create-edit-folder-dialog';
import { Utils } from '../../utilities/utils';

describe('Edit folder', () => {
    const username = `user-${Utils.random()}`;

    const parent = `parent-${Utils.random()}`;
    const folderName = `folder-${Utils.random()}`;
    const folderDescription = 'my folder description';

    const folderNameToEdit = `folder-${Utils.random()}`;
    const duplicateFolderName = `folder-${Utils.random()}`;

    const folderNameEdited = `folder-${Utils.random()}`;
    const folderDescriptionEdited = 'description edited';

    const siteName = `site-private-${Utils.random()}`;

    const apis = {
        admin: new RepoClient(),
        user: new RepoClient(username, username)
    };

    const loginPage = new LoginPage();
    const logoutPage = new LogoutPage();
    const personalFilesPage = new BrowsingPage();
    const editDialog = new CreateOrEditFolderDialog();
    const { dataTable } = personalFilesPage;
    const editButton = personalFilesPage.toolbar.actions.getButtonByTitleAttribute('Edit');

    beforeAll(done => {
        apis.admin.people.createUser(username)
            .then(() => apis.admin.sites.createSite(siteName, SITE_VISIBILITY.PRIVATE))
            .then(() => apis.admin.nodes.createFolders([ folderName ], `Sites/${siteName}/documentLibrary`))
            .then(() => apis.admin.sites.addSiteMember(siteName, username, SITE_ROLES.SITE_CONSUMER))

            .then(() => apis.user.nodes.createFolder( parent ))
            .then(resp => apis.user.nodes.createFolder( folderName, resp.data.entry.id, '', folderDescription ))
            .then(() => apis.user.nodes.createFolders([ folderNameToEdit, duplicateFolderName ], parent))

            .then(() => loginPage.loginWith(username))
            .then(done);
    });

    beforeEach(done => {
        personalFilesPage.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.PERSONAL_FILES)
            .then(() => dataTable.waitForHeader())
            .then(() => dataTable.doubleClickOnItemNameRow(parent))
            .then(() => dataTable.waitForHeader())
            .then(done);
    });

    afterEach(done => {
        browser.actions().sendKeys(protractor.Key.ESCAPE).perform().then(done);
    });

    afterAll(done => {
        Promise
            .all([
                apis.admin.sites.deleteSite(siteName),
                apis.user.nodes.deleteNodes([ parent ]),
                logoutPage.load()
            ])
            .then(done);
    });

    it('dialog UI defaults', () => {
        dataTable.clickOnItemNameRow(folderName)
            .then(() => editButton.click())
            .then(() => {
                expect(editDialog.getTitle()).toEqual('Edit folder');
                expect(editDialog.nameInput.getAttribute('value')).toBe(folderName);
                expect(editDialog.descriptionTextArea.getAttribute('value')).toBe(folderDescription);
                expect(editDialog.updateButton.isEnabled()).toBe(true, 'upload button is not enabled');
                expect(editDialog.cancelButton.isEnabled()).toBe(true, 'cancel button is not enabled');
            });
    });

    it('properties are modified when pressing OK', () => {
        dataTable.clickOnItemNameRow(folderNameToEdit)
            .then(() => editButton.click())
            .then(() => editDialog.waitForDialogToOpen())
            .then(() => editDialog.enterDescription(folderDescriptionEdited))
            .then(() => editDialog.enterName(folderNameEdited))
            .then(() => editDialog.clickUpdate())
            .then(() => editDialog.waitForDialogToClose())
            .then(() => dataTable.waitForHeader())
            .then(() => expect(dataTable.getRowName(folderNameEdited).isPresent()).toBe(true, 'Folder not displayed'))
            .then(() => apis.user.nodes.getNodeDescription(folderNameEdited, parent))
            .then(desc => expect(desc).toEqual(folderDescriptionEdited));
    });

    it('with empty folder name', () => {
        dataTable.clickOnItemNameRow(folderName)
            .then(() => editButton.click())
            .then(() => editDialog.deleteNameWithBackspace())
            .then(() => {
                expect(editDialog.updateButton.isEnabled()).toBe(false, 'upload button is not enabled');
                expect(editDialog.getValidationMessage()).toMatch('Folder name is required');
            });
    });

    it('with name with special characters', () => {
        const namesWithSpecialChars = [ 'a*a', 'a"a', 'a<a', 'a>a', `a\\a`, 'a/a', 'a?a', 'a:a', 'a|a' ];

        dataTable.clickOnItemNameRow(folderName)
            .then(() => editButton.click())
            .then(() => namesWithSpecialChars.forEach(name => {
                editDialog.enterName(name);

                expect(editDialog.updateButton.isEnabled()).toBe(false, 'upload button is not disabled');
                expect(editDialog.getValidationMessage()).toContain(`Folder name can't contain these characters`);
            }));
    });

    it('with name ending with a dot', () => {
        dataTable.clickOnItemNameRow(folderName)
            .then(() => editButton.click())
            .then(() => editDialog.nameInput.sendKeys('.'))
            .then(() => {
                expect(editDialog.updateButton.isEnabled()).toBe(false, 'upload button is not enabled');
                expect(editDialog.getValidationMessage()).toMatch(`Folder name can't end with a period .`);
            });
    });

    it('Cancel button', () => {
        dataTable.clickOnItemNameRow(folderName)
            .then(() => editButton.click())
            .then(() => editDialog.clickCancel())
            .then(() => {
                expect(editDialog.component.isPresent()).not.toBe(true, 'dialog is not closed');
            });
    });

    it('with duplicate folder name', () => {
        dataTable.clickOnItemNameRow(folderName)
            .then(() => editButton.click())
            .then(() => editDialog.enterName(duplicateFolderName))
            .then(() => editDialog.clickUpdate())
            .then(() => personalFilesPage.getSnackBarMessage())
            .then(message => {
                expect(message).toEqual(`There's already a folder with this name. Try a different name.`);
                expect(editDialog.component.isPresent()).toBe(true, 'dialog is not present');
            });
    });

    it('trim ending spaces', () => {
        dataTable.clickOnItemNameRow(folderName)
            .then(() => editButton.click())
            .then(() => editDialog.nameInput.sendKeys('   '))
            .then(() => editDialog.clickUpdate())
            .then(() => editDialog.waitForDialogToClose())
            .then(() => {
                expect(personalFilesPage.snackBar.isPresent()).not.toBe(true, 'notification appears');
                expect(dataTable.getRowName(folderName).isPresent()).toBe(true, 'Folder not displayed in list view');
            });
    });
});
