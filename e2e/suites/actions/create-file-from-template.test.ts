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

import { LoginPage, BrowsingPage } from '../../pages/pages';
import { SelectTemplateDialog } from '../../components/dialog/select-template-dialog';
import { CreateFromTemplateDialog } from '../../components/dialog/create-from-template-dialog';
import { Utils } from '../../utilities/utils';
import { AdminActions } from '../../utilities/admin-actions';
import { RepoClient, NodeContentTree } from '../../utilities/repo-client/repo-client';

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

  const parent = `parent-${random}`; let parentId;
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

  beforeAll(async () => {
    await adminApiActions.createUser({ username });

    parentId = (await userApi.nodes.createFolder(parent)).entry.id;
    await userApi.nodes.createFile(duplicateFileName, parentId);

    await userApi.sites.createSite(siteName);
    docLibUserSite = await userApi.sites.getDocLibId(siteName);
    await userApi.nodes.createFile(duplicateFileSite, docLibUserSite);

    await loginPage.loginWith(username);
  });

  afterAll(async () => {
    await userApi.nodes.deleteNodeById(parentId);
    await userApi.sites.deleteSite(siteName);
    await adminApiActions.cleanupNodeTemplatesFolder();
  });

  beforeEach(async () => {
    await page.closeOpenDialogs();
  });

  it('Select template - dialog UI - when no templates exist in the repo - [C325049]', async () => {
    await sidenav.openCreateFileFromTemplateDialog();
    await selectTemplateDialog.waitForDialogToOpen();

    expect(await selectTemplateDialog.getTitle()).toEqual('Select a document template');
    expect(await selectTemplateDialog.dataTable.isEmpty()).toBe(true, 'Datatable is not empty');
    expect(await selectTemplateDialog.dataTable.getEmptyListText()).toEqual('No results found');
    expect(await selectTemplateDialog.breadcrumb.getCurrentFolderName()).toEqual('Node Templates');
    expect(await selectTemplateDialog.isNextButtonEnabled()).toBe(false, 'Next button is not disabled');
    expect(await selectTemplateDialog.isCancelButtonEnabled()).toBe(true, 'Cancel button is not enabled');
  });

  describe('with existing templates', () => {
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

    beforeAll(async () => {
      await adminApiActions.createNodeTemplatesHierarchy(templates);
      await adminApiActions.removeUserAccessOnNodeTemplate(restrictedTemplateFolder);
      link = (await adminApiActions.createLinkToFileName(template2InRootFolder, await adminApiActions.getNodeTemplatesFolderId())).entry.name;
    });

    describe('Select Template dialog', () => {
      beforeEach(async () => {
        await sidenav.openCreateFileFromTemplateDialog();
        await selectTemplateDialog.waitForDialogToOpen();
      });

      it('Select template - dialog UI - with existing templates - [C325043]', async () => {
        expect(await selectTemplateDialog.getTitle()).toEqual('Select a document template');
        expect(await selectTemplateDialog.dataTable.isEmpty()).toBe(false, 'Datatable is empty');
        expect(await selectTemplateDialog.dataTable.isItemPresent(templatesFolder1)).toBe(true, 'template folder not displayed');
        expect(await selectTemplateDialog.dataTable.isItemPresent(templatesFolder2)).toBe(true, 'template folder not displayed');
        expect(await selectTemplateDialog.dataTable.isItemPresent(template1InRootFolder)).toBe(true, 'template not displayed');
        expect(await selectTemplateDialog.dataTable.isItemPresent(template2InRootFolder)).toBe(true, 'template not displayed');
        expect(await selectTemplateDialog.breadcrumb.getCurrentFolderName()).toEqual('Node Templates');
        expect(await selectTemplateDialog.isNextButtonEnabled()).toBe(false, 'Next button is not disabled');
        expect(await selectTemplateDialog.isCancelButtonEnabled()).toBe(true, 'Cancel button is not enabled');
      });

      it(`Templates don't appear if user doesn't have permissions to see them - [C325044]`, async () => {
        expect(await selectTemplateDialog.dataTable.isItemPresent(restrictedTemplateFolder)).toBe(false, 'restricted templates folder is displayed');
      });

      it('Navigate through the templates list with folder hierarchy - [C325045]', async () => {
        expect(await selectTemplateDialog.dataTable.isItemPresent(templatesFolder2)).toBe(true, 'template folder not displayed');

        await selectTemplateDialog.dataTable.doubleClickOnRowByName(templatesFolder2);

        expect(await selectTemplateDialog.dataTable.isItemPresent(templatesSubFolder)).toBe(true, 'template sub-folder not displayed');
        expect(await selectTemplateDialog.dataTable.isItemPresent(template1InFolder2)).toBe(true, 'template not displayed');
        expect(await selectTemplateDialog.dataTable.isItemPresent(template1InRootFolder)).toBe(false, 'template is displayed');
        expect(await selectTemplateDialog.dataTable.isItemPresent(template2InRootFolder)).toBe(false, 'template is displayed');
        expect(await selectTemplateDialog.breadcrumb.getCurrentFolderName()).toEqual(templatesFolder2);

        await selectTemplateDialog.dataTable.doubleClickOnRowByName(templatesSubFolder);

        expect(await selectTemplateDialog.breadcrumb.getCurrentFolderName()).toEqual(templatesSubFolder);
        expect(await selectTemplateDialog.dataTable.isEmpty()).toBe(true, 'datatable is not empty');

        await selectTemplateDialog.breadcrumb.openPath();

        expect(await selectTemplateDialog.breadcrumb.getPathItems()).toEqual([ templatesFolder2, 'Node Templates' ]);
      });

      it(`Templates list doesn't allow multiple selection - [C325047]`, async () => {
        expect(await selectTemplateDialog.dataTable.getSelectedRowsCount()).toEqual(0, 'Incorrect number of selected rows');

        await selectTemplateDialog.dataTable.selectItem(template1InRootFolder);
        expect(await selectTemplateDialog.dataTable.getSelectedRowsCount()).toEqual(1, 'Incorrect number of selected rows');
        expect(await selectTemplateDialog.dataTable.getSelectedRowsNames()).toEqual([ template1InRootFolder ], 'Incorrect selected item');

        await Utils.pressCmd();
        await selectTemplateDialog.dataTable.selectItem(template2InRootFolder);
        await Utils.releaseKeyPressed();

        expect(await selectTemplateDialog.dataTable.getSelectedRowsCount()).toEqual(1, 'Incorrect number of selected rows');
        expect(await selectTemplateDialog.dataTable.getSelectedRowsNames()).toEqual([ template2InRootFolder ], 'Incorrect selected item');
      });

      it('Links to files are not displayed - [C325050]', async () => {
        expect(await selectTemplateDialog.dataTable.isItemPresent(link)).toBe(false, 'Link to file is displayed');
      });

      it('Cancel the Select template dialog - [C325048]', async () => {
        expect(await selectTemplateDialog.isCancelButtonEnabled()).toBe(true, 'Cancel button is not enabled');

        await selectTemplateDialog.clickCancel();

        expect(await selectTemplateDialog.isDialogOpen()).toBe(false, 'Select Template dialog is open');
      });

      it('Next button is disabled when selecting a folder - [C216339]', async () => {
        expect(await selectTemplateDialog.isNextButtonEnabled()).toBe(false, 'Next button is enabled');

        await selectTemplateDialog.dataTable.selectItem(templatesFolder1);

        expect(await selectTemplateDialog.isNextButtonEnabled()).toBe(false, 'Next button is enabled');
      });
    });

    describe('Create from template dialog', () => {
      beforeEach(async () => {
        await sidenav.openCreateFileFromTemplateDialog();
        await selectTemplateDialog.waitForDialogToOpen();
        await selectTemplateDialog.dataTable.selectItem(template1InRootFolder);
        await selectTemplateDialog.clickNext();
        await createFromTemplateDialog.waitForDialogToOpen();
      });

      it('Create file from template - dialog UI - [C325020]', async () => {
        expect(await createFromTemplateDialog.getTitle()).toEqual(`Create new document from '${template1InRootFolder}'`);
        expect(await createFromTemplateDialog.isNameFieldDisplayed()).toBe(true, 'Name field not displayed');
        expect(await createFromTemplateDialog.isTitleFieldDisplayed()).toBe(true, 'Title field not displayed');
        expect(await createFromTemplateDialog.isDescriptionFieldDisplayed()).toBe(true, 'Description field not displayed');
        expect(await createFromTemplateDialog.isCancelButtonEnabled()).toBe(true, 'Cancel button is not enabled');
        expect(await createFromTemplateDialog.isCreateButtonEnabled()).toBe(true, 'Create button is not enabled');
      });

      it('File name is required - [C325031]', async () => {
        expect(await createFromTemplateDialog.getName()).toEqual(template1InRootFolder);
        await createFromTemplateDialog.deleteNameWithBackspace();

        expect(await createFromTemplateDialog.getValidationMessage()).toEqual('Name is required');
        expect(await createFromTemplateDialog.isCreateButtonEnabled()).toBe(false, 'Create button is not disabled');
      });

      it('Special characters in file name - [C325032]', async () => {
        const namesWithSpecialChars = [ 'a*a', 'a"a', 'a<a', 'a>a', `a\\a`, 'a/a', 'a?a', 'a:a', 'a|a' ];

        for (const name of namesWithSpecialChars) {
          await createFromTemplateDialog.enterName(name);
          expect(await createFromTemplateDialog.isCreateButtonEnabled()).toBe(false, 'Create button is not disabled');
          expect(await createFromTemplateDialog.getValidationMessage()).toContain(`Name can't contain these characters`);
        }
      });

      it('File name ending with a dot - [C325033]', async () => {
        await createFromTemplateDialog.enterName('file-name.');

        expect(await createFromTemplateDialog.isCreateButtonEnabled()).toBe(false, 'Create button is not disabled');
        expect(await createFromTemplateDialog.getValidationMessage()).toMatch(`Name can't end with a period .`);
      });

      it('File name containing only spaces - [C325034]', async () => {
        await createFromTemplateDialog.enterName('    ');

        expect(await createFromTemplateDialog.isCreateButtonEnabled()).toBe(false, 'Create button is not disabled');
        expect(await createFromTemplateDialog.getValidationMessage()).toMatch(`Name can't contain only spaces`);
      });

      it('Title too long - [C290146]', async () => {
        await createFromTemplateDialog.enterTitle(Utils.string257);
        await Utils.pressTab();

        expect(await createFromTemplateDialog.isCreateButtonEnabled()).toBe(false, 'Create button is not disabled');
        expect(await createFromTemplateDialog.getValidationMessage()).toMatch(`Use 256 characters or less for title`);
      });

      it('Description too long - [C290142]', async () => {
        await createFromTemplateDialog.enterDescription(Utils.string513);
        await Utils.pressTab();

        expect(await createFromTemplateDialog.isCreateButtonEnabled()).toBe(false, 'Create button is not disabled');
        expect(await createFromTemplateDialog.getValidationMessage()).toMatch(`Use 512 characters or less for description`);
      });
    });

    describe('On Personal Files', () => {
      beforeEach(async () => {
        await page.clickPersonalFilesAndWait();
        await page.dataTable.doubleClickOnRowByName(parent);
        await sidenav.openCreateFileFromTemplateDialog();
        await selectTemplateDialog.waitForDialogToOpen();
        await selectTemplateDialog.dataTable.selectItem(template1InRootFolder);
        await selectTemplateDialog.clickNext();
        await createFromTemplateDialog.waitForDialogToOpen();
      });

      it('Create a file from a template - with a new Name - [C325030]', async () => {
        await createFromTemplateDialog.enterName(file1.name);
        await createFromTemplateDialog.clickCreate();
        await createFromTemplateDialog.waitForDialogToClose();
        await page.dataTable.waitForHeader();

        expect(await page.dataTable.isItemPresent(file1.name)).toBe(true, 'File not displayed in list view');
      });

      it('Create a file from a template - with a Name, Title and Description - [C325026]', async () => {
        await createFromTemplateDialog.enterName(file2.name);
        await createFromTemplateDialog.enterTitle(file2.title);
        await createFromTemplateDialog.enterDescription(file2.description);
        await createFromTemplateDialog.clickCreate();
        await createFromTemplateDialog.waitForDialogToClose();
        await page.dataTable.waitForHeader();

        expect(await page.dataTable.isItemPresent(file2.name)).toBe(true, 'File not displayed in list view');
        const desc = await userApi.nodes.getNodeDescription(file2.name, parentId);
        expect(desc).toEqual(file2.description);
        const title = await userApi.nodes.getNodeTitle(file2.name, parentId);
        expect(title).toEqual(file2.title);
      });

      it('Create a file with a duplicate name - [C325028]', async () => {
        await createFromTemplateDialog.enterName(duplicateFileName);
        await createFromTemplateDialog.clickCreate();

        expect(await page.getSnackBarMessage()).toEqual(`This name is already in use, try a different name.`);
        expect(await createFromTemplateDialog.isDialogOpen()).toBe(true, 'dialog is not present');
      });

      it('Cancel file creation - [C325027]', async () => {
        await createFromTemplateDialog.enterName('test');
        await createFromTemplateDialog.clickCancel();

        expect(await createFromTemplateDialog.isDialogOpen()).not.toBe(true, 'dialog is not closed');
        expect(await page.dataTable.isItemPresent('test')).toBe(false, 'File should not appear in the list');
      });

      it('Trim spaces from file Name - [C325042]', async () => {
        await createFromTemplateDialog.enterName(nameWithSpaces);
        await createFromTemplateDialog.clickCreate();
        await createFromTemplateDialog.waitForDialogToClose();
        await page.dataTable.waitForHeader();

        expect(await page.dataTable.isItemPresent(nameWithSpaces.trim())).toBe(true, 'File not displayed in list view');
      });
    });

    describe('On File Libraries', () => {
      const fileLibrariesPage = new BrowsingPage();

      beforeEach(async () => {
        await fileLibrariesPage.goToMyLibrariesAndWait();
        await page.dataTable.doubleClickOnRowByName(siteName);
        await sidenav.openCreateFileFromTemplateDialog();
        await selectTemplateDialog.waitForDialogToOpen();
        await selectTemplateDialog.dataTable.selectItem(template1InRootFolder);
        await selectTemplateDialog.clickNext();
        await createFromTemplateDialog.waitForDialogToOpen();
      });

      it('Create a file from a template - with Name, Title and Description - [C325023]', async () => {
        await createFromTemplateDialog.enterName(fileSite.name);
        await createFromTemplateDialog.enterTitle(fileSite.title);
        await createFromTemplateDialog.enterDescription(fileSite.description);
        await createFromTemplateDialog.clickCreate();
        await createFromTemplateDialog.waitForDialogToClose();
        await page.dataTable.waitForHeader();

        expect(await page.dataTable.isItemPresent(fileSite.name)).toBe(true, 'File not displayed in list view');
        const desc = await userApi.nodes.getNodeDescription(fileSite.name, docLibUserSite);
        expect(desc).toEqual(fileSite.description);
        const title = await userApi.nodes.getNodeTitle(fileSite.name, docLibUserSite);
        expect(title).toEqual(fileSite.title);
      });

      it('Cancel file creation - [C325024]', async () => {
        await createFromTemplateDialog.enterName('test');
        await createFromTemplateDialog.clickCancel();

        expect(await createFromTemplateDialog.isDialogOpen()).not.toBe(true, 'dialog is not closed');
        expect(await page.dataTable.isItemPresent('test')).toBe(false, 'File should not appear in the list');
      });

      it('Create a file with a duplicate name - [C325025]', async () => {
        await createFromTemplateDialog.enterName(duplicateFileSite);
        await createFromTemplateDialog.clickCreate();

        expect(await page.getSnackBarMessage()).toEqual(`This name is already in use, try a different name.`);
        expect(await createFromTemplateDialog.isDialogOpen()).toBe(true, 'dialog is not present');
      });
    });
  });

});
