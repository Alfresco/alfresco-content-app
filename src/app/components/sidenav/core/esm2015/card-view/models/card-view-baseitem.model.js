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
 * @abstract
 */
export class CardViewBaseItemModel {
  /**
   * @param {?} cardViewItemProperties
   */
  constructor(cardViewItemProperties) {
    this.label = cardViewItemProperties.label || '';
    this.value =
      (cardViewItemProperties.value &&
        cardViewItemProperties.value.displayName) ||
      cardViewItemProperties.value;
    this.key = cardViewItemProperties.key;
    this.default = cardViewItemProperties.default;
    this.editable = !!cardViewItemProperties.editable;
    this.clickable = !!cardViewItemProperties.clickable;
    this.icon = cardViewItemProperties.icon || '';
    this.validators = cardViewItemProperties.validators || [];
    this.data = cardViewItemProperties.data || null;
  }
  /**
   * @return {?}
   */
  isEmpty() {
    return this.value === undefined || this.value === null || this.value === '';
  }
  /**
   * @param {?} newValue
   * @return {?}
   */
  isValid(newValue) {
    if (!this.validators.length) {
      return true;
    }
    return this.validators
      .map(
        /**
         * @param {?} validator
         * @return {?}
         */
        validator => validator.isValid(newValue)
      )
      .reduce(
        /**
         * @param {?} isValidUntilNow
         * @param {?} isValid
         * @return {?}
         */
        (isValidUntilNow, isValid) => isValidUntilNow && isValid,
        true
      );
  }
  /**
   * @param {?} value
   * @return {?}
   */
  getValidationErrors(value) {
    if (!this.validators.length) {
      return [];
    }
    return this.validators
      .filter(
        /**
         * @param {?} validator
         * @return {?}
         */
        validator => !validator.isValid(value)
      )
      .map(
        /**
         * @param {?} validator
         * @return {?}
         */
        validator => validator.message
      );
  }
}
if (false) {
  /** @type {?} */
  CardViewBaseItemModel.prototype.label;
  /** @type {?} */
  CardViewBaseItemModel.prototype.value;
  /** @type {?} */
  CardViewBaseItemModel.prototype.key;
  /** @type {?} */
  CardViewBaseItemModel.prototype.default;
  /** @type {?} */
  CardViewBaseItemModel.prototype.editable;
  /** @type {?} */
  CardViewBaseItemModel.prototype.clickable;
  /** @type {?} */
  CardViewBaseItemModel.prototype.icon;
  /** @type {?} */
  CardViewBaseItemModel.prototype.validators;
  /** @type {?} */
  CardViewBaseItemModel.prototype.data;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FyZC12aWV3LWJhc2VpdGVtLm1vZGVsLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQGFsZnJlc2NvL2FkZi1jb3JlLyIsInNvdXJjZXMiOlsiY2FyZC12aWV3L21vZGVscy9jYXJkLXZpZXctYmFzZWl0ZW0ubW9kZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFtQkEsTUFBTSxPQUFnQixxQkFBcUI7Ozs7SUFXdkMsWUFBWSxzQkFBOEM7UUFDdEQsSUFBSSxDQUFDLEtBQUssR0FBRyxzQkFBc0IsQ0FBQyxLQUFLLElBQUksRUFBRSxDQUFDO1FBQ2hELElBQUksQ0FBQyxLQUFLLEdBQUcsc0JBQXNCLENBQUMsS0FBSyxJQUFJLHNCQUFzQixDQUFDLEtBQUssQ0FBQyxXQUFXLElBQUksc0JBQXNCLENBQUMsS0FBSyxDQUFDO1FBQ3RILElBQUksQ0FBQyxHQUFHLEdBQUcsc0JBQXNCLENBQUMsR0FBRyxDQUFDO1FBQ3RDLElBQUksQ0FBQyxPQUFPLEdBQUcsc0JBQXNCLENBQUMsT0FBTyxDQUFDO1FBQzlDLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDLHNCQUFzQixDQUFDLFFBQVEsQ0FBQztRQUNsRCxJQUFJLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQyxzQkFBc0IsQ0FBQyxTQUFTLENBQUM7UUFDcEQsSUFBSSxDQUFDLElBQUksR0FBRyxzQkFBc0IsQ0FBQyxJQUFJLElBQUksRUFBRSxDQUFDO1FBQzlDLElBQUksQ0FBQyxVQUFVLEdBQUcsc0JBQXNCLENBQUMsVUFBVSxJQUFJLEVBQUUsQ0FBQztRQUMxRCxJQUFJLENBQUMsSUFBSSxHQUFHLHNCQUFzQixDQUFDLElBQUksSUFBSSxJQUFJLENBQUM7SUFDcEQsQ0FBQzs7OztJQUVELE9BQU87UUFDSCxPQUFPLElBQUksQ0FBQyxLQUFLLEtBQUssU0FBUyxJQUFJLElBQUksQ0FBQyxLQUFLLEtBQUssSUFBSSxJQUFJLElBQUksQ0FBQyxLQUFLLEtBQUssRUFBRSxDQUFDO0lBQ2hGLENBQUM7Ozs7O0lBRUQsT0FBTyxDQUFDLFFBQWE7UUFDakIsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFO1lBQ3pCLE9BQU8sSUFBSSxDQUFDO1NBQ2Y7UUFFRCxPQUFPLElBQUksQ0FBQyxVQUFVO2FBQ2pCLEdBQUc7Ozs7UUFBQyxDQUFDLFNBQVMsRUFBRSxFQUFFLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsRUFBQzthQUMvQyxNQUFNOzs7OztRQUFDLENBQUMsZUFBZSxFQUFFLE9BQU8sRUFBRSxFQUFFLENBQUMsZUFBZSxJQUFJLE9BQU8sR0FBRSxJQUFJLENBQUMsQ0FBQztJQUNoRixDQUFDOzs7OztJQUVELG1CQUFtQixDQUFDLEtBQUs7UUFDckIsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFO1lBQ3pCLE9BQU8sRUFBRSxDQUFDO1NBQ2I7UUFFRCxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTTs7OztRQUFDLENBQUMsU0FBUyxFQUFFLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUMsQ0FBQyxHQUFHOzs7O1FBQUMsQ0FBQyxTQUFTLEVBQUUsRUFBRSxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUMsQ0FBQztJQUNsSCxDQUFDO0NBQ0o7OztJQTNDRyxzQ0FBYzs7SUFDZCxzQ0FBVzs7SUFDWCxvQ0FBUzs7SUFDVCx3Q0FBYTs7SUFDYix5Q0FBa0I7O0lBQ2xCLDBDQUFtQjs7SUFDbkIscUNBQWM7O0lBQ2QsMkNBQXFDOztJQUNyQyxxQ0FBVyIsInNvdXJjZXNDb250ZW50IjpbIi8qIVxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE5IEFsZnJlc2NvIFNvZnR3YXJlLCBMdGQuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbmltcG9ydCB7IENhcmRWaWV3SXRlbVByb3BlcnRpZXMsIENhcmRWaWV3SXRlbVZhbGlkYXRvciB9IGZyb20gJy4uL2ludGVyZmFjZXMvY2FyZC12aWV3LmludGVyZmFjZXMnO1xuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgQ2FyZFZpZXdCYXNlSXRlbU1vZGVsIHtcbiAgICBsYWJlbDogc3RyaW5nO1xuICAgIHZhbHVlOiBhbnk7XG4gICAga2V5OiBhbnk7XG4gICAgZGVmYXVsdDogYW55O1xuICAgIGVkaXRhYmxlOiBib29sZWFuO1xuICAgIGNsaWNrYWJsZTogYm9vbGVhbjtcbiAgICBpY29uPzogc3RyaW5nO1xuICAgIHZhbGlkYXRvcnM/OiBDYXJkVmlld0l0ZW1WYWxpZGF0b3JbXTtcbiAgICBkYXRhPzogYW55O1xuXG4gICAgY29uc3RydWN0b3IoY2FyZFZpZXdJdGVtUHJvcGVydGllczogQ2FyZFZpZXdJdGVtUHJvcGVydGllcykge1xuICAgICAgICB0aGlzLmxhYmVsID0gY2FyZFZpZXdJdGVtUHJvcGVydGllcy5sYWJlbCB8fCAnJztcbiAgICAgICAgdGhpcy52YWx1ZSA9IGNhcmRWaWV3SXRlbVByb3BlcnRpZXMudmFsdWUgJiYgY2FyZFZpZXdJdGVtUHJvcGVydGllcy52YWx1ZS5kaXNwbGF5TmFtZSB8fCBjYXJkVmlld0l0ZW1Qcm9wZXJ0aWVzLnZhbHVlO1xuICAgICAgICB0aGlzLmtleSA9IGNhcmRWaWV3SXRlbVByb3BlcnRpZXMua2V5O1xuICAgICAgICB0aGlzLmRlZmF1bHQgPSBjYXJkVmlld0l0ZW1Qcm9wZXJ0aWVzLmRlZmF1bHQ7XG4gICAgICAgIHRoaXMuZWRpdGFibGUgPSAhIWNhcmRWaWV3SXRlbVByb3BlcnRpZXMuZWRpdGFibGU7XG4gICAgICAgIHRoaXMuY2xpY2thYmxlID0gISFjYXJkVmlld0l0ZW1Qcm9wZXJ0aWVzLmNsaWNrYWJsZTtcbiAgICAgICAgdGhpcy5pY29uID0gY2FyZFZpZXdJdGVtUHJvcGVydGllcy5pY29uIHx8ICcnO1xuICAgICAgICB0aGlzLnZhbGlkYXRvcnMgPSBjYXJkVmlld0l0ZW1Qcm9wZXJ0aWVzLnZhbGlkYXRvcnMgfHwgW107XG4gICAgICAgIHRoaXMuZGF0YSA9IGNhcmRWaWV3SXRlbVByb3BlcnRpZXMuZGF0YSB8fCBudWxsO1xuICAgIH1cblxuICAgIGlzRW1wdHkoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLnZhbHVlID09PSB1bmRlZmluZWQgfHwgdGhpcy52YWx1ZSA9PT0gbnVsbCB8fCB0aGlzLnZhbHVlID09PSAnJztcbiAgICB9XG5cbiAgICBpc1ZhbGlkKG5ld1ZhbHVlOiBhbnkpOiBib29sZWFuIHtcbiAgICAgICAgaWYgKCF0aGlzLnZhbGlkYXRvcnMubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLnZhbGlkYXRvcnNcbiAgICAgICAgICAgIC5tYXAoKHZhbGlkYXRvcikgPT4gdmFsaWRhdG9yLmlzVmFsaWQobmV3VmFsdWUpKVxuICAgICAgICAgICAgLnJlZHVjZSgoaXNWYWxpZFVudGlsTm93LCBpc1ZhbGlkKSA9PiBpc1ZhbGlkVW50aWxOb3cgJiYgaXNWYWxpZCwgdHJ1ZSk7XG4gICAgfVxuXG4gICAgZ2V0VmFsaWRhdGlvbkVycm9ycyh2YWx1ZSk6IHN0cmluZ1tdIHtcbiAgICAgICAgaWYgKCF0aGlzLnZhbGlkYXRvcnMubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy52YWxpZGF0b3JzLmZpbHRlcigodmFsaWRhdG9yKSA9PiAhdmFsaWRhdG9yLmlzVmFsaWQodmFsdWUpKS5tYXAoKHZhbGlkYXRvcikgPT4gdmFsaWRhdG9yLm1lc3NhZ2UpO1xuICAgIH1cbn1cbiJdfQ==
