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

import { browser } from 'protractor';
import { BrowserActions, BrowserVisibility, Logger, TestElement } from '@alfresco/adf-testing';
import { Component } from '../component';
import { CommentsTab } from './info-drawer-comments-tab';
import { LibraryMetadata } from './info-drawer-metadata-library';
import { waitForPresence } from '../../utilities';
import { Toolbar } from '../toolbar/toolbar';

export class InfoDrawer extends Component {
  commentsTab = new CommentsTab('adf-info-drawer');
  aboutTab = new LibraryMetadata('adf-info-drawer');
  header = this.byCss('.adf-info-drawer-layout-header');
  headerTitle = this.byCss('.adf-info-drawer-layout-header-title > div');
  tabActiveLabel = this.byCss('.mat-tab-label-active');
  expandDetailsButton = TestElement.byCss(`button[title='Expand panel']`);
  selectedTab = TestElement.byCss(`.mat-tab-list [aria-selected='true'] div`);
  expandedDetailsPermissionsTab = TestElement.byText('.aca-details-container .mat-tab-label-content', 'Permissions');
  previewButton = TestElement.byCss(`button[title='Preview File']`);
  toolbar = new Toolbar('adf-info-drawer');

  constructor(ancestor?: string) {
    super('adf-info-drawer', ancestor);
  }

  async waitForInfoDrawerToOpen() {
    await waitForPresence(this.header);
  }

  async isOpen() {
    return browser.isElementPresent(this.header);
  }

  getTabByTitle(title: string) {
    return this.byCssText('.mat-tab-label-content', title);
  }

  async getTabsCount(): Promise<number> {
    return this.allByCss('.mat-tab-label-content').count();
  }

  async isTabDisplayed(title: string): Promise<boolean> {
    if (await browser.isElementPresent(this.getTabByTitle(title))) {
      return this.getTabByTitle(title).isDisplayed();
    }

    return false;
  }

  async getActiveTabTitle(): Promise<string> {
    return this.tabActiveLabel.getText();
  }

  async getHeaderTitle(): Promise<string> {
    return this.headerTitle.getText();
  }

  async isPropertiesTabDisplayed() {
    return this.isTabDisplayed('Properties');
  }

  async isCommentsTabDisplayed() {
    return this.isTabDisplayed('Comments');
  }

  async clickCommentsTab() {
    try {
      await BrowserActions.click(this.getTabByTitle('Comments'));
      await this.commentsTab.waitForCommentsContainer();
      await Promise.all([BrowserVisibility.waitUntilElementIsVisible(this.commentsTab.component)]);
    } catch (error) {
      Logger.error('--- info-drawer clickCommentsTab catch error: ', error);
    }
  }
}
