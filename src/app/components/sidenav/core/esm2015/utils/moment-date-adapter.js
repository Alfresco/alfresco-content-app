/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
import { isMoment } from 'moment';
import moment from 'moment-es6';
export class MomentDateAdapter extends DateAdapter {
  constructor() {
    super(...arguments);
    this.localeData = moment.localeData();
  }
  /**
   * @param {?} date
   * @return {?}
   */
  getYear(date) {
    return date.year();
  }
  /**
   * @param {?} date
   * @return {?}
   */
  getMonth(date) {
    return date.month();
  }
  /**
   * @param {?} date
   * @return {?}
   */
  getDate(date) {
    return date.date();
  }
  /**
   * @param {?} date
   * @return {?}
   */
  getDayOfWeek(date) {
    return date.day();
  }
  /**
   * @param {?} style
   * @return {?}
   */
  getMonthNames(style) {
    switch (style) {
      case 'long':
        return this.localeData.months();
      case 'short':
        return this.localeData.monthsShort();
      case 'narrow':
        return this.localeData.monthsShort().map(
          /**
           * @param {?} month
           * @return {?}
           */
          month => month[0]
        );
      default:
        return [];
    }
  }
  /**
   * @return {?}
   */
  getDateNames() {
    /** @type {?} */
    const dateNames = [];
    for (let date = 1; date <= 31; date++) {
      dateNames.push(String(date));
    }
    return dateNames;
  }
  /**
   * @param {?} style
   * @return {?}
   */
  getDayOfWeekNames(style) {
    switch (style) {
      case 'long':
        return this.localeData.weekdays();
      case 'short':
        return this.localeData.weekdaysShort();
      case 'narrow':
        return this.localeData.weekdaysShort();
      default:
        return [];
    }
  }
  /**
   * @param {?} date
   * @return {?}
   */
  getYearName(date) {
    return String(date.year());
  }
  /**
   * @return {?}
   */
  getFirstDayOfWeek() {
    return this.localeData.firstDayOfWeek();
  }
  /**
   * @param {?} date
   * @return {?}
   */
  getNumDaysInMonth(date) {
    return date.daysInMonth();
  }
  /**
   * @param {?} date
   * @return {?}
   */
  clone(date) {
    /** @type {?} */
    const locale = this.locale || 'en';
    return date.clone().locale(locale);
  }
  /**
   * @param {?} year
   * @param {?} month
   * @param {?} date
   * @return {?}
   */
  createDate(year, month, date) {
    return moment([year, month, date]);
  }
  /**
   * @return {?}
   */
  today() {
    /** @type {?} */
    const locale = this.locale || 'en';
    return moment().locale(locale);
  }
  /**
   * @param {?} value
   * @param {?} parseFormat
   * @return {?}
   */
  parse(value, parseFormat) {
    /** @type {?} */
    const locale = this.locale || 'en';
    if (value && typeof value === 'string') {
      /** @type {?} */
      let m = moment(value, parseFormat, locale, true);
      if (!m.isValid()) {
        // use strict parsing because Moment's parser is very forgiving, and this can lead to undesired behavior.
        m = moment(value, this.overrideDisplayFormat, locale, true);
      }
      if (m.isValid()) {
        // if user omits year, it defaults to 2001, so check for that issue.
        if (m.year() === 2001 && value.indexOf('2001') === -1) {
          // if 2001 not actually in the value string, change to current year
          /** @type {?} */
          const currentYear = new Date().getFullYear();
          m.set('year', currentYear);
          // if date is in the future, set previous year
          if (m.isAfter(moment())) {
            m.set('year', currentYear - 1);
          }
        }
      }
      return m;
    }
    return value ? moment(value).locale(locale) : null;
  }
  /**
   * @param {?} date
   * @param {?} displayFormat
   * @return {?}
   */
  format(date, displayFormat) {
    date = this.clone(date);
    displayFormat = this.overrideDisplayFormat
      ? this.overrideDisplayFormat
      : displayFormat;
    if (date && date.format) {
      return date.format(displayFormat);
    } else {
      return '';
    }
  }
  /**
   * @param {?} date
   * @param {?} years
   * @return {?}
   */
  addCalendarYears(date, years) {
    return date.clone().add(years, 'y');
  }
  /**
   * @param {?} date
   * @param {?} months
   * @return {?}
   */
  addCalendarMonths(date, months) {
    return date.clone().add(months, 'M');
  }
  /**
   * @param {?} date
   * @param {?} days
   * @return {?}
   */
  addCalendarDays(date, days) {
    return date.clone().add(days, 'd');
  }
  /**
   * @param {?} date
   * @return {?}
   */
  getISODateString(date) {
    return date.toISOString();
  }
  /**
   * @param {?} locale
   * @return {?}
   */
  setLocale(locale) {
    super.setLocale(locale);
    this.localeData = moment.localeData(locale);
  }
  /**
   * @param {?} first
   * @param {?} second
   * @return {?}
   */
  compareDate(first, second) {
    return first.diff(second, 'seconds', true);
  }
  /**
   * @param {?} first
   * @param {?} second
   * @return {?}
   */
  sameDate(first, second) {
    if (first == null) {
      // same if both null
      return second == null;
    } else if (isMoment(first)) {
      return first.isSame(second);
    } else {
      /** @type {?} */
      const isSame = super.sameDate(first, second);
      return isSame;
    }
  }
  /**
   * @param {?} date
   * @param {?=} min
   * @param {?=} max
   * @return {?}
   */
  clampDate(date, min, max) {
    if (min && date.isBefore(min)) {
      return min;
    } else if (max && date.isAfter(max)) {
      return max;
    } else {
      return date;
    }
  }
  /**
   * @param {?} date
   * @return {?}
   */
  isDateInstance(date) {
    /** @type {?} */
    let isValidDateInstance = false;
    if (date) {
      isValidDateInstance = date._isAMomentObject;
    }
    return isValidDateInstance;
  }
  /**
   * @param {?} date
   * @return {?}
   */
  isValid(date) {
    return date.isValid();
  }
  /**
   * @param {?} date
   * @return {?}
   */
  toIso8601(date) {
    return this.clone(date).format();
  }
  /**
   * @param {?} iso8601String
   * @return {?}
   */
  fromIso8601(iso8601String) {
    /** @type {?} */
    const locale = this.locale || 'en';
    /** @type {?} */
    const d = moment(iso8601String, moment.ISO_8601).locale(locale);
    return this.isValid(d) ? d : null;
  }
  /**
   * @return {?}
   */
  invalid() {
    return moment.invalid();
  }
}
if (false) {
  /**
   * @type {?}
   * @private
   */
  MomentDateAdapter.prototype.localeData;
  /** @type {?} */
  MomentDateAdapter.prototype.overrideDisplayFormat;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9tZW50LWRhdGUtYWRhcHRlci5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BhbGZyZXNjby9hZGYtY29yZS8iLCJzb3VyY2VzIjpbInV0aWxzL21vbWVudC1kYXRlLWFkYXB0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFpQkEsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBQ2hELE9BQU8sRUFBRSxRQUFRLEVBQVUsTUFBTSxRQUFRLENBQUM7QUFDMUMsT0FBTyxNQUFNLE1BQU0sWUFBWSxDQUFDO0FBRWhDLE1BQU0sT0FBTyxpQkFBa0IsU0FBUSxXQUFtQjtJQUExRDs7UUFFWSxlQUFVLEdBQVEsTUFBTSxDQUFDLFVBQVUsRUFBRSxDQUFDO0lBa01sRCxDQUFDOzs7OztJQTlMRyxPQUFPLENBQUMsSUFBWTtRQUNoQixPQUFPLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUN2QixDQUFDOzs7OztJQUVELFFBQVEsQ0FBQyxJQUFZO1FBQ2pCLE9BQU8sSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQ3hCLENBQUM7Ozs7O0lBRUQsT0FBTyxDQUFDLElBQVk7UUFDaEIsT0FBTyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDdkIsQ0FBQzs7Ozs7SUFFRCxZQUFZLENBQUMsSUFBWTtRQUNyQixPQUFPLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztJQUN0QixDQUFDOzs7OztJQUVELGFBQWEsQ0FBQyxLQUFrQztRQUM1QyxRQUFRLEtBQUssRUFBRTtZQUNYLEtBQUssTUFBTTtnQkFDUCxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDcEMsS0FBSyxPQUFPO2dCQUNSLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUN6QyxLQUFLLFFBQVE7Z0JBQ1QsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLFdBQVcsRUFBRSxDQUFDLEdBQUc7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LGNBQWMsQ0FBQyxJQUFTOztZQUNoQixtQkFBbUIsR0FBRyxLQUFLO1FBRS9CLElBQUksSUFBSSxFQUFFO1lBQ04sbUJBQW1CLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDO1NBQy9DO1FBRUQsT0FBTyxtQkFBbUIsQ0FBQztJQUMvQixDQUFDOzs7OztJQUVELE9BQU8sQ0FBQyxJQUFZO1FBQ2hCLE9BQU8sSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQzFCLENBQUM7Ozs7O0lBRUQsU0FBUyxDQUFDLElBQVk7UUFDbEIsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDO0lBQ3JDLENBQUM7Ozs7O0lBRUQsV0FBVyxDQUFDLGFBQXFCOztjQUN2QixNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sSUFBSSxJQUFJOztjQUM1QixDQUFDLEdBQUcsTUFBTSxDQUFDLGFBQWEsRUFBRSxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQztRQUMvRCxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO0lBQ3RDLENBQUM7Ozs7SUFFRCxPQUFPO1FBQ0gsT0FBTyxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDNUIsQ0FBQztDQUNKOzs7Ozs7SUFsTUcsdUNBQThDOztJQUU5QyxrREFBOEIiLCJzb3VyY2VzQ29udGVudCI6WyIvKiFcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxOSBBbGZyZXNjbyBTb2Z0d2FyZSwgTHRkLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgeyBEYXRlQWRhcHRlciB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsJztcbmltcG9ydCB7IGlzTW9tZW50LCBNb21lbnQgfSBmcm9tICdtb21lbnQnO1xuaW1wb3J0IG1vbWVudCBmcm9tICdtb21lbnQtZXM2JztcblxuZXhwb3J0IGNsYXNzIE1vbWVudERhdGVBZGFwdGVyIGV4dGVuZHMgRGF0ZUFkYXB0ZXI8TW9tZW50PiB7XG5cbiAgICBwcml2YXRlIGxvY2FsZURhdGE6IGFueSA9IG1vbWVudC5sb2NhbGVEYXRhKCk7XG5cbiAgICBvdmVycmlkZURpc3BsYXlGb3JtYXQ6IHN0cmluZztcblxuICAgIGdldFllYXIoZGF0ZTogTW9tZW50KTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIGRhdGUueWVhcigpO1xuICAgIH1cblxuICAgIGdldE1vbnRoKGRhdGU6IE1vbWVudCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiBkYXRlLm1vbnRoKCk7XG4gICAgfVxuXG4gICAgZ2V0RGF0ZShkYXRlOiBNb21lbnQpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gZGF0ZS5kYXRlKCk7XG4gICAgfVxuXG4gICAgZ2V0RGF5T2ZXZWVrKGRhdGU6IE1vbWVudCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiBkYXRlLmRheSgpO1xuICAgIH1cblxuICAgIGdldE1vbnRoTmFtZXMoc3R5bGU6ICdsb25nJyB8ICdzaG9ydCcgfCAnbmFycm93Jyk6IHN0cmluZ1tdIHtcbiAgICAgICAgc3dpdGNoIChzdHlsZSkge1xuICAgICAgICAgICAgY2FzZSAnbG9uZyc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubG9jYWxlRGF0YS5tb250aHMoKTtcbiAgICAgICAgICAgIGNhc2UgJ3Nob3J0JzpcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5sb2NhbGVEYXRhLm1vbnRoc1Nob3J0KCk7XG4gICAgICAgICAgICBjYXNlICduYXJyb3cnOlxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmxvY2FsZURhdGEubW9udGhzU2hvcnQoKS5tYXAoKG1vbnRoKSA9PiBtb250aFswXSk7XG4gICAgICAgICAgICBkZWZhdWx0IDpcbiAgICAgICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXREYXRlTmFtZXMoKTogc3RyaW5nW10ge1xuICAgICAgICBjb25zdCBkYXRlTmFtZXM6IHN0cmluZ1tdID0gW107XG4gICAgICAgIGZvciAobGV0IGRhdGUgPSAxOyBkYXRlIDw9IDMxOyBkYXRlKyspIHtcbiAgICAgICAgICAgIGRhdGVOYW1lcy5wdXNoKFN0cmluZyhkYXRlKSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZGF0ZU5hbWVzO1xuICAgIH1cblxuICAgIGdldERheU9mV2Vla05hbWVzKHN0eWxlOiAnbG9uZycgfCAnc2hvcnQnIHwgJ25hcnJvdycpOiBzdHJpbmdbXSB7XG4gICAgICAgIHN3aXRjaCAoc3R5bGUpIHtcbiAgICAgICAgICAgIGNhc2UgJ2xvbmcnOlxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmxvY2FsZURhdGEud2Vla2RheXMoKTtcbiAgICAgICAgICAgIGNhc2UgJ3Nob3J0JzpcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5sb2NhbGVEYXRhLndlZWtkYXlzU2hvcnQoKTtcbiAgICAgICAgICAgIGNhc2UgJ25hcnJvdyc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubG9jYWxlRGF0YS53ZWVrZGF5c1Nob3J0KCk7XG4gICAgICAgICAgICBkZWZhdWx0IDpcbiAgICAgICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRZZWFyTmFtZShkYXRlOiBNb21lbnQpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gU3RyaW5nKGRhdGUueWVhcigpKTtcbiAgICB9XG5cbiAgICBnZXRGaXJzdERheU9mV2VlaygpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5sb2NhbGVEYXRhLmZpcnN0RGF5T2ZXZWVrKCk7XG4gICAgfVxuXG4gICAgZ2V0TnVtRGF5c0luTW9udGgoZGF0ZTogTW9tZW50KTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIGRhdGUuZGF5c0luTW9udGgoKTtcbiAgICB9XG5cbiAgICBjbG9uZShkYXRlOiBNb21lbnQpOiBNb21lbnQge1xuICAgICAgICBjb25zdCBsb2NhbGUgPSB0aGlzLmxvY2FsZSB8fCAnZW4nO1xuICAgICAgICByZXR1cm4gZGF0ZS5jbG9uZSgpLmxvY2FsZShsb2NhbGUpO1xuICAgIH1cblxuICAgIGNyZWF0ZURhdGUoeWVhcjogbnVtYmVyLCBtb250aDogbnVtYmVyLCBkYXRlOiBudW1iZXIpOiBNb21lbnQge1xuICAgICAgICByZXR1cm4gbW9tZW50KFt5ZWFyLCBtb250aCwgZGF0ZV0pO1xuICAgIH1cblxuICAgIHRvZGF5KCk6IE1vbWVudCB7XG4gICAgICAgIGNvbnN0IGxvY2FsZSA9IHRoaXMubG9jYWxlIHx8ICdlbic7XG4gICAgICAgIHJldHVybiBtb21lbnQoKS5sb2NhbGUobG9jYWxlKTtcbiAgICB9XG5cbiAgICBwYXJzZSh2YWx1ZTogYW55LCBwYXJzZUZvcm1hdDogYW55KTogTW9tZW50IHtcbiAgICAgICAgY29uc3QgbG9jYWxlID0gdGhpcy5sb2NhbGUgfHwgJ2VuJztcblxuICAgICAgICBpZiAodmFsdWUgJiYgdHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgbGV0IG0gPSBtb21lbnQodmFsdWUsIHBhcnNlRm9ybWF0LCBsb2NhbGUsIHRydWUpO1xuICAgICAgICAgICAgaWYgKCFtLmlzVmFsaWQoKSkge1xuICAgICAgICAgICAgICAgIC8vIHVzZSBzdHJpY3QgcGFyc2luZyBiZWNhdXNlIE1vbWVudCdzIHBhcnNlciBpcyB2ZXJ5IGZvcmdpdmluZywgYW5kIHRoaXMgY2FuIGxlYWQgdG8gdW5kZXNpcmVkIGJlaGF2aW9yLlxuICAgICAgICAgICAgICAgIG0gPSBtb21lbnQodmFsdWUsIHRoaXMub3ZlcnJpZGVEaXNwbGF5Rm9ybWF0LCBsb2NhbGUsIHRydWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG0uaXNWYWxpZCgpKSB7XG4gICAgICAgICAgICAgICAgLy8gaWYgdXNlciBvbWl0cyB5ZWFyLCBpdCBkZWZhdWx0cyB0byAyMDAxLCBzbyBjaGVjayBmb3IgdGhhdCBpc3N1ZS5cbiAgICAgICAgICAgICAgICBpZiAobS55ZWFyKCkgPT09IDIwMDEgJiYgdmFsdWUuaW5kZXhPZignMjAwMScpID09PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBpZiAyMDAxIG5vdCBhY3R1YWxseSBpbiB0aGUgdmFsdWUgc3RyaW5nLCBjaGFuZ2UgdG8gY3VycmVudCB5ZWFyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRZZWFyID0gbmV3IERhdGUoKS5nZXRGdWxsWWVhcigpO1xuICAgICAgICAgICAgICAgICAgICBtLnNldCgneWVhcicsIGN1cnJlbnRZZWFyKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gaWYgZGF0ZSBpcyBpbiB0aGUgZnV0dXJlLCBzZXQgcHJldmlvdXMgeWVhclxuICAgICAgICAgICAgICAgICAgICBpZiAobS5pc0FmdGVyKG1vbWVudCgpKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbS5zZXQoJ3llYXInLCBjdXJyZW50WWVhciAtIDEpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG07XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdmFsdWUgPyBtb21lbnQodmFsdWUpLmxvY2FsZShsb2NhbGUpIDogbnVsbDtcbiAgICB9XG5cbiAgICBmb3JtYXQoZGF0ZTogTW9tZW50LCBkaXNwbGF5Rm9ybWF0OiBhbnkpOiBzdHJpbmcge1xuICAgICAgICBkYXRlID0gdGhpcy5jbG9uZShkYXRlKTtcbiAgICAgICAgZGlzcGxheUZvcm1hdCA9IHRoaXMub3ZlcnJpZGVEaXNwbGF5Rm9ybWF0ID8gdGhpcy5vdmVycmlkZURpc3BsYXlGb3JtYXQgOiBkaXNwbGF5Rm9ybWF0O1xuXG4gICAgICAgIGlmIChkYXRlICYmIGRhdGUuZm9ybWF0KSB7XG4gICAgICAgICAgICByZXR1cm4gZGF0ZS5mb3JtYXQoZGlzcGxheUZvcm1hdCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhZGRDYWxlbmRhclllYXJzKGRhdGU6IE1vbWVudCwgeWVhcnM6IG51bWJlcik6IE1vbWVudCB7XG4gICAgICAgIHJldHVybiBkYXRlLmNsb25lKCkuYWRkKHllYXJzLCAneScpO1xuICAgIH1cblxuICAgIGFkZENhbGVuZGFyTW9udGhzKGRhdGU6IE1vbWVudCwgbW9udGhzOiBudW1iZXIpOiBNb21lbnQge1xuICAgICAgICByZXR1cm4gZGF0ZS5jbG9uZSgpLmFkZChtb250aHMsICdNJyk7XG4gICAgfVxuXG4gICAgYWRkQ2FsZW5kYXJEYXlzKGRhdGU6IE1vbWVudCwgZGF5czogbnVtYmVyKTogTW9tZW50IHtcbiAgICAgICAgcmV0dXJuIGRhdGUuY2xvbmUoKS5hZGQoZGF5cywgJ2QnKTtcbiAgICB9XG5cbiAgICBnZXRJU09EYXRlU3RyaW5nKGRhdGU6IE1vbWVudCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiBkYXRlLnRvSVNPU3RyaW5nKCk7XG4gICAgfVxuXG4gICAgc2V0TG9jYWxlKGxvY2FsZTogYW55KTogdm9pZCB7XG4gICAgICAgIHN1cGVyLnNldExvY2FsZShsb2NhbGUpO1xuXG4gICAgICAgIHRoaXMubG9jYWxlRGF0YSA9IG1vbWVudC5sb2NhbGVEYXRhKGxvY2FsZSk7XG4gICAgfVxuXG4gICAgY29tcGFyZURhdGUoZmlyc3Q6IE1vbWVudCwgc2Vjb25kOiBNb21lbnQpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gZmlyc3QuZGlmZihzZWNvbmQsICdzZWNvbmRzJywgdHJ1ZSk7XG4gICAgfVxuXG4gICAgc2FtZURhdGUoZmlyc3Q6IGFueSB8IE1vbWVudCwgc2Vjb25kOiBhbnkgfCBNb21lbnQpOiBib29sZWFuIHtcbiAgICAgICAgaWYgKGZpcnN0ID09IG51bGwpIHtcbiAgICAgICAgICAgIC8vIHNhbWUgaWYgYm90aCBudWxsXG4gICAgICAgICAgICByZXR1cm4gc2Vjb25kID09IG51bGw7XG4gICAgICAgIH0gZWxzZSBpZiAoaXNNb21lbnQoZmlyc3QpKSB7XG4gICAgICAgICAgICByZXR1cm4gZmlyc3QuaXNTYW1lKHNlY29uZCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBpc1NhbWUgPSBzdXBlci5zYW1lRGF0ZShmaXJzdCwgc2Vjb25kKTtcbiAgICAgICAgICAgIHJldHVybiBpc1NhbWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjbGFtcERhdGUoZGF0ZTogTW9tZW50LCBtaW4/OiBhbnkgfCBNb21lbnQsIG1heD86IGFueSB8IE1vbWVudCk6IE1vbWVudCB7XG4gICAgICAgIGlmIChtaW4gJiYgZGF0ZS5pc0JlZm9yZShtaW4pKSB7XG4gICAgICAgICAgICByZXR1cm4gbWluO1xuICAgICAgICB9IGVsc2UgaWYgKG1heCAmJiBkYXRlLmlzQWZ0ZXIobWF4KSkge1xuICAgICAgICAgICAgcmV0dXJuIG1heDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBkYXRlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaXNEYXRlSW5zdGFuY2UoZGF0ZTogYW55KSB7XG4gICAgICAgIGxldCBpc1ZhbGlkRGF0ZUluc3RhbmNlID0gZmFsc2U7XG5cbiAgICAgICAgaWYgKGRhdGUpIHtcbiAgICAgICAgICAgIGlzVmFsaWREYXRlSW5zdGFuY2UgPSBkYXRlLl9pc0FNb21lbnRPYmplY3Q7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gaXNWYWxpZERhdGVJbnN0YW5jZTtcbiAgICB9XG5cbiAgICBpc1ZhbGlkKGRhdGU6IE1vbWVudCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gZGF0ZS5pc1ZhbGlkKCk7XG4gICAgfVxuXG4gICAgdG9Jc284NjAxKGRhdGU6IE1vbWVudCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLmNsb25lKGRhdGUpLmZvcm1hdCgpO1xuICAgIH1cblxuICAgIGZyb21Jc284NjAxKGlzbzg2MDFTdHJpbmc6IHN0cmluZyk6IE1vbWVudCB8IG51bGwge1xuICAgICAgICBjb25zdCBsb2NhbGUgPSB0aGlzLmxvY2FsZSB8fCAnZW4nO1xuICAgICAgICBjb25zdCBkID0gbW9tZW50KGlzbzg2MDFTdHJpbmcsIG1vbWVudC5JU09fODYwMSkubG9jYWxlKGxvY2FsZSk7XG4gICAgICAgIHJldHVybiB0aGlzLmlzVmFsaWQoZCkgPyBkIDogbnVsbDtcbiAgICB9XG5cbiAgICBpbnZhbGlkKCk6IE1vbWVudCB7XG4gICAgICAgIHJldHVybiBtb21lbnQuaW52YWxpZCgpO1xuICAgIH1cbn1cbiJdfQ==
