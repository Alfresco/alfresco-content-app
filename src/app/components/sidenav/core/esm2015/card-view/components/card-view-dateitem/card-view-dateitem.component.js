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
import { Component, Input, ViewChild } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import {
  MatDatetimepicker,
  DatetimeAdapter,
  MAT_DATETIME_FORMATS
} from '@mat-datetimepicker/core';
import {
  MomentDatetimeAdapter,
  MAT_MOMENT_DATETIME_FORMATS
} from '@mat-datetimepicker/moment';
import moment from 'moment-es6';
import { CardViewDateItemModel } from '../../models/card-view-dateitem.model';
import { CardViewUpdateService } from '../../services/card-view-update.service';
import {
  UserPreferencesService,
  UserPreferenceValues
} from '../../../services/user-preferences.service';
import { MomentDateAdapter } from '../../../utils/moment-date-adapter';
import { MOMENT_DATE_FORMATS } from '../../../utils/moment-date-formats.model';
import { AppConfigService } from '../../../app-config/app-config.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
const ɵ0 = MOMENT_DATE_FORMATS,
  ɵ1 = MAT_MOMENT_DATETIME_FORMATS;
export class CardViewDateItemComponent {
  /**
   * @param {?} cardViewUpdateService
   * @param {?} dateAdapter
   * @param {?} userPreferencesService
   * @param {?} appConfig
   */
  constructor(
    cardViewUpdateService,
    dateAdapter,
    userPreferencesService,
    appConfig
  ) {
    this.cardViewUpdateService = cardViewUpdateService;
    this.dateAdapter = dateAdapter;
    this.userPreferencesService = userPreferencesService;
    this.appConfig = appConfig;
    this.editable = false;
    this.displayEmpty = true;
    this.displayClearAction = true;
    this.onDestroy$ = new Subject();
    this.dateFormat = this.appConfig.get('dateValues.defaultDateFormat');
  }
  /**
   * @return {?}
   */
  ngOnInit() {
    this.userPreferencesService
      .select(UserPreferenceValues.Locale)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(
        /**
         * @param {?} locale
         * @return {?}
         */
        locale => {
          this.dateAdapter.setLocale(locale);
          this.property.locale = locale;
        }
      );
    /** @type {?} */ (this.dateAdapter).overrideDisplayFormat = 'MMM DD';
    if (this.property.value) {
      this.valueDate = moment(this.property.value, this.dateFormat);
    }
  }
  /**
   * @return {?}
   */
  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }
  /**
   * @return {?}
   */
  showProperty() {
    return this.displayEmpty || !this.property.isEmpty();
  }
  /**
   * @return {?}
   */
  showClearAction() {
    return (
      this.displayClearAction &&
      (!this.property.isEmpty() || !!this.property.default)
    );
  }
  /**
   * @return {?}
   */
  isEditable() {
    return this.editable && this.property.editable;
  }
  /**
   * @return {?}
   */
  showDatePicker() {
    this.datepicker.open();
  }
  /**
   * @param {?} newDateValue
   * @return {?}
   */
  onDateChanged(newDateValue) {
    if (newDateValue) {
      /** @type {?} */
      const momentDate = moment(newDateValue.value, this.dateFormat, true);
      if (momentDate.isValid()) {
        this.valueDate = momentDate;
        this.cardViewUpdateService.update(this.property, momentDate.toDate());
        this.property.value = momentDate.toDate();
      }
    }
  }
  /**
   * @return {?}
   */
  onDateClear() {
    this.valueDate = null;
    this.cardViewUpdateService.update(this.property, null);
    this.property.value = null;
    this.property.default = null;
  }
}
CardViewDateItemComponent.decorators = [
  {
    type: Component,
    args: [
      {
        providers: [
          { provide: DateAdapter, useClass: MomentDateAdapter },
          { provide: MAT_DATE_FORMATS, useValue: ɵ0 },
          { provide: DatetimeAdapter, useClass: MomentDatetimeAdapter },
          { provide: MAT_DATETIME_FORMATS, useValue: ɵ1 }
        ],
        selector: 'adf-card-view-dateitem',
        template:
          '<div class="adf-sr-only" [attr.data-automation-id]="\'card-\' + property.type + \'-value-\' + property.key">{{\'CORE.METADATA.ACCESSIBILITY.DATEPICKER\' | translate}}</div>\n<div [attr.data-automation-id]="\'card-dateitem-label-\' + property.key" class="adf-property-label" *ngIf="showProperty() || isEditable()">{{ property.label | translate }}</div>\n<div class="adf-property-value">\n    <span *ngIf="!isEditable()" [attr.data-automation-id]="\'card-\' + property.type + \'-value-\' + property.key">\n        <span [attr.data-automation-id]="\'card-dateitem-\' + property.key">\n            <span *ngIf="showProperty()">{{ property.displayValue }}</span>\n        </span>\n    </span>\n    <div *ngIf="isEditable()" class="adf-dateitem-editable">\n        <div class="adf-dateitem-editable-controls">\n            <span\n                class="adf-datepicker-toggle"\n                [attr.data-automation-id]="\'datepicker-label-toggle-\' + property.key"\n                (click)="showDatePicker()">\n                <span [attr.data-automation-id]="\'card-\' + property.type + \'-value-\' + property.key" *ngIf="showProperty(); else elseEmptyValueBlock">{{ property.displayValue }}</span>\n            </span>\n\n            <mat-icon *ngIf="showClearAction()"\n                class="adf-date-reset-icon"\n                (click)="onDateClear()"\n                [attr.title]="\'CORE.METADATA.ACTIONS.CLEAR\' | translate"\n                [attr.data-automation-id]="\'datepicker-date-clear-\' + property.key">\n                clear\n            </mat-icon>\n\n            <mat-datetimepicker-toggle\n                [attr.title]="\'CORE.METADATA.ACTIONS.EDIT\' | translate"\n                [attr.data-automation-id]="\'datepickertoggle-\' + property.key"\n                [for]="datetimePicker">\n            </mat-datetimepicker-toggle>\n        </div>\n\n        <input class="adf-invisible-date-input"\n            [matDatetimepicker]="datetimePicker"\n            [value]="valueDate"\n            (dateChange)="onDateChanged($event)"\n            [attr.aria-describedby]="\'card-\' + property.type + \'-value-\' + property.key">\n\n        <mat-datetimepicker #datetimePicker\n            [type]="property.type"\n            timeInterval="5"\n            [attr.data-automation-id]="\'datepicker-\' + property.key"\n            [startAt]="valueDate">\n        </mat-datetimepicker>\n    </div>\n    <ng-template #elseEmptyValueBlock>\n        {{ property.default | translate }}\n    </ng-template>\n</div>\n',
        styles: ['']
      }
    ]
  }
];
/** @nocollapse */
CardViewDateItemComponent.ctorParameters = () => [
  { type: CardViewUpdateService },
  { type: DateAdapter },
  { type: UserPreferencesService },
  { type: AppConfigService }
];
CardViewDateItemComponent.propDecorators = {
  property: [{ type: Input }],
  editable: [{ type: Input }],
  displayEmpty: [{ type: Input }],
  displayClearAction: [{ type: Input }],
  datepicker: [{ type: ViewChild, args: ['datetimePicker'] }]
};
if (false) {
  /** @type {?} */
  CardViewDateItemComponent.prototype.property;
  /** @type {?} */
  CardViewDateItemComponent.prototype.editable;
  /** @type {?} */
  CardViewDateItemComponent.prototype.displayEmpty;
  /** @type {?} */
  CardViewDateItemComponent.prototype.displayClearAction;
  /** @type {?} */
  CardViewDateItemComponent.prototype.datepicker;
  /** @type {?} */
  CardViewDateItemComponent.prototype.valueDate;
  /** @type {?} */
  CardViewDateItemComponent.prototype.dateFormat;
  /**
   * @type {?}
   * @private
   */
  CardViewDateItemComponent.prototype.onDestroy$;
  /**
   * @type {?}
   * @private
   */
  CardViewDateItemComponent.prototype.cardViewUpdateService;
  /**
   * @type {?}
   * @private
   */
  CardViewDateItemComponent.prototype.dateAdapter;
  /**
   * @type {?}
   * @private
   */
  CardViewDateItemComponent.prototype.userPreferencesService;
  /**
   * @type {?}
   * @private
   */
  CardViewDateItemComponent.prototype.appConfig;
}
export { ɵ0, ɵ1 };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FyZC12aWV3LWRhdGVpdGVtLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BhbGZyZXNjby9hZGYtY29yZS8iLCJzb3VyY2VzIjpbImNhcmQtdmlldy9jb21wb25lbnRzL2NhcmQtdmlldy1kYXRlaXRlbS9jYXJkLXZpZXctZGF0ZWl0ZW0uY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBaUJBLE9BQU8sRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFVLFNBQVMsRUFBYSxNQUFNLGVBQWUsQ0FBQztBQUMvRSxPQUFPLEVBQUUsV0FBVyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFDbEUsT0FBTyxFQUFFLGlCQUFpQixFQUFFLGVBQWUsRUFBRSxvQkFBb0IsRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBQ3BHLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSwyQkFBMkIsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBQ2hHLE9BQU8sTUFBTSxNQUFNLFlBQVksQ0FBQztBQUVoQyxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSx1Q0FBdUMsQ0FBQztBQUM5RSxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSx5Q0FBeUMsQ0FBQztBQUNoRixPQUFPLEVBQUUsc0JBQXNCLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSw0Q0FBNEMsQ0FBQztBQUMxRyxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxvQ0FBb0MsQ0FBQztBQUN2RSxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSwwQ0FBMEMsQ0FBQztBQUMvRSxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSx3Q0FBd0MsQ0FBQztBQUMxRSxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQy9CLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztXQUtJLG1CQUFtQixPQUVmLDJCQUEyQjtBQU05RSxNQUFNLE9BQU8seUJBQXlCOzs7Ozs7O0lBc0JsQyxZQUFvQixxQkFBNEMsRUFDNUMsV0FBZ0MsRUFDaEMsc0JBQThDLEVBQzlDLFNBQTJCO1FBSDNCLDBCQUFxQixHQUFyQixxQkFBcUIsQ0FBdUI7UUFDNUMsZ0JBQVcsR0FBWCxXQUFXLENBQXFCO1FBQ2hDLDJCQUFzQixHQUF0QixzQkFBc0IsQ0FBd0I7UUFDOUMsY0FBUyxHQUFULFNBQVMsQ0FBa0I7UUFuQi9DLGFBQVEsR0FBWSxLQUFLLENBQUM7UUFHMUIsaUJBQVksR0FBWSxJQUFJLENBQUM7UUFHN0IsdUJBQWtCLEdBQVksSUFBSSxDQUFDO1FBUTNCLGVBQVUsR0FBRyxJQUFJLE9BQU8sRUFBVyxDQUFDO1FBTXhDLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsOEJBQThCLENBQUMsQ0FBQztJQUN6RSxDQUFDOzs7O0lBRUQsUUFBUTtRQUNKLElBQUksQ0FBQyxzQkFBc0I7YUFDdEIsTUFBTSxDQUFDLG9CQUFvQixDQUFDLE1BQU0sQ0FBQzthQUNuQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQzthQUNoQyxTQUFTOzs7O1FBQUMsTUFBTSxDQUFDLEVBQUU7WUFDaEIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDbkMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ2xDLENBQUMsRUFBQyxDQUFDO1FBRVAsQ0FBQyxtQkFBb0IsSUFBSSxDQUFDLFdBQVcsRUFBQSxDQUFDLENBQUMscUJBQXFCLEdBQUcsUUFBUSxDQUFDO1FBRXhFLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUU7WUFDckIsSUFBSSxDQUFDLFNBQVMsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1NBQ2pFO0lBQ0wsQ0FBQzs7OztJQUVELFdBQVc7UUFDUCxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMzQixJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQy9CLENBQUM7Ozs7SUFFRCxZQUFZO1FBQ1IsT0FBTyxJQUFJLENBQUMsWUFBWSxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUN6RCxDQUFDOzs7O0lBRUQsZUFBZTtRQUNYLE9BQU8sSUFBSSxDQUFDLGtCQUFrQixJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQzVGLENBQUM7Ozs7SUFFRCxVQUFVO1FBQ04sT0FBTyxJQUFJLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDO0lBQ25ELENBQUM7Ozs7SUFFRCxjQUFjO1FBQ1YsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUMzQixDQUFDOzs7OztJQUVELGFBQWEsQ0FBQyxZQUFZO1FBQ3RCLElBQUksWUFBWSxFQUFFOztrQkFDUixVQUFVLEdBQUcsTUFBTSxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUM7WUFDcEUsSUFBSSxVQUFVLENBQUMsT0FBTyxFQUFFLEVBQUU7Z0JBQ3RCLElBQUksQ0FBQyxTQUFTLEdBQUcsVUFBVSxDQUFDO2dCQUM1QixJQUFJLENBQUMscUJBQXFCLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsVUFBVSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7Z0JBQ3RFLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxHQUFHLFVBQVUsQ0FBQyxNQUFNLEVBQUUsQ0FBQzthQUM3QztTQUNKO0lBQ0wsQ0FBQzs7OztJQUVELFdBQVc7UUFDUCxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztRQUN0QixJQUFJLENBQUMscUJBQXFCLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDdkQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO1FBQzNCLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQztJQUNqQyxDQUFDOzs7WUE3RkosU0FBUyxTQUFDO2dCQUNQLFNBQVMsRUFBRTtvQkFDUCxFQUFFLE9BQU8sRUFBRSxXQUFXLEVBQUUsUUFBUSxFQUFFLGlCQUFpQixFQUFFO29CQUNyRCxFQUFFLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxRQUFRLElBQXFCLEVBQUU7b0JBQzVELEVBQUUsT0FBTyxFQUFFLGVBQWUsRUFBRSxRQUFRLEVBQUUscUJBQXFCLEVBQUU7b0JBQzdELEVBQUUsT0FBTyxFQUFFLG9CQUFvQixFQUFFLFFBQVEsSUFBNkIsRUFBRTtpQkFDM0U7Z0JBQ0QsUUFBUSxFQUFFLHdCQUF3QjtnQkFDbEMsc2dGQUFrRDs7YUFFckQ7Ozs7WUFsQlEscUJBQXFCO1lBTnJCLFdBQVc7WUFPWCxzQkFBc0I7WUFHdEIsZ0JBQWdCOzs7dUJBaUJwQixLQUFLO3VCQUdMLEtBQUs7MkJBR0wsS0FBSztpQ0FHTCxLQUFLO3lCQUdMLFNBQVMsU0FBQyxnQkFBZ0I7Ozs7SUFaM0IsNkNBQ2dDOztJQUVoQyw2Q0FDMEI7O0lBRTFCLGlEQUM2Qjs7SUFFN0IsdURBQ21DOztJQUVuQywrQ0FDMEM7O0lBRTFDLDhDQUFrQjs7SUFDbEIsK0NBQW1COzs7OztJQUVuQiwrQ0FBNEM7Ozs7O0lBRWhDLDBEQUFvRDs7Ozs7SUFDcEQsZ0RBQXdDOzs7OztJQUN4QywyREFBc0Q7Ozs7O0lBQ3RELDhDQUFtQyIsInNvdXJjZXNDb250ZW50IjpbIi8qIVxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE5IEFsZnJlc2NvIFNvZnR3YXJlLCBMdGQuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbmltcG9ydCB7IENvbXBvbmVudCwgSW5wdXQsIE9uSW5pdCwgVmlld0NoaWxkLCBPbkRlc3Ryb3kgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IERhdGVBZGFwdGVyLCBNQVRfREFURV9GT1JNQVRTIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwnO1xuaW1wb3J0IHsgTWF0RGF0ZXRpbWVwaWNrZXIsIERhdGV0aW1lQWRhcHRlciwgTUFUX0RBVEVUSU1FX0ZPUk1BVFMgfSBmcm9tICdAbWF0LWRhdGV0aW1lcGlja2VyL2NvcmUnO1xuaW1wb3J0IHsgTW9tZW50RGF0ZXRpbWVBZGFwdGVyLCBNQVRfTU9NRU5UX0RBVEVUSU1FX0ZPUk1BVFMgfSBmcm9tICdAbWF0LWRhdGV0aW1lcGlja2VyL21vbWVudCc7XG5pbXBvcnQgbW9tZW50IGZyb20gJ21vbWVudC1lczYnO1xuaW1wb3J0IHsgTW9tZW50IH0gZnJvbSAnbW9tZW50JztcbmltcG9ydCB7IENhcmRWaWV3RGF0ZUl0ZW1Nb2RlbCB9IGZyb20gJy4uLy4uL21vZGVscy9jYXJkLXZpZXctZGF0ZWl0ZW0ubW9kZWwnO1xuaW1wb3J0IHsgQ2FyZFZpZXdVcGRhdGVTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvY2FyZC12aWV3LXVwZGF0ZS5zZXJ2aWNlJztcbmltcG9ydCB7IFVzZXJQcmVmZXJlbmNlc1NlcnZpY2UsIFVzZXJQcmVmZXJlbmNlVmFsdWVzIH0gZnJvbSAnLi4vLi4vLi4vc2VydmljZXMvdXNlci1wcmVmZXJlbmNlcy5zZXJ2aWNlJztcbmltcG9ydCB7IE1vbWVudERhdGVBZGFwdGVyIH0gZnJvbSAnLi4vLi4vLi4vdXRpbHMvbW9tZW50LWRhdGUtYWRhcHRlcic7XG5pbXBvcnQgeyBNT01FTlRfREFURV9GT1JNQVRTIH0gZnJvbSAnLi4vLi4vLi4vdXRpbHMvbW9tZW50LWRhdGUtZm9ybWF0cy5tb2RlbCc7XG5pbXBvcnQgeyBBcHBDb25maWdTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vYXBwLWNvbmZpZy9hcHAtY29uZmlnLnNlcnZpY2UnO1xuaW1wb3J0IHsgU3ViamVjdCB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgdGFrZVVudGlsIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5AQ29tcG9uZW50KHtcbiAgICBwcm92aWRlcnM6IFtcbiAgICAgICAgeyBwcm92aWRlOiBEYXRlQWRhcHRlciwgdXNlQ2xhc3M6IE1vbWVudERhdGVBZGFwdGVyIH0sXG4gICAgICAgIHsgcHJvdmlkZTogTUFUX0RBVEVfRk9STUFUUywgdXNlVmFsdWU6IE1PTUVOVF9EQVRFX0ZPUk1BVFMgfSxcbiAgICAgICAgeyBwcm92aWRlOiBEYXRldGltZUFkYXB0ZXIsIHVzZUNsYXNzOiBNb21lbnREYXRldGltZUFkYXB0ZXIgfSxcbiAgICAgICAgeyBwcm92aWRlOiBNQVRfREFURVRJTUVfRk9STUFUUywgdXNlVmFsdWU6IE1BVF9NT01FTlRfREFURVRJTUVfRk9STUFUUyB9XG4gICAgXSxcbiAgICBzZWxlY3RvcjogJ2FkZi1jYXJkLXZpZXctZGF0ZWl0ZW0nLFxuICAgIHRlbXBsYXRlVXJsOiAnLi9jYXJkLXZpZXctZGF0ZWl0ZW0uY29tcG9uZW50Lmh0bWwnLFxuICAgIHN0eWxlVXJsczogWycuL2NhcmQtdmlldy1kYXRlaXRlbS5jb21wb25lbnQuc2NzcyddXG59KVxuZXhwb3J0IGNsYXNzIENhcmRWaWV3RGF0ZUl0ZW1Db21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSB7XG5cbiAgICBASW5wdXQoKVxuICAgIHByb3BlcnR5OiBDYXJkVmlld0RhdGVJdGVtTW9kZWw7XG5cbiAgICBASW5wdXQoKVxuICAgIGVkaXRhYmxlOiBib29sZWFuID0gZmFsc2U7XG5cbiAgICBASW5wdXQoKVxuICAgIGRpc3BsYXlFbXB0eTogYm9vbGVhbiA9IHRydWU7XG5cbiAgICBASW5wdXQoKVxuICAgIGRpc3BsYXlDbGVhckFjdGlvbjogYm9vbGVhbiA9IHRydWU7XG5cbiAgICBAVmlld0NoaWxkKCdkYXRldGltZVBpY2tlcicpXG4gICAgcHVibGljIGRhdGVwaWNrZXI6IE1hdERhdGV0aW1lcGlja2VyPGFueT47XG5cbiAgICB2YWx1ZURhdGU6IE1vbWVudDtcbiAgICBkYXRlRm9ybWF0OiBzdHJpbmc7XG5cbiAgICBwcml2YXRlIG9uRGVzdHJveSQgPSBuZXcgU3ViamVjdDxib29sZWFuPigpO1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBjYXJkVmlld1VwZGF0ZVNlcnZpY2U6IENhcmRWaWV3VXBkYXRlU2VydmljZSxcbiAgICAgICAgICAgICAgICBwcml2YXRlIGRhdGVBZGFwdGVyOiBEYXRlQWRhcHRlcjxNb21lbnQ+LFxuICAgICAgICAgICAgICAgIHByaXZhdGUgdXNlclByZWZlcmVuY2VzU2VydmljZTogVXNlclByZWZlcmVuY2VzU2VydmljZSxcbiAgICAgICAgICAgICAgICBwcml2YXRlIGFwcENvbmZpZzogQXBwQ29uZmlnU2VydmljZSkge1xuICAgICAgICB0aGlzLmRhdGVGb3JtYXQgPSB0aGlzLmFwcENvbmZpZy5nZXQoJ2RhdGVWYWx1ZXMuZGVmYXVsdERhdGVGb3JtYXQnKTtcbiAgICB9XG5cbiAgICBuZ09uSW5pdCgpIHtcbiAgICAgICAgdGhpcy51c2VyUHJlZmVyZW5jZXNTZXJ2aWNlXG4gICAgICAgICAgICAuc2VsZWN0KFVzZXJQcmVmZXJlbmNlVmFsdWVzLkxvY2FsZSlcbiAgICAgICAgICAgIC5waXBlKHRha2VVbnRpbCh0aGlzLm9uRGVzdHJveSQpKVxuICAgICAgICAgICAgLnN1YnNjcmliZShsb2NhbGUgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuZGF0ZUFkYXB0ZXIuc2V0TG9jYWxlKGxvY2FsZSk7XG4gICAgICAgICAgICAgICAgdGhpcy5wcm9wZXJ0eS5sb2NhbGUgPSBsb2NhbGU7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAoPE1vbWVudERhdGVBZGFwdGVyPiB0aGlzLmRhdGVBZGFwdGVyKS5vdmVycmlkZURpc3BsYXlGb3JtYXQgPSAnTU1NIEREJztcblxuICAgICAgICBpZiAodGhpcy5wcm9wZXJ0eS52YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy52YWx1ZURhdGUgPSBtb21lbnQodGhpcy5wcm9wZXJ0eS52YWx1ZSwgdGhpcy5kYXRlRm9ybWF0KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG5nT25EZXN0cm95KCkge1xuICAgICAgICB0aGlzLm9uRGVzdHJveSQubmV4dCh0cnVlKTtcbiAgICAgICAgdGhpcy5vbkRlc3Ryb3kkLmNvbXBsZXRlKCk7XG4gICAgfVxuXG4gICAgc2hvd1Byb3BlcnR5KCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5kaXNwbGF5RW1wdHkgfHwgIXRoaXMucHJvcGVydHkuaXNFbXB0eSgpO1xuICAgIH1cblxuICAgIHNob3dDbGVhckFjdGlvbigpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGlzcGxheUNsZWFyQWN0aW9uICYmICghdGhpcy5wcm9wZXJ0eS5pc0VtcHR5KCkgfHwgISF0aGlzLnByb3BlcnR5LmRlZmF1bHQpO1xuICAgIH1cblxuICAgIGlzRWRpdGFibGUoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLmVkaXRhYmxlICYmIHRoaXMucHJvcGVydHkuZWRpdGFibGU7XG4gICAgfVxuXG4gICAgc2hvd0RhdGVQaWNrZXIoKSB7XG4gICAgICAgIHRoaXMuZGF0ZXBpY2tlci5vcGVuKCk7XG4gICAgfVxuXG4gICAgb25EYXRlQ2hhbmdlZChuZXdEYXRlVmFsdWUpIHtcbiAgICAgICAgaWYgKG5ld0RhdGVWYWx1ZSkge1xuICAgICAgICAgICAgY29uc3QgbW9tZW50RGF0ZSA9IG1vbWVudChuZXdEYXRlVmFsdWUudmFsdWUsIHRoaXMuZGF0ZUZvcm1hdCwgdHJ1ZSk7XG4gICAgICAgICAgICBpZiAobW9tZW50RGF0ZS5pc1ZhbGlkKCkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnZhbHVlRGF0ZSA9IG1vbWVudERhdGU7XG4gICAgICAgICAgICAgICAgdGhpcy5jYXJkVmlld1VwZGF0ZVNlcnZpY2UudXBkYXRlKHRoaXMucHJvcGVydHksIG1vbWVudERhdGUudG9EYXRlKCkpO1xuICAgICAgICAgICAgICAgIHRoaXMucHJvcGVydHkudmFsdWUgPSBtb21lbnREYXRlLnRvRGF0ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgb25EYXRlQ2xlYXIoKSB7XG4gICAgICAgIHRoaXMudmFsdWVEYXRlID0gbnVsbDtcbiAgICAgICAgdGhpcy5jYXJkVmlld1VwZGF0ZVNlcnZpY2UudXBkYXRlKHRoaXMucHJvcGVydHksIG51bGwpO1xuICAgICAgICB0aGlzLnByb3BlcnR5LnZhbHVlID0gbnVsbDtcbiAgICAgICAgdGhpcy5wcm9wZXJ0eS5kZWZhdWx0ID0gbnVsbDtcbiAgICB9XG5cbn1cbiJdfQ==
