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
import { Utils, isPresentAndDisplayed, waitForStaleness, waitForPresence, isPresentAndEnabled, waitForClickable } from '../../utilities/utils';
import { DropDownBreadcrumb } from '../breadcrumb/dropdown-breadcrumb';
import { DataTable } from '../data-table/data-table';

export class ContentNodeSelectorDialog extends GenericDialog {
  cancelButton = this.childElement(by.css('[data-automation-id="content-node-selector-actions-cancel"]'));
  copyButton = this.childElement(by.cssContainingText('[data-automation-id="content-node-selector-actions-choose"]', 'Copy'));
  moveButton = this.childElement(by.cssContainingText('[data-automation-id="content-node-selector-actions-choose"]', 'Move'));

  locationDropDown = this.rootElem.element(by.id('site-dropdown-container'));
  locationPersonalFiles = browser.element(by.cssContainingText('.mat-option .mat-option-text', 'Personal Files'));
  locationFileLibraries = browser.element(by.cssContainingText('.mat-option .mat-option-text', 'File Libraries'));

  searchInput = this.rootElem.element(by.css('#searchInput'));
  toolbarTitle = this.rootElem.element(by.css('.adf-toolbar-title'));

  breadcrumb = new DropDownBreadcrumb();
  dataTable = new DataTable('.adf-content-node-selector-dialog');

  constructor() {
    super('.adf-content-node-selector-dialog');
  }

  async waitForDropDownToClose(): Promise<void> {
    await waitForStaleness(browser.$('.mat-option .mat-option-text'))
  }

  async selectLocation(location: 'Personal Files' | 'File Libraries'): Promise<void> {
    await this.locationDropDown.click();
    await waitForPresence(this.locationPersonalFiles);

    if (location === 'Personal Files') {
      await this.locationPersonalFiles.click();
    } else {
      await this.locationFileLibraries.click();
    }

    await this.waitForDropDownToClose();
  }

  async selectDestination(folderName: string): Promise<void> {
    const row = this.dataTable.getRowByName(folderName);
    await waitForClickable(row);
    await row.click();
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
    await Utils.clearFieldWithBackspace(this.searchInput);
    await this.searchInput.sendKeys(text);
    await this.searchInput.sendKeys(protractor.Key.ENTER);
  }

  async getToolbarTitle(): Promise<string> {
    return this.toolbarTitle.getText();
  }
}
