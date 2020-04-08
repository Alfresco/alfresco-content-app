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
import { Component, ViewEncapsulation } from '@angular/core';
import { FormService } from './../../../services/form.service';
import { baseHost, WidgetComponent } from './../widget.component';
import { ContainerWidgetComponentModel } from './container.widget.model';
export class ContainerWidgetComponent extends WidgetComponent {
  /**
   * @param {?} formService
   */
  constructor(formService) {
    super(formService);
    this.formService = formService;
  }
  /**
   * @return {?}
   */
  onExpanderClicked() {
    if (this.content && this.content.isCollapsible()) {
      this.content.isExpanded = !this.content.isExpanded;
    }
  }
  /**
   * @return {?}
   */
  ngOnInit() {
    if (this.field) {
      this.content = new ContainerWidgetComponentModel(this.field);
    }
  }
  /**
   * Serializes column fields
   * @return {?}
   */
  get fields() {
    /** @type {?} */
    const fields = [];
    /** @type {?} */
    let rowContainsElement = true;
    /** @type {?} */
    let rowIndex = 0;
    while (rowContainsElement) {
      rowContainsElement = false;
      for (let i = 0; i < this.content.columns.length; i++) {
        /** @type {?} */
        const field = this.content.columns[i].fields[rowIndex];
        if (field) {
          rowContainsElement = true;
        }
        fields.push(field);
      }
      rowIndex++;
    }
    return fields;
  }
  /**
   * Calculate the column width based on the numberOfColumns and current field's colspan property
   *
   * @param {?} field
   * @return {?}
   */
  getColumnWith(field) {
    /** @type {?} */
    const colspan = field ? field.colspan : 1;
    return (100 / this.content.json.numberOfColumns) * colspan + '%';
  }
}
ContainerWidgetComponent.decorators = [
  {
    type: Component,
    args: [
      {
        selector: 'container-widget',
        template:
          '<div [hidden]="!content?.isGroup()" class="adf-container-widget__header">\n    <h4 class="adf-container-widget__header-text" id="container-header"\n        [class.adf-collapsible]="content?.isCollapsible()">\n        <button *ngIf="content?.isCollapsible()"\n                mat-icon-button\n                class="mdl-button--icon"\n                (click)="onExpanderClicked()">\n            <mat-icon>{{ content?.isExpanded ? \'expand_more\' : \'expand_less\' }}</mat-icon>\n        </button>\n        <span (click)="onExpanderClicked()" id="container-header-label">{{content.name | translate }}</span>\n    </h4>\n</div>\n\n<section class="adf-grid-list" *ngIf="content?.isExpanded">\n    <div class="adf-grid-list-item" *ngFor="let field of fields" [style.width]="getColumnWith(field)">\n        <adf-form-field *ngIf="field" [field]="field"></adf-form-field>\n    </div>\n</section>\n\n\n',
        host: baseHost,
        encapsulation: ViewEncapsulation.None,
        styles: ['']
      }
    ]
  }
];
/** @nocollapse */
ContainerWidgetComponent.ctorParameters = () => [{ type: FormService }];
if (false) {
  /** @type {?} */
  ContainerWidgetComponent.prototype.content;
  /** @type {?} */
  ContainerWidgetComponent.prototype.formService;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGFpbmVyLndpZGdldC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BhbGZyZXNjby9hZGYtY29yZS8iLCJzb3VyY2VzIjpbImZvcm0vY29tcG9uZW50cy93aWRnZXRzL2NvbnRhaW5lci9jb250YWluZXIud2lkZ2V0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW1CQSxPQUFPLEVBQWlCLFNBQVMsRUFBVSxpQkFBaUIsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNwRixPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sa0NBQWtDLENBQUM7QUFFL0QsT0FBTyxFQUFFLFFBQVEsRUFBRyxlQUFlLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUNuRSxPQUFPLEVBQUUsNkJBQTZCLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQVN6RSxNQUFNLE9BQU8sd0JBQXlCLFNBQVEsZUFBZTs7OztJQUl6RCxZQUFtQixXQUF3QjtRQUN0QyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUM7UUFETCxnQkFBVyxHQUFYLFdBQVcsQ0FBYTtJQUUzQyxDQUFDOzs7O0lBRUQsaUJBQWlCO1FBQ2IsSUFBSSxJQUFJLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxFQUFFLEVBQUU7WUFDOUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQztTQUN0RDtJQUNMLENBQUM7Ozs7SUFFRCxRQUFRO1FBQ0osSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFO1lBQ1osSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLDZCQUE2QixDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUNoRTtJQUNMLENBQUM7Ozs7O0lBS0QsSUFBSSxNQUFNOztjQUNBLE1BQU0sR0FBRyxFQUFFOztZQUViLGtCQUFrQixHQUFHLElBQUk7O1lBQ3pCLFFBQVEsR0FBRyxDQUFDO1FBRWhCLE9BQU8sa0JBQWtCLEVBQUU7WUFDdkIsa0JBQWtCLEdBQUcsS0FBSyxDQUFDO1lBQzNCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUc7O3NCQUM3QyxLQUFLLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQztnQkFDdEQsSUFBSSxLQUFLLEVBQUU7b0JBQ1Asa0JBQWtCLEdBQUcsSUFBSSxDQUFDO2lCQUM3QjtnQkFFRCxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO2FBQ3RCO1lBQ0QsUUFBUSxFQUFFLENBQUM7U0FDZDtRQUVELE9BQU8sTUFBTSxDQUFDO0lBQ2xCLENBQUM7Ozs7Ozs7SUFPRCxhQUFhLENBQUMsS0FBcUI7O2NBQ3pCLE9BQU8sR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDekMsT0FBTyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsR0FBRyxPQUFPLEdBQUcsR0FBRyxDQUFDO0lBQ3JFLENBQUM7OztZQTVESixTQUFTLFNBQUM7Z0JBQ1AsUUFBUSxFQUFFLGtCQUFrQjtnQkFDNUIsdzZCQUFzQztnQkFFdEMsSUFBSSxFQUFFLFFBQVE7Z0JBQ2QsYUFBYSxFQUFFLGlCQUFpQixDQUFDLElBQUk7O2FBQ3hDOzs7O1lBWFEsV0FBVzs7OztJQWNoQiwyQ0FBdUM7O0lBRTNCLCtDQUErQiIsInNvdXJjZXNDb250ZW50IjpbIi8qIVxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE5IEFsZnJlc2NvIFNvZnR3YXJlLCBMdGQuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbiAvKiB0c2xpbnQ6ZGlzYWJsZTpjb21wb25lbnQtc2VsZWN0b3IgICovXG5cbmltcG9ydCB7IEFmdGVyVmlld0luaXQsIENvbXBvbmVudCwgT25Jbml0LCBWaWV3RW5jYXBzdWxhdGlvbiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRm9ybVNlcnZpY2UgfSBmcm9tICcuLy4uLy4uLy4uL3NlcnZpY2VzL2Zvcm0uc2VydmljZSc7XG5pbXBvcnQgeyBGb3JtRmllbGRNb2RlbCB9IGZyb20gJy4vLi4vY29yZS9mb3JtLWZpZWxkLm1vZGVsJztcbmltcG9ydCB7IGJhc2VIb3N0ICwgV2lkZ2V0Q29tcG9uZW50IH0gZnJvbSAnLi8uLi93aWRnZXQuY29tcG9uZW50JztcbmltcG9ydCB7IENvbnRhaW5lcldpZGdldENvbXBvbmVudE1vZGVsIH0gZnJvbSAnLi9jb250YWluZXIud2lkZ2V0Lm1vZGVsJztcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdjb250YWluZXItd2lkZ2V0JyxcbiAgICB0ZW1wbGF0ZVVybDogJy4vY29udGFpbmVyLndpZGdldC5odG1sJyxcbiAgICBzdHlsZVVybHM6IFsnLi9jb250YWluZXIud2lkZ2V0LnNjc3MnXSxcbiAgICBob3N0OiBiYXNlSG9zdCxcbiAgICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lXG59KVxuZXhwb3J0IGNsYXNzIENvbnRhaW5lcldpZGdldENvbXBvbmVudCBleHRlbmRzIFdpZGdldENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgQWZ0ZXJWaWV3SW5pdCB7XG5cbiAgICBjb250ZW50OiBDb250YWluZXJXaWRnZXRDb21wb25lbnRNb2RlbDtcblxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBmb3JtU2VydmljZTogRm9ybVNlcnZpY2UpIHtcbiAgICAgICAgIHN1cGVyKGZvcm1TZXJ2aWNlKTtcbiAgICB9XG5cbiAgICBvbkV4cGFuZGVyQ2xpY2tlZCgpIHtcbiAgICAgICAgaWYgKHRoaXMuY29udGVudCAmJiB0aGlzLmNvbnRlbnQuaXNDb2xsYXBzaWJsZSgpKSB7XG4gICAgICAgICAgICB0aGlzLmNvbnRlbnQuaXNFeHBhbmRlZCA9ICF0aGlzLmNvbnRlbnQuaXNFeHBhbmRlZDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG5nT25Jbml0KCkge1xuICAgICAgICBpZiAodGhpcy5maWVsZCkge1xuICAgICAgICAgICAgdGhpcy5jb250ZW50ID0gbmV3IENvbnRhaW5lcldpZGdldENvbXBvbmVudE1vZGVsKHRoaXMuZmllbGQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2VyaWFsaXplcyBjb2x1bW4gZmllbGRzXG4gICAgICovXG4gICAgZ2V0IGZpZWxkcygpOiBGb3JtRmllbGRNb2RlbFtdIHtcbiAgICAgICAgY29uc3QgZmllbGRzID0gW107XG5cbiAgICAgICAgbGV0IHJvd0NvbnRhaW5zRWxlbWVudCA9IHRydWUsXG4gICAgICAgICAgICByb3dJbmRleCA9IDA7XG5cbiAgICAgICAgd2hpbGUgKHJvd0NvbnRhaW5zRWxlbWVudCkge1xuICAgICAgICAgICAgcm93Q29udGFpbnNFbGVtZW50ID0gZmFsc2U7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuY29udGVudC5jb2x1bW5zLmxlbmd0aDsgaSsrICkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGZpZWxkID0gdGhpcy5jb250ZW50LmNvbHVtbnNbaV0uZmllbGRzW3Jvd0luZGV4XTtcbiAgICAgICAgICAgICAgICBpZiAoZmllbGQpIHtcbiAgICAgICAgICAgICAgICAgICAgcm93Q29udGFpbnNFbGVtZW50ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBmaWVsZHMucHVzaChmaWVsZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByb3dJbmRleCsrO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZpZWxkcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDYWxjdWxhdGUgdGhlIGNvbHVtbiB3aWR0aCBiYXNlZCBvbiB0aGUgbnVtYmVyT2ZDb2x1bW5zIGFuZCBjdXJyZW50IGZpZWxkJ3MgY29sc3BhbiBwcm9wZXJ0eVxuICAgICAqXG4gICAgICogQHBhcmFtIGZpZWxkXG4gICAgICovXG4gICAgZ2V0Q29sdW1uV2l0aChmaWVsZDogRm9ybUZpZWxkTW9kZWwpOiBzdHJpbmcge1xuICAgICAgICBjb25zdCBjb2xzcGFuID0gZmllbGQgPyBmaWVsZC5jb2xzcGFuIDogMTtcbiAgICAgICAgcmV0dXJuICgxMDAgLyB0aGlzLmNvbnRlbnQuanNvbi5udW1iZXJPZkNvbHVtbnMpICogY29sc3BhbiArICclJztcbiAgICB9XG59XG4iXX0=
