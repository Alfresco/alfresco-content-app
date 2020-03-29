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
import * as tslib_1 from "tslib";
import { by, browser, ExpectedConditions as EC, until } from 'protractor';
import { Component } from '../component';
import { BROWSER_WAIT_TIMEOUT } from '../../configs';
var CommentsTab = /** @class */ (function (_super) {
    tslib_1.__extends(CommentsTab, _super);
    function CommentsTab(ancestor) {
        var _this = _super.call(this, CommentsTab.selectors.root, ancestor) || this;
        _this.commentsContainer = _this.component.element(by.css(CommentsTab.selectors.commentsContainer));
        _this.commentsHeader = _this.component.element(by.css(CommentsTab.selectors.commentsHeader));
        _this.commentTextarea = _this.component.element(by.css(CommentsTab.selectors.commentsTextArea));
        _this.addCommentButton = _this.component.element(by.css(CommentsTab.selectors.addCommentButton));
        _this.commentsList = _this.component.all(by.css(CommentsTab.selectors.commentsListItem));
        _this.commentListItem = by.css(CommentsTab.selectors.commentsListItem);
        _this.commentUserAvatar = by.id(CommentsTab.selectors.commentUserAvatar);
        _this.commentUser = by.id(CommentsTab.selectors.commentUserName);
        _this.commentText = by.id(CommentsTab.selectors.commentMessage);
        _this.commentTime = by.id(CommentsTab.selectors.commentTime);
        return _this;
    }
    CommentsTab.prototype.waitForCommentsContainer = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser.wait(EC.visibilityOf(this.commentsContainer), BROWSER_WAIT_TIMEOUT)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    CommentsTab.prototype.getCommentsTabHeaderText = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.commentsHeader.getText()];
            });
        });
    };
    CommentsTab.prototype.isCommentTextAreaDisplayed = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, browser.isElementPresent(this.commentTextarea)];
            });
        });
    };
    CommentsTab.prototype.isAddCommentButtonEnabled = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var present;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser.isElementPresent(this.addCommentButton)];
                    case 1:
                        present = _a.sent();
                        if (present) {
                            return [2 /*return*/, this.addCommentButton.isEnabled()];
                        }
                        return [2 /*return*/, false];
                }
            });
        });
    };
    CommentsTab.prototype.getCommentListItem = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, browser.wait(until.elementLocated(this.commentListItem), BROWSER_WAIT_TIMEOUT / 2)];
            });
        });
    };
    CommentsTab.prototype.getCommentById = function (commentId) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                if (commentId) {
                    return [2 /*return*/, browser.wait(until.elementLocated(by.id("" + CommentsTab.selectors.commentById + commentId)), BROWSER_WAIT_TIMEOUT / 2)];
                }
                return [2 /*return*/, this.getCommentListItem()];
            });
        });
    };
    CommentsTab.prototype.isCommentDisplayed = function (commentId) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _b = (_a = browser).isElementPresent;
                        return [4 /*yield*/, this.getCommentById(commentId)];
                    case 1: return [2 /*return*/, _b.apply(_a, [_c.sent()])];
                }
            });
        });
    };
    CommentsTab.prototype.isCommentUserAvatarDisplayed = function (commentId) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var commentElement;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getCommentById(commentId)];
                    case 1:
                        commentElement = _a.sent();
                        return [2 /*return*/, browser.isElementPresent(commentElement.findElement(this.commentUserAvatar))];
                }
            });
        });
    };
    CommentsTab.prototype.getCommentText = function (commentId) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var commentElement, message;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getCommentById(commentId)];
                    case 1:
                        commentElement = _a.sent();
                        return [4 /*yield*/, commentElement.findElement(this.commentText)];
                    case 2:
                        message = _a.sent();
                        return [2 /*return*/, message.getText()];
                }
            });
        });
    };
    CommentsTab.prototype.getCommentUserName = function (commentId) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var commentElement, user;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getCommentById(commentId)];
                    case 1:
                        commentElement = _a.sent();
                        return [4 /*yield*/, commentElement.findElement(this.commentUser)];
                    case 2:
                        user = _a.sent();
                        return [2 /*return*/, user.getText()];
                }
            });
        });
    };
    CommentsTab.prototype.getCommentTime = function (commentId) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var commentElement, time;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getCommentById(commentId)];
                    case 1:
                        commentElement = _a.sent();
                        return [4 /*yield*/, commentElement.findElement(this.commentTime)];
                    case 2:
                        time = _a.sent();
                        return [2 /*return*/, time.getText()];
                }
            });
        });
    };
    CommentsTab.prototype.getNthCommentId = function (index) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.commentsList.get(index - 1).getAttribute('id')];
            });
        });
    };
    CommentsTab.prototype.typeComment = function (text) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.commentTextarea.sendKeys(text)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    CommentsTab.prototype.clickAddButton = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.addCommentButton.click()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    CommentsTab.prototype.getCommentTextFromTextArea = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.commentTextarea.getAttribute('value')];
            });
        });
    };
    CommentsTab.selectors = {
        root: 'adf-comments',
        commentsContainer: '.adf-comments-container',
        commentsHeader: '.adf-comments-header',
        commentsTextArea: '.adf-comments-input-container textarea',
        addCommentButton: 'button.adf-comments-input-add',
        commentsList: '.adf-comment-list',
        commentsListItem: '.adf-comment-list-item',
        commentById: "adf-comment-",
        commentUserName: 'comment-user',
        commentUserAvatar: 'comment-user-icon',
        commentMessage: 'comment-message',
        commentTime: 'comment-time'
    };
    return CommentsTab;
}(Component));
export { CommentsTab };
//# sourceMappingURL=info-drawer-comments-tab.js.map