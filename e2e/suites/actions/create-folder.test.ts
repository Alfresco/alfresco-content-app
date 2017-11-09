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

import { protractor, browser, by, ElementFinder } from 'protractor';

import { APP_ROUTES, BROWSER_WAIT_TIMEOUT, SITE_VISIBILITY, SITE_ROLES } from '../../configs';
import { LoginPage, LogoutPage, BrowsingPage } from '../../pages/pages';
import { CreateOrEditFolderDialog } from '../../components/dialog/create-edit-folder-dialog';
import { Utils } from '../../utilities/utils';
import { RepoClient, NodeContentTree } from '../../utilities/repo-client/repo-client';

describe('Create folder', () => {
    const username = 'jane.doe';
    const password = 'jane.doe';

    const parent = 'parent-folder';
    const folderName1 = 'my-folder1';
    const folderName2 = 'my-folder2';
    const folderDescription = 'description of my folder';
    const duplicateFolderName = 'duplicate-folder-name';
    const nameWithSpaces = ' folder-name ';

    const siteName = 'site-private';

    const apis = {
        admin: new RepoClient(),
        user: new RepoClient(username, password)
    };

    const loginPage = new LoginPage();
    const logoutPage = new LogoutPage();
    const personalFilesPage = new BrowsingPage(APP_ROUTES.PERSONAL_FILES);
    const createDialog = new CreateOrEditFolderDialog();
    const dataTable = personalFilesPage.dataTable;

    function openCreateDialog(): any {
        return personalFilesPage.sidenav
            .openNewMenu()
            .then((menu) => {
                menu.clickMenuItem('Create folder');
            })
            .then(() => createDialog.waitForDialogToOpen());
    }

    beforeAll(done => {
        apis.admin.people.createUser(username, password)
            .then(() => apis.admin.sites.createSite(siteName, SITE_VISIBILITY.PRIVATE))
            .then(() => apis.admin.nodes.createFolders([ folderName1 ], `Sites/${siteName}/documentLibrary`))
            .then(() => apis.admin.sites.addSiteMember(siteName, username, SITE_ROLES.SITE_CONSUMER))
            .then(() => apis.user.nodes.createFolders([ duplicateFolderName ], parent))
            .then(() => loginPage.load())
            .then(() => loginPage.loginWith(username, password))
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
                apis.user.nodes.deleteNodes([ parent ]),
                logoutPage.load()
                    .then(() => Utils.clearLocalStorage())
            ])
            .then(done);
    });

    it('option is enabled when having enough permissions', () => {
        personalFilesPage.dataTable.doubleClickOnRowByContainingText(parent)
            .then(() => personalFilesPage.sidenav.openNewMenu()
                .then((menu) => {
                    const isEnabled = menu.getItemByLabel('Create folder').getWebElement().isEnabled();

                    expect(isEnabled).toBe(true, 'Create folder is not enabled');
                })
            );
    });

    it('creates new folder with name', () => {
        personalFilesPage.dataTable.doubleClickOnRowByContainingText(parent)
            .then(() => openCreateDialog()
                .then(() => createDialog.enterName(folderName1).clickCreate())
                .then(() => createDialog.waitForDialogToClose())
                .then(() => dataTable.waitForHeader())
                .then(() => {
                    const isPresent = dataTable.getRowByContainingText(folderName1).isPresent();
                    expect(isPresent).toBe(true, 'Folder not displayed in list view');
                })
            );
    });

    it('creates new folder with name and description', () => {
        personalFilesPage.dataTable.doubleClickOnRowByContainingText(parent)
            .then(() => openCreateDialog()
                .then(() => {
                    createDialog
                        .enterName(folderName2)
                        .enterDescription(folderDescription)
                        .clickCreate();
                })
                .then(() => createDialog.waitForDialogToClose())
                .then(() => dataTable.waitForHeader())
                .then(() => {
                    const isPresent = dataTable.getRowByContainingText(folderName2).isPresent();
                    expect(isPresent).toBe(true, 'Folder not displayed in list view');
                })
                .then(() => {
                    apis.user.nodes.getNodeDescription(folderName2)
                        .then((description) => {
                            expect(description).toEqual(folderDescription, 'Description is not correct');
                        });
                })
            );
    });

    it('enabled option tooltip', () => {
        personalFilesPage.dataTable.doubleClickOnRowByContainingText(parent)
            .then(() => personalFilesPage.sidenav.openNewMenu()
                .then(menu => {
                    const action = browser.actions().mouseMove(menu.getItemByLabel('Create folder'));
                    action.perform();

                    return menu;
                })
                .then((menu) => {
                    const tooltip = menu.getItemTooltip('Create folder');
                    expect(tooltip).toContain('Create new folder');
                })
            );
    });

    it('option is disabled when not enough permissions', () => {
        const fileLibrariesPage = new BrowsingPage(APP_ROUTES.FILE_LIBRARIES);

        fileLibrariesPage.sidenav.navigateToLinkByLabel('File Libraries')
            .then(() => fileLibrariesPage.dataTable.doubleClickOnRowByContainingText(siteName))
            .then(() => fileLibrariesPage.dataTable.doubleClickOnRowByContainingText(folderName1))
            .then(() => fileLibrariesPage.sidenav.openNewMenu())
            .then(menu => {
                const isEnabled = menu.getItemByLabel('Create folder').getWebElement().isEnabled();
                expect(isEnabled).toBe(false, 'Create folder is not disabled');
            });
    });

    it('disabled option tooltip', () => {
        const fileLibrariesPage = new BrowsingPage(APP_ROUTES.FILE_LIBRARIES);

        fileLibrariesPage.sidenav.navigateToLinkByLabel('File Libraries')
            .then(() => fileLibrariesPage.dataTable.doubleClickOnRowByContainingText(siteName))
            .then(() => fileLibrariesPage.dataTable.doubleClickOnRowByContainingText(folderName1))
            .then(() => fileLibrariesPage.sidenav.openNewMenu())
            .then(menu => {
                const action = browser.actions().mouseMove(menu.getItemByLabel('Create folder'));
                action.perform()
                    .then(() => {
                        const tooltip = menu.getItemTooltip('Create folder');
                        expect(tooltip).toContain(`You can't create a folder here`);
                    });
            });
    });

    it('dialog UI elements', () => {
        personalFilesPage.dataTable.doubleClickOnRowByContainingText(parent)
            .then(() => openCreateDialog().then(() => {
                const dialogTitle = createDialog.getTitle();
                const isFolderNameDisplayed = createDialog.nameInput.getWebElement().isDisplayed();
                const isDescriptionDisplayed = createDialog.descriptionTextArea.getWebElement().isDisplayed();
                const isCreateEnabled = createDialog.createButton.getWebElement().isEnabled();
                const isCancelEnabled = createDialog.cancelButton.getWebElement().isEnabled();

                expect(dialogTitle).toBe('Create new folder');
                expect(isFolderNameDisplayed).toBe(true, 'Name input is not displayed');
                expect(isDescriptionDisplayed).toBe(true, 'Description field is not displayed');
                expect(isCreateEnabled).toBe(false, 'Create button is not disabled');
                expect(isCancelEnabled).toBe(true, 'Cancel button is not enabled');
            })
        );
    });

    it('with empty folder name', () => {
        personalFilesPage.dataTable.doubleClickOnRowByContainingText(parent)
            .then(() => openCreateDialog()
                .then(() => {
                    createDialog.deleteNameWithBackspace();
                })
                .then(() => {
                    const isCreateEnabled = createDialog.createButton.getWebElement().isEnabled();
                    const validationMessage = createDialog.getValidationMessage();

                    expect(isCreateEnabled).toBe(false, 'Create button is enabled');
                    expect(validationMessage).toMatch('Folder name is required');
                })
            );
    });

    it('with folder name ending with a dot "."', () => {
        personalFilesPage.dataTable.doubleClickOnRowByContainingText(parent)
            .then(() => openCreateDialog()
                .then(() => createDialog.enterName('folder-name.'))
                .then((dialog) => {
                    const isCreateEnabled = dialog.createButton.getWebElement().isEnabled();
                    const validationMessage = dialog.getValidationMessage();

                    expect(isCreateEnabled).toBe(false, 'Create button is not disabled');
                    expect(validationMessage).toMatch(`Folder name can't end with a period .`);
                })
            );
    });

    it('with folder name containing special characters', () => {
        const namesWithSpecialChars = [ 'a*a', 'a"a', 'a<a', 'a>a', `a\\a`, 'a/a', 'a?a', 'a:a', 'a|a' ];

        personalFilesPage.dataTable.doubleClickOnRowByContainingText(parent)
            .then(() => openCreateDialog()
                .then(() => {
                    namesWithSpecialChars.forEach(name => {
                        createDialog.enterName(name);

                        const isCreateEnabled = createDialog.createButton.getWebElement().isEnabled();
                        const validationMessage = createDialog.getValidationMessage();

                        expect(isCreateEnabled).toBe(false, 'Create button is not disabled');
                        expect(validationMessage).toContain(`Folder name can't contain these characters`);
                    });
                })
            );
    });

    it('with folder name containing only spaces', () => {
        personalFilesPage.dataTable.doubleClickOnRowByContainingText(parent)
            .then(() => openCreateDialog()
                .then(() => createDialog.enterName('    '))
                .then((dialog) => {
                    const isCreateEnabled = dialog.createButton.getWebElement().isEnabled();
                    const validationMessage = dialog.getValidationMessage();

                    expect(isCreateEnabled).toBe(false, 'Create button is not disabled');
                    expect(validationMessage).toMatch(`Folder name can't contain only spaces`);
                })
            );
    });

    it('cancel folder creation', () => {
        personalFilesPage.dataTable.doubleClickOnRowByContainingText(parent)
            .then(() => openCreateDialog()
                .then(() => {
                    createDialog
                        .enterName('test')
                        .enterDescription('test description')
                        .clickCancel();
                })
                .then(() => expect(createDialog.component.isPresent()).not.toBe(true, 'dialog is not closed'))
            );
    });

    it('duplicate folder name', () => {
        personalFilesPage.dataTable.doubleClickOnRowByContainingText(parent)
            .then(() => openCreateDialog()
                .then(() => createDialog.enterName(duplicateFolderName).clickCreate())
                .then(() => {
                    personalFilesPage.getSnackBarMessage()
                        .then(message => {
                            expect(message).toEqual(`There's already a folder with this name. Try a different name.`);
                            expect(createDialog.component.isPresent()).toBe(true, 'dialog is not present');
                        });
                })
            );
    });

    it('trim ending spaces from folder name', () => {
        personalFilesPage.dataTable.doubleClickOnRowByContainingText(parent)
            .then(() => openCreateDialog()
                .then(() => createDialog.enterName(nameWithSpaces).clickCreate())
                .then(() => createDialog.waitForDialogToClose())
                .then(() => dataTable.waitForHeader())
                .then(() => {
                    const isPresent = dataTable.getRowByContainingText(nameWithSpaces.trim()).isPresent();
                    expect(isPresent).toBe(true, 'Folder not displayed in list view');
                })
            );
    });
});
