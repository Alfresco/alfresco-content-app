/*!
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { by, ElementFinder, protractor } from 'protractor';
import { GenericFilter } from './generic-filter';
import { isPresentAndDisplayed } from '../../../utilities/utils';
import { BrowserActions } from '@alfresco/adf-testing';

export class CreatedDateFilter extends GenericFilter {
  constructor() {
    super('Created date');
  }

  fromField: ElementFinder = this.filterDialogOpened.element(by.cssContainingText('.adf-search-date-range .mat-form-field', 'From'));
  fromInput: ElementFinder = this.fromField.element(by.css(`[data-automation-id='date-range-from-input']`));
  fromFieldError: ElementFinder = this.fromField.element(by.css(`[data-automation-id='date-range-from-error']`));
  toField: ElementFinder = this.filterDialogOpened.element(by.cssContainingText('.adf-search-date-range .mat-form-field', 'To'));
  toInput: ElementFinder = this.toField.element(by.css(`[data-automation-id='date-range-to-input']`));
  toFieldError: ElementFinder = this.toField.element(by.css(`[data-automation-id='date-range-to-error']`));
  async isFromErrorDisplayed(): Promise<boolean> {
    return isPresentAndDisplayed(this.fromFieldError);
  }
  async isToErrorDisplayed(): Promise<boolean> {
    return isPresentAndDisplayed(this.toFieldError);
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
  async enterFromDate(date: string): Promise<void> {
    await this.openDialog();
    await BrowserActions.clearWithBackSpace(this.fromInput);
    await this.fromInput.sendKeys(date, protractor.Key.TAB);
  }

  async enterToDate(date: string): Promise<void> {
    await this.openDialog();
    await BrowserActions.clearWithBackSpace(this.toInput);
    await this.toInput.sendKeys(date, protractor.Key.TAB);
  }
}
