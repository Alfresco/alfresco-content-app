/*!
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * Alfresco Example Content Application
 *
 * This file is part of the Alfresco Example Content Application.
 * If the software was purchased under a paid Alfresco license, the terms of
 * the paid license agreement will prevail. Otherwise, the software is
 * provided under the following open source license terms:
 *
 * The Alfresco Example Content Application is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * The Alfresco Example Content Application is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with Alfresco. If not, see <http://www.gnu.org/licenses/>.
 */

import { by, browser } from 'protractor';
import { GenericDialog } from './generic-dialog';
import { waitForStaleness, waitForPresence, click } from '../../utilities';
import { DataTable } from '../data-table/data-table';

export class ContentNodeSelectorDialog extends GenericDialog {
  copyButton = this.childElement(by.cssContainingText('[data-automation-id="content-node-selector-actions-choose"]', 'Copy'));

  locationDropDown = this.rootElem.element(by.id('site-dropdown-container'));
  locationPersonalFiles = browser.element(by.cssContainingText('.mat-mdc-option .mdc-list-item__primary-text', 'Personal Files'));
  locationFileLibraries = browser.element(by.cssContainingText('.mat-mdc-option .mdc-list-item__primary-text', 'My Libraries'));

  searchInput = this.rootElem.element(by.css('#searchInput'));

  dataTable = new DataTable('.adf-content-node-selector-dialog');

  constructor() {
    super('.adf-content-node-selector-dialog');
  }

  get content() {
    return this.rootElem.element(by.css('.adf-content-node-selector-content'));
  }

  async waitForDropDownToClose(): Promise<void> {
    await waitForStaleness(browser.$('.mat-mdc-option .mdc-list-item__primary-text'));
  }

  async selectLocation(location: string): Promise<void> {
    await click(this.locationDropDown);

    if (location === 'Personal Files') {
      await click(this.locationPersonalFiles);
    } else {
      await click(this.locationFileLibraries);
    }

    await this.waitForDropDownToClose();
  }

  async selectDestination(folderName: string): Promise<void> {
    const row = this.dataTable.getRowByName(folderName);
    await click(row);
    await waitForPresence(browser.element(by.css('.adf-is-selected')));
  }
}
