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
import { Utils } from '../../utilities/utils';

describe('Edit folder', () => {
    const username = `user-${Utils.random()}`;

    const parent = `parent-${Utils.random()}`;
    const folderName = `folder-${Utils.random()}`;
    const folderDescription = 'my folder description';

    const folderNameToEdit = `folder-${Utils.random()}`;
    const duplicateFolderName = `folder-${Utils.random()}`;

    const folderNameEdited = `folder-${Utils.random()}`;
    const folderDescriptionEdited = 'my folder description edited';

    const siteName = `site-private-${Utils.random()}`;

    const apis = {
        admin: new RepoClient(),
        user: new RepoClient(username, username)
    };

    const loginPage = new LoginPage();
    const logoutPage = new LogoutPage();
    const personalFilesPage = new BrowsingPage(APP_ROUTES.PERSONAL_FILES);
    const editDialog = new CreateOrEditFolderDialog();
    const dataTable = personalFilesPage.dataTable;
    const editButton = personalFilesPage.toolbar.actions.getButtonByTitleAttribute('Edit');

    beforeAll(done => {
        Promise
            .all([
                apis.admin.people.createUser(username),
                apis.admin.sites.createSite(siteName, SITE_VISIBILITY.PRIVATE)
                    .then(() => apis.admin.nodes.createFolders([ folderName ], `Sites/${siteName}/documentLibrary`))
            ])
            .then(() => apis.admin.sites.addSiteMember(siteName, username, SITE_ROLES.SITE_CONSUMER))
            .then(() => Promise.all([
                apis.user.nodes.createNodeWithProperties( folderName, '', folderDescription, parent ),
                apis.user.nodes.createFolders([ folderNameToEdit, duplicateFolderName ], parent)
            ]))
            .then(() => loginPage.load()
                .then(() => loginPage.loginWith(username))
                .then(done));
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
                apis.user.nodes.deleteNodes([ parent ]),
                logoutPage.load()
            ])
            .then(done);
    });

    it('dialog UI defaults', () => {
        personalFilesPage.dataTable.doubleClickOnItemName(parent)
            .then(() => dataTable.clickOnItemName(folderName)
                .then(() => editButton.click())
                .then(() => {
                    expect(editDialog.getTitle()).toBe('Edit folder');
                    expect(editDialog.nameInput.getWebElement().getAttribute('value')).toBe(folderName);
                    expect(editDialog.descriptionTextArea.getWebElement().getAttribute('value')).toBe(folderDescription);
                    expect(editDialog.updateButton.getWebElement().isEnabled()).toBe(true, 'upload button is not enabled');
                    expect(editDialog.cancelButton.getWebElement().isEnabled()).toBe(true, 'cancel button is not enabled');
                })
            );
    });

    it('properties are modified when pressing OK', () => {
        personalFilesPage.dataTable.doubleClickOnItemName(parent)
            .then(() => dataTable.clickOnItemName(folderNameToEdit)
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
                    const isPresent = dataTable.getRowByName(folderNameEdited).isPresent();
                    expect(isPresent).toBe(true, 'Folder not displayed in list view');
                })
                .then(() => {
                    apis.user.nodes.getNodeDescription(folderNameEdited)
                        .then((description) => {
                            expect(description).toEqual(folderDescriptionEdited);
                        });
                })
            );
    });

    it('with empty folder name', () => {
        personalFilesPage.dataTable.doubleClickOnItemName(parent)
            .then(() => dataTable.clickOnItemName(folderName)
                .then(() => editButton.click())
                .then(() => {
                    editDialog.deleteNameWithBackspace();
                })
                .then(() => {
                    expect(editDialog.updateButton.getWebElement().isEnabled()).toBe(false, 'upload button is not enabled');
                    expect(editDialog.getValidationMessage()).toMatch('Folder name is required');
                })
            );
    });

    it('with name with special characters', () => {
        const namesWithSpecialChars = [ 'a*a', 'a"a', 'a<a', 'a>a', `a\\a`, 'a/a', 'a?a', 'a:a', 'a|a' ];

        personalFilesPage.dataTable.doubleClickOnItemName(parent)
            .then(() => dataTable.clickOnItemName(folderName)
                .then(() => editButton.click())
                .then(() => {
                    namesWithSpecialChars.forEach(name => {
                        editDialog.enterName(name);

                        expect(editDialog.updateButton.getWebElement().isEnabled()).toBe(false, 'upload button is not disabled');
                        expect(editDialog.getValidationMessage()).toContain(`Folder name can't contain these characters`);
                    });
                })
            );
    });

    it('with name ending with a dot', () => {
        personalFilesPage.dataTable.doubleClickOnItemName(parent)
            .then(() => dataTable.clickOnItemName(folderName)
                .then(() => editButton.click())
                .then(() => editDialog.nameInput.sendKeys('.'))
                .then(() => {
                    expect(editDialog.updateButton.getWebElement().isEnabled()).toBe(false, 'upload button is not enabled');
                    expect(editDialog.getValidationMessage()).toMatch(`Folder name can't end with a period .`);
                })
            );
    });

    it('Cancel button', () => {
        personalFilesPage.dataTable.doubleClickOnItemName(parent)
            .then(() => dataTable.clickOnItemName(folderName)
                .then(() => editButton.click())
                .then(() => editDialog.clickCancel())
                .then(() => {
                    expect(editDialog.component.isPresent()).not.toBe(true, 'dialog is not closed');
                })
            );
    });

    it('with duplicate folder name', () => {
        personalFilesPage.dataTable.doubleClickOnItemName(parent)
            .then(() => dataTable.clickOnItemName(folderName)
                .then(() => editButton.click())
                .then(() => editDialog.enterName(duplicateFolderName).clickUpdate())
                .then(() => {
                    personalFilesPage.getSnackBarMessage()
                        .then(message => {
                            expect(message).toEqual(`There's already a folder with this name. Try a different name.`);
                            expect(editDialog.component.isPresent()).toBe(true, 'dialog is not present');
                        });
                })
            );
    });

    it('trim ending spaces', () => {
        personalFilesPage.dataTable.doubleClickOnItemName(parent)
            .then(() => dataTable.clickOnItemName(folderName)
                .then(() => editButton.click())
                .then(() => editDialog.nameInput.sendKeys('   '))
                .then(() => editDialog.clickUpdate())
                .then(() => editDialog.waitForDialogToClose())
                .then(() => {
                    expect(personalFilesPage.snackBar.isPresent()).not.toBe(true, 'notification appears');
                    expect(dataTable.getRowByName(folderName).isPresent()).toBe(true, 'Folder not displayed in list view');
                })
            );
    });
});
