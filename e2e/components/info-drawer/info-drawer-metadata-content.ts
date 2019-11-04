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

import { ElementFinder, ElementArrayFinder, by, browser, ExpectedConditions as EC } from 'protractor';
import { Component } from '../component';
import { BROWSER_WAIT_TIMEOUT } from '../../configs';

export class ContentMetadata extends Component {
  private static selectors = {
    root: 'adf-content-metadata-card',

    expandedPanel: '.mat-expansion-panel.mat-expanded',
    propertyList: '.adf-property-list',
    property: '.adf-property',
    propertyLabel: '.adf-property-label',
    propertyValue: '.adf-property-value',
    editProperties: `button[title='Edit']`,
    editProperty: `.mat-icon[title='Edit']`,
    editDateItem: `.adf-dateitem-editable`,
    moreLessInformation: `[data-automation-id='meta-data-card-toggle-expand']`
  };

  expandedPanel: ElementFinder = this.component.element(by.css(ContentMetadata.selectors.expandedPanel));
  propertyList: ElementFinder = this.component.element(by.css(ContentMetadata.selectors.propertyList));
  propertyListElements: ElementArrayFinder = this.component.all(by.css(ContentMetadata.selectors.property));
  propertyValue: ElementFinder = this.component.element(by.css(ContentMetadata.selectors.propertyValue));
  editPropertiesButton: ElementFinder = this.component.element(by.css(ContentMetadata.selectors.editProperties));
  lessInfoButton: ElementFinder = this.component.element(by.cssContainingText(ContentMetadata.selectors.moreLessInformation, 'Less information'));
  moreInfoButton: ElementFinder = this.component.element(by.cssContainingText(ContentMetadata.selectors.moreLessInformation, 'More information'));

  imagePropertiesPanel: ElementFinder = this.component.element(by.css(`[data-automation-id='adf-metadata-group-APP.CONTENT_METADATA.EXIF_GROUP_TITLE']`));
  expandedImagePropertiesPanel: ElementFinder = this.component.element(by.css(`[data-automation-id='adf-metadata-group-APP.CONTENT_METADATA.EXIF_GROUP_TITLE'].mat-expanded`));

  constructor(ancestor?: ElementFinder) {
    super(ContentMetadata.selectors.root, ancestor);
  }

  async isPropertiesListExpanded() {
    return browser.isElementPresent(this.expandedPanel);
  }

  async waitForImagePropertiesPanelToExpand() {
    await browser.wait(EC.visibilityOf(this.expandedImagePropertiesPanel), BROWSER_WAIT_TIMEOUT);
  }

  async getVisiblePropertiesLabels() {
    return await this.component.all(by.css(ContentMetadata.selectors.propertyLabel))
      .filter(async (elem) => await elem.isDisplayed())
      .map(async (elem) => await elem.getText());
  }

  async getVisiblePropertiesValues() {
    return await this.component.all(by.css(ContentMetadata.selectors.propertyValue))
      .filter(async (elem) => await elem.isDisplayed())
      .map(async (elem) => {
        if (await elem.isElementPresent(by.css('.mat-checkbox'))) {
          if (await elem.isElementPresent(by.css('.mat-checkbox-checked'))) {
            return true;
          }
          return false
        }
        return await elem.getText();
      });
  }

  async isEditPropertiesButtonEnabled() {
    return (await browser.isElementPresent(this.editPropertiesButton)) && (await this.editPropertiesButton.isEnabled());
  }

  async isLessInfoButtonEnabled() {
    return (await browser.isElementPresent(this.lessInfoButton)) && (await this.lessInfoButton.isEnabled());
  }

  async isMoreInfoButtonEnabled() {
    return (await browser.isElementPresent(this.moreInfoButton)) && (await this.moreInfoButton.isEnabled());
  }

  async isLessInfoButtonDisplayed() {
    return browser.isElementPresent(this.lessInfoButton);
  }

  async isMoreInfoButtonDisplayed() {
    return browser.isElementPresent(this.moreInfoButton);
  }

  async clickLessInformationButton() {
    await this.lessInfoButton.click();
  }

  async clickMoreInformationButton() {
    await this.moreInfoButton.click();
  }

  async isImagePropertiesPanelDisplayed() {
    return (await browser.isElementPresent(this.imagePropertiesPanel)) && (await this.imagePropertiesPanel.isDisplayed());
  }

  async clickImagePropertiesPanel() {
    await this.imagePropertiesPanel.click();
  }

}

