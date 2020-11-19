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

import { ElementFinder, by, browser } from 'protractor';
import { isPresentAndDisplayed } from '../../../utilities/utils';
import { BrowserActions } from '@alfresco/adf-testing';

export class GenericFilterPanel {
  private filterName: string;

  constructor(filterName: string) {
    this.filterName = filterName;
  }

  private readonly selectors = {
    root: 'adf-search-filter',

    panel: '.mat-expansion-panel',
    panelExpanded: '.mat-expansion-panel.mat-expanded',
    panelHeader: '.mat-expansion-panel-header'
  };

  get panel(): ElementFinder {
    return browser.element(by.cssContainingText(this.selectors.panel, this.filterName));
  }
  get panelExpanded(): ElementFinder {
    return browser.element(by.cssContainingText(this.selectors.panelExpanded, this.filterName));
  }
  get panelHeader(): ElementFinder {
    return this.panel.element(by.css(this.selectors.panelHeader));
  }

  async clickPanelHeader(): Promise<void> {
    await BrowserActions.click(this.panelHeader);
  }

  async isPanelDisplayed(): Promise<boolean> {
    return isPresentAndDisplayed(this.panel);
  }

  async isPanelExpanded(): Promise<boolean> {
    return isPresentAndDisplayed(this.panelExpanded);
  }

  async expandPanel(): Promise<void> {
    if (!(await this.isPanelExpanded())) {
      await this.clickPanelHeader();
    }
  }

  async collapsePanel(): Promise<void> {
    if (await this.isPanelExpanded()) {
      await this.clickPanelHeader();
    }
  }
}
