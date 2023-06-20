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

import { by, browser } from 'protractor';
import { Component } from '../component';
import { isPresentAndDisplayed, waitForStaleness } from '../../utilities/utils';
import { BrowserActions } from '@alfresco/adf-testing';

export class DateTimePicker extends Component {
  calendar = this.byCss('.mat-datepicker-popup', browser);
  headerTime = this.byCss('.mat-datetimepicker-calendar-header-time');
  headerDate = this.byCss('.mat-datetimepicker-calendar-header-date');
  headerYear = this.byCss('.mat-datetimepicker-calendar-header-year');
  dayPicker = this.byCss('mat-month-view');
  hourPicker = this.byCss('.mat-datetimepicker-clock-hours');
  minutePicker = this.byCss('.mat-datetimepicker-clock-minutes');
  nextMonthBtn = this.byCss('.mat-calendar-next-button');
  rootElemLocator = by.css('.mat-datepicker-popup');

  constructor(ancestor?: string) {
    super('.mat-datepicker-popup', ancestor);
  }

  async waitForDateTimePickerToClose(): Promise<void> {
    return waitForStaleness(this.calendar);
  }

  async isCalendarOpen(): Promise<boolean> {
    const element = browser.element(this.rootElemLocator);

    return isPresentAndDisplayed(element);
  }

  async pickDateTime(): Promise<void> {
    const today = new Date()
    const nextAvailableDay = new Date();
    nextAvailableDay.setDate(today.getDate() + 2);
    if (nextAvailableDay.getMonth() !== today.getMonth()) {
      await BrowserActions.click(this.nextMonthBtn);
    }
    await this.selectDay(nextAvailableDay.getDate());
  }

  async selectDay(day: number): Promise<void> {
    const firstActiveDay = '.mat-calendar-body-cell-content';
    const firstActiveDayElem = this.dayPicker.element(by.cssContainingText(firstActiveDay, `${day}`));
    await BrowserActions.click(firstActiveDayElem);
  }

  async selectHour(hour: number): Promise<void> {
    const clockCellClass = '.mat-datetimepicker-clock-cell';
    const selectedHourElem = this.hourPicker.element(by.cssContainingText(clockCellClass, `${hour}`));
    await BrowserActions.click(selectedHourElem);
  }

  async selectMinute(minute: number): Promise<void> {
    const clockCellClass = '.mat-datetimepicker-clock-cell';
    const selectedMinuteElem = this.minutePicker.element(by.cssContainingText(clockCellClass, `${minute}`));
    await BrowserActions.click(selectedMinuteElem);
  }
}
