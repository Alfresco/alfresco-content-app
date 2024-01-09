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

import { Menu } from '../menu/menu';
import { Component } from '../component';

export class Pagination extends Component {
  range = this.byCss('.adf-pagination__range');
  maxItems = this.byCss('.adf-pagination__max-items');
  currentPage = this.byCss('.adf-pagination__current-page');
  totalPages = this.byCss('.adf-pagination__total-pages');
  previousButton = this.byCss('.adf-pagination__previous-button');
  nextButton = this.byCss('.adf-pagination__next-button');

  menu: Menu = new Menu();

  constructor(ancestor?: string) {
    super('adf-pagination', ancestor);
  }

  async isRangePresent() {
    return this.range.isPresent();
  }

  async isMaxItemsPresent() {
    return this.maxItems.isPresent();
  }

  async isCurrentPagePresent() {
    return this.currentPage.isPresent();
  }

  async isTotalPagesPresent() {
    return this.totalPages.isPresent();
  }

  async isPreviousButtonPresent() {
    return this.previousButton.isPresent();
  }

  async isNextButtonPresent() {
    return this.nextButton.isPresent();
  }

  async getRange() {
    return this.range.getText();
  }
}
