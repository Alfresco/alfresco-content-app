/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2018 Alfresco Software Limited
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

import { ElementFinder, ElementArrayFinder, by, browser, ExpectedConditions as EC } from 'protractor';
import { Component } from '../component';
import { BROWSER_WAIT_TIMEOUT } from '../../configs';
import { Utils } from './../../utilities/utils';

export class InfoDrawer extends Component {
  private static selectors = {
    root: 'aca-info-drawer',

    header: '.adf-info-drawer-layout-header',
    content: '.adf-info-drawer-layout-content',

    tabs: '.adf-info-drawer-tabs',
    tabLabel: '.mat-tab-label-content',
    tabActiveLabel: '.mat-tab-label-active',

    activeTabContent: '.mat-tab-body-active .mat-tab-body-content adf-dynamic-tab',
    next: '.mat-tab-header-pagination-after .mat-tab-header-pagination-chevron',
    previous: '.mat-tab-header-pagination-before .mat-tab-header-pagination-chevron',

    headerTitle: '.adf-info-drawer-layout-header-title',

    // metadata card
    metadataTabContent: '.app-metadata-tab .mat-card-content',
    metadataTabAction: '.app-metadata-tab .mat-card-actions .mat-button',
    field: '.mat-form-field',
    fieldLabelWrapper: '.mat-form-field-label-wrapper',
    fieldInput: '.mat-input-element',
    dropDown: '.mat-select',
    visibilityOption: '.mat-option .mat-option-text',

    hint: '.mat-hint',
    error: '.mat-error'
  };

  header: ElementFinder = this.component.element(by.css(InfoDrawer.selectors.header));
  headerTitle: ElementFinder = this.component.element(by.css(InfoDrawer.selectors.headerTitle));
  tabLabel: ElementFinder = this.component.element(by.css(InfoDrawer.selectors.tabLabel));
  tabLabelsList: ElementArrayFinder = this.component.all(by.css(InfoDrawer.selectors.tabLabel));
  tabActiveLabel: ElementFinder = this.component.element(by.css(InfoDrawer.selectors.tabActiveLabel));

  tabActiveContent: ElementFinder = this.component.element(by.css(InfoDrawer.selectors.activeTabContent));

  nextButton: ElementFinder = this.component.element(by.css(InfoDrawer.selectors.next));
  previousButton: ElementFinder = this.component.element(by.css(InfoDrawer.selectors.previous));

  metadataTabContent: ElementFinder = this.component.element(by.css(InfoDrawer.selectors.metadataTabContent));
  metadataTabAction: ElementFinder = this.component.element(by.css(InfoDrawer.selectors.metadataTabAction));
  fieldLabelWrapper: ElementFinder = this.component.element(by.css(InfoDrawer.selectors.fieldLabelWrapper));
  fieldInput: ElementFinder = this.component.element(by.css(InfoDrawer.selectors.fieldInput));

  visibilityDropDown: ElementFinder = this.component.element(by.css(InfoDrawer.selectors.dropDown));
  visibilityPublic: ElementFinder = browser.element(by.cssContainingText(InfoDrawer.selectors.visibilityOption, 'Public'));
  visibilityPrivate: ElementFinder = browser.element(by.cssContainingText(InfoDrawer.selectors.visibilityOption, 'Private'));
  visibilityModerated: ElementFinder = browser.element(by.cssContainingText(InfoDrawer.selectors.visibilityOption, 'Moderated'));

  hint: ElementFinder = this.component.element(by.css(InfoDrawer.selectors.hint));
  error: ElementFinder = this.component.element(by.css(InfoDrawer.selectors.error));

  constructor(ancestor?: ElementFinder) {
    super(InfoDrawer.selectors.root, ancestor);
  }

  async waitForInfoDrawerToOpen() {
    return await browser.wait(EC.presenceOf(this.header), BROWSER_WAIT_TIMEOUT);
  }

  async isOpen() {
    return await browser.isElementPresent(this.header);
  }

  async isEmpty() {
    if (await browser.isElementPresent(by.css(InfoDrawer.selectors.tabs))) {
      return false;
    }
    return true;
  }

  getTabByTitle(title: string) {
    return this.component.element(by.cssContainingText(InfoDrawer.selectors.tabLabel, title));
  }

  async isTabPresent(title: string) {
    return await this.getTabByTitle(title).isPresent();
  }

  async isTabDisplayed(title: string) {
    return await this.getTabByTitle(title).isDisplayed();
  }

  async getTabTitle(index: number) {
    return await this.tabLabelsList.get(index - 1).getAttribute('innerText');
  }

  async clickTab(title: string) {
    await this.getTabByTitle(title).click();
  }

