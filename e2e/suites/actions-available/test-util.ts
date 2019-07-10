import { BrowsingPage } from '../../pages/pages';
import { Viewer } from '../../components/viewer/viewer';
import { Utils } from '../../utilities/utils';

const page = new BrowsingPage();
const { dataTable, toolbar } = page;
const contextMenu = dataTable.menu;
const viewer = new Viewer();


export async function checkContextMenu(item: string, expectedContextMenu: string[]) {
  await dataTable.rightClickOnItem(item);
  const actualActions = await contextMenu.getMenuItems();
  expect(actualActions.length).toBe(expectedContextMenu.length, 'Incorrect number of context menu items');
  expect(JSON.stringify(actualActions)).toEqual(JSON.stringify(expectedContextMenu), 'Incorrect context menu actions');
}

export async function checkToolbarPrimary(item: string, expectedToolbarPrimary: string[]) {
  await dataTable.selectItem(item);

  const actualPrimaryActions = await toolbar.getButtons();
  expect(actualPrimaryActions.length).toBe(expectedToolbarPrimary.length, 'Incorrect number of toolbar primary items');
  expect(JSON.stringify(actualPrimaryActions)).toEqual(JSON.stringify(expectedToolbarPrimary), 'Incorrect toolbar primary actions');
}

export async function checkToolbarMoreActions(item: string, expectedToolbarMore: string[]) {
  await dataTable.selectItem(item);

  await toolbar.openMoreMenu();

  const actualMoreActions = await toolbar.menu.getMenuItems();
  expect(actualMoreActions.length).toBe(expectedToolbarMore.length, 'Incorrect number of toolbar More menu items');
  expect(JSON.stringify(actualMoreActions)).toEqual(JSON.stringify(expectedToolbarMore), 'Incorrect toolbar More actions');

  await toolbar.closeMoreMenu();
}

export async function checkMultipleSelContextMenu(items: string[], expectedContextMenu: string[]) {
  await dataTable.selectMultipleItems(items);
  await dataTable.rightClickOnMultipleSelection();

  const actualActions = await contextMenu.getMenuItems();
  expect(actualActions.length).toBe(expectedContextMenu.length, 'Incorrect number of context menu items');
  expect(JSON.stringify(actualActions)).toEqual(JSON.stringify(expectedContextMenu), 'Incorrect context menu actions');
}

export async function checkMultipleSelToolbarPrimary(items: string[], expectedToolbarPrimary: string[]) {
  await dataTable.selectMultipleItems(items);

  const actualPrimaryActions = await toolbar.getButtons();
  expect(actualPrimaryActions.length).toBe(expectedToolbarPrimary.length, 'Incorrect number of toolbar primary items');
  expect(JSON.stringify(actualPrimaryActions)).toEqual(JSON.stringify(expectedToolbarPrimary), 'Incorrect toolbar primary actions');
}

export async function checkMultipleSelToolbarMoreActions(items: string[], expectedToolbarMore: string[]) {
  await dataTable.selectMultipleItems(items);

  await toolbar.openMoreMenu();

  const actualMoreActions = await toolbar.menu.getMenuItems();
  expect(actualMoreActions.length).toBe(expectedToolbarMore.length, 'Incorrect number of toolbar More menu items');
  expect(JSON.stringify(actualMoreActions)).toEqual(JSON.stringify(expectedToolbarMore), 'Incorrect toolbar More actions');

  await toolbar.closeMoreMenu();
}

export async function checkViewerToolbarPrimaryActions(item: string, expectedToolbarPrimary: string[]) {
  await dataTable.doubleClickOnRowByName(item);
  await viewer.waitForViewerToOpen();

  let actualPrimaryActions = await toolbar.getButtons();

  actualPrimaryActions = removeClosePreviousNextOldInfo(actualPrimaryActions);

  expect(actualPrimaryActions.length).toBe(expectedToolbarPrimary.length, 'Incorrect number of viewer toolbar primary items');
  expect(JSON.stringify(actualPrimaryActions)).toEqual(JSON.stringify(expectedToolbarPrimary), 'Incorrect viewer toolbar primary actions');

  await Utils.pressEscape();
}

export async function checkViewerToolbarMoreActions(item: string, expectedToolbarMore: string[]) {
  await dataTable.doubleClickOnRowByName(item);
  await viewer.waitForViewerToOpen();
  await toolbar.openMoreMenu();

  const actualMoreActions = await toolbar.menu.getMenuItems();

  expect(actualMoreActions.length).toBe(expectedToolbarMore.length, 'Incorrect number of toolbar More menu items');
  expect(JSON.stringify(actualMoreActions)).toEqual(JSON.stringify(expectedToolbarMore), 'Incorrect toolbar More actions');

  await toolbar.closeMoreMenu();
  await Utils.pressEscape();
}


function removeClosePreviousNextOldInfo(actions: string[]) {
  return actions.filter(elem => {
    if ( (elem !== 'Close') && (elem !== 'Previous File') && (elem !== 'Next File') && (elem !== 'View details')) {
      return elem;
    }
  });
}
