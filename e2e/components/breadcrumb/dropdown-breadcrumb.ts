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

import { ElementFinder, ElementArrayFinder, by, browser, ExpectedConditions as EC } from 'protractor';
import { BROWSER_WAIT_TIMEOUT } from '../../configs';
import { Component } from '../component';

export class DropDownBreadcrumb extends Component {
  private static selectors = {
    root: '.adf-dropdown-breadcrumb',
    trigger: '.adf-dropdown-breadcrumb-trigger',

    currentFolder: '.adf-current-folder',

    pathOption: '.adf-dropdown-breadcrumb-path-option .mat-option-text'
  };

  trigger: ElementFinder = this.component.element(by.css(DropDownBreadcrumb.selectors.trigger));
  pathItems: ElementArrayFinder = browser.$$(DropDownBreadcrumb.selectors.pathOption);
  pathItemsContainer: ElementFinder = browser.element(by.css('.mat-select-panel'));
  currentFolder: ElementFinder = this.component.element(by.css(DropDownBreadcrumb.selectors.currentFolder));

  constructor(ancestor?: string) {
    super(DropDownBreadcrumb.selectors.root, ancestor);
  }

  async waitForPathListDropdownToOpen(): Promise<void> {
    await browser.wait(EC.presenceOf(this.pathItemsContainer), BROWSER_WAIT_TIMEOUT, 'Timeout waiting for breadcrumb dropdown to open');
  }

  async waitForPathListDropdownToClose(): Promise<void> {
    await browser.wait(EC.stalenessOf(browser.$(DropDownBreadcrumb.selectors.pathOption)), BROWSER_WAIT_TIMEOUT, 'Timeout waiting for breadcrumb dropdown to close');
  }

  async getCurrentFolderName(): Promise<string> {
    return this.currentFolder.getText();
  }

  async openPath(): Promise<void> {
    await this.trigger.click();
    await this.waitForPathListDropdownToOpen();
  }

  async clickPathItem(name: string): Promise<void> {
    const elem = browser.element(by.cssContainingText(DropDownBreadcrumb.selectors.pathOption, name));
    await elem.click();
  }

  async getPathItems(): Promise<string[]> {
    const items: string[] = await this.pathItems.map(async elem => {
      return elem.getText();
    });
    return items;
  }
}
