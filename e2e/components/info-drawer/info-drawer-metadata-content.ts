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

import { ElementFinder, ElementArrayFinder, by, browser, ExpectedConditions as EC } from 'protractor';
import { Component } from '../component';
import { BROWSER_WAIT_TIMEOUT } from '../../configs';
import { isPresentAndEnabled, isPresentAndDisplayed } from '../../utilities/utils';

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

  constructor(ancestor?: string) {
    super(ContentMetadata.selectors.root, ancestor);
  }

  async isPropertiesListExpanded() {
    return browser.isElementPresent(this.expandedPanel);
  }

  async waitForImagePropertiesPanelToExpand() {
    await browser.wait(EC.visibilityOf(this.expandedImagePropertiesPanel), BROWSER_WAIT_TIMEOUT);
  }

  async getVisiblePropertiesLabels() {
    return this.component.all(by.css(ContentMetadata.selectors.propertyLabel))
      .filter(async (elem) => elem.isDisplayed())
      .map(async (elem) => elem.getText());
  }

  async getVisiblePropertiesValues() {
    return this.component.all(by.css(ContentMetadata.selectors.propertyValue))
      .filter(async (elem) => elem.isDisplayed())
      .map(async (elem) => {
        if (await elem.isElementPresent(by.css('.mat-checkbox'))) {
          if (await elem.isElementPresent(by.css('.mat-checkbox-checked'))) {
            return true;
          }
          return false
        }
        return elem.getText();
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

  async isLessInfoButtonDisplayed() {
    return browser.isElementPresent(this.lessInfoButton);
  }

  async isMoreInfoButtonDisplayed(): Promise<boolean> {
    return browser.isElementPresent(this.moreInfoButton);
  }

  async clickLessInformationButton() {
    await this.lessInfoButton.click();
  }

  async clickMoreInformationButton() {
    await this.moreInfoButton.click();
  }

  async isImagePropertiesPanelDisplayed(): Promise<boolean> {
    return isPresentAndDisplayed(this.imagePropertiesPanel);
  }

  async clickImagePropertiesPanel() {
    await this.imagePropertiesPanel.click();
  }

}

