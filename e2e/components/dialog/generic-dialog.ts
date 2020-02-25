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

import { ElementFinder, by, browser, ExpectedConditions as EC, Locator } from 'protractor';
import { BROWSER_WAIT_TIMEOUT } from '../../configs';

export abstract class GenericDialog {
  private static locators = {
    title: '.mat-dialog-title',
    content: '.mat-dialog-content'
  };

  private rootCssSelector: string;

  constructor(selector?: string) {
    this.rootCssSelector = selector;
  }

  get rootElem(): ElementFinder {
    return browser.element(by.css(this.rootCssSelector));
  }

  get title(): ElementFinder {
    return this.rootElem.element(by.css(GenericDialog.locators.title));
  }

  get content(): ElementFinder {
    return this.rootElem.element(by.css(GenericDialog.locators.content));
  }

  async getText(): Promise<string> {
    return this.content.getText();
  }

  async waitForDialogToOpen(): Promise<void> {
    await browser.wait(EC.presenceOf(this.rootElem), BROWSER_WAIT_TIMEOUT);
    await browser.wait(EC.visibilityOf(this.content), BROWSER_WAIT_TIMEOUT);
    await browser.wait(EC.presenceOf(browser.element(by.css('.cdk-overlay-backdrop'))), BROWSER_WAIT_TIMEOUT);
  }

  async waitForDialogToClose(): Promise<void> {
    await browser.wait(EC.stalenessOf(this.content), BROWSER_WAIT_TIMEOUT, '---- timeout waiting for dialog to close ----');
  }

  async isDialogOpen(): Promise<boolean> {
    return (await this.rootElem.isPresent()) && (await this.rootElem.isDisplayed());
  }

  async getTitle(): Promise<string> {
    return this.title.getText();
  }

  getActionButton(selector: Locator): ElementFinder {
    return this.rootElem.element(selector);
  }

  async isButtonEnabled(selector: Locator): Promise<boolean> {
    return (await this.getActionButton(selector).isPresent()) && (await this.getActionButton(selector).isEnabled());
  }

  async clickButton(selector: Locator): Promise<void> {
    await this.getActionButton(selector).click();
  }
}
