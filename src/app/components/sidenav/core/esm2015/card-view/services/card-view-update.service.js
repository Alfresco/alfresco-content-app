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
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import * as i0 from '@angular/core';
/**
 * @record
 */
export function UpdateNotification() {}
if (false) {
  /** @type {?} */
  UpdateNotification.prototype.target;
  /** @type {?} */
  UpdateNotification.prototype.changed;
}
/**
 * @record
 */
export function ClickNotification() {}
if (false) {
  /** @type {?} */
  ClickNotification.prototype.target;
}
/**
 * @param {?} key
 * @param {?} value
 * @return {?}
 */
export function transformKeyToObject(key, value) {
  /** @type {?} */
  const objectLevels = key.split('.').reverse();
  return objectLevels.reduce(
    /**
     * @param {?} previousValue
     * @param {?} currentValue
     * @return {?}
     */
    (previousValue, currentValue) => {
      return { [currentValue]: previousValue };
    },
    value
  );
}
export class CardViewUpdateService {
  constructor() {
    this.itemUpdated$ = new Subject();
    this.itemClicked$ = new Subject();
  }
  /**
   * @param {?} property
   * @param {?} newValue
   * @return {?}
   */
  update(property, newValue) {
    this.itemUpdated$.next({
      target: property,
      changed: transformKeyToObject(property.key, newValue)
    });
  }
  /**
   * @param {?} property
   * @return {?}
   */
  clicked(property) {
    this.itemClicked$.next({
      target: property
    });
  }
}
CardViewUpdateService.decorators = [
  {
    type: Injectable,
    args: [
      {
        providedIn: 'root'
      }
    ]
  }
];
/** @nocollapse */ CardViewUpdateService.ngInjectableDef = i0.defineInjectable({
  factory: function CardViewUpdateService_Factory() {
    return new CardViewUpdateService();
  },
  token: CardViewUpdateService,
  providedIn: 'root'
});
if (false) {
  /** @type {?} */
  CardViewUpdateService.prototype.itemUpdated$;
  /** @type {?} */
  CardViewUpdateService.prototype.itemClicked$;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FyZC12aWV3LXVwZGF0ZS5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQGFsZnJlc2NvL2FkZi1jb3JlLyIsInNvdXJjZXMiOlsiY2FyZC12aWV3L3NlcnZpY2VzL2NhcmQtdmlldy11cGRhdGUuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWlCQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxNQUFNLENBQUM7Ozs7O0FBRy9CLHdDQUdDOzs7SUFGRyxvQ0FBWTs7SUFDWixxQ0FBYTs7Ozs7QUFHakIsdUNBRUM7OztJQURHLG1DQUFZOzs7Ozs7O0FBR2hCLE1BQU0sVUFBVSxvQkFBb0IsQ0FBQyxHQUFXLEVBQUUsS0FBSzs7VUFDN0MsWUFBWSxHQUFhLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxFQUFFO0lBRXZELE9BQU8sWUFBWSxDQUFDLE1BQU07Ozs7O0lBQUssQ0FBQyxhQUFhLEVBQUUsWUFBWSxFQUFFLEVBQUU7UUFDM0QsT0FBTyxFQUFFLENBQUMsWUFBWSxDQUFDLEVBQUUsYUFBYSxFQUFDLENBQUM7SUFDNUMsQ0FBQyxHQUFFLEtBQUssQ0FBQyxDQUFDO0FBQ2QsQ0FBQztBQUtELE1BQU0sT0FBTyxxQkFBcUI7SUFIbEM7UUFLSSxpQkFBWSxHQUFHLElBQUksT0FBTyxFQUFzQixDQUFDO1FBQ2pELGlCQUFZLEdBQUcsSUFBSSxPQUFPLEVBQXFCLENBQUM7S0FjbkQ7Ozs7OztJQVpHLE1BQU0sQ0FBQyxRQUErQixFQUFFLFFBQWE7UUFDakQsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUM7WUFDbkIsTUFBTSxFQUFFLFFBQVE7WUFDaEIsT0FBTyxFQUFFLG9CQUFvQixDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsUUFBUSxDQUFDO1NBQ3hELENBQUMsQ0FBQztJQUNQLENBQUM7Ozs7O0lBRUQsT0FBTyxDQUFDLFFBQStCO1FBQ25DLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDO1lBQ25CLE1BQU0sRUFBRSxRQUFRO1NBQ25CLENBQUMsQ0FBQztJQUNQLENBQUM7OztZQW5CSixVQUFVLFNBQUM7Z0JBQ1IsVUFBVSxFQUFFLE1BQU07YUFDckI7Ozs7O0lBR0csNkNBQWlEOztJQUNqRCw2Q0FBZ0QiLCJzb3VyY2VzQ29udGVudCI6WyIvKiFcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxOSBBbGZyZXNjbyBTb2Z0d2FyZSwgTHRkLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBDYXJkVmlld0Jhc2VJdGVtTW9kZWwgfSBmcm9tICcuLi9tb2RlbHMvY2FyZC12aWV3LWJhc2VpdGVtLm1vZGVsJztcblxuZXhwb3J0IGludGVyZmFjZSBVcGRhdGVOb3RpZmljYXRpb24ge1xuICAgIHRhcmdldDogYW55O1xuICAgIGNoYW5nZWQ6IGFueTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBDbGlja05vdGlmaWNhdGlvbiB7XG4gICAgdGFyZ2V0OiBhbnk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0cmFuc2Zvcm1LZXlUb09iamVjdChrZXk6IHN0cmluZywgdmFsdWUpOiBPYmplY3Qge1xuICAgIGNvbnN0IG9iamVjdExldmVsczogc3RyaW5nW10gPSBrZXkuc3BsaXQoJy4nKS5yZXZlcnNlKCk7XG5cbiAgICByZXR1cm4gb2JqZWN0TGV2ZWxzLnJlZHVjZTx7fT4oKHByZXZpb3VzVmFsdWUsIGN1cnJlbnRWYWx1ZSkgPT4ge1xuICAgICAgICByZXR1cm4geyBbY3VycmVudFZhbHVlXTogcHJldmlvdXNWYWx1ZX07XG4gICAgfSwgdmFsdWUpO1xufVxuXG5ASW5qZWN0YWJsZSh7XG4gICAgcHJvdmlkZWRJbjogJ3Jvb3QnXG59KVxuZXhwb3J0IGNsYXNzIENhcmRWaWV3VXBkYXRlU2VydmljZSB7XG5cbiAgICBpdGVtVXBkYXRlZCQgPSBuZXcgU3ViamVjdDxVcGRhdGVOb3RpZmljYXRpb24+KCk7XG4gICAgaXRlbUNsaWNrZWQkID0gbmV3IFN1YmplY3Q8Q2xpY2tOb3RpZmljYXRpb24+KCk7XG5cbiAgICB1cGRhdGUocHJvcGVydHk6IENhcmRWaWV3QmFzZUl0ZW1Nb2RlbCwgbmV3VmFsdWU6IGFueSkge1xuICAgICAgICB0aGlzLml0ZW1VcGRhdGVkJC5uZXh0KHtcbiAgICAgICAgICAgIHRhcmdldDogcHJvcGVydHksXG4gICAgICAgICAgICBjaGFuZ2VkOiB0cmFuc2Zvcm1LZXlUb09iamVjdChwcm9wZXJ0eS5rZXksIG5ld1ZhbHVlKVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBjbGlja2VkKHByb3BlcnR5OiBDYXJkVmlld0Jhc2VJdGVtTW9kZWwpIHtcbiAgICAgICAgdGhpcy5pdGVtQ2xpY2tlZCQubmV4dCh7XG4gICAgICAgICAgICB0YXJnZXQ6IHByb3BlcnR5XG4gICAgICAgIH0pO1xuICAgIH1cbn1cbiJdfQ==
