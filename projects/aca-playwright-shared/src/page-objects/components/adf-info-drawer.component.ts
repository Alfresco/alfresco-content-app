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
  * from Hyland Software. If not, see <http://www.gnu.org/licenses/>.
  */

import { BaseComponent } from './base.component';
import { Page, expect } from '@playwright/test';

export class AdfInfoDrawerComponent extends BaseComponent {
  private static rootElement = 'adf-info-drawer';

  constructor(page: Page) {
    super(page, AdfInfoDrawerComponent.rootElement);
  }

  public getNameField = (labelText: string) => this.getChild('[data-automation-id="library-name-properties-wrapper"]', { hasText: labelText });
  public getIdField = (labelText: string) => this.getChild('[data-automation-id="library-id-properties-wrapper"]', { hasText: labelText });
  public getVisibilityField = (labelText: string) => this.getChild('[data-automation-id="library-visibility-properties-wrapper"]', { hasText: labelText });
  public getDescriptionField = this.getChild('[data-automation-id="library-description-properties-wrapper"] textarea');
  public infoDrawerTabs = this.getChild('.adf-info-drawer-tab');
  public propertiesTab = this.infoDrawerTabs.nth(0);
  public commentsTab = this.infoDrawerTabs.nth(1);
  public commentInputField = this.getChild('mat-form-field');
  public commentsHeader = this.getChild('#comment-header');
  public addCommentButton = this.getChild('[data-automation-id="comments-input-add"]');
  public commentsList = this.getChild('.adf-comment-list-item');
  public commentUsername = this.getChild('.adf-comment-user-name');
  public commentTextContent = this.getChild('.adf-comment-message');
  public commentTimestamp = this.getChild('.adf-comment-message-time');
  public headerTitle = this.getChild('.adf-info-drawer-layout-header-title div');
  public expandDetailsButton = this.getChild(`button[title='Expand panel']`);
  public expandedDetailsTabs = this.page.locator('.aca-details-container .mat-tab-label-content');
  public expandedDetailsPermissionsTab = this.expandedDetailsTabs.getByText("Permissions");


  async checkCommentsHeaderCount(): Promise<number> {
    const commentsCountTextContent = await this.commentsHeader.textContent();
    const commentsCountString = commentsCountTextContent.match(/\d+/g)[0];
    return parseInt(commentsCountString);
  }

  async verifyCommentsCountFromList(expectedNumber: number): Promise<void> {
    const commentsCountFromList = await this.commentsList.count();
    expect(commentsCountFromList).toEqual(expectedNumber);
  }

  async waitForComments(): Promise<void> {
    await this.commentsList.first().waitFor();
  }

  async addCommentToNode(commentText: string): Promise<void> {
    await this.commentInputField.click();
    await this.page.keyboard.type(commentText);
    await this.addCommentButton.click();
  }

  async getHeaderTitle(): Promise<string> {
    return this.headerTitle.textContent();
  }

  async getTabsCount(): Promise<number> {
    return this.infoDrawerTabs.count();
  }
}
