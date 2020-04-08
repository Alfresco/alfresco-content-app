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
import { getType } from './get-type';
/**
 * @record
 */
export function DynamicComponentModel() {}
if (false) {
  /** @type {?} */
  DynamicComponentModel.prototype.type;
}
export class DynamicComponentResolver {
  /**
   * @param {?} type
   * @return {?}
   */
  static fromType(type) {
    return getType(type);
  }
}
/**
 * @abstract
 */
export class DynamicComponentMapper {
  constructor() {
    this.defaultValue = undefined;
    this.types = {};
  }
  /**
   * Gets the currently active DynamicComponentResolveFunction for a field type.
   * @param {?} type The type whose resolver you want
   * @param {?=} defaultValue Default type returned for types that are not yet mapped
   * @return {?} Resolver function
   */
  getComponentTypeResolver(type, defaultValue = this.defaultValue) {
    if (type) {
      return (
        this.types[type] || DynamicComponentResolver.fromType(defaultValue)
      );
    }
    return DynamicComponentResolver.fromType(defaultValue);
  }
  /**
   * Sets or optionally replaces a DynamicComponentResolveFunction for a field type.
   * @param {?} type The type whose resolver you want to set
   * @param {?} resolver The new resolver function
   * @param {?=} override The new resolver will only replace an existing one if this parameter is true
   * @return {?}
   */
  setComponentTypeResolver(type, resolver, override = true) {
    if (!type) {
      throw new Error(`type is null or not defined`);
    }
    if (!resolver) {
      throw new Error(`resolver is null or not defined`);
    }
    /** @type {?} */
    const existing = this.types[type];
    if (existing && !override) {
      throw new Error(
        `already mapped, use override option if you intend replacing existing mapping.`
      );
    }
    this.types[type] = resolver;
  }
  /**
   * Finds the component type that is needed to render a form field.
   * @param {?} model Form field model for the field to render
   * @param {?=} defaultValue Default type returned for field types that are not yet mapped.
   * @return {?} Component type
   */
  resolveComponentType(model, defaultValue = this.defaultValue) {
    if (model) {
      /** @type {?} */
      const resolver = this.getComponentTypeResolver(model.type, defaultValue);
      return resolver(model);
    }
    return defaultValue;
  }
}
if (false) {
  /**
   * @type {?}
   * @protected
   */
  DynamicComponentMapper.prototype.defaultValue;
  /**
   * @type {?}
   * @protected
   */
  DynamicComponentMapper.prototype.types;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHluYW1pYy1jb21wb25lbnQtbWFwcGVyLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AYWxmcmVzY28vYWRmLWNvcmUvIiwic291cmNlcyI6WyJzZXJ2aWNlcy9keW5hbWljLWNvbXBvbmVudC1tYXBwZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWtCQSxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sWUFBWSxDQUFDOzs7O0FBRXJDLDJDQUF3RDs7O0lBQWYscUNBQWE7O0FBRXRELE1BQU0sT0FBTyx3QkFBd0I7Ozs7O0lBQ2pDLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBYztRQUMxQixPQUFPLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN6QixDQUFDO0NBQ0o7Ozs7QUFFRCxNQUFNLE9BQWdCLHNCQUFzQjtJQUE1QztRQUVjLGlCQUFZLEdBQWEsU0FBUyxDQUFDO1FBQ25DLFVBQUssR0FBdUQsRUFBRSxDQUFDO0lBbUQ3RSxDQUFDOzs7Ozs7O0lBM0NHLHdCQUF3QixDQUFDLElBQVksRUFBRSxlQUF5QixJQUFJLENBQUMsWUFBWTtRQUM3RSxJQUFJLElBQUksRUFBRTtZQUNOLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSx3QkFBd0IsQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLENBQUM7U0FDOUU7UUFDRCxPQUFPLHdCQUF3QixDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUMzRCxDQUFDOzs7Ozs7OztJQVFELHdCQUF3QixDQUFDLElBQVksRUFBRSxRQUF5QyxFQUFFLFdBQW9CLElBQUk7UUFDdEcsSUFBSSxDQUFDLElBQUksRUFBRTtZQUNQLE1BQU0sSUFBSSxLQUFLLENBQUMsNkJBQTZCLENBQUMsQ0FBQztTQUNsRDtRQUVELElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDWCxNQUFNLElBQUksS0FBSyxDQUFDLGlDQUFpQyxDQUFDLENBQUM7U0FDdEQ7O2NBRUssUUFBUSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDO1FBQ2pDLElBQUksUUFBUSxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ3ZCLE1BQU0sSUFBSSxLQUFLLENBQUMsK0VBQStFLENBQUMsQ0FBQztTQUNwRztRQUVELElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsUUFBUSxDQUFDO0lBQ2hDLENBQUM7Ozs7Ozs7SUFRRCxvQkFBb0IsQ0FBQyxLQUE0QixFQUFFLGVBQXlCLElBQUksQ0FBQyxZQUFZO1FBQ3pGLElBQUksS0FBSyxFQUFFOztrQkFDRCxRQUFRLEdBQUcsSUFBSSxDQUFDLHdCQUF3QixDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsWUFBWSxDQUFDO1lBQ3hFLE9BQU8sUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQzFCO1FBQ0QsT0FBTyxZQUFZLENBQUM7SUFDeEIsQ0FBQztDQUNKOzs7Ozs7SUFwREcsOENBQTZDOzs7OztJQUM3Qyx1Q0FBeUUiLCJzb3VyY2VzQ29udGVudCI6WyIvKiFcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxOSBBbGZyZXNjbyBTb2Z0d2FyZSwgTHRkLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgeyBUeXBlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBnZXRUeXBlIH0gZnJvbSAnLi9nZXQtdHlwZSc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgRHluYW1pY0NvbXBvbmVudE1vZGVsIHsgdHlwZTogc3RyaW5nOyB9XG5leHBvcnQgdHlwZSBEeW5hbWljQ29tcG9uZW50UmVzb2x2ZUZ1bmN0aW9uID0gKG1vZGVsOiBEeW5hbWljQ29tcG9uZW50TW9kZWwpID0+IFR5cGU8e30+O1xuZXhwb3J0IGNsYXNzIER5bmFtaWNDb21wb25lbnRSZXNvbHZlciB7XG4gICAgc3RhdGljIGZyb21UeXBlKHR5cGU6IFR5cGU8e30+KTogRHluYW1pY0NvbXBvbmVudFJlc29sdmVGdW5jdGlvbiB7XG4gICAgICAgIHJldHVybiBnZXRUeXBlKHR5cGUpO1xuICAgIH1cbn1cblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIER5bmFtaWNDb21wb25lbnRNYXBwZXIge1xuXG4gICAgcHJvdGVjdGVkIGRlZmF1bHRWYWx1ZTogVHlwZTx7fT4gPSB1bmRlZmluZWQ7XG4gICAgcHJvdGVjdGVkIHR5cGVzOiB7IFtrZXk6IHN0cmluZ106IER5bmFtaWNDb21wb25lbnRSZXNvbHZlRnVuY3Rpb24gfSA9IHt9O1xuXG4gICAgLyoqXG4gICAgICogR2V0cyB0aGUgY3VycmVudGx5IGFjdGl2ZSBEeW5hbWljQ29tcG9uZW50UmVzb2x2ZUZ1bmN0aW9uIGZvciBhIGZpZWxkIHR5cGUuXG4gICAgICogQHBhcmFtIHR5cGUgVGhlIHR5cGUgd2hvc2UgcmVzb2x2ZXIgeW91IHdhbnRcbiAgICAgKiBAcGFyYW0gZGVmYXVsdFZhbHVlIERlZmF1bHQgdHlwZSByZXR1cm5lZCBmb3IgdHlwZXMgdGhhdCBhcmUgbm90IHlldCBtYXBwZWRcbiAgICAgKiBAcmV0dXJucyBSZXNvbHZlciBmdW5jdGlvblxuICAgICAqL1xuICAgIGdldENvbXBvbmVudFR5cGVSZXNvbHZlcih0eXBlOiBzdHJpbmcsIGRlZmF1bHRWYWx1ZTogVHlwZTx7fT4gPSB0aGlzLmRlZmF1bHRWYWx1ZSk6IER5bmFtaWNDb21wb25lbnRSZXNvbHZlRnVuY3Rpb24ge1xuICAgICAgICBpZiAodHlwZSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudHlwZXNbdHlwZV0gfHwgRHluYW1pY0NvbXBvbmVudFJlc29sdmVyLmZyb21UeXBlKGRlZmF1bHRWYWx1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIER5bmFtaWNDb21wb25lbnRSZXNvbHZlci5mcm9tVHlwZShkZWZhdWx0VmFsdWUpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNldHMgb3Igb3B0aW9uYWxseSByZXBsYWNlcyBhIER5bmFtaWNDb21wb25lbnRSZXNvbHZlRnVuY3Rpb24gZm9yIGEgZmllbGQgdHlwZS5cbiAgICAgKiBAcGFyYW0gdHlwZSBUaGUgdHlwZSB3aG9zZSByZXNvbHZlciB5b3Ugd2FudCB0byBzZXRcbiAgICAgKiBAcGFyYW0gcmVzb2x2ZXIgVGhlIG5ldyByZXNvbHZlciBmdW5jdGlvblxuICAgICAqIEBwYXJhbSBvdmVycmlkZSBUaGUgbmV3IHJlc29sdmVyIHdpbGwgb25seSByZXBsYWNlIGFuIGV4aXN0aW5nIG9uZSBpZiB0aGlzIHBhcmFtZXRlciBpcyB0cnVlXG4gICAgICovXG4gICAgc2V0Q29tcG9uZW50VHlwZVJlc29sdmVyKHR5cGU6IHN0cmluZywgcmVzb2x2ZXI6IER5bmFtaWNDb21wb25lbnRSZXNvbHZlRnVuY3Rpb24sIG92ZXJyaWRlOiBib29sZWFuID0gdHJ1ZSkge1xuICAgICAgICBpZiAoIXR5cGUpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgdHlwZSBpcyBudWxsIG9yIG5vdCBkZWZpbmVkYCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXJlc29sdmVyKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYHJlc29sdmVyIGlzIG51bGwgb3Igbm90IGRlZmluZWRgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGV4aXN0aW5nID0gdGhpcy50eXBlc1t0eXBlXTtcbiAgICAgICAgaWYgKGV4aXN0aW5nICYmICFvdmVycmlkZSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBhbHJlYWR5IG1hcHBlZCwgdXNlIG92ZXJyaWRlIG9wdGlvbiBpZiB5b3UgaW50ZW5kIHJlcGxhY2luZyBleGlzdGluZyBtYXBwaW5nLmApO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy50eXBlc1t0eXBlXSA9IHJlc29sdmVyO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEZpbmRzIHRoZSBjb21wb25lbnQgdHlwZSB0aGF0IGlzIG5lZWRlZCB0byByZW5kZXIgYSBmb3JtIGZpZWxkLlxuICAgICAqIEBwYXJhbSBtb2RlbCBGb3JtIGZpZWxkIG1vZGVsIGZvciB0aGUgZmllbGQgdG8gcmVuZGVyXG4gICAgICogQHBhcmFtIGRlZmF1bHRWYWx1ZSBEZWZhdWx0IHR5cGUgcmV0dXJuZWQgZm9yIGZpZWxkIHR5cGVzIHRoYXQgYXJlIG5vdCB5ZXQgbWFwcGVkLlxuICAgICAqIEByZXR1cm5zIENvbXBvbmVudCB0eXBlXG4gICAgICovXG4gICAgcmVzb2x2ZUNvbXBvbmVudFR5cGUobW9kZWw6IER5bmFtaWNDb21wb25lbnRNb2RlbCwgZGVmYXVsdFZhbHVlOiBUeXBlPHt9PiA9IHRoaXMuZGVmYXVsdFZhbHVlKTogVHlwZTx7fT4ge1xuICAgICAgICBpZiAobW9kZWwpIHtcbiAgICAgICAgICAgIGNvbnN0IHJlc29sdmVyID0gdGhpcy5nZXRDb21wb25lbnRUeXBlUmVzb2x2ZXIobW9kZWwudHlwZSwgZGVmYXVsdFZhbHVlKTtcbiAgICAgICAgICAgIHJldHVybiByZXNvbHZlcihtb2RlbCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRlZmF1bHRWYWx1ZTtcbiAgICB9XG59XG4iXX0=
