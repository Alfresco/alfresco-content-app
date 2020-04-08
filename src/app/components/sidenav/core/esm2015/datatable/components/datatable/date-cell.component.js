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
import { Component, ViewEncapsulation } from '@angular/core';
import { DataTableCellComponent } from './datatable-cell.component';
import {
  UserPreferencesService,
  UserPreferenceValues
} from '../../../services/user-preferences.service';
import { AlfrescoApiService } from '../../../services/alfresco-api.service';
import { AppConfigService } from '../../../app-config/app-config.service';
import { takeUntil } from 'rxjs/operators';
export class DateCellComponent extends DataTableCellComponent {
  /**
   * @param {?} userPreferenceService
   * @param {?} alfrescoApiService
   * @param {?} appConfig
   */
  constructor(userPreferenceService, alfrescoApiService, appConfig) {
    super(alfrescoApiService);
    this.dateFormat = appConfig.get(
      'dateValues.defaultDateFormat',
      DateCellComponent.DATE_FORMAT
    );
    if (userPreferenceService) {
      userPreferenceService
        .select(UserPreferenceValues.Locale)
        .pipe(takeUntil(this.onDestroy$))
        .subscribe(
          /**
           * @param {?} locale
           * @return {?}
           */
          locale => (this.currentLocale = locale)
        );
    }
  }
  /**
   * @return {?}
   */
  get format() {
    if (this.column) {
      return this.column.format || this.dateFormat;
    }
    return this.dateFormat;
  }
}
DateCellComponent.DATE_FORMAT = 'medium';
DateCellComponent.decorators = [
  {
    type: Component,
    args: [
      {
        selector: 'adf-date-cell',
        template: `
        <ng-container>
            <span
                [attr.aria-label]="value$ | async | adfTimeAgo: currentLocale"
                title="{{ tooltip | adfLocalizedDate: 'medium' }}"
                class="adf-datatable-cell-value"
                *ngIf="format === 'timeAgo'; else standard_date">
                {{ value$ | async | adfTimeAgo: currentLocale }}
            </span>
        </ng-container>
        <ng-template #standard_date>
            <span
                class="adf-datatable-cell-value"
                title="{{ tooltip | adfLocalizedDate: format }}"
                class="adf-datatable-cell-value"
                [attr.aria-label]="value$ | async | adfLocalizedDate: format">
                {{ value$ | async | adfLocalizedDate: format }}
            </span>
        </ng-template>
    `,
        encapsulation: ViewEncapsulation.None,
        host: { class: 'adf-date-cell adf-datatable-content-cell' }
      }
    ]
  }
];
/** @nocollapse */
DateCellComponent.ctorParameters = () => [
  { type: UserPreferencesService },
  { type: AlfrescoApiService },
  { type: AppConfigService }
];
if (false) {
  /** @type {?} */
  DateCellComponent.DATE_FORMAT;
  /** @type {?} */
  DateCellComponent.prototype.currentLocale;
  /** @type {?} */
  DateCellComponent.prototype.dateFormat;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZS1jZWxsLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BhbGZyZXNjby9hZGYtY29yZS8iLCJzb3VyY2VzIjpbImRhdGF0YWJsZS9jb21wb25lbnRzL2RhdGF0YWJsZS9kYXRlLWNlbGwuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBaUJBLE9BQU8sRUFBRSxTQUFTLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDN0QsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFDcEUsT0FBTyxFQUNILHNCQUFzQixFQUN0QixvQkFBb0IsRUFDdkIsTUFBTSw0Q0FBNEMsQ0FBQztBQUNwRCxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSx3Q0FBd0MsQ0FBQztBQUM1RSxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSx3Q0FBd0MsQ0FBQztBQUMxRSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUE0QjNDLE1BQU0sT0FBTyxpQkFBa0IsU0FBUSxzQkFBc0I7Ozs7OztJQWN6RCxZQUNJLHFCQUE2QyxFQUM3QyxrQkFBc0MsRUFDdEMsU0FBMkI7UUFFM0IsS0FBSyxDQUFDLGtCQUFrQixDQUFDLENBQUM7UUFFMUIsSUFBSSxDQUFDLFVBQVUsR0FBRyxTQUFTLENBQUMsR0FBRyxDQUFDLDhCQUE4QixFQUFFLGlCQUFpQixDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQy9GLElBQUkscUJBQXFCLEVBQUU7WUFDdkIscUJBQXFCO2lCQUNoQixNQUFNLENBQUMsb0JBQW9CLENBQUMsTUFBTSxDQUFDO2lCQUNuQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztpQkFDaEMsU0FBUzs7OztZQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLGFBQWEsR0FBRyxNQUFNLEVBQUMsQ0FBQztTQUN6RDtJQUNMLENBQUM7Ozs7SUFyQkQsSUFBSSxNQUFNO1FBQ04sSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQ2IsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDO1NBQ2hEO1FBQ0QsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDO0lBQzNCLENBQUM7O0FBVk0sNkJBQVcsR0FBRyxRQUFRLENBQUM7O1lBNUJqQyxTQUFTLFNBQUM7Z0JBQ1AsUUFBUSxFQUFFLGVBQWU7Z0JBRXpCLFFBQVEsRUFBRTs7Ozs7Ozs7Ozs7Ozs7Ozs7OztLQW1CVDtnQkFDRCxhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTtnQkFDckMsSUFBSSxFQUFFLEVBQUUsS0FBSyxFQUFFLDBDQUEwQyxFQUFFO2FBQzlEOzs7O1lBaENHLHNCQUFzQjtZQUdqQixrQkFBa0I7WUFDbEIsZ0JBQWdCOzs7O0lBK0JyQiw4QkFBOEI7O0lBRTlCLDBDQUFzQjs7SUFDdEIsdUNBQW1CIiwic291cmNlc0NvbnRlbnQiOlsiLyohXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTkgQWxmcmVzY28gU29mdHdhcmUsIEx0ZC5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0IHsgQ29tcG9uZW50LCBWaWV3RW5jYXBzdWxhdGlvbiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRGF0YVRhYmxlQ2VsbENvbXBvbmVudCB9IGZyb20gJy4vZGF0YXRhYmxlLWNlbGwuY29tcG9uZW50JztcbmltcG9ydCB7XG4gICAgVXNlclByZWZlcmVuY2VzU2VydmljZSxcbiAgICBVc2VyUHJlZmVyZW5jZVZhbHVlc1xufSBmcm9tICcuLi8uLi8uLi9zZXJ2aWNlcy91c2VyLXByZWZlcmVuY2VzLnNlcnZpY2UnO1xuaW1wb3J0IHsgQWxmcmVzY29BcGlTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vc2VydmljZXMvYWxmcmVzY28tYXBpLnNlcnZpY2UnO1xuaW1wb3J0IHsgQXBwQ29uZmlnU2VydmljZSB9IGZyb20gJy4uLy4uLy4uL2FwcC1jb25maWcvYXBwLWNvbmZpZy5zZXJ2aWNlJztcbmltcG9ydCB7IHRha2VVbnRpbCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdhZGYtZGF0ZS1jZWxsJyxcblxuICAgIHRlbXBsYXRlOiBgXG4gICAgICAgIDxuZy1jb250YWluZXI+XG4gICAgICAgICAgICA8c3BhblxuICAgICAgICAgICAgICAgIFthdHRyLmFyaWEtbGFiZWxdPVwidmFsdWUkIHwgYXN5bmMgfCBhZGZUaW1lQWdvOiBjdXJyZW50TG9jYWxlXCJcbiAgICAgICAgICAgICAgICB0aXRsZT1cInt7IHRvb2x0aXAgfCBhZGZMb2NhbGl6ZWREYXRlOiAnbWVkaXVtJyB9fVwiXG4gICAgICAgICAgICAgICAgY2xhc3M9XCJhZGYtZGF0YXRhYmxlLWNlbGwtdmFsdWVcIlxuICAgICAgICAgICAgICAgICpuZ0lmPVwiZm9ybWF0ID09PSAndGltZUFnbyc7IGVsc2Ugc3RhbmRhcmRfZGF0ZVwiPlxuICAgICAgICAgICAgICAgIHt7IHZhbHVlJCB8IGFzeW5jIHwgYWRmVGltZUFnbzogY3VycmVudExvY2FsZSB9fVxuICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICAgICAgPG5nLXRlbXBsYXRlICNzdGFuZGFyZF9kYXRlPlxuICAgICAgICAgICAgPHNwYW5cbiAgICAgICAgICAgICAgICBjbGFzcz1cImFkZi1kYXRhdGFibGUtY2VsbC12YWx1ZVwiXG4gICAgICAgICAgICAgICAgdGl0bGU9XCJ7eyB0b29sdGlwIHwgYWRmTG9jYWxpemVkRGF0ZTogZm9ybWF0IH19XCJcbiAgICAgICAgICAgICAgICBjbGFzcz1cImFkZi1kYXRhdGFibGUtY2VsbC12YWx1ZVwiXG4gICAgICAgICAgICAgICAgW2F0dHIuYXJpYS1sYWJlbF09XCJ2YWx1ZSQgfCBhc3luYyB8IGFkZkxvY2FsaXplZERhdGU6IGZvcm1hdFwiPlxuICAgICAgICAgICAgICAgIHt7IHZhbHVlJCB8IGFzeW5jIHwgYWRmTG9jYWxpemVkRGF0ZTogZm9ybWF0IH19XG4gICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgIDwvbmctdGVtcGxhdGU+XG4gICAgYCxcbiAgICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICAgIGhvc3Q6IHsgY2xhc3M6ICdhZGYtZGF0ZS1jZWxsIGFkZi1kYXRhdGFibGUtY29udGVudC1jZWxsJyB9XG59KVxuZXhwb3J0IGNsYXNzIERhdGVDZWxsQ29tcG9uZW50IGV4dGVuZHMgRGF0YVRhYmxlQ2VsbENvbXBvbmVudCB7XG5cbiAgICBzdGF0aWMgREFURV9GT1JNQVQgPSAnbWVkaXVtJztcblxuICAgIGN1cnJlbnRMb2NhbGU6IHN0cmluZztcbiAgICBkYXRlRm9ybWF0OiBzdHJpbmc7XG5cbiAgICBnZXQgZm9ybWF0KCk6IHN0cmluZyB7XG4gICAgICAgIGlmICh0aGlzLmNvbHVtbikge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY29sdW1uLmZvcm1hdCB8fCB0aGlzLmRhdGVGb3JtYXQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuZGF0ZUZvcm1hdDtcbiAgICB9XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgdXNlclByZWZlcmVuY2VTZXJ2aWNlOiBVc2VyUHJlZmVyZW5jZXNTZXJ2aWNlLFxuICAgICAgICBhbGZyZXNjb0FwaVNlcnZpY2U6IEFsZnJlc2NvQXBpU2VydmljZSxcbiAgICAgICAgYXBwQ29uZmlnOiBBcHBDb25maWdTZXJ2aWNlXG4gICAgKSB7XG4gICAgICAgIHN1cGVyKGFsZnJlc2NvQXBpU2VydmljZSk7XG5cbiAgICAgICAgdGhpcy5kYXRlRm9ybWF0ID0gYXBwQ29uZmlnLmdldCgnZGF0ZVZhbHVlcy5kZWZhdWx0RGF0ZUZvcm1hdCcsIERhdGVDZWxsQ29tcG9uZW50LkRBVEVfRk9STUFUKTtcbiAgICAgICAgaWYgKHVzZXJQcmVmZXJlbmNlU2VydmljZSkge1xuICAgICAgICAgICAgdXNlclByZWZlcmVuY2VTZXJ2aWNlXG4gICAgICAgICAgICAgICAgLnNlbGVjdChVc2VyUHJlZmVyZW5jZVZhbHVlcy5Mb2NhbGUpXG4gICAgICAgICAgICAgICAgLnBpcGUodGFrZVVudGlsKHRoaXMub25EZXN0cm95JCkpXG4gICAgICAgICAgICAgICAgLnN1YnNjcmliZShsb2NhbGUgPT4gdGhpcy5jdXJyZW50TG9jYWxlID0gbG9jYWxlKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiJdfQ==
