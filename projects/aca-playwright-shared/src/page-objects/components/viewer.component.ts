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

import { Page } from '@playwright/test';
import { BaseComponent } from './base.component';
import { AcaHeader } from './aca-header.component';
import { timeouts } from '../../utils';
import { expect } from '@playwright/test';

export class ViewerComponent extends BaseComponent {
  private static rootElement = 'adf-viewer';

  private viewerLocator = this.getChild('.adf-viewer-render-layout-content');
  public closeButtonLocator = this.getChild('.adf-viewer-close-button');
  public fileTitleButtonLocator = this.getChild('.adf-viewer__file-title');
  public pdfViewerContentPages = this.getChild('.adf-pdf-viewer__content .page');
  public shareButton = this.getChild('button[id="share-action-button"]');
  public allButtons = this.getChild('button');

  toolbar = new AcaHeader(this.page);

  constructor(page: Page) {
    super(page, ViewerComponent.rootElement);
  }

  async isPdfViewerContentDisplayed(): Promise<boolean> {
    const count = await this.pdfViewerContentPages.count();
    return count > 0;
  }

  async waitForViewerToOpen(): Promise<void> {
    await this.viewerLocator.waitFor({ state: 'visible', timeout: timeouts.medium });
  }

  async isViewerOpened(): Promise<boolean> {
    await this.waitForViewerToOpen();
    return await this.viewerLocator.isVisible();
  }

  async isCloseButtonDisplayed(): Promise<boolean> {
    await this.closeButtonLocator.waitFor({ state: 'visible', timeout: timeouts.normal });
    return await this.closeButtonLocator.isEnabled({ timeout: timeouts.normal });
  }

  async isFileTitleDisplayed(): Promise<boolean> {
    await this.fileTitleButtonLocator.waitFor({ state: 'visible', timeout: timeouts.normal });
    return await this.fileTitleButtonLocator.isVisible();
  }

  async getCloseButtonTooltip(): Promise<string> {
    await this.closeButtonLocator.waitFor({ state: 'visible', timeout: timeouts.normal });
    return await this.closeButtonLocator.getAttribute('title');
  }

  async verifyViewerPrimaryActions(expectedToolbarPrimary: string[]): Promise<void> {
    const toRemove = ['Close', 'Previous File', 'Next File', 'View details'];
    const removeClosePreviousNextOldInfo = (actions: string[]): string[] => actions.filter((elem) => !toRemove.includes(elem));

    let buttons = await this.page.$$('adf-viewer button');
    let actualPrimaryActions: string[] = await Promise.all(
      buttons.map(async (button) => {
        const title = await button.getAttribute('title');
        return title || '';
      })
    );

    actualPrimaryActions = removeClosePreviousNextOldInfo(actualPrimaryActions);

    for (const action of expectedToolbarPrimary) {
      expect(actualPrimaryActions.includes(action), `Expected to contain ${action}`).toBe(true);
    }
  }
}
