/*!
 * @license
 * Copyright 2017 Alfresco Software, Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { protractor, element, browser, by, ElementFinder, promise } from 'protractor';
import { LoginPage, LogoutPage, BrowsingPage } from '../../pages/pages';
import { APP_ROUTES, SITE_VISIBILITY, SITE_ROLES } from '../../configs';
import { RepoClient } from '../../utilities/repo-client/repo-client';
import { CreateOrEditFolderDialog } from '../../components/dialog/create-edit-folder-dialog';
import { LocalStorageUtility } from '../../utilities/local-storage';

describe('Edit folder', () => {
    const username = 'jane.doe';
    const password = 'jane.doe';

    const folderName = 'my-folder';
    const folderDescription = 'my folder description';

    const folderNameToEdit = 'folder-to-be-edited';
    const duplicateFolderName = 'duplicate-folder-name';

    const folderNameEdited = 'edited-folder';
    const folderDescriptionEdited = 'my folder description edited';

    const siteName = 'site-private';

    const apis = {
        admin: new RepoClient(),
        user: new RepoClient(username, password)
    };

    const loginPage = new LoginPage();
    const logoutPage = new LogoutPage();
    const personalFilesPage = new BrowsingPage();
    const editDialog = new CreateOrEditFolderDialog();
    const dataTable = personalFilesPage.dataTable;
    const editButton = personalFilesPage.toolbar.actions.getButtonByTitleAttribute('Edit');

    beforeAll(done => {
        Promise
            .all([
                apis.admin.people.createUser(username, password),
                apis.admin.sites.createSite(siteName, SITE_VISIBILITY.PRIVATE)
                    .then(() => apis.admin.nodes.createFolders([ folderName ], `Sites/${siteName}/documentLibrary`))
            ])
            .then(() => apis.admin.sites.addSiteMember(siteName, username, SITE_ROLES.SITE_CONSUMER))
            .then(() => Promise.all([
                apis.user.nodes.createNodeWithProperties( folderName, '', folderDescription ),
                apis.user.nodes.createFolders([ folderNameToEdit, duplicateFolderName ]),
                loginPage.load()
            ]))
            .then(() => { loginPage.loginWith(username, password); })
            .then(done);
    });

    beforeEach(done => {
        personalFilesPage.load()
            .then(() => dataTable.waitForHeader())
            .then(done);
    });

    afterEach(done => {
        browser.$('body').sendKeys(protractor.Key.ESCAPE).then(done);
    });

    afterAll(done => {
        Promise
            .all([
                apis.admin.sites.deleteSite(siteName, true),
                apis.user.nodes.deleteNodes([ folderName, folderNameEdited, duplicateFolderName ]),
                logoutPage.load()
                    .then(() => LocalStorageUtility.clear())
            ])
            .then(done);
    });

    it('button is enabled when having permissions', () => {
        dataTable.clickOnRowByContainingText(folderName)
            .then(() => {
                expect(editButton.isEnabled()).toBe(true);
            });
    });

    it('dialog UI defaults', () => {
        dataTable.clickOnRowByContainingText(folderName)
            .then(() => editButton.click())
            .then(() => {
                expect(editDialog.getTitle()).toBe('Edit folder');
                expect(editDialog.nameInput.getWebElement().getAttribute('value')).toBe(folderName);
                expect(editDialog.descriptionTextArea.getWebElement().getAttribute('value')).toBe(folderDescription);
                expect(editDialog.updateButton.getWebElement().isEnabled()).toBe(true, 'upload button is not enabled');
                expect(editDialog.cancelButton.getWebElement().isEnabled()).toBe(true, 'cancel button is not enabled');
            });
    });

    it('folder properties are modified when pressing OK', () => {
        dataTable.clickOnRowByContainingText(folderNameToEdit)
            .then(() => editButton.click())
            .then(() => {
                editDialog
                    .enterName(folderNameEdited)
                    .enterDescription(folderDescriptionEdited)
                    .clickUpdate();
            })
            .then(() => editDialog.waitForDialogToClose())
            .then(() => dataTable.waitForHeader())
            .then(() => {
                const isPresent = dataTable.getRowByContainingText(folderNameEdited).isPresent();
                expect(isPresent).toBe(true, 'Folder not displayed in list view');
            })
            .then(() => {
                apis.user.nodes.getNodeDescription(folderNameEdited)
                    .then((description) => {
                        expect(description).toEqual(folderDescriptionEdited);
                    });
            });
    });

    it('button is not displayed when not enough permissions', () => {
        const fileLibrariesPage = new BrowsingPage();

        fileLibrariesPage.sidenav.navigateToLinkByLabel('File Libraries')
            .then(() => fileLibrariesPage.dataTable.doubleClickOnRowByContainingText(siteName))
            .then(() => fileLibrariesPage.dataTable.clickOnRowByContainingText(folderName))
            .then(() => {
                expect(editButton.isPresent()).not.toBe(true, 'edit button is displayed');
            });
    });

    it('with empty folder name', () => {
        dataTable.clickOnRowByContainingText(folderName)
            .then(() => editButton.click())
            .then(() => {
                editDialog.deleteNameWithBackspace();
            })
            .then(() => {
                expect(editDialog.updateButton.getWebElement().isEnabled()).toBe(false, 'upload button is not enabled');
                expect(editDialog.getValidationMessage()).toMatch('Folder name is required');
            });
    });

    it('with name with special characters', () => {
        const namesWithSpecialChars = [ 'a*a', 'a"a', 'a<a', 'a>a', `a\\a`, 'a/a', 'a?a', 'a:a', 'a|a' ];

        dataTable.clickOnRowByContainingText(folderName)
            .then(() => editButton.click())
            .then(() => {
                namesWithSpecialChars.forEach(name => {
                    editDialog.enterName(name);

                    expect(editDialog.updateButton.getWebElement().isEnabled()).toBe(false, 'upload button is not disabled');
                    expect(editDialog.getValidationMessage()).toContain(`Folder name can't contain these characters`);
                });
            });
    });

    it('with name ending with a dot', () => {
        dataTable.clickOnRowByContainingText(folderName)
            .then(() => editButton.click())
            .then(() => editDialog.nameInput.sendKeys('.'))
            .then(() => {
                expect(editDialog.updateButton.getWebElement().isEnabled()).toBe(false, 'upload button is not enabled');
                expect(editDialog.getValidationMessage()).toMatch(`Folder name can't end with a period .`);
            });
    });

    it('Cancel button', () => {
        dataTable.clickOnRowByContainingText(folderName)
            .then(() => editButton.click())
            .then(() => editDialog.clickCancel())
            .then(() => { expect(editDialog.component.isPresent()).not.toBe(true, 'dialog is not closed'); });
    });

    it('with duplicate folder name', () => {
        dataTable.clickOnRowByContainingText(folderName)
            .then(() => editButton.click())
            .then(() => editDialog.enterName(duplicateFolderName).clickUpdate())
            .then(() => {
                personalFilesPage.getSnackBarMessage()
                    .then(message => {
                        expect(message).toEqual(`There's already a folder with this name. Try a different name.`);
                        expect(editDialog.component.isPresent()).toBe(true, 'dialog is not present');
                    });
            });
    });

    it('trim ending spaces', () => {
        dataTable.clickOnRowByContainingText(folderName)
            .then(() => editButton.click())
            .then(() => editDialog.nameInput.sendKeys('   '))
            .then(() => editDialog.clickUpdate())
            .then(() => editDialog.waitForDialogToClose())
            .then(() => {
                expect(personalFilesPage.snackBar.isPresent()).not.toBe(true, 'notification appears');
                expect(dataTable.getRowByContainingText(folderName).isPresent()).toBe(true, 'Folder not displayed in list view');
            });
    });
});
