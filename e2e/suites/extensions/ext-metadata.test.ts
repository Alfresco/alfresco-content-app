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
  BrowsingPage,
  LoginPage,
  RepoClient,
  EXTENSIBILITY_CONFIGS,
  Utils,
  InfoDrawer,
  MetadataCard
} from '@alfresco/aca-testing-shared';
import { BrowserActions } from '@alfresco/adf-testing';

describe('Extensions - Metadata presets', () => {
  const username = `user-${Utils.random()}`;

  const file = `file-${Utils.random()}.png`;

  let fileId: string;

  const PROPERTIES_TAB = {
    title: 'Properties',
    component: 'app.components.tabs.metadata'
  };

  const customGroup1 = {
    id: 'a.testGroup',
    title: 'A Test Group of Properties'
  };

  const customGroup2 = {
    id: 'another.testGroup',
    title: 'Another Test Group of Properties'
  };

  const disabledGroup = {
    id: 'disabled.testGroup',
    title: 'Hidden Group of Properties'
  };

  const apis = {
    user: new RepoClient(username, username)
  };

  const infoDrawer = new InfoDrawer();
  const metadataCard = new MetadataCard();

  const loginPage = new LoginPage();
  const page = new BrowsingPage();
  const adminApiActions = new AdminActions();

  beforeAll(async (done) => {
    await adminApiActions.createUser({ username });
    fileId = (await apis.user.nodes.createImage(file)).entry.id;

    await loginPage.load();
    await Utils.setSessionStorageFromConfig(EXTENSIBILITY_CONFIGS.METADATA_PRESETS);
    await loginPage.loginWith(username);

    done();
  });

  beforeEach(async (done) => {
    await page.refresh();

    await page.dataTable.selectItem(file);
    await BrowserActions.click(page.toolbar.viewDetailsButton);
    await infoDrawer.waitForInfoDrawerToOpen();

    await infoDrawer.clickTab(PROPERTIES_TAB.title);
    await BrowserActions.click(metadataCard.expandButton);
    await metadataCard.waitForFirstExpansionPanel();

    done();
  });

  afterAll(async (done) => {
    await apis.user.nodes.deleteNodeById(fileId);
    done();
  });

  it('[C286636] Set groups of properties to display', async () => {
    expect(await metadataCard.isExpansionPanelPresent(0)).toBe(true, `expansion panel is not present`);
    expect(await metadataCard.getComponentIdOfPanel(0)).toEqual(`adf-metadata-group-${customGroup1.title}`);
    expect(await metadataCard.isExpansionPanelPresent(1)).toBe(true, `expansion panel is not present`);
    expect(await metadataCard.getComponentIdOfPanel(1)).toEqual(`adf-metadata-group-${customGroup2.title}`);
  });

  it('[C286637] Disabled group is not displayed', async () => {
    expect(await metadataCard.isExpansionPanelPresent(2)).toBe(false, `disabled group is displayed`);
    expect(await metadataCard.getComponentIdOfPanel(1)).not.toEqual(`adf-metadata-group-${disabledGroup.title}`);
    expect(await metadataCard.getComponentIdOfPanel(0)).not.toEqual(`adf-metadata-group-${disabledGroup.title}`);
  });
});
