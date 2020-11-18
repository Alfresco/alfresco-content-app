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

import { ElementFinder, by, protractor } from 'protractor';
import { GenericFilterPanel } from './generic-filter-panel';
import { isPresentAndDisplayed } from '../../../utilities/utils';
import { BrowserActions } from '@alfresco/adf-testing';

export class CreatedDateFilter extends GenericFilterPanel {
  constructor() {
    super('Created date');
  }

  fromField: ElementFinder = this.panelExpanded.element(by.cssContainingText('.adf-search-date-range .mat-form-field', 'From'));
  fromInput: ElementFinder = this.fromField.element(by.css(`[data-automation-id='date-range-from-input']`));
  fromFieldError: ElementFinder = this.fromField.element(by.css(`[data-automation-id='date-range-from-error']`));
  toField: ElementFinder = this.panelExpanded.element(by.cssContainingText('.adf-search-date-range .mat-form-field', 'To'));
  toInput: ElementFinder = this.toField.element(by.css(`[data-automation-id='date-range-to-input']`));
  toFieldError: ElementFinder = this.toField.element(by.css(`[data-automation-id='date-range-to-error']`));
  clearButton: ElementFinder = this.panel.element(by.css('.adf-facet-buttons [data-automation-id="date-range-clear-btn"]'));
  applyButton: ElementFinder = this.panel.element(by.css('.adf-facet-buttons [data-automation-id="date-range-apply-btn"]'));

  async isFromFieldDisplayed(): Promise<boolean> {
    return isPresentAndDisplayed(this.fromField);
  }

  async isFromErrorDisplayed(): Promise<boolean> {
    return isPresentAndDisplayed(this.fromFieldError);
  }

  async isToFieldDisplayed(): Promise<boolean> {
    return isPresentAndDisplayed(this.toField);
  }

  async isToErrorDisplayed(): Promise<boolean> {
    return isPresentAndDisplayed(this.toFieldError);
  }

  async isClearButtonEnabled(): Promise<boolean> {
    return this.clearButton.isEnabled();
  }

  async isApplyButtonEnabled(): Promise<boolean> {
    return this.applyButton.isEnabled();
  }

  async clickClearButton(): Promise<void> {
    if (await this.isClearButtonEnabled()) {
      await BrowserActions.click(this.clearButton);
    }
  }

  async clickApplyButton(): Promise<void> {
    if (await this.isApplyButtonEnabled()) {
      await BrowserActions.click(this.applyButton);
    }
  }

  async getFromValue(): Promise<string> {
    return BrowserActions.getInputValue(this.fromInput);
  }

  async getFromError(): Promise<string> {
    try {
      return await this.fromFieldError.getText();
    } catch (err) {
      return '';
    }
  }

  async getToValue(): Promise<string> {
    return BrowserActions.getInputValue(this.fromInput);
  }

  async getToError(): Promise<string> {
    try {
      return await this.toFieldError.getText();
    } catch (err) {
      return '';
    }
  }

  async resetPanel(): Promise<void> {
    const fromValue = await this.getFromValue();
    const toValue = await this.getToValue();
    if (fromValue.length > 0 || toValue.length > 0) {
      await this.expandPanel();
      await this.clickClearButton();
      await this.collapsePanel();
    }
  }

  async enterFromDate(date: string): Promise<void> {
    await this.expandPanel();
    await BrowserActions.clearWithBackSpace(this.fromInput);
    await this.fromInput.sendKeys(date, protractor.Key.TAB);
  }

  async enterToDate(date: string): Promise<void> {
    await this.expandPanel();
    await BrowserActions.clearWithBackSpace(this.toInput);
    await this.toInput.sendKeys(date, protractor.Key.TAB);
  }
}
