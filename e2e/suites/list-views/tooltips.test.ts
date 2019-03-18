/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2019 Alfresco Software Limited
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
import { Utils } from '../../utilities/utils';
import { RepoClient } from '../../utilities/repo-client/repo-client';

describe('File / folder tooltips', () => {
  const username = `user-${Utils.random()}`;

  const apis = {
    admin: new RepoClient(),
    user: new RepoClient(username, username)
  };

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

  beforeAll(async (done) => {
    await apis.admin.people.createUser({ username });
    parentId = (await apis.user.nodes.createFolder( parent )).entry.id;

    file1Id = (await apis.user.nodes.createFile(file, parentId)).entry.id;
    file2Id = (await apis.user.nodes.createFile(fileWithDesc, parentId, '', fileDescription)).entry.id;
    file3Id = (await apis.user.nodes.createFile(fileWithTitle, parentId, fileTitle)).entry.id;
    file4Id = (await apis.user.nodes.createFile(fileWithTitleAndDesc, parentId, fileTitle, fileDescription)).entry.id;
    file5Id = (await apis.user.nodes.createFile(fileNameEqTitleEqDesc, parentId, fileNameEqTitleEqDesc, fileNameEqTitleEqDesc)).entry.id;
    file6Id = (await apis.user.nodes.createFile(fileNameEqTitleDiffDesc, parentId, fileNameEqTitleDiffDesc, fileDescription)).entry.id;
    file7Id = (await apis.user.nodes.createFile(fileNameEqDescDiffTitle, parentId, fileTitle, fileNameEqDescDiffTitle)).entry.id;
    file8Id = (await apis.user.nodes.createFile(fileTitleEqDesc, parentId, fileTitle, fileTitle)).entry.id;

    await apis.user.shared.shareFilesByIds([ file1Id, file2Id, file3Id, file4Id, file5Id, file6Id, file7Id, file8Id ]);

    await apis.user.favorites.addFavoritesByIds('file', [
      file1Id, file2Id, file3Id, file4Id, file5Id, file6Id, file7Id, file8Id
    ]);

    await loginPage.loginWith(username);
    done();
  });

  afterAll(async (done) => {
    await Promise.all([
      apis.user.nodes.deleteNodes([ parent ]),
      apis.user.trashcan.emptyTrash()
    ]);
    done();
  });

  describe('on Personal Files', () => {
    beforeAll(async (done) => {
      await page.clickPersonalFilesAndWait();
      await dataTable.doubleClickOnRowByName(parent);
      done();
    });

    it('File with name, no title, no description - [C255871]', async () => {
      expect(await dataTable.getItemNameTooltip(file)).toEqual(`${file}`);
    });

    it('File with name and description, no title - [C255872]', async () => {
      expect(await dataTable.getItemNameTooltip(fileWithDesc)).toEqual(`${fileWithDesc}\n${fileDescription}`);
    });

    it('File with name and title, no description - [C255873]', async () => {
      expect(await dataTable.getItemNameTooltip(fileWithTitle)).toEqual(`${fileWithTitle}\n${fileTitle}`);
    });

    it('File with name and title and description, all different - [C255874]', async () => {
      expect(await dataTable.getItemNameTooltip(fileWithTitleAndDesc)).toEqual(`${fileTitle}\n${fileDescription}`);
    });

    it('File with name and title and description, all equal - [C255875]', async () => {
      expect(await dataTable.getItemNameTooltip(fileNameEqTitleEqDesc)).toEqual(`${fileNameEqTitleEqDesc}`);
    });

    it('File with name = title, different description - [C255876]', async () => {
      expect(await dataTable.getItemNameTooltip(fileNameEqTitleDiffDesc)).toEqual(`${fileNameEqTitleDiffDesc}\n${fileDescription}`);
    });

    it('File with name = description, different title - [C255877]', async () => {
      expect(await dataTable.getItemNameTooltip(fileNameEqDescDiffTitle)).toEqual(`${fileTitle}\n${fileNameEqDescDiffTitle}`);
    });

    it('File with title = description, different name - [C255878]', async () => {
      expect(await dataTable.getItemNameTooltip(fileTitleEqDesc)).toEqual(`${fileTitle}`);
    });
  });

  describe('on Recent Files', () => {
    beforeAll(async (done) => {
      await apis.user.search.waitForApi(username, { expect: 8 });
      await page.clickRecentFilesAndWait();
      done();
    });

    it('File with name, no title, no description - [C280135]', async () => {
      expect(await dataTable.getItemNameTooltip(file)).toEqual(`${file}`);
    });

    it('File with name and description, no title - [C280136]', async () => {
      expect(await dataTable.getItemNameTooltip(fileWithDesc)).toEqual(`${fileWithDesc}\n${fileDescription}`);
    });

    it('File with name and title, no description - [C280137]', async () => {
      expect(await dataTable.getItemNameTooltip(fileWithTitle)).toEqual(`${fileWithTitle}\n${fileTitle}`);
    });

    it('File with name and title and description, all different - [C280138]', async () => {
      expect(await dataTable.getItemNameTooltip(fileWithTitleAndDesc)).toEqual(`${fileTitle}\n${fileDescription}`);
    });

    it('File with name and title and description, all equal - [C280139]', async () => {
      expect(await dataTable.getItemNameTooltip(fileNameEqTitleEqDesc)).toEqual(`${fileNameEqTitleEqDesc}`);
    });

    it('File with name = title, different description - [C280140]', async () => {
      expect(await dataTable.getItemNameTooltip(fileNameEqTitleDiffDesc)).toEqual(`${fileNameEqTitleDiffDesc}\n${fileDescription}`);
    });

    it('File with name = description, different title - [C280141]', async () => {
      expect(await dataTable.getItemNameTooltip(fileNameEqDescDiffTitle)).toEqual(`${fileTitle}\n${fileNameEqDescDiffTitle}`);
    });

    it('File with title = description, different name - [C280142]', async () => {
      expect(await dataTable.getItemNameTooltip(fileTitleEqDesc)).toEqual(`${fileTitle}`);
    });
  });

  // disabled until ACA-518 is done
  xdescribe('on Shared Files', () => {
    beforeAll(async (done) => {
      await apis.user.shared.waitForApi({ expect: 8 });
      await page.clickSharedFilesAndWait();
      done();
    });

    xit('File with name, no title, no description - [C280143]', async () => {
      expect(await dataTable.getItemNameTooltip(file)).toEqual(`${file}`);
    });

    xit('File with name and description, no title - [C280144]', async () => {
      expect(await dataTable.getItemNameTooltip(fileWithDesc)).toEqual(`${fileWithDesc}\n${fileDescription}`);
    });

    xit('File with name and title, no description - [C280145]', async () => {
      expect(await dataTable.getItemNameTooltip(fileWithTitle)).toEqual(`${fileWithTitle}\n${fileTitle}`);
    });

    xit('File with name and title and description, all different - [C280146]', async () => {
      expect(await dataTable.getItemNameTooltip(fileWithTitleAndDesc)).toEqual(`${fileTitle}\n${fileDescription}`);
    });

    xit('File with name and title and description, all equal - [C280147]', async () => {
      expect(await dataTable.getItemNameTooltip(fileNameEqTitleEqDesc)).toEqual(`${fileNameEqTitleEqDesc}`);
    });

    xit('File with name = title, different description - [C280148]', async () => {
      expect(await dataTable.getItemNameTooltip(fileNameEqTitleDiffDesc)).toEqual(`${fileNameEqTitleDiffDesc}\n${fileDescription}`);
    });

    xit('File with name = description, different title - [C280149]', async () => {
      expect(await dataTable.getItemNameTooltip(fileNameEqDescDiffTitle)).toEqual(`${fileTitle}\n${fileNameEqDescDiffTitle}`);
    });

    xit('File with title = description, different name - [C280150]', async () => {
      expect(await dataTable.getItemNameTooltip(fileTitleEqDesc)).toEqual(`${fileTitle}`);
    });
  });

  describe('on Favorites', () => {
    beforeAll(async (done) => {
      await page.clickFavoritesAndWait();
      done();
    });

    it('File with name, no title, no description - [C280151]', async () => {
      expect(await dataTable.getItemNameTooltip(file)).toEqual(`${file}`);
    });

    it('File with name and description, no title - [C280152]', async () => {
      expect(await dataTable.getItemNameTooltip(fileWithDesc)).toEqual(`${fileWithDesc}\n${fileDescription}`);
    });

    it('File with name and title, no description - [C280153]', async () => {
      expect(await dataTable.getItemNameTooltip(fileWithTitle)).toEqual(`${fileWithTitle}\n${fileTitle}`);
    });

    it('File with name and title and description, all different - [C280154]', async () => {
      expect(await dataTable.getItemNameTooltip(fileWithTitleAndDesc)).toEqual(`${fileTitle}\n${fileDescription}`);
    });

    it('File with name and title and description, all equal - [C280155]', async () => {
      expect(await dataTable.getItemNameTooltip(fileNameEqTitleEqDesc)).toEqual(`${fileNameEqTitleEqDesc}`);
    });

    it('File with name = title, different description - [C280156]', async () => {
      expect(await dataTable.getItemNameTooltip(fileNameEqTitleDiffDesc)).toEqual(`${fileNameEqTitleDiffDesc}\n${fileDescription}`);
    });

    it('File with name = description, different title - [C280157]', async () => {
      expect(await dataTable.getItemNameTooltip(fileNameEqDescDiffTitle)).toEqual(`${fileTitle}\n${fileNameEqDescDiffTitle}`);
    });

    it('File with title = description, different name - [C280158]', async () => {
      expect(await dataTable.getItemNameTooltip(fileTitleEqDesc)).toEqual(`${fileTitle}`);
    });
  });

  describe('on Trash', () => {
    const parentForTrash = `parent-${Utils.random()}`;
    let parentForTrashId, file1TrashId, file2TrashId, file3TrashId, file4TrashId;
    let file5TrashId, file6TrashId, file7TrashId, file8TrashId;

    beforeAll(async (done) => {
      parentForTrashId = (await apis.user.nodes.createFolder( parentForTrash )).entry.id;
      file1TrashId = (await apis.user.nodes.createFile(file, parentForTrashId)).entry.id;
      file2TrashId = (await apis.user.nodes.createFile(fileWithDesc, parentForTrashId, '', fileDescription)).entry.id;
      file3TrashId = (await apis.user.nodes.createFile(fileWithTitle, parentForTrashId, fileTitle)).entry.id;
      file4TrashId = (await apis.user.nodes.createFile(fileWithTitleAndDesc, parentForTrashId, fileTitle, fileDescription)).entry.id;
      file5TrashId = (await apis.user.nodes.createFile(fileNameEqTitleEqDesc, parentForTrashId, fileNameEqTitleEqDesc, fileNameEqTitleEqDesc)).entry.id;
      file6TrashId = (await apis.user.nodes.createFile(fileNameEqTitleDiffDesc, parentForTrashId, fileNameEqTitleDiffDesc, fileDescription)).entry.id;
      file7TrashId = (await apis.user.nodes.createFile(fileNameEqDescDiffTitle, parentForTrashId, fileTitle, fileNameEqDescDiffTitle)).entry.id;
      file8TrashId = (await apis.user.nodes.createFile(fileTitleEqDesc, parentForTrashId, fileTitle, fileTitle)).entry.id;

      await apis.user.nodes.deleteNodesById([
        file1TrashId, file2TrashId, file3TrashId, file4TrashId, file5TrashId, file6TrashId, file7TrashId, file8TrashId
      ], false);

      await page.clickTrashAndWait();
      done();
    });

    afterAll(async (done) => {
      await apis.user.nodes.deleteNodes([ parentForTrash ]);
      await apis.user.trashcan.emptyTrash();
      done();
    });

    it('File with name, no title, no description - [C280159]', async () => {
      expect(await dataTable.getItemNameTooltip(file)).toEqual(`${file}`);
    });

    it('File with name and description, no title - [C280160]', async () => {
      expect(await dataTable.getItemNameTooltip(fileWithDesc)).toEqual(`${fileWithDesc}\n${fileDescription}`);
    });

    it('File with name and title, no description - [C280161]', async () => {
      expect(await dataTable.getItemNameTooltip(fileWithTitle)).toEqual(`${fileWithTitle}\n${fileTitle}`);
    });

    it('File with name and title and description, all different - [C280162]', async () => {
      expect(await dataTable.getItemNameTooltip(fileWithTitleAndDesc)).toEqual(`${fileTitle}\n${fileDescription}`);
    });

    it('File with name and title and description, all equal - [C280163]', async () => {
      expect(await dataTable.getItemNameTooltip(fileNameEqTitleEqDesc)).toEqual(`${fileNameEqTitleEqDesc}`);
    });

    it('File with name = title, different description - [C280164]', async () => {
      expect(await dataTable.getItemNameTooltip(fileNameEqTitleDiffDesc)).toEqual(`${fileNameEqTitleDiffDesc}\n${fileDescription}`);
    });

    it('File with name = description, different title - [C280165]', async () => {
      expect(await dataTable.getItemNameTooltip(fileNameEqDescDiffTitle)).toEqual(`${fileTitle}\n${fileNameEqDescDiffTitle}`);
    });

    it('File with title = description, different name - [C280166]', async () => {
      expect(await dataTable.getItemNameTooltip(fileTitleEqDesc)).toEqual(`${fileTitle}`);
    });
  });
});
