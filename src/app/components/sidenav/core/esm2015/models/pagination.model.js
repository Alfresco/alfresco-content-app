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
import { Pagination } from '@alfresco/js-api';
export class PaginationModel extends Pagination {
  /**
   * @param {?=} input
   */
  constructor(input) {
    super(input);
    if (input) {
      this.count = input.count;
      this.hasMoreItems = input.hasMoreItems ? input.hasMoreItems : false;
      this.merge = input.merge ? input.merge : false;
      this.totalItems = input.totalItems;
      this.skipCount = input.skipCount;
      this.maxItems = input.maxItems;
    }
  }
}
if (false) {
  /** @type {?} */
  PaginationModel.prototype.merge;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFnaW5hdGlvbi5tb2RlbC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BhbGZyZXNjby9hZGYtY29yZS8iLCJzb3VyY2VzIjpbIm1vZGVscy9wYWdpbmF0aW9uLm1vZGVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBaUJBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUU5QyxNQUFNLE9BQU8sZUFBZ0IsU0FBUSxVQUFVOzs7O0lBRzNDLFlBQVksS0FBVztRQUNuQixLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDYixJQUFJLEtBQUssRUFBRTtZQUNQLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQztZQUN6QixJQUFJLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztZQUNwRSxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztZQUMvQyxJQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQyxVQUFVLENBQUM7WUFDbkMsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDO1lBQ2pDLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDLFFBQVEsQ0FBQztTQUNsQztJQUNMLENBQUM7Q0FDSjs7O0lBYkcsZ0NBQWdCIiwic291cmNlc0NvbnRlbnQiOlsiLyohXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTkgQWxmcmVzY28gU29mdHdhcmUsIEx0ZC5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0IHsgUGFnaW5hdGlvbiB9IGZyb20gJ0BhbGZyZXNjby9qcy1hcGknO1xuXG5leHBvcnQgY2xhc3MgUGFnaW5hdGlvbk1vZGVsIGV4dGVuZHMgUGFnaW5hdGlvbiB7XG4gICAgbWVyZ2U/OiBib29sZWFuO1xuXG4gICAgY29uc3RydWN0b3IoaW5wdXQ/OiBhbnkpIHtcbiAgICAgICAgc3VwZXIoaW5wdXQpO1xuICAgICAgICBpZiAoaW5wdXQpIHtcbiAgICAgICAgICAgIHRoaXMuY291bnQgPSBpbnB1dC5jb3VudDtcbiAgICAgICAgICAgIHRoaXMuaGFzTW9yZUl0ZW1zID0gaW5wdXQuaGFzTW9yZUl0ZW1zID8gaW5wdXQuaGFzTW9yZUl0ZW1zIDogZmFsc2U7XG4gICAgICAgICAgICB0aGlzLm1lcmdlID0gaW5wdXQubWVyZ2UgPyBpbnB1dC5tZXJnZSA6IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy50b3RhbEl0ZW1zID0gaW5wdXQudG90YWxJdGVtcztcbiAgICAgICAgICAgIHRoaXMuc2tpcENvdW50ID0gaW5wdXQuc2tpcENvdW50O1xuICAgICAgICAgICAgdGhpcy5tYXhJdGVtcyA9IGlucHV0Lm1heEl0ZW1zO1xuICAgICAgICB9XG4gICAgfVxufVxuIl19
