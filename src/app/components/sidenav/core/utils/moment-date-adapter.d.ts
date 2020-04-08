/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { DateAdapter } from '@angular/material';
import { Moment } from 'moment';
export declare class MomentDateAdapter extends DateAdapter<Moment> {
  private localeData;
  overrideDisplayFormat: string;
  getYear(date: Moment): number;
  getMonth(date: Moment): number;
  getDate(date: Moment): number;
  getDayOfWeek(date: Moment): number;
  getMonthNames(style: 'long' | 'short' | 'narrow'): string[];
  getDateNames(): string[];
  getDayOfWeekNames(style: 'long' | 'short' | 'narrow'): string[];
  getYearName(date: Moment): string;
  getFirstDayOfWeek(): number;
  getNumDaysInMonth(date: Moment): number;
  clone(date: Moment): Moment;
  createDate(year: number, month: number, date: number): Moment;
  today(): Moment;
  parse(value: any, parseFormat: any): Moment;
  format(date: Moment, displayFormat: any): string;
  addCalendarYears(date: Moment, years: number): Moment;
  addCalendarMonths(date: Moment, months: number): Moment;
  addCalendarDays(date: Moment, days: number): Moment;
  getISODateString(date: Moment): string;
  setLocale(locale: any): void;
  compareDate(first: Moment, second: Moment): number;
  sameDate(first: any | Moment, second: any | Moment): boolean;
  clampDate(date: Moment, min?: any | Moment, max?: any | Moment): Moment;
  isDateInstance(date: any): boolean;
  isValid(date: Moment): boolean;
  toIso8601(date: Moment): string;
  fromIso8601(iso8601String: string): Moment | null;
  invalid(): Moment;
}
