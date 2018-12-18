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
    shareEdit: `.mat-icon-button[title='Shared link settings']`,
    view: `.mat-icon-button[title='View']`,
    download: `.mat-icon-button[title='Download']`,
    edit: `.mat-icon-button[title='Edit']`,
    viewDetails: `.mat-icon-button[title='View details']`,
    print: `.mat-icon-button[title='Print']`,
    fullScreen: `.mat-icon-button[title='Activate full-screen mode']`,
    joinLibrary: `.mat-icon-button[title='Join']`,
    leaveLibrary: `.mat-icon-button[title='Leave library']`
  };

  menu: Menu = new Menu();
  buttons: ElementArrayFinder = this.component.all(by.css(Toolbar.selectors.button));
  shareButton: ElementFinder = this.component.element(by.css(Toolbar.selectors.share));
  shareEditButton: ElementFinder = this.component.element(by.css(Toolbar.selectors.shareEdit));
  viewButton: ElementFinder = this.component.element(by.css(Toolbar.selectors.view));
  downloadButton: ElementFinder = this.component.element(by.css(Toolbar.selectors.download));
  editButton: ElementFinder = this.component.element(by.css(Toolbar.selectors.edit));
  viewDetailsButton: ElementFinder = this.component.element(by.css(Toolbar.selectors.viewDetails));
  printButton: ElementFinder = this.component.element(by.css(Toolbar.selectors.print));
  fullScreenButton: ElementFinder = this.component.element(by.css(Toolbar.selectors.fullScreen));
  joinButton: ElementFinder = this.component.element(by.css(Toolbar.selectors.joinLibrary));
  leaveButton: ElementFinder = this.component.element(by.css(Toolbar.selectors.leaveLibrary));

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

  async clickShareEditButton() {
    const btn = this.shareEditButton;
    await btn.click();
  }

  async isShareEditButtonPresent() {
    return await browser.isElementPresent(this.shareEditButton);
  }

  async isShareButtonPresent() {
    return await browser.isElementPresent(this.shareButton);
  }

  async isViewButtonPresent() {
    return await browser.isElementPresent(this.viewButton);
  }

  async isDownloadButtonPresent() {
    return await browser.isElementPresent(this.downloadButton);
  }

  async isEditButtonPresent() {
    return await browser.isElementPresent(this.editButton);
  }

  async isViewDetailsButtonPresent() {
    return await browser.isElementPresent(this.viewDetailsButton);
  }

  async isPrintButtonPresent() {
    return await browser.isElementPresent(this.printButton);
  }

  async isFullScreenButtonPresent() {
    return await browser.isElementPresent(this.fullScreenButton);
  }


  async clickEditButton() {
    return await this.editButton.click();
  }

  async clickJoinButton() {
    return await this.joinButton.click();
  }

  async clickLeaveButton() {
    return await this.leaveButton.click();
  }


  async clickFavorite() {
    await this.openMoreMenu();
    return await this.menu.clickMenuItem('Favorite');
  }

}
