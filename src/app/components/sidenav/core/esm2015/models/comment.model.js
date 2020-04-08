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
export class CommentModel {
  /**
   * @param {?=} obj
   */
  constructor(obj) {
    if (obj) {
      this.id = obj.id;
      this.message = obj.message;
      this.created = obj.created;
      this.createdBy = obj.createdBy;
      this.isSelected = obj.isSelected ? obj.isSelected : false;
    }
  }
}
if (false) {
  /** @type {?} */
  CommentModel.prototype.id;
  /** @type {?} */
  CommentModel.prototype.message;
  /** @type {?} */
  CommentModel.prototype.created;
  /** @type {?} */
  CommentModel.prototype.createdBy;
  /** @type {?} */
  CommentModel.prototype.isSelected;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbWVudC5tb2RlbC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BhbGZyZXNjby9hZGYtY29yZS8iLCJzb3VyY2VzIjpbIm1vZGVscy9jb21tZW50Lm1vZGVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBbUJBLE1BQU0sT0FBTyxZQUFZOzs7O0lBT3JCLFlBQVksR0FBUztRQUNqQixJQUFJLEdBQUcsRUFBRTtZQUNMLElBQUksQ0FBQyxFQUFFLEdBQUcsR0FBRyxDQUFDLEVBQUUsQ0FBQztZQUNqQixJQUFJLENBQUMsT0FBTyxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUM7WUFDM0IsSUFBSSxDQUFDLE9BQU8sR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDO1lBQzNCLElBQUksQ0FBQyxTQUFTLEdBQUcsR0FBRyxDQUFDLFNBQVMsQ0FBQztZQUMvQixJQUFJLENBQUMsVUFBVSxHQUFHLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztTQUM3RDtJQUNMLENBQUM7Q0FDSjs7O0lBZkcsMEJBQVc7O0lBQ1gsK0JBQWdCOztJQUNoQiwrQkFBYzs7SUFDZCxpQ0FBa0I7O0lBQ2xCLGtDQUFvQiIsInNvdXJjZXNDb250ZW50IjpbIi8qIVxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE5IEFsZnJlc2NvIFNvZnR3YXJlLCBMdGQuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbmltcG9ydCB7IFBlcnNvbiB9IGZyb20gJ0BhbGZyZXNjby9qcy1hcGknO1xuXG5leHBvcnQgY2xhc3MgQ29tbWVudE1vZGVsIHtcbiAgICBpZDogbnVtYmVyO1xuICAgIG1lc3NhZ2U6IHN0cmluZztcbiAgICBjcmVhdGVkOiBEYXRlO1xuICAgIGNyZWF0ZWRCeTogUGVyc29uO1xuICAgIGlzU2VsZWN0ZWQ6IGJvb2xlYW47XG5cbiAgICBjb25zdHJ1Y3RvcihvYmo/OiBhbnkpIHtcbiAgICAgICAgaWYgKG9iaikge1xuICAgICAgICAgICAgdGhpcy5pZCA9IG9iai5pZDtcbiAgICAgICAgICAgIHRoaXMubWVzc2FnZSA9IG9iai5tZXNzYWdlO1xuICAgICAgICAgICAgdGhpcy5jcmVhdGVkID0gb2JqLmNyZWF0ZWQ7XG4gICAgICAgICAgICB0aGlzLmNyZWF0ZWRCeSA9IG9iai5jcmVhdGVkQnk7XG4gICAgICAgICAgICB0aGlzLmlzU2VsZWN0ZWQgPSBvYmouaXNTZWxlY3RlZCA/IG9iai5pc1NlbGVjdGVkIDogZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG59XG4iXX0=
