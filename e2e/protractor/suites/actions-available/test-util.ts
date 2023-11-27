/*!
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * Alfresco Example Content Application
 *
 * This file is part of the Alfresco Example Content Application.
 * If the software was purchased under a paid Alfresco license, the terms of
 * the paid license agreement will prevail. Otherwise, the software is
 * provided under the following open source license terms:
 *
 * The Alfresco Example Content Application is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * The Alfresco Example Content Application is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * from Hyland Software. If not, see <http://www.gnu.org/licenses/>.
 */

import { BrowsingPage, Viewer, Utils, Menu } from '@alfresco/aca-testing-shared';
import { BrowserActions } from '@alfresco/adf-testing';

const page = new BrowsingPage();
const { dataTable, toolbar } = page;
const contextMenu = dataTable.menu;
const viewer = new Viewer();
const viewerToolbar = viewer.toolbar;
const menu = new Menu();

export async function checkContextMenu(item: string, expectedContextMenu: string[]): Promise<void> {
  await dataTable.rightClickOnItem(item);
  await contextMenu.waitForMenuToOpen();

  const actualActions = await contextMenu.getMenuItems();
  for (const action of expectedContextMenu) {
    expect(actualActions.includes(action)).toBe(true, `Expected to contain ${action}`);
  }

  await Utils.pressEscape();
  await menu.waitForMenuToClose();
}

export async function checkToolbarPrimary(item: string, expectedToolbarPrimary: string[]): Promise<void> {
  await dataTable.selectItem(item);

  const actualPrimaryActions = await toolbar.getButtons();
  for (const action of expectedToolbarPrimary) {
    expect(actualPrimaryActions.includes(action)).toBe(true, `Expected to contain ${action}`);
  }
}

export async function checkToolbarActions(item: string, expectedToolbarPrimary: string[], expectedToolbarMore: string[]): Promise<void> {
  await dataTable.selectItem(item);

  const actualPrimaryActions = await toolbar.getButtons();
  for (const action of expectedToolbarPrimary) {
    expect(actualPrimaryActions.includes(action)).toBe(true, `Expected to contain ${action}`);
  }

  await toolbar.openMoreMenu();

  const actualMoreActions = await toolbar.menu.getMenuItems();
  for (const action of expectedToolbarMore) {
    expect(actualMoreActions.includes(action)).toBe(true, `Expected to contain ${action}`);
  }

  await toolbar.closeMoreMenu();
}

export async function checkMultipleSelContextMenu(items: string[], expectedContextMenu: string[]): Promise<void> {
  await dataTable.selectMultipleItems(items);
  await dataTable.rightClickOnMultipleSelection();
  await contextMenu.waitForMenuToOpen();

  const actualActions = await contextMenu.getMenuItems();
  for (const action of expectedContextMenu) {
    expect(actualActions.includes(action)).toBe(true, `Expected to contain ${action}`);
  }

  await Utils.pressEscape();
  await menu.waitForMenuToClose();
}

export async function checkMultipleSelToolbarPrimary(items: string[], expectedToolbarPrimary: string[]): Promise<void> {
  await dataTable.selectMultipleItems(items);

  const actualPrimaryActions = await toolbar.getButtons();
  for (const action of expectedToolbarPrimary) {
    expect(actualPrimaryActions.includes(action)).toBe(true, `Expected to contain ${action}`);
  }
}

export async function checkMultipleSelToolbarActions(
  items: string[],
  expectedToolbarPrimary: string[],
  expectedToolbarMore: string[]
): Promise<void> {
  await dataTable.selectMultipleItems(items);

  const actualPrimaryActions = await toolbar.getButtons();
  for (const action of expectedToolbarPrimary) {
    expect(actualPrimaryActions.includes(action)).toBe(true, `Expected to contain ${action}`);
  }

  await toolbar.openMoreMenu();

  const actualMoreActions = await toolbar.menu.getMenuItems();
  for (const action of expectedToolbarMore) {
    expect(actualMoreActions.includes(action)).toBe(true, `Expected to contain ${action}`);
  }

  await toolbar.closeMoreMenu();
}

export async function checkViewerActions(item: string, expectedToolbarPrimary: string[], expectedToolbarMore: string[]): Promise<void> {
  await dataTable.selectItem(item);
  await BrowserActions.click(toolbar.viewButton);
  await viewer.waitForViewerToOpen();

  let actualPrimaryActions = await viewerToolbar.getButtons();
  actualPrimaryActions = removeClosePreviousNextOldInfo(actualPrimaryActions);

  for (const action of expectedToolbarPrimary) {
    expect(actualPrimaryActions.includes(action)).toBe(true, `Expected to contain ${action}`);
  }

  await viewerToolbar.openMoreMenu();

  const actualMoreActions = await viewerToolbar.menu.getMenuItems();
  for (const action of expectedToolbarMore) {
    expect(actualMoreActions.includes(action)).toBe(true, `Expected to contain ${action}`);
  }

  await Utils.pressEscape();
  await menu.waitForMenuToClose();
}

const toRemove = ['Close', 'Previous File', 'Next File', 'View details'];

const removeClosePreviousNextOldInfo = (actions: string[]): string[] => actions.filter((elem) => !toRemove.includes(elem));
