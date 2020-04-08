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
/* tslint:disable:component-selector  */
export class FormOutcomeEvent {
  /**
   * @param {?} outcome
   */
  constructor(outcome) {
    this._defaultPrevented = false;
    this._outcome = outcome;
  }
  /**
   * @return {?}
   */
  get outcome() {
    return this._outcome;
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
  FormOutcomeEvent.prototype._outcome;
  /**
   * @type {?}
   * @private
   */
  FormOutcomeEvent.prototype._defaultPrevented;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybS1vdXRjb21lLWV2ZW50Lm1vZGVsLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQGFsZnJlc2NvL2FkZi1jb3JlLyIsInNvdXJjZXMiOlsiZm9ybS9jb21wb25lbnRzL3dpZGdldHMvY29yZS9mb3JtLW91dGNvbWUtZXZlbnQubW9kZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBcUJBLE1BQU0sT0FBTyxnQkFBZ0I7Ozs7SUFhekIsWUFBWSxPQUF5QjtRQVY3QixzQkFBaUIsR0FBWSxLQUFLLENBQUM7UUFXdkMsSUFBSSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUM7SUFDNUIsQ0FBQzs7OztJQVZELElBQUksT0FBTztRQUNQLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQztJQUN6QixDQUFDOzs7O0lBRUQsSUFBSSxnQkFBZ0I7UUFDaEIsT0FBTyxJQUFJLENBQUMsaUJBQWlCLENBQUM7SUFDbEMsQ0FBQzs7OztJQU1ELGNBQWM7UUFDVixJQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxDQUFDO0lBQ2xDLENBQUM7Q0FFSjs7Ozs7O0lBbkJHLG9DQUE0Qzs7Ozs7SUFDNUMsNkNBQTJDIiwic291cmNlc0NvbnRlbnQiOlsiLyohXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTkgQWxmcmVzY28gU29mdHdhcmUsIEx0ZC5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuIC8qIHRzbGludDpkaXNhYmxlOmNvbXBvbmVudC1zZWxlY3RvciAgKi9cblxuaW1wb3J0IHsgRm9ybU91dGNvbWVNb2RlbCB9IGZyb20gJy4vZm9ybS1vdXRjb21lLm1vZGVsJztcblxuZXhwb3J0IGNsYXNzIEZvcm1PdXRjb21lRXZlbnQge1xuXG4gICAgcHJpdmF0ZSByZWFkb25seSBfb3V0Y29tZTogRm9ybU91dGNvbWVNb2RlbDtcbiAgICBwcml2YXRlIF9kZWZhdWx0UHJldmVudGVkOiBib29sZWFuID0gZmFsc2U7XG5cbiAgICBnZXQgb3V0Y29tZSgpOiBGb3JtT3V0Y29tZU1vZGVsIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX291dGNvbWU7XG4gICAgfVxuXG4gICAgZ2V0IGRlZmF1bHRQcmV2ZW50ZWQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9kZWZhdWx0UHJldmVudGVkO1xuICAgIH1cblxuICAgIGNvbnN0cnVjdG9yKG91dGNvbWU6IEZvcm1PdXRjb21lTW9kZWwpIHtcbiAgICAgICAgdGhpcy5fb3V0Y29tZSA9IG91dGNvbWU7XG4gICAgfVxuXG4gICAgcHJldmVudERlZmF1bHQoKSB7XG4gICAgICAgIHRoaXMuX2RlZmF1bHRQcmV2ZW50ZWQgPSB0cnVlO1xuICAgIH1cblxufVxuIl19
