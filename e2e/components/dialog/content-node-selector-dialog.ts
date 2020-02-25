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

import { ElementFinder, by, browser, ExpectedConditions as EC, protractor } from 'protractor';
import { BROWSER_WAIT_TIMEOUT } from '../../configs';
import { GenericDialog } from '../dialog/generic-dialog';
import { Utils } from '../../utilities/utils';
import { DropDownBreadcrumb } from '../breadcrumb/dropdown-breadcrumb';
import { DataTable } from '../data-table/data-table';

export class ContentNodeSelectorDialog extends GenericDialog {
  private static selectors = {
    root: '.adf-content-node-selector-dialog',

    locationDropDown: 'site-dropdown-container',
    locationOption: '.mat-option .mat-option-text',

    dataTable: '.adf-datatable-body',
    selectedRow: '.adf-is-selected',

    searchInput: '#searchInput',
    toolbarTitle: '.adf-toolbar-title',

    cancelButton: by.css('[data-automation-id="content-node-selector-actions-cancel"]'),
    copyButton: by.cssContainingText('[data-automation-id="content-node-selector-actions-choose"]', 'Copy'),
    moveButton: by.cssContainingText('[data-automation-id="content-node-selector-actions-choose"]', 'Move')
  };

  locationDropDown: ElementFinder = this.rootElem.element(by.id(ContentNodeSelectorDialog.selectors.locationDropDown));
  locationPersonalFiles: ElementFinder = browser.element(by.cssContainingText(ContentNodeSelectorDialog.selectors.locationOption, 'Personal Files'));
  locationFileLibraries: ElementFinder = browser.element(by.cssContainingText(ContentNodeSelectorDialog.selectors.locationOption, 'File Libraries'));

  searchInput: ElementFinder = this.rootElem.element(by.css(ContentNodeSelectorDialog.selectors.searchInput));
  toolbarTitle: ElementFinder = this.rootElem.element(by.css(ContentNodeSelectorDialog.selectors.toolbarTitle));

  breadcrumb: DropDownBreadcrumb = new DropDownBreadcrumb();
  dataTable: DataTable = new DataTable(ContentNodeSelectorDialog.selectors.root);

  constructor() {
    super(ContentNodeSelectorDialog.selectors.root);
  }

  async waitForDropDownToOpen(): Promise<void> {
    await browser.wait(EC.presenceOf(this.locationPersonalFiles), BROWSER_WAIT_TIMEOUT);
  }

  async waitForDropDownToClose(): Promise<void> {
    await browser.wait(EC.stalenessOf(browser.$(ContentNodeSelectorDialog.selectors.locationOption)), BROWSER_WAIT_TIMEOUT);
  }

  async waitForRowToBeSelected(): Promise<void> {
    await browser.wait(EC.presenceOf(browser.element(by.css(ContentNodeSelectorDialog.selectors.selectedRow))), BROWSER_WAIT_TIMEOUT);
  }

  async clickCancel(): Promise<void> {
    await this.clickButton(ContentNodeSelectorDialog.selectors.cancelButton);
    await this.waitForDialogToClose();
  }

  async clickCopy(): Promise<void> {
    await this.clickButton(ContentNodeSelectorDialog.selectors.copyButton);
  }

  async clickMove(): Promise<void> {
    await this.clickButton(ContentNodeSelectorDialog.selectors.moveButton);
  }

  async selectLocation(location: 'Personal Files' | 'File Libraries'): Promise<void> {
    await this.locationDropDown.click();
    await this.waitForDropDownToOpen();

    if (location === 'Personal Files') {
      await this.locationPersonalFiles.click();
    } else {
      await this.locationFileLibraries.click();
    }

    await this.waitForDropDownToClose();
  }

  async selectDestination(folderName: string): Promise<void> {
    const row = this.dataTable.getRowByName(folderName);
    await Utils.waitUntilElementClickable(row);
    await row.click();
    await this.waitForRowToBeSelected();
  }

  async isSearchInputPresent(): Promise<boolean> {
    return await this.searchInput.isPresent();
  }

  async isSelectLocationDropdownDisplayed(): Promise<boolean> {
    return (await this.locationDropDown.isPresent()) && (await this.locationDropDown.isDisplayed());
  }

  async isCopyButtonEnabled(): Promise<boolean> {
    return this.isButtonEnabled(ContentNodeSelectorDialog.selectors.copyButton);
  }

  async isCancelButtonEnabled(): Promise<boolean> {
    return this.isButtonEnabled(ContentNodeSelectorDialog.selectors.cancelButton);
  }

  async searchFor(text: string): Promise<void> {
    await Utils.clearFieldWithBackspace(this.searchInput);
    await this.searchInput.sendKeys(text);
    await this.searchInput.sendKeys(protractor.Key.ENTER);
  }

  async getToolbarTitle(): Promise<string> {
    return await this.toolbarTitle.getText();
  }
}
