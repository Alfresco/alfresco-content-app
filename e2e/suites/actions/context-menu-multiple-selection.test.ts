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
import { SITE_VISIBILITY, SIDEBAR_LABELS } from '../../configs';
import { RepoClient } from '../../utilities/repo-client/repo-client';
import { Utils } from '../../utilities/utils';

describe('Context menu actions - multiple selection : ', () => {
  const username = `user-${Utils.random()}`;

  const file1 = `file1-${Utils.random()}.txt`; let file1Id;
  const file2 = `file2-${Utils.random()}.txt`; let file2Id;

  const folder1 = `folder1-${Utils.random()}`; let folder1Id;
  const folder2 = `folder2-${Utils.random()}`; let folder2Id;

  const fileInTrash1 = `deletedFile1-${Utils.random()}.txt`; let fileInTrash1Id;
  const fileInTrash2 = `deletedFile2-${Utils.random()}.txt`; let fileInTrash2Id;
  const folderInTrash1 = `deletedFolder1-${Utils.random()}`; let folderInTrash1Id;
  const folderInTrash2 = `deletedFolder2-${Utils.random()}`; let folderInTrash2Id;

  const siteName = `site-${Utils.random()}`;
  const file1Site = `file1-${Utils.random()}.txt`;
  const file2Site = `file2-${Utils.random()}.txt`;
  const folder1Site = `folder1-${Utils.random()}`;
  const folder2Site = `folder2-${Utils.random()}`;

  const apis = {
      admin: new RepoClient(),
      user: new RepoClient(username, username)
  };

  const loginPage = new LoginPage();
  const logoutPage = new LogoutPage();
  const page = new BrowsingPage();
  const { dataTable } = page;
  const contextMenu = dataTable.menu;

  beforeAll(async (done) => {
    await apis.admin.people.createUser({ username });
    file1Id = (await apis.user.nodes.createFile(file1)).entry.id;
    file2Id = (await apis.user.nodes.createFile(file2)).entry.id;
    folder1Id = (await apis.user.nodes.createFolder(folder1)).entry.id;
    folder2Id = (await apis.user.nodes.createFolder(folder2)).entry.id;

    await apis.user.sites.createSite(siteName, SITE_VISIBILITY.PUBLIC);
    const docLibId = (await apis.user.sites.getDocLibId(siteName));
    await apis.user.nodes.createFile(file1Site, docLibId);
    await apis.user.nodes.createFile(file2Site, docLibId);
    await apis.user.nodes.createFolder(folder1Site, docLibId);
    await apis.user.nodes.createFile(folder2Site, docLibId);

    await apis.user.shared.shareFilesByIds([ file1Id, file2Id ]);
    await apis.user.shared.waitForApi({ expect: 2 });

    await apis.user.favorites.addFavoritesByIds('file', [ file1Id, file2Id ]);
    await apis.user.favorites.addFavoritesByIds('folder', [ folder1Id, folder2Id ]);
    await apis.user.favorites.waitForApi({ expect: 4 + 1 });

    fileInTrash1Id = (await apis.user.nodes.createFile(fileInTrash1)).entry.id;
    fileInTrash2Id = (await apis.user.nodes.createFile(fileInTrash2)).entry.id;
    folderInTrash1Id = (await apis.user.nodes.createFolder(folderInTrash1)).entry.id;
    folderInTrash2Id = (await apis.user.nodes.createFolder(folderInTrash2)).entry.id;
    await apis.user.nodes.deleteNodesById([ fileInTrash1Id, fileInTrash2Id, folderInTrash1Id, folderInTrash2Id ], false);

    await loginPage.loginWith(username);
    done();
  });

  afterAll(async (done) => {
    await apis.user.nodes.deleteNodesById([ file1Id, file2Id, folder1Id, folder2Id ]);
    await apis.user.sites.deleteSite(siteName);
    await apis.user.trashcan.emptyTrash();
    await logoutPage.load();
    done();
  });

  xit('');

  describe('Generic tests', () => {
    beforeEach(async (done) => {
      await Utils.pressEscape();
      await page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.PERSONAL_FILES);
      await dataTable.waitForHeader();
      await dataTable.clearSelection();
      done();
    });

    it('Context menu appears on right click on a multiple selection of items - [C286268]', async () => {
      await dataTable.selectMultipleItems([ file1, file2 ]);
      // await dataTable.rightClickOnItem(file1);
      await dataTable.rightClickOnMultipleSelection();
      expect(await dataTable.hasContextMenu()).toBe(true, 'Context menu is not displayed');
    });

    it('Context menu appears when right clicking on a single item while having multiple items selected - [C286269]', async () => {
      await dataTable.selectMultipleItems([ file2, folder1 ]);
      await dataTable.rightClickOnItem(file1);
      expect(await dataTable.hasContextMenu()).toBe(true, `Context menu is not displayed for ${file1}`);
      expect(await dataTable.countSelectedRows()).toEqual(1, 'incorrect number of selected rows');
      expect(await contextMenu.isMenuItemPresent('Edit')).toBe(false, `Edit is displayed for ${file1}`);
      expect(await dataTable.hasCheckMarkIcon(file1)).toBe(true, `${file1} is not selected`);
      expect(await dataTable.hasCheckMarkIcon(file2)).toBe(false, `${file2} is selected`);
      expect(await dataTable.hasCheckMarkIcon(folder1)).toBe(false, `${folder1} is selected`);
    });
  });

  describe('on Personal Files', () => {
    beforeEach(async (done) => {
      await Utils.pressEscape();
      await page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.PERSONAL_FILES);
      await dataTable.waitForHeader();
      await dataTable.clearSelection();
      done();
    });

    it('correct actions appear when multiple files are selected - [C280661]', async () => {
      await dataTable.selectMultipleItems([file1, file2]);
      await dataTable.rightClickOnMultipleSelection();
      expect(await contextMenu.isMenuItemPresent('View')).toBe(false, 'View is displayed');
      expect(await contextMenu.isMenuItemPresent('Download')).toBe(true, 'Download is not displayed');
      expect(await contextMenu.isMenuItemPresent('Copy')).toBe(true, `Copy is not displayed`);
      expect(await contextMenu.isMenuItemPresent('Delete')).toBe(true, `Delete is not displayed`);
      expect(await contextMenu.isMenuItemPresent('Move')).toBe(true, `Move is not displayed`);
      expect(await contextMenu.isMenuItemPresent('Favorite')).toBe(true, `Favorite is not displayed`);
      expect(await contextMenu.isMenuItemPresent('Permissions')).toBe(true, `Permissions is not displayed`);
    });

    it('correct actions appear when multiple folders are selected - [C280632]', async () => {
      await dataTable.selectMultipleItems([folder1, folder2]);
      await dataTable.rightClickOnMultipleSelection();
      expect(await contextMenu.isMenuItemPresent('View')).toBe(false, 'View is displayed');
      expect(await contextMenu.isMenuItemPresent('Download')).toBe(true, 'Download is not displayed');
      expect(await contextMenu.isMenuItemPresent('Edit')).toBe(false, 'Edit is displayed');
      expect(await contextMenu.isMenuItemPresent('Copy')).toBe(true, `Copy is not displayed`);
      expect(await contextMenu.isMenuItemPresent('Delete')).toBe(true, `Delete is not displayed`);
      expect(await contextMenu.isMenuItemPresent('Move')).toBe(true, `Move is not displayed`);
      expect(await contextMenu.isMenuItemPresent('Favorite')).toBe(true, `Favorite is not displayed`);
      expect(await contextMenu.isMenuItemPresent('Permissions')).toBe(true, `Permissions is not displayed`);
    });

    it('correct actions appear when both files and folders are selected - [C280631]', async () => {
      await dataTable.selectMultipleItems([file1, file2, folder1, folder2]);
      await dataTable.rightClickOnMultipleSelection();
      expect(await contextMenu.isMenuItemPresent('View')).toBe(false, 'View is displayed');
      expect(await contextMenu.isMenuItemPresent('Download')).toBe(true, 'Download is not displayed');
      expect(await contextMenu.isMenuItemPresent('Edit')).toBe(false, 'Edit is displayed');
      expect(await contextMenu.isMenuItemPresent('Copy')).toBe(true, `Copy is not displayed`);
      expect(await contextMenu.isMenuItemPresent('Delete')).toBe(true, `Delete is not displayed`);
      expect(await contextMenu.isMenuItemPresent('Move')).toBe(true, `Move is not displayed`);
      expect(await contextMenu.isMenuItemPresent('Favorite')).toBe(true, `Favorite is not displayed`);
      expect(await contextMenu.isMenuItemPresent('Permissions')).toBe(true, `Permissions is not displayed`);
    });
  });

  describe('on File Libraries', () => {
    beforeEach(async (done) => {
      await Utils.pressEscape();
      await page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.FILE_LIBRARIES);
      await dataTable.waitForHeader();
      await dataTable.doubleClickOnRowByName(siteName);
      await dataTable.waitForHeader();
      await dataTable.clearSelection();
      done();
    });

    it('correct actions appear when multiple files are selected - [C280641]', async () => {
      await dataTable.selectMultipleItems([ file1Site, file2Site ]);
      await dataTable.rightClickOnMultipleSelection();
      expect(await contextMenu.isMenuItemPresent('View')).toBe(false, 'View is displayed');
      expect(await contextMenu.isMenuItemPresent('Download')).toBe(true, 'Download is not displayed');
      expect(await contextMenu.isMenuItemPresent('Edit')).toBe(false, 'Edit is displayed');
      expect(await contextMenu.isMenuItemPresent('Copy')).toBe(true, `Copy is not displayed`);
      expect(await contextMenu.isMenuItemPresent('Delete')).toBe(true, `Delete is not displayed`);
      expect(await contextMenu.isMenuItemPresent('Move')).toBe(true, `Move is not displayed`);
      expect(await contextMenu.isMenuItemPresent('Favorite')).toBe(true, `Favorite is not displayed`);
      expect(await contextMenu.isMenuItemPresent('Permissions')).toBe(true, `Permissions is not displayed`);
    });

    it('correct actions appear when multiple folders are selected - [C280574]', async () => {
      await dataTable.selectMultipleItems([ folder1Site, folder2Site ]);
      await dataTable.rightClickOnMultipleSelection();
      expect(await contextMenu.isMenuItemPresent('View')).toBe(false, 'View is displayed');
      expect(await contextMenu.isMenuItemPresent('Download')).toBe(true, 'Download is not displayed');
      expect(await contextMenu.isMenuItemPresent('Edit')).toBe(false, 'Edit is displayed');
      expect(await contextMenu.isMenuItemPresent('Copy')).toBe(true, `Copy is not displayed`);
      expect(await contextMenu.isMenuItemPresent('Delete')).toBe(true, `Delete is not displayed`);
      expect(await contextMenu.isMenuItemPresent('Move')).toBe(true, `Move is not displayed`);
      expect(await contextMenu.isMenuItemPresent('Favorite')).toBe(true, `Favorite is not displayed`);
      expect(await contextMenu.isMenuItemPresent('Permissions')).toBe(true, `Permissions is not displayed`);
    });

    it('correct actions appear when both files and folders are selected - [C280642]', async () => {
      await dataTable.selectMultipleItems([ file1Site, file2Site, folder1Site, folder2Site ]);
      await dataTable.rightClickOnMultipleSelection();
      expect(await contextMenu.isMenuItemPresent('View')).toBe(false, 'View is displayed');
      expect(await contextMenu.isMenuItemPresent('Download')).toBe(true, 'Download is not displayed');
      expect(await contextMenu.isMenuItemPresent('Edit')).toBe(false, 'Edit is displayed');
      expect(await contextMenu.isMenuItemPresent('Copy')).toBe(true, `Copy is not displayed`);
      expect(await contextMenu.isMenuItemPresent('Delete')).toBe(true, `Delete is not displayed`);
      expect(await contextMenu.isMenuItemPresent('Move')).toBe(true, `Move is not displayed`);
      expect(await contextMenu.isMenuItemPresent('Favorite')).toBe(true, `Favorite is not displayed`);
      expect(await contextMenu.isMenuItemPresent('Permissions')).toBe(true, `Permissions is not displayed`);
    });
  });

  describe('on Shared Files', () => {
    beforeEach(async (done) => {
      await Utils.pressEscape();
      await page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.SHARED_FILES);
      await dataTable.waitForHeader();
      await dataTable.clearSelection();
      done();
    });

    it('correct actions appear when multiple files are selected - [C280648]', async () => {
      await dataTable.selectMultipleItems([ file1, file2 ]);
      await dataTable.rightClickOnMultipleSelection();
      expect(await contextMenu.isMenuItemPresent('View')).toBe(false, 'View is displayed');
      expect(await contextMenu.isMenuItemPresent('Download')).toBe(true, 'Download is not displayed');
      expect(await contextMenu.isMenuItemPresent('Edit')).toBe(false, 'Edit is displayed');
      expect(await contextMenu.isMenuItemPresent('Copy')).toBe(true, `Copy is not displayed`);
      expect(await contextMenu.isMenuItemPresent('Delete')).toBe(true, `Delete is not displayed`);
      expect(await contextMenu.isMenuItemPresent('Move')).toBe(true, `Move is not displayed`);
      expect(await contextMenu.isMenuItemPresent('Favorite')).toBe(true, `Favorite is not displayed`);
      expect(await contextMenu.isMenuItemPresent('Permissions')).toBe(true, `Permissions is not displayed`);
    });
  });

  describe('Recent Files', () => {
    beforeEach(async (done) => {
      await Utils.pressEscape();
      await page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.RECENT_FILES);
      await dataTable.waitForHeader();
      await dataTable.clearSelection();
      done();
    });

    it('correct actions appear when multiple files are selected - [C280652]', async () => {
      await dataTable.selectMultipleItems([ file1, file2 ]);
      await dataTable.rightClickOnMultipleSelection();
      expect(await contextMenu.isMenuItemPresent('View')).toBe(false, 'View is displayed');
      expect(await contextMenu.isMenuItemPresent('Download')).toBe(true, 'Download is not displayed');
      expect(await contextMenu.isMenuItemPresent('Edit')).toBe(false, 'Edit is displayed');
      expect(await contextMenu.isMenuItemPresent('Copy')).toBe(true, `Copy is not displayed`);
      expect(await contextMenu.isMenuItemPresent('Delete')).toBe(true, `Delete is not displayed`);
      expect(await contextMenu.isMenuItemPresent('Move')).toBe(true, `Move is not displayed`);
      expect(await contextMenu.isMenuItemPresent('Favorite')).toBe(true, `Favorite is not displayed`);
      expect(await contextMenu.isMenuItemPresent('Permissions')).toBe(true, `Permissions is not displayed`);
    });
  });

  describe('Favorites', () => {
    beforeEach(async (done) => {
      await Utils.pressEscape();
      await page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.FAVORITES);
      await dataTable.waitForHeader();
      await dataTable.clearSelection();
      done();
    });

    it('correct actions appear when multiple files are selected - [C280656]', async () => {
      await dataTable.selectMultipleItems([ file1, file2 ]);
      await dataTable.rightClickOnMultipleSelection();
      expect(await contextMenu.isMenuItemPresent('View')).toBe(false, 'View is displayed');
      expect(await contextMenu.isMenuItemPresent('Download')).toBe(true, 'Download is not displayed');
      expect(await contextMenu.isMenuItemPresent('Edit')).toBe(false, 'Edit is displayed');
      expect(await contextMenu.isMenuItemPresent('Copy')).toBe(true, `Copy is not displayed`);
      expect(await contextMenu.isMenuItemPresent('Delete')).toBe(true, `Delete is not displayed`);
      expect(await contextMenu.isMenuItemPresent('Move')).toBe(true, `Move is not displayed`);
      expect(await contextMenu.isMenuItemPresent('Favorite')).toBe(true, `Favorite is not displayed`);
      // TODO: enable when ACA-1794 is fixed
      // expect(await contextMenu.isMenuItemPresent('Permissions')).toBe(true, `Permissions is not displayed`);
    });

    it('correct actions appear when multiple folders are selected - [C280664]', async () => {
      await dataTable.selectMultipleItems([ folder1, folder2 ]);
      await dataTable.rightClickOnMultipleSelection();
      expect(await contextMenu.isMenuItemPresent('View')).toBe(false, 'View is displayed');
      expect(await contextMenu.isMenuItemPresent('Download')).toBe(true, 'Download is not displayed');
      expect(await contextMenu.isMenuItemPresent('Edit')).toBe(false, 'Edit is displayed');
      expect(await contextMenu.isMenuItemPresent('Copy')).toBe(true, `Copy is not displayed`);
      expect(await contextMenu.isMenuItemPresent('Delete')).toBe(true, `Delete is not displayed`);
      expect(await contextMenu.isMenuItemPresent('Move')).toBe(true, `Move is not displayed`);
      expect(await contextMenu.isMenuItemPresent('Favorite')).toBe(true, `Favorite is not displayed`);
      // TODO: enable when ACA-1794 is fixed
      // expect(await contextMenu.isMenuItemPresent('Permissions')).toBe(true, `Permissions is not displayed`);
    });

    it('correct actions appear when both files and folders are selected - [C280657]', async () => {
      await dataTable.selectMultipleItems([ file1, file2, folder1, folder2 ]);
      await dataTable.rightClickOnMultipleSelection();
      expect(await contextMenu.isMenuItemPresent('View')).toBe(false, 'View is displayed');
      expect(await contextMenu.isMenuItemPresent('Download')).toBe(true, 'Download is not displayed');
      expect(await contextMenu.isMenuItemPresent('Edit')).toBe(false, 'Edit is displayed');
      expect(await contextMenu.isMenuItemPresent('Copy')).toBe(true, `Copy is not displayed`);
      expect(await contextMenu.isMenuItemPresent('Delete')).toBe(true, `Delete is not displayed`);
      expect(await contextMenu.isMenuItemPresent('Move')).toBe(true, `Move is not displayed`);
      expect(await contextMenu.isMenuItemPresent('Favorite')).toBe(true, `Favorite is not displayed`);
      // TODO: enable when ACA-1794 is fixed
      // expect(await contextMenu.isMenuItemPresent('Permissions')).toBe(true, `Permissions is not displayed`);
    });
  });

  describe('Trash', () => {
    beforeEach(async (done) => {
      await Utils.pressEscape();
      await page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.TRASH);
      await dataTable.waitForHeader();
      await dataTable.clearSelection();
      done();
    });

    it('correct actions appear when multiple files are selected - [C286273]', async () => {
      await dataTable.selectMultipleItems([ fileInTrash1, fileInTrash2 ]);
      await dataTable.rightClickOnMultipleSelection();
      expect(await contextMenu.isMenuItemPresent('Permanently delete')).toBe(true, 'Permanently delete is not displayed');
      expect(await contextMenu.isMenuItemPresent('Restore')).toBe(true, 'Restore is not displayed');
      expect(await contextMenu.isMenuItemPresent('View')).toBe(false, 'View is displayed');
      expect(await contextMenu.isMenuItemPresent('Download')).toBe(false, 'Download is displayed');
      expect(await contextMenu.isMenuItemPresent('Edit')).toBe(false, 'Edit is displayed');
      expect(await contextMenu.isMenuItemPresent('Copy')).toBe(false, `Copy is displayed`);
      expect(await contextMenu.isMenuItemPresent('Delete')).toBe(false, `Delete is displayed`);
      expect(await contextMenu.isMenuItemPresent('Move')).toBe(false, `Move is displayed`);
      expect(await contextMenu.isMenuItemPresent('Favorite')).toBe(false, `Favorite is displayed`);
    });

    it('correct actions appear when multiple folders are selected - [C286274]', async () => {
      await dataTable.selectMultipleItems([ folderInTrash1, folderInTrash2 ]);
      await dataTable.rightClickOnMultipleSelection();
      expect(await contextMenu.isMenuItemPresent('Permanently delete')).toBe(true, 'Permanently delete is not displayed');
      expect(await contextMenu.isMenuItemPresent('Restore')).toBe(true, 'Restore is not displayed');
      expect(await contextMenu.isMenuItemPresent('View')).toBe(false, 'View is displayed');
      expect(await contextMenu.isMenuItemPresent('Download')).toBe(false, 'Download is displayed');
      expect(await contextMenu.isMenuItemPresent('Edit')).toBe(false, 'Edit is displayed');
      expect(await contextMenu.isMenuItemPresent('Copy')).toBe(false, `Copy is displayed`);
      expect(await contextMenu.isMenuItemPresent('Delete')).toBe(false, `Delete is displayed`);
      expect(await contextMenu.isMenuItemPresent('Move')).toBe(false, `Move is displayed`);
      expect(await contextMenu.isMenuItemPresent('Favorite')).toBe(false, `Favorite is displayed`);
    });

    it('correct actions appear when both files and folders are selected - [C286275]', async () => {
      await dataTable.selectMultipleItems([ fileInTrash1, fileInTrash2, folderInTrash1, folderInTrash2 ]);
      await dataTable.rightClickOnMultipleSelection();
      expect(await contextMenu.isMenuItemPresent('Permanently delete')).toBe(true, 'Permanently delete is not displayed');
      expect(await contextMenu.isMenuItemPresent('Restore')).toBe(true, 'Restore is not displayed');
      expect(await contextMenu.isMenuItemPresent('View')).toBe(false, 'View is displayed');
      expect(await contextMenu.isMenuItemPresent('Download')).toBe(false, 'Download is displayed');
      expect(await contextMenu.isMenuItemPresent('Edit')).toBe(false, 'Edit is displayed');
      expect(await contextMenu.isMenuItemPresent('Copy')).toBe(false, `Copy is displayed`);
      expect(await contextMenu.isMenuItemPresent('Delete')).toBe(false, `Delete is displayed`);
      expect(await contextMenu.isMenuItemPresent('Move')).toBe(false, `Move is displayed`);
      expect(await contextMenu.isMenuItemPresent('Favorite')).toBe(false, `Favorite is displayed`);
    });
  });
});
