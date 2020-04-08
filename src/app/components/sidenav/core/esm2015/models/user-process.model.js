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
 * This object represent the process service user.*
 */
export class UserProcessModel {
  /**
   * @param {?=} input
   */
  constructor(input) {
    if (input) {
      this.id = input.id;
      this.email = input.email || null;
      this.firstName = input.firstName || null;
      this.lastName = input.lastName || null;
      this.pictureId = input.pictureId || null;
      this.externalId = input.externalId || null;
      this.userImage = input.userImage;
    }
  }
}
if (false) {
  /** @type {?} */
  UserProcessModel.prototype.id;
  /** @type {?} */
  UserProcessModel.prototype.email;
  /** @type {?} */
  UserProcessModel.prototype.firstName;
  /** @type {?} */
  UserProcessModel.prototype.lastName;
  /** @type {?} */
  UserProcessModel.prototype.pictureId;
  /** @type {?} */
  UserProcessModel.prototype.externalId;
  /** @type {?} */
  UserProcessModel.prototype.userImage;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci1wcm9jZXNzLm1vZGVsLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQGFsZnJlc2NvL2FkZi1jb3JlLyIsInNvdXJjZXMiOlsibW9kZWxzL3VzZXItcHJvY2Vzcy5tb2RlbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXVCQSxNQUFNLE9BQU8sZ0JBQWdCOzs7O0lBU3pCLFlBQVksS0FBVztRQUNuQixJQUFJLEtBQUssRUFBRTtZQUNQLElBQUksQ0FBQyxFQUFFLEdBQUcsS0FBSyxDQUFDLEVBQUUsQ0FBQztZQUNuQixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDO1lBQ2pDLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDLFNBQVMsSUFBSSxJQUFJLENBQUM7WUFDekMsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQztZQUN2QyxJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQyxTQUFTLElBQUksSUFBSSxDQUFDO1lBQ3pDLElBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDLFVBQVUsSUFBSSxJQUFJLENBQUM7WUFDM0MsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDO1NBQ3BDO0lBQ0wsQ0FBQztDQUVKOzs7SUFwQkcsOEJBQVk7O0lBQ1osaUNBQWU7O0lBQ2YscUNBQW1COztJQUNuQixvQ0FBa0I7O0lBQ2xCLHFDQUFtQjs7SUFDbkIsc0NBQW9COztJQUNwQixxQ0FBbUIiLCJzb3VyY2VzQ29udGVudCI6WyIvKiFcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxOSBBbGZyZXNjbyBTb2Z0d2FyZSwgTHRkLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG4vKipcbiAqIFRoaXMgb2JqZWN0IHJlcHJlc2VudCB0aGUgcHJvY2VzcyBzZXJ2aWNlIHVzZXIuKlxuICovXG5cbmltcG9ydCB7IExpZ2h0VXNlclJlcHJlc2VudGF0aW9uIH0gZnJvbSAnQGFsZnJlc2NvL2pzLWFwaSc7XG5cbmV4cG9ydCBjbGFzcyBVc2VyUHJvY2Vzc01vZGVsIGltcGxlbWVudHMgTGlnaHRVc2VyUmVwcmVzZW50YXRpb24ge1xuICAgIGlkPzogbnVtYmVyO1xuICAgIGVtYWlsPzogc3RyaW5nO1xuICAgIGZpcnN0TmFtZT86IHN0cmluZztcbiAgICBsYXN0TmFtZT86IHN0cmluZztcbiAgICBwaWN0dXJlSWQ/OiBudW1iZXI7XG4gICAgZXh0ZXJuYWxJZD86IHN0cmluZztcbiAgICB1c2VySW1hZ2U/OiBzdHJpbmc7XG5cbiAgICBjb25zdHJ1Y3RvcihpbnB1dD86IGFueSkge1xuICAgICAgICBpZiAoaW5wdXQpIHtcbiAgICAgICAgICAgIHRoaXMuaWQgPSBpbnB1dC5pZDtcbiAgICAgICAgICAgIHRoaXMuZW1haWwgPSBpbnB1dC5lbWFpbCB8fCBudWxsO1xuICAgICAgICAgICAgdGhpcy5maXJzdE5hbWUgPSBpbnB1dC5maXJzdE5hbWUgfHwgbnVsbDtcbiAgICAgICAgICAgIHRoaXMubGFzdE5hbWUgPSBpbnB1dC5sYXN0TmFtZSB8fCBudWxsO1xuICAgICAgICAgICAgdGhpcy5waWN0dXJlSWQgPSBpbnB1dC5waWN0dXJlSWQgfHwgbnVsbDtcbiAgICAgICAgICAgIHRoaXMuZXh0ZXJuYWxJZCA9IGlucHV0LmV4dGVybmFsSWQgfHwgbnVsbDtcbiAgICAgICAgICAgIHRoaXMudXNlckltYWdlID0gaW5wdXQudXNlckltYWdlO1xuICAgICAgICB9XG4gICAgfVxuXG59XG4iXX0=
