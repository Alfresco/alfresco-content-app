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

import { ElementFinder, by, browser } from 'protractor';
import { Component } from '../component';

export class ConfirmDialog extends Component {
  selectors = {
    root: 'adf-confirm-dialog',

    title: '.mat-dialog-title',
    content: '.mat-dialog-content',
    accept: 'adf-confirm-accept',
    cancel: 'adf-confirm-cancel',
    actionButton: 'adf-confirm'
  };

  title = this.getByCss(this.selectors.title);
  content = this.getByCss(this.selectors.content);
  acceptButton = this.getById(this.selectors.accept);
  cancelButton = this.getById(this.selectors.cancel);
  actionButton = this.getById(this.selectors.actionButton);

  constructor(ancestor?: ElementFinder) {
    super('adf-confirm-dialog', ancestor);
  }

  async waitForDialogToClose() {
    return await this.waitStale(this.title);
  }

  async waitForDialogToOpen() {
    return await this.wait(this.title);
  }

  async isDialogOpen() {
    return await browser.isElementPresent(by.css(this.selectors.root));
  }

  async getTitle() {
    return await this.title.getText();
  }

  async getText() {
    return await this.content.getText();
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
    return await button.isEnabled();
  }

  async isOkEnabled() {
    return await this.isButtonEnabled('OK');
  }

  async isCancelEnabled() {
    return await this.isButtonEnabled('Cancel');
  }

  async isKeepEnabled() {
    return await this.isButtonEnabled('Keep');
  }

  async isDeleteEnabled() {
    return await this.isButtonEnabled('Delete');
  }

  async isRemoveEnabled() {
    return await this.isButtonEnabled('Remove');
  }

  async clickOk() {
    return await this.clickButton('OK');
  }

  async clickCancel() {
    return await this.cancelButton.click();
  }

  async clickKeep() {
    return await this.clickButton('Keep');
  }

  async clickDelete() {
    return await this.clickButton('Delete');
  }

  async clickRemove() {
    return await this.clickButton('Remove');
  }
}
