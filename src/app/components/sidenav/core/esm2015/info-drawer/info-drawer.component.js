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
  Component,
  ContentChildren,
  EventEmitter,
  Input,
  Output,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
export class InfoDrawerTabComponent {
  constructor() {
    /**
     * The title of the tab (string or translation key).
     */
    this.label = '';
    /**
     * Icon to render for the tab.
     */
    this.icon = null;
  }
}
InfoDrawerTabComponent.decorators = [
  {
    type: Component,
    args: [
      {
        selector: 'adf-info-drawer-tab',
        template: '<ng-template><ng-content></ng-content></ng-template>'
      }
    ]
  }
];
InfoDrawerTabComponent.propDecorators = {
  label: [{ type: Input }],
  icon: [{ type: Input }],
  content: [{ type: ViewChild, args: [TemplateRef] }]
};
if (false) {
  /**
   * The title of the tab (string or translation key).
   * @type {?}
   */
  InfoDrawerTabComponent.prototype.label;
  /**
   * Icon to render for the tab.
   * @type {?}
   */
  InfoDrawerTabComponent.prototype.icon;
  /** @type {?} */
  InfoDrawerTabComponent.prototype.content;
}
export class InfoDrawerComponent {
  constructor() {
    /**
     * The title of the info drawer (string or translation key).
     */
    this.title = null;
    /**
     * The selected index tab.
     */
    this.selectedIndex = 0;
    /**
     * Emitted when the currently active tab changes.
     */
    this.currentTab = new EventEmitter();
  }
  /**
   * @return {?}
   */
  showTabLayout() {
    return this.contentBlocks.length > 0;
  }
  /**
   * @param {?} event
   * @return {?}
   */
  onTabChange(event) {
    this.currentTab.emit(event.index);
  }
}
InfoDrawerComponent.decorators = [
  {
    type: Component,
    args: [
      {
        selector: 'adf-info-drawer',
        template:
          '<adf-info-drawer-layout>\n    <div role="heading" aria-level="1" *ngIf="title" info-drawer-title>{{ title | translate }}</div>\n    <ng-content *ngIf="!title" info-drawer-title select="[info-drawer-title]"></ng-content>\n\n    <ng-content info-drawer-buttons select="[info-drawer-buttons]"></ng-content>\n\n    <ng-container info-drawer-content *ngIf="showTabLayout(); then tabLayout else singleLayout"></ng-container>\n\n    <ng-template #tabLayout>\n        <mat-tab-group [(selectedIndex)]="selectedIndex" class="adf-info-drawer-tabs" (selectedTabChange)="onTabChange($event)">\n            <mat-tab *ngFor="let contentBlock of contentBlocks"\n                [label]="contentBlock.label | translate"\n                class="adf-info-drawer-tab">\n\n                <ng-template mat-tab-label>\n                    <mat-icon *ngIf="contentBlock.icon">{{ contentBlock.icon }}</mat-icon>\n                    <span *ngIf="contentBlock.label">{{ contentBlock.label | translate }}</span>\n                </ng-template>\n\n                <ng-container *ngTemplateOutlet="contentBlock.content"></ng-container>\n            </mat-tab>\n        </mat-tab-group>\n    </ng-template>\n\n    <ng-template #singleLayout>\n        <ng-content select="[info-drawer-content]"></ng-content>\n    </ng-template>\n</adf-info-drawer-layout>\n',
        encapsulation: ViewEncapsulation.None,
        host: { class: 'adf-info-drawer' },
        styles: [
          '.adf-info-drawer{display:block}.adf-info-drawer .mat-tab-label{min-width:0}.adf-info-drawer .adf-info-drawer-layout-content{padding:0}.adf-info-drawer .adf-info-drawer-layout-content>:not(.adf-info-drawer-tabs){padding:10px}.adf-info-drawer .adf-info-drawer-layout-content .adf-info-drawer-tabs .mat-tab-body-content>*,.adf-info-drawer .adf-info-drawer-layout-content>:not(.adf-info-drawer-tabs)>*{margin-bottom:20px;display:block}.adf-info-drawer .adf-info-drawer-layout-content .adf-info-drawer-tabs .mat-tab-body-content>:last-child{margin-bottom:0}.adf-info-drawer .adf-info-drawer-layout-content .adf-info-drawer-tabs .mat-tab-label{flex-grow:1}.adf-info-drawer .adf-info-drawer-layout-content .adf-info-drawer-tabs .mat-tab-label .mat-icon+span{padding-left:5px}.adf-info-drawer .adf-info-drawer-layout-content .adf-info-drawer-tabs .mat-ink-bar{height:4px}.adf-info-drawer .adf-info-drawer-layout-content .adf-info-drawer-tabs .mat-tab-body{padding:10px}.adf-info-drawer .adf-info-drawer-layout-content .adf-info-drawer-tabs .mat-tab-body-content{overflow:initial}'
        ]
      }
    ]
  }
];
InfoDrawerComponent.propDecorators = {
  title: [{ type: Input }],
  selectedIndex: [{ type: Input }],
  currentTab: [{ type: Output }],
  contentBlocks: [{ type: ContentChildren, args: [InfoDrawerTabComponent] }]
};
if (false) {
  /**
   * The title of the info drawer (string or translation key).
   * @type {?}
   */
  InfoDrawerComponent.prototype.title;
  /**
   * The selected index tab.
   * @type {?}
   */
  InfoDrawerComponent.prototype.selectedIndex;
  /**
   * Emitted when the currently active tab changes.
   * @type {?}
   */
  InfoDrawerComponent.prototype.currentTab;
  /** @type {?} */
  InfoDrawerComponent.prototype.contentBlocks;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5mby1kcmF3ZXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vQGFsZnJlc2NvL2FkZi1jb3JlLyIsInNvdXJjZXMiOlsiaW5mby1kcmF3ZXIvaW5mby1kcmF3ZXIuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBaUJBLE9BQU8sRUFBRSxTQUFTLEVBQUUsZUFBZSxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBRSxXQUFXLEVBQUUsU0FBUyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sZUFBZSxDQUFDO0FBTTlJLE1BQU0sT0FBTyxzQkFBc0I7SUFKbkM7Ozs7UUFPSSxVQUFLLEdBQVcsRUFBRSxDQUFDOzs7O1FBSW5CLFNBQUksR0FBVyxJQUFJLENBQUM7SUFJeEIsQ0FBQzs7O1lBZkEsU0FBUyxTQUFDO2dCQUNQLFFBQVEsRUFBRSxxQkFBcUI7Z0JBQy9CLFFBQVEsRUFBRSxzREFBc0Q7YUFDbkU7OztvQkFHSSxLQUFLO21CQUlMLEtBQUs7c0JBR0wsU0FBUyxTQUFDLFdBQVc7Ozs7Ozs7SUFQdEIsdUNBQ21COzs7OztJQUduQixzQ0FDb0I7O0lBRXBCLHlDQUMwQjs7QUFVOUIsTUFBTSxPQUFPLG1CQUFtQjtJQVBoQzs7OztRQVVJLFVBQUssR0FBZ0IsSUFBSSxDQUFDOzs7O1FBSTFCLGtCQUFhLEdBQVcsQ0FBQyxDQUFDOzs7O1FBSTFCLGVBQVUsR0FBeUIsSUFBSSxZQUFZLEVBQVUsQ0FBQztJQVlsRSxDQUFDOzs7O0lBUEcsYUFBYTtRQUNULE9BQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0lBQ3pDLENBQUM7Ozs7O0lBRUQsV0FBVyxDQUFDLEtBQXdCO1FBQ2hDLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUN0QyxDQUFDOzs7WUE3QkosU0FBUyxTQUFDO2dCQUNQLFFBQVEsRUFBRSxpQkFBaUI7Z0JBQzNCLDgxQ0FBMkM7Z0JBRTNDLGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJO2dCQUNyQyxJQUFJLEVBQUUsRUFBRSxPQUFPLEVBQUUsaUJBQWlCLEVBQUU7O2FBQ3ZDOzs7b0JBR0ksS0FBSzs0QkFJTCxLQUFLO3lCQUlMLE1BQU07NEJBR04sZUFBZSxTQUFDLHNCQUFzQjs7Ozs7OztJQVh2QyxvQ0FDMEI7Ozs7O0lBRzFCLDRDQUMwQjs7Ozs7SUFHMUIseUNBQzhEOztJQUU5RCw0Q0FDaUQiLCJzb3VyY2VzQ29udGVudCI6WyIvKiFcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxOSBBbGZyZXNjbyBTb2Z0d2FyZSwgTHRkLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgeyBDb21wb25lbnQsIENvbnRlbnRDaGlsZHJlbiwgRXZlbnRFbWl0dGVyLCBJbnB1dCwgT3V0cHV0LCBRdWVyeUxpc3QsIFRlbXBsYXRlUmVmLCBWaWV3Q2hpbGQsIFZpZXdFbmNhcHN1bGF0aW9uIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBNYXRUYWJDaGFuZ2VFdmVudCB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsJztcbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAnYWRmLWluZm8tZHJhd2VyLXRhYicsXG4gICAgdGVtcGxhdGU6ICc8bmctdGVtcGxhdGU+PG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PjwvbmctdGVtcGxhdGU+J1xufSlcbmV4cG9ydCBjbGFzcyBJbmZvRHJhd2VyVGFiQ29tcG9uZW50IHtcbiAgICAvKiogVGhlIHRpdGxlIG9mIHRoZSB0YWIgKHN0cmluZyBvciB0cmFuc2xhdGlvbiBrZXkpLiAqL1xuICAgIEBJbnB1dCgpXG4gICAgbGFiZWw6IHN0cmluZyA9ICcnO1xuXG4gICAgLyoqIEljb24gdG8gcmVuZGVyIGZvciB0aGUgdGFiLiAqL1xuICAgIEBJbnB1dCgpXG4gICAgaWNvbjogc3RyaW5nID0gbnVsbDtcblxuICAgIEBWaWV3Q2hpbGQoVGVtcGxhdGVSZWYpXG4gICAgY29udGVudDogVGVtcGxhdGVSZWY8YW55Pjtcbn1cblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdhZGYtaW5mby1kcmF3ZXInLFxuICAgIHRlbXBsYXRlVXJsOiAnLi9pbmZvLWRyYXdlci5jb21wb25lbnQuaHRtbCcsXG4gICAgc3R5bGVVcmxzOiBbJy4vaW5mby1kcmF3ZXIuY29tcG9uZW50LnNjc3MnXSxcbiAgICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICAgIGhvc3Q6IHsgJ2NsYXNzJzogJ2FkZi1pbmZvLWRyYXdlcicgfVxufSlcbmV4cG9ydCBjbGFzcyBJbmZvRHJhd2VyQ29tcG9uZW50IHtcbiAgICAvKiogVGhlIHRpdGxlIG9mIHRoZSBpbmZvIGRyYXdlciAoc3RyaW5nIG9yIHRyYW5zbGF0aW9uIGtleSkuICovXG4gICAgQElucHV0KClcbiAgICB0aXRsZTogc3RyaW5nfG51bGwgPSBudWxsO1xuXG4gICAgLyoqIFRoZSBzZWxlY3RlZCBpbmRleCB0YWIuICovXG4gICAgQElucHV0KClcbiAgICBzZWxlY3RlZEluZGV4OiBudW1iZXIgPSAwO1xuXG4gICAgLyoqIEVtaXR0ZWQgd2hlbiB0aGUgY3VycmVudGx5IGFjdGl2ZSB0YWIgY2hhbmdlcy4gKi9cbiAgICBAT3V0cHV0KClcbiAgICBjdXJyZW50VGFiOiBFdmVudEVtaXR0ZXI8bnVtYmVyPiA9IG5ldyBFdmVudEVtaXR0ZXI8bnVtYmVyPigpO1xuXG4gICAgQENvbnRlbnRDaGlsZHJlbihJbmZvRHJhd2VyVGFiQ29tcG9uZW50KVxuICAgIGNvbnRlbnRCbG9ja3M6IFF1ZXJ5TGlzdDxJbmZvRHJhd2VyVGFiQ29tcG9uZW50PjtcblxuICAgIHNob3dUYWJMYXlvdXQoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbnRlbnRCbG9ja3MubGVuZ3RoID4gMDtcbiAgICB9XG5cbiAgICBvblRhYkNoYW5nZShldmVudDogTWF0VGFiQ2hhbmdlRXZlbnQpIHtcbiAgICAgICAgdGhpcy5jdXJyZW50VGFiLmVtaXQoZXZlbnQuaW5kZXgpO1xuICAgIH1cbn1cbiJdfQ==
