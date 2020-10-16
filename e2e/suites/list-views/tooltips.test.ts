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

import { BrowsingPage, Utils, RepoClient, CoreActions } from '@alfresco/aca-testing-shared';
import { ApiService, LoginPage, UsersActions, UserModel } from '@alfresco/adf-testing';
import { browser } from 'protractor';

describe('File / folder tooltips', () => {
  let user: UserModel;

  const parent = `parent-${Utils.random()}`;

  const file = `file1-${Utils.random()}`;
  const fileWithDesc = `file2-${Utils.random()}`;
  const fileWithTitle = `file3-${Utils.random()}`;
  const fileWithTitleAndDesc = `file4-${Utils.random()}`;
  const fileNameEqTitleEqDesc = `file5-${Utils.random()}`;
  const fileNameEqTitleDiffDesc = `file6-${Utils.random()}`;
  const fileNameEqDescDiffTitle = `file7-${Utils.random()}`;
  const fileTitleEqDesc = `file8-${Utils.random()}`;
  let parentId, file1Id, file2Id, file3Id, file4Id, file5Id, file6Id, file7Id, file8Id;

  const fileTitle = 'file title';
  const fileDescription = 'file description';

  const loginPage = new LoginPage();
  const page = new BrowsingPage();
  const { dataTable } = page;

  const apiService = new ApiService();
  const usersActions = new UsersActions(apiService);
  const repo = new RepoClient(apiService);
  const coreActions = new CoreActions(apiService);

  beforeAll(async (done) => {
    await apiService.getInstance().login(browser.params.testConfig.admin.email, browser.params.testConfig.admin.password);
    user = await usersActions.createUser();
    await apiService.getInstance().login(user.email, user.password);

    parentId = (await repo.nodes.createFolder(parent)).entry.id;

    file1Id = (await repo.nodes.createFile(file, parentId)).entry.id;
    file2Id = (await repo.nodes.createFile(fileWithDesc, parentId, '', fileDescription)).entry.id;
    file3Id = (await repo.nodes.createFile(fileWithTitle, parentId, fileTitle)).entry.id;
    file4Id = (await repo.nodes.createFile(fileWithTitleAndDesc, parentId, fileTitle, fileDescription)).entry.id;
    file5Id = (await repo.nodes.createFile(fileNameEqTitleEqDesc, parentId, fileNameEqTitleEqDesc, fileNameEqTitleEqDesc)).entry.id;
    file6Id = (await repo.nodes.createFile(fileNameEqTitleDiffDesc, parentId, fileNameEqTitleDiffDesc, fileDescription)).entry.id;
    file7Id = (await repo.nodes.createFile(fileNameEqDescDiffTitle, parentId, fileTitle, fileNameEqDescDiffTitle)).entry.id;
    file8Id = (await repo.nodes.createFile(fileTitleEqDesc, parentId, fileTitle, fileTitle)).entry.id;

    const initialSharedTotalItems = await repo.shared.getSharedLinksTotalItems();
    await repo.shared.shareFilesByIds([file1Id, file2Id, file3Id, file4Id, file5Id, file6Id, file7Id, file8Id]);

    await repo.favorites.addFavoritesByIds('file', [file1Id, file2Id, file3Id, file4Id, file5Id, file6Id, file7Id, file8Id]);

    await repo.shared.waitForApi({ expect: initialSharedTotalItems + 8 });

    await loginPage.login(user.email, user.password);
    done();
  });

  afterAll(async (done) => {
    await coreActions.deleteNodes([parent]);
    await coreActions.emptyTrashcan();
    done();
  });

  describe('on Personal Files', () => {
    beforeAll(async (done) => {
      await page.clickPersonalFilesAndWait();
      await dataTable.doubleClickOnRowByName(parent);
      done();
    });

    it('[C255871] File with name, no title, no description', async () => {
      expect(await dataTable.getItemNameTooltip(file)).toEqual(`${file}`);
    });

    it('[C255872] File with name and description, no title', async () => {
      expect(await dataTable.getItemNameTooltip(fileWithDesc)).toEqual(`${fileWithDesc}\n${fileDescription}`);
    });

    it('[C255873] File with name and title, no description', async () => {
      expect(await dataTable.getItemNameTooltip(fileWithTitle)).toEqual(`${fileWithTitle}\n${fileTitle}`);
    });

    it('[C255874] File with name and title and description, all different', async () => {
      expect(await dataTable.getItemNameTooltip(fileWithTitleAndDesc)).toEqual(`${fileTitle}\n${fileDescription}`);
    });

    it('[C255875] File with name and title and description, all equal', async () => {
      expect(await dataTable.getItemNameTooltip(fileNameEqTitleEqDesc)).toEqual(`${fileNameEqTitleEqDesc}`);
    });

    it('[C255876] File with name = title, different description', async () => {
      expect(await dataTable.getItemNameTooltip(fileNameEqTitleDiffDesc)).toEqual(`${fileNameEqTitleDiffDesc}\n${fileDescription}`);
    });

    it('[C255877] File with name = description, different title', async () => {
      expect(await dataTable.getItemNameTooltip(fileNameEqDescDiffTitle)).toEqual(`${fileTitle}\n${fileNameEqDescDiffTitle}`);
    });

    it('[C255878] File with title = description, different name', async () => {
      expect(await dataTable.getItemNameTooltip(fileTitleEqDesc)).toEqual(`${fileTitle}`);
    });
  });

  describe('on Recent Files', () => {
    beforeAll(async (done) => {
      await repo.search.waitForApi(user.username, { expect: 8 });
      await page.clickRecentFilesAndWait();
      done();
    });

    it('[C280135] File with name, no title, no description', async () => {
      expect(await dataTable.getItemNameTooltip(file)).toEqual(`${file}`);
    });

    it('[C280136] File with name and description, no title', async () => {
      expect(await dataTable.getItemNameTooltip(fileWithDesc)).toEqual(`${fileWithDesc}\n${fileDescription}`);
    });

    it('[C280137] File with name and title, no description', async () => {
      expect(await dataTable.getItemNameTooltip(fileWithTitle)).toEqual(`${fileWithTitle}\n${fileTitle}`);
    });

    it('[C280138] File with name and title and description, all different', async () => {
      expect(await dataTable.getItemNameTooltip(fileWithTitleAndDesc)).toEqual(`${fileTitle}\n${fileDescription}`);
    });

    it('[C280139] File with name and title and description, all equal', async () => {
      expect(await dataTable.getItemNameTooltip(fileNameEqTitleEqDesc)).toEqual(`${fileNameEqTitleEqDesc}`);
    });

    it('[C280140] File with name = title, different description', async () => {
      expect(await dataTable.getItemNameTooltip(fileNameEqTitleDiffDesc)).toEqual(`${fileNameEqTitleDiffDesc}\n${fileDescription}`);
    });

    it('[C280141] File with name = description, different title', async () => {
      expect(await dataTable.getItemNameTooltip(fileNameEqDescDiffTitle)).toEqual(`${fileTitle}\n${fileNameEqDescDiffTitle}`);
    });

    it('[C280142] File with title = description, different name', async () => {
      expect(await dataTable.getItemNameTooltip(fileTitleEqDesc)).toEqual(`${fileTitle}`);
    });
  });

  // disabled until ACA-518 is done
  xdescribe('on Shared Files', () => {
    beforeAll(async (done) => {
      await page.clickSharedFilesAndWait();
      done();
    });

    xit('[C280143] File with name, no title, no description', async () => {
      expect(await dataTable.getItemNameTooltip(file)).toEqual(`${file}`);
    });

    xit('[C280144] File with name and description, no title', async () => {
      expect(await dataTable.getItemNameTooltip(fileWithDesc)).toEqual(`${fileWithDesc}\n${fileDescription}`);
    });

    xit('[C280145] File with name and title, no description', async () => {
      expect(await dataTable.getItemNameTooltip(fileWithTitle)).toEqual(`${fileWithTitle}\n${fileTitle}`);
    });

    xit('[C280146] File with name and title and description, all different', async () => {
      expect(await dataTable.getItemNameTooltip(fileWithTitleAndDesc)).toEqual(`${fileTitle}\n${fileDescription}`);
    });

    xit('[C280147] File with name and title and description, all equal', async () => {
      expect(await dataTable.getItemNameTooltip(fileNameEqTitleEqDesc)).toEqual(`${fileNameEqTitleEqDesc}`);
    });

    xit('[C280148] File with name = title, different description', async () => {
      expect(await dataTable.getItemNameTooltip(fileNameEqTitleDiffDesc)).toEqual(`${fileNameEqTitleDiffDesc}\n${fileDescription}`);
    });

    xit('[C280149] File with name = description, different title', async () => {
      expect(await dataTable.getItemNameTooltip(fileNameEqDescDiffTitle)).toEqual(`${fileTitle}\n${fileNameEqDescDiffTitle}`);
    });

    xit('[C280150] File with title = description, different name', async () => {
      expect(await dataTable.getItemNameTooltip(fileTitleEqDesc)).toEqual(`${fileTitle}`);
    });
  });

  describe('on Favorites', () => {
    beforeAll(async (done) => {
      await page.clickFavoritesAndWait();
      done();
    });

    it('[C280151] File with name, no title, no description', async () => {
      expect(await dataTable.getItemNameTooltip(file)).toEqual(`${file}`);
    });

    it('[C280152] File with name and description, no title', async () => {
      expect(await dataTable.getItemNameTooltip(fileWithDesc)).toEqual(`${fileWithDesc}\n${fileDescription}`);
    });

    it('[C280153] File with name and title, no description', async () => {
      expect(await dataTable.getItemNameTooltip(fileWithTitle)).toEqual(`${fileWithTitle}\n${fileTitle}`);
    });

    it('[C280154] File with name and title and description, all different', async () => {
      expect(await dataTable.getItemNameTooltip(fileWithTitleAndDesc)).toEqual(`${fileTitle}\n${fileDescription}`);
    });

    it('[C280155] File with name and title and description, all equal', async () => {
      expect(await dataTable.getItemNameTooltip(fileNameEqTitleEqDesc)).toEqual(`${fileNameEqTitleEqDesc}`);
    });

    it('[C280156] File with name = title, different description', async () => {
      expect(await dataTable.getItemNameTooltip(fileNameEqTitleDiffDesc)).toEqual(`${fileNameEqTitleDiffDesc}\n${fileDescription}`);
    });

    it('[C280157] File with name = description, different title', async () => {
      expect(await dataTable.getItemNameTooltip(fileNameEqDescDiffTitle)).toEqual(`${fileTitle}\n${fileNameEqDescDiffTitle}`);
    });

    it('[C280158] File with title = description, different name', async () => {
      expect(await dataTable.getItemNameTooltip(fileTitleEqDesc)).toEqual(`${fileTitle}`);
    });
  });

  describe('on Trash', () => {
    const parentForTrash = `parent-${Utils.random()}`;
    let parentForTrashId, file1TrashId, file2TrashId, file3TrashId, file4TrashId;
    let file5TrashId, file6TrashId, file7TrashId, file8TrashId;

    beforeAll(async (done) => {
      parentForTrashId = (await repo.nodes.createFolder(parentForTrash)).entry.id;
      file1TrashId = (await repo.nodes.createFile(file, parentForTrashId)).entry.id;
      file2TrashId = (await repo.nodes.createFile(fileWithDesc, parentForTrashId, '', fileDescription)).entry.id;
      file3TrashId = (await repo.nodes.createFile(fileWithTitle, parentForTrashId, fileTitle)).entry.id;
      file4TrashId = (await repo.nodes.createFile(fileWithTitleAndDesc, parentForTrashId, fileTitle, fileDescription)).entry.id;
      file5TrashId = (await repo.nodes.createFile(fileNameEqTitleEqDesc, parentForTrashId, fileNameEqTitleEqDesc, fileNameEqTitleEqDesc)).entry.id;
      file6TrashId = (await repo.nodes.createFile(fileNameEqTitleDiffDesc, parentForTrashId, fileNameEqTitleDiffDesc, fileDescription)).entry.id;
      file7TrashId = (await repo.nodes.createFile(fileNameEqDescDiffTitle, parentForTrashId, fileTitle, fileNameEqDescDiffTitle)).entry.id;
      file8TrashId = (await repo.nodes.createFile(fileTitleEqDesc, parentForTrashId, fileTitle, fileTitle)).entry.id;

      await repo.nodes.deleteNodesById(
        [file1TrashId, file2TrashId, file3TrashId, file4TrashId, file5TrashId, file6TrashId, file7TrashId, file8TrashId],
        false
      );

      await page.clickTrashAndWait();
      done();
    });

    afterAll(async (done) => {
      await coreActions.deleteNodes([parentForTrash]);
      await coreActions.emptyTrashcan();
      done();
    });

    it('[C280159] File with name, no title, no description', async () => {
      expect(await dataTable.getItemNameTooltip(file)).toEqual(`${file}`);
    });

    it('[C280160] File with name and description, no title', async () => {
      expect(await dataTable.getItemNameTooltip(fileWithDesc)).toEqual(`${fileWithDesc}\n${fileDescription}`);
    });

    it('[C280161] File with name and title, no description', async () => {
      expect(await dataTable.getItemNameTooltip(fileWithTitle)).toEqual(`${fileWithTitle}\n${fileTitle}`);
    });

    it('[C280162] File with name and title and description, all different', async () => {
      expect(await dataTable.getItemNameTooltip(fileWithTitleAndDesc)).toEqual(`${fileTitle}\n${fileDescription}`);
    });

    it('[C280163] File with name and title and description, all equal', async () => {
      expect(await dataTable.getItemNameTooltip(fileNameEqTitleEqDesc)).toEqual(`${fileNameEqTitleEqDesc}`);
    });

    it('[C280164] File with name = title, different description', async () => {
      expect(await dataTable.getItemNameTooltip(fileNameEqTitleDiffDesc)).toEqual(`${fileNameEqTitleDiffDesc}\n${fileDescription}`);
    });

    it('[C280165] File with name = description, different title', async () => {
      expect(await dataTable.getItemNameTooltip(fileNameEqDescDiffTitle)).toEqual(`${fileTitle}\n${fileNameEqDescDiffTitle}`);
    });

    it('[C280166] File with title = description, different name', async () => {
      expect(await dataTable.getItemNameTooltip(fileTitleEqDesc)).toEqual(`${fileTitle}`);
    });
  });
});
