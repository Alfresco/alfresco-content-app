/*!
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { SIDEBAR_LABELS } from '../../utils';
import { BaseComponent } from './base.component';
import { Locator, Page } from '@playwright/test';

export class SidenavComponent extends BaseComponent {
  private static rootElement = 'app-sidenav';

  private personalFiles = this.getChild(`[data-automation-id='app.navbar.personalFiles']`);
  private fileLibraries = this.getChild(`[data-automation-id='app.navbar.libraries.menu']`);
  private myLibraries = this.getChild(`[data-automation-id='app.navbar.libraries.files']`);
  private favoriteLibraries = this.getChild(`[data-automation-id='app.navbar.libraries.favorite']`);
  private shared = this.getChild(`[data-automation-id='app.navbar.shared']`);
  private recentFiles = this.getChild(`[data-automation-id='app.navbar.recentFiles']`);
  private favorites = this.getChild(`[data-automation-id='app.navbar.favorites']`);
  private trash = this.getChild(`[data-automation-id='app.navbar.trashcan']`);
  private sidenavToggle = this.getChild(`.aca-sidenav-header-title-logo`);
  private sidenavExpand = this.page.getByTitle('Expand navigation menu');
  public expandedSidenav = this.page.locator(`[data-automation-id='expanded']`);

  constructor(page: Page) {
    super(page, SidenavComponent.rootElement);
  }

  async isActive(name: string): Promise<boolean> {
    const cssClass = await this.getLinkLabel(name).getAttribute('class');
    return cssClass.includes('action-button--active');
  }

  async openPanel(name: string): Promise<void> {
    await this.getLinkLabel(name).click();
  }

  private getLinkLabel(name: string): Locator {
    switch (name) {
      case SIDEBAR_LABELS.PERSONAL_FILES:
        return this.personalFiles;
      case SIDEBAR_LABELS.MY_LIBRARIES:
        return this.myLibraries;
      case SIDEBAR_LABELS.FAVORITE_LIBRARIES:
        return this.favoriteLibraries;
      case SIDEBAR_LABELS.SHARED_FILES:
        return this.shared;
      case SIDEBAR_LABELS.RECENT_FILES:
        return this.recentFiles;
      case SIDEBAR_LABELS.FAVORITES:
        return this.favorites;
      case SIDEBAR_LABELS.TRASH:
        return this.trash;
      default:
        return this.personalFiles;
    }
  }

  async isSidenavExpanded(): Promise<boolean> {
    return this.expandedSidenav.isVisible();
  }

  async expandSideNav(): Promise<void> {
    const expanded = await this.isSidenavExpanded();
    if (!expanded) {
      await this.sidenavExpand.click();
      await this.expandedSidenav.waitFor({ state: 'attached' });
    }
  }

  async collapseSideNav(): Promise<void> {
    const expanded = await this.isSidenavExpanded();
    if (expanded) {
      await this.sidenavToggle.click();
      await this.expandedSidenav.waitFor({ state: 'detached' });
    }
  }
}
