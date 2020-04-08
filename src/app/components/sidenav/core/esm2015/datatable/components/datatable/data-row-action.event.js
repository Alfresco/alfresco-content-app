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
import { BaseEvent } from '../../../events';
export class DataRowActionModel {
  /**
   * @param {?} row
   * @param {?} action
   */
  constructor(row, action) {
    this.row = row;
    this.action = action;
  }
}
if (false) {
  /** @type {?} */
  DataRowActionModel.prototype.row;
  /** @type {?} */
  DataRowActionModel.prototype.action;
}
export class DataRowActionEvent extends BaseEvent {
  // backwards compatibility with 1.2.0 and earlier
  /**
   * @return {?}
   */
  get args() {
    return this.value;
  }
  /**
   * @param {?} row
   * @param {?} action
   */
  constructor(row, action) {
    super();
    this.value = new DataRowActionModel(row, action);
  }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YS1yb3ctYWN0aW9uLmV2ZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vQGFsZnJlc2NvL2FkZi1jb3JlLyIsInNvdXJjZXMiOlsiZGF0YXRhYmxlL2NvbXBvbmVudHMvZGF0YXRhYmxlL2RhdGEtcm93LWFjdGlvbi5ldmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWlCQSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFHNUMsTUFBTSxPQUFPLGtCQUFrQjs7Ozs7SUFLM0IsWUFBWSxHQUFZLEVBQUUsTUFBVztRQUNqQyxJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQztRQUNmLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO0lBQ3pCLENBQUM7Q0FDSjs7O0lBUEcsaUNBQWE7O0lBQ2Isb0NBQVk7O0FBUWhCLE1BQU0sT0FBTyxrQkFBbUIsU0FBUSxTQUE2Qjs7Ozs7SUFHakUsSUFBSSxJQUFJO1FBQ0osT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDO0lBQ3RCLENBQUM7Ozs7O0lBRUQsWUFBWSxHQUFZLEVBQUUsTUFBVztRQUNqQyxLQUFLLEVBQUUsQ0FBQztRQUNSLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxrQkFBa0IsQ0FBQyxHQUFHLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDckQsQ0FBQztDQUVKIiwic291cmNlc0NvbnRlbnQiOlsiLyohXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTkgQWxmcmVzY28gU29mdHdhcmUsIEx0ZC5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0IHsgQmFzZUV2ZW50IH0gZnJvbSAnLi4vLi4vLi4vZXZlbnRzJztcbmltcG9ydCB7IERhdGFSb3cgfSBmcm9tICcuLi8uLi9kYXRhL2RhdGEtcm93Lm1vZGVsJztcblxuZXhwb3J0IGNsYXNzIERhdGFSb3dBY3Rpb25Nb2RlbCB7XG5cbiAgICByb3c6IERhdGFSb3c7XG4gICAgYWN0aW9uOiBhbnk7XG5cbiAgICBjb25zdHJ1Y3Rvcihyb3c6IERhdGFSb3csIGFjdGlvbjogYW55KSB7XG4gICAgICAgIHRoaXMucm93ID0gcm93O1xuICAgICAgICB0aGlzLmFjdGlvbiA9IGFjdGlvbjtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBEYXRhUm93QWN0aW9uRXZlbnQgZXh0ZW5kcyBCYXNlRXZlbnQ8RGF0YVJvd0FjdGlvbk1vZGVsPiB7XG5cbiAgICAvLyBiYWNrd2FyZHMgY29tcGF0aWJpbGl0eSB3aXRoIDEuMi4wIGFuZCBlYXJsaWVyXG4gICAgZ2V0IGFyZ3MoKTogRGF0YVJvd0FjdGlvbk1vZGVsIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudmFsdWU7XG4gICAgfVxuXG4gICAgY29uc3RydWN0b3Iocm93OiBEYXRhUm93LCBhY3Rpb246IGFueSkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnZhbHVlID0gbmV3IERhdGFSb3dBY3Rpb25Nb2RlbChyb3csIGFjdGlvbik7XG4gICAgfVxuXG59XG4iXX0=
