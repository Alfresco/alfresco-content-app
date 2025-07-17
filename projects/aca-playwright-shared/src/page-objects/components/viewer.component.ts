/*!
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { Page, expect } from '@playwright/test';
import { BaseComponent } from './base.component';
import { AcaHeader } from './aca-header.component';
import { timeouts } from '../../utils';

export class ViewerComponent extends BaseComponent {
  private static rootElement = 'adf-viewer';

  public viewerLocator = this.getChild('adf-viewer-render');
  public closeButtonLocator = this.getChild('.adf-viewer-close-button');
  public fileTitleButtonLocator = this.getChild('.adf-viewer__file-title');
  public pdfViewerContentPages = this.getChild('.adf-pdf-viewer__content .page');
  public shareButton = this.getChild('button[id="share-action-button"]');
  public downloadButton = this.getChild('button[id="app.viewer.download"]');
  public allButtons = this.getChild('button');
  public unknownFormat = this.getChild(`adf-viewer-unknown-format .adf-viewer__unknown-format-view`);
  public viewerImage = this.viewerLocator.locator('.cropper-canvas img');
  public viewerDocument = this.viewerLocator.locator('.adf-pdf-viewer__content [role="document"]');
  public documentThumbnailButton = this.getChild('[data-automation-id="adf-thumbnails-button"]');
  public thumbnailsPages = this.getChild('[data-automation-id="adf-thumbnails-content"] adf-pdf-thumb');
  public thumbnailsCloseButton = this.getChild('[data-automation-id="adf-thumbnails-close"]');
  public viewerPage = this.getChild('[data-automation-id="adf-page-selector"]');
  public viewerMedia = this.getChild('adf-media-player');
  public viewerSpinner = this.getChild('.adf-viewer-render__loading-screen');
  public zoomInButton = this.getChild('#viewer-zoom-in-button');
  public zoomOutButton = this.getChild('#viewer-zoom-out-button');
  public zoomScale = this.getChild('[data-automation-id="adf-page-scale"]');
  public zoomResetButton = this.getChild('#viewer-reset-button');
  public fitToPageButton = this.getChild('#viewer-scale-page-button');

  toolbar = new AcaHeader(this.page);

  constructor(page: Page) {
    super(page, ViewerComponent.rootElement);
  }

  async isPdfViewerContentDisplayed(): Promise<boolean> {
    const count = await this.pdfViewerContentPages.count();
    return count > 0;
  }

  async isViewerOpened(): Promise<boolean> {
    await this.waitForViewerToOpen();
    return this.viewerLocator.isVisible();
  }

  async waitForViewerToOpen(waitForViewerContent?: 'wait for viewer content'): Promise<void> {
    if (waitForViewerContent) {
      await this.waitForViewerLoaderToFinish();
    }
    await this.viewerLocator.waitFor({ state: 'visible', timeout: timeouts.large });
  }

  async waitForViewerLoaderToFinish(customTimeout?: number): Promise<void> {
    try {
      await this.viewerSpinner.waitFor({ state: 'hidden', timeout: customTimeout || timeouts.extraLarge });
    } catch (error) {
      this.logger.log('waitForViewerLoaderToFinish: Timeout reached while waiting for viewer loader to finish.');
      throw error;
    }
  }

  async checkViewerActivePage(pageNumber: number): Promise<void> {
    await expect(this.viewerPage).toHaveValue(pageNumber.toString());
  }

  async clickViewerThumbnailPage(pageNumber: number): Promise<void> {
    await this.thumbnailsPages.nth(pageNumber - 1).click();
  }

  async isCloseButtonDisplayed(): Promise<boolean> {
    await this.closeButtonLocator.waitFor({ state: 'visible', timeout: timeouts.normal });
    return this.closeButtonLocator.isEnabled({ timeout: timeouts.normal });
  }

  async isFileTitleDisplayed(): Promise<boolean> {
    await this.fileTitleButtonLocator.waitFor({ state: 'visible', timeout: timeouts.normal });
    return this.fileTitleButtonLocator.isVisible();
  }

  async waitForZoomPercentageToDisplay(): Promise<void> {
    await this.zoomScale.waitFor({ state: 'visible', timeout: timeouts.normal });
    const startTime = Date.now();
    let textContent: string;

    while (Date.now() - startTime <= timeouts.medium) {
      textContent = await this.zoomScale.innerText();
      if (textContent.trim() !== '') {
        break;
      }
      await this.page.waitForTimeout(timeouts.tiny);
    }

    if (textContent.trim() === '') {
      throw new Error(`Timeout: Text did not show up within ${timeouts.medium} ms`);
    }
  }

  async getFileTitle(): Promise<string> {
    await this.fileTitleButtonLocator.waitFor({ state: 'visible', timeout: timeouts.normal });
    await this.waitForViewerLoaderToFinish();
    return this.fileTitleButtonLocator.textContent();
  }

  async getCloseButtonTooltip(): Promise<string> {
    await this.closeButtonLocator.waitFor({ state: 'visible', timeout: timeouts.normal });
    return this.closeButtonLocator.getAttribute('title');
  }

  async verifyViewerPrimaryActions(expectedToolbarPrimary: string[]): Promise<void> {
    const toRemove = ['Close', 'Previous File', 'Next File', 'View details'];
    const removeClosePreviousNextOldInfo = (actions: string[]): string[] => actions.filter((elem) => !toRemove.includes(elem));

    const buttons = await this.page.$$('adf-viewer button');
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

  async checkUnknownFormatIsDisplayed(): Promise<void> {
    await this.unknownFormat.waitFor({ state: 'visible', timeout: timeouts.normal });
  }

  async getUnknownFormatMessage(): Promise<string> {
    return this.unknownFormat.locator(`.adf-viewer__unknown-label`).innerText();
  }
}
