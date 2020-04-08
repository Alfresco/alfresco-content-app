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
import { Component, Directive, ViewEncapsulation } from '@angular/core';
export class EmptyListComponent {}
EmptyListComponent.decorators = [
  {
    type: Component,
    args: [
      {
        selector: 'adf-empty-list',
        template:
          '<div class="adf-empty-list_template">\n    <ng-content select="[adf-empty-list-header]"></ng-content>\n    <ng-content select="[adf-empty-list-body]"></ng-content>\n    <ng-content select="[adf-empty-list-footer]"></ng-content>\n    <ng-content></ng-content>\n</div>',
        encapsulation: ViewEncapsulation.None,
        styles: [
          '.adf-empty-list_template{text-align:center;margin-top:20px;margin-bottom:20px}'
        ]
      }
    ]
  }
];
export class EmptyListHeaderDirective {}
EmptyListHeaderDirective.decorators = [
  { type: Directive, args: [{ selector: '[adf-empty-list-header]' }] }
];
export class EmptyListBodyDirective {}
EmptyListBodyDirective.decorators = [
  { type: Directive, args: [{ selector: '[adf-empty-list-body]' }] }
];
export class EmptyListFooterDirective {}
EmptyListFooterDirective.decorators = [
  { type: Directive, args: [{ selector: '[adf-empty-list-footer]' }] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW1wdHktbGlzdC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AYWxmcmVzY28vYWRmLWNvcmUvIiwic291cmNlcyI6WyJkYXRhdGFibGUvY29tcG9uZW50cy9kYXRhdGFibGUvZW1wdHktbGlzdC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFpQkEsT0FBTyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFReEUsTUFBTSxPQUFPLGtCQUFrQjs7O1lBTjlCLFNBQVMsU0FBQztnQkFDUCxRQUFRLEVBQUUsZ0JBQWdCO2dCQUUxQiw4UkFBMEM7Z0JBQzFDLGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJOzthQUN4Qzs7QUFHbUQsTUFBTSxPQUFPLHdCQUF3Qjs7O1lBQXhGLFNBQVMsU0FBQyxFQUFFLFFBQVEsRUFBRSx5QkFBeUIsRUFBRTs7QUFDQSxNQUFNLE9BQU8sc0JBQXNCOzs7WUFBcEYsU0FBUyxTQUFDLEVBQUUsUUFBUSxFQUFFLHVCQUF1QixFQUFFOztBQUNJLE1BQU0sT0FBTyx3QkFBd0I7OztZQUF4RixTQUFTLFNBQUMsRUFBRSxRQUFRLEVBQUUseUJBQXlCLEVBQUUiLCJzb3VyY2VzQ29udGVudCI6WyIvKiFcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxOSBBbGZyZXNjbyBTb2Z0d2FyZSwgTHRkLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgeyBDb21wb25lbnQsIERpcmVjdGl2ZSwgVmlld0VuY2Fwc3VsYXRpb24gfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdhZGYtZW1wdHktbGlzdCcsXG4gICAgc3R5bGVVcmxzOiBbJy4vZW1wdHktbGlzdC5jb21wb25lbnQuc2NzcyddLFxuICAgIHRlbXBsYXRlVXJsOiAnLi9lbXB0eS1saXN0LmNvbXBvbmVudC5odG1sJyxcbiAgICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lXG59KVxuZXhwb3J0IGNsYXNzIEVtcHR5TGlzdENvbXBvbmVudCB7fVxuXG5ARGlyZWN0aXZlKHsgc2VsZWN0b3I6ICdbYWRmLWVtcHR5LWxpc3QtaGVhZGVyXScgfSkgZXhwb3J0IGNsYXNzIEVtcHR5TGlzdEhlYWRlckRpcmVjdGl2ZSB7fVxuQERpcmVjdGl2ZSh7IHNlbGVjdG9yOiAnW2FkZi1lbXB0eS1saXN0LWJvZHldJyB9KSBleHBvcnQgY2xhc3MgRW1wdHlMaXN0Qm9keURpcmVjdGl2ZSB7fVxuQERpcmVjdGl2ZSh7IHNlbGVjdG9yOiAnW2FkZi1lbXB0eS1saXN0LWZvb3Rlcl0nIH0pIGV4cG9ydCBjbGFzcyBFbXB0eUxpc3RGb290ZXJEaXJlY3RpdmUge31cbiJdfQ==
