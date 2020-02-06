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
import { Component } from '../component';
import { Utils } from '../../utilities/utils';
import { DropDownBreadcrumb } from '../breadcrumb/dropdown-breadcrumb';
import { DataTable } from '../data-table/data-table';

export class ContentNodeSelectorDialog extends Component {
  private static selectors = {
    root: '.adf-content-node-selector-dialog',

    title: '.mat-dialog-title',
    locationDropDown: 'site-dropdown-container',
    locationOption: '.mat-option .mat-option-text',

    dataTable: '.adf-datatable-body',
    selectedRow: '.adf-is-selected',

    button: '.mat-dialog-actions button',
    chooseAction: '.adf-choose-action',

    searchInput: '#searchInput',
    toolbarTitle: '.adf-toolbar-title'
  };

  title: ElementFinder = this.component.element(by.css(ContentNodeSelectorDialog.selectors.title));
  locationDropDown: ElementFinder = this.component.element(by.id(ContentNodeSelectorDialog.selectors.locationDropDown));
  locationPersonalFiles: ElementFinder = browser.element(by.cssContainingText(ContentNodeSelectorDialog.selectors.locationOption, 'Personal Files'));
  locationFileLibraries: ElementFinder = browser.element(by.cssContainingText(ContentNodeSelectorDialog.selectors.locationOption, 'File Libraries'));

  cancelButton: ElementFinder = this.component.element(by.cssContainingText(ContentNodeSelectorDialog.selectors.button, 'Cancel'));
  copyButton: ElementFinder = this.component.element(by.css(ContentNodeSelectorDialog.selectors.chooseAction));
  moveButton: ElementFinder = this.component.element(by.cssContainingText(ContentNodeSelectorDialog.selectors.button, 'Move'));

  searchInput: ElementFinder = this.component.element(by.css(ContentNodeSelectorDialog.selectors.searchInput));
  toolbarTitle: ElementFinder = this.component.element(by.css(ContentNodeSelectorDialog.selectors.toolbarTitle));

  breadcrumb: DropDownBreadcrumb = new DropDownBreadcrumb();
  dataTable: DataTable = new DataTable(ContentNodeSelectorDialog.selectors.root);

  constructor(ancestor?: string) {
    super(ContentNodeSelectorDialog.selectors.root, ancestor);
  }

  async waitForDialogToOpen(): Promise<void> {
    await browser.wait(EC.presenceOf(this.title), BROWSER_WAIT_TIMEOUT, 'timeout waiting for dialog title');
    await browser.wait(EC.presenceOf(browser.element(by.css('.cdk-overlay-backdrop'))), BROWSER_WAIT_TIMEOUT, 'timeout waiting for overlay backdrop');
  }

  async waitForDialogToClose(): Promise<void> {
    await browser.wait(EC.stalenessOf(this.title), BROWSER_WAIT_TIMEOUT);
  }

  async waitForDropDownToOpen(): Promise<void> {
    await browser.wait(EC.presenceOf(this.locationPersonalFiles), BROWSER_WAIT_TIMEOUT);
  }

  async waitForDropDownToClose(): Promise<void> {
    await browser.wait(EC.stalenessOf(browser.$(ContentNodeSelectorDialog.selectors.locationOption)), BROWSER_WAIT_TIMEOUT);
  }

  async waitForRowToBeSelected(): Promise<void> {
    await browser.wait(EC.presenceOf(this.component.element(by.css(ContentNodeSelectorDialog.selectors.selectedRow))), BROWSER_WAIT_TIMEOUT);
  }

  async isDialogOpen(): Promise<boolean> {
    return browser.$(ContentNodeSelectorDialog.selectors.root).isDisplayed();
  }

  async getTitle(): Promise<string> {
    return this.title.getText();
  }

  async clickCancel(): Promise<void> {
    await this.cancelButton.click();
    await this.waitForDialogToClose();
  }

  async clickCopy(): Promise<void> {
    await this.copyButton.click();
  }

  async clickMove(): Promise<void> {
    await this.moveButton.click();
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
    return (await this.copyButton.isPresent()) && (await this.copyButton.isEnabled());
  }

  async isCancelButtonEnabled(): Promise<boolean> {
    return (await this.cancelButton.isPresent()) && (await this.cancelButton.isEnabled());
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
