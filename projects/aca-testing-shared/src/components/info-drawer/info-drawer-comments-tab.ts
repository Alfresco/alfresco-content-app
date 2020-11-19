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

import { by, browser, until } from 'protractor';
import { Component } from '../component';
import { BROWSER_WAIT_TIMEOUT } from '../../configs';
import { typeText } from '../../utilities/utils';
import { BrowserActions, BrowserVisibility } from '@alfresco/adf-testing';

export class CommentsTab extends Component {
  commentsContainer = this.byCss('.adf-comments-container');
  commentsHeader = this.byCss('.adf-comments-header');
  commentTextarea = this.byCss('.adf-comments-input-container textarea');
  addCommentButton = this.byCss('button.adf-comments-input-add');
  commentListItem = by.css('.adf-comment-list-item');
  commentUserAvatar = by.id('comment-user-icon');
  commentUser = by.id('comment-user');
  commentText = by.id('comment-message');
  commentTime = by.id('comment-time');

  constructor(ancestor?: string) {
    super('adf-comments', ancestor);
  }

  async waitForCommentsContainer() {
    await BrowserVisibility.waitUntilElementIsVisible(this.commentsContainer);
  }

  async getCommentsTabHeaderText(): Promise<string> {
    return this.commentsHeader.getText();
  }

  async isCommentTextAreaDisplayed(): Promise<boolean> {
    return browser.isElementPresent(this.commentTextarea);
  }

  async isAddCommentButtonEnabled(): Promise<boolean> {
    const present = await browser.isElementPresent(this.addCommentButton);
    if (present) {
      return this.addCommentButton.isEnabled();
    }
    return false;
  }

  private async getCommentListItem() {
    return browser.wait(until.elementLocated(this.commentListItem), BROWSER_WAIT_TIMEOUT / 2);
  }

  async getCommentById(commentId?: string) {
    if (commentId) {
      return browser.wait(until.elementLocated(by.id(`adf-comment-${commentId}`)), BROWSER_WAIT_TIMEOUT / 2);
    }
    return this.getCommentListItem();
  }

  async isCommentDisplayed(commentId?: string) {
    return browser.isElementPresent(await this.getCommentById(commentId));
  }

  async isCommentUserAvatarDisplayed(commentId?: string) {
    const commentElement = await this.getCommentById(commentId);
    return browser.isElementPresent(commentElement.findElement(this.commentUserAvatar));
  }

  async getCommentText(commentId?: string) {
    const commentElement = await this.getCommentById(commentId);
    const message = await commentElement.findElement(this.commentText);
    return message.getText();
  }

  async getCommentUserName(commentId?: string): Promise<string> {
    const commentElement = await this.getCommentById(commentId);
    const user = await commentElement.findElement(this.commentUser);
    return user.getText();
  }

  async getCommentTime(commentId?: string): Promise<string> {
    const commentElement = await this.getCommentById(commentId);
    const time = await commentElement.findElement(this.commentTime);
    return time.getText();
  }

  async getNthCommentId(index: number): Promise<string> {
    const list = this.allByCss('.adf-comment-list-item');
    return list.get(index - 1).getAttribute('id');
  }

  async typeComment(text: string): Promise<void> {
    await typeText(this.commentTextarea, text);
  }

  async clickAddButton(): Promise<void> {
    await BrowserActions.click(this.addCommentButton);
  }

  async getCommentTextFromTextArea(): Promise<string> {
    return BrowserActions.getInputValue(this.commentTextarea);
  }
}
