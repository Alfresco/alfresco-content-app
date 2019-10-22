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

import { ElementFinder, by, browser, ExpectedConditions as EC } from 'protractor';
import { BROWSER_WAIT_TIMEOUT } from '../../configs';
import { Component } from '../component';

export class ConfirmDialog extends Component {
  private static selectors = {
    root: 'adf-confirm-dialog',

    title: '.mat-dialog-title',
    content: '.mat-dialog-content',
    accept: 'adf-confirm-accept',
    cancel: 'adf-confirm-cancel',
    actionButton: 'adf-confirm'
  };

  title: ElementFinder = this.component.element(by.css(ConfirmDialog.selectors.title));
  content: ElementFinder = this.component.element(by.css(ConfirmDialog.selectors.content));
  acceptButton: ElementFinder = this.component.element(by.id(ConfirmDialog.selectors.accept));
  cancelButton: ElementFinder = this.component.element(by.id(ConfirmDialog.selectors.cancel));
  actionButton: ElementFinder = this.component.element(by.id(ConfirmDialog.selectors.actionButton));

  constructor(ancestor?: ElementFinder) {
    super(ConfirmDialog.selectors.root, ancestor);
  }

  async waitForDialogToClose() {
    await browser.wait(EC.stalenessOf(this.title), BROWSER_WAIT_TIMEOUT);
  }

  async waitForDialogToOpen() {
    await browser.wait(EC.presenceOf(this.title), BROWSER_WAIT_TIMEOUT);
  }

  async isDialogOpen() {
    return browser.isElementPresent(by.css(ConfirmDialog.selectors.root));
  }

  async getTitle() {
    return this.title.getText();
  }

  async getText() {
    return this.content.getText();
  }

  getButtonByName(name: string) {
    return this.component.element(by.buttonText(name));
  }

  async clickButton(name: string) {
    const button = this.getButtonByName(name);
    await button.click();
  }

  async isButtonEnabled(name: string) {
    const button = this.getButtonByName(name);
    return button.isEnabled();
  }


  async isOkEnabled() {
    return this.isButtonEnabled('OK');
  }

  async isCancelEnabled() {
    return this.isButtonEnabled('Cancel');
  }

  async isKeepEnabled() {
    return this.isButtonEnabled('Keep');
  }

  async isDeleteEnabled() {
    return this.isButtonEnabled('Delete');
  }

  async isRemoveEnabled() {
    return this.isButtonEnabled('Remove');
  }


  async clickOk() {
    await this.clickButton('OK');
  }

  async clickCancel() {
    await this.cancelButton.click();
  }

  async clickKeep() {
    await this.clickButton('Keep');
  }

  async clickDelete() {
    await this.clickButton('Delete');
  }

  async clickRemove() {
    await this.clickButton('Remove');
  }

}
