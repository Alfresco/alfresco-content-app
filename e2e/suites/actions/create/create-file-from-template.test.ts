/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2020 Alfresco Software Limited
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

import {
  LoginPage,
  BrowsingPage,
  SelectTemplateDialog,
  CreateFromTemplateDialog,
  Utils,
  clearTextWithBackspace,
  AdminActions,
  RepoClient,
  NodeContentTree
} from '@alfresco/aca-testing-shared';
import { BrowserActions, Logger } from '@alfresco/adf-testing';

describe('Create file from template', () => {
  const random = Utils.random();

  const username = `user-${random}`;

  const restrictedTemplateFolder = `restricted-templates-${random}`;
  const templateInRestrictedFolder = `template-restricted-${random}.txt`;

  const templatesFolder1 = `templates-folder1-${random}`;
  const template1InFolder1 = `template1-1-${random}.txt`;
  const template2InFolder1 = `template1-2-${random}.txt`;

  const templatesFolder2 = `templates-folder2-${random}`;
  const template1InFolder2 = `template2-1-${random}.txt`;
  const templatesSubFolder = `template-subFolder-${random}`;

  const template1InRootFolder = `template3-${random}.txt`;
  const template2InRootFolder = `template4-${random}.txt`;

  const parent = `parent-${random}`;
  let parentId: string;
  const file1 = {
    name: `file1-${random}.txt`
  };
  const file2 = {
    name: `file2-${random}.txt`,
    title: `file2 title`,
    description: `file2 description`
  };
  const duplicateFileName = `duplicate-file-${random}.txt`;
  const nameWithSpaces = `  file-${random}.txt  `;

  const siteName = `site-${random}`;
  const fileSite = {
    name: `file-site-${random}.txt`,
    title: `file site title`,
    description: `file site description`
  };
  const duplicateFileSite = `duplicate-file-site-${random}.txt`;
  let docLibUserSite: string;

  const userApi = new RepoClient(username, username);

  const adminApiActions = new AdminActions();

  const loginPage = new LoginPage();
  const page = new BrowsingPage();
  const selectTemplateDialog = new SelectTemplateDialog();
  const createFromTemplateDialog = new CreateFromTemplateDialog();
  const { sidenav } = page;

  const templates: NodeContentTree = {
    folders: [
      {
        name: templatesFolder1,
        files: [template1InFolder1, template2InFolder1]
      },
      {
        name: templatesFolder2,
        folders: [
          {
            name: templatesSubFolder
          }
        ],
        files: [template1InFolder2]
      },
      {
        name: restrictedTemplateFolder,
        files: [templateInRestrictedFolder]
      }
    ],
    files: [template1InRootFolder, template2InRootFolder]
  };
  let link: string;

  beforeAll(async (done) => {
    await adminApiActions.createUser({ username });

    parentId = (await userApi.nodes.createFolder(parent)).entry.id;
    await userApi.nodes.createFile(duplicateFileName, parentId);

    await userApi.sites.createSite(siteName);
    docLibUserSite = await userApi.sites.getDocLibId(siteName);
    await userApi.nodes.createFile(duplicateFileSite, docLibUserSite);

    await loginPage.loginWith(username);
    done();
  });

  afterAll(async () => {
    await userApi.nodes.deleteNodeById(parentId);
    await userApi.sites.deleteSite(siteName);

    await adminApiActions.login();
    await adminApiActions.cleanupNodeTemplatesItems([
      templatesFolder1,
      templatesFolder2,
      restrictedTemplateFolder,
      template1InRootFolder,
      template2InRootFolder
    ]);
  });

  beforeEach(async () => {
    await page.closeOpenDialogs();
  });

  describe('with existing templates', () => {
    beforeAll(async () => {
      await adminApiActions.login();
      await adminApiActions.createNodeTemplatesHierarchy(templates);
      await adminApiActions.removeUserAccessOnNodeTemplate(restrictedTemplateFolder);
      link = (await adminApiActions.createLinkToFileName(template2InRootFolder, await adminApiActions.getNodeTemplatesFolderId())).entry.name;
    });

    describe('Select Template dialog', () => {
      beforeEach(async () => {
        await sidenav.openCreateFileFromTemplateDialog();
        await selectTemplateDialog.waitForDialogToOpen();
      });

      it('[C325043] Select template - dialog UI - with existing templates', async () => {
        expect(await selectTemplateDialog.getDialogTitle()).toEqual('Select a document template');
        expect(await selectTemplateDialog.dataTable.isEmpty()).toBe(false, 'Datatable is empty');
        expect(await selectTemplateDialog.dataTable.isItemPresent(templatesFolder1)).toBe(true, 'template folder not displayed');
        expect(await selectTemplateDialog.dataTable.isItemPresent(templatesFolder2)).toBe(true, 'template folder not displayed');
        expect(await selectTemplateDialog.dataTable.isItemPresent(template1InRootFolder)).toBe(true, 'template not displayed');
        expect(await selectTemplateDialog.dataTable.isItemPresent(template2InRootFolder)).toBe(true, 'template not displayed');
        expect(await selectTemplateDialog.breadcrumb.currentFolder.getText()).toEqual('Node Templates');
        expect(await selectTemplateDialog.isNextButtonEnabled()).toBe(false, 'Next button is not disabled');
        expect(await selectTemplateDialog.isCancelButtonEnabled()).toBe(true, 'Cancel button is not enabled');
      });

      it(`[C325044] Templates don't appear if user doesn't have permissions to see them`, async () => {
        expect(await selectTemplateDialog.dataTable.isItemPresent(restrictedTemplateFolder)).toBe(false, 'restricted templates folder is displayed');
      });

      it('[C325045] Navigate through the templates list with folder hierarchy', async () => {
        expect(await selectTemplateDialog.dataTable.isItemPresent(templatesFolder2)).toBe(true, 'template folder not displayed');

        await selectTemplateDialog.dataTable.doubleClickOnRowByName(templatesFolder2);

        expect(await selectTemplateDialog.dataTable.isItemPresent(templatesSubFolder)).toBe(true, 'template sub-folder not displayed');
        expect(await selectTemplateDialog.dataTable.isItemPresent(template1InFolder2)).toBe(true, 'template not displayed');
        expect(await selectTemplateDialog.dataTable.isItemPresent(template1InRootFolder)).toBe(false, 'template is displayed');
        expect(await selectTemplateDialog.dataTable.isItemPresent(template2InRootFolder)).toBe(false, 'template is displayed');
        expect(await selectTemplateDialog.breadcrumb.currentFolder.getText()).toEqual(templatesFolder2);

        await selectTemplateDialog.dataTable.doubleClickOnRowByName(templatesSubFolder);

        expect(await selectTemplateDialog.breadcrumb.currentFolder.getText()).toEqual(templatesSubFolder);
        expect(await selectTemplateDialog.dataTable.isEmpty()).toBe(true, 'datatable is not empty');

        await selectTemplateDialog.breadcrumb.openPath();

        expect(await selectTemplateDialog.breadcrumb.getPathItems()).toEqual([templatesFolder2, 'Node Templates']);
      });

      it(`[C325047] Templates list doesn't allow multiple selection`, async () => {
        expect(await selectTemplateDialog.dataTable.getSelectedRowsCount()).toEqual(0, 'Incorrect number of selected rows');

        await selectTemplateDialog.dataTable.selectItem(template1InRootFolder);
        expect(await selectTemplateDialog.dataTable.getSelectedRowsCount()).toEqual(1, 'Incorrect number of selected rows');
        expect(await selectTemplateDialog.dataTable.getSelectedRowsNames()).toEqual([template1InRootFolder], 'Incorrect selected item');

        await Utils.pressCmd();
        await selectTemplateDialog.dataTable.selectItem(template2InRootFolder);
        await Utils.releaseKeyPressed();

        expect(await selectTemplateDialog.dataTable.getSelectedRowsCount()).toEqual(1, 'Incorrect number of selected rows');
        expect(await selectTemplateDialog.dataTable.getSelectedRowsNames()).toEqual([template2InRootFolder], 'Incorrect selected item');
      });

      it('[C325050] Links to files are not displayed', async () => {
        expect(await selectTemplateDialog.dataTable.isItemPresent(link)).toBe(false, 'Link to file is displayed');
      });

      it('[C325048] Cancel the Select template dialog', async () => {
        expect(await selectTemplateDialog.isCancelButtonEnabled()).toBe(true, 'Cancel button is not enabled');

        await selectTemplateDialog.clickCancel();

        expect(await selectTemplateDialog.isDialogOpen()).toBe(false, 'Select Template dialog is open');
      });

      it('[C216339] Next button is disabled when selecting a folder', async () => {
        expect(await selectTemplateDialog.isNextButtonEnabled()).toBe(false, 'Next button is enabled');

        await selectTemplateDialog.dataTable.selectItem(templatesFolder1);

        expect(await selectTemplateDialog.isNextButtonEnabled()).toBe(false, 'Next button is enabled');
      });
    });

    describe('Create from template dialog', () => {
      beforeEach(async () => {
        try {
          await sidenav.openCreateFileFromTemplateDialog();
          await selectTemplateDialog.waitForDialogToOpen();
          await selectTemplateDialog.dataTable.selectItem(template1InRootFolder);
          await selectTemplateDialog.clickNext();
          await createFromTemplateDialog.waitForDialogToOpen();
        } catch (error) {
          Logger.error(`----- beforeEach failed : ${error}`);
        }
      });

      it('[C325020] Create file from template - dialog UI', async () => {
        expect(await createFromTemplateDialog.getDialogTitle()).toEqual(`Create new document from '${template1InRootFolder}'`);
        expect(await createFromTemplateDialog.nameInput.isDisplayed()).toBe(true, 'Name field not displayed');
        expect(await createFromTemplateDialog.titleInput.isDisplayed()).toBe(true, 'Title field not displayed');
        expect(await createFromTemplateDialog.descriptionTextArea.isDisplayed()).toBe(true, 'Description field not displayed');
        expect(await createFromTemplateDialog.isCancelButtonEnabled()).toBe(true, 'Cancel button is not enabled');
        expect(await createFromTemplateDialog.isCreateButtonEnabled()).toBe(true, 'Create button is not enabled');
      });

      it('[C325031] File name is required', async () => {
        expect(await createFromTemplateDialog.getNameInputValue()).toEqual(template1InRootFolder);
        await clearTextWithBackspace(createFromTemplateDialog.nameInput);

        expect(await createFromTemplateDialog.getValidationMessage()).toEqual('Name is required');
        expect(await createFromTemplateDialog.isCreateButtonEnabled()).toBe(false, 'Create button is not disabled');
      });

      it('[C325032] Special characters in file name', async () => {
        const namesWithSpecialChars = ['a*a', 'a"a', 'a<a', 'a>a', `a\\a`, 'a/a', 'a?a', 'a:a', 'a|a'];

        for (const name of namesWithSpecialChars) {
          await createFromTemplateDialog.enterName(name);
          expect(await createFromTemplateDialog.isCreateButtonEnabled()).toBe(false, 'Create button is not disabled');
          expect(await createFromTemplateDialog.getValidationMessage()).toContain(`Name can't contain these characters`);
        }
      });

      it('[C325033] File name ending with a dot', async () => {
        await createFromTemplateDialog.enterName('file-name.');

        expect(await createFromTemplateDialog.isCreateButtonEnabled()).toBe(false, 'Create button is not disabled');
        expect(await createFromTemplateDialog.getValidationMessage()).toMatch(`Name can't end with a period .`);
      });

      it('[C325034] File name containing only spaces', async () => {
        await createFromTemplateDialog.enterName('    ');

        expect(await createFromTemplateDialog.isCreateButtonEnabled()).toBe(false, 'Create button is not disabled');
        expect(await createFromTemplateDialog.getValidationMessage()).toMatch(`Name can't contain only spaces`);
      });

      it('[C290146] Title too long', async () => {
        await createFromTemplateDialog.enterTitle(Utils.string257);
        await Utils.pressTab();

        expect(await createFromTemplateDialog.isCreateButtonEnabled()).toBe(false, 'Create button is not disabled');
        expect(await createFromTemplateDialog.getValidationMessage()).toMatch(`Use 256 characters or less for title`);
      });

      it('[C290142] Description too long', async () => {
        await createFromTemplateDialog.enterDescription(Utils.string513);
        await Utils.pressTab();

        expect(await createFromTemplateDialog.isCreateButtonEnabled()).toBe(false, 'Create button is not disabled');
        expect(await createFromTemplateDialog.getValidationMessage()).toMatch(`Use 512 characters or less for description`);
      });
    });

    describe('On Personal Files', () => {
      beforeEach(async () => {
        try {
          await page.clickPersonalFilesAndWait();
          await page.dataTable.doubleClickOnRowByName(parent);
          await sidenav.openCreateFileFromTemplateDialog();
          await selectTemplateDialog.waitForDialogToOpen();
          await selectTemplateDialog.dataTable.selectItem(template1InRootFolder);
          await selectTemplateDialog.clickNext();
          await createFromTemplateDialog.waitForDialogToOpen();
        } catch (error) {
          Logger.error(`----- beforeEach failed : ${error}`);
        }
      });

      it('[C325030] Create a file from a template - with a new Name', async () => {
        await createFromTemplateDialog.enterName(file1.name);
        await BrowserActions.click(createFromTemplateDialog.createButton);
        await createFromTemplateDialog.waitForDialogToClose();
        await page.dataTable.waitForHeader();

        expect(await page.dataTable.isItemPresent(file1.name)).toBe(true, 'File not displayed in list view');
      });

      it('[C325026] Create a file from a template - with a Name, Title and Description', async () => {
        await createFromTemplateDialog.enterName(file2.name);
        await createFromTemplateDialog.enterTitle(file2.title);
        await createFromTemplateDialog.enterDescription(file2.description);

        await BrowserActions.click(createFromTemplateDialog.createButton);
        await createFromTemplateDialog.waitForDialogToClose();
        await page.dataTable.waitForHeader();

        expect(await page.dataTable.isItemPresent(file2.name)).toBe(true, 'File not displayed in list view');
        const desc = await userApi.nodes.getNodeDescription(file2.name, parentId);
        expect(desc).toEqual(file2.description);
        const title = await userApi.nodes.getNodeTitle(file2.name, parentId);
        expect(title).toEqual(file2.title);
      });

      it('[C325028] Create a file with a duplicate name', async () => {
        await createFromTemplateDialog.enterName(duplicateFileName);
        await BrowserActions.click(createFromTemplateDialog.createButton);

        expect(await page.getSnackBarMessage()).toEqual(`This name is already in use, try a different name.`);
        expect(await createFromTemplateDialog.isDialogOpen()).toBe(true, 'dialog is not present');
      });

      it('[C325027] Cancel file creation', async () => {
        await createFromTemplateDialog.enterName('test');
        await createFromTemplateDialog.clickCancel();

        expect(await createFromTemplateDialog.isDialogOpen()).not.toBe(true, 'dialog is not closed');
        expect(await page.dataTable.isItemPresent('test')).toBe(false, 'File should not appear in the list');
      });

      it('[C325042] Trim spaces from file Name', async () => {
        await createFromTemplateDialog.enterName(nameWithSpaces);
        await BrowserActions.click(createFromTemplateDialog.createButton);
        await createFromTemplateDialog.waitForDialogToClose();
        await page.dataTable.waitForHeader();

        expect(await page.dataTable.isItemPresent(nameWithSpaces.trim())).toBe(true, 'File not displayed in list view');
      });
    });

    describe('On File Libraries', () => {
      const fileLibrariesPage = new BrowsingPage();

      beforeEach(async () => {
        try {
          await fileLibrariesPage.goToMyLibrariesAndWait();
          await page.dataTable.doubleClickOnRowByName(siteName);
          await sidenav.openCreateFileFromTemplateDialog();
          await selectTemplateDialog.waitForDialogToOpen();
          await selectTemplateDialog.dataTable.selectItem(template1InRootFolder);
          await selectTemplateDialog.clickNext();
          await createFromTemplateDialog.waitForDialogToOpen();
        } catch (error) {
          Logger.error(`----- beforeEach failed : ${error}`);
        }
      });

      it('[C325023] Create a file from a template - with Name, Title and Description', async () => {
        await createFromTemplateDialog.enterName(fileSite.name);
        await createFromTemplateDialog.enterTitle(fileSite.title);
        await createFromTemplateDialog.enterDescription(fileSite.description);

        await BrowserActions.click(createFromTemplateDialog.createButton);
        await createFromTemplateDialog.waitForDialogToClose();
        await page.dataTable.waitForHeader();

        expect(await page.dataTable.isItemPresent(fileSite.name)).toBe(true, 'File not displayed in list view');
        const desc = await userApi.nodes.getNodeDescription(fileSite.name, docLibUserSite);
        expect(desc).toEqual(fileSite.description);
        const title = await userApi.nodes.getNodeTitle(fileSite.name, docLibUserSite);
        expect(title).toEqual(fileSite.title);
      });

      it('[C325024] Cancel file creation', async () => {
        await createFromTemplateDialog.enterName('test');
        await createFromTemplateDialog.clickCancel();

        expect(await createFromTemplateDialog.isDialogOpen()).not.toBe(true, 'dialog is not closed');
        expect(await page.dataTable.isItemPresent('test')).toBe(false, 'File should not appear in the list');
      });

      it('[C325025] Create a file with a duplicate name', async () => {
        await createFromTemplateDialog.enterName(duplicateFileSite);
        await BrowserActions.click(createFromTemplateDialog.createButton);

        expect(await page.getSnackBarMessage()).toEqual(`This name is already in use, try a different name.`);
        expect(await createFromTemplateDialog.isDialogOpen()).toBe(true, 'dialog is not present');
      });
    });
  });
});
