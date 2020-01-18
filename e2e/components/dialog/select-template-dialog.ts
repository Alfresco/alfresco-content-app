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

import { ElementFinder, by, browser, ExpectedConditions as EC } from 'protractor';
import { BROWSER_WAIT_TIMEOUT } from '../../configs';
import { Component } from '../component';
import { DropDownBreadcrumb } from '../breadcrumb/dropdown-breadcrumb';
import { DataTable } from '../data-table/data-table';

export class SelectTemplateDialog extends Component {
  private static selectors = {
    root: '.aca-template-node-selector-dialog',
    title: '.mat-dialog-title',
    button: '.mat-dialog-actions button'
  };

  title: ElementFinder = this.component.element(by.css(SelectTemplateDialog.selectors.title));
  nextButton: ElementFinder = this.component.element(by.cssContainingText(SelectTemplateDialog.selectors.button, 'Next'));
  cancelButton: ElementFinder = this.component.element(by.cssContainingText(SelectTemplateDialog.selectors.button, 'Cancel'));

  breadcrumb: DropDownBreadcrumb = new DropDownBreadcrumb();
  dataTable: DataTable = new DataTable(SelectTemplateDialog.selectors.root);

  constructor(ancestor?: string) {
    super(SelectTemplateDialog.selectors.root, ancestor);
  }

  async waitForDialogToOpen(): Promise<void> {
    await browser.wait(EC.presenceOf(this.title), BROWSER_WAIT_TIMEOUT, 'timeout waiting for dialog title');
    await browser.wait(EC.presenceOf(browser.element(by.css('.cdk-overlay-backdrop'))), BROWSER_WAIT_TIMEOUT, 'timeout waiting for overlay backdrop');
  }

  async waitForDialogToClose(): Promise<void> {
    await browser.wait(EC.stalenessOf(this.title), BROWSER_WAIT_TIMEOUT, '---- timeout waiting for dialog to close ----');
  }

  async isDialogOpen(): Promise<boolean> {
    return browser.isElementPresent(by.css(SelectTemplateDialog.selectors.root));
  }

  async getTitle(): Promise<string> {
    return this.title.getText();
  }

  // action buttons

  async isCancelButtonEnabled(): Promise<boolean> {
    return this.cancelButton.isEnabled();
  }

  async isNextButtonEnabled(): Promise<boolean> {
    return this.nextButton.isEnabled();
  }

  async clickCancel(): Promise<void> {
    await this.cancelButton.click();
    await this.waitForDialogToClose();
  }

  async clickNext(): Promise<void> {
    await this.nextButton.click();
    await this.waitForDialogToClose();
  }
}
