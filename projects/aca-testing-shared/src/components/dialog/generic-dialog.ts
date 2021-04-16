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

import { ElementFinder, by, browser, Locator } from 'protractor';
import { isPresentAndDisplayed, waitForPresence, waitForStaleness } from '../../utilities/utils';
import { BrowserVisibility, Logger } from '@alfresco/adf-testing';

export abstract class GenericDialog {
  protected constructor(private rootCssSelector?: string) {}

  get rootElem(): ElementFinder {
    return browser.element(by.css(this.rootCssSelector));
  }

  get title(): ElementFinder {
    return this.rootElem.element(by.css('.mat-dialog-title'));
  }

  get content(): ElementFinder {
    return this.rootElem.element(by.css('.mat-dialog-content'));
  }

  async getText(): Promise<string> {
    return this.content.getText();
  }

  async waitForDialogToOpen(): Promise<void> {
    await waitForPresence(this.rootElem);
    await BrowserVisibility.waitUntilElementIsVisible(this.content);
    await waitForPresence(browser.element(by.css('.cdk-overlay-backdrop')));
  }

  async waitForDialogToClose(): Promise<void> {
    try {
      await waitForStaleness(this.content);
    } catch (error) {
      Logger.error(`GenericDialog waitForDialogToClose :  catch : ${error}`);
    }
  }

  async isDialogOpen(): Promise<boolean> {
    return isPresentAndDisplayed(this.rootElem);
  }

  async getDialogTitle(): Promise<string> {
    return this.title.getText();
  }

  protected childElement(selector: Locator): ElementFinder {
    return this.rootElem.element(selector);
  }
}
