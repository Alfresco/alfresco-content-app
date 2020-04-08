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
import { BaseUIEvent } from '../../events';
export class DataRowEvent extends BaseUIEvent {
  /**
   * @param {?} value
   * @param {?} domEvent
   * @param {?=} sender
   */
  constructor(value, domEvent, sender) {
    super();
    this.value = value;
    this.event = domEvent;
    this.sender = sender;
  }
}
if (false) {
  /** @type {?} */
  DataRowEvent.prototype.sender;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YS1yb3ctZXZlbnQubW9kZWwuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AYWxmcmVzY28vYWRmLWNvcmUvIiwic291cmNlcyI6WyJkYXRhdGFibGUvZGF0YS9kYXRhLXJvdy1ldmVudC5tb2RlbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWlCQSxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sY0FBYyxDQUFDO0FBRzNDLE1BQU0sT0FBTyxZQUFhLFNBQVEsV0FBb0I7Ozs7OztJQUlsRCxZQUFZLEtBQWMsRUFBRSxRQUFlLEVBQUUsTUFBWTtRQUNyRCxLQUFLLEVBQUUsQ0FBQztRQUNSLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ25CLElBQUksQ0FBQyxLQUFLLEdBQUcsUUFBUSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO0lBQ3pCLENBQUM7Q0FFSjs7O0lBVEcsOEJBQVkiLCJzb3VyY2VzQ29udGVudCI6WyIvKiFcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxOSBBbGZyZXNjbyBTb2Z0d2FyZSwgTHRkLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgeyBCYXNlVUlFdmVudCB9IGZyb20gJy4uLy4uL2V2ZW50cyc7XG5pbXBvcnQgeyBEYXRhUm93IH0gZnJvbSAnLi9kYXRhLXJvdy5tb2RlbCc7XG5cbmV4cG9ydCBjbGFzcyBEYXRhUm93RXZlbnQgZXh0ZW5kcyBCYXNlVUlFdmVudDxEYXRhUm93PiB7XG5cbiAgICBzZW5kZXI6IGFueTtcblxuICAgIGNvbnN0cnVjdG9yKHZhbHVlOiBEYXRhUm93LCBkb21FdmVudDogRXZlbnQsIHNlbmRlcj86IGFueSkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIHRoaXMuZXZlbnQgPSBkb21FdmVudDtcbiAgICAgICAgdGhpcy5zZW5kZXIgPSBzZW5kZXI7XG4gICAgfVxuXG59XG4iXX0=
