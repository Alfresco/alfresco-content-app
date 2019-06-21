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

import { ElementFinder, by, browser, until } from 'protractor';
import { Component } from '../component';
import { BROWSER_WAIT_TIMEOUT } from '../../configs';

export class CommentsTab extends Component {
  selectors = {
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

  commentsContainer = this.getByCss(this.selectors.commentsContainer);
  commentsHeader = this.getByCss(this.selectors.commentsHeader);
  commentTextarea = this.getByCss(this.selectors.commentsTextArea);
  addCommentButton = this.getByCss(this.selectors.addCommentButton);
  commentsList = this.getAllByCss(this.selectors.commentsListItem);

  commentListItem = by.css(this.selectors.commentsListItem);

  commentUserAvatar = by.id(this.selectors.commentUserAvatar);
  commentUser = by.id(this.selectors.commentUserName);
  commentText = by.id(this.selectors.commentMessage);
  commentTime = by.id(this.selectors.commentTime);

  constructor(ancestor?: ElementFinder) {
    super('adf-comments', ancestor);
  }

  async waitForCommentsContainer() {
    return await this.wait(this.commentsContainer);
  }

  async getCommentsTabHeaderText() {
    return await this.commentsHeader.getText();
  }

  async isCommentTextAreaDisplayed() {
    return await browser.isElementPresent(this.commentTextarea);
  }

  async isAddCommentButtonEnabled() {
    const present = await browser.isElementPresent(this.addCommentButton);
    if (present) {
      return await this.addCommentButton.isEnabled();
    }
    return false;
  }

  async getCommentListItem() {
    return await browser.wait(
      until.elementLocated(this.commentListItem),
      BROWSER_WAIT_TIMEOUT / 2
    );
  }

  async getCommentById(commentId?: string) {
    if (commentId) {
      return await browser.wait(
        until.elementLocated(
          by.id(`${this.selectors.commentById}${commentId}`)
        ),
        BROWSER_WAIT_TIMEOUT / 2
      );
    }
    return await this.getCommentListItem();
  }

  async isCommentDisplayed(commentId?: string) {
    return await browser.isElementPresent(await this.getCommentById(commentId));
  }

  async isCommentUserAvatarDisplayed(commentId?: string) {
    const commentElement = await this.getCommentById(commentId);
    return await browser.isElementPresent(
      commentElement.findElement(this.commentUserAvatar)
    );
  }

  async getCommentText(commentId?: string) {
    const commentElement = await this.getCommentById(commentId);
    const message = await commentElement.findElement(this.commentText);
    return await message.getText();
  }

  async getCommentUserName(commentId?: string) {
    const commentElement = await this.getCommentById(commentId);
    const user = await commentElement.findElement(this.commentUser);
    return await user.getText();
  }

  async getCommentTime(commentId?: string) {
    const commentElement = await this.getCommentById(commentId);
    const time = await commentElement.findElement(this.commentTime);
    return await time.getText();
  }

  async getNthCommentId(index: number) {
    return await this.commentsList.get(index - 1).getAttribute('id');
  }

  async typeComment(text: string) {
    return await this.commentTextarea.sendKeys(text);
  }

  async clickAddButton() {
    return await this.addCommentButton.click();
  }

  async getCommentTextFromTextArea() {
    return await this.commentTextarea.getAttribute('value');
  }
}
