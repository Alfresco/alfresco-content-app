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
import { DatePipe } from '@angular/common';
import { Pipe } from '@angular/core';
import { AppConfigService } from '../app-config/app-config.service';
import {
  UserPreferencesService,
  UserPreferenceValues
} from '../services/user-preferences.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
export class LocalizedDatePipe {
  /**
   * @param {?=} userPreferenceService
   * @param {?=} appConfig
   */
  constructor(userPreferenceService, appConfig) {
    this.userPreferenceService = userPreferenceService;
    this.appConfig = appConfig;
    this.defaultLocale = LocalizedDatePipe.DEFAULT_LOCALE;
    this.defaultFormat = LocalizedDatePipe.DEFAULT_DATE_FORMAT;
    this.onDestroy$ = new Subject();
    if (this.userPreferenceService) {
      this.userPreferenceService
        .select(UserPreferenceValues.Locale)
        .pipe(takeUntil(this.onDestroy$))
        .subscribe(
          /**
           * @param {?} locale
           * @return {?}
           */
          locale => {
            if (locale) {
              this.defaultLocale = locale;
            }
          }
        );
    }
    if (this.appConfig) {
      this.defaultFormat = this.appConfig.get(
        'dateValues.defaultDateFormat',
        LocalizedDatePipe.DEFAULT_DATE_FORMAT
      );
    }
  }
  /**
   * @param {?} value
   * @param {?=} format
   * @param {?=} locale
   * @return {?}
   */
  transform(value, format, locale) {
    /** @type {?} */
    const actualFormat = format || this.defaultFormat;
    /** @type {?} */
    const actualLocale = locale || this.defaultLocale;
    /** @type {?} */
    const datePipe = new DatePipe(actualLocale);
    return datePipe.transform(value, actualFormat);
  }
  /**
   * @return {?}
   */
  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }
}
LocalizedDatePipe.DEFAULT_LOCALE = 'en-US';
LocalizedDatePipe.DEFAULT_DATE_FORMAT = 'mediumDate';
LocalizedDatePipe.decorators = [
  {
    type: Pipe,
    args: [
      {
        name: 'adfLocalizedDate',
        pure: false
      }
    ]
  }
];
/** @nocollapse */
LocalizedDatePipe.ctorParameters = () => [
  { type: UserPreferencesService },
  { type: AppConfigService }
];
if (false) {
  /** @type {?} */
  LocalizedDatePipe.DEFAULT_LOCALE;
  /** @type {?} */
  LocalizedDatePipe.DEFAULT_DATE_FORMAT;
  /** @type {?} */
  LocalizedDatePipe.prototype.defaultLocale;
  /** @type {?} */
  LocalizedDatePipe.prototype.defaultFormat;
  /**
   * @type {?}
   * @private
   */
  LocalizedDatePipe.prototype.onDestroy$;
  /** @type {?} */
  LocalizedDatePipe.prototype.userPreferenceService;
  /** @type {?} */
  LocalizedDatePipe.prototype.appConfig;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9jYWxpemVkLWRhdGUucGlwZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BhbGZyZXNjby9hZGYtY29yZS8iLCJzb3VyY2VzIjpbInBpcGVzL2xvY2FsaXplZC1kYXRlLnBpcGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFpQkEsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQzNDLE9BQU8sRUFBRSxJQUFJLEVBQTRCLE1BQU0sZUFBZSxDQUFDO0FBQy9ELE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLGtDQUFrQyxDQUFDO0FBQ3BFLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxvQkFBb0IsRUFBRSxNQUFNLHNDQUFzQyxDQUFDO0FBQ3BHLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDL0IsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBTTNDLE1BQU0sT0FBTyxpQkFBaUI7Ozs7O0lBVTFCLFlBQW1CLHFCQUE4QyxFQUM5QyxTQUE0QjtRQUQ1QiwwQkFBcUIsR0FBckIscUJBQXFCLENBQXlCO1FBQzlDLGNBQVMsR0FBVCxTQUFTLENBQW1CO1FBTi9DLGtCQUFhLEdBQVcsaUJBQWlCLENBQUMsY0FBYyxDQUFDO1FBQ3pELGtCQUFhLEdBQVcsaUJBQWlCLENBQUMsbUJBQW1CLENBQUM7UUFFdEQsZUFBVSxHQUFHLElBQUksT0FBTyxFQUFXLENBQUM7UUFLeEMsSUFBSSxJQUFJLENBQUMscUJBQXFCLEVBQUU7WUFDNUIsSUFBSSxDQUFDLHFCQUFxQjtpQkFDckIsTUFBTSxDQUFDLG9CQUFvQixDQUFDLE1BQU0sQ0FBQztpQkFDbkMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7aUJBQ2hDLFNBQVM7Ozs7WUFBQyxNQUFNLENBQUMsRUFBRTtnQkFDaEIsSUFBSSxNQUFNLEVBQUU7b0JBQ1IsSUFBSSxDQUFDLGFBQWEsR0FBRyxNQUFNLENBQUM7aUJBQy9CO1lBQ0wsQ0FBQyxFQUFDLENBQUM7U0FDVjtRQUVELElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUNoQixJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFTLDhCQUE4QixFQUFFLGlCQUFpQixDQUFDLG1CQUFtQixDQUFDLENBQUM7U0FDMUg7SUFDTCxDQUFDOzs7Ozs7O0lBRUQsU0FBUyxDQUFDLEtBQVUsRUFBRSxNQUFlLEVBQUUsTUFBZTs7Y0FDNUMsWUFBWSxHQUFHLE1BQU0sSUFBSSxJQUFJLENBQUMsYUFBYTs7Y0FDM0MsWUFBWSxHQUFHLE1BQU0sSUFBSSxJQUFJLENBQUMsYUFBYTs7Y0FDM0MsUUFBUSxHQUFhLElBQUksUUFBUSxDQUFDLFlBQVksQ0FBQztRQUNyRCxPQUFPLFFBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLFlBQVksQ0FBQyxDQUFDO0lBQ25ELENBQUM7Ozs7SUFFRCxXQUFXO1FBQ1AsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDM0IsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUMvQixDQUFDOztBQXJDTSxnQ0FBYyxHQUFHLE9BQU8sQ0FBQztBQUN6QixxQ0FBbUIsR0FBRyxZQUFZLENBQUM7O1lBUDdDLElBQUksU0FBQztnQkFDRixJQUFJLEVBQUUsa0JBQWtCO2dCQUN4QixJQUFJLEVBQUUsS0FBSzthQUNkOzs7O1lBUFEsc0JBQXNCO1lBRHRCLGdCQUFnQjs7OztJQVdyQixpQ0FBZ0M7O0lBQ2hDLHNDQUEwQzs7SUFFMUMsMENBQXlEOztJQUN6RCwwQ0FBOEQ7Ozs7O0lBRTlELHVDQUE0Qzs7SUFFaEMsa0RBQXFEOztJQUNyRCxzQ0FBbUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiFcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxOSBBbGZyZXNjbyBTb2Z0d2FyZSwgTHRkLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgeyBEYXRlUGlwZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBQaXBlLCBQaXBlVHJhbnNmb3JtLCBPbkRlc3Ryb3kgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEFwcENvbmZpZ1NlcnZpY2UgfSBmcm9tICcuLi9hcHAtY29uZmlnL2FwcC1jb25maWcuc2VydmljZSc7XG5pbXBvcnQgeyBVc2VyUHJlZmVyZW5jZXNTZXJ2aWNlLCBVc2VyUHJlZmVyZW5jZVZhbHVlcyB9IGZyb20gJy4uL3NlcnZpY2VzL3VzZXItcHJlZmVyZW5jZXMuc2VydmljZSc7XG5pbXBvcnQgeyBTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyB0YWtlVW50aWwgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbkBQaXBlKHtcbiAgICBuYW1lOiAnYWRmTG9jYWxpemVkRGF0ZScsXG4gICAgcHVyZTogZmFsc2Vcbn0pXG5leHBvcnQgY2xhc3MgTG9jYWxpemVkRGF0ZVBpcGUgaW1wbGVtZW50cyBQaXBlVHJhbnNmb3JtLCBPbkRlc3Ryb3kge1xuXG4gICAgc3RhdGljIERFRkFVTFRfTE9DQUxFID0gJ2VuLVVTJztcbiAgICBzdGF0aWMgREVGQVVMVF9EQVRFX0ZPUk1BVCA9ICdtZWRpdW1EYXRlJztcblxuICAgIGRlZmF1bHRMb2NhbGU6IHN0cmluZyA9IExvY2FsaXplZERhdGVQaXBlLkRFRkFVTFRfTE9DQUxFO1xuICAgIGRlZmF1bHRGb3JtYXQ6IHN0cmluZyA9IExvY2FsaXplZERhdGVQaXBlLkRFRkFVTFRfREFURV9GT1JNQVQ7XG5cbiAgICBwcml2YXRlIG9uRGVzdHJveSQgPSBuZXcgU3ViamVjdDxib29sZWFuPigpO1xuXG4gICAgY29uc3RydWN0b3IocHVibGljIHVzZXJQcmVmZXJlbmNlU2VydmljZT86IFVzZXJQcmVmZXJlbmNlc1NlcnZpY2UsXG4gICAgICAgICAgICAgICAgcHVibGljIGFwcENvbmZpZz86IEFwcENvbmZpZ1NlcnZpY2UpIHtcblxuICAgICAgICBpZiAodGhpcy51c2VyUHJlZmVyZW5jZVNlcnZpY2UpIHtcbiAgICAgICAgICAgIHRoaXMudXNlclByZWZlcmVuY2VTZXJ2aWNlXG4gICAgICAgICAgICAgICAgLnNlbGVjdChVc2VyUHJlZmVyZW5jZVZhbHVlcy5Mb2NhbGUpXG4gICAgICAgICAgICAgICAgLnBpcGUodGFrZVVudGlsKHRoaXMub25EZXN0cm95JCkpXG4gICAgICAgICAgICAgICAgLnN1YnNjcmliZShsb2NhbGUgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAobG9jYWxlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRlZmF1bHRMb2NhbGUgPSBsb2NhbGU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmFwcENvbmZpZykge1xuICAgICAgICAgICAgdGhpcy5kZWZhdWx0Rm9ybWF0ID0gdGhpcy5hcHBDb25maWcuZ2V0PHN0cmluZz4oJ2RhdGVWYWx1ZXMuZGVmYXVsdERhdGVGb3JtYXQnLCBMb2NhbGl6ZWREYXRlUGlwZS5ERUZBVUxUX0RBVEVfRk9STUFUKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHRyYW5zZm9ybSh2YWx1ZTogYW55LCBmb3JtYXQ/OiBzdHJpbmcsIGxvY2FsZT86IHN0cmluZyk6IGFueSB7XG4gICAgICAgIGNvbnN0IGFjdHVhbEZvcm1hdCA9IGZvcm1hdCB8fCB0aGlzLmRlZmF1bHRGb3JtYXQ7XG4gICAgICAgIGNvbnN0IGFjdHVhbExvY2FsZSA9IGxvY2FsZSB8fCB0aGlzLmRlZmF1bHRMb2NhbGU7XG4gICAgICAgIGNvbnN0IGRhdGVQaXBlOiBEYXRlUGlwZSA9IG5ldyBEYXRlUGlwZShhY3R1YWxMb2NhbGUpO1xuICAgICAgICByZXR1cm4gZGF0ZVBpcGUudHJhbnNmb3JtKHZhbHVlLCBhY3R1YWxGb3JtYXQpO1xuICAgIH1cblxuICAgIG5nT25EZXN0cm95KCkge1xuICAgICAgICB0aGlzLm9uRGVzdHJveSQubmV4dCh0cnVlKTtcbiAgICAgICAgdGhpcy5vbkRlc3Ryb3kkLmNvbXBsZXRlKCk7XG4gICAgfVxuXG59XG4iXX0=
