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
import { WidgetVisibilityModel } from '../../../models/widget-visibility.model';
import { FormWidgetModel } from './form-widget.model';
export class TabModel extends FormWidgetModel {
  /**
   * @param {?} form
   * @param {?=} json
   */
  constructor(form, json) {
    super(form, json);
    this.isVisible = true;
    this.fields = [];
    if (json) {
      this.title = json.title;
      this.visibilityCondition = new WidgetVisibilityModel(
        json.visibilityCondition
      );
    }
  }
  /**
   * @return {?}
   */
  hasContent() {
    return this.fields && this.fields.length > 0;
  }
}
if (false) {
  /** @type {?} */
  TabModel.prototype.title;
  /** @type {?} */
  TabModel.prototype.isVisible;
  /** @type {?} */
  TabModel.prototype.visibilityCondition;
  /** @type {?} */
  TabModel.prototype.fields;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFiLm1vZGVsLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQGFsZnJlc2NvL2FkZi1jb3JlLyIsInNvdXJjZXMiOlsiZm9ybS9jb21wb25lbnRzL3dpZGdldHMvY29yZS90YWIubW9kZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBbUJBLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLHlDQUF5QyxDQUFDO0FBQ2hGLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUd0RCxNQUFNLE9BQU8sUUFBUyxTQUFRLGVBQWU7Ozs7O0lBWXpDLFlBQVksSUFBZSxFQUFFLElBQVU7UUFDbkMsS0FBSyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztRQVZ0QixjQUFTLEdBQVksSUFBSSxDQUFDO1FBRzFCLFdBQU0sR0FBc0IsRUFBRSxDQUFDO1FBUzNCLElBQUksSUFBSSxFQUFFO1lBQ04sSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO1lBQ3hCLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLHFCQUFxQixDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO1NBQ2xGO0lBQ0wsQ0FBQzs7OztJQVhELFVBQVU7UUFDTixPQUFPLElBQUksQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0lBQ2pELENBQUM7Q0FVSjs7O0lBbEJHLHlCQUFjOztJQUNkLDZCQUEwQjs7SUFDMUIsdUNBQTJDOztJQUUzQywwQkFBK0IiLCJzb3VyY2VzQ29udGVudCI6WyIvKiFcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxOSBBbGZyZXNjbyBTb2Z0d2FyZSwgTHRkLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG4gLyogdHNsaW50OmRpc2FibGU6Y29tcG9uZW50LXNlbGVjdG9yICAqL1xuXG5pbXBvcnQgeyBXaWRnZXRWaXNpYmlsaXR5TW9kZWwgfSBmcm9tICcuLi8uLi8uLi9tb2RlbHMvd2lkZ2V0LXZpc2liaWxpdHkubW9kZWwnO1xuaW1wb3J0IHsgRm9ybVdpZGdldE1vZGVsIH0gZnJvbSAnLi9mb3JtLXdpZGdldC5tb2RlbCc7XG5pbXBvcnQgeyBGb3JtTW9kZWwgfSBmcm9tICcuL2Zvcm0ubW9kZWwnO1xuXG5leHBvcnQgY2xhc3MgVGFiTW9kZWwgZXh0ZW5kcyBGb3JtV2lkZ2V0TW9kZWwge1xuXG4gICAgdGl0bGU6IHN0cmluZztcbiAgICBpc1Zpc2libGU6IGJvb2xlYW4gPSB0cnVlO1xuICAgIHZpc2liaWxpdHlDb25kaXRpb246IFdpZGdldFZpc2liaWxpdHlNb2RlbDtcblxuICAgIGZpZWxkczogRm9ybVdpZGdldE1vZGVsW10gPSBbXTtcblxuICAgIGhhc0NvbnRlbnQoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLmZpZWxkcyAmJiB0aGlzLmZpZWxkcy5sZW5ndGggPiAwO1xuICAgIH1cblxuICAgIGNvbnN0cnVjdG9yKGZvcm06IEZvcm1Nb2RlbCwganNvbj86IGFueSkge1xuICAgICAgICBzdXBlcihmb3JtLCBqc29uKTtcblxuICAgICAgICBpZiAoanNvbikge1xuICAgICAgICAgICAgdGhpcy50aXRsZSA9IGpzb24udGl0bGU7XG4gICAgICAgICAgICB0aGlzLnZpc2liaWxpdHlDb25kaXRpb24gPSBuZXcgV2lkZ2V0VmlzaWJpbGl0eU1vZGVsKGpzb24udmlzaWJpbGl0eUNvbmRpdGlvbik7XG4gICAgICAgIH1cbiAgICB9XG59XG4iXX0=