  async getComponentIdOfTab() {
    return await this.tabActiveContent.getAttribute('data-automation-id');
  }

  async getHeaderTitle() {
    return await this.headerTitle.getText();
  }

  getLabelWrapper(label: string) {
    return this.component.element(by.cssContainingText(InfoDrawer.selectors.fieldLabelWrapper, label));
  }

  getFieldByName(fieldName: string) {
    const wrapper = this.getLabelWrapper(fieldName);
    return wrapper.element(by.xpath('..')).element(by.css(InfoDrawer.selectors.fieldInput));
  }

  async isFieldDisplayed(fieldName: string) {
    return await browser.isElementPresent(this.getFieldByName(fieldName));
  }

  async isInputEnabled(fieldName: string) {
    return this.getFieldByName(fieldName).isEnabled();
  }

  async isVisibilityEnabled() {
    const wrapper = this.getLabelWrapper('Visibility');
    const field = wrapper.element(by.xpath('..')).element(by.css(InfoDrawer.selectors.dropDown));
    return await field.isEnabled();
  }

  async getValueOfField(fieldName: string) {
    return await this.getFieldByName(fieldName).getText();
  }

  async enterTextInInput(fieldName: string, text: string) {
    const input = this.getFieldByName(fieldName);
    await input.clear();
    return await input.sendKeys(text);
  }

  async typeTextInInput(fieldName: string, text: string) {
    const input = this.getFieldByName(fieldName);
    await input.clear();
    return await Utils.typeInField(input, text);
  }

  getButton(button: string) {
    return this.component.element(by.cssContainingText(InfoDrawer.selectors.metadataTabAction, button));
  }

  async isButtonDisplayed(button: string) {
    return browser.isElementPresent(this.getButton(button));
  }

  async isButtonEnabled(button: string) {
    return await this.getButton(button).isEnabled();
  }

  async clickButton(button: string) {
    return await this.getButton(button).click();
  }

  async isButtonDisabled(button: string) {
    try {
      const disabled = await this.getButton(button).getAttribute('disabled');
      return disabled;
    } catch (error) {
      console.log('----- isButtonDisabled catch: ', error);
    }
  }

  async isMessageDisplayed() {
    return await browser.isElementPresent(this.hint);
  }

  async getMessage() {
    return await this.hint.getText();
  }

  async isErrorDisplayed() {
    return await browser.isElementPresent(this.error);
  }

  async getError() {
    return await this.error.getText();
  }


  // ---------------
  async isNameDisplayed() {
    return await this.isFieldDisplayed('Name');
  }

  async isDescriptionDisplayed() {
    return await this.isFieldDisplayed('Description');
  }

  async isVisibilityDisplayed() {
    return await this.isFieldDisplayed('Visibility');
  }

  async isLibraryIdDisplayed() {
    return await this.isFieldDisplayed('Library ID');
  }

  async getName() {
    return await this.getValueOfField('Name');
  }

  async getVisibility() {
    return await this.getValueOfField('Visibility');
  }

  async getLibraryId() {
    return await this.getValueOfField('Library ID');
  }

  async getDescription() {
    return await this.getValueOfField('Description');
  }

  async isNameEnabled() {
    return await this.isInputEnabled('Name');
  }

  async isLibraryIdEnabled() {
    return await this.isInputEnabled('Library ID');
  }

  async isDescriptionEnabled() {
    return await this.isInputEnabled('Description');
  }

  async enterName(name: string) {
    return await this.enterTextInInput('Name', name);
  }

  async typeName(name: string) {
    return await this.typeTextInInput('Name', name);
  }

  async enterDescription(desc: string) {
    return await this.enterTextInInput('Description', desc);
  }

  async typeDescription(desc: string) {
    return await this.typeTextInInput('Description', desc);
  }

  async waitForDropDownToOpen() {
    await browser.wait(EC.presenceOf(this.visibilityDropDown), BROWSER_WAIT_TIMEOUT);
  }

  async waitForDropDownToClose() {
    await browser.wait(EC.stalenessOf(browser.$('.mat-option .mat-option-text')), BROWSER_WAIT_TIMEOUT);
  }

  async setVisibility(visibility: string) {
    const val = visibility.toLowerCase();

    await this.visibilityDropDown.click();
    await this.waitForDropDownToOpen();

    if (val === 'public') {
      await this.visibilityPublic.click();
    } else if (val === 'private') {
      await this.visibilityPrivate.click();
    } else if (val === 'moderated') {
      await this.visibilityModerated.click();
    } else {
      console.log('----- invalid visibility', val);
    }

    await this.waitForDropDownToClose();
  }

}

