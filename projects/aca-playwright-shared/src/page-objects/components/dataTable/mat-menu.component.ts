/*!
 * Copyright © 2005-2026 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { expect, Page } from '@playwright/test';
import { BaseComponent } from '../base.component';

export class MatMenuComponent extends BaseComponent {
  private static readonly rootElement = '[role="menu"]';

  constructor(page: Page) {
    super(page, MatMenuComponent.rootElement);
  }

  public createFolder = this.getChild('[id="app.create.folder"]');
  public createFolderFromTemplate = this.getChild('[id="app.create.folderFromTemplate"]');
  public createFileFromTemplate = this.getChild('[id="app.create.fileFromTemplate"]');
  public createLibrary = this.getChild('[id="app.create.library"]');
  public getButtonByText = (text: string) => this.getChild('button', { hasText: text });
  public getMenuItemFromHeaderMenu = (text: string) => this.page.getByRole('menuitem', { name: text, exact: true });

  async clickMenuItem(menuItem: string): Promise<void> {
    const menuElement = this.getButtonByText(menuItem);
    await menuElement.click();
    await menuElement.waitFor({ state: 'detached' });
  }

  async clickMenuItemFromHeaderMenu(menuItem: string): Promise<void> {
    const menuElement = this.getMenuItemFromHeaderMenu(menuItem);
    await menuElement.click();
    await menuElement.waitFor({ state: 'detached' });
  }

  async isMenuItemVisible(menuItem: string): Promise<boolean> {
    const menuElement = this.getButtonByText(menuItem);
    await menuElement.waitFor({ state: 'attached' });
    return menuElement.isVisible();
  }

  async getActualMoreActions(): Promise<string[]> {
    await this.getRoot().waitFor();
    const menus = await this.getChild('[role="menuitem"]').all();
    return Promise.all(
      menus.map(async (button) => {
        const title = await button.locator('span span').innerText();
        return title || '';
      })
    );
  }

  async verifyActualMoreActions(expectedToolbarMore: string[]): Promise<void> {
    const actualMoreActions = await this.getActualMoreActions();
    for (const action of expectedToolbarMore) {
      expect(
        actualMoreActions.includes(action),
        `Expected menu to contain "${action}", but actual menu items were: [${actualMoreActions.join(', ')}]`
      ).toBe(true);
    }
  }
}
