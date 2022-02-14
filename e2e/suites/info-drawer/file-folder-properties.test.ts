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
  AdminActions,
  LoginPage,
  BrowsingPage,
  RepoClient,
  InfoDrawer,
  Utils,
  FILES,
  DATE_TIME_FORMAT,
  DATE_FORMAT
} from '@alfresco/aca-testing-shared';
import { BrowserActions } from '@alfresco/adf-testing';

const moment = require('moment');

describe('File / Folder properties', () => {
  const username = `user1-${Utils.random()}`;

  const parent = `parent-${Utils.random()}`;
  let parentId: string;

  const file1 = {
    name: `file1-${Utils.random()}.txt`,
    title: 'file title',
    description: 'file description',
    author: 'file author',
    contentType: 'Content'
  };
  let file1Id: string;

  const image1 = {
    name: FILES.jpgFile,
    title: 'image title',
    description: 'image description',
    author: 'image author'
  };
  let image1Id: string;

  const folder1 = {
    name: `folder1-${Utils.random()}`,
    title: 'folder title',
    description: 'folder description',
    author: 'folder author',
    contentType: 'Folder'
  };
  let folder1Id: string;

  const apis = {
    user: new RepoClient(username, username)
  };

  const infoDrawer = new InfoDrawer();
  const { propertiesTab } = infoDrawer;

  const loginPage = new LoginPage();
  const page = new BrowsingPage();
  const { dataTable } = page;
  const adminApiActions = new AdminActions();

  beforeAll(async (done) => {
    await adminApiActions.createUser({ username });
    parentId = (await apis.user.nodes.createFolder(parent)).entry.id;
    file1Id = (await apis.user.nodes.createFile(file1.name, parentId, file1.title, file1.description, file1.author)).entry.id;
    folder1Id = (await apis.user.nodes.createFolder(folder1.name, parentId, folder1.title, folder1.description, folder1.author)).entry.id;
    image1Id = (await apis.user.upload.uploadFile(image1.name, parentId)).entry.id;

    await loginPage.loginWith(username);
    done();
  });

  afterAll(async (done) => {
    await apis.user.nodes.deleteNodeById(parentId);
    done();
  });

  beforeEach(async (done) => {
    await page.clickPersonalFilesAndWait();
    await dataTable.doubleClickOnRowByName(parent);
    done();
  });

  describe('View properties', () => {
    it('[C299162] Default tabs', async () => {
      await dataTable.selectItem(file1.name);
      await BrowserActions.click(page.toolbar.viewDetailsButton);
      await infoDrawer.waitForInfoDrawerToOpen();

      expect(await infoDrawer.getHeaderTitle()).toEqual('Details');
      expect(await infoDrawer.isPropertiesTabDisplayed()).toBe(true, 'Properties tab is not displayed');
      expect(await infoDrawer.isCommentsTabDisplayed()).toBe(true, 'Comments tab is not displayed');
      expect(await infoDrawer.getTabsCount()).toBe(2, 'Incorrect number of tabs');
    });

    it('[C269003] File properties', async () => {
      const apiProps = await apis.user.nodes.getNodeById(file1Id);

      const expectedPropLabels = [
        'Name',
        'Title',
        'Creator',
        'Created Date',
        'Size',
        'Modifier',
        'Modified Date',
        'Mimetype',
        'Author',
        'Description',
        'Content Type'
      ];
      const expectedPropValues = [
        file1.name,
        file1.title,
        apiProps.entry.createdByUser.displayName,
        moment(apiProps.entry.createdAt).format(DATE_FORMAT),
        `${apiProps.entry.content.sizeInBytes} Bytes`,
        apiProps.entry.modifiedByUser.displayName,
        moment(apiProps.entry.modifiedAt).format(DATE_FORMAT),
        apiProps.entry.content.mimeTypeName,
        file1.author,
        file1.description,
        file1.contentType
      ];

      await dataTable.selectItem(file1.name);
      await BrowserActions.click(page.toolbar.viewDetailsButton);
      await infoDrawer.waitForInfoDrawerToOpen();

      expect(await propertiesTab.getVisiblePropertiesLabels()).toEqual(expectedPropLabels, 'Incorrect properties displayed');
      expect(await propertiesTab.getVisiblePropertiesValues()).toEqual(expectedPropValues, 'Incorrect properties values');
      expect(await propertiesTab.isEditPropertiesButtonEnabled()).toBe(true, 'Edit button not enabled');
      expect(await propertiesTab.isMoreInfoButtonEnabled()).toBe(true, 'More information button not enabled');
    });

    it('[C307106] Folder properties', async () => {
      const apiProps = await apis.user.nodes.getNodeById(folder1Id);

      const expectedPropLabels = ['Name', 'Title', 'Creator', 'Created Date', 'Modifier', 'Modified Date', 'Author', 'Description', 'Content Type'];
      const expectedPropValues = [
        folder1.name,
        folder1.title,
        apiProps.entry.createdByUser.displayName,
        moment(apiProps.entry.createdAt).format(DATE_FORMAT),
        apiProps.entry.modifiedByUser.displayName,
        moment(apiProps.entry.modifiedAt).format(DATE_FORMAT),
        folder1.author,
        folder1.description,
        folder1.contentType
      ];

      await dataTable.selectItem(folder1.name);
      await BrowserActions.click(page.toolbar.viewDetailsButton);
      await infoDrawer.waitForInfoDrawerToOpen();

      expect(await propertiesTab.getVisiblePropertiesLabels()).toEqual(expectedPropLabels, 'Incorrect properties displayed');
      expect(await propertiesTab.getVisiblePropertiesValues()).toEqual(expectedPropValues, 'Incorrect properties values');
      expect(await propertiesTab.isEditPropertiesButtonEnabled()).toBe(true, 'Edit button not enabled');
      expect(await propertiesTab.isMoreInfoButtonEnabled()).toBe(true, 'More information button not enabled');
    });

    it('[C269004] Less / More information buttons', async () => {
      await dataTable.selectItem(file1.name);
      await BrowserActions.click(page.toolbar.viewDetailsButton);
      await infoDrawer.waitForInfoDrawerToOpen();

      expect(await propertiesTab.isMoreInfoButtonEnabled()).toBe(true, 'More information button not enabled');
      expect(await propertiesTab.isPropertiesListExpanded()).toBe(true, 'Properties list not expanded');

      await BrowserActions.click(propertiesTab.moreInfoButton);

      expect(await propertiesTab.isMoreInfoButtonDisplayed()).toBe(false, 'More information button displayed');
      expect(await propertiesTab.isLessInfoButtonEnabled()).toBe(true, 'Less information button not enabled');
      expect(await propertiesTab.isPropertiesListExpanded()).toBe(false, 'Properties list expanded');

      await BrowserActions.click(propertiesTab.lessInfoButton);

      expect(await propertiesTab.isMoreInfoButtonDisplayed()).toBe(true, 'More information button not displayed');
      expect(await propertiesTab.isLessInfoButtonEnabled()).toBe(false, 'Less information button enabled');
      expect(await propertiesTab.isPropertiesListExpanded()).toBe(true, 'Properties list not expanded');
    });

    it('[C269007] Image properties', async () => {
      const apiProps = await apis.user.nodes.getNodeById(image1Id);
      const properties = apiProps.entry.properties;

      const expectedPropLabels = [
        'Image Width',
        'Image Height',
        'Date and Time',
        'Exposure Time',
        'F Number',
        'Flash Activated',
        'Focal Length',
        'ISO Speed',
        'Orientation',
        'Camera Manufacturer',
        'Camera Model',
        'Camera Software'
      ];
      const expectedPropValues = [
        properties['exif:pixelXDimension']?.toString(),
        properties['exif:pixelYDimension']?.toString(),
        moment(properties['exif:dateTimeOriginal']).format(DATE_TIME_FORMAT),
        properties['exif:exposureTime']?.toString(),
        properties['exif:fNumber']?.toString(),
        properties['exif:flash'],
        properties['exif:focalLength']?.toString(),
        properties['exif:isoSpeedRatings'],
        properties['exif:orientation']?.toString(),
        properties['exif:manufacturer'],
        properties['exif:model'],
        properties['exif:software']
      ];

      await dataTable.selectItem(image1.name);
      await BrowserActions.click(page.toolbar.viewDetailsButton);
      await infoDrawer.waitForInfoDrawerToOpen();

      await BrowserActions.click(propertiesTab.moreInfoButton);
      await BrowserActions.click(propertiesTab.imagePropertiesPanel);

      await propertiesTab.waitForImagePropertiesPanelToExpand();

      expect(await propertiesTab.isImagePropertiesPanelDisplayed()).toBe(true, 'Image properties panel not displayed');
      expect(await propertiesTab.getVisiblePropertiesLabels()).toEqual(expectedPropLabels, 'Incorrect properties displayed');
      expect(await propertiesTab.getVisiblePropertiesValues()).toEqual(expectedPropValues, 'Incorrect properties values');
      expect(await propertiesTab.isEditPropertiesButtonEnabled()).toBe(true, 'Edit button not enabled');
      expect(await propertiesTab.isLessInfoButtonEnabled()).toBe(true, 'Less information button not enabled');
    });

    it('[C599174] Should be able to make the files/folders info drawer expandable as for Sites', async () => {
      await dataTable.selectItem(file1.name);
      await BrowserActions.click(page.toolbar.viewDetailsButton);
      await infoDrawer.waitForInfoDrawerToOpen();
      await infoDrawer.expandDetailsButton.click();
      await expect(await infoDrawer.expandedDetailsPermissionsTab.isPresent()).toBe(true, 'Permissions tab is not displayed');

      await page.clickPersonalFilesAndWait();
      await dataTable.selectItem(parent);
      await BrowserActions.rightClick(dataTable.selectedRow);
      await dataTable.menu.clickMenuItem('Permissions');
      const expectedSelectedTabTitle = 'permissions';
      const actualSelectedTabTitle = await infoDrawer.selectedTab.getText();

      await expect(actualSelectedTabTitle.toLowerCase()).toEqual(expectedSelectedTabTitle);
    });
  });
});
