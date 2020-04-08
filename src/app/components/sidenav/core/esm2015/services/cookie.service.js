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
import { Injectable } from '@angular/core';
import * as i0 from '@angular/core';
export class CookieService {
  constructor() {
    this.cookieEnabled = false;
    // for certain scenarios Chrome may say 'true' but have cookies still disabled
    if (navigator.cookieEnabled === false) {
      this.cookieEnabled = false;
    }
    this.setItem('test-cookie', 'test');
    this.cookieEnabled = document.cookie.indexOf('test-cookie') >= 0;
    this.deleteCookie('test-cookie');
  }
  /**
   * Checks if cookies are enabled.
   * @return {?} True if enabled, false otherwise
   */
  isEnabled() {
    return this.cookieEnabled;
  }
  /**
   * Retrieves a cookie by its key.
   * @param {?} key Key to identify the cookie
   * @return {?} The cookie data or null if it is not found
   */
  getItem(key) {
    /** @type {?} */
    const regexp = new RegExp(
      '(?:' + key + '|;s*' + key + ')=(.*?)(?:;|$)',
      'g'
    );
    /** @type {?} */
    const result = regexp.exec(document.cookie);
    return result === null ? null : result[1];
  }
  /**
   * Sets a cookie.
   * @param {?} key Key to identify the cookie
   * @param {?} data Data value to set for the cookie
   * @param {?=} expiration Expiration date of the data
   * @param {?=} path "Pathname" to store the cookie
   * @return {?}
   */
  setItem(key, data, expiration = null, path = null) {
    document.cookie =
      `${key}=${data}` +
      (expiration ? ';expires=' + expiration.toUTCString() : '') +
      (path ? `;path=${path}` : ';path=/');
  }
  /**
   * Delete a cookie Key.
   * @param {?} key Key to identify the cookie
   * @return {?}
   */
  deleteCookie(key) {
    document.cookie = key + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  }
  /**
   * Placeholder for testing purposes - do not use.
   * @return {?}
   */
  clear() {
    /* placeholder for testing purposes */
  }
}
CookieService.decorators = [
  {
    type: Injectable,
    args: [
      {
        providedIn: 'root'
      }
    ]
  }
];
/** @nocollapse */
CookieService.ctorParameters = () => [];
/** @nocollapse */ CookieService.ngInjectableDef = i0.defineInjectable({
  factory: function CookieService_Factory() {
    return new CookieService();
  },
  token: CookieService,
  providedIn: 'root'
});
if (false) {
  /** @type {?} */
  CookieService.prototype.cookieEnabled;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29va2llLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AYWxmcmVzY28vYWRmLWNvcmUvIiwic291cmNlcyI6WyJzZXJ2aWNlcy9jb29raWUuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWlCQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDOztBQUszQyxNQUFNLE9BQU8sYUFBYTtJQUl0QjtRQUZBLGtCQUFhLEdBQUcsS0FBSyxDQUFDO1FBR2xCLDhFQUE4RTtRQUM5RSxJQUFJLFNBQVMsQ0FBQyxhQUFhLEtBQUssS0FBSyxFQUFFO1lBQ25DLElBQUksQ0FBQyxhQUFhLEdBQUcsS0FBSyxDQUFDO1NBQzlCO1FBRUQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDcEMsSUFBSSxDQUFDLGFBQWEsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDakUsSUFBSSxDQUFDLFlBQVksQ0FBQyxhQUFhLENBQUMsQ0FBQztJQUNyQyxDQUFDOzs7OztJQU1ELFNBQVM7UUFDTCxPQUFPLElBQUksQ0FBQyxhQUFhLENBQUM7SUFDOUIsQ0FBQzs7Ozs7O0lBT0QsT0FBTyxDQUFDLEdBQVc7O2NBQ1QsTUFBTSxHQUFHLElBQUksTUFBTSxDQUFDLEtBQUssR0FBRyxHQUFHLEdBQUcsT0FBTyxHQUFHLEdBQUcsR0FBRyxnQkFBZ0IsRUFBRSxHQUFHLENBQUM7O2NBQ3hFLE1BQU0sR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUM7UUFDM0MsT0FBTyxDQUFDLE1BQU0sS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDaEQsQ0FBQzs7Ozs7Ozs7O0lBU0QsT0FBTyxDQUFDLEdBQVcsRUFBRSxJQUFZLEVBQUUsYUFBMEIsSUFBSSxFQUFFLE9BQXNCLElBQUk7UUFDekYsUUFBUSxDQUFDLE1BQU0sR0FBRyxHQUFHLEdBQUcsSUFBSSxJQUFJLEVBQUU7WUFDOUIsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLFdBQVcsR0FBRyxVQUFVLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztZQUMxRCxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsU0FBUyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDN0MsQ0FBQzs7Ozs7O0lBTUQsWUFBWSxDQUFDLEdBQVc7UUFDcEIsUUFBUSxDQUFDLE1BQU0sR0FBRyxHQUFHLEdBQUcsMkNBQTJDLENBQUM7SUFDeEUsQ0FBQzs7Ozs7SUFHRCxLQUFLO1FBQ0Qsc0NBQXNDO0lBQzFDLENBQUM7OztZQTdESixVQUFVLFNBQUM7Z0JBQ1IsVUFBVSxFQUFFLE1BQU07YUFDckI7Ozs7Ozs7SUFHRyxzQ0FBc0IiLCJzb3VyY2VzQ29udGVudCI6WyIvKiFcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxOSBBbGZyZXNjbyBTb2Z0d2FyZSwgTHRkLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbkBJbmplY3RhYmxlKHtcbiAgICBwcm92aWRlZEluOiAncm9vdCdcbn0pXG5leHBvcnQgY2xhc3MgQ29va2llU2VydmljZSB7XG5cbiAgICBjb29raWVFbmFibGVkID0gZmFsc2U7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgLy8gZm9yIGNlcnRhaW4gc2NlbmFyaW9zIENocm9tZSBtYXkgc2F5ICd0cnVlJyBidXQgaGF2ZSBjb29raWVzIHN0aWxsIGRpc2FibGVkXG4gICAgICAgIGlmIChuYXZpZ2F0b3IuY29va2llRW5hYmxlZCA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIHRoaXMuY29va2llRW5hYmxlZCA9IGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zZXRJdGVtKCd0ZXN0LWNvb2tpZScsICd0ZXN0Jyk7XG4gICAgICAgIHRoaXMuY29va2llRW5hYmxlZCA9IGRvY3VtZW50LmNvb2tpZS5pbmRleE9mKCd0ZXN0LWNvb2tpZScpID49IDA7XG4gICAgICAgIHRoaXMuZGVsZXRlQ29va2llKCd0ZXN0LWNvb2tpZScpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENoZWNrcyBpZiBjb29raWVzIGFyZSBlbmFibGVkLlxuICAgICAqIEByZXR1cm5zIFRydWUgaWYgZW5hYmxlZCwgZmFsc2Ugb3RoZXJ3aXNlXG4gICAgICovXG4gICAgaXNFbmFibGVkKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5jb29raWVFbmFibGVkO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHJpZXZlcyBhIGNvb2tpZSBieSBpdHMga2V5LlxuICAgICAqIEBwYXJhbSBrZXkgS2V5IHRvIGlkZW50aWZ5IHRoZSBjb29raWVcbiAgICAgKiBAcmV0dXJucyBUaGUgY29va2llIGRhdGEgb3IgbnVsbCBpZiBpdCBpcyBub3QgZm91bmRcbiAgICAgKi9cbiAgICBnZXRJdGVtKGtleTogc3RyaW5nKTogc3RyaW5nIHwgbnVsbCB7XG4gICAgICAgIGNvbnN0IHJlZ2V4cCA9IG5ldyBSZWdFeHAoJyg/OicgKyBrZXkgKyAnfDtcXHMqJyArIGtleSArICcpPSguKj8pKD86O3wkKScsICdnJyk7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IHJlZ2V4cC5leGVjKGRvY3VtZW50LmNvb2tpZSk7XG4gICAgICAgIHJldHVybiAocmVzdWx0ID09PSBudWxsKSA/IG51bGwgOiByZXN1bHRbMV07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2V0cyBhIGNvb2tpZS5cbiAgICAgKiBAcGFyYW0ga2V5IEtleSB0byBpZGVudGlmeSB0aGUgY29va2llXG4gICAgICogQHBhcmFtIGRhdGEgRGF0YSB2YWx1ZSB0byBzZXQgZm9yIHRoZSBjb29raWVcbiAgICAgKiBAcGFyYW0gZXhwaXJhdGlvbiBFeHBpcmF0aW9uIGRhdGUgb2YgdGhlIGRhdGFcbiAgICAgKiBAcGFyYW0gcGF0aCBcIlBhdGhuYW1lXCIgdG8gc3RvcmUgdGhlIGNvb2tpZVxuICAgICAqL1xuICAgIHNldEl0ZW0oa2V5OiBzdHJpbmcsIGRhdGE6IHN0cmluZywgZXhwaXJhdGlvbjogRGF0ZSB8IG51bGwgPSBudWxsLCBwYXRoOiBzdHJpbmcgfCBudWxsID0gbnVsbCk6IHZvaWQge1xuICAgICAgICBkb2N1bWVudC5jb29raWUgPSBgJHtrZXl9PSR7ZGF0YX1gICtcbiAgICAgICAgICAgIChleHBpcmF0aW9uID8gJztleHBpcmVzPScgKyBleHBpcmF0aW9uLnRvVVRDU3RyaW5nKCkgOiAnJykgK1xuICAgICAgICAgICAgKHBhdGggPyBgO3BhdGg9JHtwYXRofWAgOiAnO3BhdGg9LycpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIERlbGV0ZSBhIGNvb2tpZSBLZXkuXG4gICAgICogQHBhcmFtIGtleSBLZXkgdG8gaWRlbnRpZnkgdGhlIGNvb2tpZVxuICAgICAqL1xuICAgIGRlbGV0ZUNvb2tpZShrZXk6IHN0cmluZyk6IHZvaWQge1xuICAgICAgICBkb2N1bWVudC5jb29raWUgPSBrZXkgKyAnPTsgZXhwaXJlcz1UaHUsIDAxIEphbiAxOTcwIDAwOjAwOjAxIEdNVDsnO1xuICAgIH1cblxuICAgIC8qKiBQbGFjZWhvbGRlciBmb3IgdGVzdGluZyBwdXJwb3NlcyAtIGRvIG5vdCB1c2UuICovXG4gICAgY2xlYXIoKSB7XG4gICAgICAgIC8qIHBsYWNlaG9sZGVyIGZvciB0ZXN0aW5nIHB1cnBvc2VzICovXG4gICAgfVxufVxuIl19
