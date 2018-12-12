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

import { ElementFinder, ElementArrayFinder, by, protractor, browser } from 'protractor';
import { Menu } from '../menu/menu';
import { Component } from '../component';

export class Toolbar extends Component {
  private static selectors = {
    root: '.adf-toolbar',
    button: 'button',
    
    share: `.mat-icon-button[title='Share']`,
    shareEdit: `.mat-icon-button[title='Shared link settings']`
  };

  menu: Menu = new Menu();
  buttons: ElementArrayFinder = this.component.all(by.css(Toolbar.selectors.button));
  shareButton: ElementFinder = this.component.element(by.css(Toolbar.selectors.share));
  shareEditButton: ElementFinder = this.component.element(by.css(Toolbar.selectors.shareEdit));

  constructor(ancestor?: ElementFinder) {
    super(Toolbar.selectors.root, ancestor);
  }

  async isEmpty() {
    const count = await this.buttons.count();
    return count === 0;
  }

  async isButtonPresent(title: string) {
    const elem = this.component.element(by.css(`${Toolbar.selectors.button}[title="${title}"]`));
    return await elem.isPresent();
  }

  getButtonByLabel(label: string) {
    return this.component.element(by.cssContainingText(Toolbar.selectors.button, label));
  }

  getButtonByTitleAttribute(title: string) {
    return this.component.element(by.css(`${Toolbar.selectors.button}[title="${title}"]`));
  }

  getButtonById(id: string) {
    return this.component.element(by.id(id));
  }

  async openMoreMenu() {
    await this.isButtonPresent('More actions');
    const moreMenu = this.getButtonByTitleAttribute('More actions');
    await moreMenu.click();
    await this.menu.waitForMenuToOpen();
  }

  async closeMoreMenu() {
    await browser.actions().sendKeys(protractor.Key.ESCAPE).perform();
  }

  async getButtonTooltip(button: ElementFinder) {
    return await button.getAttribute('title');
  }

  async clickButton(title: string) {
    const btn = this.getButtonByTitleAttribute(title);
    await btn.click();
  }

  async clickShareButton() {
    const btn = this.shareButton;
    await btn.click();
  }

  async isShareButtonPresent() {
    return await browser.isElementPresent(this.shareButton);
  }

  async clickShareEditButton() {
    const btn = this.shareEditButton;
    await btn.click();
  }

  async isShareEditButtonPresent() {
    return await browser.isElementPresent(this.shareEditButton);
  }
}
