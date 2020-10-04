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

import { by, browser, ElementFinder } from 'protractor';
import { Component } from '../component';
import { isPresentAndEnabled, isPresentAndDisplayed } from '../../utilities/utils';
import { BrowserActions, BrowserVisibility } from '@alfresco/adf-testing';

export class ContentMetadata extends Component {
  expandedPanel = this.byCss('.mat-expansion-panel.mat-expanded');
  propertyList = this.byCss('.adf-property-list');
  propertyListElements = this.allByCss('.adf-property');
  propertyValue = this.byCss('.adf-property-value');
  editPropertiesButton = this.byCss(`button[title='Edit']`);
  lessInfoButton = this.byCssText(`[data-automation-id='meta-data-card-toggle-expand']`, 'Less information');
  moreInfoButton = this.byCssText(`[data-automation-id='meta-data-card-toggle-expand']`, 'More information');
  imagePropertiesPanel = this.byCss(`[data-automation-id='adf-metadata-group-APP.CONTENT_METADATA.EXIF_GROUP_TITLE']`);
  expandedImagePropertiesPanel = this.byCss(`[data-automation-id='adf-metadata-group-APP.CONTENT_METADATA.EXIF_GROUP_TITLE'].mat-expanded`);

  constructor(ancestor?: string) {
    super('adf-content-metadata-card', ancestor);
  }

  async isPropertiesListExpanded(): Promise<boolean> {
    return browser.isElementPresent(this.expandedPanel);
  }

  async waitForImagePropertiesPanelToExpand(): Promise<void> {
    await BrowserVisibility.waitUntilElementIsVisible(this.expandedImagePropertiesPanel);
  }

  async getVisiblePropertiesLabels(): Promise<string[]> {
    return this.allByCss('.adf-property-label')
      .filter(async (elem) => elem.isDisplayed())
      .map(async (elem) => elem.getText());
  }

  async getVisiblePropertiesValues() {
    return this.allByCss('.adf-property-value')
      .filter(async (elem) => elem.isDisplayed())
      .map(async (elem) => {
        if (await elem.isElementPresent(by.css('.mat-checkbox'))) {
          return !!(await elem.isElementPresent(by.css('.mat-checkbox-checked')));
        }

        return this.getElementValue(elem);
      });
  }

  async isEditPropertiesButtonEnabled(): Promise<boolean> {
    return isPresentAndEnabled(this.editPropertiesButton);
  }

  async isLessInfoButtonEnabled(): Promise<boolean> {
    return isPresentAndEnabled(this.lessInfoButton);
  }

  async isMoreInfoButtonEnabled(): Promise<boolean> {
    return isPresentAndEnabled(this.moreInfoButton);
  }

  async isMoreInfoButtonDisplayed(): Promise<boolean> {
    return browser.isElementPresent(this.moreInfoButton);
  }

  async isImagePropertiesPanelDisplayed(): Promise<boolean> {
    return isPresentAndDisplayed(this.imagePropertiesPanel);
  }

  private async getElementValue(elem: ElementFinder): Promise<string> {
    const tagName = await elem.getTagName();

    if (tagName === 'input' || tagName === 'textarea') {
      return BrowserActions.getInputValue(elem);
    }

    return elem.getText();
  }
}
