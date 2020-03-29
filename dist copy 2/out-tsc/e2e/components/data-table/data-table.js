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
import { by, browser, ExpectedConditions as EC, protractor } from 'protractor';
import { BROWSER_WAIT_TIMEOUT } from '../../configs';
import { Component } from '../component';
import { Menu } from '../menu/menu';
import { Utils } from '../../utilities/utils';
var DataTable = /** @class */ (function (_super) {
    tslib_1.__extends(DataTable, _super);
    function DataTable(ancestor) {
        var _this = _super.call(this, DataTable.selectors.root, ancestor) || this;
        _this.head = _this.component.element(by.css(DataTable.selectors.head));
        _this.body = _this.component.element(by.css(DataTable.selectors.body));
        _this.emptyList = _this.component.element(by.css(DataTable.selectors.emptyListContainer));
        _this.emptyFolderDragAndDrop = _this.component.element(by.css(DataTable.selectors.emptyFolderDragAndDrop));
        _this.emptyListTitle = _this.component.element(by.css(DataTable.selectors.emptyListTitle));
        _this.emptyListSubtitle = _this.component.element(by.css(DataTable.selectors.emptyListSubtitle));
        _this.emptySearchText = _this.component.element(by.css(DataTable.selectors.emptySearchText));
        _this.menu = new Menu();
        return _this;
    }
    // Wait methods (waits for elements)
    DataTable.prototype.waitForHeader = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser.wait(EC.presenceOf(this.head), BROWSER_WAIT_TIMEOUT, '--- timeout waitForHeader ---')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DataTable.prototype.waitForBody = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser.wait(EC.presenceOf(this.body), BROWSER_WAIT_TIMEOUT, '--- timeout waitForBody ---')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DataTable.prototype.waitForEmptyState = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser.wait(EC.presenceOf(this.emptyList), BROWSER_WAIT_TIMEOUT)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // Header/Column methods
    DataTable.prototype.getColumnHeaders = function () {
        var locator = by.css(DataTable.selectors.columnHeader);
        return this.head.all(locator);
    };
    DataTable.prototype.getColumnHeadersText = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var el;
            return tslib_1.__generator(this, function (_a) {
                el = this.getColumnHeaders();
                return [2 /*return*/, el.getText()];
            });
        });
    };
    DataTable.prototype.getNthColumnHeader = function (nth) {
        return this.getColumnHeaders().get(nth - 1);
    };
    DataTable.prototype.getColumnHeaderByLabel = function (label) {
        var locator = by.cssContainingText(DataTable.selectors.columnHeader, label);
        return this.head.element(locator);
    };
    DataTable.prototype.getSortedColumnHeader = function () {
        var locator = by.css(DataTable.selectors.sortedColumnHeader);
        return this.head.element(locator);
    };
    DataTable.prototype.getSortedColumnHeaderText = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.getSortedColumnHeader().getText()];
            });
        });
    };
    DataTable.prototype.getSortingOrder = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var str;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getSortedColumnHeader().element(by.xpath('..')).getAttribute('class')];
                    case 1:
                        str = _a.sent();
                        if (str.includes('asc')) {
                            return [2 /*return*/, 'asc'];
                        }
                        if (str.includes('desc')) {
                            return [2 /*return*/, 'desc'];
                        }
                        return [2 /*return*/, 'none'];
                }
            });
        });
    };
    DataTable.prototype.sortByColumn = function (columnName) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var column, click;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        column = this.getColumnHeaderByLabel(columnName);
                        click = browser.actions().mouseMove(column).click();
                        return [4 /*yield*/, click.perform()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // Rows methods
    DataTable.prototype.getRows = function () {
        return this.body.all(by.css(DataTable.selectors.row));
    };
    DataTable.prototype.getRowsCount = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.getRows().count()];
            });
        });
    };
    DataTable.prototype.waitForRowToBeSelected = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser.wait(EC.presenceOf(this.component.element(by.css(DataTable.selectors.selectedRow))), BROWSER_WAIT_TIMEOUT, 'timeout waiting for row to be selected')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DataTable.prototype.getSelectedRows = function () {
        return this.body.all(by.css(DataTable.selectors.selectedRow));
    };
    DataTable.prototype.getSelectedRowsNames = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var rowsText;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getSelectedRows().map(function (row) {
                            return row.element(by.css('.adf-datatable-cell[title="Name"]')).getText();
                        })];
                    case 1:
                        rowsText = _a.sent();
                        return [2 /*return*/, rowsText];
                }
            });
        });
    };
    DataTable.prototype.getSelectedRowsCount = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.getSelectedRows().count()];
            });
        });
    };
    DataTable.prototype.getNthRow = function (nth) {
        return this.getRows().get(nth - 1);
    };
    DataTable.prototype.getRowByName = function (name, location) {
        var _this = this;
        if (location === void 0) { location = ''; }
        if (location) {
            return this.body.all(by.cssContainingText(DataTable.selectors.row, name))
                .filter(function (elem) { return tslib_1.__awaiter(_this, void 0, void 0, function () { return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser.isElementPresent(elem.element(by.cssContainingText(DataTable.selectors.cell, location)))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            }); }); })
                .first();
        }
        return this.body.element(by.cssContainingText(DataTable.selectors.row, name));
    };
    DataTable.prototype.getRowCells = function (name, location) {
        if (location === void 0) { location = ''; }
        return this.getRowByName(name, location).all(by.css(DataTable.selectors.cell));
    };
    DataTable.prototype.getRowCellsCount = function (itemName) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.getRowCells(itemName).count()];
            });
        });
    };
    DataTable.prototype.getRowFirstCell = function (name, location) {
        if (location === void 0) { location = ''; }
        return this.getRowCells(name, location).get(0);
    };
    DataTable.prototype.getRowNameCell = function (name, location) {
        if (location === void 0) { location = ''; }
        return this.getRowCells(name, location).get(1);
    };
    DataTable.prototype.getRowNameCellSpan = function (name, location) {
        if (location === void 0) { location = ''; }
        return this.getRowNameCell(name, location).$('span');
    };
    DataTable.prototype.getItemNameTooltip = function (name, location) {
        if (location === void 0) { location = ''; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.getRowNameCellSpan(name, location).getAttribute('title')];
            });
        });
    };
    DataTable.prototype.hasCheckMarkIcon = function (itemName, location) {
        if (location === void 0) { location = ''; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var row;
            return tslib_1.__generator(this, function (_a) {
                row = this.getRowByName(itemName, location);
                return [2 /*return*/, row.element(by.css(DataTable.selectors.selectedIcon)).isPresent()];
            });
        });
    };
    DataTable.prototype.hasLockIcon = function (itemName, location) {
        if (location === void 0) { location = ''; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var row;
            return tslib_1.__generator(this, function (_a) {
                row = this.getRowByName(itemName, location);
                return [2 /*return*/, row.element(by.css(DataTable.selectors.lockIcon)).isPresent()];
            });
        });
    };
    DataTable.prototype.hasLockOwnerInfo = function (itemName, location) {
        if (location === void 0) { location = ''; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var row;
            return tslib_1.__generator(this, function (_a) {
                row = this.getRowByName(itemName, location);
                return [2 /*return*/, row.element(by.css(DataTable.selectors.lockOwner)).isPresent()];
            });
        });
    };
    DataTable.prototype.getLockOwner = function (itemName, location) {
        if (location === void 0) { location = ''; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var row;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.hasLockOwnerInfo(itemName, location)];
                    case 1:
                        if (_a.sent()) {
                            row = this.getRowByName(itemName, location);
                            return [2 /*return*/, row.$(DataTable.selectors.lockOwner).$('.locked_by--name').getText()];
                        }
                        return [2 /*return*/, ''];
                }
            });
        });
    };
    DataTable.prototype.getNameLink = function (itemName) {
        return this.getRowNameCell(itemName).$(DataTable.selectors.nameLink);
    };
    DataTable.prototype.hasLinkOnName = function (itemName) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.getNameLink(itemName).isPresent()];
            });
        });
    };
    // Navigation/selection methods
    DataTable.prototype.doubleClickOnRowByName = function (name, location) {
        if (location === void 0) { location = ''; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var item, error_1;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        item = this.getRowFirstCell(name, location);
                        return [4 /*yield*/, Utils.waitUntilElementClickable(item)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, browser.actions().mouseMove(item).perform()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, browser.actions().doubleClick().perform()];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        error_1 = _a.sent();
                        console.log('--- catch: doubleClickOnRowByName', error_1);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    DataTable.prototype.selectItem = function (name, location) {
        if (location === void 0) { location = ''; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var isSelected, item, e_1;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.hasCheckMarkIcon(name, location)];
                    case 1:
                        isSelected = _a.sent();
                        if (!!isSelected) return [3 /*break*/, 5];
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        item = this.getRowFirstCell(name, location);
                        return [4 /*yield*/, item.click()];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        e_1 = _a.sent();
                        console.log('--- select item catch : ', e_1);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    DataTable.prototype.unselectItem = function (name, location) {
        if (location === void 0) { location = ''; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var isSelected, item, e_2;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.hasCheckMarkIcon(name, location)];
                    case 1:
                        isSelected = _a.sent();
                        if (!isSelected) return [3 /*break*/, 5];
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        item = this.getRowFirstCell(name, location);
                        return [4 /*yield*/, item.click()];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        e_2 = _a.sent();
                        console.log('--- unselect item catch : ', e_2);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    DataTable.prototype.clickItem = function (name, location) {
        if (location === void 0) { location = ''; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var item;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        item = this.getRowFirstCell(name, location);
                        return [4 /*yield*/, item.click()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DataTable.prototype.clickNameLink = function (itemName) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getNameLink(itemName).click()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DataTable.prototype.selectMultipleItems = function (names, location) {
        if (location === void 0) { location = ''; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _i, names_1, name_1;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.clearSelection()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, Utils.pressCmd()];
                    case 2:
                        _a.sent();
                        _i = 0, names_1 = names;
                        _a.label = 3;
                    case 3:
                        if (!(_i < names_1.length)) return [3 /*break*/, 6];
                        name_1 = names_1[_i];
                        return [4 /*yield*/, this.selectItem(name_1, location)];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5:
                        _i++;
                        return [3 /*break*/, 3];
                    case 6: return [4 /*yield*/, Utils.releaseKeyPressed()];
                    case 7:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DataTable.prototype.clearSelection = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var count, error_2;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        return [4 /*yield*/, this.getSelectedRowsCount()];
                    case 1:
                        count = _a.sent();
                        if (!(count !== 0)) return [3 /*break*/, 4];
                        return [4 /*yield*/, browser.refresh()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.wait()];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        error_2 = _a.sent();
                        console.log('------ clearSelection catch : ', error_2);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    DataTable.prototype.rightClickOnItem = function (itemName) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var item;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        item = this.getRowFirstCell(itemName);
                        return [4 /*yield*/, browser.actions().mouseMove(item).perform()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, browser.actions().click(protractor.Button.RIGHT).perform()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DataTable.prototype.rightClickOnMultipleSelection = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var itemFromSelection;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        itemFromSelection = this.getSelectedRows().get(0);
                        return [4 /*yield*/, browser.actions().mouseMove(itemFromSelection).perform()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, browser.actions().click(protractor.Button.RIGHT).perform()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DataTable.prototype.getItemLocationEl = function (name) {
        return this.getRowByName(name).element(by.css(DataTable.selectors.locationLink));
    };
    DataTable.prototype.getItemLocation = function (name) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.getItemLocationEl(name).getText()];
            });
        });
    };
    DataTable.prototype.getItemLocationTooltip = function (name) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var location, condition;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        location = this.getItemLocationEl(name).$('a');
                        condition = function () { return location.getAttribute('title').then(function (value) { return value && value.length > 0; }); };
                        return [4 /*yield*/, browser.actions().mouseMove(location).perform()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, browser.wait(condition, BROWSER_WAIT_TIMEOUT)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, location.getAttribute('title')];
                }
            });
        });
    };
    DataTable.prototype.clickItemLocation = function (name) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getItemLocationEl(name).click()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // empty state methods
    DataTable.prototype.isEmpty = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.emptyList.isPresent()];
            });
        });
    };
    DataTable.prototype.isEmptyWithDragAndDrop = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.emptyFolderDragAndDrop.isDisplayed()];
            });
        });
    };
    DataTable.prototype.getEmptyDragAndDropText = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var isEmpty;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.isEmptyWithDragAndDrop()];
                    case 1:
                        isEmpty = _a.sent();
                        if (isEmpty) {
                            return [2 /*return*/, this.emptyFolderDragAndDrop.getText()];
                        }
                        return [2 /*return*/, ''];
                }
            });
        });
    };
    DataTable.prototype.getEmptyStateTitle = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var isEmpty;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.isEmpty()];
                    case 1:
                        isEmpty = _a.sent();
                        if (isEmpty) {
                            return [2 /*return*/, this.emptyListTitle.getText()];
                        }
                        return [2 /*return*/, ''];
                }
            });
        });
    };
    DataTable.prototype.getEmptyStateSubtitle = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var isEmpty;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.isEmpty()];
                    case 1:
                        isEmpty = _a.sent();
                        if (isEmpty) {
                            return [2 /*return*/, this.emptyListSubtitle.getText()];
                        }
                        return [2 /*return*/, ''];
                }
            });
        });
    };
    DataTable.prototype.getEmptyListText = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var isEmpty;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.isEmpty()];
                    case 1:
                        isEmpty = _a.sent();
                        if (isEmpty) {
                            return [2 /*return*/, this.component.element(by.css('adf-custom-empty-content-template')).getText()];
                        }
                        return [2 /*return*/, ''];
                }
            });
        });
    };
    DataTable.prototype.getEmptySearchResultsText = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.emptySearchText.getText()];
            });
        });
    };
    DataTable.prototype.getCellsContainingName = function (name) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var rows, cellsText;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        rows = this.getRows().all(by.cssContainingText(DataTable.selectors.cell, name));
                        return [4 /*yield*/, rows.map(function (cell) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                                return tslib_1.__generator(this, function (_a) {
                                    return [2 /*return*/, cell.getText()];
                                });
                            }); })];
                    case 1:
                        cellsText = _a.sent();
                        return [2 /*return*/, cellsText];
                }
            });
        });
    };
    DataTable.prototype.hasContextMenu = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var count;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.menu.getItemsCount()];
                    case 1:
                        count = _a.sent();
                        return [2 /*return*/, count > 0];
                }
            });
        });
    };
    DataTable.prototype.getLibraryRole = function (name) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.getRowByName(name).element(by.css(DataTable.selectors.libraryRole)).getText()];
            });
        });
    };
    DataTable.prototype.isItemPresent = function (name, location) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.getRowByName(name, location).isPresent()];
            });
        });
    };
    DataTable.prototype.getEntireDataTableText = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var text;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getRows().map(function (row) {
                            return row.all(by.css(DataTable.selectors.cell)).map(function (cell) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                                return tslib_1.__generator(this, function (_a) {
                                    return [2 /*return*/, cell.getText()];
                                });
                            }); });
                        })];
                    case 1:
                        text = _a.sent();
                        return [2 /*return*/, text];
                }
            });
        });
    };
    DataTable.prototype.getSitesNameAndVisibility = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var data;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getEntireDataTableText()];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, data.reduce(function (acc, cell) {
                                acc[cell[1]] = cell[3].toUpperCase();
                                return acc;
                            }, {})];
                }
            });
        });
    };
    DataTable.prototype.getSitesNameAndRole = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var data;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getEntireDataTableText()];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, data.reduce(function (acc, cell) {
                                acc[cell[1]] = cell[2];
                                return acc;
                            }, {})];
                }
            });
        });
    };
    DataTable.prototype.getSearchResultsRows = function () {
        return this.body.all(by.css(DataTable.selectors.searchResultsRow));
    };
    DataTable.prototype.getNthSearchResultsRow = function (nth) {
        return this.getSearchResultsRows().get(nth - 1);
    };
    DataTable.prototype.getSearchResultsRowByName = function (name, location) {
        var _this = this;
        if (location === void 0) { location = ''; }
        if (location) {
            return this.body.all(by.cssContainingText(DataTable.selectors.searchResultsRow, name))
                .filter(function (elem) { return tslib_1.__awaiter(_this, void 0, void 0, function () { return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser.isElementPresent(elem.element(by.cssContainingText(DataTable.selectors.searchResultsRowLine, location)))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            }); }); })
                .first();
        }
        return this.body.element(by.cssContainingText(DataTable.selectors.searchResultsRow, name));
    };
    DataTable.prototype.getSearchResultRowLines = function (name, location) {
        if (location === void 0) { location = ''; }
        return this.getSearchResultsRowByName(name, location).all(by.css(DataTable.selectors.searchResultsRowLine));
    };
    DataTable.prototype.getSearchResultLinesCount = function (name, location) {
        if (location === void 0) { location = ''; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.getSearchResultRowLines(name, location).count()];
            });
        });
    };
    DataTable.prototype.getSearchResultNthLine = function (name, location, index) {
        if (location === void 0) { location = ''; }
        return this.getSearchResultRowLines(name, location).get(index);
    };
    DataTable.prototype.getSearchResultNameAndTitle = function (name, location) {
        if (location === void 0) { location = ''; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.getSearchResultNthLine(name, location, 0).getText()];
            });
        });
    };
    DataTable.prototype.getSearchResultDescription = function (name, location) {
        if (location === void 0) { location = ''; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.getSearchResultNthLine(name, location, 1).getText()];
            });
        });
    };
    DataTable.prototype.getSearchResultModified = function (name, location) {
        if (location === void 0) { location = ''; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.getSearchResultNthLine(name, location, 2).getText()];
            });
        });
    };
    DataTable.prototype.getSearchResultLocation = function (name, location) {
        if (location === void 0) { location = ''; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.getSearchResultNthLine(name, location, 3).getText()];
            });
        });
    };
    DataTable.prototype.getSearchResultNameLink = function (itemName, location) {
        if (location === void 0) { location = ''; }
        return this.getSearchResultsRowByName(itemName, location).$(DataTable.selectors.searchResultsNameLink);
    };
    DataTable.prototype.hasLinkOnSearchResultName = function (itemName, location) {
        if (location === void 0) { location = ''; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.getSearchResultNameLink(itemName, location).isPresent()];
            });
        });
    };
    DataTable.prototype.clickSearchResultNameLink = function (itemName, location) {
        if (location === void 0) { location = ''; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getSearchResultNameLink(itemName, location).click()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DataTable.selectors = {
        root: 'adf-datatable',
        head: '.adf-datatable-header',
        columnHeader: '.adf-datatable-row .adf-datatable-cell-header .adf-datatable-cell-value',
        sortedColumnHeader: "\n      .adf-datatable__header--sorted-asc .adf-datatable-cell-value,\n      .adf-datatable__header--sorted-desc .adf-datatable-cell-value\n    ",
        body: '.adf-datatable-body',
        row: '.adf-datatable-row[role]',
        selectedRow: '.adf-datatable-row.adf-is-selected',
        cell: '.adf-datatable-cell-container',
        locationLink: '.aca-location-link',
        nameLink: '.adf-datatable-link',
        libraryRole: 'adf-library-role-column',
        selectedIcon: '.mat-icon[class*="selected"]',
        lockIcon: 'img[src*="lock"]',
        lockOwner: '.aca-locked-by',
        emptyListContainer: 'div.adf-no-content-container',
        emptyFolderDragAndDrop: '.adf-empty-list_template .adf-empty-folder',
        emptyListTitle: '.adf-empty-content__title',
        emptyListSubtitle: '.adf-empty-content__subtitle',
        emptySearchText: '.empty-search__text',
        searchResultsRow: 'aca-search-results-row',
        searchResultsRowLine: '.line',
        searchResultsNameLink: '.link'
    };
    return DataTable;
}(Component));
export { DataTable };
//# sourceMappingURL=data-table.js.map