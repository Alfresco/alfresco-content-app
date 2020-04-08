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
import { FormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatDatepickerModule,
  MatTableModule,
  MatIconModule,
  MatInputModule,
  MatCheckboxModule,
  MatNativeDateModule,
  MatSelectModule,
  MatChipsModule,
  MatMenuModule,
  MatCardModule
} from '@angular/material';
import {
  MatDatetimepickerModule,
  MatNativeDatetimeModule
} from '@mat-datetimepicker/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';
import { CardViewContentProxyDirective } from './directives/card-view-content-proxy.directive';
import { CardViewComponent } from './components/card-view/card-view.component';
import { CardViewBoolItemComponent } from './components/card-view-boolitem/card-view-boolitem.component';
import { CardViewDateItemComponent } from './components/card-view-dateitem/card-view-dateitem.component';
import { CardViewItemDispatcherComponent } from './components/card-view-item-dispatcher/card-view-item-dispatcher.component';
import { CardViewMapItemComponent } from './components/card-view-mapitem/card-view-mapitem.component';
import { CardViewTextItemComponent } from './components/card-view-textitem/card-view-textitem.component';
import { CardViewKeyValuePairsItemComponent } from './components/card-view-keyvaluepairsitem/card-view-keyvaluepairsitem.component';
import { CardViewSelectItemComponent } from './components/card-view-selectitem/card-view-selectitem.component';
import { CardViewArrayItemComponent } from './components/card-view-arrayitem/card-view-arrayitem.component';
export class CardViewModule {}
CardViewModule.decorators = [
  {
    type: NgModule,
    args: [
      {
        imports: [
          CommonModule,
          FormsModule,
          FlexLayoutModule,
          TranslateModule.forChild(),
          MatDatepickerModule,
          MatNativeDateModule,
          MatCheckboxModule,
          MatInputModule,
          MatTableModule,
          MatIconModule,
          MatSelectModule,
          MatButtonModule,
          MatChipsModule,
          MatMenuModule,
          MatCardModule,
          MatDatetimepickerModule,
          MatNativeDatetimeModule
        ],
        declarations: [
          CardViewComponent,
          CardViewBoolItemComponent,
          CardViewDateItemComponent,
          CardViewMapItemComponent,
          CardViewTextItemComponent,
          CardViewKeyValuePairsItemComponent,
          CardViewSelectItemComponent,
          CardViewItemDispatcherComponent,
          CardViewContentProxyDirective,
          CardViewArrayItemComponent
        ],
        entryComponents: [
          CardViewBoolItemComponent,
          CardViewDateItemComponent,
          CardViewMapItemComponent,
          CardViewTextItemComponent,
          CardViewSelectItemComponent,
          CardViewKeyValuePairsItemComponent,
          CardViewArrayItemComponent
        ],
        exports: [
          CardViewComponent,
          CardViewBoolItemComponent,
          CardViewDateItemComponent,
          CardViewMapItemComponent,
          CardViewTextItemComponent,
          CardViewSelectItemComponent,
          CardViewKeyValuePairsItemComponent,
          CardViewArrayItemComponent
        ]
      }
    ]
  }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FyZC12aWV3Lm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BhbGZyZXNjby9hZGYtY29yZS8iLCJzb3VyY2VzIjpbImNhcmQtdmlldy9jYXJkLXZpZXcubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBaUJBLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUM3QyxPQUFPLEVBQ0gsZUFBZSxFQUNmLG1CQUFtQixFQUNuQixjQUFjLEVBQ2QsYUFBYSxFQUNiLGNBQWMsRUFDZCxpQkFBaUIsRUFDakIsbUJBQW1CLEVBQ25CLGVBQWUsRUFDZixjQUFjLEVBQ2QsYUFBYSxFQUNiLGFBQWEsRUFDaEIsTUFBTSxtQkFBbUIsQ0FBQztBQUMzQixPQUFPLEVBQUUsdUJBQXVCLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUM1RixPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUN4RCxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFFdEQsT0FBTyxFQUFFLDZCQUE2QixFQUFFLE1BQU0sZ0RBQWdELENBQUM7QUFDL0YsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sNENBQTRDLENBQUM7QUFDL0UsT0FBTyxFQUFFLHlCQUF5QixFQUFFLE1BQU0sOERBQThELENBQUM7QUFDekcsT0FBTyxFQUFFLHlCQUF5QixFQUFFLE1BQU0sOERBQThELENBQUM7QUFDekcsT0FBTyxFQUFFLCtCQUErQixFQUFFLE1BQU0sNEVBQTRFLENBQUM7QUFDN0gsT0FBTyxFQUFFLHdCQUF3QixFQUFFLE1BQU0sNERBQTRELENBQUM7QUFDdEcsT0FBTyxFQUFFLHlCQUF5QixFQUFFLE1BQU0sOERBQThELENBQUM7QUFDekcsT0FBTyxFQUFFLGtDQUFrQyxFQUFFLE1BQU0sZ0ZBQWdGLENBQUM7QUFDcEksT0FBTyxFQUFFLDJCQUEyQixFQUFFLE1BQU0sa0VBQWtFLENBQUM7QUFDL0csT0FBTyxFQUFFLDBCQUEwQixFQUFFLE1BQU0sZ0VBQWdFLENBQUM7QUFzRDVHLE1BQU0sT0FBTyxjQUFjOzs7WUFwRDFCLFFBQVEsU0FBQztnQkFDTixPQUFPLEVBQUU7b0JBQ0wsWUFBWTtvQkFDWixXQUFXO29CQUNYLGdCQUFnQjtvQkFDaEIsZUFBZSxDQUFDLFFBQVEsRUFBRTtvQkFDMUIsbUJBQW1CO29CQUNuQixtQkFBbUI7b0JBQ25CLGlCQUFpQjtvQkFDakIsY0FBYztvQkFDZCxjQUFjO29CQUNkLGFBQWE7b0JBQ2IsZUFBZTtvQkFDZixlQUFlO29CQUNmLGNBQWM7b0JBQ2QsYUFBYTtvQkFDYixhQUFhO29CQUNiLHVCQUF1QjtvQkFDdkIsdUJBQXVCO2lCQUMxQjtnQkFDRCxZQUFZLEVBQUU7b0JBQ1YsaUJBQWlCO29CQUNqQix5QkFBeUI7b0JBQ3pCLHlCQUF5QjtvQkFDekIsd0JBQXdCO29CQUN4Qix5QkFBeUI7b0JBQ3pCLGtDQUFrQztvQkFDbEMsMkJBQTJCO29CQUMzQiwrQkFBK0I7b0JBQy9CLDZCQUE2QjtvQkFDN0IsMEJBQTBCO2lCQUM3QjtnQkFDRCxlQUFlLEVBQUU7b0JBQ2IseUJBQXlCO29CQUN6Qix5QkFBeUI7b0JBQ3pCLHdCQUF3QjtvQkFDeEIseUJBQXlCO29CQUN6QiwyQkFBMkI7b0JBQzNCLGtDQUFrQztvQkFDbEMsMEJBQTBCO2lCQUM3QjtnQkFDRCxPQUFPLEVBQUU7b0JBQ0wsaUJBQWlCO29CQUNqQix5QkFBeUI7b0JBQ3pCLHlCQUF5QjtvQkFDekIsd0JBQXdCO29CQUN4Qix5QkFBeUI7b0JBQ3pCLDJCQUEyQjtvQkFDM0Isa0NBQWtDO29CQUNsQywwQkFBMEI7aUJBQzdCO2FBQ0oiLCJzb3VyY2VzQ29udGVudCI6WyIvKiFcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxOSBBbGZyZXNjbyBTb2Z0d2FyZSwgTHRkLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEZvcm1zTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHtcbiAgICBNYXRCdXR0b25Nb2R1bGUsXG4gICAgTWF0RGF0ZXBpY2tlck1vZHVsZSxcbiAgICBNYXRUYWJsZU1vZHVsZSxcbiAgICBNYXRJY29uTW9kdWxlLFxuICAgIE1hdElucHV0TW9kdWxlLFxuICAgIE1hdENoZWNrYm94TW9kdWxlLFxuICAgIE1hdE5hdGl2ZURhdGVNb2R1bGUsXG4gICAgTWF0U2VsZWN0TW9kdWxlLFxuICAgIE1hdENoaXBzTW9kdWxlLFxuICAgIE1hdE1lbnVNb2R1bGUsXG4gICAgTWF0Q2FyZE1vZHVsZVxufSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbCc7XG5pbXBvcnQgeyBNYXREYXRldGltZXBpY2tlck1vZHVsZSwgTWF0TmF0aXZlRGF0ZXRpbWVNb2R1bGUgfSBmcm9tICdAbWF0LWRhdGV0aW1lcGlja2VyL2NvcmUnO1xuaW1wb3J0IHsgRmxleExheW91dE1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2ZsZXgtbGF5b3V0JztcbmltcG9ydCB7IFRyYW5zbGF0ZU1vZHVsZSB9IGZyb20gJ0BuZ3gtdHJhbnNsYXRlL2NvcmUnO1xuXG5pbXBvcnQgeyBDYXJkVmlld0NvbnRlbnRQcm94eURpcmVjdGl2ZSB9IGZyb20gJy4vZGlyZWN0aXZlcy9jYXJkLXZpZXctY29udGVudC1wcm94eS5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgQ2FyZFZpZXdDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvY2FyZC12aWV3L2NhcmQtdmlldy5jb21wb25lbnQnO1xuaW1wb3J0IHsgQ2FyZFZpZXdCb29sSXRlbUNvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy9jYXJkLXZpZXctYm9vbGl0ZW0vY2FyZC12aWV3LWJvb2xpdGVtLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBDYXJkVmlld0RhdGVJdGVtQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL2NhcmQtdmlldy1kYXRlaXRlbS9jYXJkLXZpZXctZGF0ZWl0ZW0uY29tcG9uZW50JztcbmltcG9ydCB7IENhcmRWaWV3SXRlbURpc3BhdGNoZXJDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvY2FyZC12aWV3LWl0ZW0tZGlzcGF0Y2hlci9jYXJkLXZpZXctaXRlbS1kaXNwYXRjaGVyLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBDYXJkVmlld01hcEl0ZW1Db21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvY2FyZC12aWV3LW1hcGl0ZW0vY2FyZC12aWV3LW1hcGl0ZW0uY29tcG9uZW50JztcbmltcG9ydCB7IENhcmRWaWV3VGV4dEl0ZW1Db21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvY2FyZC12aWV3LXRleHRpdGVtL2NhcmQtdmlldy10ZXh0aXRlbS5jb21wb25lbnQnO1xuaW1wb3J0IHsgQ2FyZFZpZXdLZXlWYWx1ZVBhaXJzSXRlbUNvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy9jYXJkLXZpZXcta2V5dmFsdWVwYWlyc2l0ZW0vY2FyZC12aWV3LWtleXZhbHVlcGFpcnNpdGVtLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBDYXJkVmlld1NlbGVjdEl0ZW1Db21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvY2FyZC12aWV3LXNlbGVjdGl0ZW0vY2FyZC12aWV3LXNlbGVjdGl0ZW0uY29tcG9uZW50JztcbmltcG9ydCB7IENhcmRWaWV3QXJyYXlJdGVtQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL2NhcmQtdmlldy1hcnJheWl0ZW0vY2FyZC12aWV3LWFycmF5aXRlbS5jb21wb25lbnQnO1xuXG5ATmdNb2R1bGUoe1xuICAgIGltcG9ydHM6IFtcbiAgICAgICAgQ29tbW9uTW9kdWxlLFxuICAgICAgICBGb3Jtc01vZHVsZSxcbiAgICAgICAgRmxleExheW91dE1vZHVsZSxcbiAgICAgICAgVHJhbnNsYXRlTW9kdWxlLmZvckNoaWxkKCksXG4gICAgICAgIE1hdERhdGVwaWNrZXJNb2R1bGUsXG4gICAgICAgIE1hdE5hdGl2ZURhdGVNb2R1bGUsXG4gICAgICAgIE1hdENoZWNrYm94TW9kdWxlLFxuICAgICAgICBNYXRJbnB1dE1vZHVsZSxcbiAgICAgICAgTWF0VGFibGVNb2R1bGUsXG4gICAgICAgIE1hdEljb25Nb2R1bGUsXG4gICAgICAgIE1hdFNlbGVjdE1vZHVsZSxcbiAgICAgICAgTWF0QnV0dG9uTW9kdWxlLFxuICAgICAgICBNYXRDaGlwc01vZHVsZSxcbiAgICAgICAgTWF0TWVudU1vZHVsZSxcbiAgICAgICAgTWF0Q2FyZE1vZHVsZSxcbiAgICAgICAgTWF0RGF0ZXRpbWVwaWNrZXJNb2R1bGUsXG4gICAgICAgIE1hdE5hdGl2ZURhdGV0aW1lTW9kdWxlXG4gICAgXSxcbiAgICBkZWNsYXJhdGlvbnM6IFtcbiAgICAgICAgQ2FyZFZpZXdDb21wb25lbnQsXG4gICAgICAgIENhcmRWaWV3Qm9vbEl0ZW1Db21wb25lbnQsXG4gICAgICAgIENhcmRWaWV3RGF0ZUl0ZW1Db21wb25lbnQsXG4gICAgICAgIENhcmRWaWV3TWFwSXRlbUNvbXBvbmVudCxcbiAgICAgICAgQ2FyZFZpZXdUZXh0SXRlbUNvbXBvbmVudCxcbiAgICAgICAgQ2FyZFZpZXdLZXlWYWx1ZVBhaXJzSXRlbUNvbXBvbmVudCxcbiAgICAgICAgQ2FyZFZpZXdTZWxlY3RJdGVtQ29tcG9uZW50LFxuICAgICAgICBDYXJkVmlld0l0ZW1EaXNwYXRjaGVyQ29tcG9uZW50LFxuICAgICAgICBDYXJkVmlld0NvbnRlbnRQcm94eURpcmVjdGl2ZSxcbiAgICAgICAgQ2FyZFZpZXdBcnJheUl0ZW1Db21wb25lbnRcbiAgICBdLFxuICAgIGVudHJ5Q29tcG9uZW50czogW1xuICAgICAgICBDYXJkVmlld0Jvb2xJdGVtQ29tcG9uZW50LFxuICAgICAgICBDYXJkVmlld0RhdGVJdGVtQ29tcG9uZW50LFxuICAgICAgICBDYXJkVmlld01hcEl0ZW1Db21wb25lbnQsXG4gICAgICAgIENhcmRWaWV3VGV4dEl0ZW1Db21wb25lbnQsXG4gICAgICAgIENhcmRWaWV3U2VsZWN0SXRlbUNvbXBvbmVudCxcbiAgICAgICAgQ2FyZFZpZXdLZXlWYWx1ZVBhaXJzSXRlbUNvbXBvbmVudCxcbiAgICAgICAgQ2FyZFZpZXdBcnJheUl0ZW1Db21wb25lbnRcbiAgICBdLFxuICAgIGV4cG9ydHM6IFtcbiAgICAgICAgQ2FyZFZpZXdDb21wb25lbnQsXG4gICAgICAgIENhcmRWaWV3Qm9vbEl0ZW1Db21wb25lbnQsXG4gICAgICAgIENhcmRWaWV3RGF0ZUl0ZW1Db21wb25lbnQsXG4gICAgICAgIENhcmRWaWV3TWFwSXRlbUNvbXBvbmVudCxcbiAgICAgICAgQ2FyZFZpZXdUZXh0SXRlbUNvbXBvbmVudCxcbiAgICAgICAgQ2FyZFZpZXdTZWxlY3RJdGVtQ29tcG9uZW50LFxuICAgICAgICBDYXJkVmlld0tleVZhbHVlUGFpcnNJdGVtQ29tcG9uZW50LFxuICAgICAgICBDYXJkVmlld0FycmF5SXRlbUNvbXBvbmVudFxuICAgIF1cbn0pXG5leHBvcnQgY2xhc3MgQ2FyZFZpZXdNb2R1bGUge31cbiJdfQ==
