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
export class TabsWidgetComponent {
  constructor() {
    this.tabs = [];
    this.formTabChanged = new EventEmitter();
    this.visibleTabs = [];
  }
  /**
   * @return {?}
   */
  hasTabs() {
    return this.tabs && this.tabs.length > 0;
  }
  /**
   * @return {?}
   */
  ngAfterContentChecked() {
    this.filterVisibleTabs();
  }
  /**
   * @return {?}
   */
  filterVisibleTabs() {
    this.visibleTabs = this.tabs.filter(
      /**
       * @param {?} tab
       * @return {?}
       */
      tab => {
        return tab.isVisible;
      }
    );
  }
  /**
   * @param {?} field
   * @return {?}
   */
  tabChanged(field) {
    this.formTabChanged.emit(field);
  }
}
TabsWidgetComponent.decorators = [
  {
    type: Component,
    args: [
      {
        selector: 'tabs-widget',
        template:
          '<div *ngIf="hasTabs()" class="alfresco-tabs-widget">\n    <mat-tab-group>\n        <mat-tab *ngFor="let tab of visibleTabs" [label]="tab.title | translate">\n            <div *ngFor="let field of tab.fields">\n                <adf-form-field [field]="field.field"></adf-form-field>\n             </div>\n        </mat-tab>\n    </mat-tab-group>\n</div>\n',
        encapsulation: ViewEncapsulation.None
      }
    ]
  }
];
TabsWidgetComponent.propDecorators = {
  tabs: [{ type: Input }],
  formTabChanged: [{ type: Output }]
};
if (false) {
  /** @type {?} */
  TabsWidgetComponent.prototype.tabs;
  /** @type {?} */
  TabsWidgetComponent.prototype.formTabChanged;
  /** @type {?} */
  TabsWidgetComponent.prototype.visibleTabs;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFicy53aWRnZXQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AYWxmcmVzY28vYWRmLWNvcmUvIiwic291cmNlcyI6WyJmb3JtL2NvbXBvbmVudHMvd2lkZ2V0cy90YWJzL3RhYnMud2lkZ2V0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW1CQSxPQUFPLEVBQXVCLFNBQVMsRUFBRSxZQUFZLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQVEvRyxNQUFNLE9BQU8sbUJBQW1CO0lBTGhDO1FBUUksU0FBSSxHQUFlLEVBQUUsQ0FBQztRQUd0QixtQkFBYyxHQUFpQyxJQUFJLFlBQVksRUFBa0IsQ0FBQztRQUVsRixnQkFBVyxHQUFlLEVBQUUsQ0FBQztJQW9CakMsQ0FBQzs7OztJQWxCRyxPQUFPO1FBQ0gsT0FBTyxJQUFJLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztJQUM3QyxDQUFDOzs7O0lBRUQscUJBQXFCO1FBQ2pCLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO0lBQzdCLENBQUM7Ozs7SUFFRCxpQkFBaUI7UUFDYixJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTTs7OztRQUFDLENBQUMsR0FBRyxFQUFFLEVBQUU7WUFDeEMsT0FBTyxHQUFHLENBQUMsU0FBUyxDQUFDO1FBQ3pCLENBQUMsRUFBQyxDQUFDO0lBQ1AsQ0FBQzs7Ozs7SUFFRCxVQUFVLENBQUMsS0FBcUI7UUFDNUIsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDcEMsQ0FBQzs7O1lBL0JKLFNBQVMsU0FBQztnQkFDUCxRQUFRLEVBQUUsYUFBYTtnQkFDdkIsMFhBQWlDO2dCQUNqQyxhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTthQUN4Qzs7O21CQUdJLEtBQUs7NkJBR0wsTUFBTTs7OztJQUhQLG1DQUNzQjs7SUFFdEIsNkNBQ2tGOztJQUVsRiwwQ0FBNkIiLCJzb3VyY2VzQ29udGVudCI6WyIvKiFcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxOSBBbGZyZXNjbyBTb2Z0d2FyZSwgTHRkLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG4gLyogdHNsaW50OmRpc2FibGU6Y29tcG9uZW50LXNlbGVjdG9yICAqL1xuXG5pbXBvcnQgeyBBZnRlckNvbnRlbnRDaGVja2VkLCBDb21wb25lbnQsIEV2ZW50RW1pdHRlciwgSW5wdXQsIE91dHB1dCwgVmlld0VuY2Fwc3VsYXRpb24gfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEZvcm1GaWVsZE1vZGVsLCBUYWJNb2RlbCB9IGZyb20gJy4vLi4vY29yZS9pbmRleCc7XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAndGFicy13aWRnZXQnLFxuICAgIHRlbXBsYXRlVXJsOiAnLi90YWJzLndpZGdldC5odG1sJyxcbiAgICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lXG59KVxuZXhwb3J0IGNsYXNzIFRhYnNXaWRnZXRDb21wb25lbnQgaW1wbGVtZW50cyBBZnRlckNvbnRlbnRDaGVja2VkIHtcblxuICAgIEBJbnB1dCgpXG4gICAgdGFiczogVGFiTW9kZWxbXSA9IFtdO1xuXG4gICAgQE91dHB1dCgpXG4gICAgZm9ybVRhYkNoYW5nZWQ6IEV2ZW50RW1pdHRlcjxGb3JtRmllbGRNb2RlbD4gPSBuZXcgRXZlbnRFbWl0dGVyPEZvcm1GaWVsZE1vZGVsPigpO1xuXG4gICAgdmlzaWJsZVRhYnM6IFRhYk1vZGVsW10gPSBbXTtcblxuICAgIGhhc1RhYnMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnRhYnMgJiYgdGhpcy50YWJzLmxlbmd0aCA+IDA7XG4gICAgfVxuXG4gICAgbmdBZnRlckNvbnRlbnRDaGVja2VkKCkge1xuICAgICAgICB0aGlzLmZpbHRlclZpc2libGVUYWJzKCk7XG4gICAgfVxuXG4gICAgZmlsdGVyVmlzaWJsZVRhYnMoKSB7XG4gICAgICAgIHRoaXMudmlzaWJsZVRhYnMgPSB0aGlzLnRhYnMuZmlsdGVyKCh0YWIpID0+IHtcbiAgICAgICAgICAgIHJldHVybiB0YWIuaXNWaXNpYmxlO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICB0YWJDaGFuZ2VkKGZpZWxkOiBGb3JtRmllbGRNb2RlbCkge1xuICAgICAgICB0aGlzLmZvcm1UYWJDaGFuZ2VkLmVtaXQoZmllbGQpO1xuICAgIH1cblxufVxuIl19
