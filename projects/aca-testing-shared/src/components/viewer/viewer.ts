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
 * along with Alfresco. If not, see <http://www.gnu.org/licenses/>.
 */

import { browser } from 'protractor';
import { Component } from '../component';
import { Toolbar } from '../toolbar/toolbar';
import { waitForPresence } from '../../utilities';

export class Viewer extends Component {
  root = browser.$('adf-viewer');
  viewerLayout = this.byCss('.adf-viewer-render-layout-content');
  viewerContainer = this.byCss('.adf-viewer-render-content-container');
  closeButton = this.byCss('.adf-viewer-close-button');
  fileTitle = this.byCss('.adf-viewer__file-title');

  toolbar = new Toolbar('adf-viewer');

  constructor(ancestor?: string) {
    super('adf-viewer', ancestor);
  }

  async waitForViewerToOpen(): Promise<void> {
    try {
      await waitForPresence(this.viewerContainer);
      await waitForPresence(this.viewerLayout);
    } catch (error) {
      console.error('\n-----> catch waitForViewerToOpen <-----\n', error);
    }
  }

  async waitForFileTitleToBeDisplayed(fileTitle: string): Promise<void> {
    try {
      const fileName = this.byCssText('.adf-viewer__display-name', `${fileTitle}`);
      await waitForPresence(fileName);
    } catch (error) {
      console.error('\n-----> catch waitForFileTitle <-----\n', error);
    }
  }

  async isViewerOpened() {
    return browser.isElementPresent(this.viewerLayout);
  }

  async getFileTitle(): Promise<string> {
    return this.fileTitle.getText();
  }
}
