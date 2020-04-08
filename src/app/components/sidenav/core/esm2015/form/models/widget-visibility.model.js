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
export class WidgetVisibilityModel {
  /**
   * @param {?=} json
   */
  constructor(json) {
    this.json = json;
    if (json) {
      this.operator = json.operator;
      this.nextCondition = new WidgetVisibilityModel(json.nextCondition);
      this.nextConditionOperator = json.nextConditionOperator;
      this.rightRestResponseId = json.rightRestResponseId;
      this.rightFormFieldId = json.rightFormFieldId;
      this.leftFormFieldId = json.leftFormFieldId;
      this.leftRestResponseId = json.leftRestResponseId;
    } else {
      this.json = {};
    }
  }
  /**
   * @return {?}
   */
  get leftType() {
    if (this.leftFormFieldId) {
      return WidgetTypeEnum.field;
    } else if (this.leftRestResponseId) {
      return WidgetTypeEnum.variable;
    } else if (!!this.json.leftType) {
      return this.json.leftType;
    }
    return null;
  }
  /**
   * @param {?} leftType
   * @return {?}
   */
  set leftType(leftType) {
    this.json.leftType = leftType;
  }
  /**
   * @return {?}
   */
  get leftValue() {
    if (this.json.leftValue) {
      return this.json.leftValue;
    } else if (this.leftFormFieldId) {
      return this.leftFormFieldId;
    } else {
      return this.leftRestResponseId;
    }
  }
  /**
   * @param {?} leftValue
   * @return {?}
   */
  set leftValue(leftValue) {
    this.json.leftValue = leftValue;
  }
  /**
   * @return {?}
   */
  get rightType() {
    if (!!this.json.rightType) {
      return this.json.rightType;
    } else if (this.json.rightValue) {
      return WidgetTypeEnum.value;
    } else if (this.rightRestResponseId) {
      return WidgetTypeEnum.variable;
    } else if (this.rightFormFieldId) {
      return WidgetTypeEnum.field;
    }
    return null;
  }
  /**
   * @param {?} rightType
   * @return {?}
   */
  set rightType(rightType) {
    this.json.rightType = rightType;
  }
  /**
   * @return {?}
   */
  get rightValue() {
    if (this.json.rightValue) {
      return this.json.rightValue;
    } else if (this.rightFormFieldId) {
      return this.rightFormFieldId;
    } else {
      return this.rightRestResponseId;
    }
  }
  /**
   * @param {?} rightValue
   * @return {?}
   */
  set rightValue(rightValue) {
    this.json.rightValue = rightValue;
  }
}
if (false) {
  /** @type {?} */
  WidgetVisibilityModel.prototype.rightRestResponseId;
  /** @type {?} */
  WidgetVisibilityModel.prototype.rightFormFieldId;
  /** @type {?} */
  WidgetVisibilityModel.prototype.leftRestResponseId;
  /** @type {?} */
  WidgetVisibilityModel.prototype.leftFormFieldId;
  /** @type {?} */
  WidgetVisibilityModel.prototype.operator;
  /** @type {?} */
  WidgetVisibilityModel.prototype.nextCondition;
  /** @type {?} */
  WidgetVisibilityModel.prototype.nextConditionOperator;
  /**
   * @type {?}
   * @private
   */
  WidgetVisibilityModel.prototype.json;
}
/** @enum {string} */
const WidgetTypeEnum = {
  field: 'field',
  variable: 'variable',
  value: 'value'
};
export { WidgetTypeEnum };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2lkZ2V0LXZpc2liaWxpdHkubW9kZWwuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AYWxmcmVzY28vYWRmLWNvcmUvIiwic291cmNlcyI6WyJmb3JtL21vZGVscy93aWRnZXQtdmlzaWJpbGl0eS5tb2RlbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWlCQSxNQUFNLE9BQU8scUJBQXFCOzs7O0lBUzlCLFlBQW9CLElBQVU7UUFBVixTQUFJLEdBQUosSUFBSSxDQUFNO1FBQzFCLElBQUksSUFBSSxFQUFFO1lBQ04sSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO1lBQzlCLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7WUFDbkUsSUFBSSxDQUFDLHFCQUFxQixHQUFHLElBQUksQ0FBQyxxQkFBcUIsQ0FBQztZQUN4RCxJQUFJLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDO1lBQ3BELElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUM7WUFDOUMsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDO1lBQzVDLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUM7U0FDckQ7YUFBTTtZQUNILElBQUksQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFDO1NBQ2xCO0lBQ0wsQ0FBQzs7OztJQUVELElBQUksUUFBUTtRQUNSLElBQUksSUFBSSxDQUFDLGVBQWUsRUFBRTtZQUN0QixPQUFPLGNBQWMsQ0FBQyxLQUFLLENBQUM7U0FDL0I7YUFBTSxJQUFJLElBQUksQ0FBQyxrQkFBa0IsRUFBRTtZQUNoQyxPQUFPLGNBQWMsQ0FBQyxRQUFRLENBQUM7U0FDbEM7YUFBTSxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUM3QixPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDO1NBQzdCO1FBQ0QsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQzs7Ozs7SUFFRCxJQUFJLFFBQVEsQ0FBQyxRQUFnQjtRQUN6QixJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7SUFDbEMsQ0FBQzs7OztJQUVELElBQUksU0FBUztRQUNULElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUU7WUFDckIsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQztTQUM5QjthQUFNLElBQUksSUFBSSxDQUFDLGVBQWUsRUFBRTtZQUM3QixPQUFPLElBQUksQ0FBQyxlQUFlLENBQUM7U0FDL0I7YUFBTTtZQUNILE9BQU8sSUFBSSxDQUFDLGtCQUFrQixDQUFDO1NBQ2xDO0lBQ0wsQ0FBQzs7Ozs7SUFFRCxJQUFJLFNBQVMsQ0FBQyxTQUFjO1FBQ3hCLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztJQUNwQyxDQUFDOzs7O0lBRUQsSUFBSSxTQUFTO1FBQ1QsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUU7WUFDdkIsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQztTQUM5QjthQUFNLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUU7WUFDN0IsT0FBTyxjQUFjLENBQUMsS0FBSyxDQUFDO1NBQy9CO2FBQU0sSUFBSSxJQUFJLENBQUMsbUJBQW1CLEVBQUU7WUFDakMsT0FBTyxjQUFjLENBQUMsUUFBUSxDQUFDO1NBQ2xDO2FBQU0sSUFBSSxJQUFJLENBQUMsZ0JBQWdCLEVBQUU7WUFDOUIsT0FBTyxjQUFjLENBQUMsS0FBSyxDQUFDO1NBQy9CO1FBRUQsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQzs7Ozs7SUFFRCxJQUFJLFNBQVMsQ0FBQyxTQUFpQjtRQUMzQixJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7SUFDcEMsQ0FBQzs7OztJQUVELElBQUksVUFBVTtRQUNWLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUU7WUFDdEIsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQztTQUMvQjthQUFNLElBQUksSUFBSSxDQUFDLGdCQUFnQixFQUFFO1lBQzlCLE9BQU8sSUFBSSxDQUFDLGdCQUFnQixDQUFDO1NBQ2hDO2FBQU07WUFDSCxPQUFPLElBQUksQ0FBQyxtQkFBbUIsQ0FBQztTQUNuQztJQUNMLENBQUM7Ozs7O0lBRUQsSUFBSSxVQUFVLENBQUMsVUFBZTtRQUMxQixJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7SUFDdEMsQ0FBQztDQUNKOzs7SUFsRkcsb0RBQTZCOztJQUM3QixpREFBMEI7O0lBQzFCLG1EQUE0Qjs7SUFDNUIsZ0RBQXlCOztJQUN6Qix5Q0FBaUI7O0lBQ2pCLDhDQUFxQzs7SUFDckMsc0RBQThCOzs7OztJQUVsQixxQ0FBa0I7Ozs7SUE2RTlCLE9BQVEsT0FBTztJQUNmLFVBQVcsVUFBVTtJQUNyQixPQUFRLE9BQU8iLCJzb3VyY2VzQ29udGVudCI6WyIvKiFcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxOSBBbGZyZXNjbyBTb2Z0d2FyZSwgTHRkLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5leHBvcnQgY2xhc3MgV2lkZ2V0VmlzaWJpbGl0eU1vZGVsIHtcbiAgICByaWdodFJlc3RSZXNwb25zZUlkPzogc3RyaW5nO1xuICAgIHJpZ2h0Rm9ybUZpZWxkSWQ/OiBzdHJpbmc7XG4gICAgbGVmdFJlc3RSZXNwb25zZUlkPzogc3RyaW5nO1xuICAgIGxlZnRGb3JtRmllbGRJZD86IHN0cmluZztcbiAgICBvcGVyYXRvcjogc3RyaW5nO1xuICAgIG5leHRDb25kaXRpb246IFdpZGdldFZpc2liaWxpdHlNb2RlbDtcbiAgICBuZXh0Q29uZGl0aW9uT3BlcmF0b3I6IHN0cmluZztcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUganNvbj86IGFueSkge1xuICAgICAgICBpZiAoanNvbikge1xuICAgICAgICAgICAgdGhpcy5vcGVyYXRvciA9IGpzb24ub3BlcmF0b3I7XG4gICAgICAgICAgICB0aGlzLm5leHRDb25kaXRpb24gPSBuZXcgV2lkZ2V0VmlzaWJpbGl0eU1vZGVsKGpzb24ubmV4dENvbmRpdGlvbik7XG4gICAgICAgICAgICB0aGlzLm5leHRDb25kaXRpb25PcGVyYXRvciA9IGpzb24ubmV4dENvbmRpdGlvbk9wZXJhdG9yO1xuICAgICAgICAgICAgdGhpcy5yaWdodFJlc3RSZXNwb25zZUlkID0ganNvbi5yaWdodFJlc3RSZXNwb25zZUlkO1xuICAgICAgICAgICAgdGhpcy5yaWdodEZvcm1GaWVsZElkID0ganNvbi5yaWdodEZvcm1GaWVsZElkO1xuICAgICAgICAgICAgdGhpcy5sZWZ0Rm9ybUZpZWxkSWQgPSBqc29uLmxlZnRGb3JtRmllbGRJZDtcbiAgICAgICAgICAgIHRoaXMubGVmdFJlc3RSZXNwb25zZUlkID0ganNvbi5sZWZ0UmVzdFJlc3BvbnNlSWQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmpzb24gPSB7fTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldCBsZWZ0VHlwZSgpOiBzdHJpbmcge1xuICAgICAgICBpZiAodGhpcy5sZWZ0Rm9ybUZpZWxkSWQpIHtcbiAgICAgICAgICAgIHJldHVybiBXaWRnZXRUeXBlRW51bS5maWVsZDtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmxlZnRSZXN0UmVzcG9uc2VJZCkge1xuICAgICAgICAgICAgcmV0dXJuIFdpZGdldFR5cGVFbnVtLnZhcmlhYmxlO1xuICAgICAgICB9IGVsc2UgaWYgKCEhdGhpcy5qc29uLmxlZnRUeXBlKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5qc29uLmxlZnRUeXBlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHNldCBsZWZ0VHlwZShsZWZ0VHlwZTogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuanNvbi5sZWZ0VHlwZSA9IGxlZnRUeXBlO1xuICAgIH1cblxuICAgIGdldCBsZWZ0VmFsdWUoKTogYW55IHtcbiAgICAgICAgaWYgKHRoaXMuanNvbi5sZWZ0VmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmpzb24ubGVmdFZhbHVlO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMubGVmdEZvcm1GaWVsZElkKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5sZWZ0Rm9ybUZpZWxkSWQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5sZWZ0UmVzdFJlc3BvbnNlSWQ7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzZXQgbGVmdFZhbHVlKGxlZnRWYWx1ZTogYW55KSB7XG4gICAgICAgIHRoaXMuanNvbi5sZWZ0VmFsdWUgPSBsZWZ0VmFsdWU7XG4gICAgfVxuXG4gICAgZ2V0IHJpZ2h0VHlwZSgpOiBzdHJpbmcge1xuICAgICAgICBpZiAoISF0aGlzLmpzb24ucmlnaHRUeXBlKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5qc29uLnJpZ2h0VHlwZTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmpzb24ucmlnaHRWYWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIFdpZGdldFR5cGVFbnVtLnZhbHVlO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMucmlnaHRSZXN0UmVzcG9uc2VJZCkge1xuICAgICAgICAgICAgcmV0dXJuIFdpZGdldFR5cGVFbnVtLnZhcmlhYmxlO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMucmlnaHRGb3JtRmllbGRJZCkge1xuICAgICAgICAgICAgcmV0dXJuIFdpZGdldFR5cGVFbnVtLmZpZWxkO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgc2V0IHJpZ2h0VHlwZShyaWdodFR5cGU6IHN0cmluZykge1xuICAgICAgICB0aGlzLmpzb24ucmlnaHRUeXBlID0gcmlnaHRUeXBlO1xuICAgIH1cblxuICAgIGdldCByaWdodFZhbHVlKCk6IGFueSB7XG4gICAgICAgIGlmICh0aGlzLmpzb24ucmlnaHRWYWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuanNvbi5yaWdodFZhbHVlO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMucmlnaHRGb3JtRmllbGRJZCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucmlnaHRGb3JtRmllbGRJZDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJpZ2h0UmVzdFJlc3BvbnNlSWQ7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzZXQgcmlnaHRWYWx1ZShyaWdodFZhbHVlOiBhbnkpIHtcbiAgICAgICAgdGhpcy5qc29uLnJpZ2h0VmFsdWUgPSByaWdodFZhbHVlO1xuICAgIH1cbn1cblxuZXhwb3J0IGVudW0gV2lkZ2V0VHlwZUVudW0ge1xuICAgIGZpZWxkID0gJ2ZpZWxkJyxcbiAgICB2YXJpYWJsZSA9ICd2YXJpYWJsZScsXG4gICAgdmFsdWUgPSAndmFsdWUnXG59XG4iXX0=
