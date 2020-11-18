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

import { by, browser } from 'protractor';
import { Component } from '../component';
import { isPresentAndDisplayed, waitForStaleness } from '../../utilities/utils';
const moment = require('moment');
import { BrowserActions } from '@alfresco/adf-testing';

export class DateTimePicker extends Component {
  calendar = this.byCss('.mat-datetimepicker-popup', browser);
  headerDate = this.byCss('.mat-datetimepicker-calendar-header-date');
  headerYear = this.byCss('.mat-datetimepicker-calendar-header-year');
  dayPicker = this.byCss('mat-datetimepicker-month-view');
  rootElemLocator = by.css('.mat-datetimepicker-popup');

  constructor(ancestor?: string) {
    super('.mat-datetimepicker-popup', ancestor);
  }

  async waitForDateTimePickerToClose(): Promise<void> {
    return waitForStaleness(this.calendar);
  }

  async isCalendarOpen(): Promise<boolean> {
    const element = browser.element(this.rootElemLocator);

    return isPresentAndDisplayed(element);
  }

  async setDefaultDay(): Promise<string> {
    const today = moment();
    const tomorrow = today.add(1, 'day');
    const dayOfTomorrow = tomorrow.date();
    const date = await this.headerDate.getText();
    const year = await this.headerYear.getText();
    const firstActiveDay = '.mat-datetimepicker-calendar-body-active .mat-datetimepicker-calendar-body-cell-content';
    const elem = this.dayPicker.element(by.cssContainingText(firstActiveDay, `${dayOfTomorrow}`));
    await BrowserActions.click(elem);
    return `${date} ${year}`;
  }
}
