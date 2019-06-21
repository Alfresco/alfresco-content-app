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

import { ElementFinder, by, browser } from 'protractor';
import { Component } from '../component';
import * as moment from 'moment';

export class DateTimePicker extends Component {
  selectors = {
    root: '.mat-datetimepicker-popup',

    header: '.mat-datetimepicker-calendar-header',
    year: '.mat-datetimepicker-calendar-header-year',
    date: '.mat-datetimepicker-calendar-header-date',

    content: '.mat-datetimepicker-calendar-content',
    dayPicker: 'mat-datetimepicker-month-view',

    today: '.mat-datetimepicker-calendar-body-today',
    firstActiveDay:
      '.mat-datetimepicker-calendar-body-active .mat-datetimepicker-calendar-body-cell-content'
  };

  calendar = browser.element(by.css(this.selectors.root));
  headerDate = this.getByCss(this.selectors.date);
  headerYear = this.getByCss(this.selectors.year);
  dayPicker = this.getByCss(this.selectors.dayPicker);

  constructor(ancestor?: ElementFinder) {
    super('.mat-datetimepicker-popup', ancestor);
  }

  async waitForDateTimePickerToOpen() {
    await this.wait(this.calendar);
  }

  async waitForDateTimePickerToClose() {
    await this.waitStale(this.calendar);
  }

  async isCalendarOpen() {
    return await browser.isElementPresent(by.css(this.selectors.root));
  }

  async getDate() {
    return await this.headerDate.getText();
  }

  async getYear() {
    return await this.headerYear.getText();
  }

  async setDefaultDay() {
    const today = moment();
    const tomorrow = today.add(1, 'day');
    const dayOfTomorrow = tomorrow.date();
    const date = await this.getDate();
    const year = await this.getYear();
    const elem = this.dayPicker.element(
      by.cssContainingText(this.selectors.firstActiveDay, `${dayOfTomorrow}`)
    );
    await elem.click();
    return `${date} ${year}`;
  }
}
