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
import { Utils } from './../../utilities/utils';

export class CopyMoveDialog extends Component {
  selectors = {
    root: '.adf-content-node-selector-dialog',

    title: '.mat-dialog-title',
    content: '.mat-dialog-content',
    locationDropDownId: 'site-dropdown-container',
    locationOption: '.mat-option .mat-option-text',

    dataTable: '.adf-datatable-body',
    row: '.adf-datatable-row[role]',
    selectedRow: '.adf-is-selected',

    button: '.mat-dialog-actions button'
  };

  title = this.getByCss(this.selectors.title);
  content = this.getByCss(this.selectors.content);
  dataTable = this.getByCss(this.selectors.dataTable);
  locationDropDown = this.getById(this.selectors.locationDropDownId);
  locationPersonalFiles = browser.element(
    by.cssContainingText(this.selectors.locationOption, 'Personal Files')
  );
  locationFileLibraries = browser.element(
    by.cssContainingText(this.selectors.locationOption, 'File Libraries')
  );

  row = this.getByCss(this.selectors.row);

  cancelButton = this.component.element(
    by.cssContainingText(this.selectors.button, 'Cancel')
  );
  copyButton = this.component.element(
    by.cssContainingText(this.selectors.button, 'Copy')
  );
  moveButton = this.component.element(
    by.cssContainingText(this.selectors.button, 'Move')
  );

  constructor(ancestor?: ElementFinder) {
    super('.adf-content-node-selector-dialog', ancestor);
  }

  async waitForDialogToClose() {
    return await this.waitStale(this.title);
  }

  async waitForDropDownToOpen() {
    return await this.wait(this.locationPersonalFiles);
  }

  async waitForDropDownToClose() {
    return await this.waitStale(browser.$(this.selectors.locationOption));
  }

  async waitForRowToBeSelected() {
    return await this.wait(this.getByCss(this.selectors.selectedRow));
  }

  async isDialogOpen() {
    return await browser.$(this.selectors.root).isDisplayed();
  }

  async getTitle() {
    return await this.title.getText();
  }

  async clickCancel() {
    await this.cancelButton.click();
    await this.waitForDialogToClose();
  }

  async clickCopy() {
    await this.copyButton.click();
  }

  async clickMove() {
    await this.moveButton.click();
  }

  getRow(folderName: string) {
    return this.dataTable.element(
      by.cssContainingText('.adf-name-location-cell', folderName)
    );
  }

  async doubleClickOnRow(name: string) {
    const item = this.getRow(name);

    await Utils.waitUntilElementClickable(item);

    await browser
      .actions()
      .mouseMove(item)
      .perform();

    await browser
      .actions()
      .click()
      .click()
      .perform();
  }

  async selectLocation(location: 'Personal Files' | 'File Libraries') {
    await this.locationDropDown.click();
    await this.waitForDropDownToOpen();

    if (location === 'Personal Files') {
      await this.locationPersonalFiles.click();
    } else {
      await this.locationFileLibraries.click();
    }

    await this.waitForDropDownToClose();
  }

  async selectDestination(folderName: string) {
    const row = this.getRow(folderName);

    await Utils.waitUntilElementClickable(row);
    await row.click();
    await this.waitForRowToBeSelected();
  }
}
