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

import { CyUtils } from '../../utils/cy-utils';
import { CyRepoClient } from '../../utils/cy-api/cy-repo-client/cy-repo-client';
import { CyLoginPage, CyBrowsingPage } from '../../pages';
import { CyUserActions } from '../../utils/cy-api/cy-user-actions';
import { CyAdminActions } from '../../utils/cy-api/cy-admin-actions';
import { SITE_VISIBILITY, SITE_ROLES } from '../../utils/cy-configs';

before(() => {
  cy.clearLocalStorageSnapshot();
});

describe('File / folder tooltips', () => {
  const username = `user-${CyUtils.random()}`;

  const userApi = new CyRepoClient(username, username);

  const parent = `parent-${CyUtils.random()}`;

  const file = `file1-${CyUtils.random()}`;
  const fileWithDesc = `file2-${CyUtils.random()}`;
  const fileWithTitle = `file3-${CyUtils.random()}`;
  const fileWithTitleAndDesc = `file4-${CyUtils.random()}`;
  const fileNameEqTitleEqDesc = `file5-${CyUtils.random()}`;
  const fileNameEqTitleDiffDesc = `file6-${CyUtils.random()}`;
  const fileNameEqDescDiffTitle = `file7-${CyUtils.random()}`;
  const fileTitleEqDesc = `file8-${CyUtils.random()}`;
  let parentId: string;
  let file1Id: string;
  let file2Id: string;
  let file3Id: string;
  let file4Id: string;
  let file5Id: string;
  let file6Id: string;
  let file7Id: string;
  let file8Id: string;

  const fileTitle = 'file title';
  const fileDescription = 'file description';

  const loginPage = new CyLoginPage();
  const page = new CyBrowsingPage();
  const { dataTable } = page;

  const adminApiActions = new CyAdminActions();
  const userActions = new CyUserActions();

  before(() => {
    cy.then({ timeout: 60000 }, async () => {
      await adminApiActions.login();
      await adminApiActions.createUser({ username });
      await userActions.login(username, username);

      parentId = (await userApi.nodes.createFolder(parent)).entry.id;

      file1Id = (await userApi.nodes.createFile(file, parentId)).entry.id;
      file2Id = (await userApi.nodes.createFile(fileWithDesc, parentId, '', fileDescription)).entry.id;
      file3Id = (await userApi.nodes.createFile(fileWithTitle, parentId, fileTitle)).entry.id;
      file4Id = (await userApi.nodes.createFile(fileWithTitleAndDesc, parentId, fileTitle, fileDescription)).entry.id;
      file5Id = (await userApi.nodes.createFile(fileNameEqTitleEqDesc, parentId, fileNameEqTitleEqDesc, fileNameEqTitleEqDesc)).entry.id;
      file6Id = (await userApi.nodes.createFile(fileNameEqTitleDiffDesc, parentId, fileNameEqTitleDiffDesc, fileDescription)).entry.id;
      file7Id = (await userApi.nodes.createFile(fileNameEqDescDiffTitle, parentId, fileTitle, fileNameEqDescDiffTitle)).entry.id;
      file8Id = (await userApi.nodes.createFile(fileTitleEqDesc, parentId, fileTitle, fileTitle)).entry.id;

      await userApi.shared.shareFilesByIds([file1Id, file2Id, file3Id, file4Id, file5Id, file6Id, file7Id, file8Id]);
      await userApi.favorites.addFavoritesByIds('file', [file1Id, file2Id, file3Id, file4Id, file5Id, file6Id, file7Id, file8Id]);

      await userApi.shared.waitForFilesToBeShared([file1Id, file2Id, file3Id, file4Id, file5Id, file6Id, file7Id, file8Id]);
    });
  });

  before(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    loginPage.loginWith(username);
  });

  after(() => {
    cy.then(async () => {
      await userActions.deleteNodes([parentId]);
      await userActions.emptyTrashcan();
    });
  });

  describe('on Personal Files', () => {
    before(() => {
      page.clickPersonalFiles();
      dataTable.doubleClickOnRowByName(parent);
    });

    it('[C255871] File with name, no title, no description', () => {
      dataTable.getItemNameTooltip(file).should('eq', `${file}`);
    });

    it('[C255872] File with name and description, no title', () => {
      dataTable.getItemNameTooltip(fileWithDesc).should('eq', `${fileWithDesc}\n${fileDescription}`);
    });

    it('[C255873] File with name and title, no description', () => {
      dataTable.getItemNameTooltip(fileWithTitle).should('eq', `${fileWithTitle}\n${fileTitle}`);
    });

    it('[C255874] File with name and title and description, all different', () => {
      dataTable.getItemNameTooltip(fileWithTitleAndDesc).should('eq', `${fileTitle}\n${fileDescription}`);
    });

    it('[C255875] File with name and title and description, all equal', () => {
      dataTable.getItemNameTooltip(fileNameEqTitleEqDesc).should('eq', `${fileNameEqTitleEqDesc}`);
    });

    it('[C255876] File with name = title, different description', () => {
      dataTable.getItemNameTooltip(fileNameEqTitleDiffDesc).should('eq', `${fileNameEqTitleDiffDesc}\n${fileDescription}`);
    });

    it('[C255877] File with name = description, different title', () => {
      dataTable.getItemNameTooltip(fileNameEqDescDiffTitle).should('eq', `${fileTitle}\n${fileNameEqDescDiffTitle}`);
    });

    it('[C255878] File with title = description, different name', () => {
      dataTable.getItemNameTooltip(fileTitleEqDesc).should('eq', `${fileTitle}`);
    });
  });

  describe('on Recent Files', () => {
    before(() => {
      cy.then(async () => {
        await userApi.search.waitForApi(username, { expect: 8 });
      });
      page.clickRecentFilesAndWait();
    });

    it('[C280135] File with name, no title, no description', () => {
      dataTable.getItemNameTooltip(file).should('eq', `${file}`);
    });

    it('[C280136] File with name and description, no title', () => {
      dataTable.getItemNameTooltip(fileWithDesc).should('eq', `${fileWithDesc}\n${fileDescription}`);
    });

    it('[C280137] File with name and title, no description', () => {
      dataTable.getItemNameTooltip(fileWithTitle).should('eq', `${fileWithTitle}\n${fileTitle}`);
    });

    it('[C280138] File with name and title and description, all different', () => {
      dataTable.getItemNameTooltip(fileWithTitleAndDesc).should('eq', `${fileTitle}\n${fileDescription}`);
    });

    it('[C280139] File with name and title and description, all equal', () => {
      dataTable.getItemNameTooltip(fileNameEqTitleEqDesc).should('eq', `${fileNameEqTitleEqDesc}`);
    });

    it('[C280140] File with name = title, different description', () => {
      dataTable.getItemNameTooltip(fileNameEqTitleDiffDesc).should('eq', `${fileNameEqTitleDiffDesc}\n${fileDescription}`);
    });

    it('[C280141] File with name = description, different title', () => {
      dataTable.getItemNameTooltip(fileNameEqDescDiffTitle).should('eq', `${fileTitle}\n${fileNameEqDescDiffTitle}`);
    });

    it('[C280142] File with title = description, different name', () => {
      dataTable.getItemNameTooltip(fileTitleEqDesc).should('eq', `${fileTitle}`);
    });
  });

  describe('on Favorites', () => {
    before(() => {
      page.clickFavoritesAndWait();
    });

    it('[C280151] File with name, no title, no description', () => {
      dataTable.getItemNameTooltip(file).should('eq', `${file}`);
    });

    it('[C280152] File with name and description, no title', () => {
      dataTable.getItemNameTooltip(fileWithDesc).should('eq', `${fileWithDesc}\n${fileDescription}`);
    });

    it('[C280153] File with name and title, no description', () => {
      dataTable.getItemNameTooltip(fileWithTitle).should('eq', `${fileWithTitle}\n${fileTitle}`);
    });

    it('[C280154] File with name and title and description, all different', () => {
      dataTable.getItemNameTooltip(fileWithTitleAndDesc).should('eq', `${fileTitle}\n${fileDescription}`);
    });

    it('[C280155] File with name and title and description, all equal', () => {
      dataTable.getItemNameTooltip(fileNameEqTitleEqDesc).should('eq', `${fileNameEqTitleEqDesc}`);
    });

    it('[C280156] File with name = title, different description', () => {
      dataTable.getItemNameTooltip(fileNameEqTitleDiffDesc).should('eq', `${fileNameEqTitleDiffDesc}\n${fileDescription}`);
    });

    it('[C280157] File with name = description, different title', () => {
      dataTable.getItemNameTooltip(fileNameEqDescDiffTitle).should('eq', `${fileTitle}\n${fileNameEqDescDiffTitle}`);
    });

    it('[C280158] File with title = description, different name', () => {
      dataTable.getItemNameTooltip(fileTitleEqDesc).should('eq', `${fileTitle}`);
    });
  });

  describe('on Trash', () => {
    const parentForTrash = `parent-${CyUtils.random()}`;
    let parentForTrashId: string;
    let file1TrashId: string;
    let file2TrashId: string;
    let file3TrashId: string;
    let file4TrashId: string;
    let file5TrashId: string;
    let file6TrashId: string;
    let file7TrashId: string;
    let file8TrashId: string;

    before(() => {
      cy.then(async () => {
        parentForTrashId = (await userApi.nodes.createFolder(parentForTrash)).entry.id;
        file1TrashId = (await userApi.nodes.createFile(file, parentForTrashId)).entry.id;
        file2TrashId = (await userApi.nodes.createFile(fileWithDesc, parentForTrashId, '', fileDescription)).entry.id;
        file3TrashId = (await userApi.nodes.createFile(fileWithTitle, parentForTrashId, fileTitle)).entry.id;
        file4TrashId = (await userApi.nodes.createFile(fileWithTitleAndDesc, parentForTrashId, fileTitle, fileDescription)).entry.id;
        file5TrashId = (await userApi.nodes.createFile(fileNameEqTitleEqDesc, parentForTrashId, fileNameEqTitleEqDesc, fileNameEqTitleEqDesc)).entry
          .id;
        file6TrashId = (await userApi.nodes.createFile(fileNameEqTitleDiffDesc, parentForTrashId, fileNameEqTitleDiffDesc, fileDescription)).entry.id;
        file7TrashId = (await userApi.nodes.createFile(fileNameEqDescDiffTitle, parentForTrashId, fileTitle, fileNameEqDescDiffTitle)).entry.id;
        file8TrashId = (await userApi.nodes.createFile(fileTitleEqDesc, parentForTrashId, fileTitle, fileTitle)).entry.id;

        await userApi.nodes.deleteNodesById(
          [file1TrashId, file2TrashId, file3TrashId, file4TrashId, file5TrashId, file6TrashId, file7TrashId, file8TrashId],
          false
        );
      });
      page.clickTrashAndWait();
    });

    after(() => {
      cy.then(async () => {
        await userActions.deleteNodes([parentForTrashId]);
        await userActions.emptyTrashcan();
      });
    });

    it('[C280159] File with name, no title, no description', () => {
      dataTable.getItemNameTooltip(file).should('eq', `${file}`);
    });

    it('[C280160] File with name and description, no title', () => {
      dataTable.getItemNameTooltip(fileWithDesc).should('eq', `${fileWithDesc}\n${fileDescription}`);
    });

    it('[C280161] File with name and title, no description', () => {
      dataTable.getItemNameTooltip(fileWithTitle).should('eq', `${fileWithTitle}\n${fileTitle}`);
    });

    it('[C280162] File with name and title and description, all different', () => {
      dataTable.getItemNameTooltip(fileWithTitleAndDesc).should('eq', `${fileTitle}\n${fileDescription}`);
    });

    it('[C280163] File with name and title and description, all equal', () => {
      dataTable.getItemNameTooltip(fileNameEqTitleEqDesc).should('eq', `${fileNameEqTitleEqDesc}`);
    });

    it('[C280164] File with name = title, different description', () => {
      dataTable.getItemNameTooltip(fileNameEqTitleDiffDesc).should('eq', `${fileNameEqTitleDiffDesc}\n${fileDescription}`);
    });

    it('[C280165] File with name = description, different title', () => {
      dataTable.getItemNameTooltip(fileNameEqDescDiffTitle).should('eq', `${fileTitle}\n${fileNameEqDescDiffTitle}`);
    });

    it('[C280166] File with title = description, different name', () => {
      dataTable.getItemNameTooltip(fileTitleEqDesc).should('eq', `${fileTitle}`);
    });
  });
});
