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
import { Component, Input } from '@angular/core';
export class CardViewComponent {
  constructor() {
    /**
     * Toggles whether or not to show empty items in non-editable mode.
     */
    this.displayEmpty = true;
    /**
     * Toggles whether or not to display none option.
     */
    this.displayNoneOption = true;
    /**
     * Toggles whether or not to display clear action.
     */
    this.displayClearAction = true;
  }
}
CardViewComponent.decorators = [
  {
    type: Component,
    args: [
      {
        selector: 'adf-card-view',
        template:
          '<div class="adf-property-list">\n    <div *ngFor="let property of properties">\n        <div [attr.data-automation-id]="\'header-\'+property.key" class="adf-property">\n            <adf-card-view-item-dispatcher\n                [property]="property"\n                [editable]="editable"\n                [displayEmpty]="displayEmpty"\n                [displayNoneOption]="displayNoneOption"\n                [displayClearAction]="displayClearAction">\n            </adf-card-view-item-dispatcher>\n        </div>\n    </div>\n</div>\n',
        styles: ['']
      }
    ]
  }
];
CardViewComponent.propDecorators = {
  properties: [{ type: Input }],
  editable: [{ type: Input }],
  displayEmpty: [{ type: Input }],
  displayNoneOption: [{ type: Input }],
  displayClearAction: [{ type: Input }]
};
if (false) {
  /**
   * (**required**) Items to show in the card view.
   * @type {?}
   */
  CardViewComponent.prototype.properties;
  /**
   * Toggles whether or not the items can be edited.
   * @type {?}
   */
  CardViewComponent.prototype.editable;
  /**
   * Toggles whether or not to show empty items in non-editable mode.
   * @type {?}
   */
  CardViewComponent.prototype.displayEmpty;
  /**
   * Toggles whether or not to display none option.
   * @type {?}
   */
  CardViewComponent.prototype.displayNoneOption;
  /**
   * Toggles whether or not to display clear action.
   * @type {?}
   */
  CardViewComponent.prototype.displayClearAction;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FyZC12aWV3LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BhbGZyZXNjby9hZGYtY29yZS8iLCJzb3VyY2VzIjpbImNhcmQtdmlldy9jb21wb25lbnRzL2NhcmQtdmlldy9jYXJkLXZpZXcuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBaUJBLE9BQU8sRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBUWpELE1BQU0sT0FBTyxpQkFBaUI7SUFMOUI7Ozs7UUFnQkksaUJBQVksR0FBWSxJQUFJLENBQUM7Ozs7UUFJN0Isc0JBQWlCLEdBQVksSUFBSSxDQUFDOzs7O1FBSWxDLHVCQUFrQixHQUFZLElBQUksQ0FBQztJQUN2QyxDQUFDOzs7WUF6QkEsU0FBUyxTQUFDO2dCQUNQLFFBQVEsRUFBRSxlQUFlO2dCQUN6QixxakJBQXlDOzthQUU1Qzs7O3lCQUdJLEtBQUs7dUJBSUwsS0FBSzsyQkFJTCxLQUFLO2dDQUlMLEtBQUs7aUNBSUwsS0FBSzs7Ozs7OztJQWhCTix1Q0FDNEI7Ozs7O0lBRzVCLHFDQUNrQjs7Ozs7SUFHbEIseUNBQzZCOzs7OztJQUc3Qiw4Q0FDa0M7Ozs7O0lBR2xDLCtDQUNtQyIsInNvdXJjZXNDb250ZW50IjpbIi8qIVxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE5IEFsZnJlc2NvIFNvZnR3YXJlLCBMdGQuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbmltcG9ydCB7IENvbXBvbmVudCwgSW5wdXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENhcmRWaWV3SXRlbSB9IGZyb20gJy4uLy4uL2ludGVyZmFjZXMvY2FyZC12aWV3LWl0ZW0uaW50ZXJmYWNlJztcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdhZGYtY2FyZC12aWV3JyxcbiAgICB0ZW1wbGF0ZVVybDogJy4vY2FyZC12aWV3LmNvbXBvbmVudC5odG1sJyxcbiAgICBzdHlsZVVybHM6IFsnLi9jYXJkLXZpZXcuY29tcG9uZW50LnNjc3MnXVxufSlcbmV4cG9ydCBjbGFzcyBDYXJkVmlld0NvbXBvbmVudCB7XG4gICAgLyoqICgqKnJlcXVpcmVkKiopIEl0ZW1zIHRvIHNob3cgaW4gdGhlIGNhcmQgdmlldy4gKi9cbiAgICBASW5wdXQoKVxuICAgIHByb3BlcnRpZXM6IENhcmRWaWV3SXRlbSBbXTtcblxuICAgIC8qKiBUb2dnbGVzIHdoZXRoZXIgb3Igbm90IHRoZSBpdGVtcyBjYW4gYmUgZWRpdGVkLiAqL1xuICAgIEBJbnB1dCgpXG4gICAgZWRpdGFibGU6IGJvb2xlYW47XG5cbiAgICAvKiogVG9nZ2xlcyB3aGV0aGVyIG9yIG5vdCB0byBzaG93IGVtcHR5IGl0ZW1zIGluIG5vbi1lZGl0YWJsZSBtb2RlLiAqL1xuICAgIEBJbnB1dCgpXG4gICAgZGlzcGxheUVtcHR5OiBib29sZWFuID0gdHJ1ZTtcblxuICAgIC8qKiBUb2dnbGVzIHdoZXRoZXIgb3Igbm90IHRvIGRpc3BsYXkgbm9uZSBvcHRpb24uICovXG4gICAgQElucHV0KClcbiAgICBkaXNwbGF5Tm9uZU9wdGlvbjogYm9vbGVhbiA9IHRydWU7XG5cbiAgICAvKiogVG9nZ2xlcyB3aGV0aGVyIG9yIG5vdCB0byBkaXNwbGF5IGNsZWFyIGFjdGlvbi4gKi9cbiAgICBASW5wdXQoKVxuICAgIGRpc3BsYXlDbGVhckFjdGlvbjogYm9vbGVhbiA9IHRydWU7XG59XG4iXX0=
