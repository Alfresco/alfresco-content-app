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

export class MetadataCard extends Component {
  private static selectors = {
    root: 'adf-content-metadata-card',
    footer: '.adf-content-metadata-card-footer',
    expandButton: '[data-automation-id="meta-data-card-toggle-expand"]',
    expansionPanel: '.adf-metadata-grouped-properties-container mat-expansion-panel'
  };

  footer: ElementFinder = this.component.element(by.css(MetadataCard.selectors.footer));
  expandButton: ElementFinder = this.component.element(by.css(MetadataCard.selectors.expandButton));
  expansionPanels: ElementArrayFinder = this.component.all(by.css(MetadataCard.selectors.expansionPanel));

  constructor(ancestor?: ElementFinder) {
    super(MetadataCard.selectors.root, ancestor);
  }

  async isExpandPresent() {
    return this.expandButton.isPresent();
  }

  async clickExpandButton() {
    await this.expandButton.click();
  }

  async waitForFirstExpansionPanel() {
    await browser.wait(EC.presenceOf(this.expansionPanels.get(0)), BROWSER_WAIT_TIMEOUT);
  }

  async isExpansionPanelPresent(index) {
    return this.expansionPanels.get(index).isPresent();
  }

  async getComponentIdOfPanel(index) {
    return this.expansionPanels.get(index).getAttribute('data-automation-id');
  }
}

