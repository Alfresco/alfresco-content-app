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
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewEncapsulation
} from '@angular/core';
export class ToolbarComponent {
  constructor() {
    /**
     * Toolbar title.
     */
    this.title = '';
  }
}
ToolbarComponent.decorators = [
  {
    type: Component,
    args: [
      {
        selector: 'adf-toolbar',
        template:
          '<mat-toolbar [color]="color">\n    <span *ngIf="title">{{ title }}</span>\n    <ng-content select="adf-toolbar-title"></ng-content>\n    <ng-content></ng-content>\n</mat-toolbar>\n',
        changeDetection: ChangeDetectionStrategy.OnPush,
        encapsulation: ViewEncapsulation.None,
        host: { class: 'adf-toolbar' },
        styles: ['']
      }
    ]
  }
];
ToolbarComponent.propDecorators = {
  title: [{ type: Input }],
  color: [{ type: Input }]
};
if (false) {
  /**
   * Toolbar title.
   * @type {?}
   */
  ToolbarComponent.prototype.title;
  /**
   * Toolbar color. Can be changed to empty value (default), `primary`, `accent` or `warn`.
   * @type {?}
   */
  ToolbarComponent.prototype.color;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9vbGJhci5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AYWxmcmVzY28vYWRmLWNvcmUvIiwic291cmNlcyI6WyJ0b29sYmFyL3Rvb2xiYXIuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBaUJBLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sZUFBZSxDQUFDO0FBVzdGLE1BQU0sT0FBTyxnQkFBZ0I7SUFSN0I7Ozs7UUFZSSxVQUFLLEdBQVcsRUFBRSxDQUFDO0lBTXZCLENBQUM7OztZQWxCQSxTQUFTLFNBQUM7Z0JBQ1AsUUFBUSxFQUFFLGFBQWE7Z0JBQ3ZCLHNNQUF1QztnQkFFdkMsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07Z0JBQy9DLGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJO2dCQUNyQyxJQUFJLEVBQUUsRUFBRSxPQUFPLEVBQUUsYUFBYSxFQUFFOzthQUNuQzs7O29CQUlJLEtBQUs7b0JBSUwsS0FBSzs7Ozs7OztJQUpOLGlDQUNtQjs7Ozs7SUFHbkIsaUNBQ29CIiwic291cmNlc0NvbnRlbnQiOlsiLyohXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTkgQWxmcmVzY28gU29mdHdhcmUsIEx0ZC5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0IHsgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksIENvbXBvbmVudCwgSW5wdXQsIFZpZXdFbmNhcHN1bGF0aW9uIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBUaGVtZVBhbGV0dGUgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdhZGYtdG9vbGJhcicsXG4gICAgdGVtcGxhdGVVcmw6ICcuL3Rvb2xiYXIuY29tcG9uZW50Lmh0bWwnLFxuICAgIHN0eWxlVXJsczogWycuL3Rvb2xiYXIuY29tcG9uZW50LnNjc3MnXSxcbiAgICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICAgIGhvc3Q6IHsgJ2NsYXNzJzogJ2FkZi10b29sYmFyJyB9XG59KVxuZXhwb3J0IGNsYXNzIFRvb2xiYXJDb21wb25lbnQge1xuXG4gICAgLyoqIFRvb2xiYXIgdGl0bGUuICovXG4gICAgQElucHV0KClcbiAgICB0aXRsZTogc3RyaW5nID0gJyc7XG5cbiAgICAvKiogVG9vbGJhciBjb2xvci4gQ2FuIGJlIGNoYW5nZWQgdG8gZW1wdHkgdmFsdWUgKGRlZmF1bHQpLCBgcHJpbWFyeWAsIGBhY2NlbnRgIG9yIGB3YXJuYC4gKi9cbiAgICBASW5wdXQoKVxuICAgIGNvbG9yOiBUaGVtZVBhbGV0dGU7XG5cbn1cbiJdfQ==
