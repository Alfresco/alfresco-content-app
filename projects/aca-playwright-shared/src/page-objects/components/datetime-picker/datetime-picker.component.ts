/*!
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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
 * from Hyland Software. If not, see <http://www.gnu.org/licenses/>.
 */

import { Page } from '@playwright/test';
import { BaseComponent } from '../base.component';

export class DateTimePicker extends BaseComponent {
  private static rootElement = '[role="dialog"]';
  dayPicker = this.getChild('[role="grid"]');
  nextMonthBtn = this.getChild('[aria-label="Next month"]');

  constructor(page: Page) {
    super(page, DateTimePicker.rootElement);
  }

  async isCalendarOpen(): Promise<boolean> {
    const element = this.getChild('');
    return element.isVisible();
  }

  async pickDateTime(): Promise<void> {
    const today = new Date();
    const nextAvailableDay = new Date();
    nextAvailableDay.setDate(today.getDate() + 2);
    if (nextAvailableDay.getMonth() !== today.getMonth()) {
      await this.nextMonthBtn.click();
    }
    await this.selectDay(nextAvailableDay.getDate());
  }

  async selectDay(day: number): Promise<void> {
    const firstActiveDayElem = this.dayPicker.locator(`text=${day}`).first();
    await firstActiveDayElem.click();
  }
}
