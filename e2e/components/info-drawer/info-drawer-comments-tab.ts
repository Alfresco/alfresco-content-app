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

import { ElementFinder, ElementArrayFinder, by, browser, ExpectedConditions as EC, until } from 'protractor';
import { Component } from '../component';
import { BROWSER_WAIT_TIMEOUT } from '../../configs';

export class CommentsTab extends Component {
  private static selectors = {
    root: 'adf-comments',

    commentsContainer: '.adf-comments-container',
    commentsHeader: '.adf-comments-header',
    commentsTextArea: '.adf-comments-input-container textarea',
    addCommentButton: 'button.adf-comments-input-add',
    commentsList: '.adf-comment-list',
    commentsListItem: '.adf-comment-list-item',
    commentById: `adf-comment-`,
    commentUserName: 'comment-user',
    commentUserAvatar: 'comment-user-icon',
    commentMessage: 'comment-message',
    commentTime: 'comment-time'
  };

  commentsContainer: ElementFinder = this.component.element(by.css(CommentsTab.selectors.commentsContainer));
  commentsHeader: ElementFinder = this.component.element(by.css(CommentsTab.selectors.commentsHeader));
  commentTextarea: ElementFinder = this.component.element(by.css(CommentsTab.selectors.commentsTextArea));
  addCommentButton: ElementFinder = this.component.element(by.css(CommentsTab.selectors.addCommentButton));
  commentsList: ElementArrayFinder = this.component.all(by.css(CommentsTab.selectors.commentsListItem));

  commentListItem = by.css(CommentsTab.selectors.commentsListItem);

  commentUserAvatar = by.id(CommentsTab.selectors.commentUserAvatar);
  commentUser = by.id(CommentsTab.selectors.commentUserName)
  commentText = by.id(CommentsTab.selectors.commentMessage);
  commentTime = by.id(CommentsTab.selectors.commentTime);


  constructor(ancestor?: ElementFinder) {
    super(CommentsTab.selectors.root, ancestor);
  }

  async waitForCommentsContainer() {
    await browser.wait(EC.visibilityOf(this.commentsContainer), BROWSER_WAIT_TIMEOUT);
  }

  async getCommentsTabHeaderText() {
    return this.commentsHeader.getText();
  }

  async isCommentTextAreaDisplayed() {
    return browser.isElementPresent(this.commentTextarea);
  }

  async isAddCommentButtonEnabled() {
    const present = await browser.isElementPresent(this.addCommentButton);
    if (present) {
      return this.addCommentButton.isEnabled();
    }
    return false;
  }

  async getCommentListItem() {
    return browser.wait(until.elementLocated(this.commentListItem), BROWSER_WAIT_TIMEOUT / 2);
  }

  async getCommentById(commentId?: string) {
    if (commentId) {
      return browser.wait(until.elementLocated(by.id(`${CommentsTab.selectors.commentById}${commentId}`)), BROWSER_WAIT_TIMEOUT / 2);
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

  async getCommentUserName(commentId?: string) {
    const commentElement = await this.getCommentById(commentId);
    const user = await commentElement.findElement(this.commentUser);
    return user.getText();
  }

  async getCommentTime(commentId?: string) {
    const commentElement = await this.getCommentById(commentId);
    const time = await commentElement.findElement(this.commentTime);
    return time.getText();
  }

  async getNthCommentId(index: number) {
    return this.commentsList.get(index - 1).getAttribute('id');
  }

  async typeComment(text: string) {
    await this.commentTextarea.sendKeys(text);
  }

  async clickAddButton() {
    await this.addCommentButton.click();
  }

  async getCommentTextFromTextArea() {
    return this.commentTextarea.getAttribute('value');
  }

}

