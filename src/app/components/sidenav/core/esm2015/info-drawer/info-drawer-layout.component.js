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
export class InfoDrawerLayoutComponent {}
InfoDrawerLayoutComponent.decorators = [
  {
    type: Component,
    args: [
      {
        selector: 'adf-info-drawer-layout',
        template:
          '<div class="adf-info-drawer-layout-header">\n    <div class="adf-info-drawer-layout-header-title">\n        <ng-content select="[info-drawer-title]"></ng-content>\n    </div>\n    <div class="adf-info-drawer-layout-header-buttons">\n        <ng-content select="[info-drawer-buttons]"></ng-content>\n    </div>\n</div>\n<div class="adf-info-drawer-layout-content">\n    <ng-content select="[info-drawer-content]"></ng-content>\n</div>',
        encapsulation: ViewEncapsulation.None,
        host: { class: 'adf-info-drawer-layout' },
        styles: ['']
      }
    ]
  }
];
/**
 * Directive selectors without adf- prefix will be deprecated on 3.0.0
 */
export class InfoDrawerTitleDirective {}
InfoDrawerTitleDirective.decorators = [
  {
    type: Directive,
    args: [{ selector: '[adf-info-drawer-title], [info-drawer-title]' }]
  }
];
export class InfoDrawerButtonsDirective {}
InfoDrawerButtonsDirective.decorators = [
  {
    type: Directive,
    args: [{ selector: '[adf-info-drawer-buttons], [info-drawer-buttons]' }]
  }
];
export class InfoDrawerContentDirective {}
InfoDrawerContentDirective.decorators = [
  {
    type: Directive,
    args: [{ selector: '[adf-info-drawer-content], [info-drawer-content]' }]
  }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5mby1kcmF3ZXItbGF5b3V0LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BhbGZyZXNjby9hZGYtY29yZS8iLCJzb3VyY2VzIjpbImluZm8tZHJhd2VyL2luZm8tZHJhd2VyLWxheW91dC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFpQkEsT0FBTyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFTeEUsTUFBTSxPQUFPLHlCQUF5Qjs7O1lBUHJDLFNBQVMsU0FBQztnQkFDUCxRQUFRLEVBQUUsd0JBQXdCO2dCQUNsQywyY0FBa0Q7Z0JBRWxELGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJO2dCQUNyQyxJQUFJLEVBQUUsRUFBRSxPQUFPLEVBQUUsd0JBQXdCLEVBQUU7O2FBQzlDOzs7OztBQU13RSxNQUFNLE9BQU8sd0JBQXdCOzs7WUFBN0csU0FBUyxTQUFDLEVBQUUsUUFBUSxFQUFFLDhDQUE4QyxFQUFFOztBQUNNLE1BQU0sT0FBTywwQkFBMEI7OztZQUFuSCxTQUFTLFNBQUMsRUFBRSxRQUFRLEVBQUUsa0RBQWtELEVBQUU7O0FBQ0UsTUFBTSxPQUFPLDBCQUEwQjs7O1lBQW5ILFNBQVMsU0FBQyxFQUFFLFFBQVEsRUFBRSxrREFBa0QsRUFBRSIsInNvdXJjZXNDb250ZW50IjpbIi8qIVxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE5IEFsZnJlc2NvIFNvZnR3YXJlLCBMdGQuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbmltcG9ydCB7IENvbXBvbmVudCwgRGlyZWN0aXZlLCBWaWV3RW5jYXBzdWxhdGlvbiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ2FkZi1pbmZvLWRyYXdlci1sYXlvdXQnLFxuICAgIHRlbXBsYXRlVXJsOiAnLi9pbmZvLWRyYXdlci1sYXlvdXQuY29tcG9uZW50Lmh0bWwnLFxuICAgIHN0eWxlVXJsczogWycuL2luZm8tZHJhd2VyLWxheW91dC5jb21wb25lbnQuc2NzcyddLFxuICAgIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gICAgaG9zdDogeyAnY2xhc3MnOiAnYWRmLWluZm8tZHJhd2VyLWxheW91dCcgfVxufSlcbmV4cG9ydCBjbGFzcyBJbmZvRHJhd2VyTGF5b3V0Q29tcG9uZW50IHt9XG5cbi8qKlxuICogRGlyZWN0aXZlIHNlbGVjdG9ycyB3aXRob3V0IGFkZi0gcHJlZml4IHdpbGwgYmUgZGVwcmVjYXRlZCBvbiAzLjAuMFxuICovXG5ARGlyZWN0aXZlKHsgc2VsZWN0b3I6ICdbYWRmLWluZm8tZHJhd2VyLXRpdGxlXSwgW2luZm8tZHJhd2VyLXRpdGxlXScgfSkgZXhwb3J0IGNsYXNzIEluZm9EcmF3ZXJUaXRsZURpcmVjdGl2ZSB7fVxuQERpcmVjdGl2ZSh7IHNlbGVjdG9yOiAnW2FkZi1pbmZvLWRyYXdlci1idXR0b25zXSwgW2luZm8tZHJhd2VyLWJ1dHRvbnNdJyB9KSBleHBvcnQgY2xhc3MgSW5mb0RyYXdlckJ1dHRvbnNEaXJlY3RpdmUge31cbkBEaXJlY3RpdmUoeyBzZWxlY3RvcjogJ1thZGYtaW5mby1kcmF3ZXItY29udGVudF0sIFtpbmZvLWRyYXdlci1jb250ZW50XScgfSkgZXhwb3J0IGNsYXNzIEluZm9EcmF3ZXJDb250ZW50RGlyZWN0aXZlIHt9XG4iXX0=
