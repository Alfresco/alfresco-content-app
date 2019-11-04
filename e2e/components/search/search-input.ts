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

import { ElementFinder, browser, by, until, protractor, ExpectedConditions as EC } from 'protractor';
import { BROWSER_WAIT_TIMEOUT } from '../../configs';
import { Component } from '../component';
import { Utils } from '../../utilities/utils';

export class SearchInput extends Component {
  private static selectors = {
    root: 'aca-search-input',
    searchContainer: '.app-search-container',
    searchButton: '.app-search-button',
    searchControl: '.app-search-control',
    searchInput: 'app-control-input',
    searchOptionsArea: 'search-options',
    optionCheckbox: '.mat-checkbox',
    clearButton: '.app-clear-icon'
  };

  searchButton: ElementFinder = this.component.element(by.css(SearchInput.selectors.searchButton));
  searchContainer: ElementFinder = browser.element(by.css(SearchInput.selectors.searchContainer));
  searchControl: ElementFinder = browser.element(by.css(SearchInput.selectors.searchControl));
  searchBar: ElementFinder = browser.element(by.id(SearchInput.selectors.searchInput));
  searchOptionsArea: ElementFinder = browser.element(by.id(SearchInput.selectors.searchOptionsArea));
  searchFilesOption: ElementFinder = this.searchOptionsArea.element(by.cssContainingText(SearchInput.selectors.optionCheckbox, 'Files'));
  searchFoldersOption: ElementFinder = this.searchOptionsArea.element(by.cssContainingText(SearchInput.selectors.optionCheckbox, 'Folders'));
  searchLibrariesOption: ElementFinder = this.searchOptionsArea.element(by.cssContainingText(SearchInput.selectors.optionCheckbox, 'Libraries'));
  clearSearchButton: ElementFinder = this.searchContainer.$(SearchInput.selectors.clearButton);

  constructor(ancestor?: ElementFinder) {
    super(SearchInput.selectors.root, ancestor);
  }

  async waitForSearchControl() {
    await browser.wait(EC.presenceOf(this.searchControl), BROWSER_WAIT_TIMEOUT, '--- timeout waitForSearchControl ---');
  }

  async isSearchContainerDisplayed() {
    return (await this.searchContainer.isDisplayed()) && (await this.searchButton.isDisplayed());
  }

  async clickSearchButton() {
    await Utils.waitUntilElementClickable(this.searchButton);
    await this.searchButton.click();
    await this.waitForSearchControl();
  }

  async isOptionsAreaDisplayed() {
    await browser.wait(until.elementLocated(by.css(SearchInput.selectors.searchControl)), BROWSER_WAIT_TIMEOUT);
    return browser.isElementPresent(this.searchOptionsArea);
  }

  async clickFilesOption() {
    await browser.wait(EC.elementToBeClickable(this.searchFilesOption), BROWSER_WAIT_TIMEOUT, '--- timeout waiting for Files to be clickable');
    await this.searchFilesOption.click();
  }

  async clickFoldersOption() {
    await browser.wait(EC.elementToBeClickable(this.searchFoldersOption), BROWSER_WAIT_TIMEOUT, '--- timeout waiting for Folders to be clickable');
    await this.searchFoldersOption.click();
  }

  async clickLibrariesOption() {
    await browser.wait(EC.elementToBeClickable(this.searchLibrariesOption), BROWSER_WAIT_TIMEOUT, '--- timeout waiting for Libraries to be clickable');
    await this.searchLibrariesOption.click();
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

  async isClearSearchButtonPresent() {
    return browser.isElementPresent(this.clearSearchButton);
  }

  async clickClearSearchButton() {
    if (await this.isClearSearchButtonPresent()) {
      await this.clearSearchButton.click();
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

  async searchFor(text: string) {
    await browser.wait(EC.elementToBeClickable(this.searchBar), BROWSER_WAIT_TIMEOUT, '---- timeout waiting for searchBar to be clickable');
    await this.searchBar.clear();
    await this.searchBar.sendKeys(text);
    await this.searchBar.sendKeys(protractor.Key.ENTER);
  }
}
