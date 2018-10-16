/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2018 Alfresco Software Limited
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

import { ElementFinder, ElementArrayFinder, by, browser, ExpectedConditions as EC, protractor } from 'protractor';
import { BROWSER_WAIT_TIMEOUT } from '../../configs';
import { Component } from '../component';
import { Menu } from '../menu/menu';
import { Utils } from '../../utilities/utils';

export class DateTimePicker extends Component {
  private static selectors = {
    root: '.mat-datetimepicker-popup',

    header: '.mat-datetimepicker-calendar-header',
    year: '.mat-datetimepicker-calendar-header-year',
    date: '.mat-datetimepicker-calendar-header-date',
    hours: '.mat-datetimepicker-calendar-header-hours',
    minutes: '.mat-datetimepicker-calendar-header-minutes',

    content: '.mat-datetimepicker-calendar-content',
    dayPicker: 'mat-datetimepicker-month-view',
    clockPicker: 'mat-datetimepicker-clock',
    hoursPicker: '.mat-datetimepicker-clock-hours',
    minutePicker: '.mat-datetimepicker-clock-minutes',

    today: '.mat-datetimepicker-calendar-body-today',
    firstActiveDay: '.mat-datetimepicker-calendar-body-active .mat-datetimepicker-calendar-body-cell-content',

    enabledCell: '.mat-datetimepicker-clock-cell:not(.mat-datetimepicker-clock-cell-disabled)'
    // enabledCell: '.mat-datetimepicker-clock-cell-selected'
  };

  calendar: ElementFinder = browser.element(by.css(DateTimePicker.selectors.root));
  headerDate: ElementFinder = this.component.element(by.css(DateTimePicker.selectors.date));
  headerYear: ElementFinder = this.component.element(by.css(DateTimePicker.selectors.year));
  dayPicker: ElementFinder = this.component.element(by.css(DateTimePicker.selectors.dayPicker));
  clockPicker: ElementFinder = this.component.element(by.css(DateTimePicker.selectors.clockPicker));
  hourPicker: ElementFinder = this.component.element(by.css(DateTimePicker.selectors.hoursPicker));
  minutePicker: ElementFinder = this.component.element(by.css(DateTimePicker.selectors.minutePicker));

  constructor(ancestor?: ElementFinder) {
    super(DateTimePicker.selectors.root, ancestor);
  }

  async waitForDateTimePickerToOpen() {
    await browser.wait(EC.presenceOf(this.calendar), BROWSER_WAIT_TIMEOUT);
  }

  async waitForDateTimePickerToClose() {
    await browser.wait(EC.stalenessOf(this.calendar), BROWSER_WAIT_TIMEOUT);
  }

  async isCalendarOpen() {
    return await browser.isElementPresent(by.css(DateTimePicker.selectors.root));
  }

  async getDate() {
    return await this.headerDate.getText();
  }

  async getYear() {
    return await this.headerYear.getText();
  }

  async setDefaultDay() {
    const today = await this.dayPicker.element(by.css(DateTimePicker.selectors.today)).getText();
    const tomorrow = (parseInt(today, 10) + 1).toString();
    const date = await this.getDate();
    const year = await this.getYear();
    await this.dayPicker.element(by.cssContainingText(DateTimePicker.selectors.firstActiveDay, tomorrow)).click();
    return `${date} ${year}`;
  }

  async setDefaultHour() {
    const hourElem = this.hourPicker.all(by.css(DateTimePicker.selectors.enabledCell)).first();
    const hour = await hourElem.getText();
    await hourElem.click();
    return hour;
  }

  async setDefaultMinutes() {
    const minsElem = this.minutePicker.all(by.css(DateTimePicker.selectors.enabledCell)).first();
    const mins = await minsElem.getText();
    await minsElem.click();
    return mins;
  }
}
