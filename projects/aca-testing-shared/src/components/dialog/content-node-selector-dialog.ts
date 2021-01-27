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

import { by, browser, protractor } from 'protractor';
import { GenericDialog } from '../dialog/generic-dialog';
import { isPresentAndDisplayed, waitForStaleness, waitForPresence, isPresentAndEnabled } from '../../utilities/utils';
import { DropDownBreadcrumb } from '../breadcrumb/dropdown-breadcrumb';
import { DataTable } from '../data-table/data-table';
import { BrowserActions } from '@alfresco/adf-testing';

export class ContentNodeSelectorDialog extends GenericDialog {
  cancelButton = this.childElement(by.css('[data-automation-id="content-node-selector-actions-cancel"]'));
  copyButton = this.childElement(by.cssContainingText('[data-automation-id="content-node-selector-actions-choose"]', 'Copy'));
  moveButton = this.childElement(by.cssContainingText('[data-automation-id="content-node-selector-actions-choose"]', 'Move'));

  locationDropDown = this.rootElem.element(by.id('site-dropdown-container'));
  locationPersonalFiles = browser.element(by.cssContainingText('.mat-option .mat-option-text', 'Personal Files'));
  locationFileLibraries = browser.element(by.cssContainingText('.mat-option .mat-option-text', 'My Libraries'));

  searchInput = this.rootElem.element(by.css('#searchInput'));
  toolbarTitle = this.rootElem.element(by.css('.adf-toolbar-title'));

  breadcrumb = new DropDownBreadcrumb();
  dataTable = new DataTable('.adf-content-node-selector-dialog');

  constructor() {
    super('.adf-content-node-selector-dialog');
  }

  get content() {
    return this.rootElem.element(by.css('.adf-content-node-selector-content'));
  }

  async waitForDropDownToClose(): Promise<void> {
    await waitForStaleness(browser.$('.mat-option .mat-option-text'));
  }

  async selectLocation(location: string): Promise<void> {
    await BrowserActions.click(this.locationDropDown);

    if (location === 'Personal Files') {
      await BrowserActions.click(this.locationPersonalFiles);
    } else {
      await BrowserActions.click(this.locationFileLibraries);
    }

    await this.waitForDropDownToClose();
  }

  async selectDestination(folderName: string): Promise<void> {
    const row = this.dataTable.getRowByName(folderName);
    await BrowserActions.click(row);
    await waitForPresence(browser.element(by.css('.adf-is-selected')));
  }

  async isSelectLocationDropdownDisplayed(): Promise<boolean> {
    return isPresentAndDisplayed(this.locationDropDown);
  }

  async isCopyButtonEnabled(): Promise<boolean> {
    return isPresentAndEnabled(this.copyButton);
  }

  async isCancelButtonEnabled(): Promise<boolean> {
    return isPresentAndEnabled(this.cancelButton);
  }

  async searchFor(text: string): Promise<void> {
    await BrowserActions.clearWithBackSpace(this.searchInput);
    await this.searchInput.sendKeys(text);
    await this.searchInput.sendKeys(protractor.Key.ENTER);
  }

  async getToolbarTitle(): Promise<string> {
    return this.toolbarTitle.getText();
  }
}
