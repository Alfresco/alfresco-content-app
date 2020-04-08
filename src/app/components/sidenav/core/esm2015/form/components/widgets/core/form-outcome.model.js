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
import { FormWidgetModel } from './form-widget.model';
export class FormOutcomeModel extends FormWidgetModel {
  /**
   * @param {?} form
   * @param {?=} json
   */
  constructor(form, json) {
    super(form, json);
    // Activiti 'Start Process' action name
    this.isSystem = false;
    this.isSelected = false;
    if (json) {
      this.isSystem = json.isSystem ? true : false;
      this.isSelected =
        form && json.name === form.selectedOutcome ? true : false;
    }
  }
}
FormOutcomeModel.SAVE_ACTION = 'SAVE'; // Activiti 'Save' action name
// Activiti 'Save' action name
FormOutcomeModel.COMPLETE_ACTION = 'COMPLETE'; // Activiti 'Complete' action name
// Activiti 'Complete' action name
FormOutcomeModel.START_PROCESS_ACTION = 'START PROCESS'; // Activiti 'Start Process' action name
if (false) {
  /** @type {?} */
  FormOutcomeModel.SAVE_ACTION;
  /** @type {?} */
  FormOutcomeModel.COMPLETE_ACTION;
  /** @type {?} */
  FormOutcomeModel.START_PROCESS_ACTION;
  /** @type {?} */
  FormOutcomeModel.prototype.isSystem;
  /** @type {?} */
  FormOutcomeModel.prototype.isSelected;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybS1vdXRjb21lLm1vZGVsLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQGFsZnJlc2NvL2FkZi1jb3JlLyIsInNvdXJjZXMiOlsiZm9ybS9jb21wb25lbnRzL3dpZGdldHMvY29yZS9mb3JtLW91dGNvbWUubW9kZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBbUJBLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUd0RCxNQUFNLE9BQU8sZ0JBQWlCLFNBQVEsZUFBZTs7Ozs7SUFTakQsWUFBWSxJQUFlLEVBQUUsSUFBVTtRQUNuQyxLQUFLLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDOztRQUp0QixhQUFRLEdBQVksS0FBSyxDQUFDO1FBQzFCLGVBQVUsR0FBWSxLQUFLLENBQUM7UUFLeEIsSUFBSSxJQUFJLEVBQUU7WUFDTixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO1lBQzdDLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7U0FDL0U7SUFDTCxDQUFDOztBQWRNLDRCQUFXLEdBQVcsTUFBTSxDQUFDLENBQVksOEJBQThCOztBQUN2RSxnQ0FBZSxHQUFXLFVBQVUsQ0FBQyxDQUFJLGtDQUFrQzs7QUFDM0UscUNBQW9CLEdBQVcsZUFBZSxDQUFDLENBQUksdUNBQXVDOzs7SUFGakcsNkJBQW9DOztJQUNwQyxpQ0FBNEM7O0lBQzVDLHNDQUFzRDs7SUFFdEQsb0NBQTBCOztJQUMxQixzQ0FBNEIiLCJzb3VyY2VzQ29udGVudCI6WyIvKiFcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxOSBBbGZyZXNjbyBTb2Z0d2FyZSwgTHRkLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG4gLyogdHNsaW50OmRpc2FibGU6Y29tcG9uZW50LXNlbGVjdG9yICAqL1xuXG5pbXBvcnQgeyBGb3JtV2lkZ2V0TW9kZWwgfSBmcm9tICcuL2Zvcm0td2lkZ2V0Lm1vZGVsJztcbmltcG9ydCB7IEZvcm1Nb2RlbCB9IGZyb20gJy4vZm9ybS5tb2RlbCc7XG5cbmV4cG9ydCBjbGFzcyBGb3JtT3V0Y29tZU1vZGVsIGV4dGVuZHMgRm9ybVdpZGdldE1vZGVsIHtcblxuICAgIHN0YXRpYyBTQVZFX0FDVElPTjogc3RyaW5nID0gJ1NBVkUnOyAgICAgICAgICAgIC8vIEFjdGl2aXRpICdTYXZlJyBhY3Rpb24gbmFtZVxuICAgIHN0YXRpYyBDT01QTEVURV9BQ1RJT046IHN0cmluZyA9ICdDT01QTEVURSc7ICAgIC8vIEFjdGl2aXRpICdDb21wbGV0ZScgYWN0aW9uIG5hbWVcbiAgICBzdGF0aWMgU1RBUlRfUFJPQ0VTU19BQ1RJT046IHN0cmluZyA9ICdTVEFSVCBQUk9DRVNTJzsgICAgLy8gQWN0aXZpdGkgJ1N0YXJ0IFByb2Nlc3MnIGFjdGlvbiBuYW1lXG5cbiAgICBpc1N5c3RlbTogYm9vbGVhbiA9IGZhbHNlO1xuICAgIGlzU2VsZWN0ZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgIGNvbnN0cnVjdG9yKGZvcm06IEZvcm1Nb2RlbCwganNvbj86IGFueSkge1xuICAgICAgICBzdXBlcihmb3JtLCBqc29uKTtcblxuICAgICAgICBpZiAoanNvbikge1xuICAgICAgICAgICAgdGhpcy5pc1N5c3RlbSA9IGpzb24uaXNTeXN0ZW0gPyB0cnVlIDogZmFsc2U7XG4gICAgICAgICAgICB0aGlzLmlzU2VsZWN0ZWQgPSBmb3JtICYmIGpzb24ubmFtZSA9PT0gZm9ybS5zZWxlY3RlZE91dGNvbWUgPyB0cnVlIDogZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG59XG4iXX0=
