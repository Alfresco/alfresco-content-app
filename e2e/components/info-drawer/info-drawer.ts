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

import { ElementFinder, ElementArrayFinder, by, browser, ExpectedConditions as EC, $ } from 'protractor';
import { Component } from '../component';
import { BROWSER_WAIT_TIMEOUT } from '../../configs';
import { CommentsTab } from './info-drawer-comments-tab';
import { LibraryMetadata } from './info-drawer-metadata-library';
import { ContentMetadata } from './info-drawer-metadata-content';

export class InfoDrawer extends Component {
  private static selectors = {
    root: 'adf-info-drawer',

    header: '.adf-info-drawer-layout-header',
    content: '.adf-info-drawer-layout-content',

    tabs: '.adf-info-drawer-tabs',
    tabLabel: '.mat-tab-label-content',
    tabActiveLabel: '.mat-tab-label-active',

    activeTabContent: '.mat-tab-body-active .mat-tab-body-content adf-dynamic-tab',
    next: '.mat-tab-header-pagination-after .mat-tab-header-pagination-chevron',
    previous: '.mat-tab-header-pagination-before .mat-tab-header-pagination-chevron',

    headerTitle: '.adf-info-drawer-layout-header-title'
  };

  commentsTab = new CommentsTab($(InfoDrawer.selectors.root));
  aboutTab = new LibraryMetadata($(InfoDrawer.selectors.root));
  propertiesTab = new ContentMetadata($(InfoDrawer.selectors.root));

  header: ElementFinder = this.component.element(by.css(InfoDrawer.selectors.header));
  headerTitle: ElementFinder = this.component.element(by.css(InfoDrawer.selectors.headerTitle));
  tabLabel: ElementFinder = this.component.element(by.css(InfoDrawer.selectors.tabLabel));
  tabLabelsList: ElementArrayFinder = this.component.all(by.css(InfoDrawer.selectors.tabLabel));
  tabActiveLabel: ElementFinder = this.component.element(by.css(InfoDrawer.selectors.tabActiveLabel));

  tabActiveContent: ElementFinder = this.component.element(by.css(InfoDrawer.selectors.activeTabContent));

  nextButton: ElementFinder = this.component.element(by.css(InfoDrawer.selectors.next));
  previousButton: ElementFinder = this.component.element(by.css(InfoDrawer.selectors.previous));


  constructor(ancestor?: ElementFinder) {
    super(InfoDrawer.selectors.root, ancestor);
  }

  async waitForInfoDrawerToOpen() {
    await browser.wait(EC.presenceOf(this.header), BROWSER_WAIT_TIMEOUT);
  }

  async isOpen() {
    return browser.isElementPresent(this.header);
  }

  async isEmpty() {
    return !(await browser.isElementPresent(by.css(InfoDrawer.selectors.tabs)));
  }

  getTabByTitle(title: string) {
    return this.component.element(by.cssContainingText(InfoDrawer.selectors.tabLabel, title));
  }

  async getTabsCount() {
    return this.component.all(by.css(InfoDrawer.selectors.tabLabel)).count();
  }

  async isTabPresent(title: string) {
    return this.getTabByTitle(title).isPresent();
  }

  async isTabDisplayed(title: string): Promise<boolean> {
    if (await browser.isElementPresent(this.getTabByTitle(title))) {
      return this.getTabByTitle(title).isDisplayed();
    }

    return false;
  }

  async getTabTitle(index: number) {
    return this.tabLabelsList.get(index - 1).getAttribute('innerText');
  }

  async getActiveTabTitle() {
    return this.tabActiveLabel.getText();
  }

  async clickTab(title: string) {
    await this.getTabByTitle(title).click();
  }

  async getComponentIdOfTab() {
    return this.tabActiveContent.getAttribute('data-automation-id');
  }

  async getHeaderTitle() {
    return this.headerTitle.getText();
  }

  async isAboutTabDisplayed() {
    return this.isTabDisplayed('About');
  }

  async isPropertiesTabDisplayed() {
    return this.isTabDisplayed('Properties');
  }

  async isPropertiesTabActive() {
    return (await this.getActiveTabTitle()) === 'PROPERTIES';
  }

  async isCommentsTabDisplayed() {
    return this.isTabDisplayed('Comments');
  }

  async clickCommentsTab() {
    try {
      await this.getTabByTitle('Comments').click();
      await this.commentsTab.waitForCommentsContainer();
      await Promise.all([
        browser.wait(EC.visibilityOf(this.commentsTab.component), BROWSER_WAIT_TIMEOUT),
        browser.wait(EC.invisibilityOf(this.propertiesTab.component), BROWSER_WAIT_TIMEOUT)
      ]);
    } catch (error) {
      console.error('--- info-drawer clickCommentsTab catch error: ', error);
    }
  }

}

