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
export class LoginSubmitEvent {
  /**
   * @param {?} _values
   */
  constructor(_values) {
    this._defaultPrevented = false;
    this._values = _values;
  }
  /**
   * @return {?}
   */
  get values() {
    return this._values;
  }
  /**
   * @return {?}
   */
  get defaultPrevented() {
    return this._defaultPrevented;
  }
  /**
   * @return {?}
   */
  preventDefault() {
    this._defaultPrevented = true;
  }
}
if (false) {
  /**
   * @type {?}
   * @private
   */
  LoginSubmitEvent.prototype._values;
  /**
   * @type {?}
   * @private
   */
  LoginSubmitEvent.prototype._defaultPrevented;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9naW4tc3VibWl0LmV2ZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vQGFsZnJlc2NvL2FkZi1jb3JlLyIsInNvdXJjZXMiOlsibG9naW4vbW9kZWxzL2xvZ2luLXN1Ym1pdC5ldmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWlCQSxNQUFNLE9BQU8sZ0JBQWdCOzs7O0lBYXpCLFlBQVksT0FBWTtRQVZoQixzQkFBaUIsR0FBWSxLQUFLLENBQUM7UUFXdkMsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7SUFDM0IsQ0FBQzs7OztJQVZELElBQUksTUFBTTtRQUNOLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQztJQUN4QixDQUFDOzs7O0lBRUQsSUFBSSxnQkFBZ0I7UUFDaEIsT0FBTyxJQUFJLENBQUMsaUJBQWlCLENBQUM7SUFDbEMsQ0FBQzs7OztJQU1ELGNBQWM7UUFDVixJQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxDQUFDO0lBQ2xDLENBQUM7Q0FFSjs7Ozs7O0lBbkJHLG1DQUE4Qjs7Ozs7SUFDOUIsNkNBQTJDIiwic291cmNlc0NvbnRlbnQiOlsiLyohXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTkgQWxmcmVzY28gU29mdHdhcmUsIEx0ZC5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuZXhwb3J0IGNsYXNzIExvZ2luU3VibWl0RXZlbnQge1xuXG4gICAgcHJpdmF0ZSByZWFkb25seSBfdmFsdWVzOiBhbnk7XG4gICAgcHJpdmF0ZSBfZGVmYXVsdFByZXZlbnRlZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgZ2V0IHZhbHVlcygpOiBhbnkge1xuICAgICAgICByZXR1cm4gdGhpcy5fdmFsdWVzO1xuICAgIH1cblxuICAgIGdldCBkZWZhdWx0UHJldmVudGVkKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZGVmYXVsdFByZXZlbnRlZDtcbiAgICB9XG5cbiAgICBjb25zdHJ1Y3RvcihfdmFsdWVzOiBhbnkpIHtcbiAgICAgICAgdGhpcy5fdmFsdWVzID0gX3ZhbHVlcztcbiAgICB9XG5cbiAgICBwcmV2ZW50RGVmYXVsdCgpIHtcbiAgICAgICAgdGhpcy5fZGVmYXVsdFByZXZlbnRlZCA9IHRydWU7XG4gICAgfVxuXG59XG4iXX0=
