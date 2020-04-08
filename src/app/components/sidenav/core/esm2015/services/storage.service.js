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
export class StorageService {
  constructor() {
    this.memoryStore = {};
    this.useLocalStorage = false;
    this._prefix = '';
    this.useLocalStorage = this.storageAvailable('localStorage');
  }
  /**
   * @return {?}
   */
  get prefix() {
    return this._prefix;
  }
  /**
   * @param {?} prefix
   * @return {?}
   */
  set prefix(prefix) {
    this._prefix = prefix ? prefix + '_' : '';
  }
  /**
   * Gets an item.
   * @param {?} key Key to identify the item
   * @return {?} The item (if any) retrieved by the key
   */
  getItem(key) {
    if (this.useLocalStorage) {
      return localStorage.getItem(this.prefix + key);
    } else {
      return this.memoryStore.hasOwnProperty(this.prefix + key)
        ? this.memoryStore[this.prefix + key]
        : null;
    }
  }
  /**
   * Stores an item
   * @param {?} key Key to identify the item
   * @param {?} data Data to store
   * @return {?}
   */
  setItem(key, data) {
    if (this.useLocalStorage) {
      localStorage.setItem(this.prefix + key, data);
    } else {
      this.memoryStore[this.prefix + key] = data.toString();
    }
  }
  /**
   * Removes all currently stored items.
   * @return {?}
   */
  clear() {
    if (this.useLocalStorage) {
      localStorage.clear();
    } else {
      this.memoryStore = {};
    }
  }
  /**
   * Removes a single item.
   * @param {?} key Key to identify the item
   * @return {?}
   */
  removeItem(key) {
    if (this.useLocalStorage) {
      localStorage.removeItem(this.prefix + key);
    } else {
      delete this.memoryStore[this.prefix + key];
    }
  }
  /**
   * Is any item currently stored under `key`?
   * @param {?} key Key identifying item to check
   * @return {?} True if key retrieves an item, false otherwise
   */
  hasItem(key) {
    if (this.useLocalStorage) {
      return localStorage.getItem(this.prefix + key) ? true : false;
    } else {
      return this.memoryStore.hasOwnProperty(key);
    }
  }
  /**
   * @private
   * @param {?} type
   * @return {?}
   */
  storageAvailable(type) {
    try {
      /** @type {?} */
      const storage = window[type];
      /** @type {?} */
      const key = '__storage_test__';
      storage.setItem(key, key);
      storage.removeItem(key, key);
      return true;
    } catch (e) {
      return false;
    }
  }
}
StorageService.decorators = [
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
StorageService.ctorParameters = () => [];
/** @nocollapse */ StorageService.ngInjectableDef = i0.defineInjectable({
  factory: function StorageService_Factory() {
    return new StorageService();
  },
  token: StorageService,
  providedIn: 'root'
});
if (false) {
  /**
   * @type {?}
   * @private
   */
  StorageService.prototype.memoryStore;
  /**
   * @type {?}
   * @private
   */
  StorageService.prototype.useLocalStorage;
  /**
   * @type {?}
   * @private
   */
  StorageService.prototype._prefix;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RvcmFnZS5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQGFsZnJlc2NvL2FkZi1jb3JlLyIsInNvdXJjZXMiOlsic2VydmljZXMvc3RvcmFnZS5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBaUJBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7O0FBSzNDLE1BQU0sT0FBTyxjQUFjO0lBY3ZCO1FBWlEsZ0JBQVcsR0FBMkIsRUFBRSxDQUFDO1FBQ2hDLG9CQUFlLEdBQVksS0FBSyxDQUFDO1FBQzFDLFlBQU8sR0FBVyxFQUFFLENBQUM7UUFXekIsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsY0FBYyxDQUFDLENBQUM7SUFDakUsQ0FBQzs7OztJQVZELElBQUksTUFBTTtRQUNOLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQztJQUN4QixDQUFDOzs7OztJQUVELElBQUksTUFBTSxDQUFDLE1BQWM7UUFDckIsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztJQUM5QyxDQUFDOzs7Ozs7SUFXRCxPQUFPLENBQUMsR0FBVztRQUNmLElBQUksSUFBSSxDQUFDLGVBQWUsRUFBRTtZQUN0QixPQUFPLFlBQVksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUMsQ0FBQztTQUNsRDthQUFNO1lBQ0gsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztTQUMxRztJQUNMLENBQUM7Ozs7Ozs7SUFPRCxPQUFPLENBQUMsR0FBVyxFQUFFLElBQVk7UUFDN0IsSUFBSSxJQUFJLENBQUMsZUFBZSxFQUFFO1lBQ3RCLFlBQVksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7U0FDakQ7YUFBTTtZQUNILElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7U0FDekQ7SUFDTCxDQUFDOzs7OztJQUdELEtBQUs7UUFDRCxJQUFJLElBQUksQ0FBQyxlQUFlLEVBQUU7WUFDdEIsWUFBWSxDQUFDLEtBQUssRUFBRSxDQUFDO1NBQ3hCO2FBQU07WUFDSCxJQUFJLENBQUMsV0FBVyxHQUFHLEVBQUUsQ0FBQztTQUN6QjtJQUNMLENBQUM7Ozs7OztJQU1ELFVBQVUsQ0FBQyxHQUFXO1FBQ2xCLElBQUksSUFBSSxDQUFDLGVBQWUsRUFBRTtZQUN0QixZQUFZLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDLENBQUM7U0FDOUM7YUFBTTtZQUNILE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQyxDQUFDO1NBQzlDO0lBQ0wsQ0FBQzs7Ozs7O0lBT0QsT0FBTyxDQUFDLEdBQVc7UUFDZixJQUFJLElBQUksQ0FBQyxlQUFlLEVBQUU7WUFDdEIsT0FBTyxZQUFZLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO1NBQ2pFO2FBQU07WUFDSCxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQy9DO0lBQ0wsQ0FBQzs7Ozs7O0lBRU8sZ0JBQWdCLENBQUMsSUFBWTtRQUNqQyxJQUFJOztrQkFDTSxPQUFPLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQzs7a0JBQ3RCLEdBQUcsR0FBRyxrQkFBa0I7WUFDOUIsT0FBTyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFDMUIsT0FBTyxDQUFDLFVBQVUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFDN0IsT0FBTyxJQUFJLENBQUM7U0FDZjtRQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQ1IsT0FBTyxLQUFLLENBQUM7U0FDaEI7SUFDTCxDQUFDOzs7WUEzRkosVUFBVSxTQUFDO2dCQUNSLFVBQVUsRUFBRSxNQUFNO2FBQ3JCOzs7Ozs7Ozs7O0lBR0cscUNBQWlEOzs7OztJQUNqRCx5Q0FBa0Q7Ozs7O0lBQ2xELGlDQUE2QiIsInNvdXJjZXNDb250ZW50IjpbIi8qIVxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE5IEFsZnJlc2NvIFNvZnR3YXJlLCBMdGQuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbmltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuQEluamVjdGFibGUoe1xuICAgIHByb3ZpZGVkSW46ICdyb290J1xufSlcbmV4cG9ydCBjbGFzcyBTdG9yYWdlU2VydmljZSB7XG5cbiAgICBwcml2YXRlIG1lbW9yeVN0b3JlOiB7IFtrZXk6IHN0cmluZ106IGFueSB9ID0ge307XG4gICAgcHJpdmF0ZSByZWFkb25seSB1c2VMb2NhbFN0b3JhZ2U6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBwcml2YXRlIF9wcmVmaXg6IHN0cmluZyA9ICcnO1xuXG4gICAgZ2V0IHByZWZpeCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3ByZWZpeDtcbiAgICB9XG5cbiAgICBzZXQgcHJlZml4KHByZWZpeDogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuX3ByZWZpeCA9IHByZWZpeCA/IHByZWZpeCArICdfJyA6ICcnO1xuICAgIH1cblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLnVzZUxvY2FsU3RvcmFnZSA9IHRoaXMuc3RvcmFnZUF2YWlsYWJsZSgnbG9jYWxTdG9yYWdlJyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0cyBhbiBpdGVtLlxuICAgICAqIEBwYXJhbSBrZXkgS2V5IHRvIGlkZW50aWZ5IHRoZSBpdGVtXG4gICAgICogQHJldHVybnMgVGhlIGl0ZW0gKGlmIGFueSkgcmV0cmlldmVkIGJ5IHRoZSBrZXlcbiAgICAgKi9cbiAgICBnZXRJdGVtKGtleTogc3RyaW5nKTogc3RyaW5nIHwgbnVsbCB7XG4gICAgICAgIGlmICh0aGlzLnVzZUxvY2FsU3RvcmFnZSkge1xuICAgICAgICAgICAgcmV0dXJuIGxvY2FsU3RvcmFnZS5nZXRJdGVtKHRoaXMucHJlZml4ICsga2V5KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm1lbW9yeVN0b3JlLmhhc093blByb3BlcnR5KHRoaXMucHJlZml4ICsga2V5KSA/IHRoaXMubWVtb3J5U3RvcmVbdGhpcy5wcmVmaXggKyBrZXldIDogbnVsbDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFN0b3JlcyBhbiBpdGVtXG4gICAgICogQHBhcmFtIGtleSBLZXkgdG8gaWRlbnRpZnkgdGhlIGl0ZW1cbiAgICAgKiBAcGFyYW0gZGF0YSBEYXRhIHRvIHN0b3JlXG4gICAgICovXG4gICAgc2V0SXRlbShrZXk6IHN0cmluZywgZGF0YTogc3RyaW5nKSB7XG4gICAgICAgIGlmICh0aGlzLnVzZUxvY2FsU3RvcmFnZSkge1xuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0odGhpcy5wcmVmaXggKyBrZXksIGRhdGEpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5tZW1vcnlTdG9yZVt0aGlzLnByZWZpeCArIGtleV0gPSBkYXRhLnRvU3RyaW5nKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKiogUmVtb3ZlcyBhbGwgY3VycmVudGx5IHN0b3JlZCBpdGVtcy4gKi9cbiAgICBjbGVhcigpIHtcbiAgICAgICAgaWYgKHRoaXMudXNlTG9jYWxTdG9yYWdlKSB7XG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2UuY2xlYXIoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMubWVtb3J5U3RvcmUgPSB7fTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlbW92ZXMgYSBzaW5nbGUgaXRlbS5cbiAgICAgKiBAcGFyYW0ga2V5IEtleSB0byBpZGVudGlmeSB0aGUgaXRlbVxuICAgICAqL1xuICAgIHJlbW92ZUl0ZW0oa2V5OiBzdHJpbmcpIHtcbiAgICAgICAgaWYgKHRoaXMudXNlTG9jYWxTdG9yYWdlKSB7XG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSh0aGlzLnByZWZpeCArIGtleSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkZWxldGUgdGhpcy5tZW1vcnlTdG9yZVt0aGlzLnByZWZpeCArIGtleV07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJcyBhbnkgaXRlbSBjdXJyZW50bHkgc3RvcmVkIHVuZGVyIGBrZXlgP1xuICAgICAqIEBwYXJhbSBrZXkgS2V5IGlkZW50aWZ5aW5nIGl0ZW0gdG8gY2hlY2tcbiAgICAgKiBAcmV0dXJucyBUcnVlIGlmIGtleSByZXRyaWV2ZXMgYW4gaXRlbSwgZmFsc2Ugb3RoZXJ3aXNlXG4gICAgICovXG4gICAgaGFzSXRlbShrZXk6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgICAgICBpZiAodGhpcy51c2VMb2NhbFN0b3JhZ2UpIHtcbiAgICAgICAgICAgIHJldHVybiBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSh0aGlzLnByZWZpeCArIGtleSkgPyB0cnVlIDogZmFsc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5tZW1vcnlTdG9yZS5oYXNPd25Qcm9wZXJ0eShrZXkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzdG9yYWdlQXZhaWxhYmxlKHR5cGU6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3Qgc3RvcmFnZSA9IHdpbmRvd1t0eXBlXTtcbiAgICAgICAgICAgIGNvbnN0IGtleSA9ICdfX3N0b3JhZ2VfdGVzdF9fJztcbiAgICAgICAgICAgIHN0b3JhZ2Uuc2V0SXRlbShrZXksIGtleSk7XG4gICAgICAgICAgICBzdG9yYWdlLnJlbW92ZUl0ZW0oa2V5LCBrZXkpO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiJdfQ==
