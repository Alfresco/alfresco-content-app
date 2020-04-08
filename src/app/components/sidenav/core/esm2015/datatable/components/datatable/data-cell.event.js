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
export class DataCellEventModel {
  /**
   * @param {?} row
   * @param {?} col
   * @param {?} actions
   */
  constructor(row, col, actions) {
    this.row = row;
    this.col = col;
    this.actions = actions || [];
  }
}
if (false) {
  /** @type {?} */
  DataCellEventModel.prototype.row;
  /** @type {?} */
  DataCellEventModel.prototype.col;
  /** @type {?} */
  DataCellEventModel.prototype.actions;
}
export class DataCellEvent extends BaseEvent {
  /**
   * @param {?} row
   * @param {?} col
   * @param {?} actions
   */
  constructor(row, col, actions) {
    super();
    this.value = new DataCellEventModel(row, col, actions);
  }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YS1jZWxsLmV2ZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vQGFsZnJlc2NvL2FkZi1jb3JlLyIsInNvdXJjZXMiOlsiZGF0YXRhYmxlL2NvbXBvbmVudHMvZGF0YXRhYmxlL2RhdGEtY2VsbC5ldmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWlCQSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFJNUMsTUFBTSxPQUFPLGtCQUFrQjs7Ozs7O0lBTTNCLFlBQVksR0FBWSxFQUFFLEdBQWUsRUFBRSxPQUFjO1FBQ3JELElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO1FBQ2YsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7UUFDZixJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sSUFBSSxFQUFFLENBQUM7SUFDakMsQ0FBQztDQUVKOzs7SUFWRyxpQ0FBc0I7O0lBQ3RCLGlDQUF5Qjs7SUFDekIscUNBQWU7O0FBVW5CLE1BQU0sT0FBTyxhQUFjLFNBQVEsU0FBNkI7Ozs7OztJQUU1RCxZQUFZLEdBQVksRUFBRSxHQUFlLEVBQUUsT0FBYztRQUNyRCxLQUFLLEVBQUUsQ0FBQztRQUNSLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxrQkFBa0IsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQzNELENBQUM7Q0FFSiIsInNvdXJjZXNDb250ZW50IjpbIi8qIVxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE5IEFsZnJlc2NvIFNvZnR3YXJlLCBMdGQuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbmltcG9ydCB7IEJhc2VFdmVudCB9IGZyb20gJy4uLy4uLy4uL2V2ZW50cyc7XG5pbXBvcnQgeyBEYXRhQ29sdW1uIH0gZnJvbSAnLi4vLi4vZGF0YS9kYXRhLWNvbHVtbi5tb2RlbCc7XG5pbXBvcnQgeyBEYXRhUm93IH0gZnJvbSAnLi4vLi4vZGF0YS9kYXRhLXJvdy5tb2RlbCc7XG5cbmV4cG9ydCBjbGFzcyBEYXRhQ2VsbEV2ZW50TW9kZWwge1xuXG4gICAgcmVhZG9ubHkgcm93OiBEYXRhUm93O1xuICAgIHJlYWRvbmx5IGNvbDogRGF0YUNvbHVtbjtcbiAgICBhY3Rpb25zOiBhbnlbXTtcblxuICAgIGNvbnN0cnVjdG9yKHJvdzogRGF0YVJvdywgY29sOiBEYXRhQ29sdW1uLCBhY3Rpb25zOiBhbnlbXSkge1xuICAgICAgICB0aGlzLnJvdyA9IHJvdztcbiAgICAgICAgdGhpcy5jb2wgPSBjb2w7XG4gICAgICAgIHRoaXMuYWN0aW9ucyA9IGFjdGlvbnMgfHwgW107XG4gICAgfVxuXG59XG5cbmV4cG9ydCBjbGFzcyBEYXRhQ2VsbEV2ZW50IGV4dGVuZHMgQmFzZUV2ZW50PERhdGFDZWxsRXZlbnRNb2RlbD4ge1xuXG4gICAgY29uc3RydWN0b3Iocm93OiBEYXRhUm93LCBjb2w6IERhdGFDb2x1bW4sIGFjdGlvbnM6IGFueVtdKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMudmFsdWUgPSBuZXcgRGF0YUNlbGxFdmVudE1vZGVsKHJvdywgY29sLCBhY3Rpb25zKTtcbiAgICB9XG5cbn1cbiJdfQ==
