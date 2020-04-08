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
import { DecimalPipe } from '@angular/common';
import { Pipe } from '@angular/core';
import { AppConfigService } from '../app-config/app-config.service';
import {
  UserPreferencesService,
  UserPreferenceValues
} from '../services/user-preferences.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
export class DecimalNumberPipe {
  /**
   * @param {?=} userPreferenceService
   * @param {?=} appConfig
   */
  constructor(userPreferenceService, appConfig) {
    this.userPreferenceService = userPreferenceService;
    this.appConfig = appConfig;
    this.defaultLocale = DecimalNumberPipe.DEFAULT_LOCALE;
    this.defaultMinIntegerDigits = DecimalNumberPipe.DEFAULT_MIN_INTEGER_DIGITS;
    this.defaultMinFractionDigits =
      DecimalNumberPipe.DEFAULT_MIN_FRACTION_DIGITS;
    this.defaultMaxFractionDigits =
      DecimalNumberPipe.DEFAULT_MAX_FRACTION_DIGITS;
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
      this.defaultMinIntegerDigits = this.appConfig.get(
        'decimalValues.minIntegerDigits',
        DecimalNumberPipe.DEFAULT_MIN_INTEGER_DIGITS
      );
      this.defaultMinFractionDigits = this.appConfig.get(
        'decimalValues.minFractionDigits',
        DecimalNumberPipe.DEFAULT_MIN_FRACTION_DIGITS
      );
      this.defaultMaxFractionDigits = this.appConfig.get(
        'decimalValues.maxFractionDigits',
        DecimalNumberPipe.DEFAULT_MAX_FRACTION_DIGITS
      );
    }
  }
  /**
   * @param {?} value
   * @param {?=} digitsInfo
   * @param {?=} locale
   * @return {?}
   */
  transform(value, digitsInfo, locale) {
    /** @type {?} */
    const actualMinIntegerDigits =
      digitsInfo && digitsInfo.minIntegerDigits
        ? digitsInfo.minIntegerDigits
        : this.defaultMinIntegerDigits;
    /** @type {?} */
    const actualMinFractionDigits =
      digitsInfo && digitsInfo.minFractionDigits
        ? digitsInfo.minFractionDigits
        : this.defaultMinFractionDigits;
    /** @type {?} */
    const actualMaxFractionDigits =
      digitsInfo && digitsInfo.maxFractionDigits
        ? digitsInfo.maxFractionDigits
        : this.defaultMaxFractionDigits;
    /** @type {?} */
    const actualDigitsInfo = `${actualMinIntegerDigits}.${actualMinFractionDigits}-${actualMaxFractionDigits}`;
    /** @type {?} */
    const actualLocale = locale || this.defaultLocale;
    /** @type {?} */
    const datePipe = new DecimalPipe(actualLocale);
    return datePipe.transform(value, actualDigitsInfo);
  }
  /**
   * @return {?}
   */
  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }
}
DecimalNumberPipe.DEFAULT_LOCALE = 'en-US';
DecimalNumberPipe.DEFAULT_MIN_INTEGER_DIGITS = 1;
DecimalNumberPipe.DEFAULT_MIN_FRACTION_DIGITS = 0;
DecimalNumberPipe.DEFAULT_MAX_FRACTION_DIGITS = 2;
DecimalNumberPipe.decorators = [
  {
    type: Pipe,
    args: [
      {
        name: 'adfDecimalNumber',
        pure: false
      }
    ]
  }
];
/** @nocollapse */
DecimalNumberPipe.ctorParameters = () => [
  { type: UserPreferencesService },
  { type: AppConfigService }
];
if (false) {
  /** @type {?} */
  DecimalNumberPipe.DEFAULT_LOCALE;
  /** @type {?} */
  DecimalNumberPipe.DEFAULT_MIN_INTEGER_DIGITS;
  /** @type {?} */
  DecimalNumberPipe.DEFAULT_MIN_FRACTION_DIGITS;
  /** @type {?} */
  DecimalNumberPipe.DEFAULT_MAX_FRACTION_DIGITS;
  /** @type {?} */
  DecimalNumberPipe.prototype.defaultLocale;
  /** @type {?} */
  DecimalNumberPipe.prototype.defaultMinIntegerDigits;
  /** @type {?} */
  DecimalNumberPipe.prototype.defaultMinFractionDigits;
  /** @type {?} */
  DecimalNumberPipe.prototype.defaultMaxFractionDigits;
  /** @type {?} */
  DecimalNumberPipe.prototype.onDestroy$;
  /** @type {?} */
  DecimalNumberPipe.prototype.userPreferenceService;
  /** @type {?} */
  DecimalNumberPipe.prototype.appConfig;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVjaW1hbC1udW1iZXIucGlwZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BhbGZyZXNjby9hZGYtY29yZS8iLCJzb3VyY2VzIjpbInBpcGVzL2RlY2ltYWwtbnVtYmVyLnBpcGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFpQkEsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQzlDLE9BQU8sRUFBRSxJQUFJLEVBQTRCLE1BQU0sZUFBZSxDQUFDO0FBQy9ELE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLGtDQUFrQyxDQUFDO0FBQ3BFLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxvQkFBb0IsRUFBRSxNQUFNLHNDQUFzQyxDQUFDO0FBRXBHLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDL0IsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBTTNDLE1BQU0sT0FBTyxpQkFBaUI7Ozs7O0lBYzFCLFlBQW1CLHFCQUE4QyxFQUM5QyxTQUE0QjtRQUQ1QiwwQkFBcUIsR0FBckIscUJBQXFCLENBQXlCO1FBQzlDLGNBQVMsR0FBVCxTQUFTLENBQW1CO1FBUi9DLGtCQUFhLEdBQVcsaUJBQWlCLENBQUMsY0FBYyxDQUFDO1FBQ3pELDRCQUF1QixHQUFXLGlCQUFpQixDQUFDLDBCQUEwQixDQUFDO1FBQy9FLDZCQUF3QixHQUFXLGlCQUFpQixDQUFDLDJCQUEyQixDQUFDO1FBQ2pGLDZCQUF3QixHQUFXLGlCQUFpQixDQUFDLDJCQUEyQixDQUFDO1FBRWpGLGVBQVUsR0FBcUIsSUFBSSxPQUFPLEVBQVcsQ0FBQztRQUtsRCxJQUFJLElBQUksQ0FBQyxxQkFBcUIsRUFBRTtZQUM1QixJQUFJLENBQUMscUJBQXFCLENBQUMsTUFBTSxDQUFDLG9CQUFvQixDQUFDLE1BQU0sQ0FBQztpQkFDekQsSUFBSSxDQUNELFNBQVMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQzdCO2lCQUNBLFNBQVM7Ozs7WUFBQyxDQUFDLE1BQU0sRUFBRSxFQUFFO2dCQUNsQixJQUFJLE1BQU0sRUFBRTtvQkFDUixJQUFJLENBQUMsYUFBYSxHQUFHLE1BQU0sQ0FBQztpQkFDL0I7WUFDTCxDQUFDLEVBQUMsQ0FBQztTQUNWO1FBRUQsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO1lBQ2hCLElBQUksQ0FBQyx1QkFBdUIsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBUyxnQ0FBZ0MsRUFBRSxpQkFBaUIsQ0FBQywwQkFBMEIsQ0FBQyxDQUFDO1lBQzFJLElBQUksQ0FBQyx3QkFBd0IsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBUyxpQ0FBaUMsRUFBRSxpQkFBaUIsQ0FBQywyQkFBMkIsQ0FBQyxDQUFDO1lBQzdJLElBQUksQ0FBQyx3QkFBd0IsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBUyxpQ0FBaUMsRUFBRSxpQkFBaUIsQ0FBQywyQkFBMkIsQ0FBQyxDQUFDO1NBQ2hKO0lBQ0wsQ0FBQzs7Ozs7OztJQUVELFNBQVMsQ0FBQyxLQUFVLEVBQUUsVUFBK0IsRUFBRSxNQUFlOztjQUM1RCxzQkFBc0IsR0FBVyxVQUFVLElBQUksVUFBVSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyx1QkFBdUI7O2NBQ3ZJLHVCQUF1QixHQUFXLFVBQVUsSUFBSSxVQUFVLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLHdCQUF3Qjs7Y0FDM0ksdUJBQXVCLEdBQVcsVUFBVSxJQUFJLFVBQVUsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsd0JBQXdCOztjQUUzSSxnQkFBZ0IsR0FBRyxHQUFHLHNCQUFzQixJQUFJLHVCQUF1QixJQUFJLHVCQUF1QixFQUFFOztjQUNwRyxZQUFZLEdBQUcsTUFBTSxJQUFJLElBQUksQ0FBQyxhQUFhOztjQUUzQyxRQUFRLEdBQWdCLElBQUksV0FBVyxDQUFDLFlBQVksQ0FBQztRQUMzRCxPQUFPLFFBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLGdCQUFnQixDQUFDLENBQUM7SUFDdkQsQ0FBQzs7OztJQUVELFdBQVc7UUFDUCxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMzQixJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQy9CLENBQUM7O0FBakRNLGdDQUFjLEdBQUcsT0FBTyxDQUFDO0FBQ3pCLDRDQUEwQixHQUFHLENBQUMsQ0FBQztBQUMvQiw2Q0FBMkIsR0FBRyxDQUFDLENBQUM7QUFDaEMsNkNBQTJCLEdBQUcsQ0FBQyxDQUFDOztZQVQxQyxJQUFJLFNBQUM7Z0JBQ0YsSUFBSSxFQUFFLGtCQUFrQjtnQkFDeEIsSUFBSSxFQUFFLEtBQUs7YUFDZDs7OztZQVJRLHNCQUFzQjtZQUR0QixnQkFBZ0I7Ozs7SUFZckIsaUNBQWdDOztJQUNoQyw2Q0FBc0M7O0lBQ3RDLDhDQUF1Qzs7SUFDdkMsOENBQXVDOztJQUV2QywwQ0FBeUQ7O0lBQ3pELG9EQUErRTs7SUFDL0UscURBQWlGOztJQUNqRixxREFBaUY7O0lBRWpGLHVDQUFzRDs7SUFFMUMsa0RBQXFEOztJQUNyRCxzQ0FBbUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiFcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxOSBBbGZyZXNjbyBTb2Z0d2FyZSwgTHRkLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgeyBEZWNpbWFsUGlwZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBQaXBlLCBQaXBlVHJhbnNmb3JtLCBPbkRlc3Ryb3kgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEFwcENvbmZpZ1NlcnZpY2UgfSBmcm9tICcuLi9hcHAtY29uZmlnL2FwcC1jb25maWcuc2VydmljZSc7XG5pbXBvcnQgeyBVc2VyUHJlZmVyZW5jZXNTZXJ2aWNlLCBVc2VyUHJlZmVyZW5jZVZhbHVlcyB9IGZyb20gJy4uL3NlcnZpY2VzL3VzZXItcHJlZmVyZW5jZXMuc2VydmljZSc7XG5pbXBvcnQgeyBEZWNpbWFsTnVtYmVyTW9kZWwgfSBmcm9tICcuLi9tb2RlbHMvZGVjaW1hbC1udW1iZXIubW9kZWwnO1xuaW1wb3J0IHsgU3ViamVjdCB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgdGFrZVVudGlsIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5AUGlwZSh7XG4gICAgbmFtZTogJ2FkZkRlY2ltYWxOdW1iZXInLFxuICAgIHB1cmU6IGZhbHNlXG59KVxuZXhwb3J0IGNsYXNzIERlY2ltYWxOdW1iZXJQaXBlIGltcGxlbWVudHMgUGlwZVRyYW5zZm9ybSwgT25EZXN0cm95IHtcblxuICAgIHN0YXRpYyBERUZBVUxUX0xPQ0FMRSA9ICdlbi1VUyc7XG4gICAgc3RhdGljIERFRkFVTFRfTUlOX0lOVEVHRVJfRElHSVRTID0gMTtcbiAgICBzdGF0aWMgREVGQVVMVF9NSU5fRlJBQ1RJT05fRElHSVRTID0gMDtcbiAgICBzdGF0aWMgREVGQVVMVF9NQVhfRlJBQ1RJT05fRElHSVRTID0gMjtcblxuICAgIGRlZmF1bHRMb2NhbGU6IHN0cmluZyA9IERlY2ltYWxOdW1iZXJQaXBlLkRFRkFVTFRfTE9DQUxFO1xuICAgIGRlZmF1bHRNaW5JbnRlZ2VyRGlnaXRzOiBudW1iZXIgPSBEZWNpbWFsTnVtYmVyUGlwZS5ERUZBVUxUX01JTl9JTlRFR0VSX0RJR0lUUztcbiAgICBkZWZhdWx0TWluRnJhY3Rpb25EaWdpdHM6IG51bWJlciA9IERlY2ltYWxOdW1iZXJQaXBlLkRFRkFVTFRfTUlOX0ZSQUNUSU9OX0RJR0lUUztcbiAgICBkZWZhdWx0TWF4RnJhY3Rpb25EaWdpdHM6IG51bWJlciA9IERlY2ltYWxOdW1iZXJQaXBlLkRFRkFVTFRfTUFYX0ZSQUNUSU9OX0RJR0lUUztcblxuICAgIG9uRGVzdHJveSQ6IFN1YmplY3Q8Ym9vbGVhbj4gPSBuZXcgU3ViamVjdDxib29sZWFuPigpO1xuXG4gICAgY29uc3RydWN0b3IocHVibGljIHVzZXJQcmVmZXJlbmNlU2VydmljZT86IFVzZXJQcmVmZXJlbmNlc1NlcnZpY2UsXG4gICAgICAgICAgICAgICAgcHVibGljIGFwcENvbmZpZz86IEFwcENvbmZpZ1NlcnZpY2UpIHtcblxuICAgICAgICBpZiAodGhpcy51c2VyUHJlZmVyZW5jZVNlcnZpY2UpIHtcbiAgICAgICAgICAgIHRoaXMudXNlclByZWZlcmVuY2VTZXJ2aWNlLnNlbGVjdChVc2VyUHJlZmVyZW5jZVZhbHVlcy5Mb2NhbGUpXG4gICAgICAgICAgICAgICAgLnBpcGUoXG4gICAgICAgICAgICAgICAgICAgIHRha2VVbnRpbCh0aGlzLm9uRGVzdHJveSQpXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgIC5zdWJzY3JpYmUoKGxvY2FsZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAobG9jYWxlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRlZmF1bHRMb2NhbGUgPSBsb2NhbGU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmFwcENvbmZpZykge1xuICAgICAgICAgICAgdGhpcy5kZWZhdWx0TWluSW50ZWdlckRpZ2l0cyA9IHRoaXMuYXBwQ29uZmlnLmdldDxudW1iZXI+KCdkZWNpbWFsVmFsdWVzLm1pbkludGVnZXJEaWdpdHMnLCBEZWNpbWFsTnVtYmVyUGlwZS5ERUZBVUxUX01JTl9JTlRFR0VSX0RJR0lUUyk7XG4gICAgICAgICAgICB0aGlzLmRlZmF1bHRNaW5GcmFjdGlvbkRpZ2l0cyA9IHRoaXMuYXBwQ29uZmlnLmdldDxudW1iZXI+KCdkZWNpbWFsVmFsdWVzLm1pbkZyYWN0aW9uRGlnaXRzJywgRGVjaW1hbE51bWJlclBpcGUuREVGQVVMVF9NSU5fRlJBQ1RJT05fRElHSVRTKTtcbiAgICAgICAgICAgIHRoaXMuZGVmYXVsdE1heEZyYWN0aW9uRGlnaXRzID0gdGhpcy5hcHBDb25maWcuZ2V0PG51bWJlcj4oJ2RlY2ltYWxWYWx1ZXMubWF4RnJhY3Rpb25EaWdpdHMnLCBEZWNpbWFsTnVtYmVyUGlwZS5ERUZBVUxUX01BWF9GUkFDVElPTl9ESUdJVFMpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdHJhbnNmb3JtKHZhbHVlOiBhbnksIGRpZ2l0c0luZm8/OiBEZWNpbWFsTnVtYmVyTW9kZWwsIGxvY2FsZT86IHN0cmluZyk6IGFueSB7XG4gICAgICAgIGNvbnN0IGFjdHVhbE1pbkludGVnZXJEaWdpdHM6IG51bWJlciA9IGRpZ2l0c0luZm8gJiYgZGlnaXRzSW5mby5taW5JbnRlZ2VyRGlnaXRzID8gZGlnaXRzSW5mby5taW5JbnRlZ2VyRGlnaXRzIDogdGhpcy5kZWZhdWx0TWluSW50ZWdlckRpZ2l0cztcbiAgICAgICAgY29uc3QgYWN0dWFsTWluRnJhY3Rpb25EaWdpdHM6IG51bWJlciA9IGRpZ2l0c0luZm8gJiYgZGlnaXRzSW5mby5taW5GcmFjdGlvbkRpZ2l0cyA/IGRpZ2l0c0luZm8ubWluRnJhY3Rpb25EaWdpdHMgOiB0aGlzLmRlZmF1bHRNaW5GcmFjdGlvbkRpZ2l0cztcbiAgICAgICAgY29uc3QgYWN0dWFsTWF4RnJhY3Rpb25EaWdpdHM6IG51bWJlciA9IGRpZ2l0c0luZm8gJiYgZGlnaXRzSW5mby5tYXhGcmFjdGlvbkRpZ2l0cyA/IGRpZ2l0c0luZm8ubWF4RnJhY3Rpb25EaWdpdHMgOiB0aGlzLmRlZmF1bHRNYXhGcmFjdGlvbkRpZ2l0cztcblxuICAgICAgICBjb25zdCBhY3R1YWxEaWdpdHNJbmZvID0gYCR7YWN0dWFsTWluSW50ZWdlckRpZ2l0c30uJHthY3R1YWxNaW5GcmFjdGlvbkRpZ2l0c30tJHthY3R1YWxNYXhGcmFjdGlvbkRpZ2l0c31gO1xuICAgICAgICBjb25zdCBhY3R1YWxMb2NhbGUgPSBsb2NhbGUgfHwgdGhpcy5kZWZhdWx0TG9jYWxlO1xuXG4gICAgICAgIGNvbnN0IGRhdGVQaXBlOiBEZWNpbWFsUGlwZSA9IG5ldyBEZWNpbWFsUGlwZShhY3R1YWxMb2NhbGUpO1xuICAgICAgICByZXR1cm4gZGF0ZVBpcGUudHJhbnNmb3JtKHZhbHVlLCBhY3R1YWxEaWdpdHNJbmZvKTtcbiAgICB9XG5cbiAgICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5vbkRlc3Ryb3kkLm5leHQodHJ1ZSk7XG4gICAgICAgIHRoaXMub25EZXN0cm95JC5jb21wbGV0ZSgpO1xuICAgIH1cbn1cbiJdfQ==
