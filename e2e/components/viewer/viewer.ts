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

import { ElementFinder, by, browser, ExpectedConditions as EC } from 'protractor';
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

    viewerExtensionContent: 'app-preview-extension'
  };

  root: ElementFinder = browser.$(Viewer.selectors.root);
  viewerLayout: ElementFinder = this.component.element(by.css(Viewer.selectors.layout));
  viewerContainer: ElementFinder = this.component.element(by.css(Viewer.selectors.contentContainer));
  closeButton: ElementFinder = this.component.element(by.css(Viewer.selectors.closeBtn));
  fileTitle: ElementFinder = this.component.element(by.css(Viewer.selectors.fileTitle));
  viewerExtensionContent: ElementFinder = this.component.element(by.css(Viewer.selectors.viewerExtensionContent));

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
    return await browser.isElementPresent(this.viewerLayout);
    // return await this.viewerLayout.isPresent();
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
      return await this.viewerExtensionContent.getAttribute('data-automation-id');
    }
  }
}
