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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from '../material.module';
import { LoginComponent } from './components/login.component';
import { LoginFooterDirective } from './directives/login-footer.directive';
import { LoginHeaderDirective } from './directives/login-header.directive';
import { LoginDialogComponent } from './components/login-dialog.component';
import { LoginDialogPanelComponent } from './components/login-dialog-panel.component';
export class LoginModule {}
LoginModule.decorators = [
  {
    type: NgModule,
    args: [
      {
        imports: [
          RouterModule,
          MaterialModule,
          FormsModule,
          ReactiveFormsModule,
          CommonModule,
          TranslateModule.forChild()
        ],
        declarations: [
          LoginComponent,
          LoginFooterDirective,
          LoginHeaderDirective,
          LoginDialogComponent,
          LoginDialogPanelComponent
        ],
        entryComponents: [LoginDialogComponent, LoginDialogPanelComponent],
        exports: [
          LoginComponent,
          LoginFooterDirective,
          LoginHeaderDirective,
          LoginDialogComponent,
          LoginDialogPanelComponent
        ]
      }
    ]
  }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9naW4ubW9kdWxlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQGFsZnJlc2NvL2FkZi1jb3JlLyIsInNvdXJjZXMiOlsibG9naW4vbG9naW4ubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBaUJBLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBRSxXQUFXLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUNsRSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDL0MsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQ3RELE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUVwRCxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sOEJBQThCLENBQUM7QUFDOUQsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0scUNBQXFDLENBQUM7QUFDM0UsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0scUNBQXFDLENBQUM7QUFDM0UsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0scUNBQXFDLENBQUM7QUFDM0UsT0FBTyxFQUFFLHlCQUF5QixFQUFFLE1BQU0sMkNBQTJDLENBQUM7QUEyQnRGLE1BQU0sT0FBTyxXQUFXOzs7WUF6QnZCLFFBQVEsU0FBQztnQkFDTixPQUFPLEVBQUU7b0JBQ0wsWUFBWTtvQkFDWixjQUFjO29CQUNkLFdBQVc7b0JBQ1gsbUJBQW1CO29CQUNuQixZQUFZO29CQUNaLGVBQWUsQ0FBQyxRQUFRLEVBQUU7aUJBQzdCO2dCQUNELFlBQVksRUFBRTtvQkFDVixjQUFjO29CQUNkLG9CQUFvQjtvQkFDcEIsb0JBQW9CO29CQUNwQixvQkFBb0I7b0JBQ3BCLHlCQUF5QjtpQkFDNUI7Z0JBQ0QsZUFBZSxFQUFFLENBQUMsb0JBQW9CLEVBQUUseUJBQXlCLENBQUM7Z0JBQ2xFLE9BQU8sRUFBRTtvQkFDTCxjQUFjO29CQUNkLG9CQUFvQjtvQkFDcEIsb0JBQW9CO29CQUNwQixvQkFBb0I7b0JBQ3BCLHlCQUF5QjtpQkFDNUI7YUFDSiIsInNvdXJjZXNDb250ZW50IjpbIi8qIVxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE5IEFsZnJlc2NvIFNvZnR3YXJlLCBMdGQuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRm9ybXNNb2R1bGUsIFJlYWN0aXZlRm9ybXNNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgeyBSb3V0ZXJNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuaW1wb3J0IHsgVHJhbnNsYXRlTW9kdWxlIH0gZnJvbSAnQG5neC10cmFuc2xhdGUvY29yZSc7XG5pbXBvcnQgeyBNYXRlcmlhbE1vZHVsZSB9IGZyb20gJy4uL21hdGVyaWFsLm1vZHVsZSc7XG5cbmltcG9ydCB7IExvZ2luQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL2xvZ2luLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBMb2dpbkZvb3RlckRpcmVjdGl2ZSB9IGZyb20gJy4vZGlyZWN0aXZlcy9sb2dpbi1mb290ZXIuZGlyZWN0aXZlJztcbmltcG9ydCB7IExvZ2luSGVhZGVyRGlyZWN0aXZlIH0gZnJvbSAnLi9kaXJlY3RpdmVzL2xvZ2luLWhlYWRlci5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgTG9naW5EaWFsb2dDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvbG9naW4tZGlhbG9nLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBMb2dpbkRpYWxvZ1BhbmVsQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL2xvZ2luLWRpYWxvZy1wYW5lbC5jb21wb25lbnQnO1xuXG5ATmdNb2R1bGUoe1xuICAgIGltcG9ydHM6IFtcbiAgICAgICAgUm91dGVyTW9kdWxlLFxuICAgICAgICBNYXRlcmlhbE1vZHVsZSxcbiAgICAgICAgRm9ybXNNb2R1bGUsXG4gICAgICAgIFJlYWN0aXZlRm9ybXNNb2R1bGUsXG4gICAgICAgIENvbW1vbk1vZHVsZSxcbiAgICAgICAgVHJhbnNsYXRlTW9kdWxlLmZvckNoaWxkKClcbiAgICBdLFxuICAgIGRlY2xhcmF0aW9uczogW1xuICAgICAgICBMb2dpbkNvbXBvbmVudCxcbiAgICAgICAgTG9naW5Gb290ZXJEaXJlY3RpdmUsXG4gICAgICAgIExvZ2luSGVhZGVyRGlyZWN0aXZlLFxuICAgICAgICBMb2dpbkRpYWxvZ0NvbXBvbmVudCxcbiAgICAgICAgTG9naW5EaWFsb2dQYW5lbENvbXBvbmVudFxuICAgIF0sXG4gICAgZW50cnlDb21wb25lbnRzOiBbTG9naW5EaWFsb2dDb21wb25lbnQsIExvZ2luRGlhbG9nUGFuZWxDb21wb25lbnRdLFxuICAgIGV4cG9ydHM6IFtcbiAgICAgICAgTG9naW5Db21wb25lbnQsXG4gICAgICAgIExvZ2luRm9vdGVyRGlyZWN0aXZlLFxuICAgICAgICBMb2dpbkhlYWRlckRpcmVjdGl2ZSxcbiAgICAgICAgTG9naW5EaWFsb2dDb21wb25lbnQsXG4gICAgICAgIExvZ2luRGlhbG9nUGFuZWxDb21wb25lbnRcbiAgICBdXG59KVxuZXhwb3J0IGNsYXNzIExvZ2luTW9kdWxlIHtcbn1cbiJdfQ==
