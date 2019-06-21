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

import { ElementFinder, browser } from 'protractor';
import { Component } from '../component';
import { Toolbar } from '../toolbar/toolbar';

export class Viewer extends Component {
  selectors = {
    root: 'adf-viewer',
    layout: '.adf-viewer-layout-content',
    contentContainer: '.adf-viewer-content-container',
    closeBtn: '.adf-viewer-close-button',
    fileTitle: '.adf-viewer__file-title',
    viewerExtensionContent: 'adf-preview-extension',
    pdfViewerContentPage: '.adf-pdf-viewer__content .page'
  };

  root: ElementFinder = browser.$(this.selectors.root);
  viewerLayout = this.getByCss(this.selectors.layout);
  viewerContainer = this.getByCss(this.selectors.contentContainer);
  closeButton = this.getByCss(this.selectors.closeBtn);
  fileTitle = this.getByCss(this.selectors.fileTitle);
  viewerExtensionContent = this.getByCss(this.selectors.viewerExtensionContent);
  pdfViewerContentPages = this.getAllByCss(this.selectors.pdfViewerContentPage);

  toolbar = new Toolbar(this.component);

  constructor(ancestor?: ElementFinder) {
    super('adf-viewer', ancestor);
  }

  async waitForViewerToOpen() {
    try {
      await this.wait(this.viewerContainer);
    } catch (error) {
      console.log('\n-----> catch waitForViewerToOpen <-----\n', error);
    }
  }

  async isViewerOpened() {
    return await browser.isElementPresent(this.viewerLayout);
  }

  async isViewerContentDisplayed() {
    return await browser.isElementPresent(this.viewerContainer);
  }

  async isViewerToolbarDisplayed() {
    return await browser.isElementPresent(this.toolbar.component);
  }

  async isCloseButtonDisplayed() {
    return await browser.isElementPresent(this.closeButton);
  }

  async isFileTitleDisplayed() {
    return await browser.isElementPresent(this.fileTitle);
  }

  async clickClose() {
    await this.closeButton.click();
  }

  async getCloseButtonTooltip() {
    return await this.toolbar.getButtonTooltip(this.closeButton);
  }

  async getFileTitle() {
    return await this.fileTitle.getText();
  }

  async isCustomContentPresent() {
    return await browser.isElementPresent(this.viewerExtensionContent);
  }

  async getComponentIdOfView() {
    if (await this.isCustomContentPresent()) {
      return await this.viewerExtensionContent.getAttribute(
        'data-automation-id'
      );
    }
  }

  async isPdfViewerContentDisplayed() {
    const count = await this.pdfViewerContentPages.count();
    return count > 0;
  }
}
