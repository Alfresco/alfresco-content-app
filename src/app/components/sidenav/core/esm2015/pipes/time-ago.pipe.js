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
import moment from 'moment-es6';
import { Pipe } from '@angular/core';
import { AppConfigService } from '../app-config/app-config.service';
import {
  UserPreferenceValues,
  UserPreferencesService
} from '../services/user-preferences.service';
import { DatePipe } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
export class TimeAgoPipe {
  /**
   * @param {?} userPreferenceService
   * @param {?} appConfig
   */
  constructor(userPreferenceService, appConfig) {
    this.userPreferenceService = userPreferenceService;
    this.appConfig = appConfig;
    this.onDestroy$ = new Subject();
    this.userPreferenceService
      .select(UserPreferenceValues.Locale)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(
        /**
         * @param {?} locale
         * @return {?}
         */
        locale => {
          this.defaultLocale = locale || TimeAgoPipe.DEFAULT_LOCALE;
        }
      );
    this.defaultDateTimeFormat = this.appConfig.get(
      'dateValues.defaultDateTimeFormat',
      TimeAgoPipe.DEFAULT_DATE_TIME_FORMAT
    );
  }
  /**
   * @param {?} value
   * @param {?=} locale
   * @return {?}
   */
  transform(value, locale) {
    if (value !== null && value !== undefined) {
      /** @type {?} */
      const actualLocale = locale || this.defaultLocale;
      /** @type {?} */
      const then = moment(value);
      /** @type {?} */
      const diff = moment()
        .locale(actualLocale)
        .diff(then, 'days');
      if (diff > 7) {
        /** @type {?} */
        const datePipe = new DatePipe(actualLocale);
        return datePipe.transform(value, this.defaultDateTimeFormat);
      } else {
        return then.locale(actualLocale).fromNow();
      }
    }
    return '';
  }
  /**
   * @return {?}
   */
  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }
}
TimeAgoPipe.DEFAULT_LOCALE = 'en-US';
TimeAgoPipe.DEFAULT_DATE_TIME_FORMAT = 'dd/MM/yyyy HH:mm';
TimeAgoPipe.decorators = [
  {
    type: Pipe,
    args: [
      {
        name: 'adfTimeAgo'
      }
    ]
  }
];
/** @nocollapse */
TimeAgoPipe.ctorParameters = () => [
  { type: UserPreferencesService },
  { type: AppConfigService }
];
if (false) {
  /** @type {?} */
  TimeAgoPipe.DEFAULT_LOCALE;
  /** @type {?} */
  TimeAgoPipe.DEFAULT_DATE_TIME_FORMAT;
  /** @type {?} */
  TimeAgoPipe.prototype.defaultLocale;
  /** @type {?} */
  TimeAgoPipe.prototype.defaultDateTimeFormat;
  /**
   * @type {?}
   * @private
   */
  TimeAgoPipe.prototype.onDestroy$;
  /** @type {?} */
  TimeAgoPipe.prototype.userPreferenceService;
  /** @type {?} */
  TimeAgoPipe.prototype.appConfig;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGltZS1hZ28ucGlwZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BhbGZyZXNjby9hZGYtY29yZS8iLCJzb3VyY2VzIjpbInBpcGVzL3RpbWUtYWdvLnBpcGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFpQkEsT0FBTyxNQUFNLE1BQU0sWUFBWSxDQUFDO0FBQ2hDLE9BQU8sRUFBRSxJQUFJLEVBQTRCLE1BQU0sZUFBZSxDQUFDO0FBQy9ELE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLGtDQUFrQyxDQUFDO0FBQ3BFLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxzQkFBc0IsRUFBRSxNQUFNLHNDQUFzQyxDQUFDO0FBQ3BHLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMzQyxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQy9CLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUszQyxNQUFNLE9BQU8sV0FBVzs7Ozs7SUFVcEIsWUFBbUIscUJBQTZDLEVBQzdDLFNBQTJCO1FBRDNCLDBCQUFxQixHQUFyQixxQkFBcUIsQ0FBd0I7UUFDN0MsY0FBUyxHQUFULFNBQVMsQ0FBa0I7UUFIdEMsZUFBVSxHQUFHLElBQUksT0FBTyxFQUFXLENBQUM7UUFJeEMsSUFBSSxDQUFDLHFCQUFxQjthQUNyQixNQUFNLENBQUMsb0JBQW9CLENBQUMsTUFBTSxDQUFDO2FBQ25DLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO2FBQ2hDLFNBQVM7Ozs7UUFBQyxNQUFNLENBQUMsRUFBRTtZQUNoQixJQUFJLENBQUMsYUFBYSxHQUFHLE1BQU0sSUFBSSxXQUFXLENBQUMsY0FBYyxDQUFDO1FBQzlELENBQUMsRUFBQyxDQUFDO1FBQ1AsSUFBSSxDQUFDLHFCQUFxQixHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFTLGtDQUFrQyxFQUFFLFdBQVcsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO0lBQ3RJLENBQUM7Ozs7OztJQUVELFNBQVMsQ0FBQyxLQUFXLEVBQUUsTUFBZTtRQUNsQyxJQUFJLEtBQUssS0FBSyxJQUFJLElBQUksS0FBSyxLQUFLLFNBQVMsRUFBRzs7a0JBQ2xDLFlBQVksR0FBRyxNQUFNLElBQUksSUFBSSxDQUFDLGFBQWE7O2tCQUMzQyxJQUFJLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQzs7a0JBQ3BCLElBQUksR0FBRyxNQUFNLEVBQUUsQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxNQUFNLENBQUM7WUFDN0QsSUFBSyxJQUFJLEdBQUcsQ0FBQyxFQUFFOztzQkFDTCxRQUFRLEdBQWEsSUFBSSxRQUFRLENBQUMsWUFBWSxDQUFDO2dCQUNyRCxPQUFPLFFBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO2FBQ2hFO2lCQUFNO2dCQUNILE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQzthQUM5QztTQUNKO1FBQ0QsT0FBTyxFQUFFLENBQUM7SUFDZCxDQUFDOzs7O0lBRUQsV0FBVztRQUNQLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzNCLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDL0IsQ0FBQzs7QUFyQ00sMEJBQWMsR0FBRyxPQUFPLENBQUM7QUFDekIsb0NBQXdCLEdBQUcsa0JBQWtCLENBQUM7O1lBTnhELElBQUksU0FBQztnQkFDRixJQUFJLEVBQUUsWUFBWTthQUNyQjs7OztZQVA4QixzQkFBc0I7WUFENUMsZ0JBQWdCOzs7O0lBV3JCLDJCQUFnQzs7SUFDaEMscUNBQXFEOztJQUVyRCxvQ0FBc0I7O0lBQ3RCLDRDQUE4Qjs7Ozs7SUFFOUIsaUNBQTRDOztJQUVoQyw0Q0FBb0Q7O0lBQ3BELGdDQUFrQyIsInNvdXJjZXNDb250ZW50IjpbIi8qIVxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE5IEFsZnJlc2NvIFNvZnR3YXJlLCBMdGQuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbmltcG9ydCBtb21lbnQgZnJvbSAnbW9tZW50LWVzNic7XG5pbXBvcnQgeyBQaXBlLCBQaXBlVHJhbnNmb3JtLCBPbkRlc3Ryb3kgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEFwcENvbmZpZ1NlcnZpY2UgfSBmcm9tICcuLi9hcHAtY29uZmlnL2FwcC1jb25maWcuc2VydmljZSc7XG5pbXBvcnQgeyBVc2VyUHJlZmVyZW5jZVZhbHVlcywgVXNlclByZWZlcmVuY2VzU2VydmljZSB9IGZyb20gJy4uL3NlcnZpY2VzL3VzZXItcHJlZmVyZW5jZXMuc2VydmljZSc7XG5pbXBvcnQgeyBEYXRlUGlwZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyB0YWtlVW50aWwgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbkBQaXBlKHtcbiAgICBuYW1lOiAnYWRmVGltZUFnbydcbn0pXG5leHBvcnQgY2xhc3MgVGltZUFnb1BpcGUgaW1wbGVtZW50cyBQaXBlVHJhbnNmb3JtLCBPbkRlc3Ryb3kge1xuXG4gICAgc3RhdGljIERFRkFVTFRfTE9DQUxFID0gJ2VuLVVTJztcbiAgICBzdGF0aWMgREVGQVVMVF9EQVRFX1RJTUVfRk9STUFUID0gJ2RkL01NL3l5eXkgSEg6bW0nO1xuXG4gICAgZGVmYXVsdExvY2FsZTogc3RyaW5nO1xuICAgIGRlZmF1bHREYXRlVGltZUZvcm1hdDogc3RyaW5nO1xuXG4gICAgcHJpdmF0ZSBvbkRlc3Ryb3kkID0gbmV3IFN1YmplY3Q8Ym9vbGVhbj4oKTtcblxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyB1c2VyUHJlZmVyZW5jZVNlcnZpY2U6IFVzZXJQcmVmZXJlbmNlc1NlcnZpY2UsXG4gICAgICAgICAgICAgICAgcHVibGljIGFwcENvbmZpZzogQXBwQ29uZmlnU2VydmljZSkge1xuICAgICAgICB0aGlzLnVzZXJQcmVmZXJlbmNlU2VydmljZVxuICAgICAgICAgICAgLnNlbGVjdChVc2VyUHJlZmVyZW5jZVZhbHVlcy5Mb2NhbGUpXG4gICAgICAgICAgICAucGlwZSh0YWtlVW50aWwodGhpcy5vbkRlc3Ryb3kkKSlcbiAgICAgICAgICAgIC5zdWJzY3JpYmUobG9jYWxlID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmRlZmF1bHRMb2NhbGUgPSBsb2NhbGUgfHwgVGltZUFnb1BpcGUuREVGQVVMVF9MT0NBTEU7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5kZWZhdWx0RGF0ZVRpbWVGb3JtYXQgPSB0aGlzLmFwcENvbmZpZy5nZXQ8c3RyaW5nPignZGF0ZVZhbHVlcy5kZWZhdWx0RGF0ZVRpbWVGb3JtYXQnLCBUaW1lQWdvUGlwZS5ERUZBVUxUX0RBVEVfVElNRV9GT1JNQVQpO1xuICAgIH1cblxuICAgIHRyYW5zZm9ybSh2YWx1ZTogRGF0ZSwgbG9jYWxlPzogc3RyaW5nKSB7XG4gICAgICAgIGlmICh2YWx1ZSAhPT0gbnVsbCAmJiB2YWx1ZSAhPT0gdW5kZWZpbmVkICkge1xuICAgICAgICAgICAgY29uc3QgYWN0dWFsTG9jYWxlID0gbG9jYWxlIHx8IHRoaXMuZGVmYXVsdExvY2FsZTtcbiAgICAgICAgICAgIGNvbnN0IHRoZW4gPSBtb21lbnQodmFsdWUpO1xuICAgICAgICAgICAgY29uc3QgZGlmZiA9IG1vbWVudCgpLmxvY2FsZShhY3R1YWxMb2NhbGUpLmRpZmYodGhlbiwgJ2RheXMnKTtcbiAgICAgICAgICAgIGlmICggZGlmZiA+IDcpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBkYXRlUGlwZTogRGF0ZVBpcGUgPSBuZXcgRGF0ZVBpcGUoYWN0dWFsTG9jYWxlKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGF0ZVBpcGUudHJhbnNmb3JtKHZhbHVlLCB0aGlzLmRlZmF1bHREYXRlVGltZUZvcm1hdCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGVuLmxvY2FsZShhY3R1YWxMb2NhbGUpLmZyb21Ob3coKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gJyc7XG4gICAgfVxuXG4gICAgbmdPbkRlc3Ryb3koKSB7XG4gICAgICAgIHRoaXMub25EZXN0cm95JC5uZXh0KHRydWUpO1xuICAgICAgICB0aGlzLm9uRGVzdHJveSQuY29tcGxldGUoKTtcbiAgICB9XG59XG4iXX0=
