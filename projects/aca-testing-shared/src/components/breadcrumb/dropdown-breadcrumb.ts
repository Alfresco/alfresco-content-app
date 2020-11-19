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

import { browser, by } from 'protractor';
import { Component } from '../component';
import { waitForPresence, waitForStaleness } from '../../utilities/utils';
import { BrowserActions } from '@alfresco/adf-testing';

export class DropDownBreadcrumb extends Component {
  pathOptionCss = '.adf-dropdown-breadcrumb-path-option .mat-option-text';
  trigger = this.byCss('.adf-dropdown-breadcrumb-trigger');
  pathItems = browser.$$(this.pathOptionCss);
  pathItemsContainer = this.byCss('.mat-select-panel', browser);
  currentFolder = this.byCss('.adf-current-folder');

  constructor(ancestor?: string) {
    super('.adf-dropdown-breadcrumb', ancestor);
  }

  async waitForPathListDropdownToOpen(): Promise<void> {
    return waitForPresence(this.pathItemsContainer, 'Timeout waiting for breadcrumb dropdown to open');
  }

  async waitForPathListDropdownToClose(): Promise<void> {
    return waitForStaleness(browser.$(this.pathOptionCss), 'Timeout waiting for breadcrumb dropdown to close');
  }

  async openPath(): Promise<void> {
    await BrowserActions.click(this.trigger);
    await this.waitForPathListDropdownToOpen();
  }

  async clickPathItem(name: string): Promise<void> {
    const elem = browser.element(by.cssContainingText(this.pathOptionCss, name));
    await BrowserActions.click(elem);
  }

  async getPathItems(): Promise<string[]> {
    return this.pathItems.map(async (elem) => {
      return elem.getText();
    });
  }
}
