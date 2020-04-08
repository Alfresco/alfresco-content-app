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
export class ContainerColumnModel {
  constructor() {
    this.size = 12;
    this.fields = [];
    this.colspan = 1;
    this.rowspan = 1;
  }
  /**
   * @return {?}
   */
  hasFields() {
    return this.fields && this.fields.length > 0;
  }
}
if (false) {
  /** @type {?} */
  ContainerColumnModel.prototype.size;
  /** @type {?} */
  ContainerColumnModel.prototype.fields;
  /** @type {?} */
  ContainerColumnModel.prototype.colspan;
  /** @type {?} */
  ContainerColumnModel.prototype.rowspan;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGFpbmVyLWNvbHVtbi5tb2RlbC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BhbGZyZXNjby9hZGYtY29yZS8iLCJzb3VyY2VzIjpbImZvcm0vY29tcG9uZW50cy93aWRnZXRzL2NvcmUvY29udGFpbmVyLWNvbHVtbi5tb2RlbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFxQkEsTUFBTSxPQUFPLG9CQUFvQjtJQUFqQztRQUVJLFNBQUksR0FBVyxFQUFFLENBQUM7UUFDbEIsV0FBTSxHQUFxQixFQUFFLENBQUM7UUFDOUIsWUFBTyxHQUFXLENBQUMsQ0FBQztRQUNwQixZQUFPLEdBQVcsQ0FBQyxDQUFDO0lBS3hCLENBQUM7Ozs7SUFIRyxTQUFTO1FBQ0wsT0FBTyxJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztJQUNqRCxDQUFDO0NBQ0o7OztJQVJHLG9DQUFrQjs7SUFDbEIsc0NBQThCOztJQUM5Qix1Q0FBb0I7O0lBQ3BCLHVDQUFvQiIsInNvdXJjZXNDb250ZW50IjpbIi8qIVxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE5IEFsZnJlc2NvIFNvZnR3YXJlLCBMdGQuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbi8qIHRzbGludDpkaXNhYmxlOmNvbXBvbmVudC1zZWxlY3RvciAgKi9cblxuaW1wb3J0IHsgRm9ybUZpZWxkTW9kZWwgfSBmcm9tICcuL2Zvcm0tZmllbGQubW9kZWwnO1xuXG5leHBvcnQgY2xhc3MgQ29udGFpbmVyQ29sdW1uTW9kZWwge1xuXG4gICAgc2l6ZTogbnVtYmVyID0gMTI7XG4gICAgZmllbGRzOiBGb3JtRmllbGRNb2RlbFtdID0gW107XG4gICAgY29sc3BhbjogbnVtYmVyID0gMTtcbiAgICByb3dzcGFuOiBudW1iZXIgPSAxO1xuXG4gICAgaGFzRmllbGRzKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5maWVsZHMgJiYgdGhpcy5maWVsZHMubGVuZ3RoID4gMDtcbiAgICB9XG59XG4iXX0=
