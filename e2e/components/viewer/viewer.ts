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

import { ElementFinder, by, browser, ExpectedConditions as EC, ElementArrayFinder } from 'protractor';
import { Component } from '../component';
import { BROWSER_WAIT_TIMEOUT } from '../../configs';
import { Toolbar } from '../toolbar/toolbar';

export class Viewer extends Component {
  private static selectors = {
    root: 'adf-viewer',

    layout: '.adf-viewer-layout-content',
    contentContainer: '.adf-viewer-content-container',
    closeBtn: '.adf-viewer-close-button',
    fileTitle: '.adf-viewer__file-title',

    viewerExtensionContent: 'adf-preview-extension',

    pdfViewerContentPage: '.adf-pdf-viewer__content .page'
  };

  root: ElementFinder = browser.$(Viewer.selectors.root);
  viewerLayout: ElementFinder = this.component.element(by.css(Viewer.selectors.layout));
  viewerContainer: ElementFinder = this.component.element(by.css(Viewer.selectors.contentContainer));
  closeButton: ElementFinder = this.component.element(by.css(Viewer.selectors.closeBtn));
  fileTitle: ElementFinder = this.component.element(by.css(Viewer.selectors.fileTitle));
  viewerExtensionContent: ElementFinder = this.component.element(by.css(Viewer.selectors.viewerExtensionContent));
  pdfViewerContentPages: ElementArrayFinder = this.component.all(by.css(Viewer.selectors.pdfViewerContentPage));

  toolbar = new Toolbar(this.component);

  constructor(ancestor?: ElementFinder) {
    super(Viewer.selectors.root, ancestor);
  }

  async waitForViewerToOpen() {
    try {
      await browser.wait(EC.presenceOf(this.viewerContainer), BROWSER_WAIT_TIMEOUT);
    } catch (error) {
      console.log('\n-----> catch waitForViewerToOpen <-----\n', error)
    }
  }

  async isViewerOpened() {
    return browser.isElementPresent(this.viewerLayout);
  }

  async isViewerContentDisplayed() {
    return browser.isElementPresent(this.viewerContainer);
  }

  async isViewerToolbarDisplayed() {
    return browser.isElementPresent(this.toolbar.component);
  }

  async isCloseButtonDisplayed() {
    return browser.isElementPresent(this.closeButton);
  }

  async isFileTitleDisplayed() {
    return browser.isElementPresent(this.fileTitle);
  }

  async clickClose() {
    await this.closeButton.click();
  }

  async getCloseButtonTooltip() {
    return this.toolbar.getButtonTooltip(this.closeButton);
  }

  async getFileTitle() {
    return this.fileTitle.getText();
  }

  async isCustomContentPresent() {
    return browser.isElementPresent(this.viewerExtensionContent);
  }

  async getComponentIdOfView(): Promise<string> {
    if (await this.isCustomContentPresent()) {
      return this.viewerExtensionContent.getAttribute('data-automation-id');
    }

    return '';
  }

  async isPdfViewerContentDisplayed() {
    const count = await this.pdfViewerContentPages.count();
    return count > 0;
  }
}
