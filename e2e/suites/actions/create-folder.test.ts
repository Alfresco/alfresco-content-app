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

import { browser } from 'protractor';

import { SIDEBAR_LABELS, SITE_VISIBILITY, SITE_ROLES } from '../../configs';
import { LoginPage, LogoutPage, BrowsingPage } from '../../pages/pages';
import { CreateOrEditFolderDialog } from '../../components/dialog/create-edit-folder-dialog';
import { Utils } from '../../utilities/utils';
import { RepoClient } from '../../utilities/repo-client/repo-client';

describe('Create folder', () => {
    const username = `user-${Utils.random()}`;

    const parent = `parent-${Utils.random()}`;
    const folderName1 = `folder-${Utils.random()}`;
    const folderName2 = `folder-${Utils.random()}`;
    const folderDescription = 'description of my folder';
    const duplicateFolderName = `folder-${Utils.random()}`;
    const nameWithSpaces = ` folder-${Utils.random()} `;

    const siteName = `site-private-${Utils.random()}`;

    const apis = {
        admin: new RepoClient(),
        user: new RepoClient(username, username)
    };

    const loginPage = new LoginPage();
    const logoutPage = new LogoutPage();
    const personalFilesPage = new BrowsingPage();
    const createDialog = new CreateOrEditFolderDialog();
    const { dataTable } = personalFilesPage;

    beforeAll(done => {
        apis.admin.people.createUser({ username })
            .then(() => apis.admin.sites.createSite(siteName, SITE_VISIBILITY.PRIVATE))
            .then(() => apis.admin.nodes.createFolders([ folderName1 ], `Sites/${siteName}/documentLibrary`))
            .then(() => apis.admin.sites.addSiteMember(siteName, username, SITE_ROLES.SITE_CONSUMER))
            .then(() => apis.user.nodes.createFolders([ duplicateFolderName ], parent))
            .then(() => loginPage.loginWith(username))
            .then(done);
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

    describe('on Personal Files', () => {
        beforeEach(done => {
            personalFilesPage.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.PERSONAL_FILES)
                .then(() => dataTable.waitForHeader())
                .then(done);
        });

        afterEach(done => {
            browser.actions().mouseMove(browser.$('body'), { x: 0, y: 0 }).click().perform().then(done);
        });

        it('option is enabled when having enough permissions - [C216339]', () => {
            personalFilesPage.dataTable.doubleClickOnRowByName(parent)
                .then(() => personalFilesPage.sidenav.openNewMenu())
                .then(menu => {
                    const isEnabled = menu.getItemByLabel('Create folder').isEnabled();
                    expect(isEnabled).toBe(true, 'Create folder is not enabled');
                });
        });

        it('creates new folder with name - [C216341]', () => {
            personalFilesPage.dataTable.doubleClickOnRowByName(parent)
                .then(() => personalFilesPage.sidenav.openCreateDialog())
                .then(() => createDialog.waitForDialogToOpen())
                .then(() => createDialog.enterName(folderName1))
                .then(() => createDialog.clickCreate())
                .then(() => createDialog.waitForDialogToClose())
                .then(() => dataTable.waitForHeader())
                .then(() => {
                    const isPresent = dataTable.getRowByName(folderName1).isPresent();
                    expect(isPresent).toBe(true, 'Folder not displayed in list view');
                });
        });

        it('creates new folder with name and description - [C216340]', () => {
            personalFilesPage.dataTable.doubleClickOnRowByName(parent)
                .then(() => personalFilesPage.sidenav.openCreateDialog())
                .then(() => createDialog.waitForDialogToOpen())
                .then(() => createDialog.enterName(folderName2))
                .then(() => createDialog.enterDescription(folderDescription))
                .then(() => createDialog.clickCreate())
                .then(() => createDialog.waitForDialogToClose())
                .then(() => dataTable.waitForHeader())
                .then(() => expect(dataTable.getRowByName(folderName2).isPresent()).toBe(true, 'Folder not displayed'))
                .then(() => apis.user.nodes.getNodeDescription(folderName2, parent))
                .then(desc => expect(desc).toEqual(folderDescription));
        });

        it('enabled option tooltip - [C216342]', () => {
            personalFilesPage.dataTable.doubleClickOnRowByName(parent)
                .then(() => personalFilesPage.sidenav.openNewMenu())
                .then(menu => browser.actions().mouseMove(menu.getItemByLabel('Create folder')).perform()
                    .then(() => menu))
                .then(menu => {
                    expect(menu.getItemTooltip('Create folder')).toContain('Create new folder');
                });
        });

        it('dialog UI elements - [C216345]', () => {
            personalFilesPage.dataTable.doubleClickOnRowByName(parent)
                .then(() => personalFilesPage.sidenav.openCreateDialog())
                .then(() => createDialog.waitForDialogToOpen())
                .then(() => {
                    const dialogTitle = createDialog.getTitle();
                    const isFolderNameDisplayed = createDialog.nameInput.isDisplayed();
                    const isDescriptionDisplayed = createDialog.descriptionTextArea.isDisplayed();
                    const isCreateEnabled = createDialog.createButton.isEnabled();
                    const isCancelEnabled = createDialog.cancelButton.isEnabled();

                    expect(dialogTitle).toMatch('Create new folder');
                    expect(isFolderNameDisplayed).toBe(true, 'Name input is not displayed');
                    expect(isDescriptionDisplayed).toBe(true, 'Description field is not displayed');
                    expect(isCreateEnabled).toBe(false, 'Create button is not disabled');
                    expect(isCancelEnabled).toBe(true, 'Cancel button is not enabled');
                });
        });

        it('with empty folder name - [C216346]', () => {
            personalFilesPage.dataTable.doubleClickOnRowByName(parent)
                .then(() => personalFilesPage.sidenav.openCreateDialog())
                .then(() => createDialog.waitForDialogToOpen())
                .then(() => createDialog.deleteNameWithBackspace())
                .then(() => {
                    const isCreateEnabled = createDialog.createButton.isEnabled();
                    const validationMessage = createDialog.getValidationMessage();

                    expect(isCreateEnabled).toBe(false, 'Create button is enabled');
                    expect(validationMessage).toMatch('Folder name is required');
                });
        });

        it('with folder name ending with a dot "." - [C216348]', () => {
            personalFilesPage.dataTable.doubleClickOnRowByName(parent)
                .then(() => personalFilesPage.sidenav.openCreateDialog())
                .then(() => createDialog.waitForDialogToOpen())
                .then(() => createDialog.enterName('folder-name.'))
                .then(() => {
                    const isCreateEnabled = createDialog.createButton.isEnabled();
                    const validationMessage = createDialog.getValidationMessage();

                    expect(isCreateEnabled).toBe(false, 'Create button is not disabled');
                    expect(validationMessage).toMatch(`Folder name can't end with a period .`);
                });
        });

        it('with folder name containing special characters - [C216347]', () => {
            const namesWithSpecialChars = [ 'a*a', 'a"a', 'a<a', 'a>a', `a\\a`, 'a/a', 'a?a', 'a:a', 'a|a' ];

            personalFilesPage.dataTable.doubleClickOnRowByName(parent)
                .then(() => personalFilesPage.sidenav.openCreateDialog())
                .then(() => createDialog.waitForDialogToOpen())
                .then(() => namesWithSpecialChars.forEach(name => {
                    createDialog.enterName(name);

                    const isCreateEnabled = createDialog.createButton.isEnabled();
                    const validationMessage = createDialog.getValidationMessage();

                    expect(isCreateEnabled).toBe(false, 'Create button is not disabled');
                    expect(validationMessage).toContain(`Folder name can't contain these characters`);
                }));
        });

        it('with folder name containing only spaces - [C280406]', () => {
            personalFilesPage.dataTable.doubleClickOnRowByName(parent)
                .then(() => personalFilesPage.sidenav.openCreateDialog())
                .then(() => createDialog.waitForDialogToOpen())
                .then(() => createDialog.enterName('    '))
                .then(() => {
                    const isCreateEnabled = createDialog.createButton.isEnabled();
                    const validationMessage = createDialog.getValidationMessage();

                    expect(isCreateEnabled).toBe(false, 'Create button is not disabled');
                    expect(validationMessage).toMatch(`Folder name can't contain only spaces`);
                });
        });

        it('cancel folder creation - [C216349]', () => {
            personalFilesPage.dataTable.doubleClickOnRowByName(parent)
                .then(() => personalFilesPage.sidenav.openCreateDialog())
                .then(() => createDialog.waitForDialogToOpen())
                .then(() => createDialog.enterName('test'))
                .then(() => createDialog.enterDescription('test description'))
                .then(() => createDialog.clickCancel())
                .then(() => {
                    expect(createDialog.component.isPresent()).not.toBe(true, 'dialog is not closed');
                });
        });

        it('duplicate folder name - [C216350]', () => {
            personalFilesPage.dataTable.doubleClickOnRowByName(parent)
                .then(() => personalFilesPage.sidenav.openCreateDialog())
                .then(() => createDialog.waitForDialogToOpen())
                .then(() => createDialog.enterName(duplicateFolderName))
                .then(() => createDialog.clickCreate())
                .then(() => personalFilesPage.getSnackBarMessage())
                .then(message => {
                    expect(message).toEqual(`There's already a folder with this name. Try a different name.`);
                    expect(createDialog.component.isPresent()).toBe(true, 'dialog is not present');
                });
        });

        it('trim ending spaces from folder name - [C216351]', () => {
            personalFilesPage.dataTable.doubleClickOnRowByName(parent)
                .then(() => personalFilesPage.sidenav.openCreateDialog())
                .then(() => createDialog.waitForDialogToOpen())
                .then(() => createDialog.enterName(nameWithSpaces))
                .then(() => createDialog.clickCreate())
                .then(() => createDialog.waitForDialogToClose())
                .then(() => dataTable.waitForHeader())
                .then(() => {
                    const isPresent = dataTable.getRowByName(nameWithSpaces.trim()).isPresent();
                    expect(isPresent).toBe(true, 'Folder not displayed in list view');
                });
        });
    });

    describe('on File Libraries', () => {
        const fileLibrariesPage = new BrowsingPage();

        beforeEach(done => {
            fileLibrariesPage.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.FILE_LIBRARIES)
                .then(() => dataTable.waitForHeader())
                .then(done);
        });

        afterEach(done => {
            browser.actions().mouseMove(browser.$('body'), { x: 0, y: 0 }).click().perform().then(done);
        });

        it('option is disabled when not enough permissions - [C280397]', () => {
            fileLibrariesPage.dataTable.doubleClickOnRowByName(siteName)
                .then(() => fileLibrariesPage.dataTable.doubleClickOnRowByName(folderName1))
                .then(() => fileLibrariesPage.sidenav.openNewMenu())
                .then(menu => {
                    const isEnabled = menu.getItemByLabel('Create folder').isEnabled();
                    expect(isEnabled).toBe(false, 'Create folder is not disabled');
                });
        });

        it('disabled option tooltip - [C280398]', () => {
            fileLibrariesPage.dataTable.doubleClickOnRowByName(siteName)
                .then(() => fileLibrariesPage.dataTable.doubleClickOnRowByName(folderName1))
                .then(() => fileLibrariesPage.sidenav.openNewMenu())
                .then(menu => browser.actions().mouseMove(menu.getItemByLabel('Create folder')).perform()
                    .then(() => menu))
                .then(menu => {
                    const tooltip = menu.getItemTooltip('Create folder');
                    expect(tooltip).toContain(`Folders cannot be created whilst viewing the current items`);
                });
        });
    });

    xit('');
});
