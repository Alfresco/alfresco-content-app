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
export class ErrorMessageModel {
  /**
   * @param {?=} obj
   */
  constructor(obj) {
    this.message = '';
    this.attributes = null;
    this.message = obj && obj.message ? obj.message : '';
    this.attributes = new Map();
  }
  /**
   * @return {?}
   */
  isActive() {
    return this.message ? true : false;
  }
  /**
   * @return {?}
   */
  getAttributesAsJsonObj() {
    /** @type {?} */
    let result = {};
    if (this.attributes.size > 0) {
      /** @type {?} */
      const obj = Object.create(null);
      this.attributes.forEach(
        /**
         * @param {?} value
         * @param {?} key
         * @return {?}
         */
        (value, key) => {
          obj[key] = value;
        }
      );
      result = JSON.stringify(obj);
    }
    return result;
  }
}
if (false) {
  /** @type {?} */
  ErrorMessageModel.prototype.message;
  /** @type {?} */
  ErrorMessageModel.prototype.attributes;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXJyb3ItbWVzc2FnZS5tb2RlbC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BhbGZyZXNjby9hZGYtY29yZS8iLCJzb3VyY2VzIjpbImZvcm0vY29tcG9uZW50cy93aWRnZXRzL2NvcmUvZXJyb3ItbWVzc2FnZS5tb2RlbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFtQkEsTUFBTSxPQUFPLGlCQUFpQjs7OztJQUsxQixZQUFZLEdBQVM7UUFIckIsWUFBTyxHQUFXLEVBQUUsQ0FBQztRQUNyQixlQUFVLEdBQXdCLElBQUksQ0FBQztRQUduQyxJQUFJLENBQUMsT0FBTyxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7UUFDckQsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFDO0lBQ2hDLENBQUM7Ozs7SUFFRCxRQUFRO1FBQ0osT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztJQUN2QyxDQUFDOzs7O0lBRUQsc0JBQXNCOztZQUNkLE1BQU0sR0FBRyxFQUFFO1FBQ2YsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksR0FBRyxDQUFDLEVBQUU7O2tCQUNwQixHQUFHLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7WUFDL0IsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPOzs7OztZQUFDLENBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxFQUFFO2dCQUNuQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsS0FBSyxDQUFDO1lBQ3JCLENBQUMsRUFBQyxDQUFDO1lBQ0gsTUFBTSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDaEM7UUFDRCxPQUFPLE1BQU0sQ0FBQztJQUNsQixDQUFDO0NBQ0o7OztJQXZCRyxvQ0FBcUI7O0lBQ3JCLHVDQUF1QyIsInNvdXJjZXNDb250ZW50IjpbIi8qIVxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE5IEFsZnJlc2NvIFNvZnR3YXJlLCBMdGQuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbi8qIHRzbGludDpkaXNhYmxlOmNvbXBvbmVudC1zZWxlY3RvciAgKi9cblxuZXhwb3J0IGNsYXNzIEVycm9yTWVzc2FnZU1vZGVsIHtcblxuICAgIG1lc3NhZ2U6IHN0cmluZyA9ICcnO1xuICAgIGF0dHJpYnV0ZXM6IE1hcDxzdHJpbmcsIHN0cmluZz4gPSBudWxsO1xuXG4gICAgY29uc3RydWN0b3Iob2JqPzogYW55KSB7XG4gICAgICAgIHRoaXMubWVzc2FnZSA9IG9iaiAmJiBvYmoubWVzc2FnZSA/IG9iai5tZXNzYWdlIDogJyc7XG4gICAgICAgIHRoaXMuYXR0cmlidXRlcyA9IG5ldyBNYXAoKTtcbiAgICB9XG5cbiAgICBpc0FjdGl2ZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubWVzc2FnZSA/IHRydWUgOiBmYWxzZTtcbiAgICB9XG5cbiAgICBnZXRBdHRyaWJ1dGVzQXNKc29uT2JqKCkge1xuICAgICAgICBsZXQgcmVzdWx0ID0ge307XG4gICAgICAgIGlmICh0aGlzLmF0dHJpYnV0ZXMuc2l6ZSA+IDApIHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgICAgICAgICB0aGlzLmF0dHJpYnV0ZXMuZm9yRWFjaCgodmFsdWUsIGtleSkgPT4ge1xuICAgICAgICAgICAgICAgIG9ialtrZXldID0gdmFsdWU7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJlc3VsdCA9IEpTT04uc3RyaW5naWZ5KG9iaik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG59XG4iXX0=
