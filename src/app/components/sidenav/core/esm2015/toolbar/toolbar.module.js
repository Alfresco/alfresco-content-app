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
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MaterialModule } from '../material.module';
import { ToolbarDividerComponent } from './toolbar-divider.component';
import { ToolbarTitleComponent } from './toolbar-title.component';
import { ToolbarComponent } from './toolbar.component';
export class ToolbarModule {}
ToolbarModule.decorators = [
  {
    type: NgModule,
    args: [
      {
        imports: [CommonModule, MaterialModule],
        declarations: [
          ToolbarComponent,
          ToolbarTitleComponent,
          ToolbarDividerComponent
        ],
        exports: [
          ToolbarComponent,
          ToolbarTitleComponent,
          ToolbarDividerComponent
        ]
      }
    ]
  }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9vbGJhci5tb2R1bGUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AYWxmcmVzY28vYWRmLWNvcmUvIiwic291cmNlcyI6WyJ0b29sYmFyL3Rvb2xiYXIubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBaUJBLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUVwRCxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUN0RSxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUNsRSxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQWtCdkQsTUFBTSxPQUFPLGFBQWE7OztZQWhCekIsUUFBUSxTQUFDO2dCQUNOLE9BQU8sRUFBRTtvQkFDTCxZQUFZO29CQUNaLGNBQWM7aUJBQ2pCO2dCQUNELFlBQVksRUFBRTtvQkFDVixnQkFBZ0I7b0JBQ2hCLHFCQUFxQjtvQkFDckIsdUJBQXVCO2lCQUMxQjtnQkFDRCxPQUFPLEVBQUU7b0JBQ0wsZ0JBQWdCO29CQUNoQixxQkFBcUI7b0JBQ3JCLHVCQUF1QjtpQkFDMUI7YUFDSiIsInNvdXJjZXNDb250ZW50IjpbIi8qIVxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE5IEFsZnJlc2NvIFNvZnR3YXJlLCBMdGQuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTWF0ZXJpYWxNb2R1bGUgfSBmcm9tICcuLi9tYXRlcmlhbC5tb2R1bGUnO1xuXG5pbXBvcnQgeyBUb29sYmFyRGl2aWRlckNvbXBvbmVudCB9IGZyb20gJy4vdG9vbGJhci1kaXZpZGVyLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBUb29sYmFyVGl0bGVDb21wb25lbnQgfSBmcm9tICcuL3Rvb2xiYXItdGl0bGUuY29tcG9uZW50JztcbmltcG9ydCB7IFRvb2xiYXJDb21wb25lbnQgfSBmcm9tICcuL3Rvb2xiYXIuY29tcG9uZW50JztcblxuQE5nTW9kdWxlKHtcbiAgICBpbXBvcnRzOiBbXG4gICAgICAgIENvbW1vbk1vZHVsZSxcbiAgICAgICAgTWF0ZXJpYWxNb2R1bGVcbiAgICBdLFxuICAgIGRlY2xhcmF0aW9uczogW1xuICAgICAgICBUb29sYmFyQ29tcG9uZW50LFxuICAgICAgICBUb29sYmFyVGl0bGVDb21wb25lbnQsXG4gICAgICAgIFRvb2xiYXJEaXZpZGVyQ29tcG9uZW50XG4gICAgXSxcbiAgICBleHBvcnRzOiBbXG4gICAgICAgIFRvb2xiYXJDb21wb25lbnQsXG4gICAgICAgIFRvb2xiYXJUaXRsZUNvbXBvbmVudCxcbiAgICAgICAgVG9vbGJhckRpdmlkZXJDb21wb25lbnRcbiAgICBdXG59KVxuZXhwb3J0IGNsYXNzIFRvb2xiYXJNb2R1bGUge31cbiJdfQ==
