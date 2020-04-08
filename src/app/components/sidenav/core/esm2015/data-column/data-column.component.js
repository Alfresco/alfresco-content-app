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
/* tslint:disable:component-selector no-input-rename  */
import { Component, ContentChild, Input, TemplateRef } from '@angular/core';
export class DataColumnComponent {
  constructor() {
    /**
     * Value type for the column. Possible settings are 'text', 'image',
     * 'date', 'fileSize', 'location', and 'json'.
     */
    this.type = 'text';
    /**
     * Toggles ability to sort by this column, for example by clicking the column header.
     */
    this.sortable = true;
    /**
     * Display title of the column, typically used for column headers. You can use the
     * i18n resource key to get it translated automatically.
     */
    this.title = '';
    /**
     * Toggles the editing support of the column data.
     */
    this.editable = false;
    /**
     * Enable or disable cell focus
     */
    this.focus = true;
  }
  /**
   * @return {?}
   */
  ngOnInit() {
    if (!this.srTitle && this.key === '$thumbnail') {
      this.srTitle = 'Thumbnail';
    }
  }
}
DataColumnComponent.decorators = [
  {
    type: Component,
    args: [
      {
        selector: 'data-column',
        template: ''
      }
    ]
  }
];
DataColumnComponent.propDecorators = {
  key: [{ type: Input }],
  type: [{ type: Input }],
  format: [{ type: Input }],
  sortable: [{ type: Input }],
  title: [{ type: Input }],
  template: [{ type: ContentChild, args: [TemplateRef] }],
  formatTooltip: [{ type: Input }],
  srTitle: [{ type: Input, args: ['sr-title'] }],
  cssClass: [{ type: Input, args: ['class'] }],
  copyContent: [{ type: Input }],
  editable: [{ type: Input }],
  focus: [{ type: Input }]
};
if (false) {
  /**
   * Data source key. Can be either a column/property key like `title`
   *  or a property path like `createdBy.name`.
   * @type {?}
   */
  DataColumnComponent.prototype.key;
  /**
   * Value type for the column. Possible settings are 'text', 'image',
   * 'date', 'fileSize', 'location', and 'json'.
   * @type {?}
   */
  DataColumnComponent.prototype.type;
  /**
   * Value format (if supported by the parent component), for example format of the date.
   * @type {?}
   */
  DataColumnComponent.prototype.format;
  /**
   * Toggles ability to sort by this column, for example by clicking the column header.
   * @type {?}
   */
  DataColumnComponent.prototype.sortable;
  /**
   * Display title of the column, typically used for column headers. You can use the
   * i18n resource key to get it translated automatically.
   * @type {?}
   */
  DataColumnComponent.prototype.title;
  /** @type {?} */
  DataColumnComponent.prototype.template;
  /**
   * Custom tooltip formatter function.
   * @type {?}
   */
  DataColumnComponent.prototype.formatTooltip;
  /**
   * Title to be used for screen readers.
   * @type {?}
   */
  DataColumnComponent.prototype.srTitle;
  /**
   * Additional CSS class to be applied to column (header and cells).
   * @type {?}
   */
  DataColumnComponent.prototype.cssClass;
  /**
   * Enables/disables a Clipboard directive to allow copying of cell contents.
   * @type {?}
   */
  DataColumnComponent.prototype.copyContent;
  /**
   * Toggles the editing support of the column data.
   * @type {?}
   */
  DataColumnComponent.prototype.editable;
  /**
   * Enable or disable cell focus
   * @type {?}
   */
  DataColumnComponent.prototype.focus;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YS1jb2x1bW4uY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vQGFsZnJlc2NvL2FkZi1jb3JlLyIsInNvdXJjZXMiOlsiZGF0YS1jb2x1bW4vZGF0YS1jb2x1bW4uY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW1CQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQVUsV0FBVyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBTXBGLE1BQU0sT0FBTyxtQkFBbUI7SUFKaEM7Ozs7O1FBZ0JJLFNBQUksR0FBVyxNQUFNLENBQUM7Ozs7UUFRdEIsYUFBUSxHQUFZLElBQUksQ0FBQzs7Ozs7UUFNekIsVUFBSyxHQUFXLEVBQUUsQ0FBQzs7OztRQXVCbkIsYUFBUSxHQUFZLEtBQUssQ0FBQzs7OztRQUkxQixVQUFLLEdBQVksSUFBSSxDQUFDO0lBTzFCLENBQUM7Ozs7SUFMRyxRQUFRO1FBQ0osSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDLEdBQUcsS0FBSyxZQUFZLEVBQUU7WUFDNUMsSUFBSSxDQUFDLE9BQU8sR0FBRyxXQUFXLENBQUM7U0FDOUI7SUFDTCxDQUFDOzs7WUEvREosU0FBUyxTQUFDO2dCQUNQLFFBQVEsRUFBRSxhQUFhO2dCQUN2QixRQUFRLEVBQUUsRUFBRTthQUNmOzs7a0JBTUksS0FBSzttQkFNTCxLQUFLO3FCQUlMLEtBQUs7dUJBSUwsS0FBSztvQkFNTCxLQUFLO3VCQUdMLFlBQVksU0FBQyxXQUFXOzRCQUl4QixLQUFLO3NCQUlMLEtBQUssU0FBQyxVQUFVO3VCQUloQixLQUFLLFNBQUMsT0FBTzswQkFJYixLQUFLO3VCQUlMLEtBQUs7b0JBSUwsS0FBSzs7Ozs7Ozs7SUEvQ04sa0NBQ1k7Ozs7OztJQUtaLG1DQUNzQjs7Ozs7SUFHdEIscUNBQ2U7Ozs7O0lBR2YsdUNBQ3lCOzs7Ozs7SUFLekIsb0NBQ21COztJQUVuQix1Q0FDYzs7Ozs7SUFHZCw0Q0FDd0I7Ozs7O0lBR3hCLHNDQUNnQjs7Ozs7SUFHaEIsdUNBQ2lCOzs7OztJQUdqQiwwQ0FDcUI7Ozs7O0lBR3JCLHVDQUMwQjs7Ozs7SUFHMUIsb0NBQ3NCIiwic291cmNlc0NvbnRlbnQiOlsiLyohXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTkgQWxmcmVzY28gU29mdHdhcmUsIEx0ZC5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuIC8qIHRzbGludDpkaXNhYmxlOmNvbXBvbmVudC1zZWxlY3RvciBuby1pbnB1dC1yZW5hbWUgICovXG5cbmltcG9ydCB7IENvbXBvbmVudCwgQ29udGVudENoaWxkLCBJbnB1dCwgT25Jbml0LCBUZW1wbGF0ZVJlZiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ2RhdGEtY29sdW1uJyxcbiAgICB0ZW1wbGF0ZTogJydcbn0pXG5leHBvcnQgY2xhc3MgRGF0YUNvbHVtbkNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG5cbiAgICAvKiogRGF0YSBzb3VyY2Uga2V5LiBDYW4gYmUgZWl0aGVyIGEgY29sdW1uL3Byb3BlcnR5IGtleSBsaWtlIGB0aXRsZWBcbiAgICAgKiAgb3IgYSBwcm9wZXJ0eSBwYXRoIGxpa2UgYGNyZWF0ZWRCeS5uYW1lYC5cbiAgICAgKi9cbiAgICBASW5wdXQoKVxuICAgIGtleTogc3RyaW5nO1xuXG4gICAgLyoqIFZhbHVlIHR5cGUgZm9yIHRoZSBjb2x1bW4uIFBvc3NpYmxlIHNldHRpbmdzIGFyZSAndGV4dCcsICdpbWFnZScsXG4gICAgICogJ2RhdGUnLCAnZmlsZVNpemUnLCAnbG9jYXRpb24nLCBhbmQgJ2pzb24nLlxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgdHlwZTogc3RyaW5nID0gJ3RleHQnO1xuXG4gICAgLyoqIFZhbHVlIGZvcm1hdCAoaWYgc3VwcG9ydGVkIGJ5IHRoZSBwYXJlbnQgY29tcG9uZW50KSwgZm9yIGV4YW1wbGUgZm9ybWF0IG9mIHRoZSBkYXRlLiAqL1xuICAgIEBJbnB1dCgpXG4gICAgZm9ybWF0OiBzdHJpbmc7XG5cbiAgICAvKiogVG9nZ2xlcyBhYmlsaXR5IHRvIHNvcnQgYnkgdGhpcyBjb2x1bW4sIGZvciBleGFtcGxlIGJ5IGNsaWNraW5nIHRoZSBjb2x1bW4gaGVhZGVyLiAqL1xuICAgIEBJbnB1dCgpXG4gICAgc29ydGFibGU6IGJvb2xlYW4gPSB0cnVlO1xuXG4gICAgLyoqIERpc3BsYXkgdGl0bGUgb2YgdGhlIGNvbHVtbiwgdHlwaWNhbGx5IHVzZWQgZm9yIGNvbHVtbiBoZWFkZXJzLiBZb3UgY2FuIHVzZSB0aGVcbiAgICAgKiBpMThuIHJlc291cmNlIGtleSB0byBnZXQgaXQgdHJhbnNsYXRlZCBhdXRvbWF0aWNhbGx5LlxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgdGl0bGU6IHN0cmluZyA9ICcnO1xuXG4gICAgQENvbnRlbnRDaGlsZChUZW1wbGF0ZVJlZilcbiAgICB0ZW1wbGF0ZTogYW55O1xuXG4gICAgLyoqIEN1c3RvbSB0b29sdGlwIGZvcm1hdHRlciBmdW5jdGlvbi4gKi9cbiAgICBASW5wdXQoKVxuICAgIGZvcm1hdFRvb2x0aXA6IEZ1bmN0aW9uO1xuXG4gICAgLyoqIFRpdGxlIHRvIGJlIHVzZWQgZm9yIHNjcmVlbiByZWFkZXJzLiAqL1xuICAgIEBJbnB1dCgnc3ItdGl0bGUnKVxuICAgIHNyVGl0bGU6IHN0cmluZztcblxuICAgIC8qKiBBZGRpdGlvbmFsIENTUyBjbGFzcyB0byBiZSBhcHBsaWVkIHRvIGNvbHVtbiAoaGVhZGVyIGFuZCBjZWxscykuICovXG4gICAgQElucHV0KCdjbGFzcycpXG4gICAgY3NzQ2xhc3M6IHN0cmluZztcblxuICAgICAvKiogRW5hYmxlcy9kaXNhYmxlcyBhIENsaXBib2FyZCBkaXJlY3RpdmUgdG8gYWxsb3cgY29weWluZyBvZiBjZWxsIGNvbnRlbnRzLiAqL1xuICAgIEBJbnB1dCgpXG4gICAgY29weUNvbnRlbnQ6IGJvb2xlYW47XG5cbiAgICAvKiogIFRvZ2dsZXMgdGhlIGVkaXRpbmcgc3VwcG9ydCBvZiB0aGUgY29sdW1uIGRhdGEuICovXG4gICAgQElucHV0KClcbiAgICBlZGl0YWJsZTogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgLyoqICBFbmFibGUgb3IgZGlzYWJsZSBjZWxsIGZvY3VzICovXG4gICAgQElucHV0KClcbiAgICBmb2N1czogYm9vbGVhbiA9IHRydWU7XG5cbiAgICBuZ09uSW5pdCgpIHtcbiAgICAgICAgaWYgKCF0aGlzLnNyVGl0bGUgJiYgdGhpcy5rZXkgPT09ICckdGh1bWJuYWlsJykge1xuICAgICAgICAgICAgdGhpcy5zclRpdGxlID0gJ1RodW1ibmFpbCc7XG4gICAgICAgIH1cbiAgICB9XG59XG4iXX0=
