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

import { by, browser } from 'protractor';
import { BrowserActions, BrowserVisibility, Logger, TestElement } from '@alfresco/adf-testing';
import { Component } from '../component';
import { CommentsTab } from './info-drawer-comments-tab';
import { LibraryMetadata } from './info-drawer-metadata-library';
import { ContentMetadata } from './info-drawer-metadata-content';
import { waitForPresence } from '../../utilities/utils';

export class InfoDrawer extends Component {
  commentsTab = new CommentsTab('adf-info-drawer');
  aboutTab = new LibraryMetadata('adf-info-drawer');
  propertiesTab = new ContentMetadata('adf-info-drawer');
  header = this.byCss('.adf-info-drawer-layout-header');
  headerTitle = this.byCss('.adf-info-drawer-layout-header-title');
  tabLabel = this.byCss('.mat-tab-label-content');
  tabLabelsList = this.allByCss('.mat-tab-label-content');
  tabActiveLabel = this.byCss('.mat-tab-label-active');
  tabActiveContent = this.byCss('.mat-tab-body-active .mat-tab-body-content adf-dynamic-tab');
  nextButton = this.byCss('.mat-tab-header-pagination-after .mat-tab-header-pagination-chevron');
  previousButton = this.byCss('.mat-tab-header-pagination-before .mat-tab-header-pagination-chevron');
  expandDetailsButton = TestElement.byCss(`button[title='Expand']`);
  selectedTab = TestElement.byCss(`.mat-tab-list [aria-selected='true'] div`);
  expandedDetailsPermissionsTab = TestElement.byText('.acs-details-container .mat-tab-label-content', 'Permissions');

  constructor(ancestor?: string) {
    super('adf-info-drawer', ancestor);
  }

  async waitForInfoDrawerToOpen() {
    await waitForPresence(this.header);
  }

  async isOpen() {
    return browser.isElementPresent(this.header);
  }

  async isEmpty() {
    return !(await browser.isElementPresent(by.css('.adf-info-drawer-tabs')));
  }

  getTabByTitle(title: string) {
    return this.byCssText('.mat-tab-label-content', title);
  }

  async getTabsCount(): Promise<number> {
    return this.allByCss('.mat-tab-label-content').count();
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

  async getTabTitle(index: number): Promise<string> {
    const attributeValue: string = await browser.executeScript(`return arguments[0].innerText`, this.tabLabelsList.get(index - 1));
    return attributeValue || '';
  }

  async getActiveTabTitle(): Promise<string> {
    return this.tabActiveLabel.getText();
  }

  async clickTab(title: string) {
    await BrowserActions.click(this.getTabByTitle(title));
  }

  async getComponentIdOfTab(): Promise<string> {
    return this.tabActiveContent.getAttribute('data-automation-id');
  }

  async getHeaderTitle(): Promise<string> {
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
      await BrowserActions.click(this.getTabByTitle('Comments'));
      await this.commentsTab.waitForCommentsContainer();
      await Promise.all([
        BrowserVisibility.waitUntilElementIsVisible(this.commentsTab.component),
        BrowserVisibility.waitUntilElementIsNotVisible(this.propertiesTab.component)
      ]);
    } catch (error) {
      Logger.error('--- info-drawer clickCommentsTab catch error: ', error);
    }
  }
}
