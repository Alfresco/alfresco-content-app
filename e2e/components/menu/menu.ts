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

import { ElementFinder, ElementArrayFinder, by, browser, ExpectedConditions as EC } from 'protractor';
import { BROWSER_WAIT_TIMEOUT } from '../../configs';
import { Component } from '../component';
import { Utils } from '../../utilities/utils'

export class Menu extends Component {
  private static selectors = {
    root: '.mat-menu-panel',
    item: '.mat-menu-item',
    icon: '.mat-icon',
    uploadFiles: 'app-upload-files',

    submenu: 'app-context-menu-item .mat-menu-item'
  };

  items: ElementArrayFinder = this.component.all(by.css(Menu.selectors.item));
  backdrop: ElementFinder = browser.element(by.css('.cdk-overlay-backdrop'));
  uploadFiles: ElementFinder = browser.element(by.id(Menu.selectors.uploadFiles));
  submenus: ElementArrayFinder = browser.element.all(by.css(Menu.selectors.submenu));

  constructor(ancestor?: ElementFinder) {
    super(Menu.selectors.root, ancestor);
  }

  async waitForMenuToOpen() {
    await browser.wait(EC.presenceOf(browser.element(by.css('.cdk-overlay-backdrop'))), BROWSER_WAIT_TIMEOUT);
    await browser.wait(EC.presenceOf(browser.element(by.css('.mat-menu-panel'))), BROWSER_WAIT_TIMEOUT);
    await browser.wait(EC.visibilityOf(this.items.get(0)), BROWSER_WAIT_TIMEOUT);
  }

  async waitForMenuToClose() {
    await browser.wait(EC.not(EC.presenceOf(browser.element(by.css('.mat-menu-panel')))), BROWSER_WAIT_TIMEOUT);
  }

  async closeMenu() {
    // if (await this.backdrop.isPresent()) {
    //   return await this.backdrop.click();
    // } else {
    //   return await browser.actions().mouseMove(browser.$('body'), { x: 0, y: 0 }).click().perform();
    // }
    return Utils.pressEscape();
  }

  getNthItem(nth: number) {
    return this.items.get(nth - 1);
  }

  getItemByLabel(menuItem: string) {
    return this.component.element(by.cssContainingText(Menu.selectors.item, menuItem));
  }

  getSubItemByLabel(subMenuItem: string) {
    return this.component.element(by.cssContainingText(Menu.selectors.submenu, subMenuItem));
  }

  getItemById(id: string) {
    return this.component.element(by.id(id));
  }

  async getItemTooltip(menuItem: string) {
    return await this.getItemByLabel(menuItem).getAttribute('title');
  }

  async getItemIconText(menuItem: string) {
    return await this.getItemByLabel(menuItem).element(by.css(Menu.selectors.icon)).getText();
  }

  async getItemIdAttribute(menuItem: string) {
    return await this.getItemByLabel(menuItem).getAttribute('id');
  }

  async getItemsCount() {
    return await this.items.count();
  }

  async clickNthItem(nth: number) {
    const elem = this.getNthItem(nth);
    await browser.wait(EC.elementToBeClickable(elem), BROWSER_WAIT_TIMEOUT);
    await browser.actions().mouseMove(elem).click().perform();
    await this.waitForMenuToClose();
  }

  async clickMenuItem(menuItem: string) {
    try {
      const elem = this.getItemByLabel(menuItem);
      await browser.wait(EC.elementToBeClickable(elem), BROWSER_WAIT_TIMEOUT);
      await elem.click();
    } catch (e) {
      console.log('___click menu item catch___', e);
    }
  }

  async mouseOverMenuItem(menuItem: string) {
    try {
      const elem = this.getItemByLabel(menuItem);
      await browser.wait(EC.elementToBeClickable(elem), BROWSER_WAIT_TIMEOUT);
      await browser.actions().mouseMove(elem).perform();
      await browser.sleep(500);
    } catch (error) {
      console.log('----- mouse over error: ', error);
    }
  }

  async hasSubMenu(menuItem: string) {
    try {
      const elem = this.getItemByLabel(menuItem);
      await browser.wait(EC.elementToBeClickable(elem), BROWSER_WAIT_TIMEOUT);
      const elemClass = await elem.getAttribute('class');
      return elemClass.includes('mat-menu-item-submenu-trigger');
    } catch (error) {
      console.log('---- has submenu error: ', error);
    }
  }

  async clickSubMenuItem(subMenuItem: string) {
    try {
      const elem = this.getSubItemByLabel(subMenuItem);
      await browser.wait(EC.elementToBeClickable(elem), BROWSER_WAIT_TIMEOUT);
      await elem.click();
    } catch (e) {
      console.log('___click submenu item catch___', e);
    }
  }

  async isMenuItemPresent(title: string) {
    return await this.component.element(by.cssContainingText(Menu.selectors.item, title)).isPresent();
  }

  async isSubMenuItemPresent(title: string) {
    return await browser.element(by.cssContainingText(Menu.selectors.submenu, title)).isPresent();
  }

  async getSubmenuItemsCount() {
    return await this.submenus.count();
  }

  async isMenuItemDisabled(title: string) {
    try {
      const item = this.getItemByLabel(title);
      const disabled = await item.getAttribute('disabled');
      return disabled;
    } catch (error) {
      console.log('----- isMenuItemDisabled catch: ', error);
    }
  }

  uploadFile() {
    return this.uploadFiles;
  }
}
