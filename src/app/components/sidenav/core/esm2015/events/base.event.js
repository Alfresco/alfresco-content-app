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
/**
 * Base cancellable event implementation
 * @template T
 */
export class BaseEvent {
  constructor() {
    this.isDefaultPrevented = false;
  }
  /**
   * @return {?}
   */
  get defaultPrevented() {
    return this.isDefaultPrevented;
  }
  /**
   * @return {?}
   */
  preventDefault() {
    this.isDefaultPrevented = true;
  }
}
if (false) {
  /**
   * @type {?}
   * @private
   */
  BaseEvent.prototype.isDefaultPrevented;
  /** @type {?} */
  BaseEvent.prototype.value;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZS5ldmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BhbGZyZXNjby9hZGYtY29yZS8iLCJzb3VyY2VzIjpbImV2ZW50cy9iYXNlLmV2ZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWtCQSxNQUFNLE9BQU8sU0FBUztJQUF0QjtRQUVZLHVCQUFrQixHQUFZLEtBQUssQ0FBQztJQVloRCxDQUFDOzs7O0lBUkcsSUFBSSxnQkFBZ0I7UUFDaEIsT0FBTyxJQUFJLENBQUMsa0JBQWtCLENBQUM7SUFDbkMsQ0FBQzs7OztJQUVELGNBQWM7UUFDVixJQUFJLENBQUMsa0JBQWtCLEdBQUcsSUFBSSxDQUFDO0lBQ25DLENBQUM7Q0FFSjs7Ozs7O0lBWkcsdUNBQTRDOztJQUU1QywwQkFBUyIsInNvdXJjZXNDb250ZW50IjpbIi8qIVxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE5IEFsZnJlc2NvIFNvZnR3YXJlLCBMdGQuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbi8qKiBCYXNlIGNhbmNlbGxhYmxlIGV2ZW50IGltcGxlbWVudGF0aW9uICovXG5leHBvcnQgY2xhc3MgQmFzZUV2ZW50PFQ+IHtcblxuICAgIHByaXZhdGUgaXNEZWZhdWx0UHJldmVudGVkOiBib29sZWFuID0gZmFsc2U7XG5cbiAgICB2YWx1ZTogVDtcblxuICAgIGdldCBkZWZhdWx0UHJldmVudGVkKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5pc0RlZmF1bHRQcmV2ZW50ZWQ7XG4gICAgfVxuXG4gICAgcHJldmVudERlZmF1bHQoKSB7XG4gICAgICAgIHRoaXMuaXNEZWZhdWx0UHJldmVudGVkID0gdHJ1ZTtcbiAgICB9XG5cbn1cbiJdfQ==
