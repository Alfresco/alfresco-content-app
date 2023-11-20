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
import { Locator, Page } from '@playwright/test';

export class MenuComponent extends BaseComponent {
  private static rootElement = '.mat-menu-panel';

  constructor(page: Page) {
    super(page, MenuComponent.rootElement);
  }

  items = this.getChild('.mat-menu-item');

  async getNthItem(nth: number): Promise<Locator> {
    return this.items.nth(nth - 1);
  }

  async getItemByLabel(menuItem: string): Promise<Locator> {
    return this.items.getByText(menuItem);
  }

  async clickMenuItem(menuItem: string): Promise<void> {
    try {
      await this.page.locator('.mat-menu-item').getByText(menuItem).click();
    } catch (e) {
      throw new Error(`Click menu item catch : failed to click on ${menuItem}`);
    }
  }

  async getItemsCount(): Promise<number> {
    return this.items.count();
  }

  async clickNthItem(nth: number): Promise<void> {
    try {
      (await this.getNthItem(nth)).click();
    } catch (e) {
      throw new Error(`Click nth menu item catch: ${e}`);
    }
  }
}
