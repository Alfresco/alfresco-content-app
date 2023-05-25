/*!
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { browser, by } from 'protractor';
import { Component } from '../component';
import { waitElement, waitForPresence } from '../../utilities/utils';
import { BrowserActions, BrowserVisibility, TestElement } from '@alfresco/adf-testing';

export class SearchInput extends Component {
  get searchButton() {
    return browser.element(by.css('aca-search-input .app-search-button'));
  }

  searchContainer = browser.element(by.css('.app-search-container'));
  searchControl = browser.element(by.css('.app-search-control'));

  searchInput = TestElement.byCss('input[id="app-control-input"]');
  searchResult = TestElement.byCss('.search-file-name');

  searchOptionsArea = browser.element(by.id('search-options'));
  searchFilesOption = this.searchOptionsArea.element(by.cssContainingText('.mat-checkbox', 'Files'));
  searchFoldersOption = this.searchOptionsArea.element(by.cssContainingText('.mat-checkbox', 'Folders'));
  searchLibrariesOption = this.searchOptionsArea.element(by.cssContainingText('.mat-checkbox', 'Libraries'));
  constructor(ancestor?: string) {
    super('aca-search-input', ancestor);
  }

  async waitForSearchControl() {
    await waitForPresence(this.searchControl);
  }

  async isSearchContainerDisplayed() {
    const isContainerDisplayed = await this.searchContainer.isDisplayed();
    const isSearchButtonDisplayed = await this.searchButton.isDisplayed();

    return isContainerDisplayed && isSearchButtonDisplayed;
  }

  async clickSearchButton() {
    await BrowserActions.click(this.searchButton);

    await this.waitForSearchControl();
  }

  async isOptionsAreaDisplayed() {
    await waitElement('.app-search-control');
    return browser.isElementPresent(this.searchOptionsArea);
  }

  async clickFilesOption() {
    await BrowserActions.click(this.searchFilesOption);
  }

  async clickFoldersOption() {
    await BrowserActions.click(this.searchFoldersOption);
  }

  async clickLibrariesOption() {
    await BrowserActions.click(this.searchLibrariesOption);
  }

  async isFilesOptionEnabled() {
    const optClass = await this.searchFilesOption.getAttribute('class');
    return !optClass.includes('mat-checkbox-disabled');
  }

  async isFoldersOptionEnabled() {
    const optClass = await this.searchFoldersOption.getAttribute('class');
    return !optClass.includes('mat-checkbox-disabled');
  }

  async isLibrariesOptionEnabled() {
    const optClass = await this.searchLibrariesOption.getAttribute('class');
    return !optClass.includes('mat-checkbox-disabled');
  }

  async isFilesOptionChecked() {
    const optClass = await this.searchFilesOption.getAttribute('class');
    return optClass.includes('mat-checkbox-checked');
  }

  async isFoldersOptionChecked() {
    const optClass = await this.searchFoldersOption.getAttribute('class');
    return optClass.includes('mat-checkbox-checked');
  }

  async isLibrariesOptionChecked() {
    const optClass = await this.searchLibrariesOption.getAttribute('class');
    return optClass.includes('mat-checkbox-checked');
  }

  async clearOptions() {
    if (await this.isFilesOptionChecked()) {
      await this.clickFilesOption();
    }
    if (await this.isFoldersOptionChecked()) {
      await this.clickFoldersOption();
    }
    if (await this.isLibrariesOptionChecked()) {
      await this.clickLibrariesOption();
    }
  }
  async checkOnlyFiles() {
    await this.clearOptions();
    await this.clickFilesOption();
  }

  async checkOnlyFolders() {
    await this.clearOptions();
    await this.clickFoldersOption();
  }

  async checkFilesAndFolders() {
    await this.clearOptions();
    await this.clickFilesOption();
    await this.clickFoldersOption();
  }

  async checkLibraries() {
    await this.clearOptions();
    await this.clickLibrariesOption();
  }

  async searchForLibrary(text: string) {
    await BrowserVisibility.waitUntilElementIsClickable(this.searchInput.elementFinder);
    await this.searchInput.typeText(text);
  }

  async searchFor(text: string) {
    await BrowserVisibility.waitUntilElementIsClickable(this.searchInput.elementFinder);
    await this.searchInput.typeText(text);
    await BrowserActions.click(this.searchButton);
  }

  async searchByURL(text: string) {
    const query = Buffer.from(text, 'utf-8').toString();
    await BrowserActions.getUrl(`#/search;q=${query}`);
  }

  async searchUntilResult(text: string, methodType: 'URL' | 'UI', waitPerSearch: number = 2000, timeout: number = 20000) {
    const attempts = Math.round(timeout / waitPerSearch);
    let loopCount = 0;
    return new Promise((resolve, reject) => {
      const check = async () => {
        loopCount++;
        loopCount >= attempts ? reject('File not found') : methodType === 'UI' ? await this.searchFor(text) : await this.searchByURL(text);
        (await this.searchResult.isPresent(waitPerSearch)) ? resolve('File found') : setTimeout(check, waitPerSearch);
      };
      return check();
    });
  }
}
