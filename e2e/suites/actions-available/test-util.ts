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

import { BrowsingPage } from '../../pages/pages';
import { Viewer } from '../../components/viewer/viewer';
import { Utils } from '../../utilities/utils';

const page = new BrowsingPage();
const { dataTable, toolbar } = page;
const contextMenu = dataTable.menu;
const viewer = new Viewer();
const viewerToolbar = viewer.toolbar;

export async function checkContextMenu(item: string, expectedContextMenu: string[]): Promise<void> {
  await dataTable.rightClickOnItem(item);

  const actualActions = await contextMenu.getMenuItems();
  expect(actualActions).toEqual(expectedContextMenu);

  await Utils.pressEscape();
}

export async function checkToolbarPrimary(item: string, expectedToolbarPrimary: string[]): Promise<void> {
  await dataTable.selectItem(item);

  const actualPrimaryActions = await toolbar.getButtons();
  expect(actualPrimaryActions).toEqual(expectedToolbarPrimary);
}

export async function checkToolbarMoreActions(item: string, expectedToolbarMore: string[]): Promise<void> {
  await dataTable.selectItem(item);
  await toolbar.openMoreMenu();

  const actualMoreActions = await toolbar.menu.getMenuItems();
  expect(actualMoreActions).toEqual(expectedToolbarMore);

  await toolbar.closeMoreMenu();
}

export async function checkToolbarActions(item: string, expectedToolbarPrimary: string[], expectedToolbarMore: string[]): Promise<void> {
  await dataTable.selectItem(item);

  const actualPrimaryActions = await toolbar.getButtons();
  expect(actualPrimaryActions).toEqual(expectedToolbarPrimary);

  await toolbar.openMoreMenu();

  const actualMoreActions = await toolbar.menu.getMenuItems();
  expect(actualMoreActions).toEqual(expectedToolbarMore);

  await toolbar.closeMoreMenu();
}

export async function checkMultipleSelContextMenu(items: string[], expectedContextMenu: string[]): Promise<void> {
  await dataTable.selectMultipleItems(items);
  await dataTable.rightClickOnMultipleSelection();

  const actualActions = await contextMenu.getMenuItems();
  expect(actualActions).toEqual(expectedContextMenu);

  await Utils.pressEscape();
}

export async function checkMultipleSelToolbarPrimary(items: string[], expectedToolbarPrimary: string[]): Promise<void> {
  await dataTable.selectMultipleItems(items);

  const actualPrimaryActions = await toolbar.getButtons();
  expect(actualPrimaryActions).toEqual(expectedToolbarPrimary);
}

export async function checkMultipleSelToolbarActions(items: string[], expectedToolbarPrimary: string[], expectedToolbarMore: string[]): Promise<void> {
  await dataTable.selectMultipleItems(items);

  const actualPrimaryActions = await toolbar.getButtons();
  expect(actualPrimaryActions).toEqual(expectedToolbarPrimary);

  await toolbar.openMoreMenu();

  const actualMoreActions = await toolbar.menu.getMenuItems();
  expect(actualMoreActions).toEqual(expectedToolbarMore);

  await toolbar.closeMoreMenu();
}

export async function checkViewerActions(item: string, expectedToolbarPrimary: string[], expectedToolbarMore: string[]): Promise<void> {
  await dataTable.selectItem(item);
  await toolbar.clickView();
  await viewer.waitForViewerToOpen();

  let actualPrimaryActions = await viewerToolbar.getButtons();
  actualPrimaryActions = removeClosePreviousNextOldInfo(actualPrimaryActions);
  expect(actualPrimaryActions).toEqual(expectedToolbarPrimary);

  await viewerToolbar.openMoreMenu();

  const actualMoreActions = await viewerToolbar.menu.getMenuItems();
  expect(actualMoreActions).toEqual(expectedToolbarMore);

  await toolbar.closeMoreMenu();
  await Utils.pressEscape();
}

const toRemove = ['Close', 'Previous File', 'Next File', 'View details'];

function removeClosePreviousNextOldInfo(actions: string[]): string[] {
  return actions.filter((elem) => !toRemove.includes(elem));
}
