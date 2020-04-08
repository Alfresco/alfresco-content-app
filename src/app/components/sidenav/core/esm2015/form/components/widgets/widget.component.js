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
import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation
} from '@angular/core';
import { FormService } from './../../services/form.service';
import { FormFieldModel } from './core/index';
/** @type {?} */
export const baseHost = {
  '(click)': 'event($event)',
  '(blur)': 'event($event)',
  '(change)': 'event($event)',
  '(focus)': 'event($event)',
  '(focusin)': 'event($event)',
  '(focusout)': 'event($event)',
  '(input)': 'event($event)',
  '(invalid)': 'event($event)',
  '(select)': 'event($event)'
};
/**
 * Base widget component.
 */
export class WidgetComponent {
  /**
   * @param {?=} formService
   */
  constructor(formService) {
    this.formService = formService;
    /**
     * Does the widget show a read-only value? (ie, can't be edited)
     */
    this.readOnly = false;
    /**
     * Emitted when a field value changes.
     */
    this.fieldChanged = new EventEmitter();
  }
  /**
   * @return {?}
   */
  hasField() {
    return this.field ? true : false;
  }
  // Note for developers:
  // returns <any> object to be able binding it to the <element required="required"> attribute
  /**
   * @return {?}
   */
  isRequired() {
    if (this.field && this.field.required) {
      return true;
    }
    return null;
  }
  /**
   * @return {?}
   */
  isValid() {
    return this.field.validationSummary ? true : false;
  }
  /**
   * @return {?}
   */
  hasValue() {
    return (
      this.field && this.field.value !== null && this.field.value !== undefined
    );
  }
  /**
   * @return {?}
   */
  isInvalidFieldRequired() {
    return (
      !this.field.isValid && !this.field.validationSummary && this.isRequired()
    );
  }
  /**
   * @return {?}
   */
  ngAfterViewInit() {
    this.fieldChanged.emit(this.field);
  }
  /**
   * @param {?} field
   * @return {?}
   */
  checkVisibility(field) {
    this.fieldChanged.emit(field);
  }
  /**
   * @param {?} field
   * @return {?}
   */
  onFieldChanged(field) {
    this.fieldChanged.emit(field);
  }
  /**
   * @protected
   * @param {?} field
   * @return {?}
   */
  getHyperlinkUrl(field) {
    /** @type {?} */
    let url = WidgetComponent.DEFAULT_HYPERLINK_URL;
    if (field && field.hyperlinkUrl) {
      url = field.hyperlinkUrl;
      if (!/^https?:\/\//i.test(url)) {
        url = `${WidgetComponent.DEFAULT_HYPERLINK_SCHEME}${url}`;
      }
    }
    return url;
  }
  /**
   * @protected
   * @param {?} field
   * @return {?}
   */
  getHyperlinkText(field) {
    if (field) {
      return field.displayText || field.hyperlinkUrl;
    }
    return null;
  }
  /**
   * @param {?} event
   * @return {?}
   */
  event(event) {
    this.formService.formEvents.next(event);
  }
}
WidgetComponent.DEFAULT_HYPERLINK_URL = '#';
WidgetComponent.DEFAULT_HYPERLINK_SCHEME = 'http://';
WidgetComponent.decorators = [
  {
    type: Component,
    args: [
      {
        selector: 'base-widget',
        template: '',
        host: baseHost,
        encapsulation: ViewEncapsulation.None
      }
    ]
  }
];
/** @nocollapse */
WidgetComponent.ctorParameters = () => [{ type: FormService }];
WidgetComponent.propDecorators = {
  readOnly: [{ type: Input }],
  field: [{ type: Input }],
  fieldChanged: [{ type: Output }]
};
if (false) {
  /** @type {?} */
  WidgetComponent.DEFAULT_HYPERLINK_URL;
  /** @type {?} */
  WidgetComponent.DEFAULT_HYPERLINK_SCHEME;
  /**
   * Does the widget show a read-only value? (ie, can't be edited)
   * @type {?}
   */
  WidgetComponent.prototype.readOnly;
  /**
   * Data to be displayed in the field
   * @type {?}
   */
  WidgetComponent.prototype.field;
  /**
   * Emitted when a field value changes.
   * @type {?}
   */
  WidgetComponent.prototype.fieldChanged;
  /** @type {?} */
  WidgetComponent.prototype.formService;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2lkZ2V0LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BhbGZyZXNjby9hZGYtY29yZS8iLCJzb3VyY2VzIjpbImZvcm0vY29tcG9uZW50cy93aWRnZXRzL3dpZGdldC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBbUJBLE9BQU8sRUFBaUIsU0FBUyxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLGlCQUFpQixFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3pHLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSwrQkFBK0IsQ0FBQztBQUM1RCxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sY0FBYyxDQUFDOztBQUU5QyxNQUFNLE9BQU8sUUFBUSxHQUFHO0lBQ3BCLFNBQVMsRUFBRSxlQUFlO0lBQzFCLFFBQVEsRUFBRSxlQUFlO0lBQ3pCLFVBQVUsRUFBRSxlQUFlO0lBQzNCLFNBQVMsRUFBRSxlQUFlO0lBQzFCLFdBQVcsRUFBRSxlQUFlO0lBQzVCLFlBQVksRUFBRSxlQUFlO0lBQzdCLFNBQVMsRUFBRSxlQUFlO0lBQzFCLFdBQVcsRUFBRSxlQUFlO0lBQzVCLFVBQVUsRUFBRSxlQUFlO0NBQzlCOzs7O0FBV0QsTUFBTSxPQUFPLGVBQWU7Ozs7SUFtQnhCLFlBQW1CLFdBQXlCO1FBQXpCLGdCQUFXLEdBQVgsV0FBVyxDQUFjOzs7O1FBWjVDLGFBQVEsR0FBWSxLQUFLLENBQUM7Ozs7UUFVMUIsaUJBQVksR0FBaUMsSUFBSSxZQUFZLEVBQWtCLENBQUM7SUFHaEYsQ0FBQzs7OztJQUVELFFBQVE7UUFDSixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO0lBQ3JDLENBQUM7Ozs7OztJQUlELFVBQVU7UUFDTixJQUFJLElBQUksQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUU7WUFDbkMsT0FBTyxJQUFJLENBQUM7U0FDZjtRQUNELE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7Ozs7SUFFRCxPQUFPO1FBQ0gsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztJQUN2RCxDQUFDOzs7O0lBRUQsUUFBUTtRQUNKLE9BQU8sSUFBSSxDQUFDLEtBQUs7WUFDYixJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssS0FBSyxJQUFJO1lBQ3pCLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxLQUFLLFNBQVMsQ0FBQztJQUN2QyxDQUFDOzs7O0lBRUQsc0JBQXNCO1FBQ2xCLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsaUJBQWlCLElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO0lBQ3JGLENBQUM7Ozs7SUFFRCxlQUFlO1FBQ1gsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3ZDLENBQUM7Ozs7O0lBRUQsZUFBZSxDQUFDLEtBQXFCO1FBQ2pDLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ2xDLENBQUM7Ozs7O0lBRUQsY0FBYyxDQUFDLEtBQXFCO1FBQ2hDLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ2xDLENBQUM7Ozs7OztJQUVTLGVBQWUsQ0FBQyxLQUFxQjs7WUFDdkMsR0FBRyxHQUFHLGVBQWUsQ0FBQyxxQkFBcUI7UUFDL0MsSUFBSSxLQUFLLElBQUksS0FBSyxDQUFDLFlBQVksRUFBRTtZQUM3QixHQUFHLEdBQUcsS0FBSyxDQUFDLFlBQVksQ0FBQztZQUN6QixJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRTtnQkFDNUIsR0FBRyxHQUFHLEdBQUcsZUFBZSxDQUFDLHdCQUF3QixHQUFHLEdBQUcsRUFBRSxDQUFDO2FBQzdEO1NBQ0o7UUFDRCxPQUFPLEdBQUcsQ0FBQztJQUNmLENBQUM7Ozs7OztJQUVTLGdCQUFnQixDQUFDLEtBQXFCO1FBQzVDLElBQUksS0FBSyxFQUFFO1lBQ1AsT0FBTyxLQUFLLENBQUMsV0FBVyxJQUFJLEtBQUssQ0FBQyxZQUFZLENBQUM7U0FDbEQ7UUFDRCxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDOzs7OztJQUVELEtBQUssQ0FBQyxLQUFZO1FBQ2QsSUFBSSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzVDLENBQUM7O0FBL0VNLHFDQUFxQixHQUFXLEdBQUcsQ0FBQztBQUNwQyx3Q0FBd0IsR0FBVyxTQUFTLENBQUM7O1lBVHZELFNBQVMsU0FBQztnQkFDUCxRQUFRLEVBQUUsYUFBYTtnQkFDdkIsUUFBUSxFQUFFLEVBQUU7Z0JBQ1osSUFBSSxFQUFFLFFBQVE7Z0JBQ2QsYUFBYSxFQUFFLGlCQUFpQixDQUFDLElBQUk7YUFDeEM7Ozs7WUF2QlEsV0FBVzs7O3VCQThCZixLQUFLO29CQUlMLEtBQUs7MkJBTUwsTUFBTTs7OztJQWRQLHNDQUEyQzs7SUFDM0MseUNBQW9EOzs7OztJQUdwRCxtQ0FDMEI7Ozs7O0lBRzFCLGdDQUNzQjs7Ozs7SUFLdEIsdUNBQ2dGOztJQUVwRSxzQ0FBZ0MiLCJzb3VyY2VzQ29udGVudCI6WyIvKiFcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxOSBBbGZyZXNjbyBTb2Z0d2FyZSwgTHRkLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG4vKiB0c2xpbnQ6ZGlzYWJsZTpjb21wb25lbnQtc2VsZWN0b3IgICovXG5cbmltcG9ydCB7IEFmdGVyVmlld0luaXQsIENvbXBvbmVudCwgRXZlbnRFbWl0dGVyLCBJbnB1dCwgT3V0cHV0LCBWaWV3RW5jYXBzdWxhdGlvbiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRm9ybVNlcnZpY2UgfSBmcm9tICcuLy4uLy4uL3NlcnZpY2VzL2Zvcm0uc2VydmljZSc7XG5pbXBvcnQgeyBGb3JtRmllbGRNb2RlbCB9IGZyb20gJy4vY29yZS9pbmRleCc7XG5cbmV4cG9ydCBjb25zdCBiYXNlSG9zdCA9IHtcbiAgICAnKGNsaWNrKSc6ICdldmVudCgkZXZlbnQpJyxcbiAgICAnKGJsdXIpJzogJ2V2ZW50KCRldmVudCknLFxuICAgICcoY2hhbmdlKSc6ICdldmVudCgkZXZlbnQpJyxcbiAgICAnKGZvY3VzKSc6ICdldmVudCgkZXZlbnQpJyxcbiAgICAnKGZvY3VzaW4pJzogJ2V2ZW50KCRldmVudCknLFxuICAgICcoZm9jdXNvdXQpJzogJ2V2ZW50KCRldmVudCknLFxuICAgICcoaW5wdXQpJzogJ2V2ZW50KCRldmVudCknLFxuICAgICcoaW52YWxpZCknOiAnZXZlbnQoJGV2ZW50KScsXG4gICAgJyhzZWxlY3QpJzogJ2V2ZW50KCRldmVudCknXG59O1xuXG4vKipcbiAqIEJhc2Ugd2lkZ2V0IGNvbXBvbmVudC5cbiAqL1xuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdiYXNlLXdpZGdldCcsXG4gICAgdGVtcGxhdGU6ICcnLFxuICAgIGhvc3Q6IGJhc2VIb3N0LFxuICAgIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmVcbn0pXG5leHBvcnQgY2xhc3MgV2lkZ2V0Q29tcG9uZW50IGltcGxlbWVudHMgQWZ0ZXJWaWV3SW5pdCB7XG5cbiAgICBzdGF0aWMgREVGQVVMVF9IWVBFUkxJTktfVVJMOiBzdHJpbmcgPSAnIyc7XG4gICAgc3RhdGljIERFRkFVTFRfSFlQRVJMSU5LX1NDSEVNRTogc3RyaW5nID0gJ2h0dHA6Ly8nO1xuXG4gICAgLyoqIERvZXMgdGhlIHdpZGdldCBzaG93IGEgcmVhZC1vbmx5IHZhbHVlPyAoaWUsIGNhbid0IGJlIGVkaXRlZCkgKi9cbiAgICBASW5wdXQoKVxuICAgIHJlYWRPbmx5OiBib29sZWFuID0gZmFsc2U7XG5cbiAgICAvKiogRGF0YSB0byBiZSBkaXNwbGF5ZWQgaW4gdGhlIGZpZWxkICovXG4gICAgQElucHV0KClcbiAgICBmaWVsZDogRm9ybUZpZWxkTW9kZWw7XG5cbiAgICAvKipcbiAgICAgKiBFbWl0dGVkIHdoZW4gYSBmaWVsZCB2YWx1ZSBjaGFuZ2VzLlxuICAgICAqL1xuICAgIEBPdXRwdXQoKVxuICAgIGZpZWxkQ2hhbmdlZDogRXZlbnRFbWl0dGVyPEZvcm1GaWVsZE1vZGVsPiA9IG5ldyBFdmVudEVtaXR0ZXI8Rm9ybUZpZWxkTW9kZWw+KCk7XG5cbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgZm9ybVNlcnZpY2U/OiBGb3JtU2VydmljZSkge1xuICAgIH1cblxuICAgIGhhc0ZpZWxkKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5maWVsZCA/IHRydWUgOiBmYWxzZTtcbiAgICB9XG5cbiAgICAvLyBOb3RlIGZvciBkZXZlbG9wZXJzOlxuICAgIC8vIHJldHVybnMgPGFueT4gb2JqZWN0IHRvIGJlIGFibGUgYmluZGluZyBpdCB0byB0aGUgPGVsZW1lbnQgcmVxdWlyZWQ9XCJyZXF1aXJlZFwiPiBhdHRyaWJ1dGVcbiAgICBpc1JlcXVpcmVkKCk6IGFueSB7XG4gICAgICAgIGlmICh0aGlzLmZpZWxkICYmIHRoaXMuZmllbGQucmVxdWlyZWQpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGlzVmFsaWQoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLmZpZWxkLnZhbGlkYXRpb25TdW1tYXJ5ID8gdHJ1ZSA6IGZhbHNlO1xuICAgIH1cblxuICAgIGhhc1ZhbHVlKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5maWVsZCAmJlxuICAgICAgICAgICAgdGhpcy5maWVsZC52YWx1ZSAhPT0gbnVsbCAmJlxuICAgICAgICAgICAgdGhpcy5maWVsZC52YWx1ZSAhPT0gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIGlzSW52YWxpZEZpZWxkUmVxdWlyZWQoKSB7XG4gICAgICAgIHJldHVybiAhdGhpcy5maWVsZC5pc1ZhbGlkICYmICF0aGlzLmZpZWxkLnZhbGlkYXRpb25TdW1tYXJ5ICYmIHRoaXMuaXNSZXF1aXJlZCgpO1xuICAgIH1cblxuICAgIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICAgICAgdGhpcy5maWVsZENoYW5nZWQuZW1pdCh0aGlzLmZpZWxkKTtcbiAgICB9XG5cbiAgICBjaGVja1Zpc2liaWxpdHkoZmllbGQ6IEZvcm1GaWVsZE1vZGVsKSB7XG4gICAgICAgIHRoaXMuZmllbGRDaGFuZ2VkLmVtaXQoZmllbGQpO1xuICAgIH1cblxuICAgIG9uRmllbGRDaGFuZ2VkKGZpZWxkOiBGb3JtRmllbGRNb2RlbCkge1xuICAgICAgICB0aGlzLmZpZWxkQ2hhbmdlZC5lbWl0KGZpZWxkKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgZ2V0SHlwZXJsaW5rVXJsKGZpZWxkOiBGb3JtRmllbGRNb2RlbCkge1xuICAgICAgICBsZXQgdXJsID0gV2lkZ2V0Q29tcG9uZW50LkRFRkFVTFRfSFlQRVJMSU5LX1VSTDtcbiAgICAgICAgaWYgKGZpZWxkICYmIGZpZWxkLmh5cGVybGlua1VybCkge1xuICAgICAgICAgICAgdXJsID0gZmllbGQuaHlwZXJsaW5rVXJsO1xuICAgICAgICAgICAgaWYgKCEvXmh0dHBzPzpcXC9cXC8vaS50ZXN0KHVybCkpIHtcbiAgICAgICAgICAgICAgICB1cmwgPSBgJHtXaWRnZXRDb21wb25lbnQuREVGQVVMVF9IWVBFUkxJTktfU0NIRU1FfSR7dXJsfWA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHVybDtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgZ2V0SHlwZXJsaW5rVGV4dChmaWVsZDogRm9ybUZpZWxkTW9kZWwpIHtcbiAgICAgICAgaWYgKGZpZWxkKSB7XG4gICAgICAgICAgICByZXR1cm4gZmllbGQuZGlzcGxheVRleHQgfHwgZmllbGQuaHlwZXJsaW5rVXJsO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGV2ZW50KGV2ZW50OiBFdmVudCk6IHZvaWQge1xuICAgICAgICB0aGlzLmZvcm1TZXJ2aWNlLmZvcm1FdmVudHMubmV4dChldmVudCk7XG4gICAgfVxufVxuIl19
