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

export class CyViewer {
  root = 'adf-viewer';
  viewerLayout = '.adf-viewer-layout-content';
  viewerContainer = '.adf-viewer-content-container';
  closeButton = '.adf-viewer-close-button';
  fileTitle = '.adf-viewer__file-title';
  viewerExtensionContent = 'adf-preview-extension';
  pdfViewerContentPages = '.adf-pdf-viewer__content .page';
  txtViewerContent = '.adf-txt-viewer-content';


  // async waitForViewerToOpen(): Promise<void> {
  //   try {
  //     await waitForPresence(this.viewerContainer);
  //     await waitForPresence(this.viewerLayout);
  //   } catch (error) {
  //     cy.log('\n-----> catch waitForViewerToOpen <-----\n', error);
  //   }
  // }

  // async waitForTxtViewerToLoad(): Promise<void> {
  //   try {
  //     await this.waitForViewerToOpen();
  //     await waitForPresence(this.txtViewerContent);
  //   } catch (error) {
  //     cy.log('\n-----> catch waitForTxtViewerToLoad <-----\n', error);
  //   }
  // }

  // async isViewerOpened() {
  //   return browser.isElementPresent(this.viewerLayout);
  // }

  // async isViewerToolbarDisplayed() {
  //   return browser.isElementPresent(this.toolbar.component);
  // }

  // async isCloseButtonDisplayed() {
  //   return browser.isElementPresent(this.closeButton);
  // }

  // async isFileTitleDisplayed() {
  //   return browser.isElementPresent(this.fileTitle);
  // }

  // async getCloseButtonTooltip(): Promise<string> {
  //   return this.toolbar.getButtonTooltip(this.closeButton);
  // }

  // async getFileTitle(): Promise<string> {
  //   return this.fileTitle.getText();
  // }

  // async isCustomContentPresent() {
  //   return browser.isElementPresent(this.viewerExtensionContent);
  // }

  // async getComponentIdOfView(): Promise<string> {
  //   if (await this.isCustomContentPresent()) {
  //     return this.viewerExtensionContent.getAttribute('data-automation-id');
  //   }

  //   return '';
  // }

  // async isPdfViewerContentDisplayed(): Promise<boolean> {
  //   const count = await this.pdfViewerContentPages.count();
  //   return count > 0;
  // }

  // async clickCloseButton(): Promise<void> {
  //   const closeButton: ElementFinder = element(by.css('button[data-automation-id="adf-toolbar-back"]'));
  //   await BrowserActions.click(closeButton);
  // }
}
